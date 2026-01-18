# Local Development Guide

## Quick Start - Run Project Locally

### Step 1: Check Environment Variables

First, make sure you have a `.env` file with your database connection:

```bash
# Check if .env exists
ls .env

# If it doesn't exist, copy from template
cp env.template .env
```

Then edit `.env` and make sure you have:
```env
DATABASE_URL="your-postgresql-connection-string"
# Add other required env vars (R2, etc.) if needed
```

### Step 2: Install Dependencies (if not already done)

```bash
pnpm install
```

### Step 3: Generate Prisma Client

```bash
pnpm prisma generate
```

### Step 4: Start Development Server

```bash
pnpm dev
```

The server will start at: **http://localhost:3000**

### Step 5: Access Your Menu

Open in browser:
- **Menu Page**: http://localhost:3000/[your-slug]/menu
  - Example: http://localhost:3000/legends-restaurant/menu
- **Admin Panel**: http://localhost:3000/[your-slug]/admin
  - Example: http://localhost:3000/legends-restaurant/admin

---

## Testing Workflow

### 1. Make Changes Locally

Edit files in your code editor:
- `app/[slug]/menu/page.tsx` - Menu page
- `components/item-card.tsx` - Item cards
- `app/api/[slug]/public/menu-bootstrap/route.ts` - API endpoints
- Any other files you want to modify

### 2. See Changes Instantly

Next.js has **Hot Module Replacement (HMR)**:
- Save your file
- Changes appear automatically in browser (no refresh needed!)
- If you see errors, check the terminal and browser console

### 3. Test Different Scenarios

**Test Menu Page:**
- Open: http://localhost:3000/[slug]/menu
- Check:
  - Background image displays correctly
  - Item cards show properly (no description on cards)
  - Click items to see modal with description
  - Category navigation works
  - Basket functionality works
  - Search works
  - Language switching works

**Test Admin Panel:**
- Open: http://localhost:3000/[slug]/admin
- Check:
  - Theme settings (background image upload)
  - Menu builder
  - All admin features work

### 4. Check Console for Errors

- **Browser Console**: Press `F12` → Console tab
- **Terminal**: Check the terminal where `pnpm dev` is running
- Fix any errors before pushing

### 5. Test on Mobile View

In browser:
- Press `F12` → Toggle device toolbar (or `Ctrl+Shift+M`)
- Test different screen sizes (iPhone, iPad, etc.)
- Check:
  - Background image looks good
  - Items display correctly
  - Navigation works
  - No horizontal scrolling

---

## Common Commands

```bash
# Start development server
pnpm dev

# Build for production (test build locally)
pnpm build

# Start production server (after build)
pnpm start

# Check for linting errors
pnpm lint

# Open Prisma Studio (database GUI)
pnpm db:studio

# Run database migrations
pnpm db:migrate
```

---

## When Everything Looks Good

### 1. Check Git Status

```bash
git status
```

See what files you've changed.

### 2. Test Build Locally (Optional but Recommended)

```bash
pnpm build
```

This will:
- Check for TypeScript errors
- Check for build errors
- Verify everything compiles correctly

If build succeeds, you're ready to push!

### 3. Commit and Push

```bash
# Add your changes
git add .

# Commit with descriptive message
git commit -m "Your descriptive message here"

# Push to GitHub (triggers Vercel deployment)
git push origin main
```

---

## Troubleshooting

### Port 3000 Already in Use

If you see "Port 3000 is already in use":
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
pnpm dev -- -p 3001
```

### Database Connection Error

- Check your `.env` file has correct `DATABASE_URL`
- Make sure your database is running
- Verify connection string format

### Prisma Client Not Generated

```bash
pnpm prisma generate
```

### Changes Not Showing

- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Restart dev server: `Ctrl+C` then `pnpm dev` again

---

## Recommended Testing Checklist

Before pushing, make sure:

- [ ] Menu page loads without errors
- [ ] Background image displays correctly (not zoomed, fits well)
- [ ] Item cards show name and price (no description)
- [ ] Clicking item shows modal with full description
- [ ] Category navigation works
- [ ] Basket adds/removes items correctly
- [ ] Search functionality works
- [ ] Language switching works
- [ ] Mobile view looks good (test different screen sizes)
- [ ] No console errors
- [ ] Build succeeds (`pnpm build`)

---

## Tips

1. **Keep Dev Server Running**: Leave `pnpm dev` running while you code
2. **Use Browser DevTools**: Check console for errors, inspect elements
3. **Test on Real Device**: Use your phone to test the actual menu experience
4. **Commit Often**: Commit small changes frequently, not everything at once
5. **Write Descriptive Commits**: Good commit messages help track changes

---

**Happy Coding! 🚀**
