import { createClient } from '@/lib/supabase/server'

export async function getUserStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { currentStreak: 0, totalPoints: 0 }

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at).toISOString().split('T')[0] : null

  // Get total completions for points (10 points each)
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('id')
    .eq('user_id', user.id)

  const totalPoints = (completions?.length || 0) * 10

  // Calculate streak based on login activity
  let streak = 0
  
  if (lastSignIn === today || lastSignIn === yesterday) {
    // User is active, get or create streak record
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak, last_activity_date')
      .eq('user_id', user.id)
      .single()

    if (streakData) {
      const lastActivity = streakData.last_activity_date
      const daysSinceActivity = Math.floor((new Date(today).getTime() - new Date(lastActivity).getTime()) / 86400000)
      
      if (daysSinceActivity === 0) {
        // Same day
        streak = streakData.current_streak
      } else if (daysSinceActivity === 1) {
        // Consecutive day
        streak = streakData.current_streak + 1
        await supabase
          .from('user_streaks')
          .update({ current_streak: streak, last_activity_date: today })
          .eq('user_id', user.id)
      } else {
        // Streak broken, reset to 1
        streak = 1
        await supabase
          .from('user_streaks')
          .update({ current_streak: 1, last_activity_date: today })
          .eq('user_id', user.id)
      }
    } else {
      // First time, create streak
      streak = 1
      await supabase
        .from('user_streaks')
        .insert({ user_id: user.id, current_streak: 1, last_activity_date: today })
    }
  }

  return {
    currentStreak: streak,
    totalPoints: totalPoints,
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
