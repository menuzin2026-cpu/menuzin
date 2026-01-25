'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminAuthWrapper } from './auth-wrapper'
import { AdminProvider } from './admin-context'
import './admin-theme.css'

function AdminRoutePrefetcher() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    // Prefetch all admin routes for instant navigation
    const routes = [
      `/${slug}/admin-portal/menu-builder`,
      `/${slug}/admin-portal/settings`,
      `/${slug}/admin-portal/theme`,
      `/${slug}/admin-portal/typography`,
      `/${slug}/admin-portal/feedback`,
    ]

    routes.forEach((route) => {
      router.prefetch(route)
    })
  }, [router, slug])

  return null
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-root">
      <AdminProvider>
        <AdminRoutePrefetcher />
        <AdminAuthWrapper>{children}</AdminAuthWrapper>
      </AdminProvider>
    </div>
  )
}

