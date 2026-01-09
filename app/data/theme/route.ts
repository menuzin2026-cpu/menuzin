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
            appBg: '#FFFFFF', // Neutral white default
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

    if (!restaurant) {
      return NextResponse.json(
        {
          theme: {
            appBg: '#FFFFFF', // Neutral white default
          },
        },
        {
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
          appBg: '#FFFFFF', // Neutral white background for new restaurants
        },
      })
    }

    return NextResponse.json(
      { theme },
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
          appBg: '#FFFFFF', // Neutral white default
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


