'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { signup } from '@/lib/actions/auth'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { AuthLayout } from '@/components/features/auth/AuthLayout'
import toast from 'react-hot-toast'
import { Check, User, Mail, Lock, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Account', description: 'Create your account' },
  { id: 2, title: 'Profile', description: 'Tell us about yourself' },
  { id: 3, title: 'Review', description: 'Confirm your details' },
]

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  function updateField(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  function validateStep1() {
    const newErrors: Record<string, string> = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (step === 1) {
      if (validateStep1()) {
        setStep(2)
      } else {
        toast.error('Please fix the errors before continuing')
      }
      return
    }

    if (step === 2) {
      setStep(3)
      return
    }

    // Final submission
    setLoading(true)
    const form = new FormData()
    form.append('fullName', formData.fullName)
    form.append('email', formData.email)
    form.append('password', formData.password)
    form.append('dateOfBirth', formData.dateOfBirth)
    form.append('gender', formData.gender)
    form.append('timezone', formData.timezone)
    
    const loadingToast = toast.loading('Creating your account...')

    try {
      const result = await signup(form)
      
      if (!result.success) {
        toast.error(result.message, { id: loadingToast, icon: <AlertCircle size={20} /> })
        setLoading(false)
      } else {
        if (result.error === 'EMAIL_CONFIRMATION_REQUIRED') {
          toast.success(result.message, { 
            id: loadingToast, 
            duration: 6000,
            icon: <Mail size={20} />
          })
        } else {
          toast.success('Account created successfully!', { 
            id: loadingToast,
            icon: <CheckCircle2 size={20} />
          })
        }
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle={`Step ${step} of 3`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step > s.id ? 'bg-gray-900 text-white scale-100' :
                step === s.id ? 'bg-gray-900 text-white scale-110' :
                'bg-gray-200 text-gray-400 scale-100'
              }`}>
                {step > s.id ? <Check size={20} /> : s.id}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 transition-all ${
                  step > s.id ? 'bg-gray-900' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center font-medium">{STEPS[step - 1].description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Input
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                placeholder="John Doe"
                required
                icon={<User size={18} />}
                error={errors.fullName}
              />
              
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                required
                icon={<Mail size={18} />}
                error={errors.email}
              />
              
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                icon={<Lock size={18} />}
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock size={18} />}
                error={errors.confirmPassword}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Input
                label="Date of Birth (Optional)"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                icon={<Calendar size={18} />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender (Optional)
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  ℹ️ This information helps us personalize your experience. You can skip this step or update it later.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 rounded-lg p-5 space-y-3 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-600" />
                  Review Your Information
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Name:</span>
                    <span className="text-gray-900 font-semibold">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Email:</span>
                    <span className="text-gray-900 font-semibold">{formData.email}</span>
                  </div>
                  {formData.dateOfBirth && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Birthday:</span>
                      <span className="text-gray-900 font-semibold">{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                  {formData.gender && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Gender:</span>
                      <span className="text-gray-900 font-semibold capitalize">{formData.gender}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 font-medium">Timezone:</span>
                    <span className="text-gray-900 font-semibold text-xs">{formData.timezone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✅ Everything looks good! Click "Create Account" to get started.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
              disabled={loading}
            >
              Back
            </Button>
          )}
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Creating...' : step === 3 ? 'Create Account' : 'Continue'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
