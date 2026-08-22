from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator
from backend.app.core.config import settings

# Create engine
# We check if it is postgres or fallback. Standard postgresql engine will be created.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()
