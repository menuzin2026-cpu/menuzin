import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Enable caching for public endpoint
export const revalidate = 60 // Revalidate every 60 seconds
export const dynamic = 'force-dynamic' // But allow dynamic rendering

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Parallel queries for faster response
    const [restaurant, theme, sectionsWithCategories, uiSettings] = await Promise.all([
      // Get restaurant basic info
      prisma.restaurant.findUnique({
        where: { slug },
        select: {
          id: true,
          nameKu: true,
          nameEn: true,
          nameAr: true,
          logoR2Url: true,
          logoMediaId: true,
          serviceChargePercent: true,
        },
      }),
      // Get theme (for menu background and colors)
      prisma.restaurant.findUnique({
        where: { slug },
        select: { id: true },
      }).then((r) => {
        if (!r) return null
        return prisma.theme.findUnique({
          where: { restaurantId: r.id },
          select: {
            menuBackgroundR2Url: true,
            headerFooterBgColor: true,
            glassTintColor: true,
            itemNameTextColor: true,
            itemPriceTextColor: true,
            itemDescriptionTextColor: true,
            bottomNavSectionNameColor: true,
            categoryNameColor: true,
          },
        })
      }),
      // Get sections with categories (without items for faster load)
      prisma.restaurant.findUnique({
        where: { slug },
        select: { id: true },
      }).then((r) => {
        if (!r) return []
        return prisma.section.findMany({
          where: {
            restaurantId: r.id,
            isActive: true,
          },
          select: {
            id: true,
            nameKu: true,
            nameEn: true,
            nameAr: true,
            sortOrder: true,
            isActive: true,
            categories: {
              where: {
                restaurantId: r.id,
                isActive: true,
              },
              select: {
                id: true,
                nameKu: true,
                nameEn: true,
                nameAr: true,
                sortOrder: true,
                isActive: true,
                imageR2Url: true,
                imageMediaId: true,
              },
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        })
      }),
      // Get UI settings for currency
      prisma.restaurant.findUnique({
        where: { slug },
        select: { id: true },
      }).then((r) => {
        if (!r) return null
        return prisma.uiSettings.findUnique({
          where: { restaurantId: r.id },
          select: {
            currency: true,
          },
        })
      }),
    ])

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

    // Return bootstrap data (basic info + structure, no items)
    return NextResponse.json(
      {
        restaurant: {
          id: restaurant.id,
          nameKu: restaurant.nameKu,
          nameEn: restaurant.nameEn,
          nameAr: restaurant.nameAr,
          logoR2Url: restaurant.logoR2Url,
          logoMediaId: restaurant.logoMediaId,
          serviceChargePercent: restaurant.serviceChargePercent ?? 0,
        },
        theme: theme ? {
          menuBackgroundR2Url: theme.menuBackgroundR2Url,
          headerFooterBgColor: theme.headerFooterBgColor,
          glassTintColor: theme.glassTintColor,
          itemNameTextColor: theme.itemNameTextColor,
          itemPriceTextColor: theme.itemPriceTextColor,
          itemDescriptionTextColor: theme.itemDescriptionTextColor,
          bottomNavSectionNameColor: theme.bottomNavSectionNameColor,
          categoryNameColor: theme.categoryNameColor,
        } : null,
        sections: sectionsWithCategories || [],
        currency: (uiSettings as any)?.currency ?? 'IQD',
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching menu bootstrap:', error)
    // Return minimal defaults on error
    return NextResponse.json(
      {
        restaurant: null,
        theme: null,
        sections: [],
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache',
        },
      }
    )
  }
}
