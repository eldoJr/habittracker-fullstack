'use client'

import { Plus } from 'lucide-react'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface ScheduleProps {
  habits: Habit[]
}

export function Schedule({ habits }: ScheduleProps) {
  // Mock schedule data - in real app, this would come from habit reminder_time
  const scheduleItems = habits.slice(0, 3).map((habit, index) => ({
    time: ['07:00', '12:30', '18:00'][index] || '09:00',
    name: habit.name,
    duration: habit.target_duration || 30,
    category: habit.frequency_type,
  }))

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Schedule</h2>
        <button className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition">
          <Plus size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {scheduleItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No scheduled habits</p>
        ) : (
          scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-1 h-12 bg-gray-900 rounded-full" />
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-gray-900">{item.time}</span>
                  <span className="text-lg font-semibold text-gray-900">{item.name}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {item.duration} min · {item.category}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
