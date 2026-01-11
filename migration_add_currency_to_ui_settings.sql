-- Migration: Add currency field to UiSettings table
-- Run this in Supabase SQL Editor

-- Add currency column with default value 'IQD'
ALTER TABLE "UiSettings" 
ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'IQD';

-- Update any existing rows that might have NULL (shouldn't happen with DEFAULT, but just in case)
UPDATE "UiSettings" 
SET "currency" = 'IQD' 
WHERE "currency" IS NULL;

-- Add a comment to document the field
COMMENT ON COLUMN "UiSettings"."currency" IS 'Currency code for price display (IQD or USD)';
