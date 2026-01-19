'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { WelcomeClient } from './welcome-client'
import { WelcomeBackground } from './welcome-background'
import { WelcomeLogo } from './welcome-logo'
import { WelcomeText } from './welcome-text'
import { WelcomeContact } from './welcome-contact'
import { WelcomeLanguageButtons } from './welcome-language-buttons'
import { SocialMediaIcons } from '@/components/social-media-icons'
import { RestaurantData } from '@/lib/get-restaurant-data'

export default function WelcomePage() {
  const params = useParams()
  const slug = params.slug as string
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Fetch from fast cached menu-bootstrap endpoint instead of slow /data/restaurant
    const fetchBootstrap = async () => {
      try {
        const res = await fetch(`/api/${slug}/public/menu-bootstrap`)
        if (!res.ok) {
          if (res.status === 404) {
            setError(true)
            setIsLoading(false)
            return
          }
          throw new Error('Failed to fetch')
        }
        const data = await res.json()
        
        if (!data.restaurant) {
          setError(true)
          setIsLoading(false)
          return
        }

        // Transform bootstrap data to RestaurantData format
        const restaurantData: RestaurantData = {
          id: data.restaurant.id,
          nameKu: data.restaurant.nameKu,
          nameEn: data.restaurant.nameEn,
          nameAr: data.restaurant.nameAr,
          logoMediaId: data.restaurant.logoMediaId,
          logo: null, // Not needed for welcome page (uses R2 URL)
          footerLogoMediaId: null,
          footerLogo: null,
          welcomeBackgroundMediaId: data.restaurant.welcomeBackgroundMediaId,
          welcomeBackground: null, // Not needed for welcome page (uses R2 URL and mimeType)
          logoR2Url: data.restaurant.logoR2Url,
          welcomeBgR2Url: data.restaurant.welcomeBgR2Url,
          welcomeBgMimeType: data.restaurant.welcomeBgMimeType,
          welcomeOverlayColor: data.restaurant.welcomeOverlayColor || '#000000',
          welcomeOverlayOpacity: data.restaurant.welcomeOverlayOpacity ?? 0.5,
          welcomeTextEn: data.restaurant.welcomeTextEn,
          googleMapsUrl: data.restaurant.googleMapsUrl,
          phoneNumber: data.restaurant.phoneNumber,
          instagramUrl: data.restaurant.instagramUrl,
          snapchatUrl: data.restaurant.snapchatUrl,
          tiktokUrl: data.restaurant.tiktokUrl,
          serviceChargePercent: data.restaurant.serviceChargePercent ?? 0,
          brandColors: null, // Not needed for welcome page
          updatedAt: data.restaurant.updatedAt ? new Date(data.restaurant.updatedAt) : new Date(),
        }

        setRestaurant(restaurantData)
        setIsLoading(false)
      } catch (err) {
        console.error('[ERROR] Welcome page - Error fetching bootstrap:', err)
        setError(true)
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchBootstrap()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
        <div className="text-white">Restaurant not found</div>
      </div>
    )
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
