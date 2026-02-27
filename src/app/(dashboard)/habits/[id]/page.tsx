'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { HabitDetailView } from '@/components/features/habits/HabitDetailView'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default function HabitDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [habit, setHabit] = useState<any>(null)
  const [completions, setCompletions] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      
      Promise.all([
        supabase.from('habits').select('*').eq('id', params.id).single(),
        supabase.from('habit_completions').select('*').eq('habit_id', params.id).order('completed_at', { ascending: false }).limit(90),
        supabase.from('user_streaks').select('current_streak').eq('user_id', session.user.id).maybeSingle(),
      ]).then(([habitRes, completionsRes, streakRes]) => {
        if (!habitRes.data) {
          router.push('/habits')
          return
        }
        setHabit(habitRes.data)
        setCompletions(completionsRes.data || [])
        setStreak(streakRes.data?.current_streak || 0)
        setLoading(false)
      })
    })
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!habit) return null

    return (
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Link href="/habits" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium">
            <ArrowLeft size={20} />
            Back to Habits
          </Link>

          <HabitDetailView 
            habit={habit} 
            completions={completions}
            streak={streak}
          />
        </div>
        <BottomNav />
      </main>
    )
  }
