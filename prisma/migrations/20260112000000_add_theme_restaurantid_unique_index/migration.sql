-- Add unique index on Theme.restaurantId to ensure one theme per restaurant
CREATE UNIQUE INDEX IF NOT EXISTS theme_restaurantid_unique ON "Theme" ("restaurantId");

