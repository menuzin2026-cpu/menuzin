'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useParams } from 'next/navigation'

export function SuperAdminAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    if (pathname?.endsWith('/super-admin/login')) {
      return
    }

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/super-admin/check-session', {
          method: 'GET',
          credentials: 'include',
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push(`/${slug}/super-admin/login`)
            return
          }
          router.push(`/${slug}/super-admin/login`)
        }
      } catch (error) {
        router.push(`/${slug}/super-admin/login`)
      }
    }

    checkAuth()
  }, [pathname, router, slug])

  if (!pathname?.endsWith('/super-admin/login')) {
    return <>{children}</>
  }

  return <>{children}</>
}

