'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logout } from '@/lib/actions/auth'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { ProfileView } from '@/components/features/profile/ProfileView'
import { SettingsView } from '@/components/features/profile/SettingsView'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      
      supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          setProfile(data)
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

  if (!user) return null

  const age = profile?.date_of_birth ? Math.floor((Date.now() - new Date(profile.date_of_birth).getTime()) / 31557600000) : null

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
