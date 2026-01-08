import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSuperAdminSession, hashPin } from '@/lib/auth'
import { z } from 'zod'

const createAdminSchema = z.object({
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

    const admins = await prisma.adminUser.findMany({
      select: {
        id: true,
        lastLoginAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Error fetching admins:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    const { pin } = validation.data
    const pinHash = await hashPin(pin)

    const admin = await prisma.adminUser.create({
      data: {
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
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    // Check if there's at least one admin remaining after deletion
    const adminCount = await prisma.adminUser.count()
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin account' },
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

