'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { updateProfile } from '@/lib/actions/profile'
import type { Database } from '@/types/database-production'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']

interface EditProfileModalProps {
  profile: UserProfile
  onClose: () => void
}

export function EditProfileModal({ profile, onClose }: EditProfileModalProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const loadingToast = toast.loading('Updating profile...')

    try {
      const result = await updateProfile(formData)
      
      if (result.success) {
        toast.success('Profile updated!', { id: loadingToast })
        router.refresh()
        onClose()
      } else {
        toast.error(result.error || 'Failed to update', { id: loadingToast })
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Something went wrong', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            name="fullName"
            label="Full Name"
            defaultValue={profile.full_name || ''}
            required
          />

          <Input
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            defaultValue={profile.date_of_birth || ''}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              name="gender"
              defaultValue={profile.gender || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={profile.bio || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
