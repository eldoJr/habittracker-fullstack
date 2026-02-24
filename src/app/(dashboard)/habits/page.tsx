import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { HabitList } from '@/components/features/habits/HabitList'
import { CreateHabitModal } from '@/components/features/habits/CreateHabitModal'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default async function HabitsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">All Habits</h1>
          </div>
          <CreateHabitModal />
        </div>

        <Suspense fallback={<div className="text-center py-8">Loading habits...</div>}>
          <HabitList />
        </Suspense>
      </div>
      <BottomNav />
    </main>
  )
}
