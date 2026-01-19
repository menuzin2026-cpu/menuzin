# MENU PAGE LOADING PRIORITY ANALYSIS

## TASK TYPE: READ-ONLY ANALYSIS (NO CODE MODIFICATIONS)

This document provides a detailed technical analysis of the **EXACT LOADING PRIORITY** of the menu page, from the first server operation to the last client-side render.

---

## 1️⃣ EXACT LOADING ORDER (Step-by-Step)

### **SERVER-SIDE EXECUTION (Before HTML is Sent)**

#### **Step 1: Restaurant Validation (BLOCKS HTML)**
- **Location:** `app/[slug]/layout.tsx` (lines 14-36)
- **Execution:** Server-side, synchronous
- **Action:** 
  - Queries database: `prisma.restaurant.findUnique({ where: { slug } })`
  - Selects only `{ id: true }` for minimal data transfer
  - Returns 404 if restaurant doesn't exist
- **Blocks:** YES - HTML is NOT sent until this completes
- **Blocks UI:** YES - User sees nothing until this finishes
- **Blocks Interaction:** YES - No page exists yet
- **Typical Duration:** 50-200ms (database query)

#### **Step 2: HTML Shell Generation**
- **Location:** Next.js App Router
- **Execution:** Server-side, after validation
- **Action:**
  - Generates minimal HTML structure
  - Includes React hydration markers
  - Includes Suspense boundary wrapper
  - Includes CSS (inline or linked)
- **Blocks:** NO - This is the HTML being sent
- **Blocks UI:** NO - This IS the initial UI (Suspense fallback)
- **Blocks Interaction:** NO - Fallback UI is visible

#### **Step 3: HTML Sent to Browser**
- **Location:** Network layer
- **Execution:** HTTP response
- **Action:** Browser receives HTML, CSS, and initial JavaScript bundle references
- **Blocks:** NO - This is the delivery mechanism
- **Blocks UI:** NO - Browser can start parsing
- **Blocks Interaction:** NO - Browser can start rendering

---

### **CLIENT-SIDE EXECUTION (After HTML Arrives)**

#### **Step 4: HTML Parsing & CSS Application**
- **Location:** Browser rendering engine
- **Execution:** Client-side, immediate
- **Action:**
  - Browser parses HTML
  - Applies CSS from `globals.css` and Tailwind
  - Sets CSS variables (default values from `:root`)
  - Renders Suspense fallback: `<div>Loading...</div>` with background color
- **Blocks:** NO - CSS is non-blocking (already loaded)
- **Blocks UI:** NO - Fallback UI is visible immediately
- **Blocks Interaction:** NO - User can see loading state
- **Typical Duration:** 10-50ms (parsing)

#### **Step 5: JavaScript Bundle Download**
- **Location:** Browser network layer
- **Execution:** Client-side, parallel with parsing
- **Action:**
  - Downloads Next.js runtime
  - Downloads React
  - Downloads `MenuPageContent` component bundle
  - Downloads all imported components (MenuHeader, ItemCard, etc.)
- **Blocks:** NO - Downloads in parallel
- **Blocks UI:** NO - Fallback remains visible
- **Blocks Interaction:** NO - User can see loading state
- **Typical Duration:** 200-1000ms (depends on network)

#### **Step 6: React Hydration**
- **Location:** `app/[slug]/menu/page.tsx` (lines 1443-1452)
- **Execution:** Client-side, after JS bundle loads
- **Action:**
  - React hydrates the Suspense boundary
  - `MenuPageContent` component begins mounting
  - Initial state is set:
    - `isLoadingMenu: true`
    - `sections: []`
    - `theme: null`
    - `restaurant: null`
    - All other state initialized to defaults
- **Blocks:** YES - Component must mount before data fetching
- **Blocks UI:** NO - Suspense fallback still visible
- **Blocks Interaction:** NO - User can see loading state
- **Typical Duration:** 50-200ms (hydration)

#### **Step 7: Component Mount & Initial Render**
- **Location:** `app/[slug]/menu/page.tsx` (lines 1095-1440)
- **Execution:** Client-side, after hydration
- **Action:**
  - `MenuPageContent` renders for the first time
  - Shows skeleton UI (`isLoadingMenu === true`)
  - Renders:
    - Background div with `backgroundColor: 'var(--app-bg, #400810)'`
    - MenuHeader (with no logo yet - `logoUrl` is undefined)
    - FloatingActionBar
    - AnimatedBasketIcon
    - Bottom navigation (empty - no sections yet)
    - Skeleton item grids (2 sections, 2 categories each)
- **Blocks:** NO - Render is synchronous
- **Blocks UI:** NO - Skeleton UI is visible
- **Blocks Interaction:** NO - User can see skeleton
- **Typical Duration:** 10-50ms (render)

#### **Step 8: Primary Mount Effect Execution**
- **Location:** `app/[slug]/menu/page.tsx` (lines 408-574)
- **Execution:** Client-side, immediately after first render
- **Action:** Multiple parallel operations start:

##### **8a. Language Detection (Synchronous)**
- **Location:** Lines 409-416
- **Action:**
  - Reads `?lang=` from URL search params
  - Falls back to `localStorage.getItem('language')`
  - Defaults to `'en'`
  - Sets `currentLang` state
- **Blocks:** NO - Synchronous, instant
- **Blocks UI:** NO - No visual change yet
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** <1ms

##### **8b. Bootstrap API Fetch (ASYNCHRONOUS - CRITICAL PATH)**
- **Location:** Lines 419-527
- **Action:**
  - Fetches `/api/${slug}/public/menu-bootstrap`
  - This is the **PRIMARY DATA FETCH** that blocks real UI
- **Blocks:** YES - Real UI waits for this
- **Blocks UI:** YES - Skeleton remains until this completes
- **Blocks Interaction:** NO - Skeleton is visible, but not interactive
- **Typical Duration:** 100-500ms (with caching: 30-200ms)

##### **8c. Platform Settings Fetch (ASYNCHRONOUS - NON-CRITICAL)**
- **Location:** Lines 542-548
- **Action:**
  - Fetches `/api/platform-settings` (for footer logo)
  - Runs in parallel with bootstrap
- **Blocks:** NO - Footer logo is not critical
- **Blocks UI:** NO - Footer renders later
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** 100-300ms

##### **8d. Basket Load from localStorage (Synchronous)**
- **Location:** Lines 551-560
- **Action:**
  - Reads `localStorage.getItem('basket-${slug}')`
  - Parses JSON
  - Sets basket state
- **Blocks:** NO - Synchronous, instant
- **Blocks UI:** NO - Basket icon updates silently
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** <1ms

---

### **BOOTSTRAP API EXECUTION (Server-Side)**

#### **Step 9: Bootstrap API Route Handler**
- **Location:** `app/api/[slug]/public/menu-bootstrap/route.ts` (lines 121-237)
- **Execution:** Server-side, triggered by Step 8b

##### **9a. Restaurant Lookup (BLOCKS RESPONSE)**
- **Location:** Lines 132-143
- **Action:**
  - Queries database: `prisma.restaurant.findUnique({ where: { slug } })`
  - Selects: `id`, `nameKu`, `nameEn`, `nameAr`, `logoR2Url`, `logoMediaId`, `serviceChargePercent`
- **Blocks:** YES - Response waits for this
- **Typical Duration:** 50-150ms

##### **9b. Cached Data Fetch (Parallel Queries)**
- **Location:** Lines 158-166
- **Action:**
  - Calls `unstable_cache` wrapper around `fetchBootstrapData`
  - Cache key: `menu-bootstrap-${restaurant.id}`
  - Cache duration: 30 seconds
  - If cache miss, executes `fetchBootstrapData` (lines 11-116):
    - **Parallel Promise.all:**
      1. Theme query (lines 14-27)
      2. Sections with categories query (lines 29-63)
      3. UI Settings query (lines 65-112)
- **Blocks:** YES - Response waits for this (or cache hit)
- **Typical Duration:** 
  - Cache hit: 10-50ms
  - Cache miss: 100-300ms (parallel queries)

##### **9c. Response JSON Generation**
- **Location:** Lines 169-208
- **Action:**
  - Formats response JSON with:
    - `restaurant` object
    - `theme` object (includes `menuBackgroundR2Url`)
    - `sections` array (with categories, but NO items)
    - `uiSettings` object
  - Sets `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`
- **Blocks:** NO - Just formatting
- **Typical Duration:** <1ms

---

### **CLIENT-SIDE DATA PROCESSING (After Bootstrap Response)**

#### **Step 10: Bootstrap Response Processing**
- **Location:** `app/[slug]/menu/page.tsx` (lines 424-517)
- **Execution:** Client-side, after Step 9 completes

##### **10a. State Updates (Batch)**
- **Location:** Lines 471-506
- **Action:**
  - Sets `restaurant` state (includes logo URL)
  - Sets `serviceChargePercent` state
  - Sets `theme` state (includes `menuBackgroundR2Url`)
  - Sets `sections` state (structure only, no items)
  - Sets `uiSettings` state (typography sizes, currency)
  - Sets `activeSectionId` (default or from localStorage)
  - Sets `activeCategoryId` (first category of active section)
  - Sets `isLoadingMenu: false`
- **Blocks:** NO - State updates are synchronous
- **Blocks UI:** NO - But triggers re-render
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** <1ms

##### **10b. Theme CSS Variables Application**
- **Location:** Lines 477-480, 146-182
- **Action:**
  - Calls `applyThemeCSS(bootstrapData.theme)`
  - Sets CSS variables on `document.documentElement`:
    - `--item-name-text-color`
    - `--item-price-text-color`
    - `--item-description-text-color`
    - `--bottom-nav-section-name-color`
    - `--category-name-color`
    - `--header-footer-bg-color`
    - `--glass-tint-color`
- **Blocks:** NO - CSS variable updates are instant
- **Blocks UI:** NO - But triggers style recalculation
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** <1ms

##### **10c. Background Image Preload (IMMEDIATE)**
- **Location:** Lines 128-137
- **Action:**
  - `useEffect` triggers when `theme?.menuBackgroundR2Url` becomes available
  - Creates `new Image()` object
  - Sets `img.src = theme.menuBackgroundR2Url`
  - Sets `img.decoding = 'async'`
  - Browser starts downloading background image **immediately**
- **Blocks:** NO - Preload is non-blocking
- **Blocks UI:** NO - UI renders independently
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** Image download starts immediately (actual load: 200-2000ms depending on size)

---

### **UI RENDERING (After State Updates)**

#### **Step 11: Real UI Render (After Bootstrap)**
- **Location:** `app/[slug]/menu/page.tsx` (lines 1095-1440)
- **Execution:** Client-side, triggered by state updates from Step 10
- **Action:** Component re-renders with real data:

##### **11a. Background Image Element Render**
- **Location:** Lines 1101-1119
- **Action:**
  - Renders `<img>` element with `src={theme.menuBackgroundR2Url}`
  - Attributes: `loading="eager"`, `decoding="async"`
  - Styles: `position: fixed`, `z-index: 0`, covers full viewport
  - Browser requests image (may already be downloading from Step 10c)
- **Blocks:** NO - Image loading is non-blocking
- **Blocks UI:** NO - UI renders with background color first
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** Render: <1ms, Image load: 200-2000ms

##### **11b. Header Render (with Logo)**
- **Location:** Lines 1120-1122
- **Action:**
  - Renders `MenuHeader` component
  - Logo URL: `restaurant?.logoR2Url || (restaurant?.logoMediaId ? '/assets/${restaurant.logoMediaId}' : undefined)`
  - Logo image: `<img loading="eager" decoding="async">`
  - Browser requests logo image immediately
- **Blocks:** NO - Logo loading is non-blocking
- **Blocks UI:** NO - Header renders with placeholder if logo not ready
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** Render: <1ms, Logo load: 100-500ms

##### **11c. Bottom Navigation Render (Sections & Categories)**
- **Location:** Lines 1139-1300
- **Action:**
  - Renders sections buttons (from `sections` state)
  - Renders categories buttons (from `activeSection.categories`)
  - Uses theme colors from CSS variables
  - All text is available (no API call needed)
- **Blocks:** NO - All data is already in state
- **Blocks UI:** NO - Navigation renders immediately
- **Blocks Interaction:** YES - Navigation is now clickable
- **Typical Duration:** <1ms (render)

##### **11d. Category Headers & Skeleton Item Grids Render**
- **Location:** Lines 1342-1407
- **Action:**
  - Renders ALL category headers for active section (from `itemsByCategory` memo)
  - For each category:
    - If `categoryItemsCache` has items → renders real `ItemCard` components
    - If `categoryItemsCache` is empty → renders 6 `MenuItemSkeleton` components
  - Since bootstrap doesn't include items, all categories show skeletons initially
- **Blocks:** NO - Structure renders immediately
- **Blocks UI:** NO - Category headers and skeleton grids are visible
- **Blocks Interaction:** NO - Skeletons are not interactive
- **Typical Duration:** <1ms (render)

---

### **PROGRESSIVE ITEM LOADING (After UI Renders)**

#### **Step 12: Active Section Change Effect**
- **Location:** `app/[slug]/menu/page.tsx` (lines 615-623)
- **Execution:** Client-side, triggered when `activeSectionId` changes (from Step 10a)
- **Action:**
  - `useEffect` detects `activeSectionId` change
  - Calls `loadAllCategoriesInSection(activeSectionId)`
- **Blocks:** NO - Runs in background
- **Blocks UI:** NO - Skeletons are already visible
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** Function call: <1ms

#### **Step 13: Sequential Category Item Loading**
- **Location:** `app/[slug]/menu/page.tsx` (lines 230-283)
- **Execution:** Client-side, triggered by Step 12

##### **13a. Category Loading Loop**
- **Action:**
  - Gets active section and sorted categories
  - For each category (sequentially, no delay):
    1. Checks if already cached → skip
    2. Calls `fetchCategoryItems(category.id, true)` (background prefetch)
    3. Waits for response
    4. Moves to next category immediately
- **Blocks:** NO - Runs in background
- **Blocks UI:** NO - Skeletons remain visible
- **Blocks Interaction:** NO - No impact
- **Typical Duration:** Per category: 50-200ms (API call)

##### **13b. Menu Items API Call (Per Category)**
- **Location:** `app/api/[slug]/public/menu-items/route.ts` (lines 8-122)
- **Execution:** Server-side, triggered by Step 13a

**For each category:**
1. **Restaurant Lookup** (lines 23-26): 50-100ms
2. **Category/Section Filtering** (lines 40-77): 10-50ms
3. **Items Query** (lines 80-100): 50-200ms
4. **Response JSON** (lines 102-109): <1ms

**Total per category:** 110-350ms

##### **13c. Item Cache Update & UI Re-render**
- **Location:** `app/[slug]/menu/page.tsx` (lines 204-218)
- **Action:**
  - Updates `categoryItemsCache` Map with new items
  - Updates `allItems` array (for search)
  - Triggers component re-render
  - `itemsByCategory` memo recalculates
  - Real `ItemCard` components replace skeletons for that category
- **Blocks:** NO - Re-render is fast
- **Blocks UI:** NO - Items appear progressively
- **Blocks Interaction:** YES - Items become clickable
- **Typical Duration:** Re-render: <1ms, Item images start loading: immediate

---

### **ITEM IMAGE LOADING (Progressive)**

#### **Step 14: Item Image Requests**
- **Location:** `components/item-card.tsx` (lines 111-120)
- **Execution:** Client-side, after ItemCard renders

##### **14a. Priority Images (First 2 Items)**
- **Action:**
  - `priority={true}` prop passed to first 2 items
  - Next.js `Image` component: `loading="eager"`, `priority={true}`
  - Browser requests images with **HIGH PRIORITY**
  - Images load immediately, blocking other requests
- **Blocks:** NO - Image loading is non-blocking for UI
- **Blocks UI:** NO - Item cards render with placeholder
- **Blocks Interaction:** NO - Cards are clickable even without images
- **Typical Duration:** 100-500ms per image

##### **14b. Lazy Images (Remaining Items)**
- **Action:**
  - `priority={false}` prop passed to items 3+
  - Next.js `Image` component: `loading="lazy"`
  - Browser requests images with **LOW PRIORITY**
  - Images load when near viewport (Intersection Observer)
- **Blocks:** NO - Lazy loading is non-blocking
- **Blocks UI:** NO - Items render with placeholder
- **Blocks Interaction:** NO - Cards are clickable
- **Typical Duration:** Loads when scrolled into view

---

## 2️⃣ LOADING PRIORITY SUMMARY (Strict Order)

1. **Restaurant validation** (server) - BLOCKS HTML
2. **HTML shell sent** (server) - Includes Suspense fallback
3. **HTML parsing & CSS** (client) - Fallback UI visible
4. **JavaScript bundle download** (client) - Parallel with parsing
5. **React hydration** (client) - Component mounts
6. **Initial render** (client) - Skeleton UI visible
7. **Language detection** (client) - Synchronous, instant
8. **Bootstrap API fetch** (server) - **CRITICAL PATH - BLOCKS REAL UI**
9. **Bootstrap response processing** (client) - State updates
10. **Theme CSS variables** (client) - Colors applied
11. **Background image preload** (client) - Starts downloading
12. **Real UI render** (client) - Header, navigation, category headers
13. **Background image element** (client) - Renders `<img>` tag
14. **Header logo request** (client) - High priority
15. **Category item loading** (client) - Sequential API calls
16. **Item cache updates** (client) - Progressive re-renders
17. **Priority item images** (client) - First 2 items, high priority
18. **Lazy item images** (client) - Remaining items, low priority

---

## 3️⃣ SERVER-SIDE vs CLIENT-SIDE

### **SERVER-SIDE (Blocks HTML)**
- Restaurant validation (`layout.tsx`)
- Bootstrap API route handler (when called)
- Menu items API route handler (when called)

### **CLIENT-SIDE (After HTML Arrives)**
- React hydration
- Component mounting
- State management
- API fetching (fetch calls)
- UI rendering
- Image loading
- Event handling

---

## 4️⃣ WHAT BLOCKS RENDERING

### **BLOCKS HTML (User sees nothing)**
1. Restaurant validation query (50-200ms)

### **BLOCKS REAL UI (User sees skeleton)**
1. Bootstrap API fetch (100-500ms, or 30-200ms with cache)

### **DOES NOT BLOCK (Progressive)**
- Background image loading
- Header logo loading
- Category item loading
- Item image loading (except first 2 priority)

---

## 5️⃣ WHAT BLOCKS UI VISIBILITY

### **BLOCKS INITIAL PAINT**
- Restaurant validation (before HTML)
- JavaScript bundle download (before hydration)
- React hydration (before component mount)

### **BLOCKS REAL CONTENT**
- Bootstrap API fetch (skeleton shows instead)

### **DOES NOT BLOCK**
- Background image (renders with background color first)
- Header logo (renders with placeholder first)
- Item images (render with placeholder first)
- Category items (render with skeletons first)

---

## 6️⃣ WHAT BLOCKS INTERACTION

### **BLOCKS ALL INTERACTION**
- Restaurant validation (no page exists)
- JavaScript bundle download (no JS to handle clicks)
- React hydration (component not ready)

### **BLOCKS CONTENT INTERACTION**
- Bootstrap API fetch (only skeleton visible, not interactive)

### **DOES NOT BLOCK**
- Navigation buttons (render immediately after bootstrap)
- Item cards (become clickable as items load)
- Search/basket buttons (render early)

---

## 7️⃣ PRIORITY DIFFERENCES

### **Header Logo**
- **Priority:** HIGH
- **Loading:** `loading="eager"` (immediate request)
- **Blocks UI:** NO (placeholder shown)
- **Blocks Interaction:** NO
- **When Visible:** 100-500ms after bootstrap

### **Menu Background Image**
- **Priority:** HIGH (preloaded)
- **Loading:** Preloaded via `new Image()` + `<img loading="eager">`
- **Blocks UI:** NO (background color shows first)
- **Blocks Interaction:** NO
- **When Visible:** 200-2000ms (progressive paint)

### **Item Images (Priority)**
- **Priority:** HIGH (first 2 items only)
- **Loading:** `priority={true}`, `loading="eager"`
- **Blocks UI:** NO (placeholder shown)
- **Blocks Interaction:** NO (cards clickable)
- **When Visible:** 100-500ms after item data loads

### **Item Images (Lazy)**
- **Priority:** LOW (items 3+)
- **Loading:** `loading="lazy"` (viewport-based)
- **Blocks UI:** NO (placeholder shown)
- **Blocks Interaction:** NO (cards clickable)
- **When Visible:** When scrolled into view

### **Bottom Navigation**
- **Priority:** HIGH (critical for UX)
- **Loading:** Instant (data from bootstrap)
- **Blocks UI:** NO (renders immediately)
- **Blocks Interaction:** NO (clickable immediately)
- **When Visible:** Immediately after bootstrap

### **Item Frames (Skeletons)**
- **Priority:** HIGH (perceived performance)
- **Loading:** Instant (no data needed)
- **Blocks UI:** NO (renders immediately)
- **Blocks Interaction:** NO (not clickable)
- **When Visible:** Immediately after bootstrap

---

## 8️⃣ BROWSER PRIORITY SYSTEM

### **JavaScript Execution Priority**
1. **Critical:** React hydration, component mount
2. **High:** State updates, re-renders
3. **Medium:** API response processing
4. **Low:** Background prefetch, lazy loading

### **CSS Application Priority**
1. **Critical:** Initial CSS (from `globals.css`)
2. **High:** CSS variable updates (theme colors)
3. **Medium:** Dynamic style updates
4. **Low:** Animation styles

### **Image Fetch Priority**
1. **Highest:** Preloaded images (`new Image()`)
2. **High:** Eager images (`loading="eager"`, `priority={true}`)
3. **Medium:** Normal images (`loading="eager"`, `priority={false}`)
4. **Low:** Lazy images (`loading="lazy"`)

### **next/image Priority vs Lazy Loading**
- **Priority images:** Browser treats as critical resources, may block other requests
- **Lazy images:** Browser defers until near viewport, doesn't block anything
- **Background image:** Preloaded separately, highest priority for visual completeness

### **background-image Priority**
- **Current Implementation:** Uses `<img>` element (not CSS background)
- **Priority:** HIGH (preloaded + eager)
- **Browser Behavior:** Treats as image resource, not background property
- **Advantage:** Doesn't block paint, loads independently

---

## 9️⃣ CRITICAL PATH vs NON-CRITICAL PATH

### **CRITICAL PATH (Blocks Real UI)**
1. Restaurant validation → HTML shell
2. JavaScript bundle → React hydration
3. Component mount → Initial render
4. Bootstrap API fetch → State updates → Real UI render

**Total Critical Path:** ~300-1200ms (first load) or ~150-600ms (cached)

### **NON-CRITICAL PATH (Progressive Enhancement)**
1. Platform settings fetch (footer logo)
2. Category item loading (sequential)
3. Item image loading (progressive)
4. Background image loading (visual enhancement)

**These do NOT block the critical path.**

---

## 🔟 DEFERRED / LAZY PATH

### **DEFERRED (Loads After Critical Path)**
- Category items (load after UI renders)
- Item images (load after items render)
- Footer logo (loads in background)

### **LAZY (Loads on Demand)**
- Item images (items 3+) - load when scrolled into view
- Search results - load when search is opened
- Basket items - already in localStorage

---

## 1️⃣1️⃣ WHY ELEMENTS APPEAR AFTER OTHERS

### **Even Though Data is Loaded**

#### **Category Headers vs Items**
- **Why:** Category headers render immediately (data from bootstrap)
- **Items:** Require separate API call per category
- **Result:** Headers visible, items show skeletons → real items appear progressively

#### **Item Cards vs Item Images**
- **Why:** Item cards render immediately when data arrives
- **Images:** Require separate HTTP request per image
- **Result:** Cards visible with placeholder, images fill in progressively

#### **Background Image vs UI Elements**
- **Why:** UI elements render immediately (no dependency on background)
- **Background:** Large image file, takes time to download
- **Result:** UI visible with background color, image paints progressively

#### **Header Logo vs Header Frame**
- **Why:** Header frame renders immediately (CSS/structure)
- **Logo:** Requires image download
- **Result:** Header visible with placeholder, logo appears when loaded

---

## 1️⃣2️⃣ RENDER-BLOCKING BEHAVIORS

### **SERVER-SIDE BLOCKING**
- Restaurant validation query (must complete before HTML)
- Database queries in API routes (must complete before JSON response)

### **CLIENT-SIDE BLOCKING**
- JavaScript bundle download (must complete before hydration)
- React hydration (must complete before component mount)
- Bootstrap API fetch (must complete before real UI)

### **NON-BLOCKING (Progressive)**
- Background image loading
- Item image loading
- Category item loading
- Footer logo loading

---

## 1️⃣3️⃣ PAINT-BLOCKING BEHAVIORS

### **BLOCKS FIRST PAINT**
- Restaurant validation (no HTML yet)
- JavaScript bundle (no hydration yet)

### **BLOCKS CONTENT PAINT**
- Bootstrap API fetch (skeleton shows instead)

### **DOES NOT BLOCK PAINT**
- Background image (background color paints first)
- Item images (placeholders paint first)
- Logo (placeholder paints first)

---

## 1️⃣4️⃣ MOBILE-SPECIFIC CONSIDERATIONS

### **Network Priority**
- Mobile browsers may deprioritize images on slow connections
- Background image may load slower on mobile
- Item images may be deferred more aggressively

### **Rendering Priority**
- Mobile browsers may delay non-critical paints
- Background image may paint in slices (progressive JPEG/WebP)
- Item images may load only when scrolled into view

### **Interaction Priority**
- Touch events may be delayed until critical JS loads
- Navigation may feel laggy until bootstrap completes
- Item clicks may be delayed until items render

---

## SUMMARY

The menu page loading priority follows a **critical path** that blocks real UI until the bootstrap API completes (~100-500ms). However, the page uses **progressive enhancement** strategies:

1. **Skeleton UI** shows immediately (perceived performance)
2. **Background image** preloads but doesn't block
3. **Category structure** renders instantly (from bootstrap)
4. **Items load progressively** (sequential API calls)
5. **Images load progressively** (priority for first 2, lazy for rest)

The browser's priority system ensures critical resources (JS, CSS, bootstrap data) load first, while non-critical resources (images, footer logo) load progressively without blocking interaction.
