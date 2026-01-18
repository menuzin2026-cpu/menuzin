-- Migration: Add composite indexes for performance optimization
-- Run this in Supabase SQL Editor
-- Date: 2024

-- Add composite index on Section table for faster queries filtering by restaurantId and isActive
-- This optimizes queries like: WHERE restaurantId = ? AND isActive = true
CREATE INDEX IF NOT EXISTS "Section_restaurantId_isActive_idx" 
ON "Section" ("restaurantId", "isActive");

-- Add composite index on Category table for faster queries filtering by sectionId and isActive
-- This optimizes queries like: WHERE sectionId = ? AND isActive = true
CREATE INDEX IF NOT EXISTS "Category_sectionId_isActive_idx" 
ON "Category" ("sectionId", "isActive");

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename IN ('Section', 'Category')
    AND indexname LIKE '%isActive%'
ORDER BY tablename, indexname;
