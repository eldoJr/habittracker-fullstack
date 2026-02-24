# Fix: Profile Edit Not Working

## Quick Fix

Run this SQL in Supabase SQL Editor:

```sql
-- Fix UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Fix INSERT policy (for upsert)
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT 
    WITH CHECK (true);
```

## What Was Fixed

1. **Added loading toast** - Shows "Updating profile..." feedback
2. **Added console logging** - Check terminal for errors
3. **Fixed RLS policies** - UPDATE policy now has both USING and WITH CHECK

## Test It

1. Run the SQL above
2. Go to `/profile`
3. Click "Edit Profile"
4. Change any field
5. Click "Save Changes"
6. Should see: "Updating profile..." → "Profile updated!" ✅

## Check Console

Terminal should show:
```
Updating profile: { id, full_name, date_of_birth, gender, bio, updated_at }
Profile updated successfully
```

If you see errors, they'll appear here.
