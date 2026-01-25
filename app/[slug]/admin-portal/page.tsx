'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Menu, MessageSquare, Settings, LogOut, Type, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useAdmin } from './admin-context'
import { AdminPageSkeleton } from './components/admin-skeleton'

export default function AdminDashboard() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { session, bootstrap, isLoadingBootstrap } = useAdmin()

  // Show skeleton while loading
  if (isLoadingBootstrap) {
    return <AdminPageSkeleton />
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push(`/${slug}/admin-portal/login`)
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div className="max-w-4xl mx-auto">
        <div 
          className="admin-card flex items-center justify-between mb-8"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06), 0 0 20px rgba(39, 196, 153, 0.3), 0 0 40px rgba(39, 196, 153, 0.15)',
          }}
        >
          <h1 className="text-3xl font-bold" style={{ color: '#0F172A' }}>Admin Dashboard</h1>
          <Button 
            onClick={handleLogout} 
            style={{
              backgroundColor: '#27C499',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20B08A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27C499'}
            size="sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push(`/${slug}/admin-portal/menu-builder`)}
            className="admin-card text-left group transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#27C499'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
          >
            <Menu className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#27C499' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Menu Builder
            </h2>
            <p style={{ color: '#475569' }}>
              Manage sections, categories, and items
            </p>
          </button>

          <button
            onClick={() => router.push(`/${slug}/admin-portal/feedback`)}
            className="admin-card text-left group transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#27C499'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
          >
            <MessageSquare className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#27C499' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Feedback
            </h2>
            <p style={{ color: '#475569' }}>
              View customer feedback
            </p>
          </button>

          <button
            onClick={() => router.push(`/${slug}/admin-portal/settings`)}
            className="admin-card text-left group transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#27C499'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
          >
            <Settings className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#27C499' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Settings
            </h2>
            <p style={{ color: '#475569' }}>
              Restaurant settings and preferences
            </p>
          </button>

          <button
            onClick={() => router.push(`/${slug}/admin-portal/typography`)}
            className="admin-card text-left group transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#27C499'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
          >
            <Type className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#27C499' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Typography
            </h2>
            <p style={{ color: '#475569' }}>
              Customize font sizes and UI appearance
            </p>
          </button>

          <button
            onClick={() => router.push(`/${slug}/admin-portal/theme`)}
            className="admin-card text-left group transition-all hover:scale-[1.02]"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#27C499'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              e.currentTarget.style.borderColor = '#D1D5DB'
            }}
          >
            <Palette className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" style={{ color: '#27C499' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>
              Theme & Colors
            </h2>
            <p style={{ color: '#475569' }}>
              Customize colors for the entire site
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}

