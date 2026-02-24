import { createClient } from '@/lib/supabase/server'

export async function getAnalyticsData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]

  // Get all habits
  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .is('archived_at', null)

  // Get completions for last 30 days
  const { data: completions } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', user.id)
    .gte('completed_date', thirtyDaysAgo)
    .order('completed_date', { ascending: true })

  // Get streak data
  const { data: streakData } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Calculate stats
  const totalHabits = habits?.length || 0
  const totalCompletions = completions?.length || 0
  const currentStreak = streakData?.current_streak || 0
  const longestStreak = streakData?.longest_streak || 0

  // Completion rate last 7 days
  const last7DaysCompletions = completions?.filter(c => c.completed_date >= sevenDaysAgo) || []
  const completionRate = totalHabits > 0 ? Math.round((last7DaysCompletions.length / (totalHabits * 7)) * 100) : 0

  // Best performing habit
  const habitCompletionCounts = completions?.reduce((acc, c) => {
    acc[c.habit_id] = (acc[c.habit_id] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const bestHabitId = habitCompletionCounts 
    ? Object.entries(habitCompletionCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null

  const bestHabit = habits?.find(h => h.id === bestHabitId)

  // Daily completion trend (last 7 days)
  const dailyTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0]
    const count = completions?.filter(c => c.completed_date === date).length || 0
    return { date, count }
  })

  // Average mood
  const moodScores = completions?.filter(c => c.mood_score).map(c => c.mood_score!) || []
  const avgMood = moodScores.length > 0 
    ? (moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length).toFixed(1)
    : null

  // Most productive day
  const dayOfWeekCounts = completions?.reduce((acc, c) => {
    const day = new Date(c.completed_date).getDay()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  const mostProductiveDay = dayOfWeekCounts
    ? Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  return {
    totalHabits,
    totalCompletions,
    currentStreak,
    longestStreak,
    completionRate,
    bestHabit,
    dailyTrend,
    avgMood,
    mostProductiveDay: mostProductiveDay ? dayNames[parseInt(mostProductiveDay)] : null,
    habits: habits || [],
    completions: completions || []
  }
}
