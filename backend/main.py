from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from contextlib import asynccontextmanager
import logging

from backend.app.core.config import settings
from backend.app.db.session import engine, get_db
from backend.app.db.base import Base

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dayflow")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables in the database (simple staging setup)
    logger.info("Initializing database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        logger.warning("Proceeding without active DB connection. Ensure PostgreSQL is configured and running.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon/development stage
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": "1.0.0",
        "docs_url": f"{settings.API_V1_STR}/docs"
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check(db: Session = Depends(get_db)):
    """
    Verifies that the API is healthy and database connection configuration is correct.
    """
    try:
        # Run a simple SQL execution to check connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "project": settings.PROJECT_NAME
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database connection error: {str(e)}"
        )
