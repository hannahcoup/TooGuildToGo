-- ==========================================
-- MOCK DATA FOR GUILD FOOD SURPLUS SYSTEM
-- ==========================================



-- ========================
-- 14 ALLERGENS
-- ========================
INSERT INTO allergen (allergen_id, name, notes) VALUES
(1,  'Celery', NULL),
(2,  'Gluten', NULL),
(3,  'Crustaceans', NULL),
(4,  'Eggs', NULL),
(5,  'Fish', NULL),
(6,  'Lupin', NULL),
(7,  'Milk', NULL),
(8,  'Molluscs', NULL),
(9,  'Mustard', NULL),
(10, 'Nuts', 'Tree nuts'),
(11, 'Peanuts', NULL),
(12, 'Sesame', NULL),
(13, 'Soya', NULL),
(14, 'Sulphites', NULL); -- If > 10ppm


-- ========================
-- DIETARY TAGS
-- ========================
INSERT INTO dietary_tags (name) VALUES
('Vegan'),
('Vegetarian'),
('Gluten-Free'),
('Contains Meat'),
('Contains Dairy'),
('Spicy');

  
-- ========================
-- VENDORS
-- ========================
INSERT INTO vendors (name, location, email, password_hash) VALUES
('Spud Game', 'PLACEHOLDER', 'spudgame@guild.co.uk', 'hashed_pw_1'),
('Tacontent', 'PLACEHOLDER', 'tacontent@guild.co.uk', 'hashed_pw_2'),
('Union Brew', 'Outside Guild building - right side entrance', 'unionbrew@guild.co.uk', 'hashed_pw_3');

  
-- ========================
-- USERS
-- ========================
INSERT INTO users (name, email, password_hash) VALUES
('Sarah Wu', 'sarah.wu@liverpool.ac.uk', 'hashed_pw_a'),
('Hussein Shaverdi', 'hussein.shav@liverpool.ac.uk', 'hashed_pw_b'),
('Lucas Evans', 'lucas.evans@liverpool.ac.uk', 'hashed_pw_c');

  
-- ========================
-- FOOD ITEMS
-- ========================
INSERT INTO food_items (name) VALUES
('Baked Beans'),
('BBQ Sloppy Joe'),
('Garlic and Chilli Chicken'),
('Butters'),
('Seasoned'),
('Garlic Vegan'),
('Firecracker'),
('Tuna Mayo'),
('Grated Cheese'),
('Chicken Mayo'),
('Coleslaw'),
('Chef’s Choice'),
('Ancho Beef Chilli'),
('Chicken of the Week'),
('LA Pulled Pork'),
('Veg Chilli'),
('Chalula Hot Sauce'),
('Salsa'),
('Guacamole'),
('Sour Cream Cheese'),
('Cheese & Onion Toastie'),
('Ham Cheese Baguette'),
('Mozzarella & Tomato Baguette'),
('Ham & Cheese Toastie'),
('Vegetarian Sausage Bun'),
('Coronation Chicken Wrap');

  
-- ========================
-- FOOD DETAILS
-- ========================
INSERT INTO food (food_id, name, description, category, is_vegan, is_vegetarian, is_gluten_free, active) VALUES
(1, 'Baked Beans', 'Hot filling for jacket potatoes', 'Hot Filling', TRUE, TRUE, TRUE, TRUE),
(2, 'BBQ Sloppy Joe', 'Hot BBQ meat filling', 'Hot Filling', FALSE, FALSE, FALSE, TRUE),
(3, 'Garlic and Chilli Chicken', 'Chicken hot filling with garlic and chilli', 'Hot Filling', FALSE, FALSE, TRUE, TRUE),
(4, 'Butters', 'Butter topping/filling', 'Hot Filling', FALSE, TRUE, TRUE, TRUE),
(5, 'Seasoned', 'Seasoned potato option', 'Hot Filling', TRUE, TRUE, TRUE, TRUE),
(6, 'Garlic Vegan', 'Vegan garlic filling', 'Hot Filling', TRUE, TRUE, TRUE, TRUE),
(7, 'Firecracker', 'Spicy firecracker filling', 'Hot Filling', FALSE, FALSE, TRUE, TRUE),
(8, 'Tuna Mayo', 'Cold tuna mayonnaise filling', 'Cold Filling', FALSE, FALSE, TRUE, TRUE),
(9, 'Grated Cheese', 'Cold grated cheese topping', 'Cold Filling', FALSE, TRUE, TRUE, TRUE),
(10, 'Chicken Mayo', 'Cold chicken mayonnaise filling', 'Cold Filling', FALSE, FALSE, TRUE, TRUE),
(11, 'Coleslaw', 'Cold coleslaw filling', 'Cold Filling', FALSE, TRUE, TRUE, TRUE),
(12, 'Chef’s Choice', 'Mixed filling selected by chef', 'Cold Filling', FALSE, FALSE, FALSE, TRUE),
(13, 'Ancho Beef Chilli', 'Beef chilli filling', 'Taco Filling', FALSE, FALSE, TRUE, TRUE),
(14, 'Chicken of the Week', 'Weekly chicken special filling', 'Taco Filling', FALSE, FALSE, TRUE, TRUE),
(15, 'LA Pulled Pork', 'Pulled pork filling', 'Taco Filling', FALSE, FALSE, TRUE, TRUE),
(16, 'Veg Chilli', 'Vegetarian chilli filling', 'Taco Filling', TRUE, TRUE, TRUE, TRUE),
(17, 'Chalula Hot Sauce', 'Spicy sauce topping', 'Topping', TRUE, TRUE, TRUE, TRUE),
(18, 'Salsa', 'Tomato salsa topping', 'Topping', TRUE, TRUE, TRUE, TRUE),
(19, 'Guacamole', 'Avocado topping', 'Topping', TRUE, TRUE, TRUE, TRUE),
(20, 'Sour Cream Cheese', 'Creamy topping', 'Topping', FALSE, TRUE, TRUE, TRUE),
(21, 'Cheese & Onion Toastie', 'Toasted sandwich with cheese and onion', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
(22, 'Ham Cheese Baguette', 'Baguette with ham and cheese', 'Bakery/Lunch', FALSE, FALSE, FALSE, TRUE),
(23, 'Mozzarella & Tomato Baguette', 'Baguette with mozzarella and tomato', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
(24, 'Ham & Cheese Toastie', 'Toasted sandwich with ham and cheese', 'Bakery/Lunch', FALSE, FALSE, FALSE, TRUE),
(25, 'Vegetarian Sausage Bun', 'Vegetarian sausage in a bun', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
(26, 'Coronation Chicken Wrap', 'Wrap with coronation chicken filling', 'Wrap', FALSE, FALSE, FALSE, TRUE);

  
-- ========================
-- FOOD ALLERGEN LINKS
-- ========================
INSERT INTO food_allergen (food_id, allergen_id, may_contain) VALUES
(8, 4, FALSE),   -- tuna mayo may contain egg
(9, 7, FALSE),   -- grated cheese contains milk
(10, 4, FALSE),  -- chicke mayo may contain egg
(11, 4, FALSE),  -- coleslaw may contain egg
(20, 7, FALSE),  -- sour cream cheese contains milk
(21, 2, FALSE),  -- cheese & onion toastie contains gluten
(21, 7, FALSE),  -- cheese & onion toastie contains milk
(22, 2, FALSE),  -- ham cheese baguette contains gluten
(22, 7, FALSE),  -- ham cheese baguette contains milk
(23, 2, FALSE),  -- mozzarella & tomato Baguette contains gluten
(23, 7, FALSE),  -- mozzarella & tomato Baguette contains milk
(24, 2, FALSE),  -- ham & Cheese toastie contains gluten
(24, 7, FALSE),  -- ham & Cheese toastie contains milk
(25, 2, FALSE),  -- vegetarian sausage bun contains gluten
(26, 2, FALSE),  -- coronation Chicken Wrap contains gluten
(26, 4, TRUE);   -- may contain egg

  
-- ========================
-- BAGS
-- ========================
INSERT INTO bags (vendor_id, description, category, price, quantity, collection_time, status) VALUES

-- Spud Game (hot food, lunch rush leftovers)
(1, 'Jacket potato bag with mixed hot and cold fillings', 'Hot Food', 3.50, 5, '2026-03-18 13:30:00', 'available'),
(1, 'Spicy fillings surplus bag (firecracker & chilli options)', 'Hot Food', 3.80, 3, '2026-03-18 14:15:00', 'available'),
(1, 'Vegetarian jacket potato bag (beans, cheese, coleslaw)', 'Vegetarian', 3.20, 4, '2026-03-18 14:45:00', 'available'),

-- Tacontent (afternoon/evening surplus)
(2, 'Mexican surplus bag with tacos and fillings', 'Hot Food', 4.00, 4, '2026-03-18 15:00:00', 'available'),
(2, 'Loaded nachos and toppings bag', 'Snack/Hot Food', 3.50, 3, '2026-03-18 15:30:00', 'available'),
(2, 'Vegan Mexican bag (veg chilli, salsa, guacamole)', 'Vegan', 3.80, 2, '2026-03-18 16:00:00', 'available'),

-- Union Brew (bakery + lunch items)
(3, 'Bakery bag with toasties and pastries', 'Bakery/Lunch', 2.80, 6, '2026-03-18 16:00:00', 'available'),
(3, 'Lunch grab-bag with baguettes and wraps', 'Lunch', 3.20, 4, '2026-03-18 16:30:00', 'available'),
(3, 'Vegetarian bakery bag (toasties and veggie options)', 'Vegetarian', 2.70, 3, '2026-03-18 17:00:00', 'available');


  
-- ========================
-- BAG ITEMS
-- ========================
INSERT INTO bag_items (bag_id, food_item_id) VALUES

-- Bag 1 (Spud Game mixed)
(1, 1),  -- Baked Beans
(1, 3),  -- Garlic and Chilli Chicken
(1, 8),  -- Tuna Mayo
(1, 9),  -- Grated Cheese

-- Bag 2 (Spud Game spicy)
(2, 7),  -- Firecracker
(2, 3),  -- Garlic and Chilli Chicken

-- Bag 3 (Spud Game vegetarian)
(3, 1),  -- Baked Beans
(3, 9),  -- Grated Cheese
(3, 11), -- Coleslaw

-- Bag 4 (Tacontent mixed)
(4, 13), -- Ancho Beef Chilli
(4, 14), -- Chicken of the Week
(4, 18), -- Salsa
(4, 19), -- Guacamole

-- Bag 5 (Tacontent nachos)
(5, 18), -- Salsa
(5, 19), -- Guacamole
(5, 20), -- Sour Cream Cheese

-- Bag 6 (Tacontent vegan)
(6, 16), -- Veg Chilli
(6, 18), -- Salsa
(6, 19), -- Guacamole

-- Bag 7 (Union Brew bakery)
(7, 21), -- Cheese & Onion Toastie
(7, 24), -- Ham & Cheese Toastie
(7, 25), -- Vegetarian Sausage Bun

-- Bag 8 (Union Brew lunch)
(8, 22), -- Ham Cheese Baguette
(8, 23), -- Mozzarella & Tomato Baguette
(8, 26), -- Coronation Chicken Wrap

-- Bag 9 (Union Brew vegetarian)
(9, 21), -- Cheese & Onion Toastie
(9, 23), -- Mozzarella & Tomato Baguette
(9, 25); -- Vegetarian Sausage Bun

  
-- ========================
-- BAG DIETARY TAGS
-- ========================
INSERT INTO bag_dietary_tags (bag_id, dietary_tag_id) VALUES
(1, 4), -- Contains Meat
(1, 5), -- Contains Dairy

(2, 4), -- Contains Meat
(2, 6), -- Spicy

(3, 2), -- Vegetarian
(3, 5), -- Contains Dairy

(4, 4), -- Contains Meat
(4, 6), -- Spicy

(5, 5), -- Contains Dairy
(5, 6), -- Spicy

(6, 1), -- Vegan
(6, 2), -- Vegetarian
(6, 3), -- Gluten-Free

(7, 5), -- Contains Dairy

(8, 4), -- Contains Meat
(8, 5), -- Contains Dairy

(9, 2), -- Vegetarian
(9, 5); -- Contains Dairy

  
-- ========================
-- RESERVATIONS
-- ========================
INSERT INTO reservations (user_id, bag_id, status) VALUES
(1, 1, 'reserved'),
(2, 2, 'collected'),
(3, 3, 'reserved');
