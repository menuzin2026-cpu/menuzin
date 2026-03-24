import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Creates a PrismaClient instance with proper configuration for serverless environments.
 * 
 * IMPORTANT: For serverless environments (Vercel, etc.), ensure your DATABASE_URL
 * uses a connection pooler if available:
 * - Neon: Use the pooled connection string (ends with ?pgbouncer=true)
 * - Supabase Transaction Mode: Use port 6543 with ?pgbouncer=true to disable prepared statements
 *   Example: postgresql://user:pass@host.region.supabase.co:6543/db?pgbouncer=true
 * - Supabase Session Mode: Use port 5432 (supports prepared statements) - LIMITED POOL SIZE
 * - Other providers: Check their documentation for connection pooling options
 * 
 * CRITICAL: Session Mode (port 5432) has limited pool size and can cause "max clients reached" errors.
 * Use Transaction Mode (port 6543) for better connection pooling in serverless environments.
 */
const createPrismaClient = () => {
  let databaseUrl = process.env.DATABASE_URL || ''
  
  // Only convert to Transaction Mode at runtime (not during build)
  // Build time detection: if we're in a build context, don't convert
  const isBuildTime = typeof window === 'undefined' && 
                      (process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.npm_lifecycle_event === 'build')
  
  // For runtime (not build), convert Session Mode to Transaction Mode for better pooling
  if (!isBuildTime) {
    // Check if using Supabase Session Mode (port 5432) - this has limited pool size
    if (databaseUrl.includes('.supabase.co:5432') || databaseUrl.includes('.supabase.com:5432')) {
      console.warn('[PRISMA] ⚠️  Using Supabase Session Mode (port 5432) - limited pool size!')
      console.warn('[PRISMA] 💡 Consider switching to Transaction Mode (port 6543) for better pooling')
      
      // Convert to Transaction Mode if possible (only at runtime, not during build)
      if (databaseUrl.includes(':5432')) {
        const transactionUrl = databaseUrl.replace(':5432', ':6543')
        const url = new URL(transactionUrl)
        
        // Add pgbouncer=true to disable prepared statements (required for Transaction Mode)
        url.searchParams.set('pgbouncer', 'true')
        
        // Add connection_limit to prevent pool exhaustion
        if (!url.searchParams.has('connection_limit')) {
          url.searchParams.set('connection_limit', '1')
        }
        
        databaseUrl = url.toString()
        console.log('[PRISMA] ✅ Converted to Transaction Mode (port 6543) for runtime')
      }
    }
  }
  
  // For Transaction Mode (port 6543) at runtime, ensure pgbouncer=true is set
  if (databaseUrl.includes(':6543') && !isBuildTime) {
    const url = new URL(databaseUrl)
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true')
      databaseUrl = url.toString()
    }
    // Set connection_limit for transaction mode
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1')
    }
  }
  
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  })
}

/**
 * Prisma Client singleton - ensures only one instance exists across all serverless functions.
 * This prevents connection pool exhaustion in production environments.
 * 
 * CRITICAL: In serverless (Vercel), each function invocation could create a new PrismaClient.
 * Using globalThis ensures we reuse the same instance across all invocations.
 */
/**
 * Lazy Prisma Client getter - ensures the client is only created when first needed.
 */
function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }
  globalForPrisma.prisma = createPrismaClient()
  return globalForPrisma.prisma
}

/**
 * Lazy Prisma Client Proxy
 * Ensures the PrismaClient is only instantiated when first accessed.
 */
const prismaProxy = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    const instance = getPrisma()
    return Reflect.get(instance, prop, receiver)
  }
})

export const prisma = prismaProxy

// Note: Graceful shutdown (process.on) is disabled for Edge/Cloudflare compatibility




