export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { z } from 'zod'

const themeSchema = z.object({
  appBg: z.string(),
})

export async function GET() {
  try {
    const session = await requireAdminSession()

    let theme = await prisma.theme.findUnique({
      where: { restaurantId: session.restaurantId },
    })

    // If theme doesn't exist, create it with neutral defaults
    if (!theme) {
      theme = await prisma.theme.create({
        data: {
          restaurantId: session.restaurantId,
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdminSession()

    const body = await request.json()
    const validation = themeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const themeData = validation.data

    // Upsert theme for THIS restaurant only (restaurantId from session)
    const theme = await prisma.theme.upsert({
      where: { restaurantId: session.restaurantId }, // Ensures we only update the admin's restaurant theme
      update: themeData, // Update existing theme for this restaurant
      create: {
        restaurantId: session.restaurantId, // Create new theme for this restaurant
        ...themeData,
      },
    })

    console.log('Theme updated successfully for restaurant:', session.restaurantId)

    return NextResponse.json(
      { theme, success: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Error saving theme:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

