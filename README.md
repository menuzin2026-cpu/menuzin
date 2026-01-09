# Multi-Restaurant Menu Platform

A production-ready, multi-tenant QR restaurant menu platform built with Next.js 14, PostgreSQL (Supabase), Prisma, and Cloudflare R2. Supports multiple restaurants from a single codebase with complete data isolation.

## Features

- 🏢 **Multi-Restaurant Platform** - One codebase, multiple restaurants with complete data isolation
- 🎨 **Premium UI/UX** - Restaurant-specific theming with customizable colors
- 🌍 **Multi-language Support** - Kurdish, English, and Arabic
- 📱 **Mobile-first Design** - Optimized for QR code scanning
- 🖼️ **Cloudflare R2 Storage** - Scalable media storage for images and videos
- 🔐 **Restaurant Admin** - 4-digit PIN authentication per restaurant (bcrypt hashed)
- 👑 **Super Admin** - Global platform management with restaurant creation
- 🎨 **Customizable Branding** - Full color customization per restaurant
- 📊 **Menu Builder** - Unified accordion interface for managing menu items
- 💬 **Feedback System** - Customer feedback with star ratings and emojis
- 🔍 **Search Functionality** - Real-time search across all menu items
- 🛒 **Basket View** - View-only basket (no ordering/payments)

## Tech Stack

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Media Storage**: Cloudflare R2 (S3-compatible)
- **Authentication**: bcryptjs (4-digit PIN per restaurant)
- **UI Components**: Radix UI, Lucide Icons
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database

## Local Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_menu?schema=public"
   ```

3. **Run database migrations**
   ```bash
   pnpm prisma migrate dev
   ```

4. **Seed the database**
   ```bash
   pnpm prisma db seed
   ```
   
   This will create:
   - 1 admin user with PIN: **1234** (change after first login!)
   - 1 sample restaurant
   - Sample sections, categories, and items

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Start development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   - Public menu: http://localhost:3000/legends-restaurant
   - Restaurant admin: http://localhost:3000/legends-restaurant/admin
   - Super admin: http://localhost:3000/super-admin
   - Default super admin PIN: `1244` (or set `SUPER_ADMIN_PASSWORD` env var)

## Multi-Restaurant Architecture

### URL Structure

- **Public Menu**: `menuzin.com/[slug]` (e.g., `menuzin.com/legends-restaurant`)
- **Restaurant Admin**: `menuzin.com/[slug]/admin` (e.g., `menuzin.com/legends-restaurant/admin`)
- **Super Admin**: `menuzin.com/super-admin` (global, no slug)

### Data Isolation

- All restaurant-specific data is isolated by `restaurant_id`
- Admin sessions are scoped to `restaurant_id`
- Admins can only access their own restaurant's data
- Super admin has global access for platform management

### Creating a New Restaurant

1. **Login to Super Admin** (`/super-admin`)
   - Use super admin PIN (default: `1244` or `SUPER_ADMIN_PASSWORD` env var)

2. **Create Restaurant**
   - Enter slug (URL identifier): e.g., `mrcafe`
   - Enter restaurant name (English required, Kurdish/Arabic optional)
   - Slug must be: lowercase, numbers, hyphens only; cannot be reserved words

3. **Create Admin PIN**
   - Select the restaurant
   - Enter 4-digit PIN
   - Admin can login at: `menuzin.com/[slug]/admin`

4. **Access URLs**
   - Public menu: `menuzin.com/[slug]`
   - Admin portal: `menuzin.com/[slug]/admin`

### Reserved Slugs

The following slugs cannot be used as restaurant slugs:
- `super-admin`, `admin`, `api`, `auth`, `login`
- `favicon.ico`, `robots.txt`, `sitemap.xml`
- `assets`, `data`, `_next`

## Project Structure

```
├── app/
│   ├── [slug]/          # Restaurant-specific routes
│   │   ├── admin/       # Restaurant admin portal
│   │   ├── menu/        # Public menu page
│   │   └── page.tsx     # Welcome page
│   ├── super-admin/     # Global super admin (no slug)
│   ├── api/
│   │   ├── admin/       # Restaurant admin API (restaurant-scoped)
│   │   ├── super-admin/ # Super admin API (global)
│   │   └── r2/          # R2 upload endpoints
│   └── ...
├── lib/
│   ├── auth.ts          # Authentication (restaurant-scoped sessions)
│   ├── restaurant-utils.ts # Slug validation, restaurant helpers
│   └── r2-client.ts     # Cloudflare R2 client
├── prisma/
│   ├── schema.prisma    # Multi-tenant database schema
│   └── migrations/      # Database migrations
└── ...
```

## Database Schema

### Multi-Tenant Tables

All restaurant-specific tables include `restaurant_id`:

- **Restaurant** - Restaurant information, branding, slug (unique)
- **Section** - Menu sections (scoped to restaurant)
- **Category** - Categories within sections (scoped via section)
- **Item** - Menu items with translations (scoped via category)
- **Feedback** - Customer feedback (scoped to restaurant)
- **AdminUser** - Admin authentication (scoped to restaurant, PIN hashed with bcrypt)
- **UiSettings** - UI typography settings (one per restaurant)
- **Theme** - Theme colors (one per restaurant)

### Global Tables

- **PlatformSettings** - Global platform settings (footer logo, etc.)
- **Media** - Legacy table (images now stored in R2)

### R2 Storage Structure

Media is stored in Cloudflare R2 with restaurant-scoped keys:
- Restaurant logos: `restaurants/{restaurant_id}/logo/{timestamp}-{filename}`
- Item images: `restaurants/{restaurant_id}/itemImage/{item_id}-{timestamp}-{filename}`
- Category images: `restaurants/{restaurant_id}/categoryImage/{timestamp}-{filename}`
- Welcome backgrounds: `restaurants/{restaurant_id}/welcomeBg/{timestamp}-{filename}`
- Global footer logo: `platform/footer/{timestamp}-{filename}`

## Admin Features

### Restaurant Admin (`/[slug]/admin`)

Each restaurant has its own admin portal with 4-digit PIN authentication.

#### Menu Builder (`/[slug]/admin/menu-builder`)
- Unified accordion interface
- Add/edit sections, categories, and items
- Upload images to R2
- Toggle active/inactive status
- Drag-and-drop sorting

#### Branding (`/[slug]/admin/branding`)
- Customize all UI colors per restaurant
- Preview changes in real-time
- Reset to defaults

#### Settings (`/[slug]/admin/settings`)
- Restaurant name (3 languages)
- Contact information
- Welcome page overlay settings
- Logo and welcome background uploads

#### Feedback (`/[slug]/admin/feedback`)
- View customer feedback for this restaurant only
- Filter by ratings

### Super Admin (`/super-admin`)

Global platform management (black theme, independent from restaurant themes).

#### Restaurant Management
- Create new restaurants with unique slugs
- View all restaurants
- Generate restaurant URLs

#### Admin PIN Management
- Create 4-digit PIN for any restaurant
- Update admin PINs
- Delete admin accounts (per restaurant)

#### Global Footer Logo
- Upload platform-wide footer logo
- Stored in `platform/footer/` R2 path
- Shown on all restaurant menus (if footer exists)

## Media Storage (Cloudflare R2)

All media is stored in Cloudflare R2 (S3-compatible):
- **Images**: Max 5MB (JPEG, PNG, WebP)
- **Videos**: Max 20MB (MP4 for welcome backgrounds)
- **Access**: Direct public URLs from R2
- **Structure**: Restaurant-scoped paths for isolation
- **Global**: Platform footer logo stored separately

### Environment Variables Required

```env
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_BASE_URL=https://your-public-domain.com
```

## Security

- ✅ **bcrypt PIN hashing** - All admin PINs are hashed (never stored plaintext)
- ✅ **Restaurant-scoped sessions** - Admin sessions include `restaurant_id`, preventing cross-restaurant access
- ✅ **Rate limiting** - Login attempts are rate-limited (5 attempts per 15 minutes)
- ✅ **Secure session management** - HTTP-only cookies, secure in production
- ✅ **Zod validation** - All inputs validated with Zod schemas
- ✅ **Protected routes** - Admin and super admin routes require authentication
- ✅ **Data isolation** - All queries filtered by `restaurant_id` from session
- ✅ **Slug validation** - Reserved slugs cannot be used as restaurant identifiers

## Multi-language Support

- **Kurdish (ku)** - کوردی
- **English (en)** - English
- **Arabic (ar)** - العربية

Language preference is saved in localStorage and persists across sessions.

## Deployment

1. Set up PostgreSQL database (e.g., Supabase, Railway, Neon)
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `pnpm prisma migrate deploy`
4. Seed database: `pnpm prisma db seed`
5. Build: `pnpm build`
6. Start: `pnpm start`

## Important Notes

- ⚠️ **Super Admin PIN**: Default `1244` - Set `SUPER_ADMIN_PASSWORD` env var for production
- 🔐 **Restaurant Admin PINs**: Created per restaurant in super admin portal
- 📸 **Media Storage**: All media stored in Cloudflare R2 (not database)
- 🚫 **No Ordering**: This is a view-only menu system
- 🎨 **Theming**: Each restaurant has independent theme; super admin uses black theme
- 📱 **Mobile-first**: Optimized for QR code scanning
- 🏢 **Multi-tenant**: Complete data isolation per restaurant

## Migration from Single-Restaurant

If upgrading from single-restaurant setup:

1. **Run migration**: `pnpm prisma migrate deploy`
   - Adds `restaurant_id` to all tables
   - Creates `PlatformSettings` table
   - Backfills existing data with `legends-restaurant` restaurant

2. **Update admin accounts**: Existing admin PINs are associated with `legends-restaurant`

3. **Verify**: Check that `/legends-restaurant` still works with existing data

## Deployment Checklist

- [ ] Set `SUPER_ADMIN_PASSWORD` environment variable
- [ ] Configure R2 credentials (`R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_BASE_URL`)
- [ ] Run database migrations: `pnpm prisma migrate deploy`
- [ ] Verify restaurant with slug `legends-restaurant` exists
- [ ] Test super admin login at `/super-admin`
- [ ] Create test restaurant and verify data isolation

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.




