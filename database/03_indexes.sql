CREATE INDEX idx_food_category              ON food(category);
CREATE INDEX idx_food_allergen_food         ON food_allergen(food_id);
CREATE INDEX idx_food_allergen_allergen     ON food_allergen(allergen_id);

CREATE INDEX idx_bags_vendor                ON bags(vendor_id);
CREATE INDEX idx_bags_status                ON bags(status);
CREATE INDEX idx_bags_pickup_start          ON bags(pickup_window_start);
CREATE INDEX idx_bags_pickup_end            ON bags(pickup_window_end);
CREATE INDEX idx_bags_expires_at            ON bags(expires_at);
CREATE INDEX idx_bags_product_name          ON bags(product_name);

CREATE INDEX idx_bag_items_food             ON bag_items(food_id);
CREATE INDEX idx_bag_dtags_tag              ON bag_dietary_tags(dietary_tag_id);

CREATE INDEX idx_user_preferences_tag       ON user_dietary_preferences(dietary_tag_id);
CREATE INDEX idx_user_exclusions_allergen   ON user_allergen_exclusions(allergen_id);

CREATE INDEX idx_reservations_user          ON reservations(user_id);
CREATE INDEX idx_reservations_bag           ON reservations(bag_id);
CREATE INDEX idx_reservations_status        ON reservations(status);
CREATE INDEX idx_reservations_payment       ON reservations(payment_status);
