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

  // Handle video playback - iOS requires programmatic play()
  // Note: Event handlers in JSX (onLoadedMetadata, onCanPlay) handle most cases
  // This useEffect is a fallback for when video is already loaded
  useEffect(() => {
    if (!videoRef.current) return
    const video = videoRef.current
    // Check mimeType from R2 field first, then fall back to old media relation
    const mimeType = restaurant.welcomeBgMimeType || restaurant.welcomeBackground?.mimeType
    const isVideo = mimeType?.startsWith('video/') ?? false
    
    if (!isVideo || prefersReducedMotion) {
      video.pause()
      return
    }

    // Try to play immediately if video is already loaded (fallback for fast connections)
    if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
      video.muted = true
      video.play().catch(() => {
        // Silently handle play errors (iOS may block autoplay)
      })
    }
  }, [restaurant.welcomeBgMimeType, restaurant.welcomeBackground?.mimeType, prefersReducedMotion, isLoaded])

  // Use R2 URL if available, otherwise fall back to old media ID
  const backgroundUrl = restaurant.welcomeBgR2Url || (restaurant.welcomeBackgroundMediaId ? `/assets/${restaurant.welcomeBackgroundMediaId}?v=${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}` : null)

  if (!backgroundUrl) {
    return (
      <div 
        className={`absolute inset-0 background-fade-in ${isLoaded ? 'animate-in' : ''}`}
        style={{ backgroundColor: 'var(--app-bg, #400810)' }}
      />
    )
  }

  // Check mimeType from R2 field first, then fall back to old media relation
  const mimeType = restaurant.welcomeBgMimeType || restaurant.welcomeBackground?.mimeType
  const isVideo = mimeType?.startsWith('video/') ?? false
  const shouldShowVideo = isVideo && !prefersReducedMotion

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
            key={`video-${restaurant.welcomeBgR2Key || restaurant.welcomeBackgroundMediaId}-${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}`}
            muted
            playsInline
            autoPlay
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
            onLoadedMetadata={(e) => {
              // Force play on iOS when metadata is loaded
              const video = e.currentTarget
              if (video && !prefersReducedMotion) {
                video.muted = true
                video.play().catch(() => {
                  // iOS may block autoplay - silently handle
                })
              }
            }}
            onCanPlay={(e) => {
              // Force play on iOS when video can play
              const video = e.currentTarget
              if (video && !prefersReducedMotion) {
                video.muted = true
                video.play().catch(() => {
                  // iOS may block autoplay - silently handle
                })
              }
            }}
            onPlay={() => {
              // Video started playing - ensure muted state is maintained
              const video = videoRef.current
              if (video) {
                video.muted = true
              }
            }}
          >
            <source 
              src={backgroundUrl} 
              type="video/mp4" 
            />
          </video>
        </div>
      ) : (
        <img
          key={`image-${restaurant.welcomeBgR2Key || restaurant.welcomeBackgroundMediaId}-${restaurant.updatedAt ? new Date(restaurant.updatedAt).getTime() : Date.now()}`}
          src={backgroundUrl}
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

