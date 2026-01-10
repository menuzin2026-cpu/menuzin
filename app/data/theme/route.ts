import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Get slug from query parameter or referer header
    const { searchParams } = new URL(request.url)
    let slug = searchParams.get('slug')
    
    // If no slug in query, try to extract from referer
    if (!slug) {
      const referer = request.headers.get('referer')
      if (referer) {
        const refererUrl = new URL(referer)
        const pathParts = refererUrl.pathname.split('/').filter(Boolean)
        if (pathParts.length > 0 && pathParts[0] !== 'super-admin' && pathParts[0] !== 'admin') {
          slug = pathParts[0]
        }
      }
    }

    // If still no slug, return default theme
    if (!slug) {
      return NextResponse.json(
        {
          theme: {
            appBg: '#400810', // Default background
            menuBackgroundR2Key: null,
            menuBackgroundR2Url: null,
            itemNameTextColor: null,
            itemPriceTextColor: null,
            itemDescriptionTextColor: null,
            bottomNavSectionNameColor: null,
            categoryNameColor: null,
            headerFooterBgColor: null,
            glassTintColor: null,
          },
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
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
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    }

    // Get theme for this restaurant
    let theme = await prisma.theme.findUnique({
      where: { restaurantId: restaurant.id },
    })

    // If theme doesn't exist, create it with neutral defaults
    if (!theme) {
      theme = await prisma.theme.create({
        data: {
          restaurantId: restaurant.id,
          appBg: '#400810', // Default background
        },
      })
    }

    // Safely access new fields that may not exist yet
    const themeResponse = theme as any

    return NextResponse.json(
      { theme: {
        id: theme.id,
        appBg: theme.appBg,
        menuBackgroundR2Key: themeResponse.menuBackgroundR2Key || null,
        menuBackgroundR2Url: themeResponse.menuBackgroundR2Url || null,
        itemNameTextColor: themeResponse.itemNameTextColor || null,
        itemPriceTextColor: themeResponse.itemPriceTextColor || null,
        itemDescriptionTextColor: themeResponse.itemDescriptionTextColor || null,
        bottomNavSectionNameColor: themeResponse.bottomNavSectionNameColor || null,
        categoryNameColor: themeResponse.categoryNameColor || null,
        headerFooterBgColor: themeResponse.headerFooterBgColor || null,
        glassTintColor: themeResponse.glassTintColor || null,
        restaurantId: theme.restaurantId,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      } },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching theme:', error)
    // Return a default theme if there's an error
    return NextResponse.json(
      {
        theme: {
          appBg: '#400810', // Default background
          menuBackgroundR2Key: null,
          menuBackgroundR2Url: null,
          itemNameTextColor: null,
          itemPriceTextColor: null,
          itemDescriptionTextColor: null,
          bottomNavSectionNameColor: null,
          categoryNameColor: null,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}


