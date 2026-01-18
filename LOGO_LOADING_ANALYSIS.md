# Header and Footer Logo Loading Analysis

## Header Logo

**Component**: `components/menu-header.tsx`
**Type**: Next.js `Image` component (NOT regular `<img>`)

### Implementation
```tsx
<Image
  src={logoUrl}
  alt="Restaurant Logo"
  width={120}
  height={32}
  className="object-contain"
  style={{ 
    height: 'var(--header-logo-size, 32px)',
    width: 'auto',
    maxWidth: '100%',
    aspectRatio: 'auto'
  }}
  priority
  placeholder="blur"
  blurDataURL={blurDataURL}
  unoptimized={logoUrl.startsWith('/assets/')}
  sizes="(max-width: 768px) 120px, 120px"
/>
```

### Loading Attributes
- ✅ **`priority`** - High priority, loads immediately (above the fold)
- ✅ **`placeholder="blur"`** - Shows blur placeholder while loading
- ✅ **`blurDataURL`** - Base64 SVG placeholder for blur effect
- ✅ **`unoptimized={logoUrl.startsWith('/assets/')}`** - Skips Next.js optimization for local assets
- ✅ **`sizes`** - Responsive sizing hint for browser

### Source
- From `restaurant.logoR2Url` or `restaurant.logoMediaId`
- Passed as `logoUrl` prop to `MenuHeader` component
- Fetched in bootstrap (`/api/[slug]/public/menu-bootstrap`)

---

## Footer Logo

**Component**: `components/powered-by-footer.tsx`
**Type**: Next.js `Image` component (NOT regular `<img>`)

### Implementation
```tsx
<Image
  src={footerLogoUrl}
  alt="Menuzin"
  width={60}
  height={18}
  className="h-4 w-auto object-contain"
  style={{ 
    maxHeight: '18px',
    width: 'auto',
    height: '18px',
    aspectRatio: '60/18'
  }}
  priority
  placeholder="blur"
  blurDataURL={blurDataURL}
  unoptimized={true}
  sizes="60px"
/>
```

### Loading Attributes
- ✅ **`priority`** - High priority, loads immediately
- ✅ **`placeholder="blur"`** - Shows blur placeholder while loading
- ✅ **`blurDataURL`** - Base64 SVG placeholder for blur effect
- ✅ **`unoptimized={true}`** - Always skips Next.js optimization (R2 URLs)
- ✅ **`sizes="60px"`** - Fixed size hint

### Source
- From `platformSettings.footerLogoR2Url`
- Fetched from `/api/platform-settings` (parallel with bootstrap)
- Stored in `footerLogoUrl` state

---

## Comparison: Header vs Footer vs Background

| Element | Type | Priority | Optimization | Placeholder |
|---------|------|----------|--------------|-------------|
| **Header Logo** | Next.js `Image` | `priority` ✅ | Conditional (`unoptimized` for `/assets/`) | Blur ✅ |
| **Footer Logo** | Next.js `Image` | `priority` ✅ | Always `unoptimized` | Blur ✅ |
| **Background Image** | Regular `<img>` | `loading="eager"` | None | None |

---

## Loading Flow

### Header Logo
1. Bootstrap fetch includes `restaurant.logoR2Url` or `logoMediaId`
2. `logoUrl` prop passed to `MenuHeader`
3. Next.js `Image` with `priority` loads immediately
4. Blur placeholder shows while loading
5. Image fades in when loaded

### Footer Logo
1. Parallel fetch to `/api/platform-settings` (with bootstrap)
2. `footerLogoR2Url` stored in state
3. Next.js `Image` with `priority` loads immediately
4. Blur placeholder shows while loading
5. Image fades in when loaded

---

## Performance Characteristics

### Next.js Image Component Benefits
- ✅ **Automatic optimization** (when not `unoptimized`)
- ✅ **Lazy loading** (when not `priority`)
- ✅ **Responsive images** (via `sizes` prop)
- ✅ **Blur placeholder** (smooth loading experience)
- ✅ **Priority loading** (loads immediately for above-the-fold content)

### Current Configuration
- **Header**: Uses Next.js Image with priority ✅
- **Footer**: Uses Next.js Image with priority ✅
- **Background**: Uses regular `<img>` with `loading="eager"` ✅

---

## Recommendations

### Current Status: ✅ Optimal

Both logos use:
- Next.js `Image` component (optimized)
- `priority` prop (loads immediately)
- Blur placeholder (smooth UX)
- Proper sizing hints

**No changes needed** - logos are loading optimally!

---

**Analysis Date**: 2025-01-XX
**Status**: Using Next.js Image component with priority loading
