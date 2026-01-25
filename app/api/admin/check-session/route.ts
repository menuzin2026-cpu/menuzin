import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { unstable_cache } from 'next/cache'

export async function GET() {
  const startTime = Date.now()
  const session = await getAdminSession()
  if (!session) {
    // Session expired or not found - return SESSION_EXPIRED error
    const { deleteAdminSession } = await import('@/lib/auth')
    await deleteAdminSession()
    return NextResponse.json(
      { ok: false, error: 'SESSION_EXPIRED' },
      { status: 401 }
    )
  }
  
  // Verify restaurant still exists (not deleted) - cache for 10 seconds
  const { prisma } = await import('@/lib/prisma')
  const restaurant = await unstable_cache(
    async () => {
      return await prisma.restaurant.findUnique({
        where: { id: session.restaurantId },
        select: { id: true, slug: true },
      })
    },
    [`restaurant-check-${session.restaurantId}`],
    { revalidate: 10 } // 10 seconds cache
  )()
  
  if (!restaurant) {
    // Restaurant was deleted - clear session and return 404
    const { deleteAdminSession } = await import('@/lib/auth')
    await deleteAdminSession()
    return NextResponse.json(
      { authenticated: false, error: 'Restaurant not found: This restaurant has been deleted' },
      { status: 404 }
    )
  }
  
  const checkTime = Date.now() - startTime
  if (process.env.NODE_ENV === 'development') {
    console.log(`[PERF] Session check: ${checkTime}ms`)
  }

  return NextResponse.json(
    { 
      authenticated: true,
      restaurantId: session.restaurantId,
      restaurantSlug: restaurant.slug, // Include slug for validation in auth wrapper
      adminUserId: session.adminUserId,
    },
    {
      headers: {
        'Cache-Control': 'private, s-maxage=10, stale-while-revalidate=20',
      },
    }
  )
}




