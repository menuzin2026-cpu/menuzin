'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useAdmin } from '../admin-context'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const { mutateSession } = useAdmin()

  // Fetch logo only for display, not for styling
  useEffect(() => {
    const fetchRestaurantLogo = async () => {
      try {
        const res = await fetch(`/data/restaurant?slug=${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        })
        if (res.ok) {
          const data = await res.json()
          const logo = data.logoR2Url || (data.logoMediaId ? `/assets/${data.logoMediaId}` : null)
          setLogoUrl(logo)
        }
      } catch (error) {
        console.error('Error fetching restaurant logo:', error)
      }
    }
    fetchRestaurantLogo()
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const startTime = performance.now()

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin, slug }),
      })

      const data = await response.json()

      if (response.ok) {
        const loginTime = performance.now() - startTime
        if (process.env.NODE_ENV === 'development') {
          console.log(`[PERF] Login total (client): ${loginTime.toFixed(2)}ms`)
        }
        
        // Revalidate session cache immediately so auth wrapper doesn't redirect back
        await mutateSession()
        
        // Prefetch admin routes for instant navigation
        router.prefetch(`/${slug}/admin-portal`)
        router.prefetch(`/${slug}/admin-portal/menu-builder`)
        router.prefetch(`/${slug}/admin-portal/settings`)
        router.prefetch(`/${slug}/admin-portal/theme`)
        router.prefetch(`/${slug}/admin-portal/typography`)
        
        toast.success('Login successful!')
        
        // Small delay to ensure session is set before redirect
        setTimeout(() => {
          router.push(`/${slug}/admin-portal`)
        }, 100)
      } else {
        toast.error(data.error || 'Invalid PIN')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Failed to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div 
        className="admin-card w-full max-w-md"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D1D5DB',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div className="text-center mb-8">
          {logoUrl ? (
            <div className="flex items-center justify-center mb-6">
              <div
                className="rounded-full p-4 flex items-center justify-center"
                style={{
                  backgroundColor: '#000000',
                  width: '100px',
                  height: '100px',
                  minWidth: '100px',
                  minHeight: '100px',
                }}
              >
                <Image
                  src={logoUrl}
                  alt="Restaurant Logo"
                  width={80}
                  height={24}
                  className="object-contain"
                  style={{ 
                    height: 'auto',
                    width: 'auto',
                    maxWidth: '70px',
                    maxHeight: '70px',
                    aspectRatio: 'auto'
                  }}
                  priority
                  unoptimized={logoUrl.startsWith('/assets/')}
                  sizes="(max-width: 768px) 80px, 80px"
                />
              </div>
            </div>
          ) : (
            <div 
              className="inline-flex items-center justify-center w-[100px] h-[100px] rounded-full mb-6"
              style={{
                backgroundColor: '#000000',
              }}
            />
          )}
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>
            Admin Login
          </h1>
          <p style={{ color: '#475569' }}>Enter your 4-digit PIN</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '')
              if (value.length <= 4) {
                setPin(value)
              }
            }}
            placeholder="0000"
            className="text-center text-2xl tracking-widest"
            style={{
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
            }}
            autoFocus
            required
          />

          <Button
            type="submit"
            disabled={isLoading || pin.length !== 4}
            className="w-full"
            size="lg"
            style={{
              backgroundColor: isLoading || pin.length !== 4 ? '#94A3B8' : '#27C499',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              fontWeight: '500',
              cursor: isLoading || pin.length !== 4 ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && pin.length === 4) {
                e.currentTarget.style.backgroundColor = '#20B08A'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && pin.length === 4) {
                e.currentTarget.style.backgroundColor = '#27C499'
              }
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}

