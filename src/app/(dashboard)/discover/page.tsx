'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { Compass } from 'lucide-react'
import { DiscoverView } from '@/components/features/discover/DiscoverView'

export default function DiscoverPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      
      supabase.from('habit_templates').select('*').then(({ data }) => {
        setTemplates(data || [])
        setLoading(false)
      })
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
          <Compass size={28} className="text-gray-900" />
          <h1 className="text-2xl font-extrabold text-gray-900">Discover</h1>
        </div>
        
        <DiscoverView templates={templates} />
      </div>
      <BottomNav />
    </main>
  )
}
