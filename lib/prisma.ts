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
 * - Supabase Session Mode: Use port 5432 (supports prepared statements)
 * - Other providers: Check their documentation for connection pooling options
 */
const createPrismaClient = () => {
  // Parse DATABASE_URL to add pgbouncer=true if using port 6543 (Transaction Mode)
  // This disables prepared statements which Transaction Mode doesn't support
  let databaseUrl = process.env.DATABASE_URL || ''
  
  if (databaseUrl.includes(':6543')) {
    // Transaction Mode - add pgbouncer=true to disable prepared statements
    const url = new URL(databaseUrl)
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true')
      databaseUrl = url.toString()
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
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Always set global in both dev and production to prevent multiple instances
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown (development only)
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      // Silently handle disconnect errors
    }
  })
}




