# Fix: Profile Data Not Saving to Database

## Problem
Only email and password are being saved. Profile fields (full_name, date_of_birth, gender, timezone) are not being saved to user_profiles table.

## Root Cause
The RLS (Row Level Security) policy on user_profiles table is too restrictive during signup. The INSERT policy requires `auth.uid() = id`, but during signup, the user isn't fully authenticated yet.

## Solution

### Step 1: Fix RLS Policy in Supabase

Run this SQL in your Supabase SQL Editor:

```sql
-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create a new policy that allows insert during signup
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (true);
```

**Why this works:** During signup, the server action runs with elevated privileges and needs to insert the profile before the user session is fully established.

### Step 2: Verify the Fix

After running the SQL, test the registration:

1. Go to `/register`
2. Fill in all fields including:
   - Full Name
   - Email
   - Password
   - Date of Birth (optional)
   - Gender (optional)
3. Complete registration
4. Check Supabase dashboard → Table Editor → user_profiles
5. Verify all fields are saved

### Step 3: Check Console Logs

The auth action now includes console.log statements. Check your terminal for:

```
Signup data: { email, fullName, dateOfBirth, gender, timezone }
Creating profile with: { id, full_name, date_of_birth, gender, timezone }
Profile created successfully
```

If you see errors, they'll appear here.

## Alternative Solution (If Above Doesn't Work)

If the RLS policy change doesn't work, you can use a database function with SECURITY DEFINER:

```sql
-- Create a function that bypasses RLS
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  p_full_name VARCHAR(100),
  p_date_of_birth DATE,
  p_gender VARCHAR(20),
  p_timezone VARCHAR(50)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, date_of_birth, gender, timezone)
  VALUES (user_id, p_full_name, p_date_of_birth, p_gender, p_timezone);
END;
$$;
```

Then update the auth action to use this function:

```typescript
// In lib/actions/auth.ts
const { error: profileError } = await supabase.rpc('create_user_profile', {
  user_id: authData.user.id,
  p_full_name: fullName,
  p_date_of_birth: dateOfBirth || null,
  p_gender: gender || null,
  p_timezone: timezone || 'UTC',
})
```

## Verification Checklist

- [ ] RLS policy updated in Supabase
- [ ] Registration form submits successfully
- [ ] Console shows "Profile created successfully"
- [ ] user_profiles table shows all fields in Supabase dashboard
- [ ] No errors in browser console
- [ ] No errors in terminal

## Common Issues

### Issue 1: "new row violates row-level security policy"
**Solution:** Run the RLS policy fix SQL above

### Issue 2: "null value in column 'id' violates not-null constraint"
**Solution:** Check that authData.user.id exists before inserting

### Issue 3: Fields are empty strings instead of null
**Solution:** Already fixed in the code - empty strings are converted to null

### Issue 4: Timezone not saving
**Solution:** Check that timezone is being passed correctly from the form

## Testing After Fix

1. **Create a new account** with all fields filled
2. **Check Supabase** → Authentication → Users → Click user → User Metadata
   - Should see: `{ "full_name": "John Doe" }`
3. **Check Supabase** → Table Editor → user_profiles
   - Should see: full_name, date_of_birth, gender, timezone all populated

## Quick SQL to Check Data

```sql
-- See all user profiles with their data
SELECT 
  up.id,
  up.full_name,
  up.date_of_birth,
  up.gender,
  up.timezone,
  up.created_at,
  au.email
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
ORDER BY up.created_at DESC;
```

## Status
✅ Code updated with better logging
✅ FormData properly constructed
✅ SQL fix provided
⏳ Waiting for RLS policy update in Supabase

## Next Steps
1. Run the SQL fix in Supabase SQL Editor
2. Test registration with all fields
3. Verify data in Supabase dashboard
4. Remove console.log statements after confirming it works
