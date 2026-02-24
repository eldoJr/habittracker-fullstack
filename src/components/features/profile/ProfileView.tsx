'use client'

import { useState } from 'react'
import { User, Mail, Calendar, Cake, Edit } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { EditProfileModal } from './EditProfileModal'
import type { Database } from '@/types/database-production'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface ProfileViewProps {
  user: {
    email: string | undefined
  }
  profile: UserProfile | null
  age: number | null
}

export function ProfileView({ user, profile, age }: ProfileViewProps) {
  const [showEdit, setShowEdit] = useState(false)

  // Create a default profile if none exists
  const profileData = profile || {
    id: '',
    full_name: '',
    date_of_birth: null,
    gender: null,
    timezone: 'UTC',
    avatar_url: null,
    bio: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return (
    <>
      <div className="bg-[#F4F4F5] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {profile?.full_name || 'User'}
              </h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail size={14} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">{user.email}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} className="w-full sm:w-auto">
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        </div>

        {(profile?.date_of_birth || profile?.gender || profile?.bio) && (
          <div className="pt-4 border-t border-gray-300 space-y-3">
            {profile?.date_of_birth && (
              <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                <span>Born: {new Date(profile.date_of_birth).toLocaleDateString()}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                <Cake size={18} className="text-gray-400 flex-shrink-0" />
                <span>Age: {age} years old</span>
              </div>
            )}
            {profile?.gender && (
              <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
                <User size={18} className="text-gray-400 flex-shrink-0" />
                <span className="capitalize">{profile.gender}</span>
              </div>
            )}
            {profile?.bio && (
              <div className="pt-2">
                <p className="text-gray-700 text-sm sm:text-base">{profile.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && (
        <EditProfileModal profile={profileData} onClose={() => setShowEdit(false)} />
      )}
    </>
  )
}
