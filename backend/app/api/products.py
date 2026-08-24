from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.models import Product, User
from app.schemas.schemas import ProductExtractRequest, ProductUpdate, ProductOut
from app.api.auth import get_current_user
from app.agents import ProductExtractionAgent

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/extract", response_model=ProductOut)
async def extract_product(
    req: ProductExtractRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not req.url or not req.url.startswith("http"):
        raise HTTPException(status_code=400, detail="Invalid Product URL provided.")

    agent1 = ProductExtractionAgent()
    extracted = await agent1.execute(req.url)
    
    struct_data = extracted["structured_data"]

    product = Product(
        user_id=current_user.id,
        name=struct_data.get("name", "Product"),
        brand=struct_data.get("brand", "Example Brand"),
        category=struct_data.get("category", "General"),
        description=struct_data.get("description", ""),
        source_url=req.url,
        raw_data=extracted["raw_data"],
        structured_data=struct_data,
        status="Awaiting Approval"
    )

    db.add(product)
    await db.commit()
    await db.refresh(product)

    return product

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Product).where(Product.id == product_id, Product.user_id == current_user.id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product

@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    upd: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Product).where(Product.id == product_id, Product.user_id == current_user.id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    if upd.name is not None:
        product.name = upd.name
    if upd.brand is not None:
        product.brand = upd.brand
    if upd.category is not None:
        product.category = upd.category
    if upd.description is not None:
        product.description = upd.description
    if upd.status is not None:
        product.status = upd.status

    # Sync back into structured_data
    if not product.structured_data:
        product.structured_data = {}

    product.structured_data["name"] = product.name
    product.structured_data["brand"] = product.brand
    product.structured_data["category"] = product.category
    product.structured_data["description"] = product.description
    
    if upd.features is not None:
        product.structured_data["features"] = upd.features
    if upd.specifications is not None:
        product.structured_data["specifications"] = upd.specifications

    await db.commit()
    await db.refresh(product)
    return product

@router.get("", response_model=List[ProductOut])
async def list_products(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Product).where(Product.user_id == current_user.id).order_by(Product.created_at.desc()))
    return result.scalars().all()
