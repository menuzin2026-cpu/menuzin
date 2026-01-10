-- ============================================
-- Mark Pending Migrations as Applied
-- Run this AFTER running apply_pending_migrations.sql
-- This marks the migrations as applied in Prisma's migration history
-- ============================================

-- First, ensure the _prisma_migrations table exists
-- (It should already exist, but just in case)
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" VARCHAR(36) NOT NULL,
    "checksum" VARCHAR(64) NOT NULL,
    "finished_at" TIMESTAMP(3),
    "migration_name" VARCHAR(255) NOT NULL,
    "logs" TEXT,
    "rolled_back_at" TIMESTAMP(3),
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Mark 20260110000001_add_social_media_links as applied
-- (This checksum should match, but if not, you can get it from Prisma)
INSERT INTO "_prisma_migrations" (
    "id",
    "checksum",
    "migration_name",
    "started_at",
    "finished_at",
    "applied_steps_count"
)
VALUES (
    gen_random_uuid()::text,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- dummy checksum, Prisma will verify
    '20260110000001_add_social_media_links',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
)
ON CONFLICT DO NOTHING;

-- Mark 20260110000002_add_menu_features as applied
INSERT INTO "_prisma_migrations" (
    "id",
    "checksum",
    "migration_name",
    "started_at",
    "finished_at",
    "applied_steps_count"
)
VALUES (
    gen_random_uuid()::text,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', -- dummy checksum, Prisma will verify
    '20260110000002_add_menu_features',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
)
ON CONFLICT DO NOTHING;

-- Verify migrations are marked
SELECT 
    '✅ Applied Migrations:' as info,
    migration_name,
    finished_at
FROM "_prisma_migrations"
WHERE migration_name IN (
    '20260110000001_add_social_media_links',
    '20260110000002_add_menu_features'
)
ORDER BY finished_at;

