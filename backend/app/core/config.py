import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "Dayflow HRMS"
    API_V1_STR: str = "/api/v1"
    
    # Database connection string
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/dayflow",
        validation_alias="DATABASE_URL"
    )

    # Use pydantic-settings model configuration to load env files
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
