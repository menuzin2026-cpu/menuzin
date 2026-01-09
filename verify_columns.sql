-- ============================================
-- Verify Column Structure Matches Prisma Schema
-- Run this to ensure columns are correctly named
-- ============================================

-- Check platform_settings columns
SELECT 
    'platform_settings' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'platform_settings'
ORDER BY ordinal_position;

-- Check admin_users columns
SELECT 
    'admin_users' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'admin_users'
ORDER BY ordinal_position;

-- Verify foreign key exists
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table
FROM pg_constraint
WHERE conname = 'admin_users_restaurant_id_fkey';

-- Check if indexes exist
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes
WHERE tablename IN ('admin_users', 'platform_settings')
ORDER BY tablename, indexname;

