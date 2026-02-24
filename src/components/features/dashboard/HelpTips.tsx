'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

const TIPS = [
  {
    id: 1,
    title: 'How do streaks work?',
    content: 'Complete your habit daily to build a streak. Missing a day resets your streak to zero.',
  },
  {
    id: 2,
    title: 'Setting up reminders',
    content: 'Tap on any habit and select "Remind me" to set up notifications. Choose specific times or smart reminders.',
    expanded: true,
  },
  {
    id: 3,
    title: 'Understanding your metrics',
    content: 'Track completion rates, streaks, and mood scores to understand your habit patterns.',
  },
]

export function HelpTips() {
  const [expanded, setExpanded] = useState<number>(2)

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Help & Tips</h2>
      
      <div className="bg-[#F4F4F5] rounded-2xl overflow-hidden">
        {TIPS.map((tip) => (
          <div key={tip.id}>
            <button
              onClick={() => setExpanded(expanded === tip.id ? 0 : tip.id)}
              className={`w-full px-6 py-4 flex items-center justify-between transition ${
                expanded === tip.id ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'
              }`}
            >
              <span className="font-semibold text-left">{tip.title}</span>
              {expanded === tip.id ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} className="text-gray-400" />
              )}
            </button>
            {expanded === tip.id && (
              <div className="px-6 py-4 bg-gray-900 text-gray-400 text-sm">
                {tip.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
