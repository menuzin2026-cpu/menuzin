import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface LayoutProps {
  children: React.ReactNode
  params: {
    slug: string
  }
}

export default async function SlugLayout({ children, params }: LayoutProps) {
  const { slug } = params

  try {
    // Validate restaurant exists (deleted restaurants should return 404)
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true }, // Only need to check existence
    })

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

