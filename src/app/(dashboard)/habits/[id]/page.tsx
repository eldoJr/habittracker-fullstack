import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getHabit, getHabitCompletions, getHabitStreak } from '@/lib/queries/habits'
import { HabitDetailView } from '@/components/features/habits/HabitDetailView'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default async function HabitDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  try {
    const habit = await getHabit(params.id)
    const completions = await getHabitCompletions(params.id, 90)
    const streak = await getHabitStreak(params.id)

    return (
      <main className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/habits" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft size={20} />
            Back to Habits
          </Link>

          <Suspense fallback={<div>Loading...</div>}>
            <HabitDetailView 
              habit={habit} 
              completions={completions}
              streak={streak?.current_streak || 0}
            />
          </Suspense>
        </div>
        <BottomNav />
      </main>
    )
  } catch (error) {
    notFound()
  }
}
