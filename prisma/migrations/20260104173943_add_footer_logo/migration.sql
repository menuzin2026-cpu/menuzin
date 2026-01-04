-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "footerLogoMediaId" TEXT;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_footerLogoMediaId_fkey" FOREIGN KEY ("footerLogoMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

