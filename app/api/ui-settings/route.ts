import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default values (same as admin endpoint)
const DEFAULT_SETTINGS = {
  sectionTitleSize: 22,
  categoryTitleSize: 16,
  itemNameSize: 14,
  itemDescriptionSize: 14,
  itemPriceSize: 16,
  headerLogoSize: 32,
  bottomNavSectionSize: 13,
  bottomNavCategorySize: 13,
}

export async function GET(request: NextRequest) {
  try {
    // Require slug parameter - no fallback
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 })
    }

    // Resolve restaurant by slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true },
    })

    // Return 404 if restaurant doesn't exist (deleted)
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        }
      )
    }

    // Get UI settings for this restaurant only
    let settings
    try {
      settings = await prisma.uiSettings.findUnique({
        where: { restaurantId: restaurant.id },
      })
    } catch (findError: any) {
      // If findUnique fails, create defaults for this restaurant
      if (findError?.code === 'P2021' || findError?.code === 'P2022') {
        console.warn('UiSettings table or columns missing, creating defaults for restaurant:', restaurant.id)
        try {
          settings = await prisma.uiSettings.create({
            data: {
              restaurantId: restaurant.id,
              ...DEFAULT_SETTINGS,
            },
          })
        } catch (createError) {
          console.error('Error creating UiSettings:', createError)
          // Return defaults if create fails
          return NextResponse.json(DEFAULT_SETTINGS, {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
            },
          })
        }
      } else {
        throw findError
      }
    }
    
    const noCacheHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    }

    if (!settings) {
      // Create default settings for this restaurant if they don't exist
      try {
        settings = await prisma.uiSettings.create({
          data: {
            restaurantId: restaurant.id,
            ...DEFAULT_SETTINGS,
          },
        })
      } catch (createError) {
        console.error('Error creating UiSettings:', createError)
        // Return defaults if create fails
        return NextResponse.json(DEFAULT_SETTINGS, {
          headers: noCacheHeaders,
        })
      }
    }

    const responseData = {
      sectionTitleSize: settings.sectionTitleSize,
      categoryTitleSize: settings.categoryTitleSize,
      itemNameSize: settings.itemNameSize,
      itemDescriptionSize: settings.itemDescriptionSize,
      itemPriceSize: settings.itemPriceSize,
      headerLogoSize: settings.headerLogoSize,
      bottomNavSectionSize: (settings as any).bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
      bottomNavCategorySize: (settings as any).bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
    }
    
    return NextResponse.json(responseData, {
      headers: noCacheHeaders,
    })
  } catch (error: any) {
    console.error('Error fetching UI settings:', error)
    
    // Return defaults on error
    return NextResponse.json(DEFAULT_SETTINGS, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  }
}

