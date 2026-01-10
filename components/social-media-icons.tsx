'use client'

interface SocialMediaIconsProps {
  restaurant: {
    instagramUrl?: string | null
    snapchatUrl?: string | null
    tiktokUrl?: string | null
  }
  isLoaded: boolean
}

export function SocialMediaIcons({ restaurant, isLoaded }: SocialMediaIconsProps) {
  const hasSocialMedia = restaurant.instagramUrl || restaurant.snapchatUrl || restaurant.tiktokUrl

  if (!hasSocialMedia) {
    return null
  }

  return (
    <div className={`flex items-center justify-center gap-2 mt-2 welcome-fade-in ${isLoaded ? 'animate-in' : ''}`}>
      {restaurant.instagramUrl && (
        <a
          href={restaurant.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all shadow-lg border border-white/20 hover:scale-110 transform duration-300 welcome-box-glow"
          aria-label="Instagram"
        >
          <InstagramIcon className="w-5 h-5 text-white" />
        </a>
      )}
      {restaurant.snapchatUrl && (
        <a
          href={restaurant.snapchatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all shadow-lg border border-white/20 hover:scale-110 transform duration-300 welcome-box-glow"
          aria-label="Snapchat"
        >
          <SnapchatIcon className="w-5 h-5 text-white" />
        </a>
      )}
      {restaurant.tiktokUrl && (
        <a
          href={restaurant.tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all shadow-lg border border-white/20 hover:scale-110 transform duration-300 welcome-box-glow"
          aria-label="TikTok"
        >
          <TikTokIcon className="w-5 h-5 text-white" />
        </a>
      )}
    </div>
  )
}

// Instagram Icon SVG
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.163s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

// Snapchat Icon SVG - Ghost shape (official design: rounded head, two eyes, wavy bottom)
function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="9" r="1.5" fill="currentColor" />
      <path d="M7 14c0-1.1.9-2 2-2 .55 0 1.05.22 1.41.59.36-.37.86-.59 1.41-.59s1.05.22 1.41.59c.36-.37.86-.59 1.41-.59s1.05.22 1.41.59c.36-.37.86-.59 1.41-.59 1.1 0 2 .9 2 2 0 1.657-1.343 3-3 3s-3-1.343-3-3zm10 0c0-1.1.9-2 2-2 .55 0 1.05.22 1.41.59.36-.37.86-.59 1.41-.59s1.05.22 1.41.59c.36-.37.86-.59 1.41-.59s1.05.22 1.41.59c.36-.37.86-.59 1.41-.59 1.1 0 2 .9 2 2 0 1.657-1.343 3-3 3s-3-1.343-3-3z" />
    </svg>
  )
}

// TikTok Icon SVG
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}
