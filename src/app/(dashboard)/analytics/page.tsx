'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { BarChart3 } from 'lucide-react'
import { AnalyticsView } from '@/components/features/analytics/AnalyticsView'

export default function AnalyticsPage() {
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      
      // Fetch analytics data
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
      
      Promise.all([
        supabase.from('habits').select('*').eq('user_id', session.user.id),
        supabase.from('habit_completions').select('*').eq('user_id', session.user.id).gte('completed_date', sevenDaysAgoStr),
        supabase.from('user_streaks').select('*').eq('user_id', session.user.id).maybeSingle(),
      ]).then(([habits, completions, streaks]) => {
        const habitsData = habits.data || []
        const completionsData = completions.data || []
        
        // Calculate daily trend
        const dailyTrend = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          const dateStr = date.toISOString().split('T')[0]
          const count = completionsData.filter(c => c.completed_date === dateStr).length
          return { date: dateStr, count }
        })
        
        // Calculate completion rate
        const totalExpected = habitsData.length * 7
        const completionRate = totalExpected > 0 ? Math.round((completionsData.length / totalExpected) * 100) : 0
        
        // Find best habit
        const habitCompletions = habitsData.map(h => ({
          ...h,
          completionCount: completionsData.filter(c => c.habit_id === h.id).length
        })).sort((a, b) => b.completionCount - a.completionCount)
        
        // Calculate avg mood
        const moodsWithValues = completionsData.filter(c => c.mood).map(c => c.mood)
        const avgMood = moodsWithValues.length > 0 
          ? (moodsWithValues.reduce((sum, m) => sum + m, 0) / moodsWithValues.length).toFixed(1)
          : null
        
        // Find most productive day
        const dayCounts = dailyTrend.reduce((acc, day) => {
          const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })
          acc[dayName] = (acc[dayName] || 0) + day.count
          return acc
        }, {} as Record<string, number>)
        const mostProductiveDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
        
        const analyticsData = {
          totalHabits: habitsData.length,
          totalCompletions: completionsData.length,
          currentStreak: streaks.data?.current_streak || 0,
          longestStreak: streaks.data?.longest_streak || 0,
          completionRate,
          bestHabit: habitCompletions[0] || null,
          dailyTrend,
          avgMood,
          mostProductiveDay,
        }
        setAnalyticsData(analyticsData)
        setLoading(false)
      })
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-gray-900" />
          <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
        </div>
        
        <AnalyticsView data={analyticsData} />
      </div>
      <BottomNav />
    </main>
  )
}
