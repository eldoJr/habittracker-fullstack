-- Check existing partitions
SELECT tablename FROM pg_tables WHERE tablename LIKE 'habit_completions%' ORDER BY tablename;

-- Drop and recreate all partitions for 2024-2025
DROP TABLE IF EXISTS habit_completions_y2024m12 CASCADE;
DROP TABLE IF EXISTS habit_completions_y2025m01 CASCADE;

-- Create December 2024 partition
CREATE TABLE habit_completions_y2024m12 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2024-12-01') TO ('2025-01-01');

-- Create January 2025 partition
CREATE TABLE habit_completions_y2025m01 
    PARTITION OF habit_completions
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Verify partitions
SELECT 
    schemaname,
    tablename,
    pg_get_expr(c.relpartbound, c.oid) as partition_bounds
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_tables t ON c.relname = t.tablename
WHERE c.relispartition
    AND t.tablename LIKE 'habit_completions%'
ORDER BY tablename;
