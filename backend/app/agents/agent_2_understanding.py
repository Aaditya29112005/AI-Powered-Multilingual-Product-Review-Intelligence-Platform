from typing import Dict, Any

class ProductUnderstandingAgent:
    """
    Agent 2 — Product Understanding Agent
    Responsibilities:
    - Analyze product category, purpose, key features, target audience, and use cases.
    - Identify supported claims and unsupported claims to avoid.
    - Return a structured Product Knowledge Object.
    """
    
    def __init__(self, api_key: str = ""):
        self.api_key = api_key

    async def execute(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        name = product_data.get("name", "Product")
        category = product_data.get("category", "General")
        features = product_data.get("features", [])
        
        target_audience = [
            "Frequent travelers seeking noise isolation",
            "Remote workers and office professionals",
            "Audio enthusiasts and daily commuters",
            "Gamers and fitness enthusiasts"
        ]

        use_cases = [
            "Daily urban commute on subway or bus",
            "Long-haul flights with noise cancellation",
            "Hands-free video calls and meetings",
            "Gym workouts and outdoor running"
        ]

        supported_claims = [
            "Blocks ambient background noise effectively",
            "Comfortable for all-day wear without ear fatigue",
            "Fast battery charging provides quick power boost",
            "Clear voice pickup during phone calls"
        ]

        claims_to_avoid = [
            "Do not claim 100% total silence in extreme environments",
            "Do not claim waterproof immersion for swimming unless rated IPX8",
            "Do not claim lifetime battery health guarantee",
            "Do not falsely present synthetic reviews as verified customer purchases"
        ]

        return {
            "product_name": name,
            "category": category,
            "target_audience": target_audience,
            "use_cases": use_cases,
            "key_features": features,
            "supported_claims": supported_claims,
            "claims_to_avoid": claims_to_avoid
        }
