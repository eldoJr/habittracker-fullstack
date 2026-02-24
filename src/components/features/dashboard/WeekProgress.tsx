'use client'

export function WeekProgress({ progress }: { progress: Record<string, number> }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date()
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1 // Convert Sunday=0 to Sunday=6
  
  // Get dates for the week (Monday to Sunday)
  const weekDates: string[] = []
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - todayIndex)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    weekDates.push(date.toISOString().split('T')[0])
  }
  
  // Calculate completion rate
  const totalDays = Object.keys(progress).length || 1
  const avgCompletions = Object.values(progress).reduce((a, b) => a + b, 0) / totalDays
  const completionRate = Math.round((avgCompletions / 5) * 100)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">This Week</h2>
        <span className="text-2xl font-bold text-gray-500">{completionRate}%</span>
      </div>

      <div className="flex justify-between items-center">
        {days.map((day, index) => {
          const isToday = index === todayIndex
          const dateStr = weekDates[index]
          const hasActivity = progress[dateStr] && progress[dateStr] > 0
          
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className={`text-xl font-bold ${
                isToday ? 'text-gray-900' : hasActivity ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day}
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
