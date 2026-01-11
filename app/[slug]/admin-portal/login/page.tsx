'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

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
        toast.success('Login successful!')
        router.push(`/${slug}/admin`)
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
      <div 
        className="backdrop-blur-xl rounded-3xl border p-8 w-full max-w-md"
        style={{
          backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
          borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
          boxShadow: `0 20px 50px -12px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 8px 16px -4px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
        }}
      >
        <div className="text-center mb-8">
          {logoUrl ? (
            <div className="flex items-center justify-center mb-4">
              <div
                className="rounded-full p-4 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--app-bg, #400810)',
                  boxShadow: `
                    0 0 4px var(--auto-primary-glow-strong, rgba(64, 8, 16, 1)),
                    0 0 8px var(--auto-primary-glow-strong, rgba(64, 8, 16, 0.9)),
                    0 0 12px var(--auto-primary-glow, rgba(64, 8, 16, 0.8)),
                    0 0 16px var(--auto-primary-glow, rgba(64, 8, 16, 0.7)),
                    0 0 20px var(--auto-primary-glow, rgba(64, 8, 16, 0.6)),
                    0 0 24px var(--auto-primary-glow-subtle, rgba(64, 8, 16, 0.6)),
                    0 0 32px var(--auto-primary-glow-subtle, rgba(64, 8, 16, 0.5)),
                    0 0 40px var(--auto-edge-accent, rgba(64, 8, 16, 0.5)),
                    0 0 50px var(--auto-edge-accent, rgba(64, 8, 16, 0.4)),
                    0 0 60px var(--auto-edge-accent, rgba(64, 8, 16, 0.3)),
                    0 2px 4px var(--auto-shadow-color, rgba(0, 0, 0, 0.5))
                  `,
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
                    height: 'var(--header-logo-size, 24px)',
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
              className="inline-flex items-center justify-center w-[100px] h-[100px] rounded-full mb-4"
              style={{
                backgroundColor: 'var(--app-bg, #400810)',
                boxShadow: `
                  0 0 4px var(--auto-primary-glow-strong, rgba(64, 8, 16, 1)),
                  0 0 8px var(--auto-primary-glow-strong, rgba(64, 8, 16, 0.9)),
                  0 0 12px var(--auto-primary-glow, rgba(64, 8, 16, 0.8)),
                  0 0 16px var(--auto-primary-glow, rgba(64, 8, 16, 0.7)),
                  0 0 20px var(--auto-primary-glow, rgba(64, 8, 16, 0.6)),
                  0 0 24px var(--auto-primary-glow-subtle, rgba(64, 8, 16, 0.6)),
                  0 0 32px var(--auto-primary-glow-subtle, rgba(64, 8, 16, 0.5)),
                  0 0 40px var(--auto-edge-accent, rgba(64, 8, 16, 0.5)),
                  0 0 50px var(--auto-edge-accent, rgba(64, 8, 16, 0.4)),
                  0 0 60px var(--auto-edge-accent, rgba(64, 8, 16, 0.3)),
                  0 2px 4px var(--auto-shadow-color, rgba(0, 0, 0, 0.5))
                `,
              }}
            />
          )}
          <h1 className="text-2xl font-bold text-white mb-2">
            Admin Login
          </h1>
          <p className="text-white/70">Enter your 4-digit PIN</p>
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
            autoFocus
            required
          />

          <Button
            type="submit"
            variant="ghost"
            disabled={isLoading || pin.length !== 4}
            className="w-full"
            size="lg"
            style={{
              backgroundColor: 'var(--app-bg, #400810)',
              color: 'var(--auto-text-primary, #FFFFFF)',
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push(`/${slug}/menu`)}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  )
}

