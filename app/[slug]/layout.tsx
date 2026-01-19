import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface LayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

// Cached function to get restaurant ID by slug (only caches existence check)
const getRestaurantIdBySlug = async (slug: string) => {
  return await prisma.restaurant.findUnique({
    where: { slug },
    select: { id: true }, // Only need to check existence
  })
}

export default async function SlugLayout({ children, params }: LayoutProps) {
  const { slug } = params

  try {
    // Validate restaurant exists (deleted restaurants should return 404)
    // Cache only the slug->restaurantId lookup to reduce TTFB delay
    const cachedGetRestaurant = unstable_cache(
      async () => getRestaurantIdBySlug(slug),
      [`restaurant-id-by-slug-${slug}`],
      {
        tags: [`restaurant-slug-${slug}`],
        revalidate: 600, // Cache for 10 minutes
      }
    )
    
    const restaurant = await cachedGetRestaurant()

    // Return 404 if restaurant doesn't exist (deleted)
    if (!restaurant) {
      notFound()
    }

    // Restaurant exists - render children
    return <>{children}</>
  } catch (error) {
    console.error('[ERROR] Layout - Error checking restaurant:', error)
    // On database error, still return 404 (better than showing error page)
    notFound()
  }
}

