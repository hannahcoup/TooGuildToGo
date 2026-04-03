DROP VIEW  IF EXISTS view_user_safe_bags;
DROP VIEW  IF EXISTS view_user_order_history;
DROP VIEW  IF EXISTS view_available_bags;
DROP VIEW  IF EXISTS view_bag_allergens;

DROP TABLE IF EXISTS vendor_food_items;
DROP TABLE IF EXISTS user_allergen_exclusions;
DROP TABLE IF EXISTS user_dietary_preferences;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS bag_dietary_tags;
DROP TABLE IF EXISTS bag_items;
DROP TABLE IF EXISTS bags;
DROP TABLE IF EXISTS food_allergen;
DROP TABLE IF EXISTS food;
DROP TABLE IF EXISTS allergen;
DROP TABLE IF EXISTS dietary_tags;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL
                  CHECK (email LIKE '%@liverpool.ac.uk'),
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    location      VARCHAR(255) NOT NULL,
    email         VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE allergen (
    allergen_id INTEGER PRIMARY KEY,
    name        VARCHAR(120) NOT NULL UNIQUE,
    notes       VARCHAR(300)
);

CREATE TABLE dietary_tags (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE food (
    food_id        SERIAL PRIMARY KEY,
    name           VARCHAR(200) NOT NULL UNIQUE,
    description    VARCHAR(500),
    category       VARCHAR(100) NOT NULL,
    is_vegan       BOOLEAN NOT NULL DEFAULT FALSE,
    is_vegetarian  BOOLEAN NOT NULL DEFAULT FALSE,
    is_gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
    active         BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE food_allergen (
    food_id     INTEGER NOT NULL REFERENCES food(food_id) ON DELETE CASCADE,
    allergen_id INTEGER NOT NULL REFERENCES allergen(allergen_id),
    may_contain BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (food_id, allergen_id)
);

CREATE TABLE vendor_food_items (
    vendor_id INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    food_id   INT NOT NULL REFERENCES food(food_id) ON DELETE CASCADE,
    PRIMARY KEY (vendor_id, food_id)
);

CREATE TABLE bags (
    id                  SERIAL PRIMARY KEY,
    vendor_id           INT NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_name        VARCHAR(120) NOT NULL,
    description         TEXT,
    category            VARCHAR(80) NOT NULL,
    original_price      DECIMAL(6,2) NOT NULL CHECK (original_price > 0),
    discounted_price    DECIMAL(6,2) NOT NULL CHECK (discounted_price > 0),
    quantity            INT NOT NULL CHECK (quantity >= 0),
    pickup_window_start TIMESTAMP NOT NULL,
    pickup_window_end   TIMESTAMP NOT NULL,
    expires_at          TIMESTAMP NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('available', 'reserved', 'collected')),
    CHECK (discounted_price <= original_price),
    CHECK (pickup_window_end > pickup_window_start),
    CHECK (expires_at <= pickup_window_end)
);

CREATE TABLE bag_items (
    bag_id  INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    food_id INT NOT NULL REFERENCES food(food_id),
    PRIMARY KEY (bag_id, food_id)
);

CREATE TABLE bag_dietary_tags (
    bag_id         INT NOT NULL REFERENCES bags(id) ON DELETE CASCADE,
    dietary_tag_id INT NOT NULL REFERENCES dietary_tags(id),
    PRIMARY KEY (bag_id, dietary_tag_id)
);

CREATE TABLE user_dietary_preferences (
    user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dietary_tag_id INT NOT NULL REFERENCES dietary_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, dietary_tag_id)
);

CREATE TABLE user_allergen_exclusions (
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    allergen_id INT NOT NULL REFERENCES allergen(allergen_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, allergen_id)
);

CREATE TABLE reservations (
    id             SERIAL PRIMARY KEY,
    user_id        INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    bag_id         INT NOT NULL REFERENCES bags(id),
    status         VARCHAR(20) NOT NULL DEFAULT 'reserved',
    transaction_id VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'paid',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('reserved', 'collected', 'cancelled')),
    CHECK (payment_status IN ('paid', 'failed', 'refunded'))
);

