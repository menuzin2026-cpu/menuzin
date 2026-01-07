# Cloudflare R2 Storage Deployment Guide

## Overview

This application has been migrated from storing media in PostgreSQL BYTEA to Cloudflare R2 object storage. All new uploads will use R2, while old media remains accessible via the existing `/assets/[id]` endpoint.

## Environment Variables

Add these to your Vercel project (or `.env.local` for local development):

```env
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_PUBLIC_BASE_URL=https://your-public-domain.r2.dev
```

### Getting R2 Credentials

1. Go to Cloudflare Dashboard → R2
2. Create a bucket (or use existing)
3. Go to "Manage R2 API Tokens"
4. Create API token with:
   - Permissions: Object Read & Write
   - Bucket: Your bucket name
5. Copy the credentials to environment variables

### Public URL Setup

1. In R2 bucket settings, enable "Public Access"
2. Set up a custom domain (optional) or use the default `*.r2.dev` domain
3. Update `R2_PUBLIC_BASE_URL` with your public domain

## Database Migration

### Local Development

```bash
# Install dependencies
pnpm install

# Run migration
pnpm prisma migrate dev --name add_r2_storage_fields

# Generate Prisma client
pnpm prisma generate
```

### Production (Vercel)

1. Push code to GitHub
2. Vercel will automatically run `pnpm prisma migrate deploy` during build
3. Or manually run in Vercel CLI:
   ```bash
   vercel env pull .env.local
   pnpm prisma migrate deploy
   ```

## Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] R2 bucket created and configured
- [ ] Public access enabled on R2 bucket
- [ ] Migration run successfully
- [ ] Test upload in admin panel
- [ ] Verify images load from R2 URLs
- [ ] Check fallback to old media IDs works

## Testing

1. **Test Upload Flow:**
   - Go to Admin Panel → Settings
   - Upload a new logo
   - Verify it uploads to R2
   - Check database has `logoR2Key` and `logoR2Url` populated

2. **Test Frontend Display:**
   - Visit welcome page
   - Verify logo displays from R2 URL
   - Check browser network tab for R2 domain

3. **Test Menu Items:**
   - Upload item image in Menu Builder
   - Verify image displays on menu page
   - Check lazy loading works

## Troubleshooting

### Upload Fails

- Check R2 credentials are correct
- Verify bucket name matches `R2_BUCKET_NAME`
- Check R2 endpoint URL format
- Ensure API token has write permissions

### Images Don't Display

- Verify `R2_PUBLIC_BASE_URL` is correct
- Check bucket has public access enabled
- Verify CORS settings on R2 bucket (if using custom domain)
- Check browser console for errors

### Migration Fails

- Ensure database connection is working
- Check Prisma schema is up to date
- Verify no conflicting migrations
- Check database user has ALTER TABLE permissions

## Rollback Plan

If you need to rollback:

1. Remove R2 environment variables
2. Revert code to previous commit
3. Old media will continue working via `/assets/[id]` endpoint
4. No data loss - R2 fields are nullable

## Support

For issues, check:
- Cloudflare R2 documentation
- Prisma migration docs
- Vercel deployment logs

