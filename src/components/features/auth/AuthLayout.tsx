import { ReactNode } from 'react'
import Image from 'next/image'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.jpg"
              alt="Habit Tracker Logo"
              width={64}
              height={64}
              className="rounded-2xl shadow-lg"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>

        {children}

        <p className="text-center text-xs text-gray-400 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  )
}
