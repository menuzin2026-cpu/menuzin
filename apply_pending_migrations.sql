-- ============================================
-- Apply Pending Migrations Manually
-- Run this in Supabase SQL Editor
-- This combines both pending migrations:
-- - 20260110000001_add_social_media_links
-- - 20260110000002_add_menu_features
-- ============================================

-- Migration 1: Add social media links to Restaurant table
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "snapchatUrl" TEXT;
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT;

-- Migration 2: Add menu features to Theme table
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "menu_background_r2_key" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "menu_background_r2_url" TEXT;

-- Migration 2: Add new color fields to Theme
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "item_name_text_color" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "item_price_text_color" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "item_description_text_color" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "bottom_nav_section_name_color" TEXT;
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "category_name_color" TEXT;

-- Migration 2: Add service charge percentage to Restaurant
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "service_charge_percent" DOUBLE PRECISION DEFAULT 0;

-- Verify columns were added
SELECT 
    '✅ Restaurant table social media columns:' as info,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Restaurant'
AND column_name IN ('instagramUrl', 'snapchatUrl', 'tiktokUrl', 'service_charge_percent')
ORDER BY column_name;

SELECT 
    '✅ Theme table menu feature columns:' as info,
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Theme'
AND column_name IN (
    'menu_background_r2_key', 
    'menu_background_r2_url',
    'item_name_text_color',
    'item_price_text_color',
    'item_description_text_color',
    'bottom_nav_section_name_color',
    'category_name_color'
)
ORDER BY column_name;

