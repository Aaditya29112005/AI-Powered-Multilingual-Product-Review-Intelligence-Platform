import asyncio
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.models import GenerationJob, Product, LanguageConfiguration, GeneratedContent
from app.agents import (
    ProductExtractionAgent,
    ProductUnderstandingAgent,
    MultilingualGenerationAgent,
    LanguageValidationAgent,
    QualityControlAgent,
    DuplicateDetectionAgent
)

class JobProcessor:
    """
    JobProcessor:
    Executes the 6-Agent AI Pipeline asynchronously:
    1. Product Extraction
    2. Product Understanding
    3. Multilingual Generation (per requested language & script)
    4. Language Validation
    5. Quality Control
    6. Duplicate Detection
    """

    @classmethod
    async def process_job(cls, db: AsyncSession, job_id: str):
        # Fetch job
        result = await db.execute(select(GenerationJob).where(GenerationJob.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            print(f"JobProcessor error: Job {job_id} not found.")
            return

        try:
            # 1. Update status to Extracting
            job.status = "Extracting"
            job.progress = 10.0
            await db.commit()

            prod_result = await db.execute(select(Product).where(Product.id == job.product_id))
            product = prod_result.scalar_one_or_none()

            # Execute Agent 1 if product data isn't structured yet
            if not product.structured_data:
                agent1 = ProductExtractionAgent()
                extracted = await agent1.execute(product.source_url)
                product.raw_data = extracted["raw_data"]
                product.structured_data = extracted["structured_data"]
                product.name = extracted["structured_data"].get("name", product.name)
                product.brand = extracted["structured_data"].get("brand", product.brand)
                product.category = extracted["structured_data"].get("category", product.category)
                product.description = extracted["structured_data"].get("description", product.description)
                product.status = "Approved"
                await db.commit()

            # 2. Agent 2: Product Understanding
            job.status = "Analyzing"
            job.progress = 25.0
            await db.commit()

            agent2 = ProductUnderstandingAgent()
            knowledge_object = await agent2.execute(product.structured_data)

            # 3. Agent 3: Multilingual Generation
            job.status = "Generating"
            job.progress = 40.0
            await db.commit()

            lang_configs_res = await db.execute(
                select(LanguageConfiguration).where(LanguageConfiguration.job_id == job_id)
            )
            lang_configs = lang_configs_res.scalars().all()

            agent3 = MultilingualGenerationAgent()
            agent4 = LanguageValidationAgent()
            agent5 = QualityControlAgent()

            all_generated_items = []
            total_langs = len(lang_configs) or 1
            completed_langs = 0

            for lang_cfg in lang_configs:
                items = await agent3.execute(
                    product_data=product.structured_data,
                    language=lang_cfg.language,
                    language_code=lang_cfg.language_code,
                    script=lang_cfg.script,
                    locale=lang_cfg.locale,
                    quantity=lang_cfg.quantity_requested,
                    tone=job.tone,
                    length=job.length,
                    rating_dist=job.rating_distribution
                )

                # Validate & Quality Score each item
                for item in items:
                    val_res = agent4.validate(item)
                    item["confidence"] = val_res["confidence"]
                    
                    qc_res = agent5.evaluate(item, product.structured_data)
                    item["quality_score"] = qc_res["quality_score"]
                    item["status"] = qc_res["status"]

                all_generated_items.extend(items)
                lang_cfg.quantity_generated = len(items)

                completed_langs += 1
                job.progress = 40.0 + (30.0 * (completed_langs / total_langs))
                await db.commit()

            # 4. Agent 6: Duplicate Detection across batch
            job.status = "Validating"
            job.progress = 80.0
            await db.commit()

            all_generated_items = DuplicateDetectionAgent.evaluate_batch(all_generated_items)

            # 5. Persist all generated items into database
            total_gen = 0
            for item in all_generated_items:
                gen_content = GeneratedContent(
                    product_id=product.id,
                    job_id=job.id,
                    reviewer_name=item["reviewer_name"],
                    rating=item["rating"],
                    title=item["title"],
                    content=item["content"],
                    language=item["language"],
                    language_code=item["language_code"],
                    script=item["script"],
                    locale=item["locale"],
                    content_origin="synthetic_ai_generated",
                    quality_score=item["quality_score"],
                    similarity_score=item["similarity_score"],
                    status="Needs Review" if item["quality_score"] < 85.0 else "Approved"
                )
                db.add(gen_content)
                total_gen += 1

            # 6. Finalize Job
            job.total_generated = total_gen
            job.status = "Completed"
            job.progress = 100.0
            job.completed_at = datetime.utcnow()
            await db.commit()

        except Exception as e:
            print(f"JobProcessor error during execution for job {job_id}: {e}")
            job.status = "Failed"
            job.progress = 0.0
            await db.commit()
