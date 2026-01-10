'use client'

import Image from 'next/image'

interface MenuHeaderProps {
  logoUrl?: string
}

// Low-quality base64 placeholder for blur effect
const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjMyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMzIiIGZpbGw9IiM0MDA4MTAiLz48L3N2Zz4='

export function MenuHeader({ logoUrl }: MenuHeaderProps) {
  return (
    <header 
      className="relative z-10 px-2 sm:px-4 py-4 backdrop-blur-xl transition-all duration-300 ease-in-out border-b w-full overflow-x-hidden"
      style={{
        backgroundColor: 'var(--header-footer-bg-color, var(--auto-surface-bg, rgba(255, 255, 255, 0.1)))',
        borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
        boxShadow: `0 2px 4px -1px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
      }} 
    >
      <div className="flex items-center justify-center max-w-7xl mx-auto w-full">
        {/* Centered Logo */}
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt="Restaurant Logo"
            width={120}
            height={32}
            className="object-contain"
            style={{ 
              height: 'var(--header-logo-size, 32px)',
              width: 'auto',
              maxWidth: '100%',
              aspectRatio: 'auto'
            }}
            priority
            placeholder="blur"
            blurDataURL={blurDataURL}
            unoptimized={logoUrl.startsWith('/assets/')}
            sizes="(max-width: 768px) 120px, 120px"
          />
        ) : (
          <div 
            className="bg-white/20 rounded-lg backdrop-blur-sm"
            style={{ 
              height: 'var(--header-logo-size, 32px)',
              width: 'calc(var(--header-logo-size, 32px) * 2.5)'
            }}
          />
        )}
      </div>
    </header>
  )
}

