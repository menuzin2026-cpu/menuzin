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

    const footerLogoMediaId = (restaurant as any).footerLogoMediaId || null
    const footerLogo = (restaurant as any).footerLogo || null

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
      // R2 fields
      logoR2Key: (restaurant as any).logoR2Key || null,
      logoR2Url: (restaurant as any).logoR2Url || null,
      footerLogoR2Key: (restaurant as any).footerLogoR2Key || null,
      footerLogoR2Url: (restaurant as any).footerLogoR2Url || null,
      welcomeBgR2Key: (restaurant as any).welcomeBgR2Key || null,
      welcomeBgR2Url: (restaurant as any).welcomeBgR2Url || null,
      welcomeOverlayColor: restaurant.welcomeOverlayColor,
      welcomeOverlayOpacity: restaurant.welcomeOverlayOpacity,
      welcomeTextEn: restaurant.welcomeTextEn,
      googleMapsUrl: restaurant.googleMapsUrl,
      phoneNumber: restaurant.phoneNumber,
      brandColors: restaurant.brandColors,
      updatedAt: restaurant.updatedAt,
    }
  } catch (error) {
    console.error('Error fetching restaurant data:', error)
    return null
  }
}

