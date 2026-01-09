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
      settings = await prisma.platformSettings.create({
        data: {
          id: 'platform-1',
        },
      })
    }

    return NextResponse.json({
      footerLogoR2Url: settings.footerLogoR2Url,
    })
  } catch (error) {
    console.error('Error fetching platform settings:', error)
    return NextResponse.json({ footerLogoR2Url: null })
  }
}

