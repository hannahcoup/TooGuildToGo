# Database connection
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL for establishing connection
DATABASE_URL = "mysql+pymysql://username:password@localhost/db_name"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()