-- Add December 2024 partition (current month)
CREATE TABLE IF NOT EXISTS habit_completions_y2024m12 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Add January 2025 partition
CREATE TABLE IF NOT EXISTS habit_completions_y2025m01 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
