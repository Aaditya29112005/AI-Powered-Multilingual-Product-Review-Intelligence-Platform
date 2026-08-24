import os
import zipfile
from typing import List

class ZipService:
    """
    ZipService:
    Bundles generated CSV files into a downloadable ZIP archive.
    Preserves per-product directory structures.
    """

    @staticmethod
    def create_zip_archive(file_paths: List[str], zip_output_path: str) -> str:
        os.makedirs(os.path.dirname(zip_output_path), exist_ok=True)
        
        with zipfile.ZipFile(zip_output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for file_path in file_paths:
                if os.path.exists(file_path):
                    # Retain relative directory structure inside the zip
                    arcname = os.path.join(
                        os.path.basename(os.path.dirname(file_path)),
                        os.path.basename(file_path)
                    )
                    zipf.write(file_path, arcname=arcname)

        return zip_output_path
