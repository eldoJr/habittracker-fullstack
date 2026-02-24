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
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${habit.color}20` }}
              >
                <Icon size={32} style={{ color: habit.color }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{habit.name}</h1>
                <Badge variant="gray" className="mt-2">
                  {habit.frequency_type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
                <Edit size={16} className="mr-1" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleArchive}>
                <Archive size={16} className="mr-1" /> Archive
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 size={16} className="mr-1" /> Delete
              </Button>
            </div>
          </div>

          {habit.description && (
            <p className="text-gray-600 mb-6">{habit.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-gray-900">{streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-1">✓</div>
              <div className="text-2xl font-bold text-gray-900">{totalCompletions}</div>
              <div className="text-sm text-gray-600">Total Completions</div>
            </div>
            {avgMood && (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl mb-1">😊</div>
                <div className="text-2xl font-bold text-gray-900">{avgMood}</div>
                <div className="text-sm text-gray-600">Avg Mood</div>
              </div>
            )}
            {avgDuration && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-2xl font-bold text-gray-900">{avgDuration}m</div>
                <div className="text-sm text-gray-600">Avg Duration</div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Completion History</h2>
          {completions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No completions yet</p>
          ) : (
            <div className="space-y-3">
              {completions.map((completion) => (
                <div
                  key={completion.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {format(parseISO(completion.completed_date), 'MMMM d, yyyy')}
                    </div>
                    {completion.notes && (
                      <p className="text-sm text-gray-600 mt-1">{completion.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    {completion.duration && (
                      <span className="text-gray-600">{completion.duration}m</span>
                    )}
                    {completion.mood_score && (
                      <span className="text-xl">
                        {['😞', '😕', '😐', '🙂', '😄'][completion.mood_score - 1]}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {showEdit && (
        <EditHabitModal habit={habit} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}
