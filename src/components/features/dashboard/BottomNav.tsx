'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, Compass, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/analytics', icon: BarChart3, label: 'Stats' },
  { href: '/discover', icon: Compass, label: 'Discover' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#F4F4F5] rounded-[32px] flex justify-around items-center py-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-2 px-4 transition-colors"
              >
                <Icon
                  size={20}
                  className={active ? 'text-gray-900' : 'text-gray-400'}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-xs font-medium ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
