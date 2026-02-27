'use client'

export function WeekProgress({ progress }: { progress: { date: string; count: number }[] }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().toISOString().split('T')[0]
  
  // Calculate completion rate based on days with activity
  const daysWithActivity = progress.filter(p => p.count > 0).length
  const completionRate = Math.round((daysWithActivity / 7) * 100)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">This Week</h2>
        <span className="text-2xl font-bold text-gray-500">{completionRate}%</span>
      </div>

      <div className="flex justify-between items-center">
        {progress.map((day, index) => {
          const isToday = day.date === today
          const hasActivity = day.count > 0
          const dayLetter = days[new Date(day.date).getDay() === 0 ? 6 : new Date(day.date).getDay() - 1]
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className={`text-xl font-bold ${
                isToday ? 'text-gray-900' : hasActivity ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {dayLetter}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                hasActivity ? 'bg-gray-900' : 'bg-gray-300'
              }`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
