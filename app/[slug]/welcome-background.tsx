'use client'

import { useRef, useEffect, useState } from 'react'
import { RestaurantData } from '@/lib/get-restaurant-data'

interface WelcomeBackgroundProps {
  restaurant: RestaurantData
  isLoaded: boolean
}

export function WelcomeBackground({ restaurant, isLoaded }: WelcomeBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches && videoRef.current) {
        videoRef.current.pause()
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Handle video playback
  useEffect(() => {
    if (!videoRef.current) return
    const video = videoRef.current
    const isVideo = restaurant.welcomeBackground?.mimeType?.startsWith('video/') ?? false
    
    if (isVideo && !prefersReducedMotion) {
      video.muted = true
      video.play().catch(() => {
        // Silently handle play errors
      })
    } else if (isVideo && prefersReducedMotion) {
      video.pause()
    }
  }, [restaurant.welcomeBackground?.mimeType, prefersReducedMotion])

  if (!restaurant.welcomeBackgroundMediaId) {
    return (
      <div 
        className={`absolute inset-0 background-fade-in ${isLoaded ? 'animate-in' : ''}`}
        style={{ backgroundColor: 'var(--app-bg, #400810)' }}
      />
    )
  }

  const isVideo = restaurant.welcomeBackground?.mimeType?.startsWith('video/') ?? false
  const shouldShowVideo = isVideo && !prefersReducedMotion
  const assetUrl = `/assets/${restaurant.welcomeBackgroundMediaId}?v=${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}`

  return (
    <div 
      className={`absolute inset-0 background-fade-in ${isLoaded ? 'animate-in' : ''}`}
    >
      {shouldShowVideo ? (
        <div 
          className="w-full h-full absolute inset-0"
          style={{ 
            zIndex: 2,
            backgroundColor: 'var(--app-bg, #400810)',
          }}
        >
          <video
            ref={videoRef}
            key={`video-${restaurant.welcomeBackgroundMediaId}-${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}`}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            disablePictureInPicture
            controls={false}
            className="w-full h-full object-cover absolute inset-0"
            style={{ 
              opacity: 1, 
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          >
            <source 
              src={assetUrl} 
              type="video/mp4" 
            />
          </video>
        </div>
      ) : (
        <img
          key={`image-${restaurant.welcomeBackgroundMediaId}-${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}`}
          src={assetUrl}
          alt="Welcome Background"
          className="w-full h-full object-cover absolute inset-0"
          style={{ 
            zIndex: 2,
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  )
}

