'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { HabitCard } from './HabitCard'

export function HabitList() {
  const [habits, setHabits] = useState<any[]>([])
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      
      Promise.all([
        supabase.from('habits').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
        supabase.from('habit_completions').select('habit_id').eq('user_id', session.user.id).gte('completed_at', today),
      ]).then(([habitsRes, completionsRes]) => {
        setHabits(habitsRes.data || [])
        setCompletedToday(completionsRes.data?.map(c => c.habit_id) || [])
        setLoading(false)
      })
    })
  }, [])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading habits...</div>
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No habits yet</p>
        <p className="text-gray-400">Create your first habit to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isCompletedToday={completedToday.includes(habit.id)}
          streak={0}
        />
      ))}
    </div>
  )
}
