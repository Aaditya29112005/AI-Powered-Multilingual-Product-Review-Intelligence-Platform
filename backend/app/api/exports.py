import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.models import GenerationJob, Product, GeneratedContent, Export, User
from app.schemas.schemas import ExportRequest, ExportOut
from app.api.auth import get_current_user
from app.services.csv_generator import CsvGenerator
from app.services.zip_service import ZipService

router = APIRouter(prefix="/exports", tags=["Exports"])

@router.post("/generate", response_model=ExportOut)
async def generate_export(
    req: ExportRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job_res = await db.execute(select(GenerationJob).where(GenerationJob.id == req.job_id, GenerationJob.user_id == current_user.id))
    job = job_res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Generation job not found.")

    prod_res = await db.execute(select(Product).where(Product.id == job.product_id))
    product = prod_res.scalar_one_or_none()

    content_res = await db.execute(select(GeneratedContent).where(GeneratedContent.job_id == job.id))
    items = content_res.scalars().all()

    item_dicts = [
        {
            "reviewer_name": item.reviewer_name,
            "rating": item.rating,
            "title": item.title,
            "content": item.content,
            "language": item.language,
            "language_code": item.language_code,
            "script": item.script,
            "locale": item.locale,
            "content_origin": item.content_origin,
            "quality_score": item.quality_score,
            "similarity_score": item.similarity_score,
            "status": item.status,
            "job_id": item.job_id,
            "created_at": item.created_at
        }
        for item in items
    ]

    prod_dict = {
        "id": product.id if product else "prod_1",
        "name": product.name if product else "Product",
        "brand": product.brand if product else "Brand",
        "source_url": product.source_url if product else "https://example.com"
    }

    # Generate CSV files
    csv_paths = CsvGenerator.generate_product_csvs(
        product=prod_dict,
        items=item_dicts,
        export_mode=req.export_mode,
        output_dir="exports"
    )

    # Package into ZIP archive
    zip_filename = f"{CsvGenerator.slugify(prod_dict['name'])}-export.zip"
    zip_path = os.path.join("exports", zip_filename)
    ZipService.create_zip_archive(csv_paths, zip_path)

    export_obj = Export(
        job_id=job.id,
        product_id=product.id if product else None,
        export_mode=req.export_mode,
        file_type="zip",
        file_path=zip_path,
        file_name=zip_filename
    )
    db.add(export_obj)
    await db.commit()
    await db.refresh(export_obj)

    download_url = f"/api/v1/exports/download/{export_obj.id}"

    return ExportOut(
        id=export_obj.id,
        job_id=export_obj.job_id,
        export_mode=export_obj.export_mode,
        file_type=export_obj.file_type,
        file_name=export_obj.file_name,
        download_url=download_url,
        created_at=export_obj.created_at
    )

@router.get("/download/{export_id}")
async def download_export(
    export_id: str,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Export).where(Export.id == export_id))
    export_obj = res.scalar_one_or_none()
    if not export_obj or not os.path.exists(export_obj.file_path):
        raise HTTPException(status_code=404, detail="Export file not found.")

    return FileResponse(
        path=export_obj.file_path,
        filename=export_obj.file_name,
        media_type="application/zip"
    )
