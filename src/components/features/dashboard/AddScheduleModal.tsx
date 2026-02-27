'use client'

import { useState } from 'react'
import { X, Clock, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

interface AddScheduleModalProps {
  onClose: () => void
}

const EVENT_TYPES = [
  { value: 'school', label: '🎓 School', color: '#3b82f6' },
  { value: 'exam', label: '📝 Exam', color: '#ef4444' },
  { value: 'gym', label: '💪 Gym', color: '#10b981' },
  { value: 'meeting', label: '👥 Meeting', color: '#8b5cf6' },
  { value: 'study', label: '📚 Study', color: '#f59e0b' },
  { value: 'other', label: '📌 Other', color: '#6b7280' },
]

const DAYS = [
  { value: 1, label: 'M' },
  { value: 2, label: 'T' },
  { value: 3, label: 'W' },
  { value: 4, label: 'T' },
  { value: 5, label: 'F' },
  { value: 6, label: 'S' },
  { value: 7, label: 'S' },
]

export function AddScheduleModal({ onClose }: AddScheduleModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState('school')
  const [selectedDays, setSelectedDays] = useState<number[]>([1,2,3,4,5])
  const router = useRouter()

  function toggleDay(day: number) {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const loadingToast = toast.loading('Adding to schedule...')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast.error('Please log in', { id: loadingToast })
        return
      }

      const startTime = formData.get('startTime') as string
      const endTime = formData.get('endTime') as string

      const { error } = await supabase.from('schedule_events').insert({
        user_id: session.user.id,
        title: formData.get('title') as string,
        event_type: selectedType,
        start_time: startTime,
        end_time: endTime || null,
        days_of_week: selectedDays,
        color: EVENT_TYPES.find(t => t.value === selectedType)?.color || '#000000',
      })
      
      if (!error) {
        toast.success('Schedule added!', { id: loadingToast })
        router.refresh()
        onClose()
      } else {
        toast.error('Failed to add', { id: loadingToast })
      }
    } catch (error) {
      toast.error('Something went wrong', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[100] p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center rounded-t-3xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold">Add Schedule</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 pb-6">
          <Input
            name="title"
            label="Title"
            placeholder="e.g., Math Class"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`p-3 rounded-lg border-2 transition text-sm ${
                    selectedType === type.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              name="startTime"
              label="Start Time"
              type="time"
              required
              icon={<Clock size={18} />}
            />
            <Input
              name="endTime"
              label="End Time"
              type="time"
              icon={<Clock size={18} />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat on
            </label>
            <div className="flex gap-2 justify-between">
              {DAYS.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`w-10 h-10 rounded-full font-bold transition text-sm ${
                    selectedDays.includes(day.value)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Schedule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
