'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useAdmin } from './admin-context'

export function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { session, isLoading } = useAdmin()

  useEffect(() => {
    // Skip auth check for login page
    if (pathname?.endsWith('/admin-portal/login')) {
      return
    }

    // Wait for session to load
    if (isLoading) {
      return
    }

    // Check if authenticated
    if (!session || !session.authenticated) {
      router.push(`/${slug}/admin-portal/login`)
      return
    }

    // Verify session restaurant matches URL slug (CRITICAL for data isolation)
    if (session.restaurantSlug && session.restaurantSlug !== slug) {
      // Session is for different restaurant - clear session and redirect to login
      console.error(`[SECURITY] Session restaurant mismatch: session slug=${session.restaurantSlug}, URL slug=${slug}`)
      fetch('/api/admin/logout', { method: 'POST' })
      router.push(`/${slug}/admin-portal/login`)
      return
    }
  }, [pathname, router, slug, session, isLoading])

  // Show loading state briefly while checking auth
  if (!pathname?.endsWith('/admin-portal/login') && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7F9F8' }}>
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#27C499] border-r-transparent"></div>
          <p className="mt-4" style={{ color: '#475569' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}




