'use client'

import Image from 'next/image'

interface PoweredByFooterProps {
  footerLogoUrl?: string | null
}

const PLATFORM_URL = 'https://www.menuzin.com'

// Low-quality base64 placeholder for blur effect
const blurDataURL = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjE4IiBmaWxsPSIjNDAwODEwIi8+PC9zdmc+'

export function PoweredByFooter({ footerLogoUrl }: PoweredByFooterProps) {
  // Don't render if no logo is provided
  if (!footerLogoUrl) {
    return null
  }

  return (
    <footer
      className="fixed left-0 right-0 z-10 w-full"
      style={{
        bottom: 0,
        backgroundColor: 'transparent',
        borderTop: 'none',
        paddingTop: 'calc(4px + env(safe-area-inset-bottom, 0))',
        paddingBottom: 'calc(4px + env(safe-area-inset-bottom, 0))',
      }}
    >
      <a
        href={PLATFORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-1 px-4 w-full"
        style={{
          color: 'var(--auto-text-primary, #FFFFFF)',
          textDecoration: 'none',
        }}
      >
        <span className="text-sm font-medium">Powered by</span>
        {footerLogoUrl && (
          <Image
            src={footerLogoUrl}
            alt="Menuzin"
            width={60}
            height={18}
            className="h-4 w-auto object-contain"
            style={{ 
              maxHeight: '18px',
              width: 'auto',
              height: '18px',
              aspectRatio: '60/18'
            }}
            priority
            placeholder="blur"
            blurDataURL={blurDataURL}
            unoptimized={true}
            sizes="60px"
          />
        )}
      </a>
    </footer>
  )
}

