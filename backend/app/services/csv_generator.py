import os
import csv
import re
from typing import List, Dict, Any

class CsvGenerator:
    """
    CSV Generator Service:
    - Writes UTF-8 with BOM (utf-8-sig) for Excel compatibility with non-ASCII text (Hindi, Devanagari, Tamil, etc.).
    - Strict 18-column standard schema compliance.
    - Handles per-product export directories.
    - Supports Export Modes: 'combined', 'per_language', 'both'.
    """

    CSV_FIELDS = [
        "product_id",
        "product_name",
        "brand",
        "source_url",
        "reviewer_name",
        "rating",
        "review_title",
        "review_content",
        "language",
        "language_code",
        "script",
        "locale",
        "content_origin",
        "quality_score",
        "similarity_score",
        "status",
        "generation_batch",
        "created_at"
    ]

    @staticmethod
    def slugify(text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r'[^\w\s-]', '', text)
        return re.sub(r'[\s_-]+', '-', text) or "product"

    @classmethod
    def generate_product_csvs(
        cls,
        product: Dict[str, Any],
        items: List[Dict[str, Any]],
        export_mode: str = "combined",
        output_dir: str = "exports"
    ) -> List[str]:
        
        prod_id = str(product.get("id", "prod_1"))
        prod_name = product.get("name", "Product")
        brand = product.get("brand", "")
        source_url = product.get("source_url", "")
        
        prod_slug = cls.slugify(prod_name)
        product_export_dir = os.path.join(output_dir, prod_slug)
        os.makedirs(product_export_dir, exist_ok=True)

        generated_file_paths = []

        # Prepare normalized row dictionaries
        rows = []
        for item in items:
            row = {
                "product_id": prod_id,
                "product_name": prod_name,
                "brand": brand,
                "source_url": source_url,
                "reviewer_name": item.get("reviewer_name", "Anonymous"),
                "rating": item.get("rating", 5),
                "review_title": item.get("title", ""),
                "review_content": item.get("content", ""),
                "language": item.get("language", "English"),
                "language_code": item.get("language_code", "en"),
                "script": item.get("script", "Standard"),
                "locale": item.get("locale", "en-US"),
                "content_origin": item.get("content_origin", "synthetic_ai_generated"),
                "quality_score": item.get("quality_score", 90.0),
                "similarity_score": item.get("similarity_score", 0.1),
                "status": item.get("status", "Approved"),
                "generation_batch": str(item.get("job_id", "batch_1")),
                "created_at": str(item.get("created_at", ""))
            }
            rows.append(row)

        # 1. Combined Export
        if export_mode in ["combined", "both"]:
            combined_file_path = os.path.join(product_export_dir, f"{prod_slug}-all-reviews.csv")
            cls.write_csv_file(combined_file_path, rows)
            generated_file_paths.append(combined_file_path)

        # 2. Per-Language Export
        if export_mode in ["per_language", "both"]:
            lang_groups: Dict[str, List[Dict[str, Any]]] = {}
            for row in rows:
                lang = cls.slugify(row["language"])
                if lang not in lang_groups:
                    lang_groups[lang] = []
                lang_groups[lang].append(row)

            for lang_slug, lang_rows in lang_groups.items():
                lang_file_path = os.path.join(product_export_dir, f"{prod_slug}-{lang_slug}-reviews.csv")
                cls.write_csv_file(lang_file_path, lang_rows)
                generated_file_paths.append(lang_file_path)

        return generated_file_paths

    @classmethod
    def write_csv_file(cls, file_path: str, rows: List[Dict[str, Any]]):
        # Use utf-8-sig for Excel BOM encoding
        with open(file_path, mode="w", encoding="utf-8-sig", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=cls.CSV_FIELDS)
            writer.writeheader()
            for row in rows:
                writer.writerow(row)
