import { RestaurantData } from '@/lib/get-restaurant-data'

interface WelcomeLogoProps {
  restaurant: RestaurantData
  isLoaded: boolean
}

export function WelcomeLogo({ restaurant, isLoaded }: WelcomeLogoProps) {
  if (!restaurant.logoMediaId) {
    return null
  }

  return (
    <div className={`absolute top-16 left-0 right-0 px-4 py-4 welcome-fade-in ${isLoaded ? 'animate-in' : ''}`}>
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <img
          src={`/assets/${restaurant.logoMediaId}`}
          alt="Restaurant Logo"
          className="h-16 w-auto object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}

