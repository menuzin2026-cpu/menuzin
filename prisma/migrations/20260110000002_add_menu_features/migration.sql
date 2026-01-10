-- AlterTable: Add menu background image fields to Theme
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "menu_background_r2_key" TEXT,
ADD COLUMN IF NOT EXISTS "menu_background_r2_url" TEXT;

-- AlterTable: Add new color fields to Theme
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "item_name_text_color" TEXT,
ADD COLUMN IF NOT EXISTS "item_price_text_color" TEXT,
ADD COLUMN IF NOT EXISTS "item_description_text_color" TEXT,
ADD COLUMN IF NOT EXISTS "bottom_nav_section_name_color" TEXT,
ADD COLUMN IF NOT EXISTS "category_name_color" TEXT;

-- AlterTable: Add service charge percentage to Restaurant
ALTER TABLE "Restaurant" ADD COLUMN IF NOT EXISTS "service_charge_percent" DOUBLE PRECISION DEFAULT 0;

