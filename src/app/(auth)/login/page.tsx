'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { resetPassword } from '@/lib/actions/auth'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { AuthLayout } from '@/components/features/auth/AuthLayout'
import toast from 'react-hot-toast'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const loadingToast = toast.loading('Signing in...')

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()
    
    const { error, data } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })

    if (error) {
      toast.error(error.message, { id: loadingToast, icon: <AlertCircle size={20} /> })
      setLoading(false)
    } else {
      toast.success('Login successful!', { id: loadingToast })
      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = '/'
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)

    const formData = new FormData()
    formData.append('email', resetEmail)
    const loadingToast = toast.loading('Sending reset email...')

    const result = await resetPassword(formData)
    
    if (result.success) {
      toast.success(result.message, { id: loadingToast, duration: 5000 })
      setShowForgotPassword(false)
      setResetEmail('')
    } else {
      toast.error(result.message, { id: loadingToast })
    }
    
    setResetLoading(false)
  }

  if (showForgotPassword) {
    return (
      <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            id="reset-email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
            icon={<Mail size={18} />}
          />
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForgotPassword(false)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" disabled={resetLoading} className="flex-1">
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your habit journey">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          icon={<Mail size={18} />}
        />
        
        <div>
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            required
            minLength={6}
            icon={<Lock size={18} />}
          />
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-gray-600 hover:text-gray-900 mt-2 transition"
          >
            Forgot password?
          </button>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-gray-900 font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
