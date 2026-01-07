# Cloudflare R2 CORS Configuration Guide

## Problem
Direct browser uploads to R2 are blocked by CORS policy. The browser needs permission to upload from your domain.

## Solution: Configure CORS on R2 Bucket

### Step 1: Access Cloudflare Dashboard
1. Go to https://dash.cloudflare.com
2. Navigate to **R2** → Your Bucket (`menu-assets` or similar)

### Step 2: Configure CORS
1. Click on your bucket
2. Go to **Settings** tab
3. Scroll to **CORS Policy** section
4. Click **Edit CORS Policy**

### Step 3: Add CORS Configuration
Paste this JSON configuration:

```json
[
  {
    "AllowedOrigins": [
      "https://menuzin.com",
      "https://*.vercel.app"
    ],
    "AllowedMethods": [
      "PUT",
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**Important Notes:**
- Replace `https://menuzin.com` with your actual production domain
- Add `https://*.vercel.app` to allow preview deployments
- `AllowedMethods` must include `PUT` for uploads and `OPTIONS` for preflight
- `AllowedHeaders: ["*"]` allows all headers (needed for presigned URLs)
- `MaxAgeSeconds: 3600` caches preflight for 1 hour

### Step 4: Save Configuration
1. Click **Save** or **Update**
2. Wait a few seconds for changes to propagate

### Step 5: Test
1. Try uploading an item image again
2. Check browser console - CORS error should be gone

## Alternative: If CORS Can't Be Configured

If you can't configure CORS on R2, we can proxy uploads through our API route instead of direct browser uploads. This is less efficient but works without CORS.

---

## Verification

After configuring CORS, test by:
1. Opening browser DevTools (F12)
2. Going to Network tab
3. Uploading an image
4. Check the PUT request to R2 - should succeed (200/204 status)

If you still see CORS errors, verify:
- CORS config is saved correctly
- Your domain matches exactly (including https://)
- Wait a few minutes for changes to propagate

