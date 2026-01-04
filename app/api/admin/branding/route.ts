import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const isAuthenticated = await getAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json({ brandColors: restaurant.brandColors })
  } catch (error) {
    console.error('Error fetching branding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await getAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const restaurant = await prisma.restaurant.findFirst()
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: { brandColors: body.brandColors },
    })

    // Update the fallback JSON file with the new brand colors
    try {
      const filePath = join(process.cwd(), 'data', 'fallback-restaurant.json')
      
      // Read existing fallback data
      let fallbackData: any = {}
      try {
        const fileContent = await readFile(filePath, 'utf-8')
        fallbackData = JSON.parse(fileContent)
      } catch (error) {
        // If file doesn't exist, create default structure
        fallbackData = {
          id: 'fallback',
          nameKu: restaurant.nameKu || 'رێستۆرانتی',
          nameEn: restaurant.nameEn || 'Restaurant',
          nameAr: restaurant.nameAr || 'مطعم',
          logoMediaId: restaurant.logoMediaId,
          footerLogoMediaId: (restaurant as any).footerLogoMediaId || null,
          welcomeBackgroundMediaId: restaurant.welcomeBackgroundMediaId,
          welcomeOverlayColor: restaurant.welcomeOverlayColor || '#000000',
          welcomeOverlayOpacity: restaurant.welcomeOverlayOpacity || 0.5,
          welcomeTextEn: restaurant.welcomeTextEn,
          googleMapsUrl: restaurant.googleMapsUrl,
          phoneNumber: restaurant.phoneNumber,
        }
      }

      // Update brand colors
      fallbackData.brandColors = updated.brandColors || {
        menuGradientStart: '#5C0015',
        menuGradientEnd: '#800020',
        headerText: '#FFFFFF',
        headerIcons: '#FFFFFF',
        activeTab: '#FFFFFF',
        inactiveTab: '#CCCCCC',
        categoryCardBg: '#4A5568',
        itemCardBg: '#4A5568',
        itemNameText: '#FFFFFF',
        itemDescText: '#E2E8F0',
        priceText: '#FBBF24',
        dividerLine: '#718096',
        modalBg: '#2D3748',
        modalOverlay: 'rgba(0,0,0,0.7)',
        buttonBg: '#800020',
        buttonText: '#FFFFFF',
        feedbackCardBg: '#4A5568',
        feedbackCardText: '#FFFFFF',
        welcomeOverlayColor: '#000000',
        welcomeOverlayOpacity: 0.5,
      }

      await writeFile(filePath, JSON.stringify(fallbackData, null, 2), 'utf-8')
      console.log('✅ Updated fallback JSON file with brand colors')
    } catch (error) {
      console.error('⚠️ Error updating fallback JSON file (non-critical):', error)
      // Don't fail the request if JSON update fails
    }

    return NextResponse.json({ brandColors: updated.brandColors })
  } catch (error) {
    console.error('Error updating branding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




