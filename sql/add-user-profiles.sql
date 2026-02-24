-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate age
CREATE OR REPLACE FUNCTION get_user_age(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    user_age INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM AGE(date_of_birth))::INTEGER
    INTO user_age
    FROM user_profiles
    WHERE id = user_id;
    
    RETURN user_age;
END;
$$ LANGUAGE plpgsql;

-- Index for performance
CREATE INDEX idx_user_profiles_user ON user_profiles(id);
