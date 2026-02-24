import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            className={cn(
              'w-full py-2.5 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition',
              icon ? 'pl-10 pr-4' : 'px-4',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">⚠️</span> {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
