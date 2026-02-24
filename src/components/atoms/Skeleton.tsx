export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}

export function SkeletonHabit() {
  return (
    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="w-14 h-14 bg-gray-200 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonStats() {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-16 mb-4" />
      <div className="flex justify-between items-end">
        <div className="h-20 bg-gray-200 rounded w-24" />
        <div className="h-12 bg-gray-200 rounded w-20" />
      </div>
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
