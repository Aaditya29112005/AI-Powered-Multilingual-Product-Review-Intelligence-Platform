from typing import Dict, Any
from app.services.scraper import ProductScraper

class ProductExtractionAgent:
    """
    Agent 1 — Product Extraction Agent
    Responsibilities:
    - Fetch and parse product page.
    - Extract available product information (JSON-LD, OpenGraph, DOM).
    - Return raw & structured normalized JSON.
    """
    
    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def execute(self, url: str) -> Dict[str, Any]:
        result = await ProductScraper.extract_from_url(url)
        return {
            "status": "success",
            "raw_data": result["raw_data"],
            "structured_data": result["structured_data"]
        }
