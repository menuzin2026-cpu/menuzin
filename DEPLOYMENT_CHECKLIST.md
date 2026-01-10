# Platform Settings Table - Deployment Checklist

## Current Issue
Prisma error P2021: Table `public.platform_settings` does not exist in the current database.

## Step 1: Check Debug Endpoint (VERY IMPORTANT)

After Vercel redeploys, call the debug endpoint to see what database Vercel is connected to:

```bash
curl "https://menuzin.com/api/debug/db-check?key=debug-2026"
```

Or visit in browser:
```
https://menuzin.com/api/debug/db-check?key=debug-2026
```

This will show:
- Which database Vercel is connected to
- If the `platform_settings` table exists
- What Prisma sees vs what you have in Supabase

## Step 2: Create Table in Supabase SQL Editor

Run this SQL in **Supabase SQL Editor** (in the database that matches your `DATABASE_URL`):

```sql
-- Create platform_settings table
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'platform-1',
    footer_logo_r2_key TEXT,
    footer_logo_r2_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default row
INSERT INTO public.platform_settings (id, footer_logo_r2_key, footer_logo_r2_url, created_at, updated_at)
VALUES ('platform-1', NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Verify table was created
SELECT 
    '✅ Table created:' as status,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'platform_settings'
ORDER BY ordinal_position;
```

## Step 3: Verify in Supabase

After running the SQL, verify the table exists:
```sql
SELECT * FROM public.platform_settings WHERE id = 'platform-1';
```

## Step 4: Check Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, verify:
- `DATABASE_URL` should point to: `aws-1-ap-northeast-2.pooler.supabase.com:6543`
- Make sure this matches the Supabase project you created the table in

## Step 5: Test Footer Logo Upload

After creating the table:
1. Go to `/super-admin`
2. Upload footer logo
3. Should succeed without P2021 error

## Troubleshooting

If the table exists in Supabase but Vercel still can't find it:
1. **Database mismatch**: Vercel `DATABASE_URL` might point to a different Supabase project
2. **Schema mismatch**: Table might be in a different schema (not `public`)
3. **Connection issue**: Prisma client might need regeneration

Use the debug endpoint to identify the exact issue.

