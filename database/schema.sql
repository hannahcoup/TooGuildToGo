-- USERS (students)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- VENDORS (Guild outlets)
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    location VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);
-- FOOD ITEMS
CREATE TABLE food_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL
);
-- DIETARY TAGS
CREATE TABLE dietary_tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);
-- BAGS (surplus listings)
CREATE TABLE bags (
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    description TEXT,
    category VARCHAR(80),
    price DECIMAL(6,2) NOT NULL,
    quantity INT NOT NULL,
    collection_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (status IN ('available','reserved','collected'))
);
-- BAG ↔ FOOD ITEMS
CREATE TABLE bag_items (
    bag_id INT REFERENCES bags(id) ON DELETE CASCADE,
    food_item_id INT REFERENCES food_items(id),
    PRIMARY KEY (bag_id, food_item_id)
);
-- BAG ↔ DIETARY TAGS
CREATE TABLE bag_dietary_tags (
    bag_id INT REFERENCES bags(id) ON DELETE CASCADE,
    dietary_tag_id INT REFERENCES dietary_tags(id),
    PRIMARY KEY (bag_id, dietary_tag_id)
);
-- RESERVATIONS / ORDERS
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    bag_id INT REFERENCES bags(id),
    status VARCHAR(20) DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (status IN ('reserved','collected'))
);
