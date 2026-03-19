# Database schema
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Bags
class Bag(Base):
    __tablename__ = "bags"

    id = Column(Integer, primary_key=True)
    description = Column(String)
    price = Column(Integer)
    quantity = Column(Integer)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))


# Vendors
class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)


# Dietary Tags
class DietaryTag(Base):
    __tablename__ = "dietary_tags"

    id = Column(Integer, primary_key=True)
    name = Column(String)


# Bags and Dietary Tags linking table
class BagDietaryTag(Base):
    __tablename__ = "bag_dietary_tags"

    bag_id = Column(Integer, ForeignKey("bags.id"), primary_key=True)
    dietary_tag_id = Column(Integer, ForeignKey("dietary_tags.id"), primary_key=True)