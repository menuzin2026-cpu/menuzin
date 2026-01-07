# Database Connection Pool Exhaustion Fix

## Problem
Error: `MaxClientsInSessionMode: max clients reached - in Session mode max clients are limited to pool_size`

This happens when using Supabase **Session Mode** (port 5432) which has a limited connection pool size. In serverless environments like Vercel, multiple function invocations can exhaust the pool.

## Solution: Use Transaction Mode (Port 6543)

### Step 1: Update Vercel Environment Variable

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Find `DATABASE_URL` and update it:

**Before (Session Mode - Limited Pool):**
```
postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:5432/postgres?pgbouncer=true
```

**After (Transaction Mode - Better Pooling):**
```
postgresql://postgres.xxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### Key Changes:
1. **Port**: Change from `5432` to `6543` (Transaction Mode)
2. **Keep**: `pgbouncer=true` (required for Transaction Mode)
3. **Add**: `connection_limit=1` (prevents pool exhaustion)

### Step 2: Get Transaction Mode Connection String from Supabase

1. Go to Supabase Dashboard → Your Project → Settings → Database
2. Scroll to **Connection Pooling**
3. Copy the **Transaction Mode** connection string (port 6543)
4. Update `DATABASE_URL` in Vercel with this connection string

### Step 3: Redeploy

After updating the environment variable:
- Vercel will automatically redeploy
- Or trigger a redeploy manually

## Why Transaction Mode?

- ✅ **Better Connection Pooling**: Handles more concurrent connections
- ✅ **Serverless-Friendly**: Designed for serverless environments
- ✅ **No Pool Exhaustion**: Better at managing connection limits
- ⚠️ **Limitation**: Doesn't support prepared statements (Prisma handles this automatically)

## Verification

After updating, check Vercel logs:
- Should see: `[PRISMA] ✅ Converted to Transaction Mode (port 6543)`
- No more "max clients reached" errors
- Faster response times

## Alternative: Direct Connection (Not Recommended)

If Transaction Mode doesn't work, you can use a direct connection (bypasses pooler):
- Port: `5432` (direct)
- Remove `pgbouncer=true`
- **Warning**: This can cause connection issues in serverless environments

---

**Note**: The code now automatically converts Session Mode to Transaction Mode, but it's better to update the environment variable directly.

