'use client'

import { useState } from 'react'
import { Check, Circle, Play } from 'lucide-react'
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
    <div className="space-y-4">
      {habits.map((habit) => {
        const isCompleted = completed.has(habit.id)
        const isLoading = loading === habit.id

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <button
              onClick={() => toggleHabit(habit.id)}
              disabled={isLoading}
              className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                isCompleted
                  ? 'bg-gray-900 border-gray-900'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {isCompleted && <Check size={18} className="text-white" />}
            </button>

            <div className="flex-1">
              <h3 className={`font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {habit.name}
              </h3>
              <p className="text-sm text-gray-500">
                {isCompleted ? 'Completed' : 'Not completed yet'}
              </p>
            </div>

            {!isCompleted && (
              <div className="text-sm text-gray-400">
                {/* Placeholder for time/progress */}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
