-- Drop old tables and dependencies
DROP TABLE IF EXISTS habit_logs CASCADE;
DROP TABLE IF EXISTS habits CASCADE;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE habit_frequency AS ENUM ('daily', 'weekly', 'specific_days', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Core habit tracking with temporal support
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    frequency_type habit_frequency NOT NULL,
    frequency_config JSONB NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    icon VARCHAR(50) DEFAULT 'target',
    target_duration INTEGER,
    reminder_time TIME[],
    timezone TEXT DEFAULT 'UTC',
    archived_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Efficient time-series tracking (partitioned by month)
CREATE TABLE habit_completions (
    id UUID DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_date DATE NOT NULL,
    duration INTEGER,
    notes TEXT,
    mood_score INTEGER CHECK (mood_score IS NULL OR mood_score BETWEEN 1 AND 5),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (id, completed_date)
) PARTITION BY RANGE (completed_date);

-- Create initial partitions
CREATE TABLE habit_completions_y2024m11 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2024-11-01') TO ('2024-12-01');

CREATE TABLE habit_completions_y2024m12 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

CREATE TABLE habit_completions_y2025m01 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE habit_completions_y2025m02 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

CREATE TABLE habit_completions_y2025m03 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

CREATE TABLE habit_completions_y2025m04 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-04-01') TO ('2025-05-01');

-- Function to auto-create future partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    partition_date DATE := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '2 months');
    partition_name TEXT := 'habit_completions_y' || TO_CHAR(partition_date, 'YYYY') || 'm' || LPAD(TO_CHAR(partition_date, 'MM'), 2, '0');
    next_month DATE := partition_date + INTERVAL '1 month';
BEGIN
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF habit_completions FOR VALUES FROM (%L) TO (%L)',
        partition_name, partition_date, next_month
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule monthly partition creation
SELECT cron.schedule('create-partitions', '0 0 * * *', 'SELECT create_monthly_partition()');

-- Streak calculation materialized view
CREATE MATERIALIZED VIEW user_streaks AS
WITH streak_calc AS (
    SELECT 
        habit_id,
        user_id,
        completed_date,
        completed_date - (ROW_NUMBER() OVER (PARTITION BY habit_id ORDER BY completed_date))::int AS streak_group
    FROM habit_completions
    WHERE completed_date >= CURRENT_DATE - INTERVAL '365 days'
)
SELECT 
    habit_id,
    user_id,
    COUNT(*) as current_streak,
    MIN(completed_date) as streak_start,
    MAX(completed_date) as last_completed
FROM streak_calc
GROUP BY habit_id, user_id, streak_group
HAVING MAX(completed_date) >= CURRENT_DATE - INTERVAL '1 day';

-- Create unique index for concurrent refresh
CREATE UNIQUE INDEX idx_user_streaks_unique ON user_streaks(habit_id, user_id);

-- Schedule hourly streak refresh
SELECT cron.schedule('refresh-streaks', '0 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY user_streaks');

-- Performance indexes
CREATE INDEX idx_completions_lookup ON habit_completions(habit_id, completed_date DESC);
CREATE INDEX idx_completions_user ON habit_completions(user_id, completed_date DESC);
CREATE INDEX idx_habits_user_active ON habits(user_id) WHERE archived_at IS NULL;
CREATE INDEX idx_habits_user_all ON habits(user_id, created_at DESC);
CREATE UNIQUE INDEX idx_unique_completion ON habit_completions(habit_id, user_id, completed_date);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for habit_completions
CREATE POLICY "Users can view own completions" ON habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own completions" ON habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completions" ON habit_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completions" ON habit_completions FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for habits table
CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-set completed_date from completed_at
CREATE OR REPLACE FUNCTION set_completed_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.completed_date IS NULL THEN
        NEW.completed_date := DATE(NEW.completed_at);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for habit_completions
CREATE TRIGGER set_completion_date BEFORE INSERT ON habit_completions FOR EACH ROW EXECUTE FUNCTION set_completed_date();

-- Helper function to get current streak for a habit
CREATE OR REPLACE FUNCTION get_current_streak(p_habit_id UUID)
RETURNS INTEGER AS $$
DECLARE
    streak_count INTEGER;
BEGIN
    SELECT COALESCE(current_streak, 0) INTO streak_count FROM user_streaks WHERE habit_id = p_habit_id;
    RETURN COALESCE(streak_count, 0);
END;
$$ LANGUAGE plpgsql;

-- Helper function to get habit completion rate
CREATE OR REPLACE FUNCTION get_completion_rate(p_habit_id UUID, days INTEGER DEFAULT 30)
RETURNS NUMERIC AS $$
DECLARE
    completion_rate NUMERIC;
BEGIN
    SELECT ROUND((COUNT(*)::NUMERIC / days) * 100, 2) INTO completion_rate
    FROM habit_completions WHERE habit_id = p_habit_id AND completed_date >= CURRENT_DATE - days;
    RETURN COALESCE(completion_rate, 0);
END;
$$ LANGUAGE plpgsql;

import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            // If it's an opening bracket, push it
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } 
            // If it's a closing bracket
            else {
                // Stack can't be empty if we have a closing bracket
                if (stack.isEmpty()) return false;
                
                char top = stack.pop();
                // Check for mismatch
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        
        // If stack is empty, all brackets were matched correctly
        return stack.isEmpty();
    }
}
