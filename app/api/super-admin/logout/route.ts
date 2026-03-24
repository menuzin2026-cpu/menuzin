export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import { deleteSuperAdminSession } from '@/lib/auth'

export async function POST() {
  await deleteSuperAdminSession()
  return NextResponse.json({ success: true })
}


