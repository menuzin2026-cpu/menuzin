'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, LogOut, UserPlus, Key, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface Admin {
  id: string
  lastLoginAt: string | null
  createdAt: string
}

export default function SuperAdminPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null)
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(null)
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false)
  const [restaurantId, setRestaurantId] = useState<string | null>(null)

  const [admins, setAdmins] = useState<Admin[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [newPin, setNewPin] = useState('')
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null)
  const [updatePin, setUpdatePin] = useState('')
  const [updatingPin, setUpdatingPin] = useState(false)

  useEffect(() => {
    fetchAdmins()
    fetchFooterLogo()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/super-admin/admins')
      if (response.ok) {
        const data = await response.json()
        setAdmins(data.admins || [])
      }
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoadingAdmins(false)
    }
  }

  const fetchFooterLogo = async () => {
    try {
      const response = await fetch(`/api/admin/settings?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        setRestaurantId(data.id || null)
        if (data.footerLogoR2Url) {
          setFooterLogoPreview(data.footerLogoR2Url)
        }
      }
    } catch (error) {
      console.error('Error fetching footer logo:', error)
    }
  }

  const handleFooterLogoUpload = async (file: File) => {
    if (!restaurantId) {
      toast.error('Restaurant ID not found')
      return
    }

    setUploadingFooterLogo(true)
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPEG, PNG, WebP)')
        setUploadingFooterLogo(false)
        return
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB')
        setUploadingFooterLogo(false)
        return
      }

      // Upload to R2 via server-side proxy
      const formData = new FormData()
      formData.append('file', file)
      formData.append('scope', 'footerLogo')
      formData.append('restaurantId', restaurantId)

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload footer logo')
      }

      const { key, publicUrl } = await uploadResponse.json()

      // Fetch current settings to update
      const settingsResponse = await fetch(`/api/admin/settings?slug=${slug}`)
      if (!settingsResponse.ok) {
        throw new Error('Failed to fetch restaurant settings')
      }
      const settings = await settingsResponse.json()

      // Update database with R2 key and URL
      const updateResponse = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          footerLogoR2Key: key,
          footerLogoR2Url: publicUrl,
          slug,
        }),
      })

      if (updateResponse.ok) {
        setFooterLogoPreview(publicUrl)
        toast.success('Footer logo uploaded successfully!')
      } else {
        const errorData = await updateResponse.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update footer logo')
      }
    } catch (error: any) {
      console.error('Error uploading footer logo:', error)
      toast.error(error.message || 'Failed to upload footer logo')
    } finally {
      setUploadingFooterLogo(false)
      setFooterLogoFile(null)
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

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }

    setCreatingAdmin(true)
    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: newPin }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Admin account created successfully!')
        setNewPin('')
        fetchAdmins()
      } else {
        toast.error(data.error || 'Failed to create admin account')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdminId || updatePin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }

    setUpdatingPin(true)
    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: selectedAdminId,
          newPin: updatePin,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Admin PIN updated successfully!')
        setSelectedAdminId(null)
        setUpdatePin('')
        fetchAdmins()
      } else {
        toast.error(data.error || 'Failed to update PIN')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setUpdatingPin(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/super-admin/logout', { method: 'POST' })
      router.push(`/${slug}/super-admin/login`)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Super Admin Portal</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Footer Logo Upload Section */}
          <div className="mb-8 p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <ImageIcon className="w-5 h-5 mr-2 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Footer Logo</h2>
            </div>
            <div className="flex flex-col items-center space-y-4">
              {footerLogoPreview && (
                <div className="relative">
                  <img
                    src={footerLogoPreview}
                    alt="Footer Logo Preview"
                    className="max-w-xs max-h-32 object-contain"
                  />
                </div>
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFooterLogoChange}
                  disabled={uploadingFooterLogo}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploadingFooterLogo}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingFooterLogo
                    ? 'Uploading...'
                    : footerLogoPreview
                    ? 'Change Footer Logo'
                    : 'Upload Footer Logo'}
                </Button>
              </label>
              <p className="text-sm text-gray-500 text-center">
                Supported formats: JPEG, PNG, WebP (max 10MB)
              </p>
            </div>
          </div>

          {/* Create Admin Section */}
          <div className="mb-8 p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <UserPlus className="w-5 h-5 mr-2 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Create Admin Account</h2>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4-Digit PIN
                </label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  className="text-center text-xl tracking-widest"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={creatingAdmin || newPin.length !== 4}
                className="w-full"
              >
                {creatingAdmin ? 'Creating...' : 'Create Admin Account'}
              </Button>
            </form>
          </div>

          {/* Update Admin PIN Section */}
          <div className="mb-8 p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <Key className="w-5 h-5 mr-2 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">Update Admin PIN</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Admin
                </label>
                <select
                  value={selectedAdminId || ''}
                  onChange={(e) => {
                    setSelectedAdminId(e.target.value || null)
                    setUpdatePin('')
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select an admin --</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      Admin {admin.id.slice(-8)} (Created:{' '}
                      {new Date(admin.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              {selectedAdminId && (
                <form onSubmit={handleUpdatePin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New 4-Digit PIN
                    </label>
                    <Input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={updatePin}
                      onChange={(e) => setUpdatePin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter new 4-digit PIN"
                      className="text-center text-xl tracking-widest"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updatingPin || updatePin.length !== 4}
                    className="w-full"
                  >
                    {updatingPin ? 'Updating...' : 'Update PIN'}
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Admin List */}
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Admins</h2>
            {loadingAdmins ? (
              <p className="text-gray-600">Loading...</p>
            ) : admins.length === 0 ? (
              <p className="text-gray-600">No admin accounts found</p>
            ) : (
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-4 bg-gray-50 rounded border flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-900">ID: {admin.id.slice(-12)}</p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(admin.createdAt).toLocaleString()}
                      </p>
                      {admin.lastLoginAt && (
                        <p className="text-sm text-gray-600">
                          Last Login:{' '}
                          {new Date(admin.lastLoginAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

