CREATE VIEW view_available_bags AS
SELECT
    b.id                  AS bag_id,
    b.product_name,
    v.name                AS vendor_name,
    v.location            AS vendor_location,
    b.description,
    b.category,
    b.original_price,
    b.discounted_price,
    ROUND(((b.original_price - b.discounted_price) / b.original_price) * 100, 2) AS discount_percent,
    b.quantity,
    b.pickup_window_start,
    b.pickup_window_end,
    b.expires_at
FROM bags b
JOIN vendors v ON v.id = b.vendor_id
WHERE b.status = 'available'
  AND b.quantity > 0;

CREATE VIEW view_bag_allergens AS
SELECT DISTINCT
    b.id          AS bag_id,
    b.product_name,
    v.name        AS vendor_name,
    a.name        AS allergen_name,
    fa.may_contain
FROM bags b
JOIN vendors v        ON v.id = b.vendor_id
JOIN bag_items bi     ON bi.bag_id = b.id
JOIN food f           ON f.food_id = bi.food_id
JOIN food_allergen fa ON fa.food_id = f.food_id
JOIN allergen a       ON a.allergen_id = fa.allergen_id;

CREATE VIEW view_user_order_history AS
SELECT
    u.id                AS user_id,
    u.name              AS user_name,
    u.email,
    r.id                AS reservation_id,
    v.name              AS vendor_name,
    v.location          AS vendor_location,
    b.product_name,
    b.category          AS bag_category,
    b.original_price,
    b.discounted_price,
    r.status            AS reservation_status,
    r.transaction_id,
    r.payment_status,
    r.created_at        AS ordered_at
FROM reservations r
JOIN users u   ON u.id = r.user_id
JOIN bags b    ON b.id = r.bag_id
JOIN vendors v ON v.id = b.vendor_id
ORDER BY r.created_at DESC;

CREATE VIEW view_user_safe_bags AS
SELECT DISTINCT
    u.id                AS user_id,
    u.name              AS user_name,
    b.id                AS bag_id,
    b.product_name,
    v.name              AS vendor_name,
    b.discounted_price,
    b.pickup_window_start,
    b.pickup_window_end
FROM users u
JOIN bags b ON b.status = 'available' AND b.quantity > 0
JOIN vendors v ON v.id = b.vendor_id
WHERE
    (
        NOT EXISTS (
            SELECT 1
            FROM user_dietary_preferences udp0
            WHERE udp0.user_id = u.id
        )
        OR EXISTS (
            SELECT 1
            FROM user_dietary_preferences udp
            JOIN bag_dietary_tags bdt ON bdt.dietary_tag_id = udp.dietary_tag_id
            WHERE udp.user_id = u.id
              AND bdt.bag_id = b.id
        )
    )
    AND NOT EXISTS (
        SELECT 1
        FROM bag_items bi
        JOIN food_allergen fa ON fa.food_id = bi.food_id
        JOIN user_allergen_exclusions uae ON uae.allergen_id = fa.allergen_id
        WHERE bi.bag_id = b.id
          AND uae.user_id = u.id
    );
