import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-600 font-medium">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-xl">
          {children}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  )
}
