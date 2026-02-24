import { SkeletonHabit } from '@/components/atoms/Skeleton'
import { BottomNav } from '@/components/features/dashboard/BottomNav'
import { ArrowLeft } from 'lucide-react'

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-2">
              <ArrowLeft size={24} className="text-gray-400" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse" />
        </div>

        <div className="space-y-4">
          <SkeletonHabit />
          <SkeletonHabit />
          <SkeletonHabit />
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
