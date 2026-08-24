from typing import List, Dict, Any

class DuplicateDetectionAgent:
    """
    Agent 6 — Duplicate Detection Agent
    Calculates similarity scores across generated batch items using n-gram overlap and exact matching.
    Flags items exceeding similarity threshold for regeneration.
    """

    @staticmethod
    def calculate_similarity(text1: str, text2: str) -> float:
        if text1 == text2:
            return 1.0
        
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())

        if not words1 or not words2:
            return 0.0

        intersection = words1.intersection(words2)
        union = words1.union(words2)

        return len(intersection) / len(union)

    @classmethod
    def evaluate_batch(cls, items: List[Dict[str, Any]], threshold: float = 0.70) -> List[Dict[str, Any]]:
        n = len(items)
        for i in range(n):
            max_sim = 0.0
            for j in range(n):
                if i == j:
                    continue
                sim = cls.calculate_similarity(items[i].get("content", ""), items[j].get("content", ""))
                if sim > max_sim:
                    max_sim = sim

            items[i]["similarity_score"] = round(max_sim, 2)
            if max_sim > threshold:
                items[i]["duplicate_flag"] = True
            else:
                items[i]["duplicate_flag"] = False

        return items
