import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardHome } from '@/components/features/dashboard/DashboardHome'
import { getUserProfile } from '@/lib/queries/profile'

export default async function Home() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      redirect('/login')
    }

    const profile = await getUserProfile(user.id)
    return <DashboardHome user={user} profile={profile} />
  } catch (error) {
    redirect('/login')
  }
}
