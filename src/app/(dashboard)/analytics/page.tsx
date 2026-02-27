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
      Promise.all([
        supabase.from('habits').select('*').eq('user_id', session.user.id),
        supabase.from('habit_completions').select('*').eq('user_id', session.user.id),
        supabase.from('user_streaks').select('*').eq('user_id', session.user.id).maybeSingle(),
      ]).then(([habits, completions, streaks]) => {
        const analyticsData = {
          totalHabits: habits.data?.length || 0,
          totalCompletions: completions.data?.length || 0,
          currentStreak: streaks.data?.current_streak || 0,
          longestStreak: streaks.data?.longest_streak || 0,
          completionRate: 0,
          bestHabit: habits.data?.[0] || null,
          dailyTrend: Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return { date: date.toISOString().split('T')[0], count: 0 }
          }),
          avgMood: null,
          mostProductiveDay: null,
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
