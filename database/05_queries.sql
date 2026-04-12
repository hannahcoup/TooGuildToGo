SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.discounted_price
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
WHERE b.id NOT IN (
    SELECT DISTINCT bag_id
    FROM view_bag_allergens
    WHERE allergen_name = 'Peanuts'
)
ORDER BY b.id;

-- All bag allergen rows
SELECT * FROM view_bag_allergens
ORDER BY bag_id, allergen_name;

-- Bag dietary tags
SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    STRING_AGG(dt.name, ', ' ORDER BY dt.name) AS dietary_tags
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
LEFT JOIN bag_dietary_tags bdt ON bdt.bag_id = b.id
LEFT JOIN dietary_tags dt ON dt.id = bdt.dietary_tag_id
GROUP BY b.id, b.product_name, v.name
ORDER BY b.id;

-- Safe bags per user
SELECT * FROM view_user_safe_bags
ORDER BY user_id, bag_id;

-- User order history
SELECT * FROM view_user_order_history
ORDER BY ordered_at DESC;

-- User reservations
SELECT * FROM view_user_reservations
ORDER BY created_at DESC;

-- Vendor reservations
SELECT * FROM view_vendor_reservations
ORDER BY created_at DESC;

-- Reservation/payment summary per vendor
SELECT
    v.vendor_name,
    COUNT(*) FILTER (WHERE v.status = 'reserved') AS reserved_count,
    COUNT(*) FILTER (WHERE v.status = 'collected') AS collected_count,
    COUNT(*) FILTER (WHERE v.status = 'cancelled') AS cancelled_count,
    COUNT(*) FILTER (WHERE v.payment_status = 'pending') AS pending_payment_count,
    COUNT(*) FILTER (WHERE v.payment_status = 'paid') AS paid_count
FROM view_vendor_reservations v
GROUP BY v.vendor_id, v.vendor_name
ORDER BY v.vendor_name;

-- Add a favourite
INSERT INTO favourites (user_id, bag_id)
VALUES (1, 3)
ON CONFLICT (user_id, bag_id) DO NOTHING;

-- Remove a favourite
DELETE FROM favourites
WHERE user_id = 1
  AND bag_id = 3;

-- List favourites for a user
SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.discounted_price,
    b.pickup_window_start,
    b.pickup_window_end
FROM favourites f
JOIN bags b ON f.bag_id = b.id
JOIN vendors v ON b.vendor_id = v.id
WHERE f.user_id = 1
ORDER BY f.created_at DESC;

-- Check whether a favourite exists
SELECT 1
FROM favourites
WHERE user_id = 1
  AND bag_id = 3;
