from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.database import get_db
from app.models.models import GenerationJob, Product, LanguageConfiguration, User
from app.schemas.schemas import JobCreate, LanguageDistributionRequest, GenerationConfigUpdate, JobOut
from app.api.auth import get_current_user
from app.workers.job_processor import JobProcessor

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("", response_model=JobOut)
async def create_job(
    req: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prod_res = await db.execute(select(Product).where(Product.id == req.product_id, Product.user_id == current_user.id))
    product = prod_res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    job = GenerationJob(
        user_id=current_user.id,
        product_id=product.id,
        status="Configuring",
        progress=0.0,
        length="Medium",
        tone="Natural",
        content_type="Synthetic / Illustrative",
        rating_distribution={"5": 50, "4": 35, "3": 15}
    )

    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job

@router.post("/{job_id}/languages")
async def configure_languages(
    job_id: str,
    req: LanguageDistributionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_res = await db.execute(select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Validate sum of quantities
    total_sum = sum(lang.quantity for lang in req.languages)
    if total_sum <= 0:
        raise HTTPException(status_code=400, detail="Total requested content items must be greater than 0.")

    # Delete previous language configs for this job
    await db.execute(delete(LanguageConfiguration).where(LanguageConfiguration.job_id == job.id))

    for lang in req.languages:
        cfg = LanguageConfiguration(
            job_id=job.id,
            language=lang.language,
            language_code=lang.language_code,
            script=lang.script,
            locale=lang.locale,
            quantity_requested=lang.quantity,
            quantity_generated=0
        )
        db.add(cfg)

    job.total_requested = total_sum
    await db.commit()
    return {"status": "success", "total_requested": total_sum, "languages_count": len(req.languages)}

@router.put("/{job_id}/config")
async def update_generation_config(
    job_id: str,
    cfg: GenerationConfigUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_res = await db.execute(select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    job.length = cfg.length
    job.tone = cfg.tone
    job.content_type = cfg.content_type
    job.rating_distribution = cfg.rating_distribution

    await db.commit()
    return {"status": "success", "message": "Generation configuration updated."}

@router.post("/{job_id}/start")
async def start_job(
    job_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_res = await db.execute(select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    # Process job synchronously/in background
    background_tasks.add_task(JobProcessor.process_job, db, job.id)
    
    # Or immediate execution trigger for fast response
    await JobProcessor.process_job(db, job.id)

    return {"status": "started", "job_id": job.id}

@router.get("/{job_id}")
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_res = await db.execute(select(GenerationJob).where(GenerationJob.id == job_id, GenerationJob.user_id == current_user.id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    lang_res = await db.execute(select(LanguageConfiguration).where(LanguageConfiguration.job_id == job.id))
    langs = lang_res.scalars().all()

    lang_list = [
        {
            "id": l.id,
            "language": l.language,
            "language_code": l.language_code,
            "script": l.script,
            "locale": l.locale,
            "quantity_requested": l.quantity_requested,
            "quantity_generated": l.quantity_generated
        }
        for l in langs
    ]

    return {
        "id": job.id,
        "user_id": job.user_id,
        "product_id": job.product_id,
        "total_requested": job.total_requested,
        "total_generated": job.total_generated,
        "total_approved": job.total_approved,
        "status": job.status,
        "progress": job.progress,
        "length": job.length,
        "tone": job.tone,
        "content_type": job.content_type,
        "rating_distribution": job.rating_distribution,
        "created_at": job.created_at,
        "completed_at": job.completed_at,
        "languages": lang_list
    }

@router.get("", response_model=List[JobOut])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(GenerationJob).where(GenerationJob.user_id == current_user.id).order_by(GenerationJob.created_at.desc()))
    jobs = result.scalars().all()
    
    job_outs = []
    for j in jobs:
        lang_res = await db.execute(select(LanguageConfiguration).where(LanguageConfiguration.job_id == j.id))
        langs = lang_res.scalars().all()
        lang_list = [
            {
                "language": l.language,
                "language_code": l.language_code,
                "script": l.script,
                "quantity_requested": l.quantity_requested
            }
            for l in langs
        ]
        
        job_dict = {
            "id": j.id,
            "user_id": j.user_id,
            "product_id": j.product_id,
            "total_requested": j.total_requested,
            "total_generated": j.total_generated,
            "total_approved": j.total_approved,
            "status": j.status,
            "progress": j.progress,
            "length": j.length,
            "tone": j.tone,
            "content_type": j.content_type,
            "rating_distribution": j.rating_distribution or {},
            "created_at": j.created_at,
            "completed_at": j.completed_at,
            "languages": lang_list
        }
        job_outs.append(job_dict)

    return job_outs
