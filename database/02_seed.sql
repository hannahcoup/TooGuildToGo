INSERT INTO allergen (allergen_id, name, notes) VALUES
(1,  'Celery',      NULL),
(2,  'Gluten',      NULL),
(3,  'Crustaceans', NULL),
(4,  'Eggs',        NULL),
(5,  'Fish',        NULL),
(6,  'Lupin',       NULL),
(7,  'Milk',        NULL),
(8,  'Molluscs',    NULL),
(9,  'Mustard',     NULL),
(10, 'Nuts',        'Tree nuts'),
(11, 'Peanuts',     NULL),
(12, 'Sesame',      NULL),
(13, 'Soya',        NULL),
(14, 'Sulphites',   'If > 10ppm');

INSERT INTO dietary_tags (name) VALUES
('Vegan'),
('Vegetarian'),
('Gluten-Free'),
('Contains Meat'),
('Contains Dairy'),
('Spicy'),
('Halal');

INSERT INTO vendors (name, location, email, password_hash) VALUES
('Spud Game',  'Guild of Students, 160 Mount Pleasant, Liverpool L3 5TR - Ground Floor',   'spudgame@guild.co.uk',  'vendor_hash_1'),
('Tacontent',  'Guild of Students, 160 Mount Pleasant, Liverpool L3 5TR - First Floor',    'tacontent@guild.co.uk', 'vendor_hash_2'),
('Union Brew', 'Outside Guild of Students building - right side entrance, Mount Pleasant',  'unionbrew@guild.co.uk', 'vendor_hash_3');

INSERT INTO users (name, email, password_hash) VALUES
('Sarah Wu',         'sarah.wu@liverpool.ac.uk',     'hashed_pw_a'),
('Hussein Shaverdi', 'hussein.shav@liverpool.ac.uk', 'hashed_pw_b'),

INSERT INTO food (food_id, name, description, category, is_vegan, is_vegetarian, is_gluten_free, active) VALUES
(1,  'Baked Beans',                  'Hot filling for jacket potatoes',                   'Hot Filling',   TRUE,  TRUE,  TRUE,  TRUE),
(2,  'BBQ Sloppy Joe',               'Hot BBQ meat filling',                              'Hot Filling',   FALSE, FALSE, FALSE, TRUE),
(3,  'Garlic and Chilli Chicken',    'Chicken hot filling with garlic and chilli',        'Hot Filling',   FALSE, FALSE, TRUE,  TRUE),
(4,  'Butters',                      'Butter topping/filling',                            'Hot Filling',   FALSE, TRUE,  TRUE,  TRUE),
(5,  'Seasoned',                     'Seasoned potato option',                            'Hot Filling',   TRUE,  TRUE,  TRUE,  TRUE),
(6,  'Garlic Vegan',                 'Vegan garlic filling',                              'Hot Filling',   TRUE,  TRUE,  TRUE,  TRUE),
(7,  'Firecracker',                  'Spicy firecracker filling',                         'Hot Filling',   FALSE, FALSE, TRUE,  TRUE),
(8,  'Tuna Mayo',                    'Cold tuna mayonnaise filling',                      'Cold Filling',  FALSE, FALSE, TRUE,  TRUE),
(9,  'Grated Cheese',                'Cold grated cheese topping',                        'Cold Filling',  FALSE, TRUE,  TRUE,  TRUE),
(10, 'Chicken Mayo',                 'Cold chicken mayonnaise filling',                   'Cold Filling',  FALSE, FALSE, TRUE,  TRUE),
(11, 'Coleslaw',                     'Cold coleslaw filling',                             'Cold Filling',  FALSE, TRUE,  TRUE,  TRUE),
(12, 'Chef''s Choice',               'Mixed filling selected by chef',                    'Cold Filling',  FALSE, FALSE, FALSE, TRUE),
(13, 'Ancho Beef Chilli',            'Beef chilli filling',                               'Taco Filling',  FALSE, FALSE, TRUE,  TRUE),
(14, 'Chicken of the Week',          'Weekly chicken special filling',                    'Taco Filling',  FALSE, FALSE, TRUE,  TRUE),
(15, 'LA Pulled Pork',               'Pulled pork filling',                               'Taco Filling',  FALSE, FALSE, TRUE,  TRUE),
(16, 'Veg Chilli',                   'Vegetarian chilli filling',                         'Taco Filling',  TRUE,  TRUE,  TRUE,  TRUE),
(17, 'Chalula Hot Sauce',            'Spicy sauce topping',                               'Topping',       TRUE,  TRUE,  TRUE,  TRUE),
(18, 'Salsa',                        'Tomato salsa topping',                              'Topping',       TRUE,  TRUE,  TRUE,  TRUE),
(19, 'Guacamole',                    'Avocado topping',                                   'Topping',       TRUE,  TRUE,  TRUE,  TRUE),
(20, 'Sour Cream Cheese',            'Creamy topping',                                    'Topping',       FALSE, TRUE,  TRUE,  TRUE),
(21, 'Cheese & Onion Toastie',       'Toasted sandwich with cheese and onion',            'Bakery/Lunch',  FALSE, TRUE,  FALSE, TRUE),
(22, 'Ham Cheese Baguette',          'Baguette with ham and cheese',                      'Bakery/Lunch',  FALSE, FALSE, FALSE, TRUE),
(23, 'Mozzarella & Tomato Baguette', 'Baguette with mozzarella and tomato',               'Bakery/Lunch',  FALSE, TRUE,  FALSE, TRUE),
(24, 'Ham & Cheese Toastie',         'Toasted sandwich with ham and cheese',              'Bakery/Lunch',  FALSE, FALSE, FALSE, TRUE),
(25, 'Vegetarian Sausage Bun',       'Vegetarian sausage in a bun',                       'Bakery/Lunch',  FALSE, TRUE,  FALSE, TRUE),
(26, 'Coronation Chicken Wrap',      'Wrap with coronation chicken filling',              'Wrap',          FALSE, FALSE, FALSE, TRUE);

INSERT INTO food_allergen (food_id, allergen_id, may_contain) VALUES
(8,  4,  FALSE),
(9,  7,  FALSE),
(10, 4,  FALSE),
(11, 4,  FALSE),
(20, 7,  FALSE),
(21, 2,  FALSE),
(21, 7,  FALSE),
(22, 2,  FALSE),
(22, 7,  FALSE),
(23, 2,  FALSE),
(23, 7,  FALSE),
(24, 2,  FALSE),
(24, 7,  FALSE),
(25, 2,  FALSE),
(26, 2,  FALSE),
(26, 4,  TRUE);

INSERT INTO vendor_food_items (vendor_id, food_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12),
(2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20),
(3, 21), (3, 22), (3, 23), (3, 24), (3, 25), (3, 26);

INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status) VALUES
(1, 'Spud Game Mixed Bag',       'Jacket potato bag with mixed hot and cold fillings',    'Hot Food',     6.50, 3.50, 5, '2026-03-18 13:15:00', '2026-03-18 13:45:00', '2026-03-18 13:30:00', 'available'),
(1, 'Spud Game Spicy Bag',       'Spicy fillings surplus bag with chilli options',         'Hot Food',     6.80, 3.80, 3, '2026-03-18 14:00:00', '2026-03-18 14:30:00', '2026-03-18 14:15:00', 'available'),
(1, 'Spud Game Vegetarian Bag',  'Vegetarian jacket potato bag with classic fillings',     'Vegetarian',   5.80, 3.20, 4, '2026-03-18 14:30:00', '2026-03-18 15:00:00', '2026-03-18 14:45:00', 'available'),
(2, 'Tacontent Mixed Bag',       'Mexican surplus bag with tacos and fillings',            'Hot Food',     7.50, 4.00, 4, '2026-03-18 14:45:00', '2026-03-18 15:15:00', '2026-03-18 15:00:00', 'available'),
(2, 'Tacontent Nachos Bag',      'Loaded nachos and toppings bag',                         'Hot Food',     6.20, 3.50, 3, '2026-03-18 15:15:00', '2026-03-18 15:45:00', '2026-03-18 15:30:00', 'available'),
(2, 'Tacontent Vegan Bag',       'Vegan Mexican bag with veg chilli and toppings',         'Vegan',        6.80, 3.80, 2, '2026-03-18 15:45:00', '2026-03-18 16:15:00', '2026-03-18 16:00:00', 'available'),
(3, 'Union Brew Bakery Bag',     'Bakery bag with toasties and pastries',                  'Bakery/Lunch', 5.20, 2.80, 6, '2026-03-18 15:45:00', '2026-03-18 16:15:00', '2026-03-18 16:00:00', 'available'),
(3, 'Union Brew Lunch Bag',      'Lunch grab-bag with baguettes and wraps',                'Lunch',        6.00, 3.20, 4, '2026-03-18 16:15:00', '2026-03-18 16:45:00', '2026-03-18 16:30:00', 'available'),
(3, 'Union Brew Vegetarian Bag', 'Vegetarian bakery bag with toasties and veggie options', 'Vegetarian',   5.00, 2.70, 3, '2026-03-18 16:45:00', '2026-03-18 17:15:00', '2026-03-18 17:00:00', 'available');

INSERT INTO bag_items (bag_id, food_id) VALUES
(1, 1), (1, 3), (1, 8), (1, 9),
(2, 7), (2, 3),
(3, 1), (3, 9), (3, 11),
(4, 13), (4, 14), (4, 18), (4, 19),
(5, 18), (5, 19), (5, 20),
(6, 16), (6, 18), (6, 19),
(7, 21), (7, 24), (7, 25),
(8, 22), (8, 23), (8, 26),
(9, 21), (9, 23), (9, 25);

INSERT INTO bag_dietary_tags (bag_id, dietary_tag_id) VALUES
(1, 4), (1, 5),
(2, 4), (2, 6),
(3, 2), (3, 5),
(4, 4), (4, 6),
(5, 5), (5, 6),
(6, 1), (6, 2), (6, 3),
(7, 5),
(8, 4), (8, 5),
(9, 2), (9, 5);

INSERT INTO user_dietary_preferences (user_id, dietary_tag_id) VALUES
(1, 2),
(2, 1),
(3, 7);

INSERT INTO user_allergen_exclusions (user_id, allergen_id) VALUES
(1, 7),
(2, 13),
(3, 11);

INSERT INTO reservations (user_id, bag_id, status, transaction_id, payment_status) VALUES
(1, 1, 'reserved',  'TXN-000101', 'paid'),
(2, 2, 'collected', 'TXN-000102', 'paid'),
(3, 3, 'reserved',  'TXN-000103', 'paid'),
(1, 4, 'collected', 'TXN-000104', 'paid'),
(2, 5, 'cancelled', 'TXN-000105', 'refunded'),
(3, 6, 'cancelled', 'TXN-000106', 'failed');
