export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
        console.error('Error creating platform settings:', createError)
        console.error('Full error details:', {
          message: createError?.message,
          code: createError?.code,
          meta: createError?.meta,
          stack: createError?.stack,
        })
        // Return empty settings instead of error
        return NextResponse.json({ footerLogoR2Url: null })
      }
    }

    return NextResponse.json({
      footerLogoR2Url: settings.footerLogoR2Url,
    })
  } catch (error: any) {
    console.error('Error fetching platform settings:', error)
    console.error('Full error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    // Return empty settings instead of error to prevent UI breakage
    return NextResponse.json({ footerLogoR2Url: null })
  }
}

