'use client'

import Link from 'next/link'

const PROGRAMS = [
  {
    id: 1,
    name: 'Morning Mastery',
    description: 'Build an unshakeable morning routine.',
    days: 21,
    theme: 'dark',
  },
  {
    id: 2,
    name: 'Focus Protocol',
    description: 'Master deep work and mental clarity.',
    days: 30,
    theme: 'light',
  },
]

export function Programs() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Programs</h2>
        <Link href="/programs" className="text-sm text-gray-500 hover:text-gray-700">
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {PROGRAMS.map((program) => (
          <div
            key={program.id}
            className={`flex-shrink-0 w-48 h-56 rounded-3xl p-6 flex flex-col justify-between ${
              program.theme === 'dark'
                ? 'bg-gray-900 text-white'
                : 'bg-white border-2 border-gray-900 text-gray-900'
            }`}
          >
            <div className="inline-flex items-center px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-bold w-fit">
              {program.days} Days
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-2">{program.name}</h3>
              <p className={`text-sm ${program.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {program.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
