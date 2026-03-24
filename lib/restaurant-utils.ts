import { prisma } from '@/lib/prisma'
import { ensureRestaurantWelcomeBgMimeTypeColumn, ensureRestaurantSocialMediaColumns } from '@/lib/ensure-columns'
import { isReservedSlug, validateSlug } from './slug-utils'

export { isReservedSlug, validateSlug }

export async function getRestaurantBySlug(slug: string) {
  try {
    // Ensure columns exist before querying (handles missing migrations gracefully)
    await ensureRestaurantWelcomeBgMimeTypeColumn(prisma)
    await ensureRestaurantSocialMediaColumns(prisma)

    try {
      return await prisma.restaurant.findUnique({
        where: { slug },
      })
    } catch (error: any) {
      // If query fails due to missing columns (P2022), use raw SQL fallback
      if (error?.code === 'P2022') {
        console.warn('[DB COMPAT] Prisma query failed, using raw SQL fallback:', error.message)
        const rawResult = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, slug, "nameKu", "nameEn", "nameAr"
           FROM "Restaurant"
           WHERE slug = '${slug.replace(/'/g, "''")}'`
        )
        return rawResult && rawResult.length > 0 ? rawResult[0] : null
      }
      throw error
    }
  } catch (error) {
    console.error('[ERROR] Error fetching restaurant by slug:', error)
    return null
  }
}

export async function requireRestaurantBySlug(slug: string) {
  const restaurant = await getRestaurantBySlug(slug)
  if (!restaurant) {
    throw new Error('Restaurant not found')
  }
  return restaurant
}

