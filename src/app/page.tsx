import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHome } from '@/components/features/dashboard/DashboardHome'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <DashboardHome user={user} />
}
