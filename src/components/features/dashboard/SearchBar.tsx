'use client'

import { Search } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder="Search habits, activities..."
        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-gray-300 transition text-gray-900 placeholder:text-gray-400"
      />
    </div>
  )
}
