-- ============================================
-- Create Missing Tables in Supabase
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create platform_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'platform-1',
    "footer_logo_r2_key" TEXT,
    "footer_logo_r2_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- Insert default row if it doesn't exist
INSERT INTO "platform_settings" ("id", "created_at", "updated_at")
VALUES ('platform-1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- 2. Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS "admin_users" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "pin_hash" TEXT NOT NULL,
    "display_name" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- 3. Ensure restaurant_id foreign key exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'admin_users_restaurant_id_fkey'
    ) THEN
        ALTER TABLE "admin_users" 
        ADD CONSTRAINT "admin_users_restaurant_id_fkey" 
        FOREIGN KEY ("restaurant_id") 
        REFERENCES "Restaurant"("id") 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS "admin_users_restaurant_id_idx" 
ON "admin_users"("restaurant_id");

CREATE INDEX IF NOT EXISTS "admin_users_restaurant_id_is_active_idx" 
ON "admin_users"("restaurant_id", "is_active");

-- 5. If AdminUser table exists (camelCase), migrate data and drop it
DO $$
DECLARE
    legends_restaurant_id TEXT;
BEGIN
    -- Check if old AdminUser table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'AdminUser') THEN
        -- Find or create legends restaurant for backfilling
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

        -- Migrate data from AdminUser to admin_users
        INSERT INTO "admin_users" (
            "id", "restaurant_id", "pin_hash", "display_name", 
            "is_active", "last_login_at", "created_at", "updated_at"
        )
        SELECT 
            "id",
            COALESCE("restaurantId", "restaurant_id", legends_restaurant_id),
            COALESCE("pinHash", "pin_hash"),
            COALESCE("displayName", "display_name"),
            COALESCE("isActive", "is_active", true),
            COALESCE("lastLoginAt", "last_login_at"),
            COALESCE("createdAt", "created_at", CURRENT_TIMESTAMP),
            COALESCE("updatedAt", "updated_at", CURRENT_TIMESTAMP)
        FROM "AdminUser"
        WHERE NOT EXISTS (
            SELECT 1 FROM "admin_users" WHERE "admin_users"."id" = "AdminUser"."id"
        )
        ON CONFLICT ("id") DO NOTHING;

        -- Drop old table after migration
        DROP TABLE IF EXISTS "AdminUser" CASCADE;
    END IF;
END $$;

-- 6. If PlatformSettings table exists (PascalCase), migrate data and drop it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'PlatformSettings') THEN
        -- Migrate data from PlatformSettings to platform_settings
        INSERT INTO "platform_settings" (
            "id", "footer_logo_r2_key", "footer_logo_r2_url", 
            "created_at", "updated_at"
        )
        SELECT 
            "id",
            "footerLogoR2Key",
            "footerLogoR2Url",
            "createdAt",
            "updatedAt"
        FROM "PlatformSettings"
        WHERE NOT EXISTS (
            SELECT 1 FROM "platform_settings" WHERE "platform_settings"."id" = "PlatformSettings"."id"
        )
        ON CONFLICT ("id") DO NOTHING;

        -- Drop old table after migration
        DROP TABLE IF EXISTS "PlatformSettings" CASCADE;
    END IF;
END $$;

