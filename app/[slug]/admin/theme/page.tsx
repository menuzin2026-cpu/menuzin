'use client'

import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Copy, Check, Palette, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { HexColorPicker } from 'react-colorful'
import { generateColorScheme, normalizeToHex } from '@/lib/color-utils'

interface ThemeColors {
  appBg: string
  menuBackgroundR2Url?: string | null
  itemNameTextColor?: string | null
  itemPriceTextColor?: string | null
  itemDescriptionTextColor?: string | null
  bottomNavSectionNameColor?: string | null
  categoryNameColor?: string | null
  headerFooterBgColor?: string | null
  glassTintColor?: string | null
}

const defaultTheme: ThemeColors = {
  appBg: '#400810',
  menuBackgroundR2Url: null,
  itemNameTextColor: null,
  itemPriceTextColor: null,
  itemDescriptionTextColor: null,
  bottomNavSectionNameColor: null,
  categoryNameColor: null,
  headerFooterBgColor: null,
  glassTintColor: null,
}

// Helper function to convert rgba/rgb to hex (for color picker)
const rgbaToHex = (color: string): string => {
  if (color.startsWith('#')) {
    return color
  }
  
  // Handle rgba/rgb
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10)
    const g = parseInt(rgbaMatch[2], 10)
    const b = parseInt(rgbaMatch[3], 10)
    return `#${[r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')}`
  }
  
  return '#000000'
}

// Get initial theme from CSS variable to prevent flash
function getInitialTheme(): ThemeColors {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return defaultTheme
  }
  
  try {
    const currentBg = getComputedStyle(document.documentElement).getPropertyValue('--app-bg').trim()
    if (currentBg && currentBg !== '#400810' && currentBg !== '') {
      return { appBg: currentBg }
    }
  } catch (error) {
    // Fallback to default if there's any error
  }
  
  return defaultTheme
}

export default function ThemePage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [theme, setTheme] = useState<ThemeColors>(getInitialTheme())
  const [previewTheme, setPreviewTheme] = useState<ThemeColors>(getInitialTheme())
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColor, setSelectedColor] = useState<keyof ThemeColors | null>(null)
  const [tempColor, setTempColor] = useState<string>('#000000')
  const [copied, setCopied] = useState<string | null>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const [menuBgPreview, setMenuBgPreview] = useState<string | null>(null)
  const [uploadingMenuBg, setUploadingMenuBg] = useState(false)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  // Apply theme immediately before paint to prevent flash
  useLayoutEffect(() => {
    // Apply current theme from CSS variable immediately
    const initialTheme = getInitialTheme()
    applyThemeToDocument(initialTheme)
  }, [])

  useEffect(() => {
    // Fetch the actual theme from API after initial render
    fetchTheme()
    
    // Fetch restaurant ID for menu background upload
    const fetchRestaurantId = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.id) {
            setRestaurantId(data.id)
          }
        }
      } catch (error) {
        console.error('Error fetching restaurant ID:', error)
      }
    }
    fetchRestaurantId()
  }, [])

  const fetchTheme = async () => {
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      })
      
      if (response.status === 401) {
        // Unauthorized - redirect to login
        router.push(`/${slug}/admin-portal/login`)
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        if (data.theme) {
          const themeData = { ...defaultTheme, ...data.theme }
          setTheme(themeData)
          setPreviewTheme(themeData)
          if (themeData.menuBackgroundR2Url) {
            setMenuBgPreview(themeData.menuBackgroundR2Url)
          }
          // Apply immediately on load
          applyThemeToDocument(themeData)
        }
      } else {
        console.error('Error fetching theme:', response.status, response.statusText)
        toast.error('Failed to load theme settings')
      }
    } catch (error) {
      console.error('Error fetching theme:', error)
      toast.error('Failed to load theme settings')
    }
  }

  const handleColorChange = (key: keyof ThemeColors, value: string | null) => {
    // Only update the preview state, don't apply to document until save
    const newTheme = { ...previewTheme, [key]: value }
    setPreviewTheme(newTheme)
  }

  const applyThemeToDocument = (themeData: ThemeColors) => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    
    // Dispatch event to notify ThemeProvider to update
    window.dispatchEvent(new CustomEvent('theme-updated'))
    
    // Apply CSS variable for background color
    if (document.documentElement) {
      document.documentElement.style.setProperty('--app-bg', themeData.appBg)
    }
    
    // Generate and apply complementary color scheme
    const hexColor = normalizeToHex(themeData.appBg)
    const colorScheme = generateColorScheme(hexColor)
    
    // Apply all generated colors as CSS variables with auto- prefix
    if (document.documentElement) {
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
    
    // Apply background color to body/html
    if (document.body) {
      document.body.style.backgroundColor = themeData.appBg
    }
    
    // Apply to all pages that have hardcoded backgrounds
    const adminPages = document.querySelectorAll('[style*="backgroundColor"]')
    adminPages.forEach((el) => {
      const style = (el as HTMLElement)?.style
      if (style && style.backgroundColor && (
        style.backgroundColor.includes('400810') || 
        style.backgroundColor.includes('rgb(64, 8, 16)') ||
        style.backgroundColor === 'var(--app-bg, #400810)'
      )) {
        style.backgroundColor = themeData.appBg
      }
    })
  }

  const handleMenuBackgroundUpload = async (file: File) => {
    if (!restaurantId) {
      toast.error('Restaurant ID not found')
      return
    }

    setUploadingMenuBg(true)
    try {
      // Validate file
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        toast.error('Please upload an image (JPEG, PNG, WebP) file')
        setUploadingMenuBg(false)
        return
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB')
        setUploadingMenuBg(false)
        return
      }

      // Upload via server-side proxy
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'menuBg')
      formData.append('restaurantId', restaurantId)

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload menu background')
      }

      const { key, publicUrl } = await uploadResponse.json()

      // Update preview with R2 URL
      const updatedTheme = { ...previewTheme, menuBackgroundR2Url: publicUrl, menuBackgroundR2Key: key }
      setPreviewTheme(updatedTheme)
      setMenuBgPreview(publicUrl)
      
      // Save to database
      const saveResponse = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedTheme),
      })

      if (saveResponse.ok) {
        const data = await saveResponse.json()
        if (data.theme) {
          setTheme({ ...defaultTheme, ...data.theme })
        }
        toast.success('Menu background uploaded successfully!')
      } else {
        throw new Error('Failed to save menu background')
      }
    } catch (error: any) {
      console.error('Error uploading menu background:', error)
      toast.error(error.message || 'Failed to upload menu background')
    } finally {
      setUploadingMenuBg(false)
    }
  }

  const handleMenuBackgroundRemove = async () => {
    setMenuBgPreview(null)
    const updatedTheme = { ...previewTheme, menuBackgroundR2Url: null, menuBackgroundR2Key: null }
    setPreviewTheme(updatedTheme)
    await handleSave(updatedTheme)
  }

  const handleMenuBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleMenuBackgroundUpload(file)
    }
  }

  const handleSave = async (themeToSave: ThemeColors = previewTheme) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(themeToSave),
      })

      if (response.status === 401) {
        toast.error('Session expired. Please login again.')
        router.push(`/${slug}/admin-portal/login`)
        return
      }

      if (response.status === 405) {
        toast.error('Invalid request method. Please refresh and try again.')
        return
      }

      if (response.ok) {
        const data = await response.json()
        if (data.theme) {
          setTheme({ ...defaultTheme, ...data.theme })
        }
        applyThemeToDocument(themeToSave)
        try {
          localStorage.setItem(`theme-appBg-${slug}`, themeToSave.appBg)
          localStorage.removeItem('theme-appBg')
        } catch (e) {
          // localStorage might not be available
        }
        toast.success('Theme saved successfully!')
      } else {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Failed to save theme'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
      toast.error('Failed to save theme. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const openColorPicker = (key: keyof ThemeColors) => {
    setSelectedColor(key)
    // Convert rgba to hex for the color picker
    // For optional color fields, use fallback; appBg is always a string
    const colorValue = (previewTheme[key] ?? defaultTheme[key] ?? (key === 'appBg' ? '#400810' : (key === 'headerFooterBgColor' || key === 'glassTintColor' ? '#FFFFFF' : '#000000'))) as string | null
    if (colorValue) {
      const hexColor = rgbaToHex(colorValue)
      setTempColor(hexColor)
    } else {
      setTempColor('#FFFFFF')
    }
  }

  const closeColorPicker = () => {
    setSelectedColor(null)
  }

  const applyColor = () => {
    if (selectedColor) {
      handleColorChange(selectedColor, tempColor)
      closeColorPicker()
    }
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(value)
    toast.success('Color copied to clipboard!')
    setTimeout(() => setCopied(null), 2000)
  }


  const isValidHex = (color: string): boolean => {
    // Check if it's a valid hex color or rgba/rgb
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) || 
           /^rgba?\(/.test(color) ||
           /^hsla?\(/.test(color)
  }

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        closeColorPicker()
      }
    }

    if (selectedColor) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedColor])


  return (
    <div className="min-h-screen p-2 sm:p-4" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
      <div className="max-w-4xl mx-auto">
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border"
          style={{
            backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
            borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
            boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
          }}
        >
          <div className="flex items-center gap-3">
            <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-[#FBBF24]" />
            <h1 
              className="text-xl sm:text-2xl md:text-3xl font-bold"
              style={{ color: 'var(--auto-text-primary, #FFFFFF)' }}
            >
              Theme & Colors
            </h1>
          </div>
          <Button 
            onClick={() => router.push(`/${slug}/admin-portal`)} 
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white shadow-lg text-sm sm:text-base w-full sm:w-auto"
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Color Input */}
          <div 
            className="lg:col-span-2 backdrop-blur-xl rounded-2xl border p-4 sm:p-6"
            style={{
              backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
              borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
              boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 
                className="text-lg sm:text-xl font-bold"
                style={{ color: 'var(--auto-text-primary, #FFFFFF)' }}
              >
                Background Color
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white">
                  Background Color (Welcome Page, Menu Page, Admin Panel)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    value={previewTheme.appBg}
                    onChange={(e) => {
                      const value = e.target.value
                      if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl')) {
                        handleColorChange('appBg', value)
                      }
                    }}
                    className="flex-1 text-sm"
                    placeholder="#400810"
                  />
                  <button
                    type="button"
                    onClick={() => openColorPicker('appBg')}
                    className="w-16 h-16 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors relative flex-shrink-0"
                    style={{ backgroundColor: normalizeToHex(previewTheme.appBg) }}
                    aria-label="Pick background color"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(previewTheme.appBg)}
                    className="p-2 text-white/70 hover:text-white transition-colors"
                    aria-label="Copy color"
                  >
                    {copied === previewTheme.appBg ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/70">
                  This color will be used for all components (text, boxes, frames).
                </p>
              </div>

              {/* Menu Page Background Image */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <label className="block text-sm font-medium text-white">
                  Menu Page Background Image
                </label>
                <div className="space-y-2">
                  {menuBgPreview && (
                    <div className="relative inline-block">
                      <img
                        src={menuBgPreview}
                        alt="Menu Background Preview"
                        className="h-32 w-auto object-cover rounded-lg border-2 border-white/20"
                      />
                      <button
                        type="button"
                        onClick={handleMenuBackgroundRemove}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    {!menuBgPreview && (
                      <div className="flex flex-col items-center justify-center pt-3 pb-4">
                        <Upload className="w-6 h-6 mb-2 text-white/70" />
                        <p className="text-sm text-white/70">Click to upload background</p>
                        <p className="text-xs text-white/50 mt-1">PNG, JPG, WEBP (max 10MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleMenuBackgroundChange}
                      disabled={uploadingMenuBg}
                    />
                  </label>
                  {uploadingMenuBg && (
                    <p className="text-sm text-white/70">Uploading background...</p>
                  )}
                  <p className="text-xs text-white/50">
                    Background image will appear on menu page only (not welcome page). Leave empty to use default background color.
                  </p>
                </div>
              </div>

              {/* Header & Footer Background Color */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base font-semibold text-white">Header & Footer</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Header/Footer Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.headerFooterBgColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('headerFooterBgColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: current background"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('headerFooterBgColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.headerFooterBgColor ? normalizeToHex(previewTheme.headerFooterBgColor) : 'transparent' }}
                      aria-label="Pick header/footer background color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Applies to both header and footer backgrounds. Leave empty to use default.</p>
                </div>
              </div>

              {/* Liquid Glass Tint */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base font-semibold text-white">Liquid Glass</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Glass Tint (Items + Bottom Nav)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.glassTintColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('glassTintColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: original liquid glass"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('glassTintColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.glassTintColor ? normalizeToHex(previewTheme.glassTintColor) : 'transparent' }}
                      aria-label="Pick glass tint color"
                    />
                    {previewTheme.glassTintColor && (
                      <Button
                        type="button"
                        onClick={() => {
                          handleColorChange('glassTintColor', null)
                        }}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white px-3 py-1"
                      >
                        Remove Color
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-white/50">Applies tint overlay to item frames and bottom nav box. Leave empty for original liquid glass look.</p>
                </div>
              </div>

              {/* Text Color Options */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-base font-semibold text-white">Text Colors</h3>
                
                {/* Item Name Text Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Item Name Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.itemNameTextColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('itemNameTextColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: #FFFFFF"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('itemNameTextColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.itemNameTextColor ? normalizeToHex(previewTheme.itemNameTextColor) : '#FFFFFF' }}
                      aria-label="Pick item name text color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Leave empty to use default (white)</p>
                </div>

                {/* Item Price Text Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Item Price Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.itemPriceTextColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('itemPriceTextColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: #FBBF24"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('itemPriceTextColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.itemPriceTextColor ? normalizeToHex(previewTheme.itemPriceTextColor) : '#FBBF24' }}
                      aria-label="Pick item price text color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Leave empty to use default (gold)</p>
                </div>

                {/* Item Description Text Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Item Description Text Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.itemDescriptionTextColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('itemDescriptionTextColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: #E2E8F0"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('itemDescriptionTextColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.itemDescriptionTextColor ? normalizeToHex(previewTheme.itemDescriptionTextColor) : '#E2E8F0' }}
                      aria-label="Pick item description text color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Leave empty to use default (light gray)</p>
                </div>

                {/* Category Name Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Category Name Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.categoryNameColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('categoryNameColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: #FFFFFF"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('categoryNameColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.categoryNameColor ? normalizeToHex(previewTheme.categoryNameColor) : '#FFFFFF' }}
                      aria-label="Pick category name color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Applies to category names in menu page and bottom nav</p>
                </div>

                {/* Bottom Nav Section Name Color */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white">
                    Bottom Nav Section Name Color
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={previewTheme.bottomNavSectionNameColor || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (isValidHex(value) || value.startsWith('rgba') || value.startsWith('rgb') || value.startsWith('hsl') || value === '') {
                          handleColorChange('bottomNavSectionNameColor', value || null)
                        }
                      }}
                      className="flex-1 text-sm"
                      placeholder="Default: #FFFFFF"
                    />
                    <button
                      type="button"
                      onClick={() => openColorPicker('bottomNavSectionNameColor')}
                      className="w-12 h-12 rounded border-2 border-white/20 cursor-pointer hover:border-white/40 transition-colors flex-shrink-0"
                      style={{ backgroundColor: previewTheme.bottomNavSectionNameColor ? normalizeToHex(previewTheme.bottomNavSectionNameColor) : '#FFFFFF' }}
                      aria-label="Pick bottom nav section name color"
                    />
                  </div>
                  <p className="text-xs text-white/50">Applies to section labels in bottom navigation</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t border-white/20">
              <Button 
                onClick={() => handleSave()} 
                disabled={isLoading} 
                variant="ghost"
                className="flex-1"
                style={{
                  backgroundColor: 'var(--app-bg, #400810)',
                  color: 'var(--auto-text-primary, #FFFFFF)',
                }}
              >
                {isLoading ? 'Saving...' : 'Save Theme'}
              </Button>
            </div>
          </div>

          {/* Right: Color Picker */}
          <div className="lg:col-span-1">
            {selectedColor ? (
              <div
                ref={colorPickerRef}
                className="backdrop-blur-xl rounded-2xl border p-4 sm:p-6 sticky top-4"
                style={{
                  backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                  borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                  boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">
                    Pick {selectedColor === 'appBg' ? 'Background' : selectedColor === 'itemNameTextColor' ? 'Item Name Text' : selectedColor === 'itemPriceTextColor' ? 'Item Price Text' : selectedColor === 'itemDescriptionTextColor' ? 'Item Description Text' : selectedColor === 'categoryNameColor' ? 'Category Name' : selectedColor === 'bottomNavSectionNameColor' ? 'Bottom Nav Section Name' : selectedColor === 'headerFooterBgColor' ? 'Header/Footer Background' : selectedColor === 'glassTintColor' ? 'Glass Tint' : 'Color'} Color
                  </h2>
                  <button
                    onClick={closeColorPicker}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Color Picker - HSV gradient square */}
                  <div className="flex justify-center">
                    <HexColorPicker
                      color={tempColor.startsWith('#') ? tempColor : '#000000'}
                      onChange={(color) => {
                        setTempColor(color)
                        // Update preview in real-time
                        handleColorChange(selectedColor, color)
                      }}
                      style={{ width: '100%', height: '200px' }}
                    />
                  </div>

                  {/* HEX Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      HEX Color
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={tempColor}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.startsWith('#') || isValidHex(value)) {
                            setTempColor(value)
                            handleColorChange(selectedColor, value)
                          }
                        }}
                        className="flex-1"
                        placeholder="#000000"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tempColor)}
                        className="p-2 text-white/70 hover:text-white transition-colors"
                        aria-label="Copy color"
                      >
                        {copied === tempColor ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Color Preview */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white">
                      Preview
                    </label>
                    <div
                      className="w-full h-16 rounded border-2 border-white/20"
                      style={{ backgroundColor: tempColor }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={applyColor}
                      className="flex-1 bg-[#800020] hover:bg-[#A00028] text-white"
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={closeColorPicker}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="backdrop-blur-xl rounded-2xl border p-6 text-center"
                style={{
                  backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                  borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                  boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
                }}
              >
                <Palette className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 text-sm">
                  Click the color swatch to customize
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
