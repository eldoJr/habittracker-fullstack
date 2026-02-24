'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createScheduleEvent(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { success: false, error: 'Not authenticated' }

  const title = formData.get('title') as string
  const eventType = formData.get('eventType') as string
  const startTime = formData.get('startTime') as string
  const endTime = formData.get('endTime') as string
  const daysOfWeek = formData.get('daysOfWeek') as string
  const color = formData.get('color') as string

  const { error } = await supabase
    .from('schedule_events')
    .insert({
      user_id: user.id,
      title,
      event_type: eventType,
      start_time: startTime,
      end_time: endTime || null,
      days_of_week: daysOfWeek ? JSON.parse(daysOfWeek) : [1,2,3,4,5,6,7],
      color: color || '#000000',
    })

  if (error) {
    console.error('Create schedule error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteScheduleEvent(eventId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('schedule_events')
    .delete()
    .eq('id', eventId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/')
  return { success: true }
}
