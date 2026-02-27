'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionResult = {
  success: boolean
  message: string
  error?: string
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const dateOfBirth = formData.get('dateOfBirth') as string
  const gender = formData.get('gender') as string
  const timezone = formData.get('timezone') as string

  console.log('Signup data:', { email, fullName, dateOfBirth, gender, timezone })

  if (!email || !password || !fullName) {
    return { success: false, message: 'Please fill in all required fields', error: 'VALIDATION_ERROR' }
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters', error: 'WEAK_PASSWORD' }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (authError) {
    console.error('Auth error:', authError)
    if (authError.message.includes('already registered')) {
      return { success: false, message: 'This email is already registered', error: 'EMAIL_EXISTS' }
    }
    return { success: false, message: authError.message, error: 'AUTH_ERROR' }
  }

  if (authData.user) {
    const profileData = {
      id: authData.user.id,
      full_name: fullName,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      timezone: timezone || 'UTC',
    }
    
    console.log('Creating profile with:', profileData)
    
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert(profileData)

    if (profileError) {
      console.error('Profile creation error:', profileError)
    } else {
      console.log('Profile created successfully')
    }
  }

  // Check if email confirmation is required
  if (authData.user && !authData.session) {
    return { 
      success: true, 
      message: 'Account created! Please check your email to verify your account.',
      error: 'EMAIL_CONFIRMATION_REQUIRED'
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function resetPassword(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient()
  const email = formData.get('email') as string

  if (!email) {
    return { success: false, message: 'Email is required', error: 'VALIDATION_ERROR' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  })

  if (error) {
    return { success: false, message: error.message, error: 'RESET_ERROR' }
  }

  return { success: true, message: 'Password reset email sent! Check your inbox.' }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
