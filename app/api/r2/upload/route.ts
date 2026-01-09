import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getR2Client, generateR2Key, getR2PublicUrl } from '@/lib/r2-client'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { z } from 'zod'

const uploadSchema = z.object({
  scope: z.enum(['logo', 'footerLogo', 'welcomeBg', 'itemImage', 'categoryImage', 'platformFooterLogo']),
  restaurantId: z.string().optional(),
  itemId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  // Server-side only check
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: 'This endpoint is server-only' }, { status: 403 })
  }

  try {
    console.log('[R2 UPLOAD PROXY] Upload endpoint called')

    // Check authentication (admin for restaurant media, super admin for platform media)
    const scope = formData.get('scope') as string
    const isPlatformScope = scope === 'platformFooterLogo'
    
    if (isPlatformScope) {
      const { getSuperAdminSession } = await import('@/lib/auth')
      const isAuthenticated = await getSuperAdminSession()
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    } else {
      const isAuthenticated = await getAdminSession()
      if (!isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const scope = formData.get('scope') as string
    const restaurantId = formData.get('restaurantId') as string | null
    const itemId = formData.get('itemId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // For platformFooterLogo, restaurantId is not required
    // For other scopes, restaurantId is required
    const isPlatformScope = scope === 'platformFooterLogo'
    if (!isPlatformScope && !restaurantId) {
      return NextResponse.json({ error: 'restaurantId is required for this scope' }, { status: 400 })
    }

    // Validate input
    const validation = uploadSchema.safeParse({
      scope,
      restaurantId: restaurantId || undefined,
      itemId: itemId || undefined,
    })

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Validate file type
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
    const ALLOWED_VIDEO_TYPES = ['video/mp4']
    const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid content type. Only JPEG, PNG, WebP images and MP4 videos are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (5MB for images, 20MB for videos)
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size exceeds limit. Max ${isImage ? '5MB' : '20MB'}.` },
        { status: 400 }
      )
    }

    // Generate R2 key
    let key: string
    if (isPlatformScope) {
      // Platform footer logo: platform/footer/{timestamp}-{filename}
      const timestamp = Date.now()
      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, '-')
        .toLowerCase()
        .substring(0, 100)
      key = `platform/footer/${timestamp}-${safeFileName}`
    } else {
      key = generateR2Key(validation.data.scope, validation.data.restaurantId!, file.name, validation.data.itemId)
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to R2
    const client = getR2Client()
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })

    await client.send(command)

    // Generate public URL
    const publicUrl = getR2PublicUrl(key)

    console.log('[R2 UPLOAD PROXY] ✅ File uploaded successfully')
    console.log('[R2 UPLOAD PROXY] Key:', key)
    console.log('[R2 UPLOAD PROXY] Public URL:', publicUrl)

    return NextResponse.json({
      key,
      publicUrl,
    })
  } catch (error) {
    console.error('[R2 UPLOAD PROXY] ❌ Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

