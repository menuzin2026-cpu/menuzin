-- ============================================
-- Fix platform_settings table name and columns
-- Renames from PlatformSettings (PascalCase) to platform_settings (snake_case)
-- Renames columns from camelCase to snake_case to match Prisma schema
-- ============================================

-- Step 1: Check if old table "PlatformSettings" exists and rename to "platform_settings"
DO $$
BEGIN
    -- If old PascalCase table exists, rename it
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'PlatformSettings'
    ) THEN
        ALTER TABLE "PlatformSettings" RENAME TO platform_settings;
        RAISE NOTICE 'Renamed table PlatformSettings to platform_settings';
    END IF;
END $$;

-- Step 2: Create the table with correct name if it doesn't exist (neither old nor new)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'platform-1',
    footer_logo_r2_key TEXT,
    footer_logo_r2_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: If table exists with old column names, rename them
DO $$
BEGIN
    -- Rename footerLogoR2Key to footer_logo_r2_key
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'footerLogoR2Key'
    ) THEN
        ALTER TABLE platform_settings RENAME COLUMN "footerLogoR2Key" TO footer_logo_r2_key;
        RAISE NOTICE 'Renamed column footerLogoR2Key to footer_logo_r2_key';
    END IF;

    -- Rename footerLogoR2Url to footer_logo_r2_url
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'footerLogoR2Url'
    ) THEN
        ALTER TABLE platform_settings RENAME COLUMN "footerLogoR2Url" TO footer_logo_r2_url;
        RAISE NOTICE 'Renamed column footerLogoR2Url to footer_logo_r2_url';
    END IF;

    -- Rename createdAt to created_at
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'createdAt'
    ) THEN
        ALTER TABLE platform_settings RENAME COLUMN "createdAt" TO created_at;
        RAISE NOTICE 'Renamed column createdAt to created_at';
    END IF;

    -- Rename updatedAt to updated_at
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'updatedAt'
    ) THEN
        ALTER TABLE platform_settings RENAME COLUMN "updatedAt" TO updated_at;
        RAISE NOTICE 'Renamed column updatedAt to updated_at';
    END IF;
END $$;

-- Step 4: Add missing columns if they don't exist (in case table was created but missing columns)
DO $$
BEGIN
    -- Add footer_logo_r2_key if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'footer_logo_r2_key'
    ) THEN
        ALTER TABLE platform_settings ADD COLUMN footer_logo_r2_key TEXT;
        RAISE NOTICE 'Added column footer_logo_r2_key';
    END IF;

    -- Add footer_logo_r2_url if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'footer_logo_r2_url'
    ) THEN
        ALTER TABLE platform_settings ADD COLUMN footer_logo_r2_url TEXT;
        RAISE NOTICE 'Added column footer_logo_r2_url';
    END IF;

    -- Add created_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE platform_settings ADD COLUMN created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added column created_at';
    END IF;

    -- Add updated_at if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'platform_settings' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE platform_settings ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added column updated_at';
    END IF;
END $$;

-- Step 5: Ensure default row exists
INSERT INTO platform_settings (id, footer_logo_r2_key, footer_logo_r2_url, created_at, updated_at)
VALUES ('platform-1', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Step 6: Verify the final structure
SELECT 
    '✅ platform_settings table structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'platform_settings'
ORDER BY ordinal_position;

