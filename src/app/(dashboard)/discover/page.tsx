import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { Compass } from 'lucide-react'
import { DiscoverView } from '@/components/features/discover/DiscoverView'
import { getHabitTemplates } from '@/lib/queries/templates'

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const templates = await getHabitTemplates()

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
