import { Suspense } from 'react'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { getHabits, getTodayCompletions } from '@/lib/queries/habits'
import { getUserStats, getWeeklyProgress } from '@/lib/queries/analytics'
import { getTodaySchedule } from '@/lib/queries/schedule'
import { TodayHabits } from './TodayHabits'
import { SearchBar } from './SearchBar'
import { WeekProgress } from './WeekProgress'
import { Programs } from './Programs'
import { Schedule } from './Schedule'
import { HelpTips } from './HelpTips'
import { BottomNav } from './BottomNav'
import { SkeletonCard, SkeletonList } from '@/components/atoms/Skeleton'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database-production'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export async function DashboardHome({ user, profile }: { user: User; profile: UserProfile | null }) {
  const habits = await getHabits()
  const completedToday = await getTodayCompletions()
  const stats = await getUserStats()
  const weeklyProgress = await getWeeklyProgress()
  const scheduleEvents = await getTodaySchedule()

  const firstName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there'
  const todayHabits = habits.filter(h => !h.archived_at)
  const completedCount = todayHabits.filter(h => completedToday.includes(h.id)).length

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Good<br />morning,<br />{firstName}
          </h1>
          <button className="p-3 bg-[#F4F4F5] rounded-[32px] hover:bg-gray-200 transition">
            <Bell size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar />

        {/* Stats - No Container */}
        <div>
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

        {/* Daily Habits - No Container */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Daily Habits</h2>
            <span className="text-lg text-gray-500">{completedCount}/{todayHabits.length}</span>
          </div>

          <Suspense fallback={<SkeletonList />}>
            <TodayHabits habits={todayHabits} completedToday={completedToday} />
          </Suspense>

          <Link
            href="/habits"
            className="mt-4 w-full py-3 bg-[#F4F4F5] text-gray-900 font-semibold rounded-2xl hover:bg-gray-200 transition text-center block"
          >
            Manage Habits
          </Link>
        </div>

        {/* This Week Progress */}
        <Suspense fallback={<SkeletonCard />}>
          <WeekProgress progress={weeklyProgress} />
        </Suspense>

        {/* Programs */}
        <Suspense fallback={<SkeletonCard />}>
          <Programs />
        </Suspense>

        {/* Schedule */}
        <Suspense fallback={<SkeletonCard />}>
          <Schedule events={scheduleEvents} />
        </Suspense>

        {/* Help & Tips */}
        <HelpTips />

        {/* Floating Action Button */}
        <Link
          href="/habits"
          className="fixed bottom-24 right-8 w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition z-40"
        >
          <Plus size={24} />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
