'use client'

export function WeekProgress({ progress }: { progress: Record<string, number> }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDay()
  
  // Calculate completion rate
  const totalDays = Object.keys(progress).length || 1
  const avgCompletions = Object.values(progress).reduce((a, b) => a + b, 0) / totalDays
  const completionRate = Math.round((avgCompletions / 5) * 100) // Assuming 5 habits target

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">This Week</h2>
        <span className="text-2xl font-bold text-gray-500">{completionRate}%</span>
      </div>

      <div className="flex justify-between items-center">
        {days.map((day, index) => {
          const isToday = (index + 1) % 7 === today
          const dayIndex = (index + 1) % 7
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className={`text-xl font-bold ${isToday ? 'text-gray-900' : 'text-gray-400'}`}>
                {day}
              </span>
              <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-gray-900' : 'bg-gray-300'}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
