'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'

export function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    // Only run on admin pages (not public pages like /menu or /welcome)
    if (!pathname || (!pathname.includes('/admin') && !pathname.includes('/admin-portal'))) {
      return
    }

    // Skip auth check for login page
    if (pathname?.endsWith('/admin/login') || pathname?.endsWith('/admin-portal/login')) {
      return
    }

    // Check authentication for other admin pages
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-session', {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
        })
        
        if (!response.ok) {
          // 401 is expected when not logged in or session expired - don't log to console
          if (response.status === 401) {
            // Check if it's SESSION_EXPIRED
            try {
              const errorData = await response.json()
              if (errorData.error === 'SESSION_EXPIRED' || errorData.ok === false) {
                // Session expired - redirect to login silently
                router.push(`/${slug}/admin-portal/login`)
                return
              }
            } catch {
              // If parsing fails, still redirect on 401 silently
            }
            router.push(`/${slug}/admin-portal/login`)
            return
          }
          // Only log unexpected errors (not 401) in development
          if (process.env.NODE_ENV === 'development' && response.status !== 401) {
            console.error('Auth check failed with status:', response.status)
          }
          if (response.status !== 401) {
            router.push(`/${slug}/admin-portal/login`)
          }
          return
        }

        // Verify session restaurant matches URL slug (CRITICAL for data isolation)
        const sessionData = await response.json()
        if (sessionData.authenticated && sessionData.restaurantSlug && sessionData.restaurantSlug !== slug) {
          // Session is for different restaurant - clear session and redirect to login
          console.error(`[SECURITY] Session restaurant mismatch: session slug=${sessionData.restaurantSlug}, URL slug=${slug}`)
          await fetch('/api/admin/logout', { method: 'POST' })
          router.push(`/${slug}/admin/login`)
          return
        }
      } catch (error) {
        // Only log unexpected errors, not network issues
        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Network error, might be offline - don't redirect
          return
        }
        // Don't log 401 errors as they're expected
        if (!(error instanceof Error && error.message.includes('401'))) {
          console.error('Auth check failed:', error)
        }
        router.push(`/${slug}/admin-portal/login`)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Don't render children until we've checked auth (except for login page)
  if (!pathname?.endsWith('/admin/login')) {
    // Return null briefly while checking, then render children
    // In a real app, you might want a loading state here
    return <>{children}</>
  }

  return <>{children}</>
}




