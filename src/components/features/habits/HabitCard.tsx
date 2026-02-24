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
        className="bg-white p-6 rounded-xl border-2 transition-all hover:shadow-lg relative"
        style={{ borderColor: habit.color }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <Icon size={24} style={{ color: habit.color }} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{habit.name}</h3>
                <Badge variant="gray" className="mt-1">
                  {habit.frequency_type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            {habit.description && (
              <p className="text-sm text-gray-600 mb-3 ml-15">{habit.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm ml-15">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl">🔥</span>
                <span className="font-semibold text-gray-900">{streak}</span>
                <span className="text-gray-500">day streak</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border z-10">
                  <Link
                    href={`/habits/${habit.id}`}
                    className="w-full px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye size={16} /> View Details
                  </Link>
                  <button
                    onClick={() => { setShowEdit(true); setShowMenu(false) }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
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
              className={`w-14 h-14 rounded-full border-3 transition-all flex items-center justify-center text-xl font-bold ${
                completed
                  ? 'bg-green-500 border-green-500 text-white shadow-lg'
                  : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
              }`}
              style={{
                borderColor: completed ? habit.color : undefined,
                backgroundColor: completed ? habit.color : undefined,
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
