-- Fix AdminUser table to use snake_case columns
-- This migration handles both cases: if columns exist in camelCase, rename them; if they don't exist, create them

-- Step 1: Rename restaurantId to restaurant_id if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'restaurantId'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "restaurantId" TO "restaurant_id";
    END IF;
END $$;

-- Step 2: Create restaurant_id if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "restaurant_id" TEXT;

-- Step 3: Rename pinHash to pin_hash if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'pinHash'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "pinHash" TO "pin_hash";
    END IF;
END $$;

-- Step 4: Create pin_hash if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "pin_hash" TEXT;

-- Step 5: Rename displayName to display_name if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'displayName'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "displayName" TO "display_name";
    END IF;
END $$;

-- Step 6: Create display_name if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "display_name" TEXT;

-- Step 7: Rename isActive to is_active if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'isActive'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "isActive" TO "is_active";
    END IF;
END $$;

-- Step 8: Create is_active if it doesn't exist (with default)
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT true;

-- Step 9: Rename lastLoginAt to last_login_at if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'lastLoginAt'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "lastLoginAt" TO "last_login_at";
    END IF;
END $$;

-- Step 10: Create last_login_at if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP(3);

-- Step 11: Rename createdAt to created_at if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "createdAt" TO "created_at";
    END IF;
END $$;

-- Step 12: Create created_at if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 13: Rename updatedAt to updated_at if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'AdminUser' AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE "AdminUser" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;
END $$;

-- Step 14: Create updated_at if it doesn't exist
ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 15: Backfill restaurant_id for existing rows if null
DO $$
DECLARE
    legends_restaurant_id TEXT;
BEGIN
    -- Find or create legends restaurant
    SELECT id INTO legends_restaurant_id
    FROM "Restaurant"
    WHERE slug = 'legends-restaurant'
    LIMIT 1;

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

    -- Backfill restaurant_id
    UPDATE "AdminUser"
    SET "restaurant_id" = legends_restaurant_id
    WHERE "restaurant_id" IS NULL;
END $$;

-- Step 16: Set NOT NULL on restaurant_id
ALTER TABLE "AdminUser" ALTER COLUMN "restaurant_id" SET NOT NULL;

-- Step 17: Set NOT NULL on pin_hash
ALTER TABLE "AdminUser" ALTER COLUMN "pin_hash" SET NOT NULL;

-- Step 18: Drop old foreign key constraint if it exists (camelCase)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AdminUser_restaurantId_fkey'
    ) THEN
        ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_restaurantId_fkey";
    END IF;
END $$;

-- Step 19: Add foreign key constraint for restaurant_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'AdminUser_restaurant_id_fkey'
    ) THEN
        ALTER TABLE "AdminUser" ADD CONSTRAINT "AdminUser_restaurant_id_fkey" 
        FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
    END IF;
END $$;

-- Step 20: Drop old index if it exists (camelCase)
DROP INDEX IF EXISTS "AdminUser_restaurantId_idx";
DROP INDEX IF EXISTS "AdminUser_restaurantId_isActive_idx";

-- Step 21: Create indexes for performance
CREATE INDEX IF NOT EXISTS "AdminUser_restaurant_id_idx" ON "AdminUser"("restaurant_id");
CREATE INDEX IF NOT EXISTS "AdminUser_restaurant_id_is_active_idx" ON "AdminUser"("restaurant_id", "is_active");

