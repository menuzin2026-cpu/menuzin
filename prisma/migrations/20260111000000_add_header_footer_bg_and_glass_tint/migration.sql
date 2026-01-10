-- AlterTable: Add header/footer background color and glass tint color to Theme
ALTER TABLE "Theme" ADD COLUMN IF NOT EXISTS "header_footer_bg_color" TEXT,
ADD COLUMN IF NOT EXISTS "glass_tint_color" TEXT;

