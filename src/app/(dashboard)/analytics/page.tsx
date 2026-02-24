import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { BarChart3 } from 'lucide-react'
import { getAnalyticsData } from '@/lib/queries/analytics-data'
import { AnalyticsView } from '@/components/features/analytics/AnalyticsView'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const analyticsData = await getAnalyticsData()

  if (!analyticsData) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 size={28} className="text-gray-900" />
          <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
        </div>
        
        <AnalyticsView data={analyticsData} />
      </div>
      <BottomNav />
    </main>
  )
}
