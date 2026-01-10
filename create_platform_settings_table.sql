-- ============================================
-- Create platform_settings table
-- Run this in Supabase SQL Editor
-- ============================================

-- First, check if table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'platform_settings'
        ) 
        THEN '✅ platform_settings table EXISTS in public schema'
        ELSE '❌ platform_settings table DOES NOT EXIST in public schema'
    END as table_status;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'platform-1',
    footer_logo_r2_key TEXT,
    footer_logo_r2_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Verify the table was created
SELECT 
    'platform_settings columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'platform_settings'
ORDER BY ordinal_position;

-- Insert the default row if it doesn't exist
INSERT INTO public.platform_settings (id, footer_logo_r2_key, footer_logo_r2_url, created_at, updated_at)
VALUES ('platform-1', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Verify the row exists
SELECT 
    'platform_settings row:' as info,
    id,
    footer_logo_r2_key,
    footer_logo_r2_url,
    created_at,
    updated_at
FROM public.platform_settings
WHERE id = 'platform-1';

