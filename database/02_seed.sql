-- standard 14 UK Allergens
INSERT INTO allergen (allergen_id, name, notes) VALUES
  (1, 'Celery', NULL),
  (2, 'Gluten', NULL),
  (3, 'Crustaceans', NULL),
  (4, 'Eggs', NULL),
  (5, 'Fish', NULL),
  (6, 'Lupin', NULL),
  (7, 'Milk', NULL),
  (8, 'Molluscs', NULL),
  (9, 'Mustard', NULL),
  (10, 'Nuts', 'Tree nuts'),
  (11, 'Peanuts', NULL),
  (12, 'Sesame', NULL),
  (13, 'Soya', NULL),
  (14, 'Sulphites', 'If > 10ppm');

INSERT INTO dietary_tags (name) VALUES
  ('Vegan'),('Vegetarian'),('Gluten-Free'),('Contains Meat'),('Contains Dairy'),('Spicy'),('Halal');

INSERT INTO vendors (name, location, email, password_hash) VALUES
  ('Spud Game',  'Guild of Students, 160 Mount Pleasant, Liverpool L3 5TR - Ground Floor',   'spudgame@guild.co.uk',  '1a32a8ec087dd4b24265c8ffbb1ede0bdc6a6968cfca00a7b588fd28b23b7422'),
  ('Tacontent',  'Guild of Students, 160 Mount Pleasant, Liverpool L3 5TR - First Floor',    'tacontent@guild.co.uk', '1a32a8ec087dd4b24265c8ffbb1ede0bdc6a6968cfca00a7b588fd28b23b7422'),
  ('Union Brew', 'Outside Guild of Students building - right side entrance, Mount Pleasant',  'unionbrew@guild.co.uk', '1a32a8ec087dd4b24265c8ffbb1ede0bdc6a6968cfca00a7b588fd28b23b7422');
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, password_hash) VALUES
  ('Sarah Wu', 'sarah.wu@liverpool.ac.uk', 'hashed_pw_a'),
  ('Hussein Shaverdi', 'hussein.shav@liverpool.ac.uk', 'hashed_pw_b'),
  ('John Doe', 'john.doe@liverpool.ac.uk', 'hashed_pw_c');

INSERT INTO food (food_id, name, description, category, is_vegan, is_vegetarian, is_gluten_free, active) VALUES
  -- Spud Game
  (1,'Baked Beans','Hot filling for jacket potatoes','Hot Filling',TRUE,TRUE,TRUE,TRUE),
  (2,'BBQ Sloppy Joe','Hot BBQ meat filling','Hot Filling',FALSE,FALSE,FALSE,TRUE),
  (3,'Garlic and Chilli Chicken','Chicken hot filling with garlic and chilli','Hot Filling',FALSE,FALSE,TRUE,TRUE),
  (4,'Butters','Butter topping/filling','Hot Filling',FALSE,TRUE,TRUE,TRUE),
  (5,'Seasoned','Seasoned potato option','Hot Filling',TRUE,TRUE,TRUE,TRUE),
  (6,'Garlic Vegan','Vegan garlic filling','Hot Filling',TRUE,TRUE,TRUE,TRUE),
  (7,'Firecracker','Spicy firecracker filling','Hot Filling',FALSE,FALSE,TRUE,TRUE),
  (8,'Tuna Mayo','Cold tuna mayonnaise filling','Cold Filling',FALSE,FALSE,TRUE,TRUE),
  (9,'Grated Cheese','Cold grated cheese topping','Cold Filling',FALSE,TRUE,TRUE,TRUE),
  (10,'Chicken Mayo','Cold chicken mayonnaise filling','Cold Filling',FALSE,FALSE,TRUE,TRUE),
  (11,'Coleslaw','Cold coleslaw filling','Cold Filling',FALSE,TRUE,TRUE,TRUE),
  (12,'Chef''s Choice','Mixed filling selected by chef','Cold Filling',FALSE,FALSE,FALSE,TRUE),

  -- Tacontent
  (13,'Ancho Beef Chilli','Beef chilli filling','Taco Filling',FALSE,FALSE,TRUE,TRUE),
  (14,'Chicken of the Week','Weekly chicken special filling','Taco Filling',FALSE,FALSE,TRUE,TRUE),
  (15,'LA Pulled Pork','Pulled pork filling','Taco Filling',FALSE,FALSE,TRUE,TRUE),
  (16,'Veg Chilli','Vegetarian chilli filling','Taco Filling',TRUE,TRUE,TRUE,TRUE),
  (17,'Chalula Hot Sauce','Spicy sauce topping','Topping',TRUE,TRUE,TRUE,TRUE),
  (18,'Salsa','Tomato salsa topping','Topping',TRUE,TRUE,TRUE,TRUE),
  (19,'Guacamole','Avocado topping','Topping',TRUE,TRUE,TRUE,TRUE),
  (20,'Sour Cream Cheese','Creamy topping','Topping',FALSE,TRUE,TRUE,TRUE),
  (21, 'Nachos', 'Corn tortilla chips', 'Base', TRUE, TRUE, FALSE, TRUE),

  -- Union Brew
  (22,'Cheese & Onion Toastie','Toasted sandwich with cheese and onion','Bakery/Lunch',FALSE,TRUE,FALSE,TRUE),
  (23,'Ham Cheese Baguette','Baguette with ham and cheese','Bakery/Lunch',FALSE,FALSE,FALSE,TRUE),
  (24,'Mozzarella & Tomato Baguette','Baguette with mozzarella and tomato','Bakery/Lunch',FALSE,TRUE,FALSE,TRUE),
  (25,'Ham & Cheese Toastie','Toasted sandwich with ham and cheese','Bakery/Lunch',FALSE,FALSE,FALSE,TRUE),
  (26,'Vegetarian Sausage Bun','Vegetarian sausage in a bun','Bakery/Lunch',FALSE,TRUE,FALSE,TRUE),
  (27,'Coronation Chicken Wrap','Wrap with coronation chicken filling','Wrap',FALSE,FALSE,FALSE,TRUE),
  
  (28, 'Blueberry Tulip Muffin', 'Blueberry muffin', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (29, 'Sticky Toffee Biscoff', 'Sticky toffee biscoff cake', 'Bakery/Lunch', TRUE, TRUE, FALSE, TRUE),
  (30, 'Lemon & White Chocolate Muffin', 'Lemon muffin with white chocolate', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (31, 'Doughnuts', 'Sweet doughnuts', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (32, 'Double Chocolate Muffin', 'Chocolate muffin', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (33, 'Rocky Road Traybake', 'Chocolate rocky road traybake', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (34, 'Cinnamon Swirl', 'Sweet cinnamon swirl pastry', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (35, 'Lemon Drizzle Traybake', 'Lemon drizzle cake traybake', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE),
  (36, 'Waffles', 'Sweet waffles', 'Bakery/Lunch', TRUE, TRUE, FALSE, TRUE),
  (37, 'Pain au Chocolat', 'Chocolate-filled pastry', 'Bakery/Lunch', FALSE, TRUE, FALSE, TRUE);


-- Make next food_id continue from the last inserted value
SELECT setval(pg_get_serial_sequence('food', 'food_id'),
  (SELECT MAX(food_id) FROM food));

INSERT INTO food_allergen (food_id, allergen_id, may_contain)
SELECT f.food_id, a.allergen_id, FALSE
FROM food f
CROSS JOIN allergen a;


-- FOOD ALLERGENS
-- BBQ Sloppy Joe
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 2
AND allergen_id IN (2, 9, 14);

-- Garlic & Chilli Chicken
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 3
AND allergen_id = 13;

-- Butters
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 4
AND allergen_id = 7;

-- Tuna Mayo
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 8
AND allergen_id IN (5, 4);

-- Grated Cheese
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 9
AND allergen_id = 7;

-- Chicken Mayo
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 10
AND allergen_id = 4;

-- Coleslaw
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 11
AND allergen_id IN (4, 9);

-- Ancho Beef Chilli
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 13
AND allergen_id IN (1, 14);

-- Chicken of the Week
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 14
AND allergen_id IN (9, 14);

-- LA Pulled Pork
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 15
AND allergen_id IN (9, 14);

-- Sour Cream Cheese
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 20
AND allergen_id = 7;

-- Cheese & Onion Toastie
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 22
AND allergen_id IN (2, 7);

-- Ham Cheese Baguette
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 23
AND allergen_id IN (2, 7);

-- Mozzarella & Tomato Baguette
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 24
AND allergen_id IN (2, 7);

-- Ham & Cheese Toastie
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 25
AND allergen_id IN (2, 7);

-- Vegetarian Sausage Bun
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 26
AND allergen_id IN (2, 13);

-- Coronation Chicken Wrap
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 27
AND allergen_id IN (2, 4, 9, 14);

-- Blueberry Tulip Muffin
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 28
AND allergen_id IN (2, 4, 7);

-- Sticky Toffee Biscoff (vegan)
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 29
AND allergen_id IN (2);

-- Lemon & White Chocolate Muffin
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 30
AND allergen_id IN (2, 4, 7);

-- Doughnuts
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 31
AND allergen_id IN (2, 4, 7);

-- Double Chocolate Muffin
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 32
AND allergen_id IN (2, 4, 7);

-- Rocky Road Traybake
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 33
AND allergen_id IN (2, 7);

-- Cinnamon Swirl
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 34
AND allergen_id IN (2, 4, 7);

-- Lemon Drizzle Traybake
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 35
AND allergen_id IN (2, 4, 7);

-- Waffles (vegan version)
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 36
AND allergen_id IN (2);

-- Pain au Chocolat
UPDATE food_allergen
SET may_contain = TRUE
WHERE food_id = 37
AND allergen_id IN (2, 7);


INSERT INTO vendor_food_items (vendor_id, food_id) VALUES
  (1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),
  (2,13),(2,14),(2,15),(2,16),(2,17),(2,18),(2,19),(2,20),(2,21),
  (3,22),(3,23),(3,24),(3,25),(3,26),(3,27),(3,28),(3,29),(3,30),(3,31),(3,32),(3,33),(3,34),(3,35),(3,36),(3,37);

INSERT INTO bags (vendor_id, product_name, description, category, original_price, discounted_price, quantity, pickup_window_start, pickup_window_end, expires_at, status) VALUES
  (4,'Spud Game Mixed Bag','Jacket potato bag with mixed hot and cold fillings','Hot Food',6.50,3.50,5,'2026-03-18 13:15:00','2026-03-18 13:45:00','2026-03-18 13:40:00','available'),
  (4,'Spud Game Spicy Bag','Spicy fillings surplus bag with chilli options','Hot Food',6.80,3.80,3,'2026-03-18 14:00:00','2026-03-18 14:30:00','2026-03-18 14:25:00','available'),
  (4,'Spud Game Vegetarian Bag','Vegetarian jacket potato bag with classic fillings','Vegetarian',5.80,3.20,4,'2026-03-18 14:30:00','2026-03-18 15:00:00','2026-03-18 14:55:00','available'),
    
  (5,'Tacontent Mixed Bag','Mexican surplus bag with tacos and fillings','Hot Food',7.50,4.00,4,'2026-03-18 14:45:00','2026-03-18 15:15:00','2026-03-18 15:10:00','available'),
  (5,'Tacontent Nachos Bag','Loaded nachos and toppings bag','Hot Food',6.20,3.50,3,'2026-03-18 15:15:00','2026-03-18 15:45:00','2026-03-18 15:40:00','available'),
  (5,'Tacontent Vegan Bag','Vegan Mexican bag with veg chilli and toppings','Vegan',6.80,3.80,2,'2026-03-18 15:45:00','2026-03-18 16:15:00','2026-03-18 16:10:00','available'),
    
  (6,'Union Brew Bakery Bag','Bakery bag with toasties and pastries','Bakery/Lunch',5.20,2.80,6,'2026-03-18 15:45:00','2026-03-18 16:15:00','2026-03-18 16:10:00','available'),
  (6,'Union Brew Lunch Bag','Lunch grab-bag with baguettes and wraps','Lunch',6.00,3.20,4,'2026-03-18 16:15:00','2026-03-18 16:45:00','2026-03-18 16:40:00','available'),
  (6,'Union Brew Vegetarian Bag','Vegetarian bakery bag with toasties and veggie options','Vegetarian',5.00,2.70,3,'2026-03-18 16:45:00','2026-03-18 17:15:00','2026-03-18 17:10:00','available'),
  (6,'Union Brew Pastry Bag','Selection of surplus pastries and sweet baked items','Bakery',6.00,2.50,5,'2026-03-18 17:15:00','2026-03-18 17:45:00','2026-03-18 17:40:00','available');

INSERT INTO bag_items (bag_id, food_id) VALUES
  (1,1),(1,3),(1,8),(1,9),
  (2,7),(2,3),
  (3,1),(3,9),(3,11),
  (4,13),(4,14),(4,18),(4,19),
  (5,21),(5,18),(5,19),(5,20),
  (6,16),(6,18),(6,19),
  (7,22),(7,25),(7,26),
  (8,23),(8,24),(8,27),
  (9,22),(9,24),(9,26),
  (10, 28),(10, 30),(10, 32),(10, 34),(10, 35),(10, 37); 

INSERT INTO bag_dietary_tags (bag_id, dietary_tag_id) VALUES
  (1,4),(1,5),(2,4),(2,6),
  (3,2),(3,5),(3,7),
  (4,4),(4,6),
  (5,5),(5,6),(5,7),
  (6,1),(6,2),(6,3),(6,7),
  (7,5),
  (8,4),(8,5),
  (9,2),(9,5),(9,7),
  (10, 2),(10, 5),(10,7);

INSERT INTO user_dietary_preferences (user_id, dietary_tag_id) VALUES
  (1,2),(2,1),(3,7);

INSERT INTO user_allergen_exclusions (user_id, allergen_id) VALUES
  (1,7),(2,13),(3,11);

INSERT INTO reservations (user_id, bag_id, status, transaction_id, payment_status) VALUES
  (1,1,'reserved','TXN-000101','paid'),
  (2,2,'collected','TXN-000102','paid'),
  (3,3,'reserved','TXN-000103','paid'),
  (1,4,'collected','TXN-000104','paid'),
  (2,5,'cancelled','TXN-000105','refunded'),
  (3,6,'cancelled','TXN-000106','refunded'),
  (3,10,'reserved','TXN-000107','pending');

