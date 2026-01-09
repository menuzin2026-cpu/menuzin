export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const session = await getAdminSession()
  if (session) {
    return NextResponse.json({ 
      authenticated: true,
      restaurantId: session.restaurantId,
      adminUserId: session.adminUserId,
    })
  }
  return NextResponse.json({ authenticated: false }, { status: 401 })
}




