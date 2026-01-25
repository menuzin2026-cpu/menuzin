import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, SessionExpiredError, deleteAdminSession } from '@/lib/auth'
import { unstable_cache } from 'next/cache'

export async function GET() {
  const startTime = Date.now()
  try {
    const session = await requireAdminSession()

    // Cache menu data for 30 seconds (admin data changes infrequently)
    const sections = await unstable_cache(
      async () => {
        return await prisma.section.findMany({
          where: {
            restaurantId: session.restaurantId,
          },
          include: {
            categories: {
              where: {
                restaurantId: session.restaurantId,
              },
              include: {
                items: {
                  where: {
                    restaurantId: session.restaurantId,
                  },
                  orderBy: {
                    sortOrder: 'asc',
                  },
                },
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
      },
      [`admin-menu-${session.restaurantId}`],
      { revalidate: 30 } // 30 seconds cache
    )()

    // Ensure we always return a valid structure
    const normalizedSections = (sections || []).map((section) => ({
      ...section,
      categories: (section.categories || []).map((category) => ({
        ...category,
        items: category.items || [],
      })),
    }))

    const fetchTime = Date.now() - startTime
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PERF] Menu fetch: ${fetchTime}ms (${normalizedSections.length} sections, ${normalizedSections.reduce((sum, s) => sum + s.categories.length, 0)} categories)`)
    }

    return NextResponse.json(
      { sections: normalizedSections },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60',
        },
      }
    )
  } catch (error) {
    // Handle session expiry
    if (error instanceof SessionExpiredError) {
      await deleteAdminSession()
      return NextResponse.json(
        { ok: false, error: 'SESSION_EXPIRED' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching admin menu:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log detailed error for debugging
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error instanceof Error ? error.name : 'Unknown',
    })
    
    // Return empty sections instead of 500 to prevent crashes
    return NextResponse.json(
      { 
        sections: [],
        error: 'Failed to load menu data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
      { status: 200 } // Return 200 with empty data instead of 500
    )
  }
}




