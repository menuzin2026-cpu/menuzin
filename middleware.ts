import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isReservedSlug } from '@/lib/slug-utils'

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

  // 5) ALLOW: Super admin route (no slug only)
  if (pathname === '/super-admin' || pathname.startsWith('/super-admin/')) {
    // Block if there's a slug before super-admin (e.g., /[slug]/super-admin)
    const pathSegments = pathname.split('/').filter(Boolean)
    // If path has more than 2 segments and second segment is 'super-admin', it means there's a slug
    // Example: /legends-restaurant/super-admin -> ['legends-restaurant', 'super-admin']
    if (pathSegments.length >= 2 && pathSegments[1] === 'super-admin') {
      return new NextResponse(null, { status: 404 })
    }
    return NextResponse.next()
  }

  // 6) BLOCK: [slug]/admin routes (return 404, no redirect)
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length >= 2 && pathSegments[1] === 'admin') {
    // Block /[slug]/admin routes - only /[slug]/admin-portal is allowed
    return new NextResponse(null, { status: 404 })
  }

  // 7) Check for reserved slugs in first path segment
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
