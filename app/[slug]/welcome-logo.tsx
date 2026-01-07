import { RestaurantData } from '@/lib/get-restaurant-data'

interface WelcomeLogoProps {
  restaurant: RestaurantData
  isLoaded: boolean
}

export function WelcomeLogo({ restaurant, isLoaded }: WelcomeLogoProps) {
  // Use R2 URL if available, otherwise fall back to old media ID
  const logoUrl = restaurant.logoR2Url || (restaurant.logoMediaId ? `/assets/${restaurant.logoMediaId}` : null)
  
  if (!logoUrl) {
    return null
  }

  return (
    <div className="absolute top-16 left-0 right-0 px-4 py-4">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <img
          src={logoUrl}
          alt="Restaurant Logo"
          className="h-16 w-auto object-contain"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  )
}

