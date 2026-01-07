# Vercel Deployment Monitoring Guide

## 🔍 How to Monitor Your Deployment

### 1. Vercel Dashboard

Go to: **https://vercel.com/dashboard**

**Check:**
- Latest deployment status (Building → Ready/Failed)
- Build logs (click on deployment)
- Function logs (after deployment)

### 2. What to Look For in Build Logs

#### ✅ Success Indicators:

```
✓ Installing dependencies
✓ Running "prisma generate"
✓ Running "prisma migrate deploy"
  ✓ Applied migration: add_r2_storage_fields
✓ Running "next build"
✓ Build completed successfully
```

**R2 Configuration Logs:**
```
[R2 STARTUP] ✅ All R2 environment variables are set
[R2 CLIENT] Initialized successfully
[R2 CLIENT] Endpoint: https://...
[R2 CLIENT] Bucket: your-bucket-name
```

#### ❌ Error Indicators:

```
✗ Missing R2 environment variables: R2_ACCOUNT_ID, ...
[R2 STARTUP] ❌ Missing R2 environment variables
[R2 ERROR] R2 credentials not configured
Prisma migration failed
```

### 3. Post-Deployment Verification

#### Step 1: Check Verification Endpoint

```bash
curl https://your-app.vercel.app/api/r2/verify
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "R2 configuration is valid",
  "checks": {
    "env_R2_ACCOUNT_ID": true,
    "env_R2_ACCESS_KEY_ID": true,
    ...
    "r2_client_initialized": true,
    "presign_function_available": true
  }
}
```

#### Step 2: Check Vercel Function Logs

In Vercel Dashboard → Your Project → Functions → Logs

Look for:
- `[R2 PRESIGN] ✅ Successfully generated presigned URL` (when uploading)
- Any `[R2 ERROR]` messages

#### Step 3: Test Admin Upload

1. Go to: `https://your-app.vercel.app/{slug}/admin-portal/settings`
2. Upload a logo
3. Check Vercel function logs for:
   ```
   [R2 PRESIGN] Presign endpoint called
   [R2 PRESIGN] ✅ Successfully generated presigned URL
   [R2 PRESIGN] Key: restaurants/...
   ```

#### Step 4: Verify Public Pages

1. **Welcome Page:** `https://your-app.vercel.app/{slug}`
   - Check browser DevTools → Network tab
   - Look for requests to R2 domain (your R2_PUBLIC_BASE_URL)

2. **Menu Page:** `https://your-app.vercel.app/{slug}/menu`
   - Verify images load
   - Check network tab for R2 URLs

### 4. Common Issues & Solutions

#### Issue: Build Fails - Missing Environment Variables

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add all 6 R2 variables
3. Redeploy

#### Issue: Migration Fails

**Solution:**
1. Check DATABASE_URL is correct
2. Verify database is accessible from Vercel
3. Check build logs for specific Prisma error

#### Issue: R2 Upload Fails

**Solution:**
1. Check `/api/r2/verify` endpoint
2. Verify R2 credentials are correct
3. Check R2 bucket exists and has correct permissions
4. Verify R2_PUBLIC_BASE_URL is correct

### 5. Monitoring Checklist

- [ ] Build completes successfully
- [ ] No errors in build logs
- [ ] `/api/r2/verify` returns success
- [ ] Admin upload works
- [ ] Images display from R2 URLs
- [ ] Vercel function logs show R2 activity
- [ ] No `[R2 ERROR]` messages in logs

### 6. Quick Health Check Commands

```bash
# Check verification endpoint
curl https://your-app.vercel.app/api/r2/verify

# Check if app is live
curl -I https://your-app.vercel.app
```

---

**Note:** If you see any errors, check the Vercel build logs and function logs for detailed error messages.

