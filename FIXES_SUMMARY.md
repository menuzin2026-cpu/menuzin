# Fixes Summary - Prisma P2021 Errors and Admin Routes

## ✅ Completed Fixes

### 1. Database Schema Updates

**Updated Prisma Schema (`prisma/schema.prisma`):**
- ✅ `PlatformSettings` model now maps to `platform_settings` table with snake_case columns
- ✅ `AdminUser` model now maps to `admin_users` table with snake_case columns
- ✅ All field mappings use `@map()` directives for snake_case database columns

### 2. SQL Migration Script

**Created `create_tables.sql`:**
- ✅ Creates `platform_settings` table if it doesn't exist
- ✅ Creates `admin_users` table if it doesn't exist
- ✅ Migrates data from old `AdminUser`/`PlatformSettings` tables if they exist
- ✅ Sets up foreign keys and indexes
- ✅ Backfills `restaurant_id` for existing admin users

**To Apply:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `create_tables.sql`
3. Paste and run in SQL Editor

### 3. Admin Route Structure

**Created `app/[slug]/admin/` routes:**
- ✅ `/app/[slug]/admin/page.tsx` - Admin dashboard
- ✅ `/app/[slug]/admin/login/page.tsx` - Admin login
- ✅ `/app/[slug]/admin/menu-builder/page.tsx` - Menu builder
- ✅ `/app/[slug]/admin/settings/page.tsx` - Settings
- ✅ `/app/[slug]/admin/theme/page.tsx` - Theme customization
- ✅ `/app/[slug]/admin/typography/page.tsx` - Typography settings
- ✅ `/app/[slug]/admin/branding/page.tsx` - Branding
- ✅ `/app/[slug]/admin/feedback/page.tsx` - Feedback management

**Middleware Updates:**
- ✅ Added redirect from `/admin-portal` to `/admin` for backward compatibility

### 4. Prisma Client Regenerated

- ✅ Ran `npx prisma generate` to update Prisma client with new mappings

---

## 📍 Final URLs

### Super Admin (Global)
- **Login**: `menuzin.com/super-admin/login`
- **Dashboard**: `menuzin.com/super-admin`

### Restaurant URLs (Example: `legends-restaurant`)
- **Public Welcome**: `menuzin.com/legends-restaurant`
- **Public Menu**: `menuzin.com/legends-restaurant/menu`
- **Feedback**: `menuzin.com/legends-restaurant/feedback`
- **Admin Login**: `menuzin.com/legends-restaurant/admin/login`
- **Admin Dashboard**: `menuzin.com/legends-restaurant/admin`
- **Menu Builder**: `menuzin.com/legends-restaurant/admin/menu-builder`
- **Settings**: `menuzin.com/legends-restaurant/admin/settings`
- **Theme**: `menuzin.com/legends-restaurant/admin/theme`
- **Typography**: `menuzin.com/legends-restaurant/admin/typography`
- **Branding**: `menuzin.com/legends-restaurant/admin/branding`
- **Feedback Management**: `menuzin.com/legends-restaurant/admin/feedback`

### For New Restaurants (Example: `mrcafe`)
- **Public Menu**: `menuzin.com/mrcafe`
- **Admin Login**: `menuzin.com/mrcafe/admin/login`
- **Admin Dashboard**: `menuzin.com/mrcafe/admin`

---

## 🚀 How to Add a New Restaurant and Create Admin PIN

### Step 1: Create Restaurant (Super Admin)
1. Go to `menuzin.com/super-admin`
2. Login with super admin credentials
3. In "Create Restaurant" section:
   - Enter **Slug**: `mrcafe` (lowercase, numbers, hyphens only)
   - Enter **Name (English)**: `MR Cafe`
   - Enter **Name (Kurdish)**: (optional)
   - Enter **Name (Arabic)**: (optional)
4. Click **"Create Restaurant"**
5. Restaurant URLs will be displayed:
   - Public: `menuzin.com/mrcafe`
   - Admin: `menuzin.com/mrcafe/admin`

### Step 2: Create Admin PIN (Super Admin)
1. In Super Admin dashboard, select the restaurant from the list
2. In "Create Admin PIN for Restaurant" section:
   - Enter **4-Digit PIN**: `1234` (or any 4 digits)
3. Click **"Create Admin PIN"**
4. Admin can now login at `menuzin.com/mrcafe/admin` with this PIN

### Step 3: Restaurant Admin Login
1. Go to `menuzin.com/mrcafe/admin/login`
2. Enter the 4-digit PIN created in Step 2
3. Click **"Login"**
4. You'll be redirected to `menuzin.com/mrcafe/admin` dashboard

### Step 4: Add Menu Data (Restaurant Admin)
1. In admin dashboard, go to **"Menu Builder"**
2. Create sections, categories, and items
3. All data is automatically scoped to this restaurant

---

## 🔧 Database Tables Structure

### `platform_settings` (Global)
- `id` (TEXT, PK, default: 'platform-1')
- `footer_logo_r2_key` (TEXT, nullable)
- `footer_logo_r2_url` (TEXT, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `admin_users` (Per Restaurant)
- `id` (TEXT, PK, cuid())
- `restaurant_id` (TEXT, FK → restaurants.id, NOT NULL)
- `pin_hash` (TEXT, NOT NULL, bcrypt hashed)
- `display_name` (TEXT, nullable)
- `is_active` (BOOLEAN, default: true)
- `last_login_at` (TIMESTAMP, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes:**
- `admin_users_restaurant_id_idx` on `restaurant_id`
- `admin_users_restaurant_id_is_active_idx` on `(restaurant_id, is_active)`

### `restaurants` (Must Already Exist)
- Contains all restaurant data
- `id` (TEXT, PK)
- `slug` (TEXT, UNIQUE)

---

## ⚠️ Important Notes

1. **Run SQL Script First**: Before deploying, run `create_tables.sql` in Supabase SQL Editor to create/update tables
2. **Backward Compatibility**: Old `/admin-portal` URLs will automatically redirect to `/admin`
3. **Data Isolation**: All admin operations are scoped to `restaurant_id` - admins can only access their own restaurant's data
4. **Global Footer Logo**: Uploaded in Super Admin, appears on all restaurant menus globally

---

## 🐛 Troubleshooting

### If you still see P2021 errors:
1. Verify tables exist: Run `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('platform_settings', 'admin_users');`
2. Check column names: Run `SELECT column_name FROM information_schema.columns WHERE table_name = 'admin_users';`
3. Re-run `create_tables.sql` if tables don't exist

### If admin route returns 404:
1. Verify `app/[slug]/admin/page.tsx` exists
2. Check middleware allows `/admin` routes
3. Ensure slug is not reserved (check `lib/restaurant-utils.ts`)

### If admin creation fails:
1. Verify `admin_users` table exists with correct columns
2. Check `restaurant_id` foreign key constraint exists
3. Ensure restaurant exists before creating admin

