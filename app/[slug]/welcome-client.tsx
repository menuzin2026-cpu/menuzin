'use client'

import { useState, useEffect } from 'react'
import { RestaurantData } from '@/lib/get-restaurant-data'
import { WelcomeBackground } from './welcome-background'

interface WelcomeClientProps {
  restaurant: RestaurantData
  children: React.ReactNode
}

export function WelcomeClient({ restaurant, children }: WelcomeClientProps) {
  const [isIntroVisible, setIsIntroVisible] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      // Show immediately if user prefers reduced motion
      setIsIntroVisible(true)
      return
    }

    // Otherwise, wait 2 seconds before showing
    const timer = setTimeout(() => {
      setIsIntroVisible(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const overlayStyle = {
    backgroundColor: restaurant.welcomeOverlayColor || '#000000',
    opacity: restaurant.welcomeOverlayOpacity || 0.5,
  }

  return (
    <div className="welcome-page-container relative min-h-dvh w-full overflow-x-hidden overflow-y-hidden">
      {/* Background */}
      <WelcomeBackground restaurant={restaurant} isLoaded={true} />
      
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={overlayStyle}
      />

      {/* Content - wrapped with fade-in animation */}
      <div className={`relative z-10 flex flex-col items-center justify-end min-h-screen p-6 pb-24 welcome-intro-content ${isIntroVisible ? 'welcome-intro-visible' : ''}`}>
        {children}
      </div>
    </div>
  )
}
