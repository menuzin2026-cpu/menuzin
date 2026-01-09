import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isReservedSlug } from '@/lib/restaurant-utils'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1) ALWAYS ALLOW: Next.js internal routes
  if (pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // 2) ALWAYS ALLOW: Static assets and API routes
  if (pathname.startsWith('/assets')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/data')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // 3) ALWAYS ALLOW: Static files
  if (
    pathname === '/favicon.ico' ||
    pathname === '/favicon.png' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  // 4) ALLOW: Root "/" - return 404 (handled by app/page.tsx)
  if (pathname === '/') {
    return NextResponse.next()
  }

  // 5) ALLOW: Super admin route (no slug)
  if (pathname === '/super-admin' || pathname.startsWith('/super-admin/')) {
    return NextResponse.next()
  }

  // 6) REDIRECT: admin-portal to admin (backward compatibility)
  if (pathname.includes('/admin-portal')) {
    const newPath = pathname.replace('/admin-portal', '/admin')
    return NextResponse.redirect(new URL(newPath, request.url))
  }

  // 7) Check for reserved slugs in first path segment
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    
    // Block reserved slugs at root level
    if (isReservedSlug(firstSegment)) {
      return new NextResponse(null, { status: 404 })
    }
  }

  // 8) ALLOW: All other routes (dynamic slug routes will be validated in page/API handlers)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    '/((?!_next/static|_next/image).*)',
  ],
}
