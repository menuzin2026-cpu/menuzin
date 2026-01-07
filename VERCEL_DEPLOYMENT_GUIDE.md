# Vercel Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables (Set in Vercel Dashboard)

Go to your Vercel project → Settings → Environment Variables and add:

```
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_BASE_URL=https://your-public-domain.r2.dev
DATABASE_URL=your_postgresql_connection_string
```

**Important:** 
- Set these for **Production**, **Preview**, and **Development** environments
- R2 credentials are server-side only (never exposed to client)

### 2. Database Migration

The build script automatically runs `prisma migrate deploy` during build.

**First-time deployment:**
- Ensure your database is accessible from Vercel
- The migration will run automatically during build
- Check Vercel build logs for migration status

## Deployment Process

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Production-ready: Cloudflare R2 integration with Vercel build"
git push origin main
```

### Step 2: Vercel Auto-Deploy

Vercel will automatically:
1. Install dependencies (`pnpm install`)
2. Generate Prisma client (`prisma generate`)
3. Run migrations (`prisma migrate deploy`)
4. Build Next.js app (`next build`)
5. Deploy to production

**Build Command (runs automatically):**
```bash
prisma generate && prisma migrate deploy && next build
```

### Step 3: Verify Deployment

After deployment, check:

1. **Vercel Build Logs:**
   - Look for `[R2 STARTUP] ✅ All R2 environment variables are set`
   - Look for `[R2 CLIENT] Initialized successfully`
   - Check for any migration errors

2. **Verification Endpoint:**
   ```
   GET https://your-app.vercel.app/api/r2/verify
   ```
   Should return:
   ```json
   {
     "status": "success",
     "message": "R2 configuration is valid",
     "checks": { ... }
   }
   ```

3. **Test Upload:**
   - Go to Admin Panel
   - Try uploading a logo/image
   - Check Vercel function logs for `[R2 PRESIGN] ✅ Successfully generated presigned URL`

## Post-Deployment Testing

### Admin Panel URLs

1. **Settings Page:**
   ```
   https://your-app.vercel.app/{slug}/admin-portal/settings
   ```
   - Test logo upload
   - Test footer logo upload
   - Test welcome background upload

2. **Menu Builder:**
   ```
   https://your-app.vercel.app/{slug}/admin-portal/menu-builder
   ```
   - Test item image upload
   - Test category image upload

### Public Menu URLs

1. **Welcome Page:**
   ```
   https://your-app.vercel.app/{slug}
   ```
   - Verify logo displays from R2
   - Verify background displays from R2

2. **Menu Page:**
   ```
   https://your-app.vercel.app/{slug}/menu
   ```
   - Verify item images load from R2
   - Check browser network tab for R2 domain

## Troubleshooting

### Build Fails

**Error: "Missing R2 environment variables"**
- Check Vercel environment variables are set
- Ensure they're set for the correct environment (Production/Preview)

**Error: "Prisma migration failed"**
- Check DATABASE_URL is correct
- Verify database is accessible from Vercel
- Check Vercel build logs for specific error

### Upload Fails

**Error: "Failed to generate presigned URL"**
- Check Vercel function logs
- Verify R2 credentials are correct
- Check R2 bucket exists and is accessible

**Error: "R2 client cannot be used in client-side code"**
- This should never happen - indicates code issue
- Check that R2 functions are only called from API routes

### Images Don't Display

**Check:**
1. R2_PUBLIC_BASE_URL is correct
2. R2 bucket has public access enabled
3. Browser console for CORS errors
4. Network tab shows R2 domain requests

## Monitoring

### Vercel Logs

Monitor these log patterns:

**Success:**
- `[R2 STARTUP] ✅ All R2 environment variables are set`
- `[R2 CLIENT] Initialized successfully`
- `[R2 PRESIGN] ✅ Successfully generated presigned URL`

**Errors:**
- `[R2 STARTUP] ❌ Missing R2 environment variables`
- `[R2 PRESIGN] ❌ Error generating presigned URL`
- `[R2 ERROR] R2 credentials not configured`

## Rollback Plan

If deployment fails:

1. **Revert Git commit:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Old media still works:**
   - Existing media uses `/assets/[id]` endpoint
   - No data loss
   - Frontend automatically falls back

3. **Fix and redeploy:**
   - Fix issues
   - Push again
   - Vercel will redeploy automatically

## Support

- Check Vercel deployment logs
- Check Vercel function logs
- Verify R2 bucket configuration
- Test `/api/r2/verify` endpoint

