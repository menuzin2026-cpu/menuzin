-- ============================================
-- Check if Tables Exist in Supabase
-- Run this in Supabase SQL Editor to verify
-- ============================================

-- Check if platform_settings exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_settings') 
        THEN '✅ platform_settings table EXISTS'
        ELSE '❌ platform_settings table DOES NOT EXIST'
    END as platform_settings_status;

-- Check if admin_users exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') 
        THEN '✅ admin_users table EXISTS'
        ELSE '❌ admin_users table DOES NOT EXIST'
    END as admin_users_status;

-- Check if AdminUser (old camelCase) exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'AdminUser') 
        THEN '⚠️ AdminUser (old) table EXISTS - needs migration'
        ELSE '✅ AdminUser (old) table does not exist'
    END as adminuser_old_status;

-- Check if PlatformSettings (old PascalCase) exists
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'PlatformSettings') 
        THEN '⚠️ PlatformSettings (old) table EXISTS - needs migration'
        ELSE '✅ PlatformSettings (old) table does not exist'
    END as platformsettings_old_status;

-- List all columns in platform_settings (if exists)
SELECT 
    'platform_settings columns:' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'platform_settings'
ORDER BY ordinal_position;

-- List all columns in admin_users (if exists)
SELECT 
    'admin_users columns:' as info,
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

