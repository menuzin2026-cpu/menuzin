export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { ensureRestaurantWelcomeBgMimeTypeColumn } from '@/lib/ensure-columns'

export async function GET(request: NextRequest) {
  try {
    // Ensure DB column exists in production before querying
    await ensureRestaurantWelcomeBgMimeTypeColumn(prisma)

    const session = await requireAdminSession()

    const restaurant = await prisma.restaurant.findUnique({
      where: { id: session.restaurantId },
    })
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Safely access fields that might not exist
    const restaurantData = restaurant as any
    
    // Safely access footerLogoMediaId - may not exist if migration hasn't run
    const footerLogoMediaId = restaurantData.footerLogoMediaId || null

    // Safely access R2 fields - may not exist if migration hasn't run
    const getR2Field = (fieldName: string) => {
      try {
        return restaurantData[fieldName] || null
      } catch {
        return null
      }
    }

    return NextResponse.json({
      id: restaurant.id,
      nameKu: restaurant.nameKu,
      nameEn: restaurant.nameEn,
      nameAr: restaurant.nameAr,
      slug: restaurant.slug,
      googleMapsUrl: restaurant.googleMapsUrl || '',
      phoneNumber: restaurant.phoneNumber || '',
      instagramUrl: (restaurant as any).instagramUrl || null,
      snapchatUrl: (restaurant as any).snapchatUrl || null,
      tiktokUrl: (restaurant as any).tiktokUrl || null,
      serviceChargePercent: (restaurant as any).serviceChargePercent || 0,
      welcomeOverlayColor: restaurant.welcomeOverlayColor,
      welcomeOverlayOpacity: restaurant.welcomeOverlayOpacity,
      welcomeTextEn: restaurant.welcomeTextEn || '',
      logoMediaId: restaurant.logoMediaId,
      footerLogoMediaId: footerLogoMediaId,
      welcomeBackgroundMediaId: restaurant.welcomeBackgroundMediaId,
      // R2 fields - safely accessed
      logoR2Key: getR2Field('logoR2Key'),
      logoR2Url: getR2Field('logoR2Url'),
      footerLogoR2Key: getR2Field('footerLogoR2Key'),
      footerLogoR2Url: getR2Field('footerLogoR2Url'),
      welcomeBgR2Key: getR2Field('welcomeBgR2Key'),
      welcomeBgR2Url: getR2Field('welcomeBgR2Url'),
      welcomeBgMimeType: getR2Field('welcomeBgMimeType'),
    })
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    })
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Ensure DB column exists in production before updating
    await ensureRestaurantWelcomeBgMimeTypeColumn(prisma)

    const session = await requireAdminSession()

    const body = await request.json()
    
    // Log the incoming data for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Settings update request body:', JSON.stringify(body, null, 2))
    }

    // Get restaurant by restaurantId from session
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: session.restaurantId },
    })
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    // Helper function to generate slug from restaurant name
    function generateSlug(name: string): string {
      return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    }

    // Prepare update data with proper fallbacks
    const updateData: any = {
      nameKu: body.nameKu !== undefined ? body.nameKu : restaurant.nameKu,
      nameEn: body.nameEn !== undefined ? body.nameEn : restaurant.nameEn,
      nameAr: body.nameAr !== undefined ? body.nameAr : restaurant.nameAr,
      googleMapsUrl: body.googleMapsUrl !== undefined ? (body.googleMapsUrl || null) : restaurant.googleMapsUrl,
      phoneNumber: body.phoneNumber !== undefined ? (body.phoneNumber || null) : restaurant.phoneNumber,
      instagramUrl: body.instagramUrl !== undefined ? (body.instagramUrl || null) : (restaurant as any).instagramUrl || null,
      snapchatUrl: body.snapchatUrl !== undefined ? (body.snapchatUrl || null) : (restaurant as any).snapchatUrl || null,
      tiktokUrl: body.tiktokUrl !== undefined ? (body.tiktokUrl || null) : (restaurant as any).tiktokUrl || null,
      serviceChargePercent: body.serviceChargePercent !== undefined ? (body.serviceChargePercent === null || body.serviceChargePercent === '' ? 0 : parseFloat(body.serviceChargePercent)) : ((restaurant as any).serviceChargePercent || 0),
      welcomeOverlayColor: body.welcomeOverlayColor !== undefined ? body.welcomeOverlayColor : restaurant.welcomeOverlayColor,
      welcomeOverlayOpacity: body.welcomeOverlayOpacity !== undefined ? parseFloat(body.welcomeOverlayOpacity) : restaurant.welcomeOverlayOpacity,
    }

    // Generate slug if nameEn changes
    if (body.nameEn !== undefined && body.nameEn !== restaurant.nameEn) {
      const newSlug = generateSlug(body.nameEn)
      // Check if slug already exists (excluding current restaurant)
      const existing = await prisma.restaurant.findUnique({
        where: { slug: newSlug },
      })
      
      if (existing && existing.id !== restaurant.id) {
        // If slug exists, append restaurant ID to make it unique
        updateData.slug = `${newSlug}-${restaurant.id.slice(-6)}`
      } else {
        updateData.slug = newSlug
      }
    }

    // Handle welcomeTextEn - save text as-is, convert empty strings to null
    if (body.welcomeTextEn !== undefined) {
      if (body.welcomeTextEn === null || body.welcomeTextEn === '') {
        updateData.welcomeTextEn = null
      } else {
        updateData.welcomeTextEn = String(body.welcomeTextEn).trim() || null
      }
    }

    // Only update media IDs if they're explicitly provided
    if (body.logoMediaId !== undefined) {
      updateData.logoMediaId = body.logoMediaId
    }
    // Only update footerLogoMediaId if column exists (migration applied)
    // Check if column exists by trying to access it safely
    if (body.footerLogoMediaId !== undefined) {
      const testValue = (restaurant as any).footerLogoMediaId
      // If we can access it (even if null), the column exists
      if (testValue !== undefined) {
        updateData.footerLogoMediaId = body.footerLogoMediaId
      } else {
        // Column doesn't exist yet, skip this field
        console.warn('footerLogoMediaId column not found, skipping update')
      }
    }
    if (body.welcomeBackgroundMediaId !== undefined) {
      updateData.welcomeBackgroundMediaId = body.welcomeBackgroundMediaId
    }

    // Handle R2 fields - allow null to clear them
    if (body.logoR2Key !== undefined) {
      updateData.logoR2Key = body.logoR2Key || null
    }
    if (body.logoR2Url !== undefined) {
      updateData.logoR2Url = body.logoR2Url || null
    }
    if (body.footerLogoR2Key !== undefined) {
      updateData.footerLogoR2Key = body.footerLogoR2Key || null
    }
    if (body.footerLogoR2Url !== undefined) {
      updateData.footerLogoR2Url = body.footerLogoR2Url || null
    }
    if (body.welcomeBgR2Key !== undefined) {
      updateData.welcomeBgR2Key = body.welcomeBgR2Key || null
    }
    if (body.welcomeBgR2Url !== undefined) {
      updateData.welcomeBgR2Url = body.welcomeBgR2Url || null
    }
    if (body.welcomeBgMimeType !== undefined) {
      updateData.welcomeBgMimeType = body.welcomeBgMimeType || null
    }

    // Log the update data for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Update data:', JSON.stringify(updateData, null, 2))
    }

    const updated = await prisma.restaurant.update({
      where: { id: session.restaurantId },
      data: updateData,
    })

    // Safely access footerLogoMediaId - may not exist if migration hasn't run
    const updatedFooterLogoMediaId = (updated as any).footerLogoMediaId || null

    // Update the fallback settings in database
    try {
      const defaultBrandColors = {
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

      await prisma.fallbackSettings.upsert({
        where: { id: 'fallback-1' },
        update: {
          nameKu: updated.nameKu,
          nameEn: updated.nameEn,
          nameAr: updated.nameAr,
          logoMediaId: updated.logoMediaId,
          footerLogoMediaId: updatedFooterLogoMediaId,
          welcomeBackgroundMediaId: updated.welcomeBackgroundMediaId,
          welcomeOverlayColor: updated.welcomeOverlayColor,
          welcomeOverlayOpacity: updated.welcomeOverlayOpacity,
          welcomeTextEn: updated.welcomeTextEn,
          googleMapsUrl: updated.googleMapsUrl,
          phoneNumber: updated.phoneNumber,
          brandColors: updated.brandColors || defaultBrandColors,
        },
        create: {
          id: 'fallback-1',
          nameKu: updated.nameKu,
          nameEn: updated.nameEn,
          nameAr: updated.nameAr,
          logoMediaId: updated.logoMediaId,
          footerLogoMediaId: updatedFooterLogoMediaId,
          welcomeBackgroundMediaId: updated.welcomeBackgroundMediaId,
          welcomeOverlayColor: updated.welcomeOverlayColor,
          welcomeOverlayOpacity: updated.welcomeOverlayOpacity,
          welcomeTextEn: updated.welcomeTextEn,
          googleMapsUrl: updated.googleMapsUrl,
          phoneNumber: updated.phoneNumber,
          brandColors: updated.brandColors || defaultBrandColors,
        },
      })
      console.log('✅ Updated fallback settings in database')
    } catch (error) {
      console.error('⚠️ Error updating fallback settings (non-critical):', error)
      // Don't fail the request if fallback update fails
    }

    return NextResponse.json({
      id: updated.id,
      nameKu: updated.nameKu,
      nameEn: updated.nameEn,
      nameAr: updated.nameAr,
      slug: updated.slug,
      googleMapsUrl: updated.googleMapsUrl || '',
      phoneNumber: updated.phoneNumber || '',
      instagramUrl: (updated as any).instagramUrl || null,
      snapchatUrl: (updated as any).snapchatUrl || null,
      tiktokUrl: (updated as any).tiktokUrl || null,
      serviceChargePercent: (updated as any).serviceChargePercent || 0,
      welcomeOverlayColor: updated.welcomeOverlayColor,
      welcomeOverlayOpacity: updated.welcomeOverlayOpacity,
      welcomeTextEn: updated.welcomeTextEn || '',
      logoMediaId: updated.logoMediaId,
      footerLogoMediaId: updatedFooterLogoMediaId,
      welcomeBackgroundMediaId: updated.welcomeBackgroundMediaId,
      // R2 fields
      logoR2Key: (updated as any).logoR2Key || null,
      logoR2Url: (updated as any).logoR2Url || null,
      footerLogoR2Key: (updated as any).footerLogoR2Key || null,
      footerLogoR2Url: (updated as any).footerLogoR2Url || null,
      welcomeBgR2Key: (updated as any).welcomeBgR2Key || null,
      welcomeBgR2Url: (updated as any).welcomeBgR2Url || null,
      welcomeBgMimeType: (updated as any).welcomeBgMimeType || null,
    })
  } catch (error: any) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}

