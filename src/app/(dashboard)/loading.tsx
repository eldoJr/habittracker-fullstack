import { SkeletonCard, SkeletonStats, SkeletonList } from '@/components/atoms/Skeleton'
import { BottomNav } from '@/components/features/dashboard/BottomNav'

export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-48" />
            <div className="h-12 bg-gray-200 rounded w-40" />
            <div className="h-12 bg-gray-200 rounded w-32" />
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Search Skeleton */}
        <div className="h-14 bg-white border-2 border-gray-200 rounded-2xl animate-pulse" />

        {/* Stats Skeleton */}
        <SkeletonStats />

        {/* Daily Habits Skeleton */}
        <SkeletonCard>
          <SkeletonList />
        </SkeletonCard>

        {/* Week Progress Skeleton */}
        <SkeletonCard />

        {/* Programs Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="flex gap-4">
            <div className="w-48 h-56 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="w-48 h-56 bg-gray-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  )
}
