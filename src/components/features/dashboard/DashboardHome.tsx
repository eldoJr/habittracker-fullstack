'use client'

import { useEffect, useState } from 'react'
import { Bell, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { TodayHabits } from './TodayHabits'
import { SearchBar } from './SearchBar'
import { WeekProgress } from './WeekProgress'
import { Programs } from './Programs'
import { Schedule } from './Schedule'
import { HelpTips } from './HelpTips'
import { BottomNav } from './BottomNav'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database-production'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

export function DashboardHome({ user, profile }: { user: User; profile: UserProfile | null }) {
  const [habits, setHabits] = useState<any[]>([])
  const [completedToday, setCompletedToday] = useState<string[]>([])
  const [stats, setStats] = useState({ currentStreak: 0, totalPoints: 0 })
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([])
  const [scheduleEvents, setScheduleEvents] = useState<any[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const today = new Date().toISOString().split('T')[0]
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
    
    Promise.all([
      supabase.from('habits').select('*').eq('user_id', user.id),
      supabase.from('habit_completions').select('habit_id').eq('user_id', user.id).eq('completed_date', today),
      supabase.from('schedule_events').select('*').eq('user_id', user.id),
      supabase.from('habit_completions').select('completed_date').eq('user_id', user.id).gte('completed_date', sevenDaysAgoStr).order('completed_date', { ascending: false }),
    ]).then(([habitsRes, completionsRes, scheduleRes, allCompletionsRes]) => {
      setHabits(habitsRes.data || [])
      setCompletedToday(completionsRes.data?.map(c => c.habit_id) || [])
      setScheduleEvents(scheduleRes.data || [])
      
      // Calculate current streak (consecutive days with at least 1 completion)
      const completionDates = [...new Set(allCompletionsRes.data?.map(c => c.completed_date) || [])].sort().reverse()
      let currentStreak = 0
      const todayDate = new Date().toISOString().split('T')[0]
      const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      
      if (completionDates.length > 0 && (completionDates[0] === todayDate || completionDates[0] === yesterdayDate)) {
        let checkDate = completionDates[0]
        for (let i = 0; i < completionDates.length; i++) {
          if (completionDates[i] === checkDate) {
            currentStreak++
            const prevDate = new Date(checkDate)
            prevDate.setDate(prevDate.getDate() - 1)
            checkDate = prevDate.toISOString().split('T')[0]
          } else {
            break
          }
        }
      }
      
      const totalPoints = (allCompletionsRes.data?.length || 0) * 10
      setStats({ currentStreak, totalPoints })
      
      // Calculate weekly progress
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        const dateStr = date.toISOString().split('T')[0]
        const count = allCompletionsRes.data?.filter(c => c.completed_date === dateStr).length || 0
        return { date: dateStr, count }
      })
      setWeeklyProgress(weekData)
    })
  }, [user.id, refreshKey])

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

          <TodayHabits habits={todayHabits} completedToday={completedToday} onComplete={() => setRefreshKey(k => k + 1)} />

          <Link
            href="/habits"
            className="mt-4 w-full py-3 bg-[#F4F4F5] text-gray-900 font-semibold rounded-2xl hover:bg-gray-200 transition text-center block"
          >
            Manage Habits
          </Link>
        </div>

        {/* This Week Progress */}
        <WeekProgress progress={weeklyProgress} />

        <Programs />

        <Schedule events={scheduleEvents} />

        {/* Help & Tips */}
        <HelpTips />

        {/* Floating Action Button */}
        <Link
          href="/coach"
          className="fixed bottom-24 right-8 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition z-40"
        >
          <Sparkles size={24} />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
