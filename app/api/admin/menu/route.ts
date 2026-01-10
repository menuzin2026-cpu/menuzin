export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, SessionExpiredError, deleteAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await requireAdminSession()

    const sections = await prisma.section.findMany({
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

    // Ensure we always return a valid structure
    const normalizedSections = (sections || []).map((section) => ({
      ...section,
      categories: (section.categories || []).map((category) => ({
        ...category,
        items: category.items || [],
      })),
    }))

    return NextResponse.json({ sections: normalizedSections })
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




