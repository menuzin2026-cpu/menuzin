'use client'

import React, { useState, useEffect } from 'react'
import { RestaurantData } from '@/lib/get-restaurant-data'
import { WelcomeBackground } from './welcome-background'

interface WelcomeClientProps {
  restaurant: RestaurantData
  children: React.ReactNode
}

export function WelcomeClient({ restaurant, children }: WelcomeClientProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Start fade-in after 3 seconds
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const overlayStyle = {
    backgroundColor: restaurant.welcomeOverlayColor || '#000000',
    opacity: restaurant.welcomeOverlayOpacity || 0.5,
  }

  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden">
      {/* Background */}
      <WelcomeBackground restaurant={restaurant} isLoaded={isLoaded} />
      
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={overlayStyle}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen p-6 pb-24">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { isLoaded } as any)
          }
          return child
        })}
      </div>
    </div>
  )
}
