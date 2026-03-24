export const dynamic = "force-dynamic"
export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('[PLATFORM SETTINGS GET] Reading from table: platform_settings, where id="platform-1"')
    
    // Read from platform_settings table where id='platform-1'
    // Prisma maps: footerLogoR2Key (camelCase) -> footer_logo_r2_key (snake_case)
    const settings = await prisma.platformSettings.findUnique({
      where: { id: 'platform-1' },
      select: {
        footerLogoR2Key: true,
        footerLogoR2Url: true,
      },
    })

    console.log('[PLATFORM SETTINGS GET] Query result:', settings ? 'Found' : 'Not found')

    // If settings don't exist, return null (don't auto-create in public API)
    if (!settings) {
      return NextResponse.json(
        {
          footerLogoR2Key: null,
          footerLogoR2Url: null,
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
        footerLogoR2Key: settings.footerLogoR2Key,
        footerLogoR2Url: settings.footerLogoR2Url,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  } catch (error: any) {
    // Log full error details for debugging
    console.error('[PLATFORM SETTINGS GET] Error fetching platform settings:')
    console.error('Error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    console.error('Error message:', error?.message)
    console.error('Error code:', error?.code)
    console.error('Error meta (Prisma):', JSON.stringify(error?.meta, null, 2))
    
    // Return empty settings instead of error to prevent UI breakage
    return NextResponse.json(
      {
        footerLogoR2Key: null,
        footerLogoR2Url: null,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )
  }
}



export const runtime = 'edge';
