import { Suspense } from 'react'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { getHabits, getTodayCompletions } from '@/lib/queries/habits'
import { getUserStats, getWeeklyProgress } from '@/lib/queries/analytics'
import { TodayHabits } from './TodayHabits'
import { SearchBar } from './SearchBar'
import { WeekProgress } from './WeekProgress'
import { Programs } from './Programs'
import { Schedule } from './Schedule'
import { HelpTips } from './HelpTips'
import { BottomNav } from './BottomNav'
import type { User } from '@supabase/supabase-js'

export async function DashboardHome({ user }: { user: User }) {
  const habits = await getHabits()
  const completedToday = await getTodayCompletions()
  const stats = await getUserStats()
  const weeklyProgress = await getWeeklyProgress()

  const firstName = user.user_metadata?.name?.split(' ')[0] || user.email?.split('@')[0] || 'there'
  const todayHabits = habits.filter(h => !h.archived_at)
  const completedCount = todayHabits.filter(h => completedToday.includes(h.id)).length

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Good<br />morning,<br />{firstName}
          </h1>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Bell size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Stats Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-2">Today</div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-7xl font-black text-gray-900">{stats.currentStreak || 0}</div>
              <div className="text-sm text-gray-600 mt-1">day streak</div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-gray-900">{stats.totalPoints || 0}</div>
              <div className="text-sm text-gray-500">total points</div>
            </div>
          </div>
        </div>

        {/* Daily Habits */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Daily Habits</h2>
            <span className="text-xl text-gray-500">{completedCount}/{todayHabits.length}</span>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
            <TodayHabits habits={todayHabits} completedToday={completedToday} />
          </Suspense>
        </div>

        {/* This Week Progress */}
        <WeekProgress progress={weeklyProgress} />

        {/* Programs */}
        <Programs />

        {/* Schedule */}
        <Schedule habits={todayHabits} />

        {/* Help & Tips */}
        <HelpTips />

        {/* Floating Action Button */}
        <Link
          href="/habits"
          className="fixed bottom-8 right-8 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
