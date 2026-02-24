'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Badge } from '@/components/atoms/Badge'
import { completeHabit, uncompleteHabit, deleteHabit } from '@/lib/actions/habits'
import { HABIT_ICONS, type IconName } from '@/lib/constants/icons'
import { EditHabitModal } from './EditHabitModal'
import { CompletionModal } from './CompletionModal'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface HabitCardProps {
  habit: Habit
  isCompletedToday: boolean
  streak?: number
}

export function HabitCard({ habit, isCompletedToday, streak = 0 }: HabitCardProps) {
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(isCompletedToday)
  const [showMenu, setShowMenu] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const Icon = HABIT_ICONS[(habit.icon as IconName) || 'target']

  async function toggleComplete() {
    if (completed) {
      setLoading(true)
      try {
        await uncompleteHabit(habit.id, new Date().toISOString().split('T')[0])
        setCompleted(false)
        toast.success('Habit uncompleted')
      } catch (error) {
        console.error('Failed to uncomplete:', error)
        toast.error('Something went wrong')
      } finally {
        setLoading(false)
      }
    } else {
      setShowCompletion(true)
    }
  }

  async function handleComplete(data?: { duration?: number; notes?: string; mood_score?: number }) {
    setLoading(true)
    try {
      await completeHabit(habit.id, data)
      setCompleted(true)
      toast.success('Great job! 🎉')
      setShowCompletion(false)
    } catch (error) {
      console.error('Failed to complete:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this habit? This cannot be undone.')) return
    setLoading(true)
    try {
      await deleteHabit(habit.id)
      toast.success('Habit deleted')
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error('Failed to delete habit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F4F4F5] p-4 sm:p-6 rounded-2xl relative"
      >
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <Icon size={20} className="sm:w-6 sm:h-6" style={{ color: habit.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{habit.name}</h3>
                <Badge variant="gray" className="mt-1 text-xs">
                  {habit.frequency_type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            {habit.description && (
              <p className="text-xs sm:text-sm text-gray-600 mb-3">{habit.description}</p>
            )}
            
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl">🔥</span>
                <span className="font-bold text-gray-900">{streak}</span>
                <span className="text-gray-500">day streak</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <MoreVertical size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border z-10">
                  <Link
                    href={`/habits/${habit.id}`}
                    className="w-full px-4 py-2.5 hover:bg-gray-50 flex items-center gap-2 text-sm rounded-t-xl"
                  >
                    <Eye size={16} /> View Details
                  </Link>
                  <button
                    onClick={() => { setShowEdit(true); setShowMenu(false) }}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600 text-sm rounded-b-xl"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleComplete}
              disabled={loading}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 transition-all flex items-center justify-center text-lg sm:text-xl font-bold flex-shrink-0 ${
                completed
                  ? 'shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                borderColor: completed ? habit.color : undefined,
                backgroundColor: completed ? habit.color : '#ffffff',
                color: completed ? '#ffffff' : habit.color,
              }}
            >
              {completed && '✓'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {showEdit && (
        <EditHabitModal
          habit={habit}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showCompletion && (
        <CompletionModal
          habit={habit}
          onComplete={handleComplete}
          onClose={() => setShowCompletion(false)}
        />
      )}
    </>
  )
}
