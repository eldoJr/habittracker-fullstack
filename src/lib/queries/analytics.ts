import { createClient } from '@/lib/supabase/server'

export async function getUserStats() {
  const supabase = await createClient()
  
  const { data: streaks } = await supabase
    .from('user_streaks')
    .select('current_streak')

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('id')

  const currentStreak = Math.max(...(streaks?.map(s => s.current_streak) || [0]))
  const totalPoints = completions?.length || 0

  return {
    currentStreak,
    totalPoints,
  }
}

export async function getDashboardStats() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: habits } = await supabase
    .from('habits')
    .select('id')
    .is('archived_at', null)

  const { data: todayCompletions } = await supabase
    .from('habit_completions')
    .select('id')
    .eq('completed_date', today)

  const { data: streaks } = await supabase
    .from('user_streaks')
    .select('current_streak')

  const totalHabits = habits?.length || 0
  const completedToday = todayCompletions?.length || 0
  const longestStreak = Math.max(...(streaks?.map(s => s.current_streak) || [0]))
  const activeStreaks = streaks?.length || 0

  return {
    totalHabits,
    completedToday,
    longestStreak,
    activeStreaks,
  }
}

export async function getWeeklyProgress() {
  const supabase = await createClient()
  const today = new Date()
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('habit_completions')
    .select('completed_date, habit_id')
    .gte('completed_date', weekAgo.toISOString().split('T')[0])
    .order('completed_date', { ascending: true })

  if (error) return {}

  const dailyCounts = data.reduce((acc, curr) => {
    acc[curr.completed_date] = (acc[curr.completed_date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return dailyCounts
}

export async function getHabitInsights(habitId: string) {
  const supabase = await createClient()

  const { data: completions } = await supabase
    .from('habit_completions')
    .select('completed_date, duration, mood_score')
    .eq('habit_id', habitId)
    .order('completed_date', { ascending: false })
    .limit(90)

  const avgDuration = completions?.reduce((sum, c) => sum + (c.duration || 0), 0) / (completions?.length || 1)
  const avgMood = completions?.reduce((sum, c) => sum + (c.mood_score || 0), 0) / (completions?.length || 1)
  const totalCompletions = completions?.length || 0

  return {
    avgDuration: Math.round(avgDuration),
    avgMood: Math.round(avgMood * 10) / 10,
    totalCompletions,
    recentCompletions: completions?.slice(0, 7) || [],
  }
}
