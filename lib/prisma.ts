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
 * - Supabase: Use the connection pooler port (usually 6543) instead of 5432
 *   Example: postgresql://user:pass@host.region.supabase.co:6543/db?pgbouncer=true
 * - Other providers: Check their documentation for connection pooling options
 */
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
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




