import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
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

/**
 * Delete a single object from R2
 */
export async function deleteR2Object(key: string): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('deleteR2Object cannot be used in client-side code')
  }

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('[R2 ERROR] R2_BUCKET_NAME is not set')
  }

  if (!key) {
    return // Nothing to delete
  }

  try {
    const client = getR2Client()
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    })
    await client.send(command)
    console.log('[R2 DELETE] Deleted object:', key)
  } catch (error) {
    console.error('[R2 DELETE] Error deleting object:', key, error)
    // Don't throw - continue with other deletions even if one fails
  }
}

/**
 * Delete all objects with a given prefix from R2 (e.g., all files for a restaurant)
 */
export async function deleteR2ObjectsByPrefix(prefix: string): Promise<void> {
  if (typeof window !== 'undefined') {
    throw new Error('deleteR2ObjectsByPrefix cannot be used in client-side code')
  }

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error('[R2 ERROR] R2_BUCKET_NAME is not set')
  }

  if (!prefix) {
    return
  }

  try {
    const client = getR2Client()
    
    // List all objects with the prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: prefix,
    })

    let continuationToken: string | undefined
    let deletedCount = 0

    do {
      if (continuationToken) {
        listCommand.input.ContinuationToken = continuationToken
      }

      const listResponse = await client.send(listCommand)
      const objects = listResponse.Contents || []

      // Delete each object
      for (const obj of objects) {
        if (obj.Key) {
          await deleteR2Object(obj.Key)
          deletedCount++
        }
      }

      continuationToken = listResponse.NextContinuationToken
    } while (continuationToken)

    console.log(`[R2 DELETE] Deleted ${deletedCount} objects with prefix: ${prefix}`)
  } catch (error) {
    console.error('[R2 DELETE] Error deleting objects by prefix:', prefix, error)
    // Don't throw - continue with DB deletion even if R2 deletion fails
  }
}

// Export getR2Client for verification endpoint
export { getR2Client }

