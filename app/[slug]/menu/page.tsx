'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { MenuHeader } from '@/components/menu-header'
import { FloatingActionBar } from '@/components/floating-action-bar'
import { AnimatedBasketIcon } from '@/components/animated-basket-icon'
import { ItemCard } from '@/components/item-card'
import { ItemModal } from '@/components/item-modal'
import { SearchDrawer } from '@/components/search-drawer'
import { BasketDrawer } from '@/components/basket-drawer'
import { PoweredByFooter } from '@/components/powered-by-footer'
import { CategorySectionSkeleton, SectionHeaderSkeleton } from '@/components/menu-skeleton'
import { Language } from '@/lib/i18n'
import { getLocalizedText } from '@/lib/i18n'
import { detectOverflow } from '@/lib/debug-overflow'

interface Section {
  id: string
  nameKu: string
  nameEn: string
  nameAr: string
  sortOrder: number
  isActive: boolean
  categories: Category[]
}

interface Category {
  id: string
  nameKu: string
  nameEn: string
  nameAr: string
  imageMediaId: string | null
  imageR2Key?: string | null
  imageR2Url?: string | null
  sortOrder: number
  isActive: boolean
  items: Item[]
}

interface Item {
  id: string
  nameKu: string
  nameEn: string
  nameAr: string
  descriptionKu?: string | null
  descriptionEn?: string | null
  descriptionAr?: string | null
  price: number
  imageMediaId: string | null
  imageR2Key?: string | null
  imageR2Url?: string | null
  sortOrder: number
  isActive: boolean
}

interface BasketItem {
  id: string
  nameKu: string
  nameEn: string
  nameAr: string
  price: number
  imageMediaId: string | null
  imageR2Key?: string | null
  imageR2Url?: string | null
  quantity: number
}

function MenuPageContent() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const searchParams = useSearchParams()
  const [currentLang, setCurrentLang] = useState<Language>('en')
  const [sections, setSections] = useState<Section[]>([])
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBasketOpen, setIsBasketOpen] = useState(false)
  const [basket, setBasket] = useState<BasketItem[]>([])
  const [restaurant, setRestaurant] = useState<any>(null)
  const [footerLogoUrl, setFooterLogoUrl] = useState<string | null>(null)
  const [allItems, setAllItems] = useState<Item[]>([])
  const [shouldAnimateBasket, setShouldAnimateBasket] = useState(false)
  const [isFirstAdd, setIsFirstAdd] = useState(false)
  const [uiSettings, setUiSettings] = useState({
    sectionTitleSize: 22,
    categoryTitleSize: 16,
    itemNameSize: 14,
    itemDescriptionSize: 14,
    itemPriceSize: 16,
    headerLogoSize: 32,
    bottomNavSectionSize: 13,
    bottomNavCategorySize: 13,
  })
  const [theme, setTheme] = useState<{
    menuBackgroundR2Url?: string | null
    itemNameTextColor?: string | null
    itemPriceTextColor?: string | null
    itemDescriptionTextColor?: string | null
    bottomNavSectionNameColor?: string | null
    categoryNameColor?: string | null
    headerFooterBgColor?: string | null
    glassTintColor?: string | null
  } | null>(null)
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(0)
  
  // Refs for bottom navigation auto-scroll
  const categoryNavContainerRef = useRef<HTMLDivElement>(null)
  const categoryButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const isUserScrollingNav = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch theme data for menu background and text colors (shared function)
  const fetchTheme = useCallback(async () => {
    if (!slug) return
    try {
      const res = await fetch(`/data/theme?slug=${encodeURIComponent(slug)}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        if (data.theme) {
          setTheme({
            menuBackgroundR2Url: data.theme.menuBackgroundR2Url || null,
            itemNameTextColor: data.theme.itemNameTextColor || null,
            itemPriceTextColor: data.theme.itemPriceTextColor || null,
            itemDescriptionTextColor: data.theme.itemDescriptionTextColor || null,
            bottomNavSectionNameColor: data.theme.bottomNavSectionNameColor || null,
            categoryNameColor: data.theme.categoryNameColor || null,
            headerFooterBgColor: data.theme.headerFooterBgColor || null,
            glassTintColor: data.theme.glassTintColor || null,
          })
          
          // Apply text colors and new theme colors as CSS variables
          // IMPORTANT: Always clear previous restaurant's colors first to prevent mixing
          if (typeof document !== 'undefined') {
            // Clear all theme-related CSS variables first (prevents color mixing between restaurants)
            document.documentElement.style.removeProperty('--item-name-text-color')
            document.documentElement.style.removeProperty('--item-price-text-color')
            document.documentElement.style.removeProperty('--item-description-text-color')
            document.documentElement.style.removeProperty('--bottom-nav-section-name-color')
            document.documentElement.style.removeProperty('--category-name-color')
            document.documentElement.style.removeProperty('--header-footer-bg-color')
            document.documentElement.style.removeProperty('--glass-tint-color')
            
            // Now set only the current restaurant's theme colors (if they exist)
            if (data.theme.itemNameTextColor) {
              document.documentElement.style.setProperty('--item-name-text-color', data.theme.itemNameTextColor)
            }
            if (data.theme.itemPriceTextColor) {
              document.documentElement.style.setProperty('--item-price-text-color', data.theme.itemPriceTextColor)
            }
            if (data.theme.itemDescriptionTextColor) {
              document.documentElement.style.setProperty('--item-description-text-color', data.theme.itemDescriptionTextColor)
            }
            if (data.theme.bottomNavSectionNameColor) {
              document.documentElement.style.setProperty('--bottom-nav-section-name-color', data.theme.bottomNavSectionNameColor)
            }
            if (data.theme.categoryNameColor) {
              document.documentElement.style.setProperty('--category-name-color', data.theme.categoryNameColor)
            }
            // Apply header/footer background color
            if (data.theme.headerFooterBgColor) {
              document.documentElement.style.setProperty('--header-footer-bg-color', data.theme.headerFooterBgColor)
            }
            // Apply surface background color (solid, no liquid glass) or remove for liquid glass effect
            if (data.theme.glassTintColor) {
              // Store color as-is for solid background (no conversion to transparent overlay)
              document.documentElement.style.setProperty('--glass-tint-color', data.theme.glassTintColor)
            } else {
              // Remove CSS variable to restore liquid glass effect
              document.documentElement.style.removeProperty('--glass-tint-color')
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching theme:', error)
    }
  }, [slug])

  // Memoized fetch function for restaurant data (including service charge)
  const fetchRestaurantData = useCallback(async () => {
    try {
      const res = await fetch(`/data/restaurant?slug=${encodeURIComponent(slug)}&t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        setRestaurant(data)
        // Set service charge from restaurant data
        if (data.serviceChargePercent !== undefined && data.serviceChargePercent !== null) {
          const serviceCharge = typeof data.serviceChargePercent === 'number' 
            ? data.serviceChargePercent 
            : parseFloat(String(data.serviceChargePercent))
          setServiceChargePercent(isNaN(serviceCharge) ? 0 : serviceCharge)
        } else {
          setServiceChargePercent(0)
        }
      } else {
        console.error('Error fetching restaurant data:', res.status, res.statusText)
        setServiceChargePercent(0)
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error)
      setServiceChargePercent(0)
    }
  }, [slug]) // Dependency on slug

  useEffect(() => {
    // Load language from URL or localStorage
    const langParam = searchParams.get('lang')
    const savedLang = localStorage.getItem('language')
    const lang = (langParam || savedLang || 'en') as Language
    setCurrentLang(lang)
    if (!langParam) {
      localStorage.setItem('language', lang)
    }

    // Fetch menu data with progressive loading (bootstrap first, then full menu)
    const fetchMenu = async (retryCount = 0) => {
      try {
        // First, try to get bootstrap data (fast, cached) for immediate structure
        try {
          const bootstrapRes = await fetch(`/api/${slug}/public/menu-bootstrap`)
          if (bootstrapRes.ok) {
            const bootstrapData = await bootstrapRes.json()
            
            // Set restaurant info and theme immediately if available
            if (bootstrapData.restaurant) {
              setRestaurant(bootstrapData.restaurant)
              if (bootstrapData.restaurant.serviceChargePercent !== undefined) {
                setServiceChargePercent(bootstrapData.restaurant.serviceChargePercent ?? 0)
              }
            }
            if (bootstrapData.theme) {
              setTheme(bootstrapData.theme)
              // Apply CSS variables immediately
              if (typeof document !== 'undefined' && bootstrapData.theme) {
                document.documentElement.style.removeProperty('--item-name-text-color')
                document.documentElement.style.removeProperty('--item-price-text-color')
                document.documentElement.style.removeProperty('--item-description-text-color')
                document.documentElement.style.removeProperty('--bottom-nav-section-name-color')
                document.documentElement.style.removeProperty('--category-name-color')
                document.documentElement.style.removeProperty('--header-footer-bg-color')
                document.documentElement.style.removeProperty('--glass-tint-color')
                
                if (bootstrapData.theme.itemNameTextColor) {
                  document.documentElement.style.setProperty('--item-name-text-color', bootstrapData.theme.itemNameTextColor)
                }
                if (bootstrapData.theme.itemPriceTextColor) {
                  document.documentElement.style.setProperty('--item-price-text-color', bootstrapData.theme.itemPriceTextColor)
                }
                if (bootstrapData.theme.itemDescriptionTextColor) {
                  document.documentElement.style.setProperty('--item-description-text-color', bootstrapData.theme.itemDescriptionTextColor)
                }
                if (bootstrapData.theme.bottomNavSectionNameColor) {
                  document.documentElement.style.setProperty('--bottom-nav-section-name-color', bootstrapData.theme.bottomNavSectionNameColor)
                }
                if (bootstrapData.theme.categoryNameColor) {
                  document.documentElement.style.setProperty('--category-name-color', bootstrapData.theme.categoryNameColor)
                }
                if (bootstrapData.theme.headerFooterBgColor) {
                  document.documentElement.style.setProperty('--header-footer-bg-color', bootstrapData.theme.headerFooterBgColor)
                }
                if (bootstrapData.theme.glassTintColor) {
                  document.documentElement.style.setProperty('--glass-tint-color', bootstrapData.theme.glassTintColor)
                } else {
                  document.documentElement.style.removeProperty('--glass-tint-color')
                }
              }
            }
            
            // Set sections structure (without items) to show navigation immediately
            if (bootstrapData.sections && Array.isArray(bootstrapData.sections)) {
              const sectionsWithoutItems = bootstrapData.sections.map((s: any) => ({
                ...s,
                categories: s.categories.map((c: any) => ({ ...c, items: [] })),
              }))
              setSections(sectionsWithoutItems)
              
              // Auto-select section if structure is available
              if (sectionsWithoutItems.length > 0) {
                const storageKey = `menu-section-${slug}-${lang}`
                const savedSectionId = localStorage.getItem(storageKey)
                const savedSection = savedSectionId 
                  ? sectionsWithoutItems.find((s: Section) => s.id === savedSectionId && s.isActive)
                  : null
                
                if (savedSection) {
                  setActiveSectionId(savedSection.id)
                } else {
                  const sortedSections = sectionsWithoutItems
                    .filter((s: Section) => s.isActive)
                    .sort((a: Section, b: Section) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  if (sortedSections.length > 0) {
                    setActiveSectionId(sortedSections[0].id)
                    localStorage.setItem(storageKey, sortedSections[0].id)
                  }
                }
                setActiveCategoryId(null)
              }
            }
          }
        } catch (bootstrapError) {
          // Bootstrap failed, continue with full menu fetch
          if (process.env.NODE_ENV === 'development') {
            console.warn('Bootstrap fetch failed, falling back to full menu:', bootstrapError)
          }
        }
        
        // Now fetch full menu data (with items) - this can be slower but is cached
        const res = await fetch(`/data/menu?slug=${encodeURIComponent(slug)}`)
        if (!res.ok) {
          if (res.status === 404) {
            console.error('Restaurant not found for slug:', slug)
            setSections([])
            setAllItems([])
            setIsLoadingMenu(false)
            return
          }
          throw new Error(`Failed to fetch menu: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        const sectionsData = Array.isArray(data?.sections) ? data.sections : []
        
        // Update sections with full data (including items)
        setSections(sectionsData)
        
        // Auto-select section if not already selected
        if (sectionsData.length > 0 && !activeSectionId) {
          const storageKey = `menu-section-${slug}-${lang}`
          const savedSectionId = localStorage.getItem(storageKey)
          const savedSection = savedSectionId 
            ? sectionsData.find((s: Section) => s.id === savedSectionId && s.isActive)
            : null
          
          if (savedSection) {
            setActiveSectionId(savedSection.id)
          } else {
            const sortedSections = sectionsData
              .filter((s: Section) => s.isActive)
              .sort((a: Section, b: Section) => (a.sortOrder || 0) - (b.sortOrder || 0))
            if (sortedSections.length > 0) {
              setActiveSectionId(sortedSections[0].id)
              localStorage.setItem(storageKey, sortedSections[0].id)
            }
          }
          setActiveCategoryId(null)
        }
        
        // Flatten all items for search
        const items: Item[] = []
        sectionsData.forEach((section: Section) => {
          if (section?.categories && Array.isArray(section.categories)) {
            section.categories.forEach((category: Category) => {
              if (category?.items && Array.isArray(category.items)) {
                items.push(...category.items.filter((item) => item?.isActive))
              }
            })
          }
        })
        setAllItems(items)
        setIsLoadingMenu(false)
      } catch (error) {
        console.error('Error fetching menu:', error)
        if (retryCount < 1) {
          setTimeout(() => fetchMenu(retryCount + 1), 500)
          return
        }
        setSections([])
        setAllItems([])
        setIsLoadingMenu(false)
      }
    }
    fetchMenu()
    
    // Fetch both header logo (restaurant data) and footer logo together to sync loading
    const fetchLogosTogether = async () => {
      try {
        // Fetch both in parallel (restaurant data already fetched in bootstrap, but fetch footer logo)
        const [restaurantRes, footerLogoRes] = await Promise.all([
          // Only fetch if not already set from bootstrap
          restaurant ? Promise.resolve({ ok: true, json: async () => restaurant } as Response) : fetch(`/data/restaurant?slug=${encodeURIComponent(slug)}`),
          fetch(`/api/platform-settings`)
        ])

        // Process restaurant data (header logo + service charge)
        if (restaurantRes.ok) {
          const restaurantData = await restaurantRes.json()
          setRestaurant(restaurantData)
          // Set service charge from restaurant data
          if (restaurantData.serviceChargePercent !== undefined && restaurantData.serviceChargePercent !== null) {
            const serviceCharge = typeof restaurantData.serviceChargePercent === 'number' 
              ? restaurantData.serviceChargePercent 
              : parseFloat(String(restaurantData.serviceChargePercent))
            setServiceChargePercent(isNaN(serviceCharge) ? 0 : serviceCharge)
          } else {
            setServiceChargePercent(0)
          }
        } else {
          console.error('Error fetching restaurant data:', restaurantRes.status, restaurantRes.statusText)
          setServiceChargePercent(0)
        }

        // Process footer logo
        if (footerLogoRes.ok) {
          const footerLogoData = await footerLogoRes.json()
          if (footerLogoData.footerLogoR2Url) {
            setFooterLogoUrl(footerLogoData.footerLogoR2Url)
          } else {
            setFooterLogoUrl(null)
          }
        } else {
          setFooterLogoUrl(null)
        }
      } catch (error) {
        console.error('Error fetching logos:', error)
        setServiceChargePercent(0)
        setFooterLogoUrl(null)
      }
    }
    fetchLogosTogether()

    // Load basket from localStorage
    const savedBasket = localStorage.getItem('basket')
    if (savedBasket) {
      try {
        setBasket(JSON.parse(savedBasket))
      } catch (e) {
        console.error('Error loading basket:', e)
      }
    }

    // Fetch UI settings for this restaurant (only once per slug)
    const abortController = new AbortController()
    fetch(`/api/ui-settings?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      signal: abortController.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch UI settings: ${res.status}`)
        }
        return res.json()
      })
      .then((data) => {
        setUiSettings(data)
        // Update service charge from UI settings if available
        if (data.serviceChargePercent !== undefined && data.serviceChargePercent !== null) {
          const serviceCharge = typeof data.serviceChargePercent === 'number' 
            ? data.serviceChargePercent 
            : parseFloat(String(data.serviceChargePercent))
          if (!isNaN(serviceCharge)) {
            setServiceChargePercent(serviceCharge)
          }
        }
      })
      .catch((error) => {
        // Only log if not aborted (component unmounted)
        if (error.name !== 'AbortError' && process.env.NODE_ENV === 'development') {
        console.error('Error fetching UI settings:', error)
        }
        // Set defaults on error
        setUiSettings({
          sectionTitleSize: 22,
          categoryTitleSize: 16,
          itemNameSize: 14,
          itemDescriptionSize: 14,
          itemPriceSize: 16,
          headerLogoSize: 32,
          bottomNavSectionSize: 13,
          bottomNavCategorySize: 13,
        })
      })

    // Fetch theme on mount
    fetchTheme()

    return () => {
      abortController.abort()
              }

    // Extract service charge from restaurant data (already fetched above)
    // Will be set when restaurant data is fetched

    // Debug overflow in development
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        detectOverflow()
      }, 500)
    }
  }, [searchParams, slug, fetchTheme])

  // Auto-select section when sections are loaded and no section is selected (fallback safety)
  useEffect(() => {
    // Only run if we have sections but no active section selected
    if (sections.length === 0 || activeSectionId) return
    
    const sortedSections = sections
      .filter((s: Section) => s.isActive)
      .sort((a: Section, b: Section) => (a.sortOrder || 0) - (b.sortOrder || 0))
    
    if (sortedSections.length > 0) {
      const storageKey = `menu-section-${slug}-${currentLang}`
      const savedSectionId = localStorage.getItem(storageKey)
      const savedSection = savedSectionId 
        ? sortedSections.find((s: Section) => s.id === savedSectionId && s.isActive)
        : null
      
      if (savedSection) {
        setActiveSectionId(savedSection.id)
      } else {
        setActiveSectionId(sortedSections[0].id)
        localStorage.setItem(storageKey, sortedSections[0].id)
      }
      setActiveCategoryId(null)
    }
  }, [sections.length, activeSectionId, slug, currentLang])

  // End loading state when we have sections AND (a section is selected OR sections are empty)
  useEffect(() => {
    if (!isLoadingMenu) return
    
    if (sections.length === 0) {
      // No sections at all, end loading
      setIsLoadingMenu(false)
      return
    }
    
    // We have sections - check if we need to wait for selection
    const hasActiveSections = sections.some((s: Section) => s.isActive)
    if (!hasActiveSections) {
      // No active sections available, end loading (will show empty state)
      setIsLoadingMenu(false)
      return
    }
    
    // We have active sections - wait until one is selected
    if (activeSectionId) {
      setIsLoadingMenu(false)
    }
  }, [sections, activeSectionId, isLoadingMenu])

  // Refetch UI settings when page becomes visible (after admin changes)
  useEffect(() => {
    if (!slug) return

    const abortController = new AbortController()
    
    const fetchUiSettings = () => {
      fetch(`/api/ui-settings?slug=${encodeURIComponent(slug)}`, {
        cache: 'no-store',
        signal: abortController.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch UI settings: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          setUiSettings(data)
          // Update service charge from UI settings if available
          if (data.serviceChargePercent !== undefined && data.serviceChargePercent !== null) {
            const serviceCharge = typeof data.serviceChargePercent === 'number' 
              ? data.serviceChargePercent 
              : parseFloat(String(data.serviceChargePercent))
            if (!isNaN(serviceCharge)) {
              setServiceChargePercent(serviceCharge)
            }
          }
        })
        .catch((error) => {
          // Only log if not aborted
          if (error.name !== 'AbortError' && process.env.NODE_ENV === 'development') {
          console.error('Error fetching UI settings:', error)
          }
        })
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible, refetch to get latest settings
        fetchUiSettings()
        fetchRestaurantData()
      }
    }

    const handleFocus = () => {
      // Window regained focus, refetch to get latest settings
      fetchUiSettings()
      fetchRestaurantData()
    }

    // Listen for storage events (when admin saves settings in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'typography-updated') {
        // Admin panel saved typography, refetch immediately
        fetchUiSettings()
      }
      if (e.key === 'service-charge-updated') {
        // Admin panel saved service charge, refetch restaurant data immediately
        fetchRestaurantData()
      }
      if (e.key === 'theme-updated') {
        // Admin panel saved theme (including menu background), refetch theme immediately
        fetchTheme()
      }
    }

    // Listen for custom events (when admin saves settings in same tab)
    const handleTypographyUpdate = () => {
      fetchUiSettings()
    }
    
    const handleServiceChargeUpdate = () => {
      fetchRestaurantData()
    }

    const handleThemeUpdate = () => {
      fetchTheme()
    }

    // Periodic refresh removed - rely on storage events and visibility changes instead
    // This prevents spam and reduces server load

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('typography-updated', handleTypographyUpdate)
    window.addEventListener('service-charge-updated', handleServiceChargeUpdate)
    window.addEventListener('theme-updated', handleThemeUpdate)

    return () => {
      abortController.abort()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('typography-updated', handleTypographyUpdate)
      window.removeEventListener('service-charge-updated', handleServiceChargeUpdate)
      window.removeEventListener('theme-updated', handleThemeUpdate)
    }
  }, [slug, fetchRestaurantData, fetchTheme]) // Include fetchTheme in dependencies

  // Set up Intersection Observer to track visible categories on scroll
  useEffect(() => {
    if (sections.length === 0 || !activeSectionId) return

    const observerOptions = {
      root: null,
      rootMargin: '-200px 0px -60% 0px', // Account for header (~73px) and bottom nav (~107px) = ~180px, plus some margin
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0], // Multiple thresholds for better detection
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find all visible entries
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // Sort by intersection ratio to get the most visible one
        const mostVisible = visibleEntries.reduce((prev, current) => 
          current.intersectionRatio > prev.intersectionRatio ? current : prev
        )
        
        // Extract category ID from element id
        const categoryId = mostVisible.target.id.replace('category-', '')
        if (categoryId && Array.isArray(sections)) {
          // Verify this category belongs to the active section
          const activeSection = sections.find(s => s.id === activeSectionId)
          if (activeSection?.categories && Array.isArray(activeSection.categories)) {
            if (activeSection.categories.some(c => c.id === categoryId && c.isActive)) {
              setActiveCategoryId(categoryId)
            }
          }
        }
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all category elements after DOM is ready
    const observeCategories = () => {
      // Disconnect previous observations
      observer.disconnect()
      
      // Find all category elements for the active section
      const categoryElements = document.querySelectorAll('[id^="category-"]')
      if (categoryElements.length > 0) {
        categoryElements.forEach((el) => observer.observe(el))
      }
    }

    // Wait a bit for DOM to be ready, then observe
    // Use a longer delay to ensure categories are rendered
    const timeoutId = setTimeout(observeCategories, 500)
    
    // Also observe after a longer delay in case of slow rendering
    const timeoutId2 = setTimeout(observeCategories, 1000)

    // Cleanup observer on unmount or when sections change
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(timeoutId2)
      observer.disconnect()
    }
  }, [sections, activeSectionId])

  // Auto-scroll bottom navigation when active category changes
  useEffect(() => {
    if (!activeCategoryId || isUserScrollingNav.current) return
    
    const categoryButton = categoryButtonRefs.current.get(activeCategoryId)
    if (categoryButton && categoryNavContainerRef.current) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        if (!isUserScrollingNav.current) {
          categoryButton.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest',
          })
        }
      })
    }
  }, [activeCategoryId])

  // Handle user scrolling the navigation (debounce)
  useEffect(() => {
    const container = categoryNavContainerRef.current
    if (!container) return

    const handleScroll = () => {
      isUserScrollingNav.current = true
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Reset flag after user stops scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingNav.current = false
      }, 150)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    container.addEventListener('touchstart', handleScroll, { passive: true })
    container.addEventListener('touchmove', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
      container.removeEventListener('touchstart', handleScroll)
      container.removeEventListener('touchmove', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Save basket to localStorage
    localStorage.setItem('basket', JSON.stringify(basket))
  }, [basket])

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang)
    localStorage.setItem('language', lang)
  }

  const handleItemClick = (itemId: string) => {
    if (!Array.isArray(allItems)) return
    const item = allItems.find((i) => i?.id === itemId)
    if (item) {
      setSelectedItem(item)
      setIsItemModalOpen(true)
    }
  }

  const handleAddToBasket = (itemId: string) => {
    if (!Array.isArray(allItems)) return
    const item = allItems.find((i) => i?.id === itemId)
    if (!item) return

    setBasket((prev) => {
      if (!Array.isArray(prev)) prev = []
      const wasEmpty = prev.length === 0
      const existing = prev.find((i) => i?.id === itemId)
      
      // Check if this is the first add (basket was empty)
      if (wasEmpty) {
        setIsFirstAdd(true)
        setShouldAnimateBasket(true)
      } else {
        setIsFirstAdd(false)
      }
      
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          nameKu: item.nameKu,
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          price: item.price,
          imageMediaId: item.imageMediaId,
          imageR2Url: item.imageR2Url,
          imageR2Key: item.imageR2Key,
          quantity: 1,
        },
      ]
    })
  }

  const handleBasketAnimationComplete = () => {
    setShouldAnimateBasket(false)
    setIsFirstAdd(false)
  }

  const handleQuantityChange = (itemId: string, delta: number) => {
    setBasket((prev) => {
      const item = prev.find((i) => i.id === itemId)
      if (!item) return prev

      const newQuantity = item.quantity + delta
      if (newQuantity <= 0) {
        return prev.filter((i) => i.id !== itemId)
      }

      return prev.map((i) =>
        i.id === itemId ? { ...i, quantity: newQuantity } : i
      )
    })
  }

  const activeSection = Array.isArray(sections) ? sections.find((s) => s?.id === activeSectionId) : null
  const activeCategories = activeSection && Array.isArray(activeSection.categories)
    ? activeSection.categories
        .filter((c) => c?.isActive)
        .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
    : []
  
  // Group items by category
  const itemsByCategory = activeSection && Array.isArray(activeSection.categories)
    ? activeSection.categories
        .filter((c) => c?.isActive !== false) // Show all categories, not just active ones
        .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
        .map((category) => ({
          category,
          items: Array.isArray(category.items) 
            ? category.items
                .filter((i) => i?.isActive !== false) // Show all items, not just active ones
                .sort((a, b) => (a?.sortOrder || 0) - (b?.sortOrder || 0))
            : [],
        }))
        .filter((group) => group.items.length > 0)
    : []


  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      // Account for header (~73px) and fixed section/categories box (~107px) = ~180px
      const headerOffset = 180
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // Calculate background style with image overlay if exists
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: 'var(--app-bg, #400810)',
  }
  
  if (theme?.menuBackgroundR2Url) {
    backgroundStyle.backgroundImage = `url(${theme.menuBackgroundR2Url})`
    backgroundStyle.backgroundSize = 'cover'
    backgroundStyle.backgroundPosition = 'center'
    backgroundStyle.backgroundRepeat = 'no-repeat'
    backgroundStyle.backgroundAttachment = 'fixed'
  }

  return (
    <div 
      className="min-h-dvh w-full overflow-x-hidden" 
      style={backgroundStyle}
    >
      <MenuHeader
        logoUrl={restaurant?.logoR2Url || (restaurant?.logoMediaId ? `/assets/${restaurant.logoMediaId}` : undefined)}
      />

      <FloatingActionBar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onSearchClick={() => setIsSearchOpen(true)}
        onFeedbackClick={() => router.push(`/${slug}/feedback`)}
      />

      <AnimatedBasketIcon
        itemCount={basket.reduce((sum, item) => sum + item.quantity, 0)}
        onBasketClick={() => setIsBasketOpen(true)}
        shouldAnimate={shouldAnimateBasket}
        onAnimationComplete={handleBasketAnimationComplete}
        isFirstAdd={isFirstAdd}
      />

      {/* Fixed Sections and Categories Box - Bottom of page */}
      <div 
        className="fixed left-0 right-0 z-20 px-2 sm:px-4 py-4 w-full"
        style={{
          position: 'fixed',
          bottom: footerLogoUrl ? 'calc(24px + env(safe-area-inset-bottom, 0))' : 'env(safe-area-inset-bottom, 0)',
          left: 0,
          right: 0,
          zIndex: 20,
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative inline-block w-full max-w-full">
            {/* Triangular background shape with rounded edges */}
            <div 
              className={`relative px-3 sm:px-6 py-3 rounded-xl border w-full overflow-hidden ${theme?.glassTintColor ? '' : 'backdrop-blur-sm'}`}
              style={{
                backgroundColor: theme?.glassTintColor || 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                boxShadow: `0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
              }}
            >
              {/* Left triangular accent */}
              <div 
                className="absolute left-0 top-0 bottom-0 z-10"
                style={{
                  width: '1.125rem',
                  background: `linear-gradient(to right, var(--auto-edge-accent, rgba(64, 8, 16, 0.4)), transparent)`,
                  clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                  borderRadius: '0.75rem 0 0 0.75rem'
                }}
              ></div>
              {/* Right triangular accent */}
              <div 
                className="absolute right-0 top-0 bottom-0 z-10"
                style={{
                  width: '1.125rem',
                  background: `linear-gradient(to left, var(--auto-edge-accent, rgba(64, 8, 16, 0.4)), transparent)`,
                  clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                  borderRadius: '0 0.75rem 0.75rem 0'
                }}
              ></div>
              
              {/* Sections - Fixed, no scroll */}
              <div className="flex gap-1.5 sm:gap-2 items-center justify-center mb-2 w-full overflow-hidden relative z-10">
                {sections.filter((s) => s.isActive).map((section) => {
                  const isActive = activeSectionId === section.id
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSectionId(section.id)
                        setActiveCategoryId(null) // Reset active category when section changes
                        // Save selection to localStorage
                        const storageKey = `menu-section-${slug}-${currentLang}`
                        localStorage.setItem(storageKey, section.id)
                      }}
                      className="flex-shrink-0 relative group"
                    >
                      {/* Section button with same structure as category */}
                      <div 
                        className="relative backdrop-blur-sm rounded-lg border transition-colors duration-300 flex items-center justify-center"
                        style={{
                          backgroundColor: isActive 
                            ? 'var(--auto-lighter-surface, rgba(255, 255, 255, 0.15))' 
                            : 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                          borderColor: isActive
                            ? 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                            : 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                          boxShadow: 'none',
                          fontSize: 'var(--bottom-nav-section-size)',
                          padding: '0.25em 0.8em',
                          lineHeight: '1.1',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--auto-surface-bg-2, rgba(255, 255, 255, 0.15))'
                            e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))'
                            e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.2))'
                          } else {
                            e.currentTarget.style.backgroundColor = 'var(--auto-lighter-surface, rgba(255, 255, 255, 0.15))'
                            e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                          }
                        }}
                      >
                        <span 
                          className="relative font-semibold whitespace-nowrap"
                          style={{ 
                            color: theme?.bottomNavSectionNameColor || 'var(--auto-text-primary, #FFFFFF)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {getLocalizedText(section, currentLang)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Categories - Separate scrollable container */}
              {activeCategories.length > 0 && (
                <div 
                  ref={categoryNavContainerRef}
                  className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide items-center w-full relative z-10" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {activeCategories.map((category) => {
                    const isActive = activeCategoryId === category.id
                    return (
                      <button
                        key={category.id}
                        ref={(el) => {
                          if (el) {
                            categoryButtonRefs.current.set(category.id, el)
                          } else {
                            categoryButtonRefs.current.delete(category.id)
                          }
                        }}
                        onClick={() => handleCategoryClick(category.id)}
                        className="flex-shrink-0 relative group"
                      >
                        {/* Category button with triangular background */}
                        <div 
                          className="relative backdrop-blur-sm rounded-lg border transition-colors duration-300 flex items-center justify-center"
                          style={{
                            backgroundColor: isActive 
                              ? 'var(--auto-lighter-surface, rgba(255, 255, 255, 0.15))' 
                              : 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                            borderColor: isActive
                              ? 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                              : 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                            boxShadow: 'none',
                            fontSize: 'var(--bottom-nav-category-size)',
                            padding: '0.25em 0.8em',
                            lineHeight: '1.1',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--auto-surface-bg-2, rgba(255, 255, 255, 0.15))'
                              e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.backgroundColor = 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))'
                              e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.2))'
                            } else {
                              e.currentTarget.style.backgroundColor = 'var(--auto-lighter-surface, rgba(255, 255, 255, 0.15))'
                              e.currentTarget.style.borderColor = 'var(--auto-border, rgba(255, 255, 255, 0.3))'
                            }
                          }}
                        >
                          <span 
                            className="relative font-semibold whitespace-nowrap"
                            style={{ 
                              color: theme?.categoryNameColor || 'var(--auto-text-primary, #FFFFFF)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            {getLocalizedText(category, currentLang)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay between header/navigation and items - consistent color */}
      <div 
        className="fixed left-0 right-0 bottom-0 pointer-events-none z-0 w-full" 
        style={{
          backgroundColor: 'transparent',
          top: '140px',
          height: 'calc(100dvh - 140px)',
          maxWidth: '100vw'
        }}
      ></div>

      <div className="pb-20 relative z-10 w-full overflow-x-hidden" style={{ paddingBottom: '180px' }}>
        {/* Items Grid - Grouped by Category */}
        {isLoadingMenu ? (
          // Show skeleton UI immediately while loading
          <div className="px-2 sm:px-4 space-y-8 pt-2 w-full max-w-full">
            {/* Show skeleton for first section/category */}
            <div className="space-y-4">
              <SectionHeaderSkeleton />
              <CategorySectionSkeleton />
            </div>
            {/* Show one more skeleton for variety */}
            <div className="space-y-4">
              <SectionHeaderSkeleton />
              <CategorySectionSkeleton />
            </div>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <p className="text-white/70 text-center">No sections available.</p>
          </div>
        ) : !activeSection ? (
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <p className="text-white/70 text-center">No section selected. Please select a section from the navigation below.</p>
          </div>
        ) : itemsByCategory.length === 0 ? (
          <div className="flex items-center justify-center min-h-[50vh] px-4">
            <p className="text-white/70 text-center">No items found in this section.</p>
          </div>
        ) : (
          <div className="px-2 sm:px-4 space-y-8 pt-2 w-full max-w-full">
            {itemsByCategory.map(({ category, items }, index) => {
              return (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-4">
                  {/* Category Header with Triangular Background */}
                  <div 
                    className={`mb-4 transition-all duration-300 ${index === 0 ? 'pt-0' : 'pt-0'}`}
                  >
                    <div className="relative inline-block w-full max-w-full">
                      {/* Triangular background shape with rounded edges */}
                      <div 
                        className={`relative px-3 sm:px-6 py-3 rounded-xl border w-full overflow-hidden ${theme?.glassTintColor ? '' : 'backdrop-blur-sm'}`}
                        style={{
                          backgroundColor: theme?.glassTintColor || 'var(--auto-surface-bg, rgba(255, 255, 255, 0.1))',
                          borderColor: 'var(--auto-border, rgba(255, 255, 255, 0.2))',
                          boxShadow: `0 0 20px var(--auto-primary-glow, rgba(128, 0, 32, 0.35)), 0 10px 25px -5px var(--auto-shadow-color, rgba(0, 0, 0, 0.3)), 0 4px 6px -2px var(--auto-shadow-color-light, rgba(0, 0, 0, 0.1))`,
                        }}
                      >
                        {/* Left triangular accent */}
                        <div 
                          className="absolute left-0 top-0 bottom-0"
                          style={{
                            width: '1.125rem',
                            background: `linear-gradient(to right, var(--auto-edge-accent, rgba(64, 8, 16, 0.4)), transparent)`,
                            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
                            borderRadius: '0.75rem 0 0 0.75rem'
                          }}
                        ></div>
                        {/* Right triangular accent */}
                        <div 
                          className="absolute right-0 top-0 bottom-0"
                          style={{
                            width: '1.125rem',
                            background: `linear-gradient(to left, var(--auto-edge-accent, rgba(64, 8, 16, 0.4)), transparent)`,
                            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
                            borderRadius: '0 0.75rem 0.75rem 0'
                          }}
                        ></div>
                        <h2 
                          className="relative font-bold transition-all duration-300"
                          style={{ 
                            fontSize: 'var(--menu-category-size)',
                            color: theme?.categoryNameColor || 'var(--auto-text-primary, #FFFFFF)',
                          }}
                        >
                          {getLocalizedText(category, currentLang)}
                        </h2>
                      </div>
                    </div>
                  </div>
                  
                  {/* Items Grid */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-3 pb-6 w-full items-stretch">
                    {items.map((item, index) => {
                      const basketItem = Array.isArray(basket) ? basket.find((bi) => bi?.id === item?.id) : null
                      // Only prioritize first 2 items for faster initial load
                      const isPriority = index < 2
                      return (
                        <ItemCard
                          key={item.id}
                          item={item}
                          currentLang={currentLang}
                          onItemClick={handleItemClick}
                          onAddToBasket={handleAddToBasket}
                          quantity={basketItem?.quantity || 0}
                          priority={isPriority}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modals and Drawers */}
      <ItemModal
        item={selectedItem}
        currentLang={currentLang}
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
      />

      <SearchDrawer
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={allItems}
        currentLang={currentLang}
        onItemClick={handleItemClick}
      />

      <BasketDrawer
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        items={basket}
        currentLang={currentLang}
        onQuantityChange={handleQuantityChange}
        serviceChargePercent={serviceChargePercent}
      />

      {/* Powered By Footer */}
      <PoweredByFooter footerLogoUrl={footerLogoUrl} />
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh w-full flex items-center justify-center" style={{ backgroundColor: 'var(--app-bg, #400810)' }}>
        <div className="text-white">Loading...</div>
      </div>
    }>
      <MenuPageContent />
    </Suspense>
  )
}

