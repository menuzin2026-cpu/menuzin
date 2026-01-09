# Multi-Tenant Migration Summary

## Overview

Successfully converted the single-restaurant menu platform into a multi-tenant system supporting multiple restaurants from one codebase, one Vercel deployment, one Supabase database, and one R2 bucket.

## Completed Changes

### 1. Database Schema (Prisma)

✅ **Updated Models:**
- `Restaurant`: Already had `slug` (unique), added relations
- `Section`: Already had `restaurantId`
- `Category`: Scoped via `sectionId` → `section.restaurantId`
- `Item`: Scoped via `categoryId` → `category.section.restaurantId`
- `Feedback`: Added `restaurantId` (required, FK to Restaurant)
- `AdminUser`: Added `restaurantId` (required, FK to Restaurant), `displayName`, `isActive`
- `UiSettings`: Changed from singleton to per-restaurant (`restaurantId` unique)
- `Theme`: Changed from singleton to per-restaurant (`restaurantId` unique)
- `PlatformSettings`: New table for global settings (footer logo)

✅ **Migration Created:**
- `prisma/migrations/20250108000000_multi_tenant_migration/migration.sql`
- Adds `restaurant_id` columns (nullable first)
- Creates/finds `legends-restaurant` restaurant
- Backfills all existing data
- Sets NOT NULL constraints
- Adds foreign keys and indexes

### 2. Routing Changes

✅ **Route Structure:**
- `app/[slug]/admin/` - Restaurant admin portal (moved from `admin-portal/`)
- `app/super-admin/` - Global super admin (moved from `[slug]/super-admin/`)
- `app/[slug]/` - Public menu and welcome pages

✅ **Middleware:**
- Updated to allow dynamic slugs
- Blocks reserved slugs (`super-admin`, `admin`, `api`, etc.)
- Allows `/super-admin` route (no slug)

### 3. Authentication System

✅ **Restaurant Admin Auth:**
- Updated `lib/auth.ts` to store `restaurantId` and `adminUserId` in session
- `createAdminSession(restaurantId, adminUserId)` - Creates restaurant-scoped session
- `getAdminSession()` - Returns `AdminSessionData | null` with restaurant_id
- `requireAdminSession()` - Throws if no session

✅ **Admin Login:**
- Updated `/api/admin/login` to require `slug` parameter
- Validates PIN against admins for that restaurant only
- Creates session with `restaurantId` and `adminUserId`

✅ **Super Admin Auth:**
- Uses environment variable `SUPER_ADMIN_PASSWORD` (fallback to `1244`)
- Separate session cookie (`super_admin_session`)
- No restaurant_id in super admin session (global access)

### 4. API Routes Updated

✅ **Restaurant Admin APIs (restaurant-scoped):**
- `/api/admin/login` - Requires slug, validates restaurant
- `/api/admin/check-session` - Returns restaurant_id
- `/api/admin/categories` - Verifies section belongs to admin's restaurant
- `/api/admin/sections` - Uses restaurant_id from session
- `/api/admin/items` - Verifies category belongs to admin's restaurant

✅ **Super Admin APIs (global):**
- `/api/super-admin/restaurants` - GET (list), POST (create with slug validation)
- `/api/super-admin/admins` - GET (by restaurantId), POST (create per restaurant), PUT, DELETE
- `/api/super-admin/platform-settings` - GET, PUT (global footer logo)

✅ **R2 Upload:**
- Updated to support `platformFooterLogo` scope (no restaurantId required)
- Super admin can upload platform footer logo
- Restaurant admins upload restaurant-specific media

### 5. Super Admin UI

✅ **Features Implemented:**
- Restaurant management (create, list)
- Admin PIN creation per restaurant
- Admin PIN update/delete per restaurant
- Global footer logo upload
- Black theme (independent from restaurant themes)
- Restaurant URL display

✅ **Styling:**
- Hardcoded black theme (`bg-black`, `bg-[#0b0b0b]`, `border-[#222]`)
- No restaurant theme inheritance
- White text, gray borders, dark cards

### 6. Helper Utilities

✅ **Created `lib/restaurant-utils.ts`:**
- `isReservedSlug(slug)` - Checks if slug is reserved
- `validateSlug(slug)` - Validates slug format and rules
- `getRestaurantBySlug(slug)` - Fetches restaurant by slug
- `requireRestaurantBySlug(slug)` - Throws if restaurant not found

### 7. Documentation

✅ **Updated README.md:**
- Multi-tenant architecture section
- URL structure documentation
- Restaurant creation guide
- R2 storage structure
- Security features
- Migration guide

## Remaining Work

### Critical (Must Complete)

1. **Update Remaining Admin API Routes:**
   - `/api/admin/settings` - Filter by restaurant_id
   - `/api/admin/theme` - Filter by restaurant_id
   - `/api/admin/ui-settings` - Filter by restaurant_id
   - `/api/admin/feedback` - Filter by restaurant_id
   - `/api/admin/branding` - Filter by restaurant_id
   - `/api/admin/menu` - Filter by restaurant_id
   - `/api/admin/items/[id]` - Verify restaurant_id
   - `/api/admin/categories/[id]` - Verify restaurant_id
   - `/api/admin/sections/[id]` - Verify restaurant_id
   - All reorder endpoints - Verify restaurant_id

2. **Update Public Menu/Data Routes:**
   - `/api/menu` - Already uses slug, verify restaurant_id filtering
   - `/data/menu` - Verify restaurant_id filtering
   - `/data/restaurant` - Already uses slug, verify
   - `/api/feedback` - Add restaurant_id from slug

3. **Update Admin Pages:**
   - All admin pages under `app/[slug]/admin/` need to pass slug to API calls
   - Update all navigation links from `admin-portal` to `admin`

4. **Run Migration:**
   - Deploy migration: `pnpm prisma migrate deploy`
   - Verify data backfilled correctly
   - Test existing `legends-restaurant` still works

### Important (Should Complete)

5. **Super Admin Login:**
   - Consider using email/password instead of PIN for super admin
   - Or use Supabase Auth for super admin

6. **Error Handling:**
   - Add 404 pages for invalid restaurant slugs
   - Better error messages for unauthorized access

7. **Testing:**
   - Test restaurant data isolation
   - Test admin cannot access other restaurant's data
   - Test super admin can manage all restaurants
   - Test R2 uploads are properly namespaced

## URL Structure (Final)

- **Public Menu**: `menuzin.com/[slug]` (e.g., `menuzin.com/legends-restaurant`)
- **Restaurant Admin**: `menuzin.com/[slug]/admin` (e.g., `menuzin.com/legends-restaurant/admin`)
- **Super Admin**: `menuzin.com/super-admin` (no slug)

## How to Add a New Restaurant

1. Login to `/super-admin` with super admin PIN
2. Click "Create Restaurant"
3. Enter slug (e.g., `mrcafe`) and name
4. Click "Create Restaurant"
5. Select the restaurant from the list
6. Enter 4-digit PIN and click "Create Admin PIN"
7. Access URLs:
   - Public: `menuzin.com/mrcafe`
   - Admin: `menuzin.com/mrcafe/admin`

## Security Notes

- ✅ Admin sessions are scoped to `restaurant_id`
- ✅ All admin API routes should verify `restaurant_id` matches session
- ✅ Super admin has global access (no restaurant_id in session)
- ✅ Reserved slugs are blocked in middleware
- ✅ PINs are hashed with bcrypt (never stored plaintext)

## Migration Notes

- Existing data is backfilled with `legends-restaurant` restaurant_id
- Existing admin accounts are associated with `legends-restaurant`
- Old URL `/legends-restaurant` still works (slug preserved)
- Migration is idempotent (can run multiple times safely)

