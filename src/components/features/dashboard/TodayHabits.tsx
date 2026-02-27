'use client'

import { useState, useEffect } from 'react'
import { Check, Circle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface TodayHabitsProps {
  habits: Habit[]
  completedToday: string[]
  onComplete?: () => void
}

export function TodayHabits({ habits, completedToday, onComplete }: TodayHabitsProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedToday))
  const [loading, setLoading] = useState<string | null>(null)

  // Sync with prop changes
  useEffect(() => {
    setCompleted(new Set(completedToday))
  }, [completedToday])

  async function toggleHabit(habitId: string) {
    setLoading(habitId)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const today = new Date().toISOString().split('T')[0]

      if (completed.has(habitId)) {
        await supabase.from('habit_completions').delete().eq('habit_id', habitId).eq('user_id', session.user.id).eq('completed_date', today)
        setCompleted(prev => {
          const next = new Set(prev)
          next.delete(habitId)
          return next
        })
      } else {
        const { error } = await supabase.from('habit_completions').insert({
          habit_id: habitId,
          user_id: session.user.id,
          completed_date: today,
        })
        if (error) {
          if (error.code === '23505') {
            toast.error('Already completed today')
          } else {
            throw error
          }
          return
        }
        setCompleted(prev => new Set(prev).add(habitId))
        toast.success('Great job! 🎉')
        onComplete?.()
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(null)
    }
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No habits yet. Create your first habit!
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const isCompleted = completed.has(habit.id)
        const isLoading = loading === habit.id

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3"
          >
            <button
              onClick={() => toggleHabit(habit.id)}
              disabled={isLoading}
              className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition disabled:opacity-50 mt-0.5 ${
                isCompleted
                  ? 'bg-gray-900 border-gray-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isCompleted && <Check size={16} className="text-white" strokeWidth={3} />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-gray-900 ${
                isCompleted ? 'line-through opacity-50' : ''
              }`}>
                {habit.name}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {isCompleted 
                  ? `Completed ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                  : habit.description || 'Not completed yet'
                }
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
