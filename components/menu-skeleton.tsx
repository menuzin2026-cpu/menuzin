'use client'

// Skeleton component for menu item cards
export function MenuItemSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border backdrop-blur-xl h-full flex flex-col relative animate-pulse" style={{
      backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
      borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
      margin: 0,
      padding: 0,
    }}>
      <div className="aspect-square w-full relative bg-gray-700/30" style={{ margin: 0, padding: 0 }} />
      <div className="p-2 backdrop-blur-sm flex-shrink-0 space-y-2" style={{ margin: 0 }}>
        <div className="h-4 bg-gray-700/30 rounded w-3/4" />
        <div className="h-3 bg-gray-700/20 rounded w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700/30 rounded w-16" />
          <div className="w-8 h-8 bg-gray-700/30 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Skeleton component for category section
export function CategorySectionSkeleton() {
  return (
    <div className="space-y-4 mb-8">
      {/* Category title skeleton */}
      <div className="px-2 sm:px-4">
        <div className="h-6 bg-gray-700/30 rounded w-32 animate-pulse" style={{ marginBottom: '12px' }} />
      </div>
      {/* Items grid skeleton */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-3 px-2 sm:px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// Skeleton component for section header
export function SectionHeaderSkeleton() {
  return (
    <div className="px-2 sm:px-4 py-6">
      <div className="h-8 bg-gray-700/30 rounded w-48 animate-pulse" />
    </div>
  )
}
