'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface RestaurantSettings {
  id?: string
  nameKu: string
  nameEn: string
  nameAr: string
  slug?: string
  googleMapsUrl: string
  phoneNumber: string
  instagramUrl?: string | null
  snapchatUrl?: string | null
  tiktokUrl?: string | null
  serviceChargePercent?: number | null
  welcomeOverlayColor: string
  welcomeOverlayOpacity: number
  welcomeTextEn: string
  logoMediaId: string | null
  footerLogoMediaId: string | null
  welcomeBackgroundMediaId: string | null
  logoR2Key?: string | null
  logoR2Url?: string | null
  footerLogoR2Key?: string | null
  footerLogoR2Url?: string | null
  welcomeBgR2Key?: string | null
  welcomeBgR2Url?: string | null
  welcomeBgMimeType?: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [settings, setSettings] = useState<RestaurantSettings>({
    nameKu: '',
    nameEn: '',
    nameAr: '',
    googleMapsUrl: '',
    phoneNumber: '',
    instagramUrl: '',
    snapchatUrl: '',
    tiktokUrl: '',
    serviceChargePercent: 0,
    welcomeOverlayColor: '#000000',
    welcomeOverlayOpacity: 0.5,
    welcomeTextEn: '',
    logoMediaId: null,
    footerLogoMediaId: null,
    welcomeBackgroundMediaId: null,
  })
  const [serviceChargeInput, setServiceChargeInput] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null)
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [appBgColor, setAppBgColor] = useState<string>('#400810')

  // Helper function to handle restaurant mismatch error
  const handleMismatchError = async (response: Response, errorData: any): Promise<boolean> => {
    if (response.status === 401 || response.status === 403) {
      if (errorData.error === 'SESSION_RESTAURANT_MISMATCH') {
        try {
          await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
        } catch (logoutError) {
          // Ignore logout errors
        }
        toast.error('You are logged into another restaurant. Please login again.', { duration: 5000 })
        router.push(`/${slug}/admin/login`)
        return true // Indicates mismatch was handled
      }
      // Other auth errors
      toast.error(errorData.message || 'Session expired. Please login again.')
      router.push(`/${slug}/admin/login`)
      return true
    }
    return false // Not a mismatch error
  }

  useEffect(() => {
    fetchSettings()
    fetchTheme()
  }, [])

  const fetchTheme = async (retryCount = 0) => {
    try {
      const response = await fetch('/data/theme')
      if (response.ok) {
        const data = await response.json()
        if (data.theme?.appBg) {
          setAppBgColor(data.theme.appBg)
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error)
      if (retryCount < 1) {
        setTimeout(() => fetchTheme(retryCount + 1), 500)
      }
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/admin/settings?slug=${slug}`)
      const data = await response.json()
      
      if (response.status === 401 || response.status === 403) {
        // Check if it's a restaurant mismatch error
        if (data.error === 'SESSION_RESTAURANT_MISMATCH') {
          // Session is for different restaurant - clear session and redirect
          try {
            await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
          } catch (logoutError) {
            // Ignore logout errors
          }
          toast.error('You are logged into another restaurant. Please login again.', { duration: 5000 })
          router.push(`/${slug}/admin/login`)
          return
        }
        // Other auth errors - redirect to login
        router.push(`/${slug}/admin/login`)
        return
      }
      
      if (response.ok) {
        setSettings(data)
        // Update service charge input field with current value
        setServiceChargeInput(data.serviceChargePercent?.toString() || '0')
        // Use R2 URL if available, otherwise fall back to old media ID
        if (data.logoR2Url) {
          setLogoPreview(data.logoR2Url)
        } else if (data.logoMediaId) {
          setLogoPreview(`/assets/${data.logoMediaId}`)
        }
        if (data.footerLogoR2Url) {
          setFooterLogoPreview(data.footerLogoR2Url)
        } else if (data.footerLogoMediaId) {
          setFooterLogoPreview(`/assets/${data.footerLogoMediaId}`)
        }
        if (data.welcomeBgR2Url) {
          setBackgroundPreview(data.welcomeBgR2Url)
        } else if (data.welcomeBackgroundMediaId) {
          setBackgroundPreview(`/assets/${data.welcomeBackgroundMediaId}`)
        }
      } else {
        console.error('Error fetching settings:', response.status, response.statusText)
        toast.error('Failed to load settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    }
  }

  const handleLogoUpload = async (file: File) => {
    if (!settings.id) {
      toast.error('Restaurant ID not found')
      return
    }

    setUploadingLogo(true)
    try {
      // Upload via server-side proxy (avoids CORS issues)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'logo')
      formData.append('restaurantId', settings.id)

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload logo')
      }

      const { key, publicUrl } = await uploadResponse.json()

      // Save R2 key/URL to database
      const updateResponse = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...settings,
          logoR2Key: key,
          logoR2Url: publicUrl,
          slug,
        }),
      })

      const updateData = await updateResponse.json().catch(() => ({}))
      
      // Check for mismatch error
      const handled = await handleMismatchError(updateResponse, updateData)
      if (handled) {
        return
      }

      if (updateResponse.ok) {
        setSettings({ ...settings, logoR2Key: key, logoR2Url: publicUrl })
        setLogoPreview(publicUrl)
        toast.success('Logo uploaded successfully!')
      } else {
        throw new Error(updateData.message || 'Failed to update logo')
      }
    } catch (error: any) {
      console.error('Error uploading logo:', error)
      toast.error(error.message || 'Failed to upload logo')
    } finally {
      setUploadingLogo(false)
      setLogoFile(null)
    }
  }

  const handleFooterLogoUpload = async (file: File) => {
    if (!settings.id) {
      toast.error('Restaurant ID not found')
      return
    }

    setUploadingFooterLogo(true)
    try {
      // Upload via server-side proxy (avoids CORS issues)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'footerLogo')
      formData.append('restaurantId', settings.id)

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload footer logo')
      }

      const { key, publicUrl } = await uploadResponse.json()

      // Save R2 key/URL to database
      const updateResponse = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...settings,
          footerLogoR2Key: key,
          footerLogoR2Url: publicUrl,
          slug,
        }),
      })

      const updateData = await updateResponse.json().catch(() => ({}))
      
      // Check for mismatch error
      const handled = await handleMismatchError(updateResponse, updateData)
      if (handled) {
        return
      }

      if (updateResponse.ok) {
        setSettings({ ...settings, footerLogoR2Key: key, footerLogoR2Url: publicUrl })
        setFooterLogoPreview(publicUrl)
        toast.success('Footer logo uploaded successfully!')
      } else {
        throw new Error(updateData.message || 'Failed to update footer logo')
      }
    } catch (error: any) {
      console.error('Error uploading footer logo:', error)
      toast.error(error.message || 'Failed to upload footer logo')
    } finally {
      setUploadingFooterLogo(false)
      setFooterLogoFile(null)
    }
  }

  const handleBackgroundUpload = async (file: File) => {
    if (!settings.id) {
      toast.error('Restaurant ID not found')
      return
    }

    setUploadingBackground(true)
    try {
      // Validate file before upload
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      
      if (!isVideo && !isImage) {
        toast.error('Please upload an image (JPEG, PNG, WebP) or video (MP4) file')
        setUploadingBackground(false)
        return
      }

      // R2 supports larger files, but we'll keep reasonable limits
      const maxImageSize = 10 * 1024 * 1024 // 10MB for images
      const maxVideoSize = 100 * 1024 * 1024 // 100MB for videos
      const maxSize = isVideo ? maxVideoSize : maxImageSize
      
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
        setUploadingBackground(false)
        return
      }

      // Upload via server-side proxy (avoids CORS issues)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'welcomeBg')
      formData.append('restaurantId', settings.id)

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload background')
      }

      const { key, publicUrl } = await uploadResponse.json()

      // Save R2 key/URL and mimeType to database
      const updateResponse = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...settings,
          welcomeBgR2Key: key,
          welcomeBgR2Url: publicUrl,
          welcomeBgMimeType: file.type, // Store the mimeType
          slug,
        }),
      })

      const updateData = await updateResponse.json().catch(() => ({}))
      
      // Check for mismatch error
      const handled = await handleMismatchError(updateResponse, updateData)
      if (handled) {
        return
      }

      if (updateResponse.ok) {
        setSettings({ ...settings, welcomeBgR2Key: key, welcomeBgR2Url: publicUrl, welcomeBgMimeType: file.type })
        setBackgroundPreview(publicUrl)
        toast.success('Background uploaded successfully!')
      } else {
        throw new Error(updateData.message || 'Failed to update background')
      }
    } catch (error: any) {
      console.error('Error uploading background:', error)
      toast.error(error.message || 'Failed to upload background')
    } finally {
      setUploadingBackground(false)
      setBackgroundFile(null)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      handleLogoUpload(file)
    }
  }

  const handleFooterLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFooterLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFooterLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      handleFooterLogoUpload(file)
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBackgroundFile(file)
      // Create preview for both images and videos
      const reader = new FileReader()
      reader.onloadend = () => {
        setBackgroundPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      handleBackgroundUpload(file)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Ensure R2 fields are explicitly set to null if they should be removed
      // Explicitly include serviceChargePercent to ensure it's always sent (even if 0)
      const saveData = {
        ...settings,
        slug,
        serviceChargePercent: settings.serviceChargePercent ?? 0, // Ensure it's always sent, default to 0
        // Explicitly include R2 fields - if they're null in state, send null to clear them
        logoR2Key: settings.logoR2Key ?? null,
        logoR2Url: settings.logoR2Url ?? null,
        footerLogoR2Key: settings.footerLogoR2Key ?? null,
        footerLogoR2Url: settings.footerLogoR2Url ?? null,
        welcomeBgR2Key: settings.welcomeBgR2Key ?? null,
        welcomeBgR2Url: settings.welcomeBgR2Url ?? null,
        welcomeBgMimeType: settings.welcomeBgMimeType ?? null,
      }
      
      // Log the save data for debugging
      console.log('[SETTINGS SAVE] Saving data:', {
        restaurantId: settings.id,
        slug,
        serviceChargePercent: saveData.serviceChargePercent,
      })
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(saveData),
      })

      // Fix "body stream already read" error by reading response once
      const raw = await response.text()
      let parsed = null
      try {
        parsed = raw ? JSON.parse(raw) : null
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
      }
      
      if (response.status === 401 || response.status === 403) {
        // Check if it's a restaurant mismatch error
        if (parsed?.error === 'SESSION_RESTAURANT_MISMATCH') {
          // Session is for different restaurant - clear session and redirect
          try {
            await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
          } catch (logoutError) {
            // Ignore logout errors
          }
          toast.error('You are logged into another restaurant. Please login again.', { duration: 5000 })
          router.push(`/${slug}/admin/login`)
          return
        }
        // Other auth errors
        toast.error(parsed?.message || 'Session expired. Please login again.')
        router.push(`/${slug}/admin/login`)
        return
      }

      if (response.ok) {
        toast.success('Settings saved successfully!')
        // Refresh settings to get updated data
        if (parsed) {
          setSettings(parsed)
          setServiceChargeInput(parsed.serviceChargePercent?.toString() || '0')
        }
        // Trigger menu page refresh if it's open (using localStorage event and custom event)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('service-charge-updated', Date.now().toString())
          window.dispatchEvent(new Event('storage'))
          window.dispatchEvent(new Event('service-charge-updated'))
        }
      } else {
        toast.error(parsed?.message || parsed?.error || 'Failed to save settings')
        console.error('Settings save error:', parsed)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-2 sm:p-4" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
      <div className="max-w-6xl mx-auto">
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border"
          style={{
            backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
            borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
            boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
          }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Settings</h1>
          <Button 
            onClick={() => router.push(`/${slug}/admin-portal`)} 
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white shadow-lg text-sm sm:text-base w-full sm:w-auto"
          >
            Back
          </Button>
        </div>

        <div 
          className="backdrop-blur-xl rounded-2xl border p-6 space-y-6"
          style={{
            backgroundColor: 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
            borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
            boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
          }}
        >
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Restaurant Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Restaurant Logo
                </label>
                <div className="space-y-2">
                  {logoPreview && (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Restaurant Logo"
                        className="h-24 w-auto object-contain rounded-lg border-2 border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null)
                          setSettings({ 
                            ...settings, 
                            logoMediaId: null,
                            logoR2Key: null,
                            logoR2Url: null
                          })
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    {!logoPreview && (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-white/70" />
                        <p className="text-sm text-white/70">Click to upload logo</p>
                        <p className="text-xs text-white/50 mt-1">PNG, JPG, WEBP (max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleLogoChange}
                      disabled={uploadingLogo}
                    />
                  </label>
                  {uploadingLogo && (
                    <p className="text-sm text-white/70">Uploading logo...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Google Maps URL
                </label>
                <Input
                  type="url"
                  value={settings.googleMapsUrl}
                  onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="+964 750 123 4567"
                />
              </div>
              
              {/* Social Media Links */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Instagram URL
                    </label>
                    <Input
                      type="url"
                      value={settings.instagramUrl || ''}
                      onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value || null })}
                      placeholder="https://instagram.com/yourpage"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Leave empty to hide Instagram icon
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Snapchat URL
                    </label>
                    <Input
                      type="url"
                      value={settings.snapchatUrl || ''}
                      onChange={(e) => setSettings({ ...settings, snapchatUrl: e.target.value || null })}
                      placeholder="https://snapchat.com/add/yourusername"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Leave empty to hide Snapchat icon
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      TikTok URL
                    </label>
                    <Input
                      type="url"
                      value={settings.tiktokUrl || ''}
                      onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value || null })}
                      placeholder="https://tiktok.com/@yourusername"
                    />
                    <p className="text-xs text-white/50 mt-1">
                      Leave empty to hide TikTok icon
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Service Charge */}
              <div className="pt-4 border-t border-white/10">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Service Charge (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={serviceChargeInput === '' ? '' : serviceChargeInput}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      // Allow user to clear field completely - don't force to 0 immediately
                      setServiceChargeInput(inputValue)
                      
                      // Update settings based on input value
                      if (inputValue === '' || inputValue === '-') {
                        // Field is being cleared - set to 0 for now (will be saved as 0)
                        setSettings({ ...settings, serviceChargePercent: 0 })
                      } else {
                        // Try to parse the value
                        const numValue = parseFloat(inputValue)
                        if (!isNaN(numValue)) {
                          const clamped = Math.max(0, Math.min(100, numValue))
                          setSettings({ ...settings, serviceChargePercent: clamped })
                          // Only update input if value was clamped (to show user the clamped value)
                          if (numValue !== clamped && numValue.toString() !== inputValue) {
                            setServiceChargeInput(clamped.toString())
                          }
                        }
                      }
                    }}
                    onBlur={(e) => {
                      // When field loses focus, ensure it has a valid number (default to 0 if empty)
                      const inputValue = e.target.value.trim()
                      if (inputValue === '' || inputValue === '-' || isNaN(parseFloat(inputValue))) {
                        setServiceChargeInput('0')
                        setSettings({ ...settings, serviceChargePercent: 0 })
                      } else {
                        const numValue = parseFloat(inputValue)
                        const clamped = Math.max(0, Math.min(100, numValue))
                        const finalValue = isNaN(clamped) ? 0 : clamped
                        setServiceChargeInput(finalValue.toString())
                        setSettings({ ...settings, serviceChargePercent: finalValue })
                      }
                    }}
                    placeholder="0"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Percentage added to basket subtotal (0-100, decimals allowed, e.g., 10 or 2.5)
                  </p>
                </div>
              </div>
              
              {settings.slug && (
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    QR Code URL
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={`https://menuzin.com/${settings.slug}`}
                      readOnly
                      className="bg-white/5 text-white/70 cursor-not-allowed"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://menuzin.com/${settings.slug}`)
                        toast.success('URL copied to clipboard!')
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    Use this URL for your QR code
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Welcome Page Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Welcome Text
                </label>
                <textarea
                  value={settings.welcomeTextEn}
                  onChange={(e) => setSettings({ ...settings, welcomeTextEn: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/70 focus-visible:outline-none focus-visible:ring-2"
                  rows={3}
                  placeholder="Enter welcome message..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Welcome Background (Photo/Video)
                </label>
                <div className="space-y-2">
                  {backgroundPreview && (
                    <div className="relative">
                      {backgroundPreview.startsWith('data:video/') || settings.welcomeBackgroundMediaId ? (
                        <video
                          src={backgroundPreview.startsWith('data:') ? backgroundPreview : backgroundPreview}
                          className="w-full h-48 object-cover rounded-lg border-2 border-white/20"
                          controls={false}
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={backgroundPreview}
                          alt="Welcome Background"
                          className="w-full h-48 object-cover rounded-lg border-2 border-white/20"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setBackgroundPreview(null)
                          setSettings({ 
                            ...settings, 
                            welcomeBackgroundMediaId: null,
                            welcomeBgR2Key: null,
                            welcomeBgR2Url: null,
                            welcomeBgMimeType: null
                          })
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                    {!backgroundPreview && (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-white/70" />
                        <p className="text-sm text-white/70">Click to upload background</p>
                        <p className="text-xs text-white/50 mt-1">PNG, JPG, WEBP, MP4 (max 4MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,video/mp4"
                      className="hidden"
                      onChange={handleBackgroundChange}
                      disabled={uploadingBackground}
                    />
                  </label>
                  {uploadingBackground && (
                    <p className="text-sm text-white/70">Uploading background...</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Overlay Color
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={settings.welcomeOverlayColor}
                    onChange={(e) => setSettings({ ...settings, welcomeOverlayColor: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.welcomeOverlayColor}
                    onChange={(e) => setSettings({ ...settings, welcomeOverlayColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Overlay Opacity ({settings.welcomeOverlayOpacity})
                </label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.welcomeOverlayOpacity}
                  onChange={(e) => setSettings({ ...settings, welcomeOverlayOpacity: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={isLoading} 
            className="w-full" 
            size="lg"
            style={{ backgroundColor: appBgColor }}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}

