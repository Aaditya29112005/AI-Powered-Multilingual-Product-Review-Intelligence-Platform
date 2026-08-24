# ReviewFlow AI

> **From Product URL to Multilingual Review Intelligence — Automatically.**

ReviewFlow AI is a production-grade AI-powered Multilingual Product Review Intelligence and Content Automation Platform.

---

## Key Features

1. **URL Product Extraction**: Accepts e-commerce URLs and automatically extracts JSON-LD, Microdata, OpenGraph metadata, and structured features.
2. **Product Profile Approval**: Enables human review, editing, and approval of extracted product attributes before generation.
3. **19+ Language & Script Selection**: Supports English, Devanagari Hindi, Romanized Hindi, Hinglish, Spanish, French, German, Japanese, Tamil, Telugu, Kannada, Bengali, and custom languages.
4. **Language-Wise Quantity Distribution**: Manual Mode and Auto AI Distribution Mode with live total counter validation (`Requested Total = Sum(Quantities)`).
5. **Modular 6-Agent AI Architecture**:
   - Agent 1: Product Extraction Agent
   - Agent 2: Product Understanding Agent
   - Agent 3: Multilingual Generation Agent
   - Agent 4: Language Validation Agent
   - Agent 5: Quality Control Agent (0–100 quality score)
   - Agent 6: Duplicate Detection Agent (n-gram & semantic distance similarity)
6. **Results Dashboard & Human Review**: Filterable language tabs (`ALL`, `ENGLISH`, `HINDI`, `HINGLISH`), compliance badges (`Synthetic / AI-Generated`), inline edit/approve/reject/regenerate.
7. **Mandatory Language Summary Table**: Tabular breakdown at the bottom of the results page (Requested, Generated, Approved, Needs Review per language).
8. **UTF-8 BOM CSV & ZIP Exporter**: Excel-compatible CSV exports with 3 export modes (Combined CSV, Per-Language CSVs, Both), separate product folders, and downloadable ZIP archives.
9. **Bulk URL Processing Queue**: Accepts batch URLs or CSV file uploads.

---

## Project Structure

```text
reviewflow-ai/
├── frontend/             # Next.js 14 App Router, TypeScript, Tailwind CSS
│   ├── src/
│   │   ├── app/          # App Router pages (Landing, Dashboard, Job Flow, Exports, Bulk)
│   │   ├── components/   # UI components (Navbar, LanguagePicker, ReviewCard, LanguageSummaryTable)
│   │   ├── config/       # Site configuration ("ReviewFlow AI")
│   │   └── lib/          # Types & API client
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   ├── config.py     # Settings & Branding
│   │   ├── agents/       # 6 AI Agents
│   │   ├── api/          # API Routers
│   │   ├── models/       # SQLAlchemy models
│   │   └── services/     # Scraper, CSV & ZIP Exporter
├── docs/                 # API & Architecture documentation
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Development)

### 1. Start Backend Server

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
