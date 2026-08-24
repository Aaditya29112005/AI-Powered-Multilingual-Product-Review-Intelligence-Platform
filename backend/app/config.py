import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Product Information (Single source of truth)
    PRODUCT_NAME: str = "ReviewFlow AI"
    TAGLINE: str = "From Product URL to Multilingual Review Intelligence — Automatically."
    
    # App Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "ReviewFlow AI Backend"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./reviewflow.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "reviewflow-ai-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # AI Engine Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o-mini")
    USE_SYNTHETIC_FALLBACK: bool = True # Ensures app works 100% out of the box if no key is provided
    
    # Quality & Similarity Thresholds
    DEFAULT_QUALITY_THRESHOLD: float = 75.0
    DEFAULT_SIMILARITY_THRESHOLD: float = 0.70
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
