'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { generateColorScheme, normalizeToHex } from '@/lib/color-utils'

export function ThemeProvider() {
  const pathname = usePathname()

  useEffect(() => {
    // Fetch theme and apply CSS variables with retry
    const applyTheme = async (retryCount = 0) => {
      try {
        // Extract slug from current pathname (re-run when pathname changes)
        const pathParts = (pathname || window.location.pathname).split('/').filter(Boolean)
        const slug = pathParts.length > 0 && pathParts[0] !== 'super-admin' && pathParts[0] !== 'admin' ? pathParts[0] : 'legends-restaurant'
        
        // Skip theme loading for super-admin and admin-portal (admin uses hardcoded theme)
        if (pathParts[0] === 'super-admin' || pathname?.startsWith('/super-admin') || pathname?.includes('/admin-portal')) {
          return
        }
        
        // Fetch with cache-busting and slug parameter
        const response = await fetch(`/data/theme?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, {
          cache: 'no-store',
        })
        if (response.ok) {
          const data = await response.json()
          if (data.theme) {
            const theme = data.theme
            
            // Apply background color via CSS variable
            document.documentElement.style.setProperty('--app-bg', theme.appBg)
            document.body.style.backgroundColor = theme.appBg
            document.documentElement.style.backgroundColor = theme.appBg
            
            // Generate and apply complementary color scheme (always based on selected color)
            const hexColor = normalizeToHex(theme.appBg)
            const colorScheme = generateColorScheme(hexColor)
            
            // Apply all generated colors as CSS variables
            Object.entries(colorScheme).forEach(([key, value]) => {
              let varName = `--auto-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
              // Fix edgeAccent conversion (edgeAccent -> edge-accent, not edge-ccent)
              if (key === 'edgeAccent') {
                varName = '--auto-edge-accent'
              }
              // Fix lighterSurface conversion
              if (key === 'lighterSurface') {
                varName = '--auto-lighter-surface'
              }
              document.documentElement.style.setProperty(varName, value)
            })
          }
        }
      } catch (error) {
        console.error('Error applying theme:', error)
        if (retryCount < 1) {
          setTimeout(() => applyTheme(retryCount + 1), 500)
        }
      }
    }

    applyTheme()
    
    // Listen for theme changes (for preview mode in admin)
    const handleThemeUpdate = () => {
      applyTheme()
    }
    window.addEventListener('theme-updated', handleThemeUpdate)
    
    return () => {
      window.removeEventListener('theme-updated', handleThemeUpdate)
    }
  }, [pathname]) // Re-run when pathname changes (different restaurant)

  return null
}

