'use client'

import { X } from 'lucide-react'
import { HabitForm } from './HabitForm'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface EditHabitModalProps {
  habit: Habit
  onClose: () => void
}

export function EditHabitModal({ habit, onClose }: EditHabitModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-extrabold">Edit Habit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <HabitForm habit={habit} onSuccess={onClose} />
        </div>
      </div>
    </div>
  )
}
