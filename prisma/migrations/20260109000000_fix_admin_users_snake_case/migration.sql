-- Fix AdminUser/admin_users table to use snake_case columns
-- This migration handles both table name cases: "AdminUser" or "admin_users"

-- Step 1: Determine table name and standardize to "admin_users"
DO $$
DECLARE
    table_name_var TEXT;
    legends_restaurant_id TEXT;
BEGIN
    -- Check which table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'AdminUser') THEN
        -- Rename AdminUser to admin_users
        ALTER TABLE "AdminUser" RENAME TO "admin_users";
        table_name_var := 'admin_users';
    ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        table_name_var := 'admin_users';
    ELSE
        -- Create table if it doesn't exist
        CREATE TABLE "admin_users" (
            "id" TEXT NOT NULL,
            "restaurant_id" TEXT,
            "pin_hash" TEXT,
            "display_name" TEXT,
            "is_active" BOOLEAN DEFAULT true,
            "last_login_at" TIMESTAMP(3),
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
        );
        table_name_var := 'admin_users';
    END IF;

    -- Step 2: Rename restaurantId to restaurant_id if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'restaurantId'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "restaurantId" TO "restaurant_id"', table_name_var);
    END IF;

    -- Step 3: Create restaurant_id if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "restaurant_id" TEXT', table_name_var);

    -- Step 4: Rename pinHash to pin_hash if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'pinHash'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "pinHash" TO "pin_hash"', table_name_var);
    END IF;

    -- Step 5: Create pin_hash if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "pin_hash" TEXT', table_name_var);

    -- Step 6: Rename displayName to display_name if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'displayName'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "displayName" TO "display_name"', table_name_var);
    END IF;

    -- Step 7: Create display_name if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "display_name" TEXT', table_name_var);

    -- Step 8: Rename isActive to is_active if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'isActive'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "isActive" TO "is_active"', table_name_var);
    END IF;

    -- Step 9: Create is_active if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT true', table_name_var);

    -- Step 10: Rename lastLoginAt to last_login_at if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'lastLoginAt'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "lastLoginAt" TO "last_login_at"', table_name_var);
    END IF;

    -- Step 11: Create last_login_at if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "last_login_at" TIMESTAMP(3)', table_name_var);

    -- Step 12: Rename createdAt to created_at if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'createdAt'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "createdAt" TO "created_at"', table_name_var);
    END IF;

    -- Step 13: Create created_at if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name_var);

    -- Step 14: Rename updatedAt to updated_at if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = table_name_var AND column_name = 'updatedAt'
    ) THEN
        EXECUTE format('ALTER TABLE "%s" RENAME COLUMN "updatedAt" TO "updated_at"', table_name_var);
    END IF;

    -- Step 15: Create updated_at if it doesn't exist
    EXECUTE format('ALTER TABLE "%s" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP', table_name_var);

    -- Step 16: Find or create legends restaurant for backfilling
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

    -- Step 17: Backfill restaurant_id
    EXECUTE format('UPDATE "%s" SET "restaurant_id" = $1 WHERE "restaurant_id" IS NULL', table_name_var) USING legends_restaurant_id;

    -- Step 18: Set NOT NULL on restaurant_id
    EXECUTE format('ALTER TABLE "%s" ALTER COLUMN "restaurant_id" SET NOT NULL', table_name_var);

    -- Step 19: Set NOT NULL on pin_hash
    EXECUTE format('ALTER TABLE "%s" ALTER COLUMN "pin_hash" SET NOT NULL', table_name_var);

    -- Step 20: Drop old foreign key constraints if they exist
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'AdminUser_restaurantId_fkey') THEN
        ALTER TABLE "admin_users" DROP CONSTRAINT IF EXISTS "AdminUser_restaurantId_fkey";
    END IF;
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_restaurantId_fkey') THEN
        ALTER TABLE "admin_users" DROP CONSTRAINT IF EXISTS "admin_users_restaurantId_fkey";
    END IF;

    -- Step 21: Add foreign key constraint for restaurant_id
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_restaurant_id_fkey') THEN
        ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_restaurant_id_fkey" 
        FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE;
    END IF;

    -- Step 22: Drop old indexes if they exist
    DROP INDEX IF EXISTS "AdminUser_restaurantId_idx";
    DROP INDEX IF EXISTS "AdminUser_restaurantId_isActive_idx";
    DROP INDEX IF EXISTS "admin_users_restaurantId_idx";
    DROP INDEX IF EXISTS "admin_users_restaurantId_isActive_idx";

    -- Step 23: Create indexes for performance
    CREATE INDEX IF NOT EXISTS "admin_users_restaurant_id_idx" ON "admin_users"("restaurant_id");
    CREATE INDEX IF NOT EXISTS "admin_users_restaurant_id_is_active_idx" ON "admin_users"("restaurant_id", "is_active");

END $$;
