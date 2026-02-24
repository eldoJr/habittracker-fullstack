'use client'

import { useState } from 'react'
import { Check, Circle, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { completeHabit, uncompleteHabit } from '@/lib/actions/habits'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface TodayHabitsProps {
  habits: Habit[]
  completedToday: string[]
}

export function TodayHabits({ habits, completedToday }: TodayHabitsProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedToday))
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleHabit(habitId: string) {
    setLoading(habitId)
    try {
      if (completed.has(habitId)) {
        await uncompleteHabit(habitId, new Date().toISOString().split('T')[0])
        setCompleted(prev => {
          const next = new Set(prev)
          next.delete(habitId)
          return next
        })
      } else {
        await completeHabit(habitId)
        setCompleted(prev => new Set(prev).add(habitId))
        toast.success('Great job! 🎉')
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
