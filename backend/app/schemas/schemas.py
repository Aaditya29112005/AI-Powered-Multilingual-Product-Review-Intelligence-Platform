from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# --- Product Schemas ---
class ProductExtractRequest(BaseModel):
    url: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    features: Optional[List[str]] = None
    specifications: Optional[Dict[str, str]] = None
    price: Optional[str] = None
    currency: Optional[str] = None
    status: Optional[str] = None

class ProductOut(BaseModel):
    id: str
    user_id: str
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    source_url: str
    raw_data: Optional[Dict[str, Any]] = None
    structured_data: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Language Config Schemas ---
class LanguageConfigItem(BaseModel):
    language: str
    language_code: str
    script: str = "Standard"
    locale: str = "en-US"
    quantity: int = Field(ge=0, description="Quantity requested for this language")

class LanguageDistributionRequest(BaseModel):
    job_id: str
    languages: List[LanguageConfigItem]
    distribution_mode: str = "manual" # manual or auto

# --- Generation Configuration ---
class GenerationConfigUpdate(BaseModel):
    length: str = "Medium" # Short, Medium, Long
    tone: str = "Natural" # Natural, Casual, Professional, Conversational
    content_type: str = "Synthetic / Illustrative"
    rating_distribution: Dict[str, int] = Field(default_factory=lambda: {"5": 50, "4": 35, "3": 15})

# --- Job Schemas ---
class JobCreate(BaseModel):
    product_id: str

class JobOut(BaseModel):
    id: str
    user_id: str
    product_id: str
    total_requested: int
    total_generated: int
    total_approved: int
    status: str
    progress: float
    length: str
    tone: str
    content_type: str
    rating_distribution: Dict[str, Any]
    created_at: datetime
    completed_at: Optional[datetime] = None
    languages: List[Dict[str, Any]] = []

    class Config:
        from_attributes = True

class JobProgressOut(BaseModel):
    job_id: str
    status: str
    progress: float
    current_agent: str
    current_language: str
    completed_quantity: int
    total_quantity: int

# --- Content Schemas ---
class ContentUpdate(BaseModel):
    reviewer_name: Optional[str] = None
    rating: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None
    status: Optional[str] = None # Approved, Rejected, Needs Review, Regenerated

class ContentOut(BaseModel):
    id: str
    product_id: str
    job_id: str
    reviewer_name: str
    rating: int
    title: str
    content: str
    language: str
    language_code: str
    script: str
    locale: str
    content_origin: str
    quality_score: float
    similarity_score: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class BulkActionRequest(BaseModel):
    action: str # approve_all_high_confidence, regenerate_low_quality, approve, reject
    content_ids: Optional[List[str]] = None

class LanguageSummaryItem(BaseModel):
    language: str
    language_code: str
    requested: int
    generated: int
    approved: int
    needs_review: int

class LanguageSummaryOut(BaseModel):
    job_id: str
    summaries: List[LanguageSummaryItem]
    total_requested: int
    total_generated: int
    total_approved: int
    total_needs_review: int

# --- Export Schemas ---
class ExportRequest(BaseModel):
    job_id: str
    export_mode: str = "combined" # combined, per_language, both

class ExportOut(BaseModel):
    id: str
    job_id: str
    export_mode: str
    file_type: str
    file_name: str
    download_url: str
    created_at: datetime

# --- Bulk URL Processing Schemas ---
class BulkUrlRequest(BaseModel):
    urls: List[str]

class BulkJobOut(BaseModel):
    total_products: int
    completed: int
    processing: int
    queued: int
    failed: int
    product_ids: List[str]
