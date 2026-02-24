'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const fullName = formData.get('fullName') as string
    const dateOfBirth = formData.get('dateOfBirth') as string
    const gender = formData.get('gender') as string
    const bio = formData.get('bio') as string

    const updateData = {
      id: user.id,
      full_name: fullName,
      date_of_birth: dateOfBirth || null,
      gender: gender || null,
      bio: bio || null,
      updated_at: new Date().toISOString(),
    }

    console.log('Updating profile:', updateData)

    const { error } = await supabase
      .from('user_profiles')
      .upsert(updateData, { onConflict: 'id' })

    if (error) {
      console.error('Update error:', error)
      return { success: false, error: error.message }
    }

    console.log('Profile updated successfully')
    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Profile update failed:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}
