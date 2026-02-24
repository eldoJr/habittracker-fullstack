-- Fix: No partition found for habit_completions
-- This creates a default partition to catch all rows

-- Create default partition if it doesn't exist
CREATE TABLE IF NOT EXISTS habit_completions_default PARTITION OF habit_completions DEFAULT;

-- Or create current month partition
DO $$
DECLARE
    partition_date DATE := DATE_TRUNC('month', CURRENT_DATE);
    partition_name TEXT := 'habit_completions_' || TO_CHAR(partition_date, 'YYYY_MM');
    start_date DATE := partition_date;
    end_date DATE := partition_date + INTERVAL '1 month';
BEGIN
    -- Check if partition exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = partition_name
    ) THEN
        -- Create partition for current month
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF habit_completions 
            FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END IF;
END $$;

-- Create next month partition
DO $$
DECLARE
    partition_date DATE := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');
    partition_name TEXT := 'habit_completions_' || TO_CHAR(partition_date, 'YYYY_MM');
    start_date DATE := partition_date;
    end_date DATE := partition_date + INTERVAL '1 month';
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = partition_name
    ) THEN
        EXECUTE format(
            'CREATE TABLE %I PARTITION OF habit_completions 
            FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END IF;
END $$;
