export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/auth'
import { revalidateTag } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await getAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const category = await prisma.category.update({
      where: { id: params.id },
      data: body,
    })

    // Invalidate cache so menu page reflects changes immediately
    revalidateTag('menu')

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthenticated = await getAdminSession()
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all items in this category first
    await prisma.item.deleteMany({
      where: { categoryId: params.id },
    })

    // Delete the category
    await prisma.category.delete({
      where: { id: params.id },
    })

    // Invalidate cache so menu page reflects changes immediately
    revalidateTag('menu')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}




