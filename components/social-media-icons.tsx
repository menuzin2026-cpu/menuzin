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
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

// Snapchat Icon SVG
function SnapchatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.083.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.487.535 6.624 0 11.99-5.367 11.99-11.987C23.97 5.39 18.592.026 11.97.026L12.017 0z" />
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

