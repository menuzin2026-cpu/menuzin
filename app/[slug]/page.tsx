import { getRestaurantData } from '@/lib/get-restaurant-data'
import { WelcomeClient } from './welcome-client'
import { WelcomeBackground } from './welcome-background'
import { WelcomeLogo } from './welcome-logo'
import { WelcomeText } from './welcome-text'
import { WelcomeContact } from './welcome-contact'
import { WelcomeLanguageButtons } from './welcome-language-buttons'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function WelcomePage({ params }: PageProps) {
  const { slug } = params

  // Fetch restaurant data server-side
  const restaurant = await getRestaurantData(slug)

  if (!restaurant) {
    return (
      <div className="relative min-h-dvh w-full overflow-x-hidden flex items-center justify-center">
        <p className="text-white">Restaurant not found</p>
      </div>
    )
  }

  return (
    <WelcomeClient restaurant={restaurant}>
      <WelcomeLogo restaurant={restaurant} isLoaded={false} />
      <WelcomeText restaurant={restaurant} isLoaded={false} />
      <WelcomeLanguageButtons slug={slug} isLoaded={false} />
      <WelcomeContact restaurant={restaurant} isLoaded={false} />
    </WelcomeClient>
  )
}
