-- Create habit_templates table
CREATE TABLE IF NOT EXISTS habit_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  habits JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default templates
INSERT INTO habit_templates (name, description, category, icon, color, habits) VALUES
('Morning Routine', 'Start your day with intention and energy', 'Wellness', 'sun', '#F59E0B', 
  '["Morning meditation", "Drink water", "Exercise", "Healthy breakfast"]'::jsonb),
('Fitness Journey', 'Build strength and endurance consistently', 'Health', 'dumbbell', '#EF4444',
  '["30 min workout", "Track calories", "Stretch", "Protein intake"]'::jsonb),
('Learning Path', 'Expand your knowledge every day', 'Growth', 'book', '#3B82F6',
  '["Read 20 pages", "Online course", "Practice skill", "Take notes"]'::jsonb),
('Mindfulness', 'Cultivate peace and mental clarity', 'Mental', 'brain', '#8B5CF6',
  '["Meditation", "Gratitude journal", "Deep breathing", "Digital detox"]'::jsonb),
('Productivity Boost', 'Maximize your daily output', 'Work', 'zap', '#10B981',
  '["Plan day", "Focus blocks", "Review tasks", "Limit distractions"]'::jsonb),
('Sleep Hygiene', 'Optimize your rest and recovery', 'Wellness', 'moon', '#6366F1',
  '["No screens 1hr before bed", "Read before sleep", "Cool room", "Consistent bedtime"]'::jsonb);

-- Enable RLS
ALTER TABLE habit_templates ENABLE ROW LEVEL SECURITY;

-- Public read access for templates
CREATE POLICY "Templates are viewable by everyone"
  ON habit_templates FOR SELECT
  USING (true);
