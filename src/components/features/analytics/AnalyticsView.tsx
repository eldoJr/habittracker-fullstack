'use client'

import { TrendingUp, Target, Flame, Calendar, Smile, Award, Trophy, BarChart3 } from 'lucide-react'
import { HABIT_ICONS, type IconName } from '@/lib/constants/icons'

interface AnalyticsData {
  totalHabits: number
  totalCompletions: number
  currentStreak: number
  longestStreak: number
  completionRate: number
  bestHabit: any
  dailyTrend: { date: string; count: number }[]
  avgMood: string | null
  mostProductiveDay: string | null
}

export function AnalyticsView({ data }: { data: AnalyticsData }) {
  const maxCount = Math.max(...data.dailyTrend.map(d => d.count), 1)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#F4F4F5] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={20} className="text-orange-500" />
            <span className="text-sm text-gray-600">Current Streak</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{data.currentStreak}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>

        <div className="bg-[#F4F4F5] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-yellow-500" />
            <span className="text-sm text-gray-600">Longest Streak</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{data.longestStreak}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </div>

        <div className="bg-[#F4F4F5] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Target size={20} className="text-blue-500" />
            <span className="text-sm text-gray-600">Total Habits</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{data.totalHabits}</div>
          <div className="text-xs text-gray-500 mt-1">active</div>
        </div>

        <div className="bg-[#F4F4F5] p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-500" />
            <span className="text-sm text-gray-600">Completion Rate</span>
          </div>
          <div className="text-3xl font-extrabold text-gray-900">{data.completionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">last 7 days</div>
        </div>
      </div>

      {/* 7-Day Trend */}
      <div>
        <h2 className="text-xl font-extrabold mb-4">7-Day Activity</h2>
        <div className="bg-[#F4F4F5] p-6 rounded-2xl">
          <div className="flex items-end justify-between gap-2 h-32">
            {data.dailyTrend.map((day, i) => {
              const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
              const date = new Date(day.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center h-24">
                    <div 
                      className="w-full bg-gray-900 rounded-t-lg transition-all"
                      style={{ height: `${height}%`, minHeight: day.count > 0 ? '8px' : '0' }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{dayName}</div>
                  <div className="text-xs text-gray-400">{day.count}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-xl font-extrabold mb-4">Insights</h2>
        <div className="space-y-3">
          {data.bestHabit && (
            <div className="bg-[#F4F4F5] p-4 rounded-2xl flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${data.bestHabit.color}20` }}
              >
                {(() => {
                  const Icon = HABIT_ICONS[(data.bestHabit.icon as IconName) || 'target']
                  return <Icon size={20} style={{ color: data.bestHabit.color }} />
                })()}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 flex items-center gap-1.5">
                  <Trophy size={14} className="text-yellow-600" />
                  Best Performing Habit
                </div>
                <div className="font-bold text-gray-900">{data.bestHabit.name}</div>
              </div>
            </div>
          )}

          {data.mostProductiveDay && (
            <div className="bg-[#F4F4F5] p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Most Productive Day</div>
                <div className="font-bold text-gray-900">{data.mostProductiveDay}</div>
              </div>
            </div>
          )}

          {data.avgMood && (
            <div className="bg-[#F4F4F5] p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Smile size={20} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Average Mood Score</div>
                <div className="font-bold text-gray-900">{data.avgMood} / 5.0</div>
              </div>
            </div>
          )}

          {data.totalCompletions > 0 && (
            <div className="bg-[#F4F4F5] p-4 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <BarChart3 size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">Total Completions</div>
                <div className="font-bold text-gray-900">{data.totalCompletions} times</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Motivational Message */}
      {data.currentStreak >= 7 && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={24} />
            <span className="text-xl font-bold">You're on fire!</span>
          </div>
          <div className="text-sm opacity-90">
            {data.currentStreak} days streak! Keep up the amazing work!
          </div>
        </div>
      )}

      {data.completionRate >= 80 && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <Award size={24} />
            <span className="text-xl font-bold">Consistency Champion!</span>
          </div>
          <div className="text-sm opacity-90">
            {data.completionRate}% completion rate this week. You're crushing it!
          </div>
        </div>
      )}
    </div>
  )
}
