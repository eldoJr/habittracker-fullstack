# Auth UI/UX Testing Guide

## 🧪 How to Test the Improvements

### Prerequisites
```bash
# Make sure dev server is running
npm run dev

# Open browser to http://localhost:3000
```

---

## 1️⃣ Login Page Testing

### Test Case 1: Successful Login
1. Navigate to `/login`
2. Enter valid email and password
3. Click "Sign In"
4. **Expected:**
   - Toast appears: "Signing in..."
   - Toast changes to: "Welcome back!" (green with checkmark)
   - Redirects to dashboard

### Test Case 2: Invalid Credentials
1. Navigate to `/login`
2. Enter wrong email or password
3. Click "Sign In"
4. **Expected:**
   - Toast appears: "Signing in..."
   - Toast changes to: "Invalid email or password" (red with alert icon)
   - Stays on login page

### Test Case 3: Empty Fields
1. Navigate to `/login`
2. Leave fields empty
3. Click "Sign In"
4. **Expected:**
   - Browser validation shows "Please fill out this field"

### Test Case 4: Forgot Password
1. Navigate to `/login`
2. Click "Forgot password?"
3. **Expected:**
   - Page changes to password reset form
   - Shows email input field
   - Shows "Back" and "Send Reset Link" buttons

### Test Case 5: Password Reset Email
1. On forgot password page
2. Enter valid email
3. Click "Send Reset Link"
4. **Expected:**
   - Toast: "Sending reset email..."
   - Toast: "Password reset email sent! Check your inbox." (5 seconds)
   - Returns to login page
   - Check email for reset link

### Test Case 6: Visual Elements
1. Navigate to `/login`
2. **Check:**
   - ✅ Email field has mail icon
   - ✅ Password field has lock icon
   - ✅ Gradient background
   - ✅ Shadow on card
   - ✅ Terms & Privacy text at bottom

---

## 2️⃣ Registration Page Testing

### Test Case 1: Step 1 - Account Creation
1. Navigate to `/register`
2. **Check:**
   - ✅ Progress bar shows step 1 of 3
   - ✅ Step 1 is highlighted (black circle)
   - ✅ Description: "Create your account"
   - ✅ All fields have icons (User, Mail, Lock)

### Test Case 2: Step 1 - Validation
1. Fill in name: "John Doe"
2. Fill in email: "invalid-email"
3. Fill in password: "123"
4. Fill in confirm: "456"
5. Click "Continue"
6. **Expected:**
   - ❌ Error under email: "Invalid email format"
   - ❌ Error under password: "Password must be at least 6 characters"
   - ❌ Error under confirm: "Passwords do not match"
   - Toast: "Please fix the errors before continuing"

### Test Case 3: Step 1 - Success
1. Fill in valid data:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm: "password123"
2. Click "Continue"
3. **Expected:**
   - ✅ Smooth animation to step 2
   - ✅ Progress bar updates (step 1 has checkmark)
   - ✅ Step 2 is now highlighted

### Test Case 4: Step 2 - Profile Info
1. On step 2
2. **Check:**
   - ✅ Date of birth field (optional)
   - ✅ Gender dropdown (optional)
   - ✅ Info box explaining purpose
   - ✅ "Back" and "Continue" buttons

### Test Case 5: Step 2 - Navigation
1. Fill in optional data or skip
2. Click "Continue"
3. **Expected:**
   - ✅ Smooth animation to step 3
   - ✅ Progress bar updates (step 2 has checkmark)

### Test Case 6: Step 3 - Review
1. On step 3
2. **Check:**
   - ✅ Shows all entered information
   - ✅ Name, email displayed correctly
   - ✅ Optional fields shown if filled
   - ✅ Timezone auto-detected
   - ✅ Green confirmation box
   - ✅ "Back" and "Create Account" buttons

### Test Case 7: Step 3 - Back Navigation
1. Click "Back" button
2. **Expected:**
   - ✅ Returns to step 2
   - ✅ Data is preserved
   - ✅ Can navigate back to step 1
   - ✅ All data still there

### Test Case 8: Account Creation - Success
1. On step 3
2. Click "Create Account"
3. **Expected:**
   - Toast: "Creating your account..."
   - One of two outcomes:
     - **With email confirmation:**
       - Toast: "Account created! Please check your email to verify your account." (6 seconds, mail icon)
     - **Without email confirmation:**
       - Toast: "Account created successfully!" (checkmark icon)
       - Redirects to dashboard

### Test Case 9: Account Creation - Email Exists
1. Try to register with existing email
2. **Expected:**
   - Toast: "This email is already registered" (red, alert icon)
   - Stays on registration page

---

## 3️⃣ Password Reset Flow Testing

### Test Case 1: Reset Email Sent
1. Complete "Forgot Password" flow from login
2. Check email inbox
3. **Expected:**
   - Email from Supabase with reset link
   - Link format: `http://localhost:3000/auth/reset-password?token=...`

### Test Case 2: Reset Password Page
1. Click reset link from email
2. **Expected:**
   - Redirects to `/auth/reset-password`
   - Shows "Reset Password" title
   - Two password fields (New Password, Confirm Password)
   - Both have lock icons

### Test Case 3: Password Mismatch
1. On reset password page
2. Enter different passwords
3. Click "Update Password"
4. **Expected:**
   - Toast: "Passwords do not match" (red)

### Test Case 4: Weak Password
1. Enter password less than 6 characters
2. Click "Update Password"
3. **Expected:**
   - Toast: "Password must be at least 6 characters" (red)

### Test Case 5: Successful Reset
1. Enter matching passwords (6+ characters)
2. Click "Update Password"
3. **Expected:**
   - Toast: "Updating password..."
   - Toast: "Password updated successfully!" (green, checkmark)
   - Redirects to dashboard after 1.5 seconds

---

## 4️⃣ Email Verification Testing

### Test Case 1: Registration with Email Confirmation
1. Register new account
2. **Expected:**
   - Toast: "Account created! Please check your email to verify your account."
   - Check email for verification link

### Test Case 2: Click Verification Link
1. Click verification link from email
2. **Expected:**
   - Redirects to `/auth/callback?code=...`
   - Automatically processes verification
   - Redirects to dashboard
   - User is logged in

### Test Case 3: Login Before Verification
1. Register account (email confirmation required)
2. Try to login before verifying
3. **Expected:**
   - Toast: "Please verify your email first" (red)

---

## 5️⃣ Visual & UX Testing

### Test Case 1: Icons
1. Check all input fields
2. **Expected:**
   - ✅ Email fields have mail icon
   - ✅ Password fields have lock icon
   - ✅ Name field has user icon
   - ✅ Date field has calendar icon
   - ✅ Icons are left-aligned
   - ✅ Icons are gray-400 color

### Test Case 2: Animations
1. Navigate through registration steps
2. **Expected:**
   - ✅ Smooth slide animations
   - ✅ Progress bar animates
   - ✅ Checkmarks appear smoothly
   - ✅ No janky movements

### Test Case 3: Loading States
1. Submit any form
2. **Expected:**
   - ✅ Button shows loading text
   - ✅ Button is disabled
   - ✅ Toast shows loading spinner
   - ✅ Can't submit again

### Test Case 4: Error States
1. Trigger validation errors
2. **Expected:**
   - ✅ Red border on input
   - ✅ Red error text below
   - ✅ Warning emoji in error
   - ✅ Error clears when typing

### Test Case 5: Focus States
1. Tab through form fields
2. **Expected:**
   - ✅ Gray-900 ring on focus
   - ✅ Clear visual indicator
   - ✅ Smooth transition

---

## 6️⃣ Mobile Testing

### Test Case 1: Responsive Layout
1. Open on mobile device or resize browser
2. **Expected:**
   - ✅ Form fits screen width
   - ✅ Buttons are touch-friendly
   - ✅ Text is readable
   - ✅ No horizontal scroll

### Test Case 2: Mobile Keyboard
1. Focus on input field
2. **Expected:**
   - ✅ Keyboard appears
   - ✅ Form scrolls to show field
   - ✅ Toast appears above keyboard

### Test Case 3: Touch Interactions
1. Tap buttons and links
2. **Expected:**
   - ✅ Immediate response
   - ✅ No double-tap needed
   - ✅ Smooth animations

---

## 7️⃣ Accessibility Testing

### Test Case 1: Keyboard Navigation
1. Use only keyboard (Tab, Enter, Escape)
2. **Expected:**
   - ✅ Can navigate all fields
   - ✅ Can submit forms
   - ✅ Can click links
   - ✅ Focus is visible

### Test Case 2: Screen Reader
1. Use screen reader (if available)
2. **Expected:**
   - ✅ Labels are announced
   - ✅ Errors are announced
   - ✅ Button states are clear

### Test Case 3: Color Contrast
1. Check text readability
2. **Expected:**
   - ✅ All text meets WCAG standards
   - ✅ Error text is readable
   - ✅ Placeholder text is visible

---

## 🐛 Common Issues & Solutions

### Issue 1: Toast Not Appearing
**Solution:** Check that ToastProvider is in root layout

### Issue 2: Redirect Not Working
**Solution:** Check Supabase credentials in `.env.local`

### Issue 3: Email Not Sending
**Solution:** Check Supabase email settings in dashboard

### Issue 4: Icons Not Showing
**Solution:** Verify `lucide-react` is installed

### Issue 5: Animations Janky
**Solution:** Check `framer-motion` is installed

---

## ✅ Testing Checklist

### Login Page
- [ ] Successful login works
- [ ] Invalid credentials show error
- [ ] Forgot password opens modal
- [ ] Reset email sends successfully
- [ ] Icons appear in all fields
- [ ] Toast notifications work

### Registration Page
- [ ] Step 1 validation works
- [ ] Password confirmation works
- [ ] Step 2 optional fields work
- [ ] Step 3 review shows data
- [ ] Back navigation preserves data
- [ ] Account creation succeeds
- [ ] Email exists error works
- [ ] Progress bar animates

### Password Reset
- [ ] Email link works
- [ ] Reset page loads
- [ ] Password validation works
- [ ] Successful reset redirects

### Email Verification
- [ ] Verification email sends
- [ ] Verification link works
- [ ] Auto-login after verification

### Visual & UX
- [ ] All icons appear
- [ ] Animations are smooth
- [ ] Loading states work
- [ ] Error states work
- [ ] Focus states visible

### Mobile
- [ ] Responsive layout
- [ ] Touch-friendly
- [ ] Keyboard works

### Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader friendly
- [ ] Color contrast good

---

## 📊 Expected Results Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Login | ✅ | All scenarios covered |
| Registration | ✅ | Multi-step with validation |
| Password Reset | ✅ | Complete flow |
| Email Verification | ✅ | Auto-handled |
| Toast Notifications | ✅ | All actions |
| Icons | ✅ | All inputs |
| Animations | ✅ | Smooth transitions |
| Mobile | ✅ | Fully responsive |
| Accessibility | ✅ | WCAG compliant |

---

**Testing Status**: Ready for QA ✅
**Estimated Testing Time**: 30-45 minutes for full suite
