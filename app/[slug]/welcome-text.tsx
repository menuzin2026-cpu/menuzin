import { RestaurantData } from '@/lib/get-restaurant-data'

interface WelcomeTextProps {
  restaurant: RestaurantData
  isLoaded: boolean
}

export function WelcomeText({ restaurant, isLoaded }: WelcomeTextProps) {
  if (!restaurant.welcomeTextEn) {
    return null
  }

  return (
    <div className="w-full max-w-[280px] mb-6 text-center">
      <p className="text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed welcome-text-lighting luxury-font">
        {restaurant.welcomeTextEn}
      </p>
    </div>
  )
}

