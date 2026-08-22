import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError
from typing import Generator
from backend.app.core.config import settings

logger = logging.getLogger("dayflow")

def get_engine():
    db_url = settings.DATABASE_URL
    
    # If the URL is explicitly SQLite, return the SQLite engine directly
    if "sqlite" in db_url:
        return create_engine(db_url, connect_args={"check_same_thread": False})
    
    try:
        # Create a PostgreSQL engine and attempt to connect to verify it is online
        pg_engine = create_engine(db_url, pool_pre_ping=True)
        with pg_engine.connect() as conn:
            pass
        logger.info("Database Engine: PostgreSQL connection verified and active.")
        return pg_engine
    except OperationalError as e:
        # Graceful fallback to SQLite to prevent crashing and blockages during testing
        fallback_url = "sqlite:///./dayflow.db"
        logger.warning(
            f"Database Engine: Failed to reach PostgreSQL at {db_url}. "
            f"Error details: {e.orig if hasattr(e, 'orig') else e}. "
            f"Falling back to local SQLite database at '{fallback_url}'..."
        )
        return create_engine(fallback_url, connect_args={"check_same_thread": False})

# Initialize engine
engine = get_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
