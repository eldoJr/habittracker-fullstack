import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/lib/actions/auth'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { getUserProfile, calculateAge } from '@/lib/queries/profile'
import { ProfileView } from '@/components/features/profile/ProfileView'
import { SettingsView } from '@/components/features/profile/SettingsView'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/atoms/Button'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const profile = await getUserProfile(user.id)
  const age = profile?.date_of_birth ? await calculateAge(profile.date_of_birth) : null

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Profile</h1>

        <ProfileView user={user} profile={profile} age={age} />

        <SettingsView />

        <form action={logout}>
          <Button variant="danger" className="w-full">
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </form>
      </div>
      <BottomNav />
    </main>
  )
}
