SELECT * FROM view_available_bags ORDER BY pickup_window_start;

SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.category,
    b.original_price,
    b.discounted_price,
    b.quantity,
    b.status,
    b.pickup_window_start,
    b.pickup_window_end
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
WHERE v.name = 'Spud Game'
ORDER BY b.pickup_window_start;

SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.discounted_price,
    b.pickup_window_start
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
JOIN bag_dietary_tags bdt ON bdt.bag_id = b.id
JOIN dietary_tags dt ON dt.id = bdt.dietary_tag_id
WHERE dt.name = 'Vegan'
  AND b.status = 'available'
ORDER BY b.pickup_window_start;

SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.discounted_price
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
JOIN bag_dietary_tags bdt ON bdt.bag_id = b.id
JOIN dietary_tags dt ON dt.id = bdt.dietary_tag_id
WHERE dt.name = 'Vegetarian'
ORDER BY v.name, b.product_name;

SELECT
    b.id AS bag_id,
    b.product_name,
    v.name AS vendor_name,
    b.discounted_price
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
JOIN bag_dietary_tags bdt ON bdt.bag_id = b.id
JOIN dietary_tags dt ON dt.id = bdt.dietary_tag_id
WHERE dt.name = 'Gluten-Free'
ORDER BY b.product_name;

SELECT DISTINCT
    vba.bag_id,
    vba.product_name,
    vba.vendor_name,
    vba.allergen_name,
    vba.may_contain
FROM view_bag_allergens vba
WHERE vba.allergen_name = 'Milk'
ORDER BY vba.bag_id;

SELECT DISTINCT
    vba.bag_id,
    vba.product_name,
    vba.vendor_name,
    vba.allergen_name,
    vba.may_contain
FROM view_bag_allergens vba
WHERE vba.allergen_name = 'Gluten'
ORDER BY vba.bag_id;

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

SELECT * FROM view_bag_allergens ORDER BY bag_id, allergen_name;

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

SELECT
    r.id AS reservation_id,
    u.name AS user_name,
    u.email,
    b.product_name,
    v.name AS vendor_name,
    r.status,
    r.transaction_id,
    r.payment_status,
    r.created_at
FROM reservations r
JOIN users u ON u.id = r.user_id
JOIN bags b ON b.id = r.bag_id
JOIN vendors v ON v.id = b.vendor_id
ORDER BY r.created_at DESC;

SELECT * FROM view_user_order_history
WHERE email = 'hussein.shav@liverpool.ac.uk'
ORDER BY ordered_at DESC;

SELECT status, COUNT(*) AS reservation_count
FROM reservations
GROUP BY status
ORDER BY status;

SELECT
    v.name AS vendor_name,
    COUNT(b.id) AS total_bags
FROM vendors v
LEFT JOIN bags b ON b.vendor_id = v.id
GROUP BY v.name
ORDER BY total_bags DESC, v.name;

SELECT
    bag_id,
    product_name,
    vendor_name,
    discounted_price,
    pickup_window_start
FROM view_available_bags
WHERE discounted_price < 3.50
ORDER BY discounted_price, pickup_window_start;

SELECT
    u.name AS user_name,
    b.product_name,
    v.name AS vendor_name,
    r.status,
    r.payment_status
FROM reservations r
JOIN users u ON u.id = r.user_id
JOIN bags b ON b.id = r.bag_id
JOIN vendors v ON v.id = b.vendor_id
WHERE r.status = 'collected'
ORDER BY u.name;

SELECT
    r.id AS reservation_id,
    u.name AS user_name,
    b.product_name,
    r.status,
    r.transaction_id,
    r.payment_status
FROM reservations r
JOIN users u ON u.id = r.user_id
JOIN bags b ON b.id = r.bag_id
WHERE r.status = 'cancelled'
ORDER BY r.id;

SELECT
    b.id AS bag_id,
    b.product_name,
    f.name AS food_item,
    f.category
FROM bags b
JOIN bag_items bi ON bi.bag_id = b.id
JOIN food f ON f.food_id = bi.food_id
WHERE b.id = 1
ORDER BY f.name;

SELECT
    food_id,
    name,
    category
FROM food
WHERE is_vegan = TRUE
  AND active = TRUE
ORDER BY category, name;

SELECT
    v.name AS vendor_name,
    b.product_name,
    b.discounted_price,
    b.quantity,
    b.pickup_window_start,
    b.pickup_window_end
FROM vendors v
JOIN bags b ON b.vendor_id = v.id
WHERE v.name = 'Union Brew'
  AND b.status = 'available'
  AND b.quantity > 0
ORDER BY b.pickup_window_start;

SELECT * FROM view_user_safe_bags ORDER BY user_id, bag_id;

SELECT
    bag_id,
    product_name,
    vendor_name,
    original_price,
    discounted_price,
    discount_percent
FROM view_available_bags
ORDER BY discount_percent DESC, product_name;

SELECT
    bag_id,
    product_name,
    vendor_name,
    expires_at
FROM view_available_bags
ORDER BY expires_at ASC;

SELECT
    u.name AS user_name,
    dt.name AS dietary_preference
FROM user_dietary_preferences udp
JOIN users u ON u.id = udp.user_id
JOIN dietary_tags dt ON dt.id = udp.dietary_tag_id
WHERE u.email = 'sarah.wu@liverpool.ac.uk'
ORDER BY dt.name;

SELECT
    u.name AS user_name,
    a.name AS allergen_exclusion
FROM user_allergen_exclusions uae
JOIN users u ON u.id = uae.user_id
JOIN allergen a ON a.allergen_id = uae.allergen_id
WHERE u.email = 'hussein.shav@liverpool.ac.uk'
ORDER BY a.name;
