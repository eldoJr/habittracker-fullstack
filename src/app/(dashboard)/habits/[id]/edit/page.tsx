import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getHabit } from '@/lib/queries/habits'
import { EditHabitForm } from '@/components/features/habits/EditHabitForm'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default async function EditHabitPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const habit = await getHabit(params.id)

  if (!habit) {
    redirect('/habits')
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/habits/${params.id}`} className="p-3 bg-[#F4F4F5] rounded-[32px] hover:bg-gray-200 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Edit Habit</h1>
        </div>

        <EditHabitForm habit={habit} habitId={params.id} />
      </div>
      <BottomNav />
    </main>
  )
}
