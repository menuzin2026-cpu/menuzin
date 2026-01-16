# Menu Page Loading Pipeline Analysis (READ-ONLY)

## A) Current Loading Timeline

### Server-Side (Before HTML is sent)

1. **Layout Route (`app/[slug]/layout.tsx`)** - Lines 14-36
   - **Blocking**: YES - Blocks HTML until complete
   - **Query**: `prisma.restaurant.findUnique({ where: { slug }, select: { id: true } })`
   - **Purpose**: Validates restaurant exists (returns 404 if not found)
   - **Caching**: `dynamic = 'force-dynamic'`, `revalidate = 0` (no cache)
   - **Estimated Time**: 50-200ms (simple lookup)
   - **Blocks TTFB**: YES

2. **Menu Page Component (`app/[slug]/menu/page.tsx`)** - Lines 1379-1389
   - **Type**: Client Component (`'use client'`)
   - **Suspense Boundary**: Wraps `MenuPageContent` with fallback "Loading..."
   - **Server Rendering**: Minimal - only Suspense wrapper renders on server
   - **Blocks HTML**: NO - Suspense allows HTML to be sent immediately with fallback

### Client-Side Hydration & Data Fetching

3. **Initial Hydration** (React hydrates client component)
   - **Time**: ~100-300ms (depends on JS bundle size)
   - **What renders**: Suspense fallback "Loading..." initially

4. **Main useEffect Hook** (`app/[slug]/menu/page.tsx` lines 328-520)
   - **Triggers**: On mount (after hydration)
   - **Parallel Fetches** (via `Promise.all` at line 432):
     - **a) Bootstrap Fetch** (`/api/${slug}/public/menu-bootstrap`) - Line 343
       - **Caching**: `revalidate = 60` (cached 60s), `Cache-Control: public, s-maxage=60`
       - **Server Queries** (parallel via `Promise.all` at line 19):
         - `prisma.restaurant.findUnique()` - basic info
         - `prisma.restaurant.findUnique()` → `prisma.theme.findUnique()` - theme colors/background
         - `prisma.restaurant.findUnique()` → `prisma.section.findMany()` with nested `categories` (NO items)
         - `prisma.restaurant.findUnique()` → `prisma.uiSettings.findUnique()` - currency
       - **Payload Size**: ~5-20KB (structure only, no items)
       - **Estimated Time**: 100-400ms (4 parallel DB queries)
       - **Sets State**: `restaurant`, `theme`, `sections` (empty items), `serviceChargePercent`, `currency`
       - **Critical**: Sets `isLoadingMenu(false)` at line 409 - **UNBLOCKS UI**
     
     - **b) Platform Settings Fetch** (`/api/platform-settings`) - Line 434
       - **Caching**: `no-store` (no cache)
       - **Server Query**: `prisma.platformSettings.findUnique({ where: { id: 'platform-1' } })`
       - **Payload Size**: ~0.5KB (footer logo URL only)
       - **Estimated Time**: 50-150ms
       - **Sets State**: `footerLogoUrl`

   - **Sequential Fetches** (after Promise.all):
     - **c) UI Settings Fetch** (`/api/ui-settings?slug=...`) - Line 456
       - **Caching**: `no-store` (no cache)
       - **Server Queries**: 
         - `prisma.restaurant.findUnique()` (by slug)
         - `prisma.uiSettings.findUnique()` (by restaurantId)
         - `prisma.theme.findUnique()` (for headerFooterBgColor, glassTintColor)
       - **Payload Size**: ~1-2KB
       - **Estimated Time**: 100-300ms
       - **Sets State**: `uiSettings` (typography sizes, currency)
       - **Note**: This is a **DUPLICATE** - currency already fetched in bootstrap, theme colors already fetched in bootstrap

   - **LocalStorage Reads** (synchronous):
     - Language preference (line 331)
     - Basket data (slug-scoped, line 445)

5. **Theme CSS Application** (lines 132-168, called at line 361)
   - **Triggers**: After bootstrap theme data arrives
   - **Action**: Sets CSS variables on `document.documentElement`
   - **Time**: <10ms (synchronous DOM manipulation)
   - **Re-render**: YES - triggers React re-render when theme state updates

6. **Auto-Select Section/Category** (lines 372-405, 523-559)
   - **Triggers**: After `sections` state is set
   - **Logic**: Selects first active section/category or saved from localStorage
   - **Sets State**: `activeSectionId`, `activeCategoryId`
   - **Time**: <10ms (synchronous)

7. **Category Items Fetch** (`fetchCategoryItems` - lines 171-214)
   - **Triggers**: When `activeCategoryId` changes (useEffect at line 562)
   - **Endpoint**: `/api/${slug}/public/menu-items?categoryId=${categoryId}`
   - **Caching**: `revalidate = 30` (cached 30s), `Cache-Control: public, s-maxage=30`
   - **Server Query**: 
     - `prisma.restaurant.findUnique()` (by slug)
     - `prisma.item.findMany()` (filtered by categoryId, restaurantId, isActive)
   - **Payload Size**: ~10-50KB per category (20-40 items typical)
   - **Estimated Time**: 100-300ms per category
   - **Sets State**: Updates `categoryItemsCache` Map, `allItems` array
   - **Loading Indicator**: `loadingCategoryId` state (shows skeleton)

8. **Background Prefetch** (`startBackgroundPrefetch` - lines 217-270)
   - **Triggers**: After first category items load (line 569)
   - **Behavior**: Fetches remaining categories in active section, one-by-one with 200-300ms delay
   - **Cancellation**: Uses `prefetchRunIdRef` to cancel if section changes
   - **Impact**: Non-blocking, improves perceived performance

9. **IntersectionObserver Setup** (lines 727-816)
   - **Triggers**: After `sections` and `activeSectionId` are set
   - **Purpose**: Tracks visible categories on scroll for bottom nav highlight
   - **Observers**: 
     - `IntersectionObserver` on `[id^="category-"]` elements
     - `MutationObserver` on content container (re-observes when new categories load)
   - **Delays**: Multiple `setTimeout` calls (300ms, 800ms, 1500ms) to catch dynamic content
   - **Impact**: Minimal CPU, but multiple timeouts add overhead

10. **Event Listeners Setup** (lines 612-724)
    - **Triggers**: On mount
    - **Listeners**: 
      - `visibilitychange` - refetches UI settings when page becomes visible
      - `focus` - refetches UI settings when window regains focus
      - `storage` - listens for `typography-updated`, `service-charge-updated`, `theme-updated` events
      - Custom events: `typography-updated`, `service-charge-updated`, `theme-updated`
    - **Impact**: Multiple listeners, potential for duplicate fetches

### Rendering Work

11. **Initial Render** (after `isLoadingMenu = false`)
    - **Components Rendered**:
      - `MenuHeader` (logo)
      - `FloatingActionBar` (language/search/feedback)
      - `AnimatedBasketIcon`
      - Bottom navigation (sections + categories)
      - **Skeleton loaders** (if `loadingCategoryId` is set) OR **Item grid** (if items cached)
    - **Item Cards Rendered**: Only for active category (from `categoryItemsCache`)
    - **Computation**: `itemsByCategory` (memoized via `useMemo` at line 959)

12. **Item Grid Rendering** (lines 1268-1342)
    - **Items Rendered**: Only items from `categoryItemsCache.get(categoryId)`
    - **ItemCard Components**: Rendered for each item (lines 1326-1336)
    - **Image Loading**: 
      - First 2 items: `priority={true}`, `loading="eager"` (line 1324)
      - Rest: `priority={false}`, `loading="lazy"` (default)
    - **Re-render Triggers**: 
      - When `categoryItemsCache` updates (new category loaded)
      - When `activeCategoryId` changes
      - When `basket` changes (quantity badges)
      - When `uiSettings.currency` changes

### Media Loading

13. **Header Logo** (`components/menu-header.tsx` lines 25-42)
    - **Type**: `next/image` with `priority={true}`
    - **Source**: `restaurant.logoR2Url` or `/assets/${restaurant.logoMediaId}`
    - **Loading**: Eager, high priority
    - **Blocks Layout**: NO (has dimensions)

14. **Item Images** (`components/item-card.tsx` lines 111-120)
    - **Type**: `next/image` with conditional priority
    - **Source**: `item.imageR2Url` or `/assets/${item.imageMediaId}`
    - **Loading**: First 2 items eager, rest lazy
    - **Sizes**: `(max-width: 768px) 50vw, 33vw`
    - **Blocks Layout**: NO (aspect-square container)

15. **Menu Background Image** (`app/[slug]/menu/page.tsx` lines 1000-1010)
    - **Type**: CSS `background-image` (inline style)
    - **Source**: `theme.menuBackgroundR2Url` (from Cloudflare R2)
    - **Loading**: Browser native (no Next.js optimization)
    - **Application**: Applied to root `<div>` via inline style
    - **Blocks Layout**: NO (background doesn't block)
    - **Potential Issue**: Large image (could be 500KB-2MB) loads after CSS is applied, may cause "flash" or delayed background appearance
    - **Re-render**: YES - applied when `theme` state updates (line 1004)

---

## B) Network Waterfall Table

| Endpoint | When Fires | Blocking | Caching | Payload | Estimated Time | File/Line |
|----------|-----------|----------|---------|---------|----------------|-----------|
| `GET /[slug]/layout` (server) | Initial request | YES (blocks HTML) | No cache | N/A | 50-200ms | `app/[slug]/layout.tsx:19` |
| `GET /api/[slug]/public/menu-bootstrap` | On mount (parallel) | NO (after hydration) | 60s cache | 5-20KB | 100-400ms | `app/[slug]/menu/page.tsx:343` |
| `GET /api/platform-settings` | On mount (parallel) | NO | No cache | ~0.5KB | 50-150ms | `app/[slug]/menu/page.tsx:434` |
| `GET /api/ui-settings?slug=...` | On mount (sequential after bootstrap) | NO | No cache | 1-2KB | 100-300ms | `app/[slug]/menu/page.tsx:456` |
| `GET /data/theme?slug=...` | On visibility/focus/storage events | NO | No cache | 2-5KB | 100-300ms | `app/[slug]/menu/page.tsx:276` (via `fetchTheme`) |
| `GET /data/restaurant?slug=...` | On visibility/focus/storage events | NO | No cache | 5-15KB | 150-400ms | `app/[slug]/menu/page.tsx:303` (via `fetchRestaurantData`) |
| `GET /api/[slug]/public/menu-items?categoryId=...` | When category selected/changes | NO | 30s cache | 10-50KB per category | 100-300ms per category | `app/[slug]/menu/page.tsx:185` (via `fetchCategoryItems`) |
| Background image (R2) | After theme state updates | NO | Browser cache | 500KB-2MB | 500ms-3s | Applied via CSS at `app/[slug]/menu/page.tsx:1005` |
| Item images (R2) | As items render (lazy) | NO | Browser cache | 50-200KB each | 100-500ms each | `components/item-card.tsx:111` |

### Duplicate Fetches Identified

1. **Theme Data**:
   - Fetched in bootstrap (`/api/[slug]/public/menu-bootstrap`) - line 343
   - Fetched again via `/data/theme?slug=...` - line 276 (only on events, but still duplicate)
   - **Impact**: Low (event-driven, not on initial load)

2. **Restaurant Data**:
   - Basic info in bootstrap (`/api/[slug]/public/menu-bootstrap`) - line 343
   - Full data via `/data/restaurant?slug=...` - line 303 (only on events, but still duplicate)
   - **Impact**: Low (event-driven, not on initial load)

3. **UI Settings**:
   - Currency fetched in bootstrap (`/api/[slug]/public/menu-bootstrap`) - line 343
   - Full UI settings via `/api/ui-settings?slug=...` - line 456 (sequential after bootstrap)
   - **Impact**: Medium (happens on every mount, adds 100-300ms)

---

## C) Rendering Cost Summary

### Components Rendered on Initial Load

- **MenuHeader**: 1 component
- **FloatingActionBar**: 1 component
- **AnimatedBasketIcon**: 1 component
- **Bottom Navigation**: 
  - Section buttons: ~2-5 (active sections only)
  - Category buttons: ~5-15 (active categories in active section)
- **Item Cards**: 
  - **Initial**: 0-40 items (only active category, from cache)
  - **After first fetch**: 20-40 items typical
  - **After background prefetch**: All categories in section (could be 100-300 items total)

### Expensive Computations

1. **`itemsByCategory`** (line 959-976)
   - **Memoized**: YES (`useMemo`)
   - **Dependencies**: `activeSection`, `categoryItemsCache`
   - **Computation**: Filters, sorts categories and items
   - **Runs**: Only when `activeSection` or `categoryItemsCache` changes
   - **Cost**: Low-Medium (O(n) where n = categories + items in active section)

2. **`allItems` Array Updates** (line 200-204)
   - **Purpose**: Search functionality
   - **Updates**: Every time a category's items are fetched
   - **Cost**: Low (array concatenation with Set deduplication)

3. **Basket Calculations** (line 1029)
   - **Computation**: `basket.reduce((sum, item) => sum + item.quantity, 0)`
   - **Runs**: Every render when basket changes
   - **Cost**: Very Low (O(n) where n = basket items, typically <10)

### Re-render Triggers

1. **State Updates** (multiple sequential):
   - `setRestaurant` → re-render
   - `setTheme` → re-render
   - `setSections` → re-render
   - `setUiSettings` → re-render
   - `setActiveSectionId` → re-render
   - `setActiveCategoryId` → re-render
   - `setCategoryItemsCache` → re-render
   - **Impact**: 5-7 re-renders on initial load (could be batched)

2. **Category Items Loading**:
   - Each category fetch triggers `setCategoryItemsCache` → re-render
   - Background prefetch causes multiple re-renders (one per category)

3. **IntersectionObserver Updates**:
   - Updates `activeCategoryId` on scroll → re-render
   - **Impact**: Frequent during scrolling (could be throttled)

### ItemCard Re-renders

- **Memoization**: NO (`ItemCard` is NOT wrapped in `React.memo`)
- **Props Stability**: 
  - `item` object: New object reference on each fetch (not stable)
  - `onItemClick`, `onAddToBasket`: Inline functions (not stable, but defined in parent)
  - `quantity`: Computed from `basket.find()` on every render (not memoized)
- **Impact**: ItemCard re-renders when:
  - Parent re-renders (frequent)
  - Basket changes (quantity badge updates)
  - Currency changes (price formatting)

---

## D) Background Image/Theme Handling Summary

### Flow

1. **Data Source**: `theme.menuBackgroundR2Url` from bootstrap response
2. **Storage**: Stored in `theme` state (line 100)
3. **Application**: Applied via inline `style` prop on root `<div>` (lines 1000-1010)
4. **CSS Properties**:
   ```css
   backgroundImage: `url(${theme.menuBackgroundR2Url})`
   backgroundSize: 'cover'
   backgroundPosition: 'center'
   backgroundRepeat: 'no-repeat'
   backgroundAttachment: 'fixed'
   ```

### Potential Issues

1. **No Preloading**: Background image is not preloaded, loads after CSS is applied
2. **Large File Size**: Could be 500KB-2MB, causing delayed appearance
3. **Fixed Attachment**: `backgroundAttachment: 'fixed'` can cause performance issues on mobile
4. **Re-render on Theme Update**: Every time `theme` state updates, the inline style is recalculated
5. **No Fallback**: If image fails to load, no fallback background is shown (relies on `backgroundColor: 'var(--app-bg, #400810)'`)

### When It Loads

- **Initial**: After bootstrap fetch completes (~100-400ms after mount)
- **Updates**: When `fetchTheme()` is called (on visibility/focus/storage events)
- **Browser Behavior**: Browser loads image asynchronously, may cause "flash" of solid color before image appears

---

## E) Top Root Causes (Ranked)

### 1. **Sequential State Updates Causing Multiple Re-renders** (HIGH IMPACT)
   - **Evidence**: Lines 348-409, 467-477 - Multiple `setState` calls in sequence
   - **Impact**: 5-7 re-renders on initial load, each triggering full component tree re-render
   - **Cost**: ~50-200ms total (React reconciliation)
   - **Fix**: Batch state updates using single `setState` or `useReducer`, or wrap in `startTransition`

### 2. **Duplicate UI Settings Fetch** (MEDIUM IMPACT)
   - **Evidence**: Currency fetched in bootstrap (line 343), then full UI settings fetched again (line 456)
   - **Impact**: Adds 100-300ms sequential delay after bootstrap
   - **Cost**: Network + DB query time
   - **Fix**: Include full UI settings in bootstrap response, or remove bootstrap currency and only use UI settings

### 3. **ItemCard Not Memoized** (MEDIUM IMPACT)
   - **Evidence**: `components/item-card.tsx` - no `React.memo` wrapper
   - **Impact**: All ItemCards re-render on every parent re-render (5-7 times on initial load)
   - **Cost**: ~10-50ms per re-render × number of items (could be 40+ items × 5-7 renders = 200-350ms)
   - **Fix**: Wrap `ItemCard` in `React.memo`, ensure props are stable

### 4. **Background Image Loading Delay** (LOW-MEDIUM IMPACT)
   - **Evidence**: Large image (500KB-2MB) loads after CSS is applied, no preloading
   - **Impact**: Visual "flash" or delayed background appearance (500ms-3s)
   - **Cost**: User perception of slowness
   - **Fix**: Preload background image, or use `next/image` with priority (though `next/image` doesn't support background images)

### 5. **Multiple IntersectionObserver Timeouts** (LOW IMPACT)
   - **Evidence**: Lines 785-787 - Three `setTimeout` calls (300ms, 800ms, 1500ms)
   - **Impact**: Adds overhead, observers re-initialize multiple times
   - **Cost**: ~10-50ms total
   - **Fix**: Use single timeout or `MutationObserver` only

### 6. **Event Listeners Causing Duplicate Fetches** (LOW IMPACT)
   - **Evidence**: Lines 662-713 - Multiple event listeners that trigger `fetchTheme()` and `fetchRestaurantData()`
   - **Impact**: Potential for duplicate fetches when admin updates settings
   - **Cost**: Network + DB query time (only on events, not initial load)
   - **Fix**: Debounce event handlers, or use single event bus

### 7. **Background Prefetch Queue** (POSITIVE, but could be optimized)
   - **Evidence**: Lines 217-270 - Fetches categories one-by-one with 200-300ms delay
   - **Impact**: Good for perceived performance, but adds network overhead
   - **Cost**: Multiple sequential fetches (could be 5-10 categories × 200-300ms = 1-3s total)
   - **Optimization**: Could prefetch 2-3 categories in parallel instead of strictly sequential

---

## Quick Recommendations (No Code Changes)

### High Priority
1. **Batch State Updates**: Combine multiple `setState` calls into single update or use `useReducer`
2. **Memoize ItemCard**: Wrap `ItemCard` in `React.memo` to prevent unnecessary re-renders
3. **Remove Duplicate UI Settings Fetch**: Include full UI settings in bootstrap, or remove currency from bootstrap

### Medium Priority
4. **Preload Background Image**: Add `<link rel="preload">` for background image, or use `next/image` with overlay
5. **Optimize IntersectionObserver**: Use single timeout or `requestAnimationFrame` instead of multiple `setTimeout`
6. **Debounce Event Handlers**: Prevent duplicate fetches from event listeners

### Low Priority
7. **Parallel Background Prefetch**: Prefetch 2-3 categories in parallel instead of strictly sequential
8. **Memoize Quantity Calculation**: Memoize `basket.find()` result to prevent ItemCard re-renders
9. **Virtualize Item Grid**: For restaurants with 200+ items, consider virtual scrolling (react-window)

---

## File/Line References Summary

### Critical Path Files
- `app/[slug]/layout.tsx:19` - Server-side restaurant validation (blocks HTML)
- `app/[slug]/menu/page.tsx:328-520` - Main data fetching useEffect
- `app/[slug]/menu/page.tsx:343` - Bootstrap fetch (parallel)
- `app/[slug]/menu/page.tsx:456` - UI settings fetch (sequential, duplicate)
- `app/[slug]/menu/page.tsx:562` - Category items fetch trigger
- `app/[slug]/menu/page.tsx:959` - itemsByCategory computation (memoized)
- `app/[slug]/menu/page.tsx:1000-1010` - Background image application
- `components/item-card.tsx:34` - ItemCard component (NOT memoized)

### API Routes
- `app/api/[slug]/public/menu-bootstrap/route.ts:19-118` - Bootstrap endpoint (4 parallel queries)
- `app/api/[slug]/public/menu-items/route.ts:80-100` - Category items endpoint
- `app/api/ui-settings/route.ts:36-178` - UI settings endpoint
- `app/data/theme/route.ts:8-134` - Theme endpoint (duplicate)
- `app/data/restaurant/route.ts:106-380` - Restaurant endpoint (duplicate)

---

**Analysis Date**: 2025-01-XX  
**Next.js Version**: App Router  
**Analysis Type**: READ-ONLY (No code changes made)
