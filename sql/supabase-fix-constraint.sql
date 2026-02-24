-- Quick fix: Update mood_score constraint to allow NULL on all partitions
ALTER TABLE habit_completions DROP CONSTRAINT IF EXISTS habit_completions_mood_score_check;
ALTER TABLE habit_completions_y2024m11 DROP CONSTRAINT IF EXISTS habit_completions_y2024m11_mood_score_check;
ALTER TABLE habit_completions_y2024m12 DROP CONSTRAINT IF EXISTS habit_completions_y2024m12_mood_score_check;
ALTER TABLE habit_completions_y2025m01 DROP CONSTRAINT IF EXISTS habit_completions_y2025m01_mood_score_check;
ALTER TABLE habit_completions_y2025m02 DROP CONSTRAINT IF EXISTS habit_completions_y2025m02_mood_score_check;
ALTER TABLE habit_completions_y2025m03 DROP CONSTRAINT IF EXISTS habit_completions_y2025m03_mood_score_check;
ALTER TABLE habit_completions_y2025m04 DROP CONSTRAINT IF EXISTS habit_completions_y2025m04_mood_score_check;

ALTER TABLE habit_completions ADD CONSTRAINT habit_completions_mood_score_check 
  CHECK (mood_score IS NULL OR (mood_score >= 1 AND mood_score <= 5));
