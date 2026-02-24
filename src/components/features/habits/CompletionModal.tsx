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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Habit</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">{habit.name}</h3>
            <p className="text-sm text-gray-600">Add details about your completion</p>
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
            <div className="flex gap-2 justify-between">
              {MOODS.map((m) => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => setMood(m.score)}
                  className={`flex-1 p-3 rounded-lg border-2 transition ${
                    mood === m.score
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{m.emoji}</div>
                  <div className="text-xs text-gray-600">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
