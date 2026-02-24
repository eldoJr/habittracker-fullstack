'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import type { Database } from '@/types/database-production'

type Habit = Database['public']['Tables']['habits']['Row']

interface CompletionModalProps {
  habit: Habit
  onComplete: (data?: { duration?: number; notes?: string; mood_score?: number }) => void
  onClose: () => void
}

const MOODS = [
  { score: 1, emoji: '😞', label: 'Bad' },
  { score: 2, emoji: '😕', label: 'Poor' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
]

export function CompletionModal({ habit, onComplete, onClose }: CompletionModalProps) {
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState<number>()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onComplete({
      duration: duration ? parseInt(duration) : undefined,
      notes: notes || undefined,
      mood_score: mood,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="border-b px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-extrabold">Complete Habit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-1">{habit.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">Add details about your completion</p>
          </div>

          {habit.target_duration && (
            <Input
              type="number"
              label="Duration (minutes)"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did it go?
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setMood(m.score)}
                  className={`flex-1 p-2 sm:p-3 rounded-xl border-2 transition ${
                    mood === m.score
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">{m.emoji}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              rows={3}
              placeholder="Any thoughts or reflections?"
              maxLength={500}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Complete
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
