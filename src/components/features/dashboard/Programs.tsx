'use client'

import Link from 'next/link'
import { Dumbbell, Brain, Sun, Heart } from 'lucide-react'

const PROGRAMS = [
  {
    id: 'fitness',
    name: 'Fitness Journey',
    description: 'Build strength and endurance.',
    days: 30,
    icon: Dumbbell,
    theme: 'dark',
  },
  {
    id: 'mindfulness',
    name: 'Mindful Living',
    description: 'Cultivate peace and presence.',
    days: 21,
    icon: Brain,
    theme: 'light',
  },
  {
    id: 'morning',
    name: 'Morning Routine',
    description: 'Start your day powerfully.',
    days: 14,
    icon: Sun,
    theme: 'dark',
  },
  {
    id: 'wellness',
    name: 'Wellness Reset',
    description: 'Holistic health transformation.',
    days: 28,
    icon: Heart,
    theme: 'light',
  },
]

export function Programs() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Programs</h2>
        <Link href="/discover" className="text-sm text-gray-500 hover:text-gray-700">
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
        {PROGRAMS.map((program) => {
          const Icon = program.icon
          return (
            <Link
              key={program.id}
              href="/discover"
              className={`flex-shrink-0 w-48 h-56 rounded-3xl p-6 flex flex-col justify-between transition hover:scale-105 ${
                program.theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border-2 border-gray-900 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  program.theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
                }`}>
                  {program.days} Days
                </div>
                <Icon size={24} className={program.theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">{program.name}</h3>
                <p className={`text-sm ${program.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {program.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
