'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function SuperAdminAuthWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

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
            router.push('/super-admin/login')
            return
          }
          router.push('/super-admin/login')
        }
      } catch (error) {
        router.push('/super-admin/login')
      }
    }

    checkAuth()
  }, [pathname, router])

  return <>{children}</>
}
