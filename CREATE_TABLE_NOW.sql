-- ============================================
-- CREATE PLATFORM_SETTINGS TABLE - RUN THIS NOW
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- ============================================

-- Step 1: Drop table if it exists (to start fresh)
DROP TABLE IF EXISTS public.platform_settings CASCADE;

-- Step 2: Create the table with correct structure
CREATE TABLE public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'platform-1',
    footer_logo_r2_key TEXT,
    footer_logo_r2_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Insert the default row
INSERT INTO public.platform_settings (id, footer_logo_r2_key, footer_logo_r2_url, created_at, updated_at)
VALUES ('platform-1', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Step 4: Verify the table structure
SELECT 
    '✅ Table Structure:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'platform_settings'
ORDER BY ordinal_position;

-- Step 5: Verify the row exists
SELECT 
    '✅ Row Data:' as info,
    id,
    footer_logo_r2_key,
    footer_logo_r2_url,
    created_at,
    updated_at
FROM public.platform_settings
WHERE id = 'platform-1';

-- Step 6: Test insert/update (should work)
UPDATE public.platform_settings 
SET footer_logo_r2_url = 'https://test.example.com/test.png',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'platform-1';

SELECT '✅ Update test successful' as status;

-- Reset for actual use
UPDATE public.platform_settings 
SET footer_logo_r2_url = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 'platform-1';

SELECT '✅ Table ready for use' as final_status;

