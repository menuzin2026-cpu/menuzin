# Cloudflare R2 Migration - Implementation Summary

## ✅ Completed Tasks

### 1. Prisma Schema Updates
- ✅ Added R2 key/URL fields to `Restaurant` model:
  - `logoR2Key`, `logoR2Url`
  - `footerLogoR2Key`, `footerLogoR2Url`
  - `welcomeBgR2Key`, `welcomeBgR2Url`
- ✅ Added R2 fields to `Category` model:
  - `imageR2Key`, `imageR2Url`
- ✅ Added R2 fields to `Item` model:
  - `imageR2Key`, `imageR2Url`

### 2. R2 Client & Presigned URL API
- ✅ Created `lib/r2-client.ts` with:
  - S3-compatible R2 client setup
  - Presigned URL generation
  - R2 key generation helper
  - Public URL generation
- ✅ Created `/api/r2/presign` endpoint:
  - Admin authentication required
  - Validates file types
  - Generates presigned URLs (1 hour expiry)
  - Returns upload URL, key, and public URL

### 3. Admin Panel Updates
- ✅ **Settings Page** (`app/[slug]/admin-portal/settings/page.tsx`):
  - Logo upload uses R2 presigned URLs
  - Footer logo upload uses R2 presigned URLs
  - Welcome background upload uses R2 presigned URLs
  - All uploads save R2 key/URL to database
- ✅ **Menu Builder** (`app/[slug]/admin-portal/menu-builder/page.tsx`):
  - Category image upload uses R2
  - Item image upload uses R2
  - Item creation/update flows updated
- ✅ **API Endpoints Updated**:
  - `/api/admin/settings` - Returns and accepts R2 fields
  - Category/Item PATCH endpoints accept R2 fields

### 4. Frontend Updates
- ✅ **Welcome Page**:
  - `welcome-logo.tsx` - Uses R2 URL with fallback
  - `welcome-background.tsx` - Uses R2 URL with fallback
- ✅ **Menu Page**:
  - Logo uses R2 URL with fallback
  - Footer logo uses R2 URL with fallback
- ✅ **Components Updated**:
  - `item-card.tsx` - R2 URL with fallback, lazy loading
  - `item-modal.tsx` - R2 URL with fallback
  - `category-row.tsx` - R2 URL with fallback
  - `search-drawer.tsx` - R2 URL with fallback
  - `basket-drawer.tsx` - R2 URL with fallback
- ✅ **Data Fetching**:
  - `lib/get-restaurant-data.ts` - Returns R2 fields
  - `app/data/restaurant/route.ts` - Returns R2 fields

### 5. Dependencies
- ✅ Added AWS SDK packages:
  - `@aws-sdk/client-s3`
  - `@aws-sdk/s3-request-presigner`

### 6. Documentation
- ✅ Created `DEPLOYMENT_R2.md` - Complete deployment guide
- ✅ Created `prisma/migrations/MIGRATION_R2_STORAGE.md` - Migration instructions
- ✅ Created `lib/get-image-url.ts` - Helper function (for future use)

## 🔄 Backward Compatibility

- ✅ Old media IDs preserved in database
- ✅ Frontend components use R2 URLs with automatic fallback to old `/assets/[id]` endpoint
- ✅ Old `/api/media/upload` endpoint still exists (for backward compatibility)
- ✅ Old `/api/media/[id]` endpoint still works for existing media

## 📋 Next Steps

### 1. Run Migration
```bash
pnpm install
pnpm prisma migrate dev --name add_r2_storage_fields
```

### 2. Set Environment Variables
Add all R2 environment variables to Vercel (see `DEPLOYMENT_R2.md`)

### 3. Test Upload Flow
1. Go to Admin Panel → Settings
2. Upload a new logo
3. Verify it uploads to R2
4. Check database has R2 fields populated
5. Verify image displays from R2 URL

### 4. Production Deployment
```bash
git add .
git commit -m "Migrate to Cloudflare R2 storage"
git push
```

Vercel will automatically:
- Install dependencies (including AWS SDK)
- Run Prisma migrations
- Deploy with new environment variables

## 🎯 Key Features

1. **Direct Uploads**: Files upload directly to R2 (no server processing)
2. **Presigned URLs**: Secure, time-limited upload URLs (1 hour)
3. **Automatic Fallback**: Old media continues working seamlessly
4. **Lazy Loading**: Item images use lazy loading for performance
5. **No Data Loss**: All existing media remains accessible

## 📝 Notes

- R2 key format: `restaurants/{restaurantId}/{scope}/{itemId?}-{timestamp}-{safeFileName}`
- Presigned URLs expire after 1 hour
- File size limits: 10MB images, 100MB videos (configurable)
- Allowed types: JPEG, PNG, WebP images; MP4 videos

## ⚠️ Important

- **Do not remove old Media model** - it's still used for backward compatibility
- **Do not remove `/api/media/[id]` endpoint** - old media needs it
- **Test thoroughly** before removing old upload endpoint

