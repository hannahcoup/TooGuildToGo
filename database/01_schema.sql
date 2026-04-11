DROP VIEW IF EXISTS view_cart_items CASCADE;
DROP VIEW IF EXISTS view_vendor_reservations CASCADE;
DROP VIEW IF EXISTS view_user_reservations CASCADE;
DROP VIEW IF EXISTS view_user_safe_bags CASCADE;
DROP VIEW IF EXISTS view_user_order_history CASCADE;
DROP VIEW IF EXISTS view_available_bags CASCADE;
DROP VIEW IF EXISTS view_bag_allergens CASCADE;

DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS favourites CASCADE;
DROP TABLE IF EXISTS vendor_food_items CASCADE;
DROP TABLE IF EXISTS user_allergen_exclusions CASCADE;
DROP TABLE IF EXISTS user_dietary_preferences CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS bag_dietary_tags CASCADE;
DROP TABLE IF EXISTS bag_items CASCADE;
DROP TABLE IF EXISTS bags CASCADE;
DROP TABLE IF EXISTS food_allergen CASCADE;
DROP TABLE IF EXISTS food CASCADE;
DROP TABLE IF EXISTS allergen CASCADE;
DROP TABLE IF EXISTS dietary_tags CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL CHECK (email LIKE '%@liverpool.ac.uk'),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE allergen (
    allergen_id INTEGER PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    notes VARCHAR(300)
);

CREATE TABLE dietary_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE food (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    is_vegan BOOLEAN NOT NULL DEFAULT FALSE,
    is_vegetarian BOOLEAN NOT NULL DEFAULT FALSE,
    is_gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE food_allergen (
    food_id INTEGER NOT NULL REFERENCES food(food_id) ON DELETE CASCADE,
    allergen_id INTEGER NOT NULL REFERENCES allergen(allergen_id) ON DELETE CASCADE,
    may_contain BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (food_id, allergen_id)
);

CREATE TABLE vendor_food_items (
    vendor_id INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    food_id INT NOT NULL REFERENCES food(food_id) ON DELETE CASCADE,
    PRIMARY KEY (vendor_id, food_id)
);

CREATE TABLE bags (
    id SERIAL PRIMARY KEY,
    vendor_id INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_name VARCHAR(120) NOT NULL,
    description TEXT,
    category VARCHAR(80) NOT NULL,
    original_price DECIMAL(6,2) NOT NULL CHECK (original_price > 0),
    discounted_price DECIMAL(6,2) NOT NULL CHECK (discounted_price > 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    pickup_window_start TIMESTAMP NOT NULL,
    pickup_window_end TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('available', 'reserved', 'collected')),
    CHECK (discounted_price < original_price),
    CHECK (pickup_window_end > pickup_window_start),
    CHECK (expires_at >= pickup_window_start),
    CHECK (expires_at <= pickup_window_end)
);

CREATE TABLE bag_items (
    bag_id INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    food_id INT NOT NULL REFERENCES food(food_id) ON DELETE CASCADE,
    PRIMARY KEY (bag_id, food_id)
);

CREATE TABLE bag_dietary_tags (
    bag_id INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    dietary_tag_id INT NOT NULL REFERENCES dietary_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (bag_id, dietary_tag_id)
);

CREATE TABLE user_dietary_preferences (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dietary_tag_id INT NOT NULL REFERENCES dietary_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, dietary_tag_id)
);

CREATE TABLE user_allergen_exclusions (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allergen_id INT NOT NULL REFERENCES allergen(allergen_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergen_id)
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bag_id INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'reserved',
    transaction_id VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('reserved', 'collected', 'cancelled')),
    CHECK (payment_status IN ('pending', 'paid', 'refunded'))
);

CREATE TABLE favourites (
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bag_id INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, bag_id)
);

CREATE VIEW view_bag_allergens AS
SELECT DISTINCT
    b.id AS bag_id,
    b.product_name,
    v.id AS vendor_id,
    v.name AS vendor_name,
    a.allergen_id,
    a.name AS allergen_name,
    fa.may_contain
FROM bags b
JOIN vendors v
    ON v.id = b.vendor_id
JOIN bag_items bi
    ON bi.bag_id = b.id
JOIN food_allergen fa
    ON fa.food_id = bi.food_id
JOIN allergen a
    ON a.allergen_id = fa.allergen_id;

CREATE VIEW view_available_bags AS
SELECT
    b.id AS bag_id,
    b.vendor_id,
    v.name AS vendor_name,
    b.product_name,
    b.description,
    b.category,
    b.original_price,
    b.discounted_price,
    b.quantity,
    b.pickup_window_start,
    b.pickup_window_end,
    b.expires_at,
    b.status,
    b.created_at
FROM bags b
JOIN vendors v
    ON v.id = b.vendor_id
WHERE b.status = 'available'
  AND b.quantity > 0
  AND b.expires_at >= CURRENT_TIMESTAMP;

CREATE VIEW view_user_order_history AS
SELECT
    r.id AS reservation_id,
    u.id AS user_id,
    u.name AS user_name,
    u.email AS user_email,
    b.id AS bag_id,
    b.product_name,
    b.description,
    b.category,
    v.id AS vendor_id,
    v.name AS vendor_name,
    r.status,
    r.payment_status,
    r.transaction_id,
    r.created_at AS ordered_at
FROM reservations r
JOIN users u
    ON u.id = r.user_id
JOIN bags b
    ON b.id = r.bag_id
JOIN vendors v
    ON v.id = b.vendor_id;

CREATE VIEW view_user_reservations AS
SELECT
    r.id AS reservation_id,
    r.user_id,
    u.name AS user_name,
    u.email AS user_email,
    r.bag_id,
    b.product_name,
    b.description,
    b.category,
    b.discounted_price,
    b.pickup_window_start,
    b.pickup_window_end,
    b.status AS bag_status,
    v.id AS vendor_id,
    v.name AS vendor_name,
    r.status,
    r.payment_status,
    r.transaction_id,
    r.created_at
FROM reservations r
JOIN users u
    ON u.id = r.user_id
JOIN bags b
    ON b.id = r.bag_id
JOIN vendors v
    ON v.id = b.vendor_id;

CREATE VIEW view_vendor_reservations AS
SELECT
    r.id AS reservation_id,
    v.id AS vendor_id,
    v.name AS vendor_name,
    r.user_id,
    u.name AS user_name,
    u.email AS user_email,
    b.id AS bag_id,
    b.product_name,
    b.description,
    b.category,
    b.discounted_price,
    b.pickup_window_start,
    b.pickup_window_end,
    r.status,
    r.payment_status,
    r.transaction_id,
    r.created_at
FROM reservations r
JOIN bags b
    ON b.id = r.bag_id
JOIN vendors v
    ON v.id = b.vendor_id
JOIN users u
    ON u.id = r.user_id;

CREATE VIEW view_user_safe_bags AS
SELECT
    u.id AS user_id,
    u.name AS user_name,
    b.id AS bag_id,
    b.product_name,
    b.description,
    b.category,
    v.id AS vendor_id,
    v.name AS vendor_name,
    b.discounted_price,
    b.pickup_window_start,
    b.pickup_window_end
FROM users u
CROSS JOIN bags b
JOIN vendors v
    ON v.id = b.vendor_id
WHERE b.status = 'available'
  AND b.quantity > 0
  AND b.expires_at >= CURRENT_TIMESTAMP
  AND NOT EXISTS (
      SELECT 1
      FROM bag_items bi
      JOIN food_allergen fa
          ON fa.food_id = bi.food_id
      JOIN user_allergen_exclusions uae
          ON uae.allergen_id = fa.allergen_id
      WHERE bi.bag_id = b.id
        AND uae.user_id = u.id
  )
  AND (
      NOT EXISTS (
          SELECT 1
          FROM user_dietary_preferences udp
          WHERE udp.user_id = u.id
      )
      OR NOT EXISTS (
          SELECT 1
          FROM user_dietary_preferences udp
          WHERE udp.user_id = u.id
            AND NOT EXISTS (
                SELECT 1
                FROM bag_dietary_tags bdt
                WHERE bdt.bag_id = b.id
                  AND bdt.dietary_tag_id = udp.dietary_tag_id
            )
      )
  );
