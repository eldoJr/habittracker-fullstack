'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DashboardHome } from '@/components/features/dashboard/DashboardHome'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/database'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        window.location.href = '/login'
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!user || !profile) return null

  return <DashboardHome user={user} profile={profile} />
}
