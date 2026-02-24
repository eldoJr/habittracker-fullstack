import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { Compass } from 'lucide-react'

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Compass size={32} className="text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
        </div>
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 text-center">
          <p className="text-gray-600">Explore new habits and programs</p>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
