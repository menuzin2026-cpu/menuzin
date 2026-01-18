# MENU PAGE & WELCOME PAGE LOADING ANALYSIS

## TASK TYPE: READ-ONLY ANALYSIS (NO CODE MODIFICATIONS)

This document provides a deep technical analysis of how the Menu Page and Welcome Page load, with detailed comparison of their background handling behaviors.

---

## 1️⃣ MENU PAGE — FULL LOADING PIPELINE

### 1.1 Server-Side Execution (Before HTML is Sent)

**Route:** `app/[slug]/menu/page.tsx`

**Server-Side Behavior:**
- The menu page is a **Client Component** (`'use client'` directive at line 1)
- Next.js App Router renders the page wrapper server-side, but the actual content is client-rendered
- The layout (`app/[slug]/layout.tsx`) validates restaurant existence server-side:
  - Queries database: `prisma.restaurant.findUnique({ where: { slug } })`
  - Returns 404 if restaurant doesn't exist
  - This happens **before** any HTML is sent to the client
- **No server-side data fetching** for menu content - all data is fetched client-side

**HTML Structure Sent:**
- Minimal HTML shell with React hydration markers
- Suspense boundary wrapper (`<Suspense>`) with fallback loading UI
- The actual menu content (`MenuPageContent`) is not in the initial HTML

### 1.2 Client-Side Hydration

**Hydration Process:**
1. React hydrates the Suspense boundary
2. Shows fallback: `<div>Loading...</div>` with background color
3. `MenuPageContent` component mounts and begins execution
4. Initial state is set:
   - `isLoadingMenu: true`
   - `sections: []`
   - `theme: null`
   - `restaurant: null`
   - All other state initialized to defaults

### 1.3 Data Fetching Order

**Primary Mount Effect (lines 339-505):**

The main data fetching happens in a `useEffect` that runs on mount:

1. **Language Detection** (lines 340-347):
   - Reads from URL search params (`?lang=...`)
   - Falls back to `localStorage.getItem('language')`
   - Defaults to `'en'`
   - Sets `currentLang` state

2. **Menu Bootstrap Fetch** (lines 349-468):
   - **API Call:** `GET /api/${slug}/public/menu-bootstrap`
   - **Purpose:** Fast initial structure without items
   - **What it returns:**
     - Restaurant basic info (name, logo, service charge)
     - Theme data (background URL, colors)
     - Sections with categories (but categories have empty `items: []`)
     - UI settings (typography sizes, currency)
   - **Caching:** Response has `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`
   - **Parallel Fetch:** Footer logo from `/api/platform-settings` (line 473)

3. **Bootstrap Response Processing** (lines 356-448):
   - **Batch State Updates:** All state updates are batched to reduce re-renders
   - Sets `restaurant` state
   - Sets `theme` state (including `menuBackgroundR2Url`)
   - Sets `sections` state (without items)
   - Sets `uiSettings` state
   - Sets `serviceChargePercent`
   - Calculates default section/category selection
   - **Critical:** Sets `isLoadingMenu: false` immediately after bootstrap (line 448)
   - This allows UI to render **before** items are loaded

4. **Category Items Fetch** (lines 546-564):
   - Triggered when `activeCategoryId` changes
   - **API Call:** `GET /api/${slug}/public/menu-items?categoryId=${categoryId}`
   - **Caching:** Uses `categoryItemsCache` Map to avoid duplicate requests
   - **Progressive Loading:** Only fetches items for the active category
   - **Background Prefetch:** After first category loads, prefetches remaining categories in the section (lines 217-270)

5. **Basket Restoration** (lines 482-491):
   - Reads from `localStorage.getItem('basket-${slug}')`
   - Parses JSON and sets basket state
   - Happens in parallel with menu fetch

### 1.4 State Updates & Rendering Order

**State Update Sequence:**

1. **Initial Render:**
   - `isLoadingMenu: true` → Shows skeleton UI
   - Background image not yet rendered (theme is null)

2. **After Bootstrap Fetch:**
   - `theme` state updated → Background image URL available
   - `sections` state updated → Section structure available
   - `restaurant` state updated → Logo URL available
   - `uiSettings` state updated → Typography sizes available
   - `isLoadingMenu: false` → Skeleton disappears, real UI renders
   - `activeSectionId` set → First section selected
   - `activeCategoryId` set → First category selected

3. **Background Image Render:**
   - When `theme?.menuBackgroundR2Url` becomes truthy (line 1042)
   - `<img>` element is rendered with:
     - `loading="eager"` (line 1057)
     - `decoding="async"` (line 1058)
     - `position: fixed` (line 1050)
     - `zIndex: 0` (line 1049)
     - `objectFit: 'cover'` (line 1055)
   - **Key prop:** `key={theme.menuBackgroundR2Url}` forces reload on URL change

4. **Header Logo Render:**
   - When `restaurant?.logoR2Url` becomes available (line 1062)
   - `<img>` element in `MenuHeader` component:
     - `loading="eager"` (line 30 in menu-header.tsx)
     - `decoding="async"` (line 31)

5. **Category Items Render:**
   - When `activeCategoryId` changes, triggers fetch
   - `loadingCategoryId` state shows loading indicator
   - Items added to `categoryItemsCache`
   - `itemsByCategory` memo recalculates (line 996)
   - `ItemCard` components render with images

### 1.5 Image Loading

**Background Image:**
- **Element Type:** Native `<img>` (not Next.js Image)
- **Loading Strategy:** `loading="eager"` - browser requests immediately
- **Decoding:** `decoding="async"` - decode off main thread
- **Position:** `fixed` - positioned relative to viewport
- **Z-Index:** `0` - behind all content
- **Object Fit:** `cover` - fills entire viewport, may crop
- **Key Prop:** Forces React to remount when URL changes

**Header Logo:**
- **Element Type:** Native `<img>`
- **Loading:** `loading="eager"`
- **Decoding:** `decoding="async"`

**Footer Logo:**
- **Element Type:** Native `<img>`
- **Loading:** `loading="eager"`
- **Decoding:** `decoding="async"`

**Item Images:**
- **Element Type:** Next.js `Image` component (line 111 in item-card.tsx)
- **Loading Strategy:** 
  - First 2 items: `priority={true}`, `loading="eager"`
  - Remaining items: `loading="lazy"`
- **Sizes:** `(max-width: 768px) 50vw, 33vw`
- **Unoptimized:** For non-HTTP URLs (local assets)

### 1.6 Background Image Loading and Painting

**Current Implementation (lines 1041-1060):**

```tsx
{theme?.menuBackgroundR2Url && (
  <img
    key={theme.menuBackgroundR2Url}
    src={theme.menuBackgroundR2Url}
    alt="Menu Background"
    className="fixed inset-0 w-full h-full object-cover pointer-events-none"
    style={{
      zIndex: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
    loading="eager"
    decoding="async"
  />
)}
```

**Loading Behavior:**
1. **Request Timing:** Browser requests image immediately when `<img>` is rendered (eager loading)
2. **Decoding:** Image decoding happens asynchronously (doesn't block main thread)
3. **Painting:** Browser paints image as soon as enough data is available (progressive JPEG/WebP)
4. **Position:** Fixed positioning means image stays in place during scroll
5. **Z-Index:** `zIndex: 0` ensures it's behind all content (header is `z-10`, items are `z-10`)

**Paint Blocking:**
- The background image **does not block** first paint of UI elements
- UI can render with background color (`backgroundColor: 'var(--app-bg, #400810)'`) while image loads
- Image paints progressively as data arrives

### 1.7 Component Visibility Timeline

**When Components Become Visible:**

1. **Initial Paint (0ms):**
   - Background color (`#400810`) visible
   - Skeleton UI visible (if `isLoadingMenu: true`)

2. **After Bootstrap (~100-500ms):**
   - Header renders (logo may still be loading)
   - Bottom navigation renders (sections visible)
   - Category headers render (if section selected)
   - Background image starts loading

3. **Background Image Paint (~200-2000ms):**
   - Depends on network speed and image size
   - Progressive rendering: image appears gradually
   - No blocking of other UI elements

4. **Category Items Render (~300-1000ms after category selection):**
   - Items grid appears
   - Item images load progressively (first 2 eager, rest lazy)
   - Bottom navigation categories scroll into view

5. **Footer Logo (~500-1500ms):**
   - Platform logo appears at bottom
   - Fixed position, doesn't affect scroll

---

## 2️⃣ WELCOME PAGE — FULL LOADING PIPELINE

### 2.1 Server-Side Execution

**Route:** `app/[slug]/page.tsx`

**Server-Side Behavior:**
- **Server Component** (no `'use client'` directive)
- Executes `getRestaurantData(slug)` server-side (line 25)
- Fetches restaurant data from database before HTML is sent
- Returns 404 if restaurant doesn't exist
- **HTML includes:** Restaurant data serialized into React Server Components

**HTML Structure Sent:**
- Full HTML structure with restaurant data
- `WelcomeClient` component receives `restaurant` prop server-rendered
- Background component (`WelcomeBackground`) is client component but receives data server-side

### 2.2 Client-Side Hydration

**Hydration Process:**
1. React hydrates `WelcomeClient` component
2. `WelcomeBackground` component mounts
3. `isLoaded` prop is `true` immediately (passed from server)
4. Background media (video/image) starts loading immediately

### 2.3 Background Video/Image Request

**Component:** `app/[slug]/welcome-background.tsx`

**URL Resolution (line 59):**
```tsx
const backgroundUrl = restaurant.welcomeBgR2Url || 
  (restaurant.welcomeBackgroundMediaId ? `/assets/${restaurant.welcomeBackgroundMediaId}?v=${...}` : null)
```

**Media Type Detection (lines 41-42, 71-72):**
- Checks `restaurant.welcomeBgMimeType` or `restaurant.welcomeBackground?.mimeType`
- Determines if media is video (`mimeType?.startsWith('video/')`) or image

**Video Element (lines 87-138):**
```tsx
<video
  ref={videoRef}
  key={`video-${restaurant.welcomeBgR2Key || restaurant.welcomeBackgroundMediaId}-${...}`}
  muted
  playsInline
  autoPlay
  loop
  preload="auto"
  disablePictureInPicture
  controls={false}
  className="w-full h-full object-cover absolute inset-0"
  onLoadedMetadata={(e) => { /* Force play on iOS */ }}
  onCanPlay={(e) => { /* Force play on iOS */ }}
>
  <source src={backgroundUrl} type="video/mp4" />
</video>
```

**Image Element (lines 141-156):**
```tsx
<img
  key={`image-${restaurant.welcomeBgR2Key || restaurant.welcomeBackgroundMediaId}-${...}`}
  src={backgroundUrl}
  alt="Welcome Background"
  className="w-full h-full object-cover absolute inset-0"
  loading="eager"
  decoding="async"
/>
```

### 2.4 Autoplay Behavior

**Video Autoplay:**
- **Attributes:** `autoPlay`, `muted`, `playsInline`, `loop`
- **Preload:** `preload="auto"` - browser starts downloading immediately
- **iOS Handling:**
  - iOS Safari requires `muted` and `playsInline` for autoplay
  - Programmatic `play()` calls in `onLoadedMetadata` and `onCanPlay` (lines 106-124)
  - Fallback `useEffect` tries to play if video is already loaded (lines 37-56)
  - Errors are silently caught (iOS may block autoplay)

**Why Autoplay Works:**
- `muted` attribute satisfies browser autoplay policies
- `playsInline` prevents fullscreen on iOS
- Multiple play attempts ensure video starts on various devices

### 2.5 Muted / playsInline Impact (iOS Safari)

**iOS Safari Autoplay Policy:**
- Videos must be muted to autoplay
- Videos must have `playsInline` to play inline (not fullscreen)
- User interaction may be required on some iOS versions
- Programmatic `play()` may be blocked silently

**Implementation:**
- `muted` attribute set in JSX (line 90)
- `playsInline` attribute set in JSX (line 91)
- `video.muted = true` set in event handlers (lines 110, 120, 130)
- `video.play()` called in multiple places with error handling

### 2.6 Browser Handling: `<video>` vs CSS Background

**Native `<video>` Element:**
- Browser creates a **separate compositor layer** for video
- Video decoding happens in **hardware-accelerated pipeline**
- **Non-blocking:** Video loading/decoding doesn't block UI rendering
- **Progressive:** Video can start playing before fully downloaded
- **Memory Efficient:** Browser optimizes video memory usage
- **GPU Accelerated:** Video rendering uses GPU, not CPU

**CSS Background Image:**
- Treated as part of the element's background
- May block paint if image is large
- No hardware acceleration for decoding
- Must wait for image to decode before painting
- Can cause layout shifts if dimensions unknown

**Why `<video>`/`<img>` is Faster:**
1. **Separate Compositor Layer:** Browser can composite video/image independently
2. **Hardware Acceleration:** GPU handles video/image rendering
3. **Non-Blocking:** UI can render while media loads
4. **Progressive Rendering:** Media appears as data arrives
5. **Priority:** Browsers prioritize visible media elements

---

## 3️⃣ BACKGROUND HANDLING COMPARISON (VERY IMPORTANT)

### 3.1 Menu Page: CSS Background Image (Previous) vs Native `<img>` (Current)

**Previous Implementation (CSS Background):**
- Used `background-image: url(...)` in inline styles
- `backgroundAttachment: 'fixed'` for parallax effect
- `backgroundSize: 'cover'`
- `backgroundPosition: 'center center'`

**Current Implementation (Native `<img>`):**
- Native `<img>` element with `position: fixed`
- `objectFit: 'cover'`
- `loading="eager"`
- `decoding="async"`

**Why Native `<img>` is Better:**
1. **Separate Compositor Layer:** Browser creates independent layer for image
2. **Hardware Acceleration:** GPU handles image rendering
3. **Progressive Loading:** Image appears as data arrives (progressive JPEG/WebP)
4. **Non-Blocking:** UI renders while image loads
5. **Better Caching:** Browser can cache image independently
6. **Mobile Performance:** Better on mobile browsers (especially iOS)

### 3.2 Welcome Page: Native `<video>` or `<img>`

**Video Implementation:**
- Native `<video>` element
- Hardware-accelerated decoding
- Separate compositor layer
- Non-blocking UI rendering

**Image Implementation:**
- Native `<img>` element
- Same benefits as menu page background

### 3.3 How Browsers Paint CSS Background Images

**CSS Background Image Paint Process:**
1. Browser parses CSS
2. Calculates element dimensions
3. Requests background image
4. **Waits for image to load** (or at least metadata)
5. Decodes image on main thread (can block)
6. Paints background as part of element
7. Element is part of document flow

**Problems with CSS Background:**
- **Paint Blocking:** Large images can delay first paint
- **Main Thread Decoding:** Image decoding happens on main thread
- **Layout Dependency:** Background is tied to element's layout
- **No Progressive Rendering:** Must wait for image to be ready
- **Mobile Issues:** iOS Safari may delay painting until image loads

### 3.4 How Browsers Paint `<video>` and `<img>` Elements

**Native Element Paint Process:**
1. Browser creates **separate compositor layer** for element
2. Requests media immediately (if `loading="eager"`)
3. **Decodes media off main thread** (hardware-accelerated)
4. Paints media **independently** of document flow
5. **Progressive rendering:** Media appears as data arrives
6. UI can render while media loads

**Benefits:**
- **Non-Blocking:** UI renders immediately
- **Hardware Acceleration:** GPU handles decoding/rendering
- **Progressive:** Media appears gradually
- **Independent Layer:** Media doesn't affect other elements
- **Better Mobile Performance:** Especially on iOS Safari

### 3.5 Why `<video>`/`<img>` Can Load Without Blocking UI

**Technical Reasons:**
1. **Compositor Layers:** Browser creates separate layers for media elements
2. **Hardware Acceleration:** GPU handles media processing
3. **Async Decoding:** Media decoding happens off main thread
4. **Priority System:** Browsers prioritize visible media
5. **Progressive Loading:** Media streams in chunks, can render partially

**CSS Background Blocking:**
- Background is part of element's paint
- Element must wait for background to be ready
- Main thread decoding can block
- No hardware acceleration

### 3.6 Mobile Browsers (iOS Safari) and Large Backgrounds

**iOS Safari Behavior:**
- **CSS Background:** May delay painting until image loads
- **Large Images:** Can cause memory issues
- **Fixed Backgrounds:** `background-attachment: fixed` is problematic on iOS (often ignored or causes issues)
- **Native `<img>`:** Better performance, hardware-accelerated
- **Native `<video>`:** Excellent performance, optimized for mobile

**Why Menu Page Background May Zoom on Mobile:**
- **Fixed Positioning:** `position: fixed` on large images can cause issues
- **Viewport Changes:** iOS Safari address bar show/hide changes viewport
- **Image Scaling:** Browser may scale image to fit viewport changes
- **Compositor Issues:** Fixed elements in separate layers can cause visual glitches

**Welcome Page Performance:**
- Uses native `<video>` or `<img>` with proper attributes
- Hardware-accelerated rendering
- Better mobile performance
- No zoom issues

---

## 4️⃣ PAINT & RENDER BEHAVIOR

### 4.1 What Blocks First Paint (TTFB, Hydration, JS, CSS, Images)

**Time to First Byte (TTFB):**
- **Menu Page:** Minimal (client component, no server data fetching)
- **Welcome Page:** Includes database query time (~50-200ms)

**Hydration:**
- **Menu Page:** React hydrates Suspense boundary, then `MenuPageContent`
- **Welcome Page:** React hydrates `WelcomeClient` with server data

**JavaScript:**
- **Menu Page:** Client component bundle must download and execute
- **Welcome Page:** Smaller bundle (server-rendered data)

**CSS:**
- **Both Pages:** CSS is inlined or loaded early (no blocking)

**Images:**
- **Menu Page Background:** `loading="eager"` - requests immediately, but doesn't block paint
- **Welcome Page Background:** `loading="eager"` or `preload="auto"` - requests immediately, non-blocking

### 4.2 What Blocks UI Paint

**Menu Page:**
1. **Initial State:** `isLoadingMenu: true` shows skeleton (not blocking, but delays real UI)
2. **Bootstrap Fetch:** Must complete before real UI renders (~100-500ms)
3. **Background Image:** Does NOT block UI paint (native `<img>` with eager loading)
4. **Category Items:** Load progressively, don't block initial paint

**Welcome Page:**
1. **Server Data:** Already in HTML (no blocking)
2. **Background Media:** Does NOT block UI paint (native element)
3. **Content Fade-In:** 2-second delay before content appears (intentional, not blocking)

### 4.3 What Causes UI to Wait for Background

**Menu Page (Current - Native `<img>`):**
- **UI does NOT wait** for background image
- Background color renders immediately
- Image paints progressively as data arrives
- UI elements render independently

**Menu Page (Previous - CSS Background):**
- **UI may wait** if background image is large
- Element's background must be ready before painting
- Can cause delayed first paint

**Welcome Page:**
- **UI does NOT wait** for background
- Background media loads independently
- Content can render while media loads

### 4.4 Why Background Image Appears in Slices on Some Phones

**Technical Reasons:**
1. **Progressive JPEG/WebP:** Image loads in chunks (slices)
2. **Network Speed:** Slow connections reveal progressive loading
3. **Mobile Browsers:** May paint image in tiles
4. **Fixed Positioning:** `position: fixed` on large images can cause tiling
5. **Viewport Changes:** iOS Safari address bar show/hide can cause repaints
6. **Compositor Layers:** Fixed elements in separate layers may paint in sections

**Why Welcome Page Doesn't Show Slices:**
- Video loads differently (streaming, not progressive image)
- Image backgrounds may still show slices, but less noticeable due to overlay

---

## 5️⃣ IDENTIFY PROBLEMS (NO FIXES YET)

### 5.1 Render-Blocking Behaviors

**Menu Page:**
1. **Bootstrap API Call:** UI waits for `/api/${slug}/public/menu-bootstrap` before rendering real content
   - **Impact:** ~100-500ms delay before UI appears
   - **Location:** Lines 354-448 in menu/page.tsx

2. **Category Items Fetch:** Items don't appear until API call completes
   - **Impact:** ~200-1000ms delay per category
   - **Location:** Lines 171-214 (fetchCategoryItems)

3. **Theme Fetch Delay:** Background image URL not available until bootstrap completes
   - **Impact:** Background image doesn't start loading until ~100-500ms after mount
   - **Location:** Theme set in bootstrap response (line 409)

**Welcome Page:**
- **No render-blocking:** Server-rendered data, background loads independently

### 5.2 Paint-Blocking Behaviors

**Menu Page:**
1. **Skeleton UI:** Shows loading state instead of real content
   - **Impact:** User sees skeleton for ~100-500ms
   - **Location:** Lines 1256-1269

2. **Background Image Loading:** While non-blocking, image may not be visible immediately
   - **Impact:** Background color shows first, then image fades in
   - **Location:** Lines 1041-1060

**Welcome Page:**
- **Content Fade-In:** 2-second delay before content appears (intentional)
   - **Impact:** User waits 2 seconds before seeing content
   - **Location:** Lines 25-28 in welcome-client.tsx

### 5.3 Mobile-Specific Issues

**Menu Page:**
1. **Background Image Zoom:** Fixed positioning on large images can cause zoom on scroll
   - **Impact:** Background appears to zoom when sections load
   - **Location:** Lines 1041-1060 (fixed positioning)

2. **iOS Safari Address Bar:** Viewport changes when address bar shows/hides
   - **Impact:** Fixed elements may reposition, causing visual glitches
   - **Location:** Fixed background image

3. **Progressive Image Loading:** Large images load in slices on slow connections
   - **Impact:** Background appears in chunks
   - **Location:** Background image loading

4. **Category Items Loading:** Items load one category at a time
   - **Impact:** User must wait for each category to load
   - **Location:** Lines 546-564

**Welcome Page:**
- **Video Autoplay:** May not work on all iOS versions
   - **Impact:** Video may not autoplay (falls back to image)
   - **Location:** Lines 106-124 in welcome-background.tsx

### 5.4 Differences in Compositor Layers

**Menu Page:**
- **Background Image:** Fixed positioned `<img>` creates separate layer
- **Header:** Fixed positioned, separate layer
- **Bottom Navigation:** Fixed positioned, separate layer
- **Items:** Regular document flow, no separate layers
- **Potential Issue:** Multiple fixed layers can cause compositor issues on mobile

**Welcome Page:**
- **Background Video/Image:** Separate compositor layer (hardware-accelerated)
- **Content:** Regular document flow
- **Better Performance:** Fewer fixed layers, better mobile performance

### 5.5 Additional Issues

**Menu Page:**
1. **No Background Preloading:** Background image URL not known until bootstrap completes
   - **Impact:** Image loading starts ~100-500ms after page load
   - **Solution Potential:** Preload background URL in `<link rel="preload">` tag

2. **Item Images:** First 2 items use `priority`, but background image doesn't
   - **Impact:** Item images may load before background (visual hierarchy issue)
   - **Location:** ItemCard component (line 118)

3. **Category Items Cache:** Items are cached, but initial load still requires API call
   - **Impact:** First category load is always slow
   - **Location:** Lines 171-214

4. **Background Image Key Prop:** Forces remount on URL change, but doesn't preload new image
   - **Impact:** Background flickers when theme updates
   - **Location:** Line 1044

**Welcome Page:**
- **No Major Issues:** Well-optimized for performance

---

## SUMMARY

### Key Differences:

1. **Menu Page:** Client-side rendered, progressive loading, background loads after bootstrap
2. **Welcome Page:** Server-side rendered, background loads immediately, better mobile performance

### Background Handling:

1. **Menu Page:** Native `<img>` with `position: fixed` - good, but loads after bootstrap
2. **Welcome Page:** Native `<video>` or `<img>` - excellent, loads immediately

### Performance:

1. **Menu Page:** Multiple API calls, progressive loading, some blocking
2. **Welcome Page:** Single server render, non-blocking background, better performance

### Mobile Issues:

1. **Menu Page:** Background zoom, progressive image slices, multiple fixed layers
2. **Welcome Page:** Minimal issues, well-optimized for mobile

---

**END OF ANALYSIS**
