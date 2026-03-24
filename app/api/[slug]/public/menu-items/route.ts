import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Enable caching for public endpoint (shorter cache for items)
export const revalidate = 30 // Revalidate every 30 seconds
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  try {
    const { slug } = params
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const sectionId = searchParams.get('sectionId')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Resolve restaurant by slug
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        {
          status: 404,
          headers: {
            'Cache-Control': 'no-store, no-cache',
          },
        }
      )
    }

    // Build where clause based on filters
    const whereClause: any = {
      restaurantId: restaurant.id,
      isActive: true,
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    } else if (sectionId) {
      // Get all category IDs for this section
      const section = await prisma.section.findUnique({
        where: { id: sectionId },
        select: {
          categories: {
            where: {
              restaurantId: restaurant.id,
              isActive: true,
            },
            select: { id: true },
          },
        },
      })
      if (section?.categories?.length) {
        whereClause.categoryId = {
          in: section.categories.map((c) => c.id),
        }
      } else {
        // No categories in section, return empty
        return NextResponse.json(
          { items: [] },
          {
            headers: {
              'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
            },
          }
        )
      }
    }

    // Fetch items for the category/section
    const items = await prisma.item.findMany({
      where: whereClause,
      select: {
        id: true,
        nameKu: true,
        nameEn: true,
        nameAr: true,
        descriptionKu: true,
        descriptionEn: true,
        descriptionAr: true,
        price: true,
        imageR2Url: true,
        imageMediaId: true,
        sortOrder: true,
        isActive: true,
        categoryId: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json(
      { items: items || [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { items: [] },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache',
        },
      }
    )
  }
}
