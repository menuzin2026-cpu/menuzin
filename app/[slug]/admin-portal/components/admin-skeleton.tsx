export function AdminPageSkeleton() {
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div
          className="admin-card mb-8"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="admin-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function MenuBuilderSkeleton() {
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div
          className="admin-card mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        </div>

        {/* Sections Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="admin-card"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
              <div className="space-y-3 ml-4">
                {[1, 2].map((j) => (
                  <div key={j} className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function SettingsSkeleton() {
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div
          className="admin-card mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="h-8 bg-gray-200 rounded w-40 animate-pulse" />
        </div>

        {/* Form Skeleton */}
        <div
          className="admin-card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
