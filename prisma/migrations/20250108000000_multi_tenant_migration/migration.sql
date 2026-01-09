-- Multi-Tenant Migration
-- This migration adds restaurant_id to all restaurant-specific tables and backfills existing data

-- Step 1: Create PlatformSettings table for global settings
CREATE TABLE IF NOT EXISTS "PlatformSettings" (
    "id" TEXT NOT NULL,
    "footerLogoR2Key" TEXT,
    "footerLogoR2Url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- Insert default platform settings row
INSERT INTO "PlatformSettings" ("id", "createdAt", "updatedAt")
VALUES ('platform-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Step 2: Add restaurant_id columns (nullable first)
ALTER TABLE "Feedback" ADD COLUMN IF NOT EXISTS "restaurantId" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "restaurantId" TEXT;
ALTER TABLE "UiSettings" ADD COLUMN IF NOT EXISTS "restaurantId" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "restaurantId" TEXT;

-- Step 3: Add displayName and isActive to AdminUser
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "displayName" TEXT;
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true;

-- Step 4: Find or create the legends restaurant
-- First, try to find existing restaurant with slug 'legends-restaurant'
DO $$
DECLARE
    legends_restaurant_id TEXT;
BEGIN
    -- Try to find existing restaurant
    SELECT id INTO legends_restaurant_id
    FROM "Restaurant"
    WHERE slug = 'legends-restaurant'
    LIMIT 1;

    -- If not found, create it
    IF legends_restaurant_id IS NULL THEN
        INSERT INTO "Restaurant" (
            id, slug, "nameKu", "nameEn", "nameAr",
            "welcomeOverlayColor", "welcomeOverlayOpacity",
            "createdAt", "updatedAt"
        )
        VALUES (
            gen_random_uuid()::TEXT,
            'legends-restaurant',
            'Legends',
            'Legends Restaurant',
            'مطعم Legends',
            '#000000',
            0.5,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
        RETURNING id INTO legends_restaurant_id;
    END IF;

    -- Step 5: Backfill existing data with legends restaurant_id
    -- Backfill Feedback
    UPDATE "Feedback"
    SET "restaurantId" = legends_restaurant_id
    WHERE "restaurantId" IS NULL;

    -- Backfill AdminUser
    UPDATE "AdminUser"
    SET "restaurantId" = legends_restaurant_id
    WHERE "restaurantId" IS NULL;

    -- Backfill UiSettings
    -- First, check if there's an existing UiSettings row
    IF EXISTS (SELECT 1 FROM "UiSettings" WHERE id = 'ui-settings-1') THEN
        -- Update existing row
        UPDATE "UiSettings"
        SET "restaurantId" = legends_restaurant_id
        WHERE id = 'ui-settings-1' AND "restaurantId" IS NULL;
    ELSE
        -- Create new row with restaurant_id
        INSERT INTO "UiSettings" (
            id, "restaurantId",
            "sectionTitleSize", "categoryTitleSize", "itemNameSize",
            "itemDescriptionSize", "itemPriceSize", "headerLogoSize",
            "bottomNavSectionSize", "bottomNavCategorySize",
            "createdAt", "updatedAt"
        )
        VALUES (
            gen_random_uuid()::TEXT,
            legends_restaurant_id,
            22, 16, 14, 14, 16, 32, 13, 13,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    -- Backfill Theme
    -- First, check if there's an existing Theme row
    IF EXISTS (SELECT 1 FROM "Theme" WHERE id = 'theme-1') THEN
        -- Update existing row
        UPDATE "Theme"
        SET "restaurantId" = legends_restaurant_id
        WHERE id = 'theme-1' AND "restaurantId" IS NULL;
    ELSE
        -- Create new row with restaurant_id
        INSERT INTO "Theme" (
            id, "restaurantId", "appBg",
            "createdAt", "updatedAt"
        )
        VALUES (
            gen_random_uuid()::TEXT,
            legends_restaurant_id,
            '#400810',
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

END $$;

-- Step 6: Set NOT NULL constraints
ALTER TABLE "Feedback" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "AdminUser" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "UiSettings" ALTER COLUMN "restaurantId" SET NOT NULL;
ALTER TABLE "Theme" ALTER COLUMN "restaurantId" SET NOT NULL;

-- Step 7: Add foreign key constraints
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_restaurantId_fkey" 
    FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_restaurantId_fkey" 
    FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
ALTER TABLE "UiSettings" ADD CONSTRAINT "UiSettings_restaurantId_fkey" 
    FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_restaurantId_fkey" 
    FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE;

-- Step 8: Add unique constraints
ALTER TABLE "UiSettings" ADD CONSTRAINT "UiSettings_restaurantId_key" UNIQUE ("restaurantId");
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_restaurantId_key" UNIQUE ("restaurantId");

-- Step 9: Add indexes for performance
CREATE INDEX IF NOT EXISTS "Feedback_restaurantId_idx" ON "Feedback"("restaurantId");
CREATE INDEX IF NOT EXISTS "AdminUser_restaurantId_idx" ON "AdminUser"("restaurantId");
CREATE INDEX IF NOT EXISTS "AdminUser_restaurantId_isActive_idx" ON "AdminUser"("restaurantId", "isActive");
CREATE INDEX IF NOT EXISTS "Section_restaurantId_sortOrder_idx" ON "Section"("restaurantId", "sortOrder");
CREATE INDEX IF NOT EXISTS "Category_sectionId_sortOrder_idx" ON "Category"("sectionId", "sortOrder");
CREATE INDEX IF NOT EXISTS "Item_categoryId_sortOrder_idx" ON "Item"("categoryId", "sortOrder");

-- Step 10: Update UiSettings and Theme to use cuid() instead of fixed IDs
-- This is handled by Prisma schema change, but we need to ensure existing rows are updated
-- The migration above already handles this by creating new rows if needed

