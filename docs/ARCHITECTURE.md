# ReviewFlow AI — Architecture Specification

ReviewFlow AI is built with a modular 6-Agent AI Architecture:

1. **Agent 1 — Extraction Agent**: Parses DOM, OpenGraph, Microdata, and JSON-LD schema into normalized JSON.
2. **Agent 2 — Product Understanding Agent**: Constructs structured `ProductKnowledgeObject` (`target_audience`, `use_cases`, `key_features`, `supported_claims`, `claims_to_avoid`).
3. **Agent 3 — Multilingual Generation Agent**: Generates structured items grounded in product details across 19+ scripts (including Devanagari Hindi, Roman Hindi, Hinglish, English, Spanish, French).
4. **Agent 4 — Language Validation Agent**: Verifies language code, purity, and script match; triggers auto-regeneration if confidence is low.
5. **Agent 5 — Quality Control Agent**: Scores output quality (0–100) and checks relevance, clarity, and tone.
6. **Agent 6 — Duplicate Detection Agent**: Computes exact match, n-gram, and semantic similarity to prevent repeated content.

## Compliance Stamping
All generated synthetic items are explicitly marked with `content_origin = "synthetic_ai_generated"` and default to `verified_purchase = false`.

## Export Engine
Writes UTF-8 BOM (`utf-8-sig`) encoded CSV files and packages them into downloadable ZIP archives per product directory.
