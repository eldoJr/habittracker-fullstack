'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AddScheduleModal } from './AddScheduleModal'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ScheduleEvent {
  id: string
  title: string
  event_type: string
  start_time: string
  end_time: string | null
  color: string
}

interface ScheduleProps {
  events: ScheduleEvent[] | null
}

type ViewMode = 'today' | 'week' | 'month'

export function Schedule({ events }: ScheduleProps) {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const router = useRouter()

  const scheduleEvents = events || []

  async function handleDelete(eventId: string) {
    setDeleting(eventId)
    const supabase = createClient()
    const { error } = await supabase.from('schedule_events').delete().eq('id', eventId)
    
    if (!error) {
      toast.success('Deleted!')
      router.refresh()
    } else {
      toast.error('Failed to delete')
    }
    setDeleting(null)
  }

  return (
    <>
      <div>
        {/* Today/Week/Month Tabs */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#F4F4F5] rounded-[32px] inline-flex gap-1 px-2 py-2">
            <button 
              onClick={() => setViewMode('today')}
              className={`px-8 py-1.5 rounded-[32px] text-sm font-semibold transition ${
                viewMode === 'today' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-white'
              }`}
            >
              Today
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-8 py-1.5 rounded-[32px] text-sm font-semibold transition ${
                viewMode === 'week' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-white'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setViewMode('month')}
              className={`px-8 py-1.5 rounded-[32px] text-sm font-semibold transition ${
                viewMode === 'month' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-white'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-gray-900">Schedule</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {scheduleEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No scheduled events</p>
          ) : (
            scheduleEvents.map((event) => (
              <div key={event.id} className="bg-[#F4F4F5] rounded-2xl p-4 flex items-center gap-3 group">
                <div 
                  className="w-1 h-12 rounded-full" 
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-gray-900">{event.start_time.slice(0, 5)}</span>
                    {event.end_time && (
                      <span className="text-sm text-gray-500">- {event.end_time.slice(0, 5)}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{event.event_type}</p>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  disabled={deleting === event.id}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && <AddScheduleModal onClose={() => setShowModal(false)} />}
    </>
  )
}
