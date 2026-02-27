'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { NewHabitForm } from '@/components/features/habits/NewHabitForm'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default function NewHabitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
      else setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/habits" className="p-3 bg-[#F4F4F5] rounded-[32px] hover:bg-gray-200 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">New Habit</h1>
        </div>

        <NewHabitForm />
      </div>
      <BottomNav />
    </main>
  )
}
