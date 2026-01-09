export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform-1' },
      select: {
        footerLogoKey: true,
        footerLogoUrl: true,
      },
    })

    // If settings don't exist, return null (don't auto-create in public API)
    if (!settings) {
      return NextResponse.json(
        {
          footerLogoKey: null,
          footerLogoUrl: null,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      )
    }

    return NextResponse.json(
      {
        footerLogoKey: settings.footerLogoKey,
        footerLogoUrl: settings.footerLogoUrl,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error: any) {
    console.error('Error fetching platform settings:', error)
    console.error('Full error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
    })
    // Return empty settings instead of error to prevent UI breakage
    return NextResponse.json(
      {
        footerLogoKey: null,
        footerLogoUrl: null,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}

