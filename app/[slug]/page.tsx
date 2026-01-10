import { notFound } from 'next/navigation'
import { getRestaurantData } from '@/lib/get-restaurant-data'
import { WelcomeClient } from './welcome-client'
import { WelcomeBackground } from './welcome-background'
import { WelcomeLogo } from './welcome-logo'
import { WelcomeText } from './welcome-text'
import { WelcomeContact } from './welcome-contact'
import { WelcomeLanguageButtons } from './welcome-language-buttons'
import { SocialMediaIcons } from '@/components/social-media-icons'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function WelcomePage({ params }: PageProps) {
  const { slug } = params

  // Fetch restaurant data server-side
  const restaurant = await getRestaurantData(slug)

  // Return 404 if restaurant doesn't exist (deleted)
  if (!restaurant) {
    notFound()
  }

  return (
    <WelcomeClient restaurant={restaurant}>
      <WelcomeLogo restaurant={restaurant} isLoaded={true} />
      <WelcomeText restaurant={restaurant} isLoaded={true} />
      <WelcomeLanguageButtons slug={slug} isLoaded={true} />
      <WelcomeContact restaurant={restaurant} isLoaded={true} />
      <SocialMediaIcons restaurant={restaurant} isLoaded={true} />
    </WelcomeClient>
  )
}
