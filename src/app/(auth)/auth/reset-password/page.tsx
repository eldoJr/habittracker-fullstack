'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { AuthLayout } from '@/components/features/auth/AuthLayout'
import toast from 'react-hot-toast'
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Updating password...')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        toast.error(error.message, { id: loadingToast, icon: <AlertCircle size={20} /> })
      } else {
        toast.success('Password updated successfully!', { 
          id: loadingToast,
          icon: <CheckCircle2 size={20} />
        })
        setTimeout(() => router.push('/'), 1500)
      }
    } catch (error) {
      toast.error('Something went wrong', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          icon={<Lock size={18} />}
        />
        
        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          icon={<Lock size={18} />}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
