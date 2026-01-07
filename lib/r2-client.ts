import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Import startup check (runs on module load)
import './r2-startup-check'

// Cloudflare R2 is S3-compatible
// Only initialize if we're on the server and have credentials
let r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (typeof window !== 'undefined') {
    throw new Error('R2 client cannot be used in client-side code')
  }

  if (!r2Client) {
    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('[R2 ERROR] R2 credentials not configured. Check environment variables.')
    }

    r2Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })

    console.log('[R2 CLIENT] Initialized successfully')
    console.log('[R2 CLIENT] Endpoint:', process.env.R2_ENDPOINT)
    console.log('[R2 CLIENT] Bucket:', process.env.R2_BUCKET_NAME)
  }

  return r2Client
}

export function getR2PublicUrl(key: string): string {
  if (typeof window !== 'undefined') {
    throw new Error('getR2PublicUrl cannot be used in client-side code')
  }

  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, '') || ''
  if (!baseUrl) {
    throw new Error('[R2 ERROR] R2_PUBLIC_BASE_URL is not set')
  }
  return `${baseUrl}/${key}`
}

export async function generatePresignedUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('generatePresignedUrl cannot be used in client-side code')
  }

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('[R2 ERROR] R2_BUCKET_NAME is not set')
  }

  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(client, command, { expiresIn })
}

export function generateR2Key(
  scope: string,
  restaurantId: string,
  fileName: string,
  itemId?: string
): string {
  if (typeof window !== 'undefined') {
    throw new Error('generateR2Key cannot be used in client-side code')
  }

  // Sanitize fileName
  const safeFileName = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '-')
    .toLowerCase()
    .substring(0, 100) // Limit length

  const timestamp = Date.now()
  const itemPrefix = itemId ? `${itemId}-` : ''
  
  return `restaurants/${restaurantId}/${scope}/${itemPrefix}${timestamp}-${safeFileName}`
}

// Export getR2Client for verification endpoint
export { getR2Client }

