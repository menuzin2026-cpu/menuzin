'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload, LogOut, UserPlus, Key, Image as ImageIcon, Trash2, Users, Building2, Plus, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface Restaurant {
  id: string
  slug: string
  nameEn: string
  nameKu: string
  nameAr: string
  createdAt: string
}

interface Admin {
  id: string
  restaurantId: string
  restaurant: Restaurant
  displayName: string | null
  lastLoginAt: string | null
  createdAt: string
}

export default function SuperAdminPage() {
  const router = useRouter()

  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null)
  const [footerLogoPreview, setFooterLogoPreview] = useState<string | null>(null)
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loadingRestaurants, setLoadingRestaurants] = useState(true)
  const [newRestaurantSlug, setNewRestaurantSlug] = useState('')
  const [newRestaurantNameEn, setNewRestaurantNameEn] = useState('')
  const [newRestaurantNameKu, setNewRestaurantNameKu] = useState('')
  const [newRestaurantNameAr, setNewRestaurantNameAr] = useState('')
  const [creatingRestaurant, setCreatingRestaurant] = useState(false)

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('')
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [newPin, setNewPin] = useState('')
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [updatePin, setUpdatePin] = useState('')
  const [updatingPin, setUpdatingPin] = useState(false)
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null)
  const [deletingRestaurantId, setDeletingRestaurantId] = useState<string | null>(null)
  const [deletingRestaurantSlug, setDeletingRestaurantSlug] = useState<string | null>(null)

  useEffect(() => {
    fetchRestaurants()
    fetchFooterLogo()
  }, [])

  useEffect(() => {
    if (selectedRestaurantId) {
      fetchAdmins(selectedRestaurantId)
    } else {
      setAdmins([])
      setLoadingAdmins(false)
    }
  }, [selectedRestaurantId])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/super-admin/restaurants')
      if (response.ok) {
        const data = await response.json()
        setRestaurants(data.restaurants || [])
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
    } finally {
      setLoadingRestaurants(false)
    }
  }

  const fetchAdmins = async (restaurantId: string) => {
    setLoadingAdmins(true)
    try {
      const response = await fetch(`/api/super-admin/admins?restaurantId=${restaurantId}`)
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
      const response = await fetch('/api/super-admin/platform-settings')
      if (response.ok) {
        const data = await response.json()
        if (data.footerLogoUrl) {
          setFooterLogoPreview(data.footerLogoUrl)
        }
      }
    } catch (error) {
      console.error('Error fetching footer logo:', error)
    }
  }

  const handleFooterLogoUpload = async (file: File) => {
    setUploadingFooterLogo(true)
    try {
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
      formData.append('scope', 'platformFooterLogo')

      const uploadResponse = await fetch('/api/r2/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to upload footer logo')
      }

      const uploadData = await uploadResponse.json()
      const { key, publicUrl } = uploadData

      if (!key || !publicUrl) {
        throw new Error('Upload succeeded but did not return key and publicUrl')
      }

      // Update platform settings with key and URL
      const updateResponse = await fetch('/api/super-admin/platform-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          footerLogoKey: key,
          footerLogoUrl: publicUrl,
        }),
      })

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}))
        console.error('Failed to update platform settings:', errorData)
        throw new Error(errorData.error || errorData.message || 'Failed to update footer logo in database')
      }

      const updateData = await updateResponse.json()
      console.log('[SUPER ADMIN] Platform settings updated:', updateData)
      
      // Update preview with the URL from response (or use publicUrl as fallback)
      const finalUrl = updateData.platformSettings?.footerLogoUrl || publicUrl
      setFooterLogoPreview(finalUrl)
      
      toast.success('Footer logo uploaded successfully! This logo will appear on all restaurant menus.')
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

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRestaurantSlug || !newRestaurantNameEn) {
      toast.error('Slug and English name are required')
      return
    }

    setCreatingRestaurant(true)
    try {
      const response = await fetch('/api/super-admin/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newRestaurantSlug,
          nameEn: newRestaurantNameEn,
          nameKu: newRestaurantNameKu || newRestaurantNameEn,
          nameAr: newRestaurantNameAr || newRestaurantNameEn,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Restaurant created successfully!')
        setNewRestaurantSlug('')
        setNewRestaurantNameEn('')
        setNewRestaurantNameKu('')
        setNewRestaurantNameAr('')
        fetchRestaurants()
      } else {
        toast.error(data.error || 'Failed to create restaurant')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setCreatingRestaurant(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRestaurantId) {
      toast.error('Please select a restaurant first')
      return
    }
    if (newPin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }

    setCreatingAdmin(true)
    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurantId,
          pin: newPin,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Admin account created successfully!')
        setNewPin('')
        fetchAdmins(selectedRestaurantId)
      } else {
        toast.error(data.error || 'Failed to create admin account')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setCreatingAdmin(false)
    }
  }

  const handleUpdatePin = async (adminId: string) => {
    if (!adminId || updatePin.length !== 4) {
      toast.error('PIN must be 4 digits')
      return
    }

    setUpdatingPin(true)
    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          newPin: updatePin,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Admin PIN updated successfully!')
        setEditingAdminId(null)
        setUpdatePin('')
        if (selectedRestaurantId) {
          fetchAdmins(selectedRestaurantId)
        }
      } else {
        toast.error(data.error || 'Failed to update PIN')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setUpdatingPin(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin account? This action cannot be undone.')) {
      return
    }

    setDeletingAdminId(adminId)
    try {
      const response = await fetch('/api/super-admin/admins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Admin account deleted successfully!')
        if (selectedRestaurantId) {
          fetchAdmins(selectedRestaurantId)
        }
      } else {
        toast.error(data.error || 'Failed to delete admin account')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setDeletingAdminId(null)
    }
  }

  const handleDeleteRestaurant = async (restaurantId: string, slug: string, nameEn: string) => {
    const confirmed = confirm(
      `⚠️ WARNING: This will permanently delete the restaurant "${nameEn}" (${slug}) and ALL associated data:\n\n` +
      `- All menu items, categories, and sections\n` +
      `- All admin accounts for this restaurant\n` +
      `- All feedback and reviews\n` +
      `- All uploaded images and media files\n` +
      `- Theme and settings\n\n` +
      `This action CANNOT be undone. Are you absolutely sure?`
    )

    if (!confirmed) {
      return
    }

    // Double confirmation - require user to type the slug
    const typedSlug = prompt(
      `⚠️ FINAL CONFIRMATION\n\n` +
      `Type the restaurant slug "${slug}" exactly to confirm deletion:\n\n` +
      `This action is PERMANENT and cannot be undone.`
    )

    if (typedSlug !== slug) {
      if (typedSlug !== null) {
        toast.error('Slug mismatch. Deletion cancelled.')
      } else {
        toast.error('Deletion cancelled')
      }
      return
    }

    setDeletingRestaurantId(restaurantId)
    setDeletingRestaurantSlug(slug)
    try {
      const response = await fetch(`/api/super-admin/restaurants/${slug}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Restaurant "${nameEn}" and all data deleted successfully!`)
        // Refresh restaurants list
        fetchRestaurants()
        // Clear selection if deleted restaurant was selected
        if (selectedRestaurantId === restaurantId) {
          setSelectedRestaurantId('')
          setAdmins([])
        }
      } else {
        toast.error(data.error || 'Failed to delete restaurant')
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error)
      toast.error('An error occurred while deleting the restaurant. Please try again.')
    } finally {
      setDeletingRestaurantId(null)
      setDeletingRestaurantSlug(null)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/super-admin/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/super-admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const selectedRestaurant = restaurants.find(r => r.id === selectedRestaurantId)

  return (
    <div className="min-h-screen p-4 bg-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-[#0b0b0b] rounded-2xl p-4 border border-[#222]">
          <h1 className="text-3xl font-bold text-white">Super Admin Portal</h1>
          <Button 
            onClick={handleLogout} 
            className="bg-[#222] hover:bg-[#333] border border-[#333] text-white"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Footer Logo Upload Section */}
        <div className="mb-6 bg-[#0b0b0b] rounded-2xl p-6 border border-[#222]">
          <div className="flex items-center mb-4">
            <ImageIcon className="w-8 h-8 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Global Footer Logo</h2>
          </div>
          <div className="flex flex-col items-center space-y-4">
            {footerLogoPreview && (
              <div className="relative w-full flex justify-center">
                <div className="max-w-[200px] max-h-[100px] w-full h-full flex items-center justify-center bg-[#111] rounded-lg border border-[#222] p-2">
                  <img
                    src={footerLogoPreview}
                    alt="Footer Logo Preview"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                  />
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFooterLogoChange}
              disabled={uploadingFooterLogo}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFooterLogo}
              className="w-full bg-[#222] hover:bg-[#333] border border-[#333] text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadingFooterLogo
                ? 'Uploading...'
                : footerLogoPreview
                ? 'Change Footer Logo'
                : 'Upload Footer Logo'}
            </Button>
            <p className="text-sm text-gray-400 text-center">
              Supported formats: JPEG, PNG, WebP (max 10MB)
            </p>
          </div>
        </div>

        {/* Create Restaurant Section */}
        <div className="mb-6 bg-[#0b0b0b] rounded-2xl p-6 border border-[#222]">
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Create Restaurant</h2>
          </div>
          <form onSubmit={handleCreateRestaurant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL identifier) *
              </label>
              <Input
                type="text"
                value={newRestaurantSlug}
                onChange={(e) => setNewRestaurantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="mrcafe"
                className="bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Only lowercase letters, numbers, and hyphens. Will be used in URL: menuzin.com/{newRestaurantSlug || 'slug'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name (English) *
              </label>
              <Input
                type="text"
                value={newRestaurantNameEn}
                onChange={(e) => setNewRestaurantNameEn(e.target.value)}
                placeholder="Mr. Cafe"
                className="bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name (Kurdish)
                </label>
                <Input
                  type="text"
                  value={newRestaurantNameKu}
                  onChange={(e) => setNewRestaurantNameKu(e.target.value)}
                  placeholder="Optional"
                  className="bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name (Arabic)
                </label>
                <Input
                  type="text"
                  value={newRestaurantNameAr}
                  onChange={(e) => setNewRestaurantNameAr(e.target.value)}
                  placeholder="Optional"
                  className="bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={creatingRestaurant}
              className="w-full bg-[#222] hover:bg-[#333] border border-[#333] text-white"
            >
              {creatingRestaurant ? 'Creating...' : 'Create Restaurant'}
            </Button>
          </form>
        </div>

        {/* Restaurants List */}
        <div className="mb-6 bg-[#0b0b0b] rounded-2xl p-6 border border-[#222]">
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Restaurants</h2>
          </div>
          {loadingRestaurants ? (
            <p className="text-gray-400">Loading...</p>
          ) : restaurants.length === 0 ? (
            <p className="text-gray-400">No restaurants found</p>
          ) : (
            <div className="space-y-2">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedRestaurantId === restaurant.id
                      ? 'bg-[#111] border-[#333]'
                      : 'bg-[#0a0a0a] border-[#222] hover:border-[#333]'
                  }`}
                  onClick={() => setSelectedRestaurantId(restaurant.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{restaurant.nameEn}</p>
                      <p className="text-sm text-gray-400">menuzin.com/{restaurant.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-[#111] hover:bg-[#222] border-[#333] text-white text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(`/${restaurant.slug}`, '_blank')
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Menu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-[#1a0000] hover:bg-[#2a0000] border-[#4a0000] text-red-400 text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteRestaurant(restaurant.id, restaurant.slug, restaurant.nameEn)
                        }}
                        disabled={deletingRestaurantId === restaurant.id}
                      >
                        {deletingRestaurantId === restaurant.id ? (
                          <>Deleting...</>
                        ) : (
                          <>
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Admin Section - Always Visible */}
        <div className="mb-6 bg-[#0b0b0b] rounded-2xl p-6 border border-[#222]">
          <div className="flex items-center mb-4">
            <UserPlus className="w-8 h-8 text-white mr-3" />
            <h2 className="text-xl font-bold text-white">Create Admin PIN for Restaurant</h2>
          </div>
          {!selectedRestaurantId ? (
            <div className="p-4 bg-[#111] rounded-lg border border-[#222]">
              <p className="text-gray-400 text-center">
                Please select a restaurant from the list above to create an admin PIN
              </p>
            </div>
          ) : (
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Restaurant: <span className="text-white font-semibold">{selectedRestaurant?.nameEn}</span>
                </label>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  4-Digit PIN
                </label>
                <Input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="text-center text-xl tracking-widest bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={creatingAdmin || newPin.length !== 4}
                className="w-full bg-[#222] hover:bg-[#333] border border-[#333] text-white"
              >
                {creatingAdmin ? 'Creating...' : 'Create Admin PIN'}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Admin can login at: menuzin.com/{selectedRestaurant?.slug}/admin
              </p>
            </form>
          )}
        </div>

        {/* Admin Accounts Section - Only show when restaurant is selected */}
        {selectedRestaurantId && (
          <div className="mb-6 bg-[#0b0b0b] rounded-2xl p-6 border border-[#222]">
            <div className="flex items-center mb-4">
              <Users className="w-8 h-8 text-white mr-3" />
              <h2 className="text-xl font-bold text-white">Admin Accounts ({selectedRestaurant?.nameEn})</h2>
            </div>
            {loadingAdmins ? (
              <p className="text-gray-400">Loading...</p>
            ) : admins.length === 0 ? (
              <p className="text-gray-400">No admin accounts found for this restaurant</p>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="p-4 bg-[#111] rounded-lg border border-[#222] space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-white mb-1">
                          Admin ID: {admin.id.slice(-12)}
                        </p>
                        <p className="text-sm text-gray-400 mb-1">
                          Created: {new Date(admin.createdAt).toLocaleString()}
                        </p>
                        {admin.lastLoginAt && (
                          <p className="text-sm text-gray-400">
                            Last Login: {new Date(admin.lastLoginAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {editingAdminId === admin.id ? (
                          <>
                            <Button
                              onClick={() => {
                                setEditingAdminId(null)
                                setUpdatePin('')
                              }}
                              variant="outline"
                              size="sm"
                              className="bg-[#111] hover:bg-[#222] border-[#333] text-white"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleUpdatePin(admin.id)}
                              disabled={updatingPin || updatePin.length !== 4}
                              size="sm"
                              className="bg-[#222] hover:bg-[#333] border border-[#333] text-white"
                            >
                              {updatingPin ? 'Saving...' : 'Save'}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              onClick={() => {
                                setEditingAdminId(admin.id)
                                setUpdatePin('')
                              }}
                              variant="outline"
                              size="sm"
                              className="bg-[#111] hover:bg-[#222] border-[#333] text-white"
                            >
                              <Key className="w-4 h-4 mr-1" />
                              Update PIN
                            </Button>
                            <Button
                              onClick={() => handleDeleteAdmin(admin.id)}
                              disabled={deletingAdminId === admin.id || admins.length === 1}
                              variant="outline"
                              size="sm"
                              className="bg-red-900/20 hover:bg-red-900/30 border-red-800/30 text-red-200"
                            >
                              {deletingAdminId === admin.id ? (
                                'Deleting...'
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    {editingAdminId === admin.id && (
                      <div className="pt-3 border-t border-[#222]">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          New 4-Digit PIN
                        </label>
                        <Input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={updatePin}
                          onChange={(e) => setUpdatePin(e.target.value.replace(/\D/g, ''))}
                          placeholder="0000"
                          className="text-center text-xl tracking-widest bg-[#111] border-[#222] text-white placeholder:text-gray-500"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

