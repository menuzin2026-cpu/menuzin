-- ============================================
-- Check if Admin User Exists for legends-restaurant
-- ============================================

-- Find legends-restaurant ID
SELECT 
    id as restaurant_id,
    slug,
    "nameEn"
FROM "Restaurant"
WHERE slug = 'legends-restaurant';

-- Check if any admin users exist for legends-restaurant
SELECT 
    au.id as admin_id,
    au.restaurant_id,
    r.slug,
    r."nameEn" as restaurant_name,
    au.display_name,
    au.is_active,
    au.created_at,
    au.last_login_at
FROM admin_users au
JOIN "Restaurant" r ON au.restaurant_id = r.id
WHERE r.slug = 'legends-restaurant';

-- Count total admin users
SELECT 
    COUNT(*) as total_admins,
    COUNT(*) FILTER (WHERE is_active = true) as active_admins
FROM admin_users;

