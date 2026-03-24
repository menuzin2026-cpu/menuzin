export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { getSuperAdminSession } from '@/lib/auth'

export async function GET() {
  const isAuthenticated = await getSuperAdminSession()
  if (isAuthenticated) {
    return NextResponse.json({ authenticated: true })
  }
  return NextResponse.json({ authenticated: false }, { status: 401 })
}



export const runtime = 'edge';
