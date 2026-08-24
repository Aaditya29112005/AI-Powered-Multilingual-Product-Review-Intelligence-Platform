from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.models import Product, GenerationJob, User, LanguageConfiguration
from app.schemas.schemas import BulkUrlRequest, BulkJobOut
from app.api.auth import get_current_user
from app.agents import ProductExtractionAgent
from app.workers.job_processor import JobProcessor

router = APIRouter(prefix="/bulk", tags=["Bulk Processing"])

@router.post("/process", response_model=BulkJobOut)
async def process_bulk_urls(
    req: BulkUrlRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    valid_urls = [u.strip() for u in req.urls if u.strip().startswith("http")]
    if not valid_urls:
        raise HTTPException(status_code=400, detail="No valid URLs provided.")

    product_ids = []
    agent1 = ProductExtractionAgent()

    for url in valid_urls:
        extracted = await agent1.execute(url)
        struct_data = extracted["structured_data"]

        product = Product(
            user_id=current_user.id,
            name=struct_data.get("name", "Bulk Product"),
            brand=struct_data.get("brand", "Brand"),
            category=struct_data.get("category", "General"),
            description=struct_data.get("description", ""),
            source_url=url,
            raw_data=extracted["raw_data"],
            structured_data=struct_data,
            status="Approved"
        )
        db.add(product)
        await db.commit()
        await db.refresh(product)

        # Create job
        job = GenerationJob(
            user_id=current_user.id,
            product_id=product.id,
            total_requested=100,
            status="Generating",
            progress=20.0,
            length="Medium",
            tone="Natural",
            content_type="Synthetic / Illustrative",
            rating_distribution={"5": 50, "4": 35, "3": 15}
        )
        db.add(job)
        await db.commit()
        await db.refresh(job)

        # Default multi-lingual config (English: 50, Hindi: 30, Hinglish: 20)
        for lang_name, code, script, qty in [
            ("English", "en", "Standard", 50),
            ("Hindi", "hi", "Devanagari", 30),
            ("Hinglish", "hi-en", "Hinglish", 20)
        ]:
            cfg = LanguageConfiguration(
                job_id=job.id,
                language=lang_name,
                language_code=code,
                script=script,
                quantity_requested=qty
            )
            db.add(cfg)
        
        await db.commit()

        # Run process
        await JobProcessor.process_job(db, job.id)
        product_ids.append(product.id)

    return BulkJobOut(
        total_products=len(valid_urls),
        completed=len(product_ids),
        processing=0,
        queued=0,
        failed=0,
        product_ids=product_ids
    )
