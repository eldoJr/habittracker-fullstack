import { createClient } from '@/lib/supabase/server'

export async function getHabits() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .is('archived_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getHabit(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getHabitCompletions(habitId: string, days: number = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .gte('completed_date', startDate.toISOString().split('T')[0])
    .order('completed_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getHabitStreak(habitId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('habit_id', habitId)
    .single()

  if (error) return null
  return data
}

export async function getHabitStats(habitId: string) {
  const supabase = await createClient()
  
  const { data: streak } = await supabase
    .rpc('get_current_streak', { p_habit_id: habitId })

  const { data: rate } = await supabase
    .rpc('get_completion_rate', { p_habit_id: habitId, days: 30 })

  return {
    currentStreak: streak || 0,
    completionRate: rate || 0,
  }
}

export async function getTodayCompletions() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('habit_completions')
    .select('habit_id')
    .eq('completed_date', today)

  if (error) throw error
  return data.map(c => c.habit_id)
}
