import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="user", cascade="all, delete-orphan")
    jobs = relationship("GenerationJob", back_populates="user", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    brand = Column(String(255), nullable=True)
    category = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    source_url = Column(Text, nullable=False)
    raw_data = Column(JSON, nullable=True)
    structured_data = Column(JSON, nullable=True)
    status = Column(String(50), default="Extracting") # Extracting, Awaiting Approval, Approved, Failed
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="products")
    jobs = relationship("GenerationJob", back_populates="product", cascade="all, delete-orphan")
    generated_contents = relationship("GeneratedContent", back_populates="product", cascade="all, delete-orphan")

class GenerationJob(Base):
    __tablename__ = "generation_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    total_requested = Column(Integer, default=0)
    total_generated = Column(Integer, default=0)
    total_approved = Column(Integer, default=0)
    status = Column(String(50), default="Queued") # Queued, Extracting, Analyzing, Configuring, Generating, Validating, Needs Review, Completed, Failed
    progress = Column(Float, default=0.0) # 0 to 100
    
    # Generation Settings
    length = Column(String(50), default="Medium") # Short, Medium, Long
    tone = Column(String(50), default="Natural") # Natural, Casual, Professional, Conversational
    content_type = Column(String(100), default="Synthetic / Illustrative")
    rating_distribution = Column(JSON, default=dict) # e.g. {"5": 50, "4": 35, "3": 15}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="jobs")
    product = relationship("Product", back_populates="jobs")
    language_configs = relationship("LanguageConfiguration", back_populates="job", cascade="all, delete-orphan")
    generated_contents = relationship("GeneratedContent", back_populates="job", cascade="all, delete-orphan")
    exports = relationship("Export", back_populates="job", cascade="all, delete-orphan")

class LanguageConfiguration(Base):
    __tablename__ = "language_configurations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("generation_jobs.id"), nullable=False)
    language = Column(String(100), nullable=False)
    language_code = Column(String(20), nullable=False)
    script = Column(String(50), default="Standard") # Devanagari, Roman Hindi, Hinglish, Standard
    locale = Column(String(20), default="en-US")
    quantity_requested = Column(Integer, default=0)
    quantity_generated = Column(Integer, default=0)

    job = relationship("GenerationJob", back_populates="language_configs")

class GeneratedContent(Base):
    __tablename__ = "generated_content"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    job_id = Column(String(36), ForeignKey("generation_jobs.id"), nullable=False)
    reviewer_name = Column(String(255), nullable=False)
    rating = Column(Integer, default=5)
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(100), nullable=False)
    language_code = Column(String(20), nullable=False)
    script = Column(String(50), default="Standard")
    locale = Column(String(20), default="en-US")
    content_origin = Column(String(100), default="synthetic_ai_generated")
    quality_score = Column(Float, default=90.0)
    similarity_score = Column(Float, default=0.10)
    status = Column(String(50), default="Needs Review") # Pending, Approved, Rejected, Needs Review, Regenerated
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="generated_contents")
    job = relationship("GenerationJob", back_populates="generated_contents")

class Export(Base):
    __tablename__ = "exports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(36), ForeignKey("generation_jobs.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=True)
    export_mode = Column(String(50), default="combined") # combined, per_language, both
    file_type = Column(String(20), default="zip") # csv, zip
    file_path = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("GenerationJob", back_populates="exports")
