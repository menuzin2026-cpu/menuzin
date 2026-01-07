/**
 * R2 Startup Check
 * Runs on server startup to verify R2 configuration
 * Logs to server console (Vercel logs)
 */

export function checkR2Config() {
  if (typeof window !== 'undefined') {
    // Skip in client-side
    return
  }

  const required = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_ENDPOINT',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_BASE_URL',
  ]

  const missing: string[] = []
  const present: string[] = []

  for (const key of required) {
    if (process.env[key]) {
      present.push(key)
    } else {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    console.error('[R2 STARTUP] ❌ Missing R2 environment variables:', missing.join(', '))
    console.error('[R2 STARTUP] Present variables:', present.join(', '))
    if (process.env.NODE_ENV === 'production') {
      console.error('[R2 STARTUP] ⚠️  Production deployment will fail without R2 configuration')
    }
  } else {
    console.log('[R2 STARTUP] ✅ All R2 environment variables are set')
    console.log('[R2 STARTUP] Endpoint:', process.env.R2_ENDPOINT)
    console.log('[R2 STARTUP] Bucket:', process.env.R2_BUCKET_NAME)
    console.log('[R2 STARTUP] Public URL:', process.env.R2_PUBLIC_BASE_URL)
  }
}

// Run check on module load (server-side only)
if (typeof window === 'undefined') {
  checkR2Config()
}

