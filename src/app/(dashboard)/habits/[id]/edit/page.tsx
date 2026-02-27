'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EditHabitForm } from '@/components/features/habits/EditHabitForm'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default function EditHabitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [habit, setHabit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      
      supabase.from('habits').select('*').eq('id', params.id).single().then(({ data }) => {
        if (!data) {
          router.push('/habits')
          return
        }
        setHabit(data)
        setLoading(false)
      })
    })
  }, [params.id, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!habit) return null

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
