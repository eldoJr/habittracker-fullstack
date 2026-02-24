'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Edit, Trash2, Archive } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Card } from '@/components/atoms/Card'
import { deleteHabit, archiveHabit } from '@/lib/actions/habits'
import { HABIT_ICONS, type IconName } from '@/lib/constants/icons'
import { EditHabitModal } from './EditHabitModal'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']
type Completion = Database['public']['Tables']['habit_completions']['Row']

interface HabitDetailViewProps {
  habit: Habit
  completions: Completion[]
  streak: number
}

export function HabitDetailView({ habit, completions, streak }: HabitDetailViewProps) {
  const [showEdit, setShowEdit] = useState(false)
  const router = useRouter()
  const Icon = HABIT_ICONS[(habit.icon as IconName) || 'target']

  const totalCompletions = completions.length
  const avgMood = completions.filter(c => c.mood_score).length > 0
    ? (completions.reduce((sum, c) => sum + (c.mood_score || 0), 0) / completions.filter(c => c.mood_score).length).toFixed(1)
    : null
  const avgDuration = completions.filter(c => c.duration).length > 0
    ? Math.round(completions.reduce((sum, c) => sum + (c.duration || 0), 0) / completions.filter(c => c.duration).length)
    : null

  async function handleDelete() {
    if (!confirm('Delete this habit? This cannot be undone.')) return
    try {
      await deleteHabit(habit.id)
      toast.success('Habit deleted')
      router.push('/habits')
    } catch (error) {
      toast.error('Failed to delete habit')
    }
  }

  async function handleArchive() {
    try {
      await archiveHabit(habit.id)
      toast.success('Habit archived')
      router.push('/habits')
    } catch (error) {
      toast.error('Failed to archive habit')
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-[#F4F4F5] p-4 sm:p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <Icon size={24} className="sm:w-8 sm:h-8" style={{ color: habit.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate">{habit.name}</h1>
                <Badge variant="gray" className="mt-2 text-xs">
                  {habit.frequency_type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} className="flex-1 sm:flex-none">
                <Edit size={16} className="sm:mr-1" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleArchive} className="flex-1 sm:flex-none">
                <Archive size={16} className="sm:mr-1" />
                <span className="hidden sm:inline">Archive</span>
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete} className="flex-1 sm:flex-none">
                <Trash2 size={16} className="sm:mr-1" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>

          {habit.description && (
            <p className="text-sm sm:text-base text-gray-600 mb-4">{habit.description}</p>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl mb-1">🔥</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{streak}</div>
              <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-xl">
              <div className="text-2xl sm:text-3xl mb-1">✓</div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalCompletions}</div>
              <div className="text-xs sm:text-sm text-gray-600">Completions</div>
            </div>
            {avgMood && (
              <div className="bg-white p-3 sm:p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl mb-1">😊</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{avgMood}</div>
                <div className="text-xs sm:text-sm text-gray-600">Avg Mood</div>
              </div>
            )}
            {avgDuration && (
              <div className="bg-white p-3 sm:p-4 rounded-xl">
                <div className="text-2xl sm:text-3xl mb-1">⏱️</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{avgDuration}m</div>
                <div className="text-xs sm:text-sm text-gray-600">Avg Duration</div>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Completion History</h2>
          {completions.length === 0 ? (
            <div className="bg-[#F4F4F5] p-8 rounded-2xl text-center">
              <p className="text-gray-500">No completions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completions.map((completion) => (
                <div
                  key={completion.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#F4F4F5] rounded-2xl gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm sm:text-base text-gray-900">
                      {format(parseISO(completion.completed_date), 'MMMM d, yyyy')}
                    </div>
                    {completion.notes && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{completion.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    {completion.duration && (
                      <span className="text-gray-600 font-medium">{completion.duration}m</span>
                    )}
                    {completion.mood_score && (
                      <span className="text-xl sm:text-2xl">
                        {['😞', '😕', '😐', '🙂', '😄'][completion.mood_score - 1]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showEdit && (
        <EditHabitModal habit={habit} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}
