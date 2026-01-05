import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Default values (same as admin endpoint)
const DEFAULT_SETTINGS = {
  sectionTitleSize: 22,
  categoryTitleSize: 16,
  itemNameSize: 14,
  itemDescriptionSize: 14,
  itemPriceSize: 16,
  headerLogoSize: 32,
  bottomNavSectionSize: 13,
  bottomNavCategorySize: 13,
}

export async function GET() {
  try {
    // Public endpoint - no auth required
    // Check if uiSettings model exists in Prisma client
    if (!prisma.uiSettings) {
      console.error('UiSettings model not found in Prisma client. Returning defaults.')
      return NextResponse.json(DEFAULT_SETTINGS)
    }

    // Check if bottomNav columns exist, and add them if missing
    try {
      const columnCheck = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'UiSettings' 
        AND column_name IN ('bottomNavSectionSize', 'bottomNavCategorySize')
      `
      
      const existingColumns = columnCheck.map(row => row.column_name)
      
      // Add missing columns if they don't exist
      if (!existingColumns.includes('bottomNavCategorySize')) {
        await prisma.$executeRaw`
          ALTER TABLE "UiSettings" 
          ADD COLUMN "bottomNavCategorySize" INTEGER NOT NULL DEFAULT 13
        `
        console.log('Added missing column: bottomNavCategorySize')
      }
      
      if (!existingColumns.includes('bottomNavSectionSize')) {
        await prisma.$executeRaw`
          ALTER TABLE "UiSettings" 
          ADD COLUMN "bottomNavSectionSize" INTEGER NOT NULL DEFAULT 13
        `
        console.log('Added missing column: bottomNavSectionSize')
      }
    } catch (columnError: any) {
      // If column check fails, log but continue (columns might already exist)
      console.warn('Column check/creation failed, continuing with query:', columnError?.message)
    }

    let settings
    try {
      settings = await prisma.uiSettings.findUnique({
        where: { id: 'ui-settings-1' },
      })
      console.log('[DEBUG] GET /api/ui-settings - Raw database record:', JSON.stringify(settings, null, 2))
    } catch (findError: any) {
      // If findUnique fails due to missing columns, try raw SQL
      if (findError?.code === 'P2022' || findError?.message?.includes('does not exist')) {
        console.warn('Prisma query failed, using raw SQL fallback')
        const rawResult = await prisma.$queryRaw<Array<any>>`
          SELECT * FROM "UiSettings" WHERE id = 'ui-settings-1'
        `
        settings = rawResult[0] || null
      } else {
        throw findError
      }
    }
    
    const noCacheHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Content-Type-Options': 'nosniff',
    }

    if (!settings) {
      // Try to get from FallbackSettings
      try {
        const fallbackSettings = await prisma.fallbackSettings.findUnique({
          where: { id: 'fallback-1' },
        })
        
        if (fallbackSettings) {
          const responseData = {
            sectionTitleSize: fallbackSettings.sectionTitleSize ?? DEFAULT_SETTINGS.sectionTitleSize,
            categoryTitleSize: fallbackSettings.categoryTitleSize ?? DEFAULT_SETTINGS.categoryTitleSize,
            itemNameSize: fallbackSettings.itemNameSize ?? DEFAULT_SETTINGS.itemNameSize,
            itemDescriptionSize: fallbackSettings.itemDescriptionSize ?? DEFAULT_SETTINGS.itemDescriptionSize,
            itemPriceSize: fallbackSettings.itemPriceSize ?? DEFAULT_SETTINGS.itemPriceSize,
            headerLogoSize: fallbackSettings.headerLogoSize ?? DEFAULT_SETTINGS.headerLogoSize,
            bottomNavSectionSize: fallbackSettings.bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
            bottomNavCategorySize: fallbackSettings.bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
          }
          return NextResponse.json(responseData, {
            headers: noCacheHeaders,
          })
        }
      } catch (fallbackError) {
        console.warn('Could not read from FallbackSettings:', fallbackError)
      }
      
      // Return defaults if no settings exist
      return NextResponse.json(DEFAULT_SETTINGS, {
        headers: noCacheHeaders,
      })
    }

    const responseData = {
      sectionTitleSize: settings.sectionTitleSize,
      categoryTitleSize: settings.categoryTitleSize,
      itemNameSize: settings.itemNameSize,
      itemDescriptionSize: settings.itemDescriptionSize,
      itemPriceSize: settings.itemPriceSize,
      headerLogoSize: settings.headerLogoSize,
      bottomNavSectionSize: (settings as any).bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
      bottomNavCategorySize: (settings as any).bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
    }
    
    console.log('[DEBUG] GET /api/ui-settings - Response data:', JSON.stringify(responseData, null, 2))
    
    return NextResponse.json(responseData, {
      headers: noCacheHeaders,
    })
  } catch (error: any) {
    console.error('Error fetching UI settings:', error)
    
    // Handle connection pool exhaustion - try FallbackSettings first
    if (error?.message?.includes('MaxClientsInSessionMode') || 
        error?.message?.includes('max clients reached') ||
        error?.code === 'P1001' ||
        error?.name === 'PrismaClientInitializationError') {
      console.warn('Database connection pool exhausted, trying FallbackSettings. Consider using connection pooler (Supabase port 6543).')
      
      // Try to get from FallbackSettings
      try {
        const fallbackSettings = await prisma.fallbackSettings.findUnique({
          where: { id: 'fallback-1' },
        })
        
        if (fallbackSettings) {
          const responseData = {
            sectionTitleSize: fallbackSettings.sectionTitleSize ?? DEFAULT_SETTINGS.sectionTitleSize,
            categoryTitleSize: fallbackSettings.categoryTitleSize ?? DEFAULT_SETTINGS.categoryTitleSize,
            itemNameSize: fallbackSettings.itemNameSize ?? DEFAULT_SETTINGS.itemNameSize,
            itemDescriptionSize: fallbackSettings.itemDescriptionSize ?? DEFAULT_SETTINGS.itemDescriptionSize,
            itemPriceSize: fallbackSettings.itemPriceSize ?? DEFAULT_SETTINGS.itemPriceSize,
            headerLogoSize: fallbackSettings.headerLogoSize ?? DEFAULT_SETTINGS.headerLogoSize,
            bottomNavSectionSize: fallbackSettings.bottomNavSectionSize ?? DEFAULT_SETTINGS.bottomNavSectionSize,
            bottomNavCategorySize: fallbackSettings.bottomNavCategorySize ?? DEFAULT_SETTINGS.bottomNavCategorySize,
          }
          return NextResponse.json(responseData, {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Content-Type-Options': 'nosniff',
              'X-Fallback': 'true',
            },
          })
        }
      } catch (fallbackError) {
        console.warn('Could not read from FallbackSettings:', fallbackError)
      }
      
      return NextResponse.json(DEFAULT_SETTINGS, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
          'X-Fallback': 'true',
        },
      })
    }
    
    // If error is due to missing columns, return defaults
    if (error?.message?.includes('bottomNavSectionSize') || error?.message?.includes('bottomNavCategorySize') || error?.code === 'P2021' || error?.code === 'P2022') {
      console.warn('UiSettings columns missing, returning defaults. Run migration to add columns.')
    }
    
    // Return defaults on any other error
    return NextResponse.json(DEFAULT_SETTINGS, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }
}

