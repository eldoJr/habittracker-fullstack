import { createClient } from '@/lib/supabase/server'

export async function getTodaySchedule() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const today = new Date().getDay() || 7 // Convert Sunday=0 to 7
  
  const { data, error } = await supabase
    .from('schedule_events')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .contains('days_of_week', [today])
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Schedule fetch error:', error)
    return []
  }

  return data || []
}

export async function getWeekSchedule() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data, error } = await supabase
    .from('schedule_events')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('start_time', { ascending: true })

  if (error) return []
  return data || []
}
