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
    f.food_id,
    f.name
FROM vendor_food_items vfi
JOIN food f ON f.food_id = vfi.food_id
WHERE vfi.vendor_id = 1
ORDER BY f.name;

SELECT
    f.food_id,
    f.name
FROM vendor_food_items vfi
JOIN food f ON f.food_id = vfi.food_id
WHERE vfi.vendor_id = 2
ORDER BY f.name;

SELECT
    f.food_id,
    f.name
FROM vendor_food_items vfi
JOIN food f ON f.food_id = vfi.food_id
WHERE vfi.vendor_id = 3
ORDER BY f.name;

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

SELECT DISTINCT
    vba.bag_id,
    vba.product_name,
    vba.vendor_name,
    vba.allergen_name,
    vba.may_contain
FROM view_bag_allergens vba
WHERE vba.allergen_name = 'Milk'
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

SELECT * FROM view_user_safe_bags ORDER BY user_id, bag_id;
