-- dietary concerns
CREATE TABLE food (
  food_id        INTEGER PRIMARY KEY,
  name           VARCHAR(200) NOT NULL UNIQUE,
  description    VARCHAR(500),
  category       VARCHAR(100),
  is_vegan       BOOLEAN NOT NULL DEFAULT FALSE,
  is_vegetarian  BOOLEAN NOT NULL DEFAULT FALSE,
  is_gluten_free BOOLEAN NOT NULL DEFAULT FALSE,
  active         BOOLEAN NOT NULL DEFAULT TRUE
);

-- UK Standard 14 allergens
CREATE TABLE allergen (
  allergen_id INTEGER PRIMARY KEY,
  name        VARCHAR(120) NOT NULL UNIQUE,
  notes       VARCHAR(300)
);

-- food can contain many allergens (JOIN)
CREATE TABLE food_allergen (
  food_id     INTEGER NOT NULL,
  allergen_id INTEGER NOT NULL,
  may_contain BOOLEAN NOT NULL DEFAULT FALSE, -- true if "may contain traces"
  PRIMARY KEY (food_id, allergen_id),
  FOREIGN KEY (food_id) REFERENCES food(food_id),
  FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
);

-- helpful indexes
CREATE INDEX idx_food_category ON food(category);
CREATE INDEX idx_food_allergen_allergen ON food_allergen(allergen_id);
