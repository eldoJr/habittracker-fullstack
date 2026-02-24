-- Create schedule_events table for daily activities
CREATE TABLE IF NOT EXISTS schedule_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'school', 'exam', 'gym', 'meeting', 'other'
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER,
    days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
    color VARCHAR(7) DEFAULT '#000000',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own schedule" ON schedule_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule" ON schedule_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule" ON schedule_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule" ON schedule_events
    FOR DELETE USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_schedule_events_user ON schedule_events(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_time ON schedule_events(start_time);

-- Trigger for updated_at
CREATE TRIGGER update_schedule_events_updated_at
    BEFORE UPDATE ON schedule_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
