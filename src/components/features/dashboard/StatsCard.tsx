interface StatsCardProps {
  stats: {
    currentStreak: number
    totalPoints: number
  }
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="text-sm text-gray-500 mb-2">Today</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-6xl font-black text-gray-900 leading-none">{stats.currentStreak || 0}</div>
          <div className="text-sm text-gray-500 mt-2">day streak</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900 leading-none">{stats.totalPoints?.toLocaleString() || 0}</div>
          <div className="text-sm text-gray-400 mt-1">total points</div>
        </div>
      </div>
    </div>
  )
}
