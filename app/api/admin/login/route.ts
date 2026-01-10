export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPin, createAdminSession, checkRateLimit } from '@/lib/auth'
import { requireRestaurantBySlug } from '@/lib/restaurant-utils'
import { z } from 'zod'

const loginSchema = z.object({
  pin: z.string().length(4).regex(/^\d+$/, 'PIN must be 4 digits'),
  slug: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { pin, slug } = validation.data

    // Verify restaurant exists
    const restaurant = await requireRestaurantBySlug(slug)

    // Get admin users for this restaurant only
    const admins = await prisma.adminUser.findMany({
      where: {
        restaurantId: restaurant.id,
        isActive: true,
      },
    })

    if (admins.length === 0) {
      return NextResponse.json({ error: 'No admin accounts found for this restaurant' }, { status: 404 })
    }

    // Try to find an admin with matching PIN
    let matchedAdmin = null
    for (const admin of admins) {
      const isValid = await verifyPin(pin, admin.pinHash)
      if (isValid) {
        matchedAdmin = admin
        break
      }
    }

    if (!matchedAdmin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    // Update last login
    await prisma.adminUser.update({
      where: { id: matchedAdmin.id },
      data: { lastLoginAt: new Date() },
    })

    // Create session with restaurant_id and admin_user_id
    await createAdminSession(restaurant.id, matchedAdmin.id)

    return NextResponse.json({ success: true, adminId: matchedAdmin.id, restaurantId: restaurant.id })
  } catch (error) {
    console.error('[ERROR] Admin login error:', error)
    console.error('[ERROR] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
    if (error instanceof Error && error.message === 'Restaurant not found') {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 })
  }
}




