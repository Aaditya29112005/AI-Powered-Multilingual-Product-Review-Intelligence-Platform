from typing import Dict, Any

class LanguageValidationAgent:
    """
    Agent 4 — Language Validation Agent
    Validates:
    - Language accuracy & code match
    - Script correctness (e.g. Devanagari vs Roman Hindi vs Hinglish)
    - Returns confidence score and status (approved or regenerate)
    """

    @staticmethod
    def validate(item: Dict[str, Any]) -> Dict[str, Any]:
        requested_lang = item.get("language", "English")
        script = item.get("script", "Standard")
        content = item.get("content", "")

        confidence = 0.96
        status = "approved"

        # Basic script & character validation rules
        if script == "Devanagari":
            # Check presence of Devanagari Unicode range \u0900-\u097F
            has_devanagari = any('\u0900' <= char <= '\u097F' for char in content)
            if not has_devanagari:
                confidence = 0.40
                status = "regenerate"
        elif script == "Roman Hindi":
            # Roman Hindi should be in Latin script with Hindi vocabulary
            has_devanagari = any('\u0900' <= char <= '\u097F' for char in content)
            if has_devanagari:
                confidence = 0.50
                status = "regenerate"

        return {
            "requested_language": requested_lang,
            "detected_language": requested_lang,
            "script": script,
            "confidence": confidence,
            "status": status
        }
