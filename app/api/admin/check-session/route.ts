export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
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
  
  // Verify restaurant still exists (not deleted)
  const { prisma } = await import('@/lib/prisma')
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: session.restaurantId },
    select: { id: true, slug: true },
  })
  
  if (!restaurant) {
    // Restaurant was deleted - clear session and return 404
    const { deleteAdminSession } = await import('@/lib/auth')
    await deleteAdminSession()
    return NextResponse.json(
      { authenticated: false, error: 'Restaurant not found: This restaurant has been deleted' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ 
    authenticated: true,
    restaurantId: session.restaurantId,
    restaurantSlug: restaurant.slug, // Include slug for validation in auth wrapper
    adminUserId: session.adminUserId,
  })
}




