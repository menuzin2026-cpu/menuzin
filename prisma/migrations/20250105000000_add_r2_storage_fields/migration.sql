-- AlterTable: Add R2 storage fields to Restaurant
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "logoR2Key" TEXT,
ADD COLUMN IF NOT EXISTS "logoR2Url" TEXT,
ADD COLUMN IF NOT EXISTS "footerLogoR2Key" TEXT,
ADD COLUMN IF NOT EXISTS "footerLogoR2Url" TEXT,
ADD COLUMN IF NOT EXISTS "welcomeBgR2Key" TEXT,
ADD COLUMN IF NOT EXISTS "welcomeBgR2Url" TEXT;

-- AlterTable: Add R2 storage fields to Category
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "imageR2Key" TEXT,
ADD COLUMN IF NOT EXISTS "imageR2Url" TEXT;

-- AlterTable: Add R2 storage fields to Item
ALTER TABLE "Item" ADD COLUMN IF NOT EXISTS "imageR2Key" TEXT,
ADD COLUMN IF NOT EXISTS "imageR2Url" TEXT;

