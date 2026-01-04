import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Load fallback data from JSON file (updated by admin panel)
const getFallbackData = async (slug: string) => {
  try {
    const filePath = join(process.cwd(), 'data', 'fallback-restaurant.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const fallbackData = JSON.parse(fileContent)
    return {
      ...fallbackData,
      logo: null,
      footerLogo: null,
      welcomeBackground: null,
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    // If JSON file doesn't exist or can't be read, use hardcoded defaults
    console.warn('Could not read fallback JSON file, using hardcoded defaults:', error)
    return {
      id: 'fallback',
      nameKu: 'رێستۆرانتی',
      nameEn: 'Restaurant',
      nameAr: 'مطعم',
      logoMediaId: null,
      logo: null,
      footerLogoMediaId: null,
      footerLogo: null,
      welcomeBackgroundMediaId: null,
      welcomeBackground: null,
      welcomeOverlayColor: '#000000',
      welcomeOverlayOpacity: 0.5,
      welcomeTextEn: null,
      googleMapsUrl: null,
      phoneNumber: null,
      brandColors: {
        menuGradientStart: '#5C0015',
        menuGradientEnd: '#800020',
        headerText: '#FFFFFF',
        headerIcons: '#FFFFFF',
        activeTab: '#FFFFFF',
        inactiveTab: '#CCCCCC',
        categoryCardBg: '#4A5568',
        itemCardBg: '#4A5568',
        itemNameText: '#FFFFFF',
        itemDescText: '#E2E8F0',
        priceText: '#FBBF24',
        dividerLine: '#718096',
        modalBg: '#2D3748',
        modalOverlay: 'rgba(0,0,0,0.7)',
        buttonBg: '#800020',
        buttonText: '#FFFFFF',
        feedbackCardBg: '#4A5568',
        feedbackCardText: '#FFFFFF',
        welcomeOverlayColor: '#000000',
        welcomeOverlayOpacity: 0.5,
      },
      updatedAt: new Date().toISOString(),
    }
  }
}

export async function GET(request: NextRequest) {
  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('[ERROR] DATABASE_URL environment variable is not set')
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug') || 'legends-restaurant'
    const fallbackData = await getFallbackData(slug)
    return NextResponse.json(fallbackData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'X-Fallback': 'true',
      },
    })
  }

  try {
    // Require slug parameter - no fallback
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 })
    }

    // Remove debug logging in production to avoid exposing sensitive info
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEBUG] /data/restaurant - Received slug:', slug)
    }

    // Query by slug - no fallback to first restaurant
    // Try to include footerLogo, but handle gracefully if column doesn't exist
    let restaurant: any = null
    try {
      // Set a timeout for database queries to handle slow connections (5 seconds)
      const queryPromise = prisma.restaurant.findUnique({
        where: { slug },
        include: {
          logo: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
          footerLogo: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
          welcomeBackground: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
        },
      })

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Database query timeout')), 5000)
      })

      restaurant = await Promise.race([queryPromise, timeoutPromise]) as any
    } catch (error: any) {
      // If footerLogo relation fails (column doesn't exist), retry without it
      if (error?.message?.includes('footerLogo') || error?.code === 'P2021') {
        console.warn('footerLogo column not found, querying without it')
        restaurant = await prisma.restaurant.findUnique({
          where: { slug },
          include: {
            logo: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
            welcomeBackground: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
          },
        })
      } else {
        // If it's a timeout or connection error, return fallback
        if (error?.message?.includes('timeout') || error?.code === 'P1001' || error?.code === 'P1002') {
          console.warn('[WARN] Database connection issue, returning fallback data:', error.message)
          const fallbackData = await getFallbackData(slug)
          return NextResponse.json(fallbackData, {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              'X-Fallback': 'true',
            },
          })
        }
        throw error
      }
    }

    // Auto-create "legends-restaurant" if it doesn't exist (only for this specific slug)
    if (!restaurant && slug === 'legends-restaurant') {
      console.log('[DEBUG] Auto-creating legends-restaurant...')
      try {
        // Get fallback data to use as defaults
        const fallbackData = await getFallbackData(slug)
        
        restaurant = await prisma.restaurant.upsert({
          where: { slug: 'legends-restaurant' },
          update: {},
          create: {
            slug: 'legends-restaurant',
            nameKu: fallbackData.nameKu || 'رێستۆرانتی لێجەندز',
            nameEn: fallbackData.nameEn || 'Legends Restaurant',
            nameAr: fallbackData.nameAr || 'مطعم الأساطير',
            googleMapsUrl: fallbackData.googleMapsUrl || 'https://maps.google.com',
            phoneNumber: fallbackData.phoneNumber || '+9647501234567',
            welcomeOverlayColor: fallbackData.welcomeOverlayColor || '#000000',
            welcomeOverlayOpacity: fallbackData.welcomeOverlayOpacity || 0.5,
            brandColors: fallbackData.brandColors || {
              menuGradientStart: '#5C0015',
              menuGradientEnd: '#800020',
              headerText: '#FFFFFF',
              headerIcons: '#FFFFFF',
              activeTab: '#FFFFFF',
              inactiveTab: '#CCCCCC',
              categoryCardBg: '#4A5568',
              itemCardBg: '#4A5568',
              itemNameText: '#FFFFFF',
              itemDescText: '#E2E8F0',
              priceText: '#FBBF24',
              dividerLine: '#718096',
              modalBg: '#2D3748',
              modalOverlay: 'rgba(0,0,0,0.7)',
              buttonBg: '#800020',
              buttonText: '#FFFFFF',
              feedbackCardBg: '#4A5568',
              feedbackCardText: '#FFFFFF',
              welcomeOverlayColor: '#000000',
              welcomeOverlayOpacity: 0.5,
            },
          },
          include: {
            logo: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
            footerLogo: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
            welcomeBackground: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
          },
        })
      } catch (error: any) {
        // If footerLogo relation fails, retry without it
        if (error?.message?.includes('footerLogo') || error?.code === 'P2021') {
          console.warn('footerLogo column not found in upsert, retrying without it')
          // Get fallback data to use as defaults
          const fallbackDataRetry = await getFallbackData(slug)
          
          restaurant = await prisma.restaurant.upsert({
            where: { slug: 'legends-restaurant' },
            update: {},
            create: {
              slug: 'legends-restaurant',
              nameKu: fallbackDataRetry.nameKu || 'رێستۆرانتی لێجەندز',
              nameEn: fallbackDataRetry.nameEn || 'Legends Restaurant',
              nameAr: fallbackDataRetry.nameAr || 'مطعم الأساطير',
              googleMapsUrl: fallbackDataRetry.googleMapsUrl || 'https://maps.google.com',
              phoneNumber: fallbackDataRetry.phoneNumber || '+9647501234567',
              welcomeOverlayColor: fallbackDataRetry.welcomeOverlayColor || '#000000',
              welcomeOverlayOpacity: fallbackDataRetry.welcomeOverlayOpacity || 0.5,
              brandColors: fallbackDataRetry.brandColors || {
                menuGradientStart: '#5C0015',
                menuGradientEnd: '#800020',
                headerText: '#FFFFFF',
                headerIcons: '#FFFFFF',
                activeTab: '#FFFFFF',
                inactiveTab: '#CCCCCC',
                categoryCardBg: '#4A5568',
                itemCardBg: '#4A5568',
                itemNameText: '#FFFFFF',
                itemDescText: '#E2E8F0',
                priceText: '#FBBF24',
                dividerLine: '#718096',
                modalBg: '#2D3748',
                modalOverlay: 'rgba(0,0,0,0.7)',
                buttonBg: '#800020',
                buttonText: '#FFFFFF',
                feedbackCardBg: '#4A5568',
                feedbackCardText: '#FFFFFF',
                welcomeOverlayColor: '#000000',
                welcomeOverlayOpacity: 0.5,
              },
            },
            include: {
              logo: {
                select: {
                  id: true,
                  mimeType: true,
                  size: true,
                },
              },
              welcomeBackground: {
                select: {
                  id: true,
                  mimeType: true,
                  size: true,
                },
              },
            },
          })
        } else {
          throw error
        }
      }
      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG] Auto-created legends-restaurant:', restaurant.id)
      }
    }

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found for slug: ' + slug }, { status: 404 })
    }

    // Safely access footerLogoMediaId and footerLogo - may not exist if migration hasn't run
    const footerLogoMediaId = (restaurant as any).footerLogoMediaId || null
    const footerLogo = (restaurant as any).footerLogo || null

    return NextResponse.json(
      {
        id: restaurant.id,
        nameKu: restaurant.nameKu,
        nameEn: restaurant.nameEn,
        nameAr: restaurant.nameAr,
        logoMediaId: restaurant.logoMediaId,
        logo: restaurant.logo,
        footerLogoMediaId: footerLogoMediaId,
        footerLogo: footerLogo,
        welcomeBackgroundMediaId: restaurant.welcomeBackgroundMediaId,
        welcomeBackground: restaurant.welcomeBackground,
        welcomeOverlayColor: restaurant.welcomeOverlayColor,
        welcomeOverlayOpacity: restaurant.welcomeOverlayOpacity,
        welcomeTextEn: restaurant.welcomeTextEn,
        googleMapsUrl: restaurant.googleMapsUrl,
        phoneNumber: restaurant.phoneNumber,
        brandColors: restaurant.brandColors,
        updatedAt: restaurant.updatedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error) {
    // Log full error details on server (never expose to client)
    const errorDetails = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack,
    } : { message: 'Unknown error', error }
    console.error('[ERROR] Error fetching restaurant:', errorDetails)

    // Return fallback data instead of error to prevent frontend crash
    const searchParams = request.nextUrl.searchParams
    const slug = searchParams.get('slug') || 'legends-restaurant'
    const fallbackData = await getFallbackData(slug)
    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 with fallback data instead of 500
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'X-Fallback': 'true',
        'X-Error': 'true', // Signal that fallback was used
      },
    })
  }
}

