SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'allergen', COUNT(*) FROM allergen
UNION ALL
SELECT 'dietary_tags', COUNT(*) FROM dietary_tags
UNION ALL
SELECT 'food', COUNT(*) FROM food
UNION ALL
SELECT 'bags', COUNT(*) FROM bags
UNION ALL
SELECT 'reservations', COUNT(*) FROM reservations
UNION ALL
SELECT 'user_dietary_preferences', COUNT(*) FROM user_dietary_preferences
UNION ALL
SELECT 'user_allergen_exclusions', COUNT(*) FROM user_allergen_exclusions;

SELECT status, COUNT(*) AS total
FROM reservations
GROUP BY status
ORDER BY status;

SELECT payment_status, COUNT(*) AS total
FROM reservations
GROUP BY payment_status
ORDER BY payment_status;

SELECT COUNT(*) AS available_bag_count
FROM view_available_bags;

SELECT COUNT(*) AS bag_allergen_rows
FROM view_bag_allergens;

SELECT COUNT(*) AS user_safe_bag_rows
FROM view_user_safe_bags;

-- Run these one by one to confirm constraints fail correctly

-- INSERT INTO users (name, email, password_hash)
-- VALUES ('Duplicate User', 'sarah.wu@liverpool.ac.uk', 'hash_x');

-- INSERT INTO users (name, email, password_hash)
-- VALUES ('Outside User', 'outside@gmail.com', 'hash_y');

-- INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status)
-- VALUES (1, 'Invalid Status Bag', 'Test bag', 'Test', 5.00, 3.00, 1, '2026-03-18 12:00:00', '2026-03-18 12:30:00', '2026-03-18 12:20:00', 'sold');

-- INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status)
-- VALUES (1, 'Bad Discount Bag', 'Should fail', 'Test', 3.00, 4.50, 1, '2026-03-18 12:00:00', '2026-03-18 12:30:00', '2026-03-18 12:20:00', 'available');

-- INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status)
-- VALUES (1, 'Bad Window Bag', 'Should fail', 'Test', 5.00, 3.00, 1, '2026-03-18 12:30:00', '2026-03-18 12:00:00', '2026-03-18 12:20:00', 'available');

-- INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status)
-- VALUES (1, 'Bad Expiry Bag', 'Should fail', 'Test', 5.00, 3.00, 1, '2026-03-18 12:00:00', '2026-03-18 12:30:00', '2026-03-18 12:40:00', 'available');

-- INSERT INTO bag_items (bag_id, food_id) VALUES (1, 999);

-- INSERT INTO reservations (user_id, bag_id, status, transaction_id, payment_status)
-- VALUES (1, 1, 'pending', 'TXN-999999', 'paid');

-- INSERT INTO reservations (user_id, bag_id, status, transaction_id, payment_status)
-- VALUES (1, 1, 'reserved', 'TXN-999998', 'processing');

-- BEGIN;
-- SELECT COUNT(*) AS bags_before FROM bags WHERE vendor_id = 1;
-- DELETE FROM vendors WHERE id = 1;
-- SELECT COUNT(*) AS bags_after FROM bags WHERE vendor_id = 1;
-- ROLLBACK;

-- BEGIN;
-- SELECT COUNT(*) AS bag_items_before FROM bag_items WHERE bag_id = 1;
-- SELECT COUNT(*) AS bag_tags_before FROM bag_dietary_tags WHERE bag_id = 1;
-- DELETE FROM bags WHERE id = 1;
-- SELECT COUNT(*) AS bag_items_after FROM bag_items WHERE bag_id = 1;
-- SELECT COUNT(*) AS bag_tags_after FROM bag_dietary_tags WHERE bag_id = 1;
-- ROLLBACK;

SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;
