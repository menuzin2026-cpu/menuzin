import { prisma } from '@/lib/prisma'

export interface RestaurantData {
  id: string
  nameKu: string
  nameEn: string
  nameAr: string
  logoMediaId: string | null
  logo: {
    id: string
    mimeType: string
    size: number
  } | null
  footerLogoMediaId: string | null
  footerLogo: {
    id: string
    mimeType: string
    size: number
  } | null
  welcomeBackgroundMediaId: string | null
  welcomeBackground: {
    id: string
    mimeType: string
    size: number
  } | null
  // R2 fields
  logoR2Key?: string | null
  logoR2Url?: string | null
  footerLogoR2Key?: string | null
  footerLogoR2Url?: string | null
  welcomeBgR2Key?: string | null
  welcomeBgR2Url?: string | null
  welcomeOverlayColor: string
  welcomeOverlayOpacity: number
  welcomeTextEn: string | null
  googleMapsUrl: string | null
  phoneNumber: string | null
  brandColors: any
  updatedAt: Date
}

export async function getRestaurantData(slug: string): Promise<RestaurantData | null> {
  try {
    let restaurant: any = null
    
    try {
      restaurant = await prisma.restaurant.findUnique({
        where: { slug },
        include: {
          logo: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
          footerLogo: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
          welcomeBackground: {
            select: {
              id: true,
              mimeType: true,
              size: true,
            },
          },
        },
      })
    } catch (error: any) {
      // If footerLogo relation fails, retry without it
      if (error?.message?.includes('footerLogo') || error?.code === 'P2021') {
        restaurant = await prisma.restaurant.findUnique({
          where: { slug },
          include: {
            logo: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
            welcomeBackground: {
              select: {
                id: true,
                mimeType: true,
                size: true,
              },
            },
          },
        })
      } else {
        throw error
      }
    }

    if (!restaurant) {
      return null
    }

    const restaurantData = restaurant as any
    const footerLogoMediaId = restaurantData.footerLogoMediaId || null
    const footerLogo = restaurantData.footerLogo || null

    // Safely access R2 fields - may not exist if migration hasn't run
    const getR2Field = (fieldName: string) => {
      try {
        return restaurantData[fieldName] || null
      } catch {
        return null
      }
    }

    return {
      id: restaurant.id,
      nameKu: restaurant.nameKu,
      nameEn: restaurant.nameEn,
      nameAr: restaurant.nameAr,
      logoMediaId: restaurant.logoMediaId,
      logo: restaurant.logo,
      footerLogoMediaId: footerLogoMediaId,
      footerLogo: footerLogo,
      welcomeBackgroundMediaId: restaurant.welcomeBackgroundMediaId,
      welcomeBackground: restaurant.welcomeBackground,
      // R2 fields - safely accessed
      logoR2Key: getR2Field('logoR2Key'),
      logoR2Url: getR2Field('logoR2Url'),
      footerLogoR2Key: getR2Field('footerLogoR2Key'),
      footerLogoR2Url: getR2Field('footerLogoR2Url'),
      welcomeBgR2Key: getR2Field('welcomeBgR2Key'),
      welcomeBgR2Url: getR2Field('welcomeBgR2Url'),
      welcomeOverlayColor: restaurant.welcomeOverlayColor,
      welcomeOverlayOpacity: restaurant.welcomeOverlayOpacity,
      welcomeTextEn: restaurant.welcomeTextEn,
      googleMapsUrl: restaurant.googleMapsUrl,
      phoneNumber: restaurant.phoneNumber,
      brandColors: restaurant.brandColors,
      updatedAt: restaurant.updatedAt,
    }
  } catch (error: any) {
    console.error('Error fetching restaurant data:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    })
    return null
  }
}

