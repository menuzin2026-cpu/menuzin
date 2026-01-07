# Migration: Cloudflare R2 Storage

This migration adds R2 storage fields to the database schema for all media types.

## Prerequisites

1. Ensure all environment variables are set:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`
   - `R2_ENDPOINT`
   - `R2_PUBLIC_BASE_URL`

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Migration Steps

### 1. Generate Migration

```bash
pnpm prisma migrate dev --name add_r2_storage_fields
```

This will:
- Create a new migration file in `prisma/migrations/`
- Add R2 key/URL fields to Restaurant, Category, and Item models
- Apply the migration to your database

### 2. Verify Migration

```bash
pnpm prisma studio
```

Check that the new fields exist:
- `Restaurant`: `logoR2Key`, `logoR2Url`, `footerLogoR2Key`, `footerLogoR2Url`, `welcomeBgR2Key`, `welcomeBgR2Url`
- `Category`: `imageR2Key`, `imageR2Url`
- `Item`: `imageR2Key`, `imageR2Url`

### 3. Production Deployment

For production, run:

```bash
pnpm prisma migrate deploy
```

## Rollback (if needed)

If you need to rollback, you can manually remove the R2 fields from the schema and create a new migration:

```bash
pnpm prisma migrate dev --name remove_r2_storage_fields
```

## Notes

- Old media IDs are preserved for backward compatibility
- Frontend components use R2 URLs with fallback to old media IDs
- No data migration is needed - new uploads will use R2, old media remains accessible

