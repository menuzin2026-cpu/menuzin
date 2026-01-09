export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSuperAdminSession, hashPin } from '@/lib/auth'
import { z } from 'zod'

const createAdminSchema = z.object({
  restaurantId: z.string().min(1),
  pin: z.string().length(4).regex(/^\d+$/, 'PIN must be 4 digits'),
})

const updateAdminSchema = z.object({
  adminId: z.string(),
  newPin: z.string().length(4).regex(/^\d+$/, 'PIN must be 4 digits'),
})

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get('restaurantId')

    if (!restaurantId) {
      return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 })
    }

    const admins = await prisma.adminUser.findMany({
      where: {
        restaurantId,
        isActive: true,
      },
      select: {
        id: true,
        restaurantId: true,
        restaurant: {
          select: {
            id: true,
            slug: true,
            nameEn: true,
            nameKu: true,
            nameAr: true,
          },
        },
        displayName: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ admins })
  } catch (error: any) {
    console.error('Error fetching admins:', error)
    const errorMessage = error?.message || 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = createAdminSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { restaurantId, pin } = validation.data

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const pinHash = await hashPin(pin)

    const admin = await prisma.adminUser.create({
      data: {
        restaurantId,
        pinHash,
      },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        createdAt: admin.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Error creating admin:', error)
    // Handle Prisma unique constraint errors
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Admin with this PIN already exists' }, { status: 400 })
    }
    const errorMessage = error?.message || 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updateAdminSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { adminId, newPin } = validation.data
    const pinHash = await hashPin(newPin)

    const admin = await prisma.adminUser.update({
      where: { id: adminId },
      data: {
        pinHash,
      },
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
      },
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    console.error('Error updating admin PIN:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { adminId } = body

    if (!adminId || typeof adminId !== 'string') {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 })
    }

    // Get the admin to check restaurant
    const admin = await prisma.adminUser.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Check if there's at least one admin remaining for this restaurant after deletion
    const adminCount = await prisma.adminUser.count({
      where: {
        restaurantId: admin.restaurantId,
        isActive: true,
      },
    })

    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin account for this restaurant' },
        { status: 400 }
      )
    }

    await prisma.adminUser.delete({
      where: { id: adminId },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin account deleted successfully',
    })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    console.error('Error deleting admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

