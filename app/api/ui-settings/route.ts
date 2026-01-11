import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default UI settings values (for UiSettings table)
const DEFAULT_UI_SETTINGS = {
  sectionTitleSize: 22,
  categoryTitleSize: 16,
  itemNameSize: 14,
  itemDescriptionSize: 14,
  itemPriceSize: 16,
  headerLogoSize: 32,
  bottomNavSectionSize: 13,
  bottomNavCategorySize: 13,
}

// Default response values (includes all fields returned to frontend)
const DEFAULT_RESPONSE = {
  ...DEFAULT_UI_SETTINGS,
  serviceChargePercent: 0,
  headerFooterBgColor: null,
  glassTintColor: null,
}

const querySchema = z.object({
  slug: z.string().min(1).optional(),
  restaurantId: z.string().min(1).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = {
      slug: searchParams.get('slug'),
      restaurantId: searchParams.get('restaurantId'),
    }

    // Validate query parameters
    const validation = querySchema.safeParse(query)
    if (!validation.success || (!query.slug && !query.restaurantId)) {
      return NextResponse.json(
        { error: 'Either slug or restaurantId parameter is required' },
        { status: 400 }
      )
    }

    // Resolve restaurant by slug or restaurantId
    let restaurant
    if (query.restaurantId) {
      restaurant = await prisma.restaurant.findUnique({
        where: { id: query.restaurantId },
        select: { id: true, serviceChargePercent: true },
      })
    } else {
      restaurant = await prisma.restaurant.findUnique({
        where: { slug: query.slug! },
        select: { id: true, serviceChargePercent: true },
    })
    }

    // Return 404 if restaurant doesn't exist
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
              ...DEFAULT_UI_SETTINGS,
            },
          })
        } catch (createError) {
          console.error('Error creating UiSettings:', createError)
          // Return defaults if create fails
          return NextResponse.json(DEFAULT_RESPONSE, {
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
            ...DEFAULT_UI_SETTINGS,
          },
        })
      } catch (createError) {
        console.error('Error creating UiSettings:', createError)
        // Return defaults if create fails
        return NextResponse.json(DEFAULT_RESPONSE, {
          headers: noCacheHeaders,
        })
      }
    }

    // Get theme for headerFooterBgColor and glassTintColor
    const theme = await prisma.theme.findUnique({
      where: { restaurantId: restaurant.id },
      select: { headerFooterBgColor: true, glassTintColor: true },
    })

    const responseData = {
      sectionTitleSize: settings.sectionTitleSize,
      categoryTitleSize: settings.categoryTitleSize,
      itemNameSize: settings.itemNameSize,
      itemDescriptionSize: settings.itemDescriptionSize,
      itemPriceSize: settings.itemPriceSize,
      headerLogoSize: settings.headerLogoSize,
      bottomNavSectionSize: (settings as any).bottomNavSectionSize ?? DEFAULT_UI_SETTINGS.bottomNavSectionSize,
      bottomNavCategorySize: (settings as any).bottomNavCategorySize ?? DEFAULT_UI_SETTINGS.bottomNavCategorySize,
      serviceChargePercent: restaurant.serviceChargePercent ?? 0,
      headerFooterBgColor: theme?.headerFooterBgColor ?? null,
      glassTintColor: theme?.glassTintColor ?? null,
    }
    
    return NextResponse.json(responseData, {
      headers: noCacheHeaders,
    })
  } catch (error: any) {
    // Only log errors in development to reduce noise
    if (process.env.NODE_ENV === 'development') {
    console.error('Error fetching UI settings:', error)
    }
    
    // Return defaults on error
    return NextResponse.json(DEFAULT_RESPONSE, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  }
}

