'use client'

import { useState } from 'react'
import { X, Clock, MessageSquare, Smile } from 'lucide-react'
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

  function handleQuickComplete() {
    onComplete()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-[60] pt-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 animate-slide-down" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-4 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-extrabold">Complete Habit</h2>
          <button onClick={onClose} className="p-2 bg-[#F4F4F5] rounded-full hover:bg-gray-200 transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-5">
          <div>
            <h3 className="font-bold text-lg mb-1">{habit.name}</h3>
            <p className="text-sm text-gray-600">Track your progress with details</p>
          </div>

          {/* Quick Complete Button */}
          <button
            onClick={handleQuickComplete}
            className="w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
          >
            Quick Complete
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or add details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Duration */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <Clock size={16} />
                Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                className="w-full px-4 py-3 bg-[#F4F4F5] border-0 rounded-2xl focus:ring-2 focus:ring-gray-900 text-base"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <Smile size={16} />
                How did it go?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setMood(m.score)}
                    className={`p-3 rounded-2xl border-2 transition ${
                      mood === m.score
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 bg-[#F4F4F5] hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{m.emoji}</div>
                    <div className="text-[10px] font-medium">{m.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <MessageSquare size={16} />
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F4F5] border-0 rounded-2xl focus:ring-2 focus:ring-gray-900 text-base resize-none"
                rows={3}
                placeholder="Any thoughts or reflections?"
                maxLength={500}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
            >
              Complete with Details
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
