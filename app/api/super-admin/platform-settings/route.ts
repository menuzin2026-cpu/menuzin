export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSuperAdminSession } from '@/lib/auth'
import { z } from 'zod'

const updatePlatformSettingsSchema = z.object({
  footerLogoR2Key: z.string().optional().nullable(),
  footerLogoR2Url: z.string().optional().nullable(),
})

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform-1' },
    })

    // Create default if doesn't exist
    if (!settings) {
      try {
        settings = await prisma.platformSettings.create({
          data: {
            id: 'platform-1',
          },
        })
      } catch (createError: any) {
        // If create fails (e.g., table doesn't exist), return empty settings
        console.error('Error creating platform settings:', createError)
        return NextResponse.json({
          id: 'platform-1',
          footerLogoR2Key: null,
          footerLogoR2Url: null,
        })
      }
    }

    return NextResponse.json({
      id: settings.id,
      footerLogoR2Key: settings.footerLogoR2Key,
      footerLogoR2Url: settings.footerLogoR2Url,
    })
  } catch (error: any) {
    console.error('Error fetching platform settings:', error)
    // Return empty settings instead of error to prevent UI breakage
    return NextResponse.json({
      id: 'platform-1',
      footerLogoR2Key: null,
      footerLogoR2Url: null,
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await getSuperAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = updatePlatformSettingsSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Ensure platform settings exist
    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform-1' },
    })

    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          id: 'platform-1',
        },
      })
    }

    // Update settings
    const updated = await prisma.platformSettings.update({
      where: { id: 'platform-1' },
      data: {
        footerLogoR2Key: validation.data.footerLogoR2Key ?? settings.footerLogoR2Key,
        footerLogoR2Url: validation.data.footerLogoR2Url ?? settings.footerLogoR2Url,
      },
    })

    return NextResponse.json({
      success: true,
      settings: {
        id: updated.id,
        footerLogoR2Key: updated.footerLogoR2Key,
        footerLogoR2Url: updated.footerLogoR2Url,
      },
    })
  } catch (error: any) {
    console.error('Error updating platform settings:', error)
    console.error('Full error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    if (error?.code === 'P2021') {
      return NextResponse.json({ 
        error: 'Database table or column does not exist. Please run database migrations.',
        details: error?.meta 
      }, { status: 500 })
    }
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error occurred'
    }, { status: 500 })
  }
}

