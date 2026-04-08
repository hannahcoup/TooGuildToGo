from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Text, Numeric, TIMESTAMP
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP)

class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    location = Column(String(255), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)

class DietaryTag(Base):
    __tablename__ = "dietary_tags"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

class Food(Base):
    __tablename__ = "food"
    food_id = Column(Integer, primary_key=True)
    name = Column(String(200), unique=True, nullable=False)
    description = Column(String(500))
    category = Column(String(100), nullable=False)
    is_vegan = Column(Boolean, nullable=False, default=False)
    is_vegetarian = Column(Boolean, nullable=False, default=False)
    is_gluten_free = Column(Boolean, nullable=False, default=False)
    active = Column(Boolean, nullable=False, default=True)

class VendorFoodItem(Base):
    __tablename__ = "vendor_food_items"
    vendor_id = Column(Integer, ForeignKey("vendors.id"), primary_key=True)
    food_id = Column(Integer, ForeignKey("food.food_id"), primary_key=True)

class Bag(Base):
    __tablename__ = "bags"
    id = Column(Integer, primary_key=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    product_name = Column(String(120), nullable=False)
    description = Column(Text)
    category = Column(String(80), nullable=False)
    original_price = Column(Numeric(6, 2), nullable=False)
    discounted_price = Column(Numeric(6, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    pickup_window_start = Column(TIMESTAMP, nullable=False)
    pickup_window_end = Column(TIMESTAMP, nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

class BagItem(Base):
    __tablename__ = "bag_items"
    bag_id = Column(Integer, ForeignKey("bags.id"), primary_key=True)
    food_id = Column(Integer, ForeignKey("food.food_id"), primary_key=True)

class BagDietaryTag(Base):
    __tablename__ = "bag_dietary_tags"
    bag_id = Column(Integer, ForeignKey("bags.id"), primary_key=True)
    dietary_tag_id = Column(Integer, ForeignKey("dietary_tags.id"), primary_key=True)

class Reservation(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bag_id = Column(Integer, ForeignKey("bags.id"), nullable=False)
    status = Column(String(20), nullable=False)
    transaction_id = Column(String(50))
    payment_status = Column(String(20), nullable=False)
    created_at = Column(TIMESTAMP)

class Allergen(Base):
    __tablename__ = "allergen"
    allergen_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    notes = Column(String(255))

class FoodAllergen(Base):
    __tablename__ = "food_allergen"
    food_id = Column(Integer, ForeignKey("food.food_id"), primary_key=True)
    allergen_id = Column(Integer, ForeignKey("allergen.allergen_id"), primary_key=True)
    contains = Column(Boolean, nullable=False, default=False)
    may_contain = Column(Boolean, nullable=False, default=False)


class UserAllergenExclusion(Base):
    __tablename__ = "user_allergen_exclusions"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    allergen_id = Column(Integer, ForeignKey("allergen.allergen_id"), primary_key=True)

class UserDietaryPreference(Base):
    __tablename__ = "user_dietary_preferences"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    dietary_tag_id = Column(Integer, ForeignKey("dietary_tags.id"), primary_key=True)
