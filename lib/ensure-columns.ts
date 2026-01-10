import { PrismaClient } from '@prisma/client'

/**
 * Ensures new columns exist in production without requiring an immediate migration.
 * Safe to run repeatedly; uses IF NOT EXISTS.
 */
export async function ensureRestaurantWelcomeBgMimeTypeColumn(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "welcomeBgMimeType" TEXT;'
    )
  } catch (error) {
    // Non-fatal: if this fails (e.g., insufficient permissions), normal code may still proceed
    // and deployment can rely on standard migrations instead.
    console.warn('[DB COMPAT] Failed to ensure welcomeBgMimeType column:', error)
  }
}

/**
 * Ensures social media and service charge columns exist in Restaurant table.
 * Safe to run repeatedly; uses IF NOT EXISTS.
 */
export async function ensureRestaurantSocialMediaColumns(prisma: PrismaClient): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
      ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "snapchatUrl" TEXT;
      ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT;
      ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "serviceChargePercent" DOUBLE PRECISION DEFAULT 0;
    `)
  } catch (error) {
    // Non-fatal: if this fails (e.g., insufficient permissions), normal code may still proceed
    // and deployment can rely on standard migrations instead.
    console.warn('[DB COMPAT] Failed to ensure social media columns:', error)
  }
}


