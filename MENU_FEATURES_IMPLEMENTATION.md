# Menu Features Implementation Status

## ✅ COMPLETED

### 1. Database Schema
- ✅ Added `menuBackgroundR2Key` and `menuBackgroundR2Url` to Theme model
- ✅ Added 5 color fields to Theme model (itemNameTextColor, itemPriceTextColor, itemDescriptionTextColor, bottomNavSectionNameColor, categoryNameColor)
- ✅ Added `serviceChargePercent` to Restaurant model
- ✅ Created migration file: `prisma/migrations/20260110000002_add_menu_features/migration.sql`

### 2. API Routes
- ✅ Updated `/api/admin/theme` GET/PUT to handle new theme fields
- ✅ Updated `/data/theme` endpoint to return new theme fields
- ✅ Updated `/api/admin/settings` GET/PUT to handle serviceChargePercent
- ✅ Updated R2 upload route to support 'menuBg' scope

### 3. Admin UI - Settings
- ✅ Added service charge input field in `/admin/settings` and `/admin-portal/settings`
- ✅ Validation: 0-100, decimals allowed

### 4. Data Layer
- ✅ Updated `getRestaurantData` to include `serviceChargePercent`

## 🔄 IN PROGRESS

### 5. Admin UI - Theme & Colors
- ⏳ Need to add menu background image upload section
- ⏳ Need to add 5 new color pickers (itemNameTextColor, itemPriceTextColor, itemDescriptionTextColor, bottomNavSectionNameColor, categoryNameColor)

### 6. Menu Page
- ⏳ Need to apply menu background image from theme
- ⏳ Need to apply new text colors from theme
- ⏳ Need to fetch theme data (menuBackgroundR2Url and colors)

### 7. Basket Component
- ⏳ Need to fetch serviceChargePercent from restaurant data
- ⏳ Need to calculate service charge dynamically
- ⏳ Need to display service charge line item with dynamic percentage

## 📝 NEXT STEPS

1. **Admin Theme UI** (`app/[slug]/admin/theme/page.tsx` and `app/[slug]/admin-portal/theme/page.tsx`):
   - Add "Menu Page Background Image" upload section
   - Add 5 color picker sections for new text colors
   - Handle R2 upload for menuBg scope
   - Update theme interface to include new fields

2. **Menu Page** (`app/[slug]/menu/page.tsx`):
   - Fetch theme data including menuBackgroundR2Url
   - Apply background image style when menuBackgroundR2Url exists
   - Apply new text colors via CSS variables or inline styles
   - Update item card, category name, bottom nav components

3. **Basket Drawer** (`components/basket-drawer.tsx`):
   - Accept serviceChargePercent prop from restaurant data
   - Calculate serviceChargeAmount = subtotal * (serviceChargePercent / 100)
   - Display dynamic service charge line item
   - Update total calculation

4. **Component Updates**:
   - Update `ItemCard` component to use itemNameTextColor, itemPriceTextColor, itemDescriptionTextColor
   - Update `MenuNavigation` (bottom nav) to use bottomNavSectionNameColor
   - Update category display to use categoryNameColor

## 📋 FILES TO UPDATE

### Remaining:
- `app/[slug]/admin/theme/page.tsx` - Add menu background upload + color pickers
- `app/[slug]/admin-portal/theme/page.tsx` - Same as above
- `app/[slug]/menu/page.tsx` - Apply background image + fetch theme colors
- `components/basket-drawer.tsx` - Use dynamic serviceChargePercent
- `components/item-card.tsx` - Apply new text colors
- `components/menu-navigation.tsx` - Apply bottom nav colors
- Components that display category names - Apply categoryNameColor

## 🎯 TESTING CHECKLIST

- [ ] Upload menu background image in admin → theme
- [ ] Verify image appears on menu page (not welcome page)
- [ ] Verify image doesn't leak between restaurants
- [ ] Set new text colors in admin → theme
- [ ] Verify colors apply to correct elements
- [ ] Verify defaults match current UI (no visual changes for existing restaurants)
- [ ] Set service charge % in admin → settings
- [ ] Verify basket calculates service charge correctly
- [ ] Verify different restaurants can have different service charges

