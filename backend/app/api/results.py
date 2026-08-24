from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.models.models import GeneratedContent, GenerationJob, LanguageConfiguration, User
from app.schemas.schemas import ContentOut, ContentUpdate, BulkActionRequest, LanguageSummaryOut, LanguageSummaryItem
from app.api.auth import get_current_user

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/job/{job_id}", response_model=List[ContentOut])
async def get_job_results(
    job_id: str,
    language: Optional[str] = Query(None, description="Filter by language"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = select(GeneratedContent).where(GeneratedContent.job_id == job_id)
    if language and language.upper() != "ALL":
        query = query.where(GeneratedContent.language == language)
    if status:
        query = query.where(GeneratedContent.status == status)

    query = query.order_by(GeneratedContent.created_at.asc())
    res = await db.execute(query)
    return res.scalars().all()

@router.get("/job/{job_id}/summary", response_model=LanguageSummaryOut)
async def get_job_language_summary(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch requested language configs
    lang_cfg_res = await db.execute(select(LanguageConfiguration).where(LanguageConfiguration.job_id == job_id))
    lang_configs = lang_cfg_res.scalars().all()

    summaries = []
    tot_req = 0
    tot_gen = 0
    tot_app = 0
    tot_review = 0

    for cfg in lang_configs:
        # Query stats for this language
        gen_cnt_res = await db.execute(
            select(func.count(GeneratedContent.id))
            .where(GeneratedContent.job_id == job_id, GeneratedContent.language == cfg.language)
        )
        generated_cnt = gen_cnt_res.scalar() or 0

        app_cnt_res = await db.execute(
            select(func.count(GeneratedContent.id))
            .where(GeneratedContent.job_id == job_id, GeneratedContent.language == cfg.language, GeneratedContent.status == "Approved")
        )
        approved_cnt = app_cnt_res.scalar() or 0

        review_cnt_res = await db.execute(
            select(func.count(GeneratedContent.id))
            .where(GeneratedContent.job_id == job_id, GeneratedContent.language == cfg.language, GeneratedContent.status == "Needs Review")
        )
        needs_review_cnt = review_cnt_res.scalar() or 0

        tot_req += cfg.quantity_requested
        tot_gen += generated_cnt
        tot_app += approved_cnt
        tot_review += needs_review_cnt

        summaries.append(LanguageSummaryItem(
            language=cfg.language,
            language_code=cfg.language_code,
            requested=cfg.quantity_requested,
            generated=generated_cnt,
            approved=approved_cnt,
            needs_review=needs_review_cnt
        ))

    return LanguageSummaryOut(
        job_id=job_id,
        summaries=summaries,
        total_requested=tot_req,
        total_generated=tot_gen,
        total_approved=tot_app,
        total_needs_review=tot_review
    )

@router.put("/{content_id}", response_model=ContentOut)
async def update_result_item(
    content_id: str,
    upd: ContentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = await db.execute(select(GeneratedContent).where(GeneratedContent.id == content_id))
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found.")

    if upd.reviewer_name is not None:
        item.reviewer_name = upd.reviewer_name
    if upd.rating is not None:
        item.rating = upd.rating
    if upd.title is not None:
        item.title = upd.title
    if upd.content is not None:
        item.content = upd.content
    if upd.status is not None:
        item.status = upd.status

    await db.commit()
    await db.refresh(item)
    return item

@router.post("/bulk")
async def bulk_action(
    req: BulkActionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if req.action == "approve_all_high_confidence":
        res = await db.execute(
            select(GeneratedContent).where(GeneratedContent.quality_score >= 80.0)
        )
        items = res.scalars().all()
        for item in items:
            item.status = "Approved"
        await db.commit()
        return {"status": "success", "modified_count": len(items)}

    elif req.action == "approve_ids" and req.content_ids:
        res = await db.execute(
            select(GeneratedContent).where(GeneratedContent.id.in_(req.content_ids))
        )
        items = res.scalars().all()
        for item in items:
            item.status = "Approved"
        await db.commit()
        return {"status": "success", "modified_count": len(items)}

    elif req.action == "reject_ids" and req.content_ids:
        res = await db.execute(
            select(GeneratedContent).where(GeneratedContent.id.in_(req.content_ids))
        )
        items = res.scalars().all()
        for item in items:
            item.status = "Rejected"
        await db.commit()
        return {"status": "success", "modified_count": len(items)}

    return {"status": "noop", "modified_count": 0}
