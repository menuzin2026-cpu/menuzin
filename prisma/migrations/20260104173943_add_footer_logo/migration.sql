-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "footerLogoMediaId" TEXT;

-- AddForeignKey (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'Restaurant_footerLogoMediaId_fkey'
    ) THEN
        ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_footerLogoMediaId_fkey" 
        FOREIGN KEY ("footerLogoMediaId") REFERENCES "Media"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

