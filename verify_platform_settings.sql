-- ============================================
-- Verify platform_settings table exists and has correct structure
-- Run this in Supabase SQL Editor to check
-- ============================================

-- Check if table exists in public schema
SELECT 
    'Table Check' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'platform_settings'
        ) 
        THEN '✅ EXISTS'
        ELSE '❌ DOES NOT EXIST'
    END as status,
    'public.platform_settings' as expected_location;

-- List all tables that match 'platform_settings' (might be in different schema)
SELECT 
    'All platform_settings tables (any schema):' as info,
    table_schema,
    table_name,
    CASE 
        WHEN table_schema = 'public' AND table_name = 'platform_settings' 
        THEN '✅ This is the correct one'
        ELSE '⚠️ Different schema/name'
    END as status
FROM information_schema.tables 
WHERE table_name LIKE '%platform%settings%'
ORDER BY table_schema, table_name;

-- Check columns in public.platform_settings (if exists)
SELECT 
    'Columns in public.platform_settings:' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'platform_settings'
ORDER BY ordinal_position;

-- Check if the row exists
SELECT 
    'Row check:' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM public.platform_settings WHERE id = 'platform-1'
        )
        THEN '✅ Row with id="platform-1" EXISTS'
        ELSE '❌ Row with id="platform-1" DOES NOT EXIST'
    END as row_status;

-- Show current data (if table exists)
SELECT 
    'Current data:' as info,
    id,
    footer_logo_r2_key,
    footer_logo_r2_url,
    created_at,
    updated_at
FROM public.platform_settings
WHERE id = 'platform-1';

