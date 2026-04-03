# Database connection
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database URL for establishing connection
DATABASE_URL = "postgresql://postgres:Bliskuz1212@localhost:5432/tooguildtogo"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
