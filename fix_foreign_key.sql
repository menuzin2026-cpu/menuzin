-- ============================================
-- Fix Missing Foreign Key Constraint
-- Run this if foreign key doesn't exist
-- ============================================

-- Check if foreign key exists
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'admin_users_restaurant_id_fkey';

-- If the above query returns no rows, create the foreign key:
DO $$
BEGIN
    -- Check if foreign key already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'admin_users_restaurant_id_fkey'
    ) THEN
        -- Verify the column exists first
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'admin_users' 
            AND column_name = 'restaurant_id'
        ) THEN
            -- Create the foreign key constraint
            ALTER TABLE "admin_users" 
            ADD CONSTRAINT "admin_users_restaurant_id_fkey" 
            FOREIGN KEY ("restaurant_id") 
            REFERENCES "Restaurant"("id") 
            ON DELETE CASCADE;
            
            RAISE NOTICE 'Foreign key constraint created successfully';
        ELSE
            RAISE NOTICE 'Column restaurant_id does not exist in admin_users table';
        END IF;
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Verify it was created
SELECT 
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'admin_users_restaurant_id_fkey';

