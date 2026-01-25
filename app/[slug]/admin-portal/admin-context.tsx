'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useParams } from 'next/navigation'

interface AdminSession {
  authenticated: boolean
  restaurantId: string | null
  restaurantSlug: string | null
  adminUserId: string | null
}

interface AdminBootstrap {
  restaurant: {
    id: string
    slug: string
  }
  uiSettings: any
  settings: any
  theme: any
  menuStructure: {
    sections: Array<{
      id: string
      nameEn: string
      nameKu: string
      nameAr: string
      sortOrder: number
      isActive: boolean
      categories: Array<{
        id: string
        nameEn: string
        nameKu: string
        nameAr: string
        sortOrder: number
        isActive: boolean
        itemCount: number
      }>
    }>
  }
}

interface AdminContextType {
  session: AdminSession | null
  bootstrap: AdminBootstrap | null
  isLoading: boolean
  error: Error | null
  refreshSession: () => Promise<void>
  refreshBootstrap: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const params = useParams()
  const slug = params.slug as string
  const [session, setSession] = useState<AdminSession | null>(null)
  const [bootstrap, setBootstrap] = useState<AdminBootstrap | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/admin/check-session', {
        credentials: 'include',
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          setSession({
            authenticated: false,
            restaurantId: null,
            restaurantSlug: null,
            adminUserId: null,
          })
          return
        }
        throw new Error(`Session check failed: ${response.status}`)
      }

      const data = await response.json()
      setSession({
        authenticated: data.authenticated,
        restaurantId: data.restaurantId,
        restaurantSlug: data.restaurantSlug,
        adminUserId: data.adminUserId,
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch session'))
      setSession({
        authenticated: false,
        restaurantId: null,
        restaurantSlug: null,
        adminUserId: null,
      })
    }
  }

  const fetchBootstrap = async () => {
    try {
      const response = await fetch(`/api/${slug}/admin/bootstrap`, {
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error(`Bootstrap failed: ${response.status}`)
      }

      const data = await response.json()
      setBootstrap(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bootstrap'))
    }
  }

  const refreshSession = async () => {
    await fetchSession()
  }

  const refreshBootstrap = async () => {
    await fetchBootstrap()
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      
      // Fetch session first
      await fetchSession()
      
      // Small delay to ensure session state is set
      setTimeout(async () => {
        // Check if authenticated before fetching bootstrap
        const sessionResponse = await fetch('/api/admin/check-session', {
          credentials: 'include',
        })
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json()
          if (sessionData.authenticated) {
            await fetchBootstrap()
          }
        }
        setIsLoading(false)
      }, 50)
    }

    loadData()
  }, [slug])

  return (
    <AdminContext.Provider
      value={{
        session,
        bootstrap,
        isLoading,
        error,
        refreshSession,
        refreshBootstrap,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
