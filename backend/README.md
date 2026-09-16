# Civic Sathi — Backend API Engine

Core intelligence and API services engine for **Civic Sathi** (SIH 2026 Problem Statement PS26129).

- **Production API URL**: [https://civic-sathi-f7ml.onrender.com](https://civic-sathi-f7ml.onrender.com)
- **Framework**: FastAPI (Python 3.11+), Uvicorn ASGI
- **Database**: Neon Serverless PostgreSQL with SQLAlchemy 2.x & Alembic
- **AI Diagnostics**: Groq LLM (`allam-2-7b`), Sentence Transformers, Pillow, NumPy

---

## Core Systems & Architecture

### 1. Multi-Signal Vision Diagnostic Engine (`app/services/ai_service.py`)
- **Direct Image Signal Extraction**: Analyzes decoded image bytes to measure mean luminance, color saturation in HSV space, and Sobel gradient texture roughness.
- **Asphalt Road Surface Detection**: Identifies low-saturation monochrome gray distributions and surface depression boundaries typical of potholes and road cracks.
- **Night Lighting & High Contrast Detection**: Detects low ambient illumination with focused high-intensity light points.
- **Groq LLM Synthesis**: Combines visual signals and citizen context via Groq `allam-2-7b` for structured JSON output (`category`, `detected`, `confidence`, `evidence`, `safety_note`).
- **Deterministic Rule-Based Fallback**: Provides instant, reliable fallback classification if external network APIs are ever unreachable.

### 2. Self-Healing Sequence & Collision Prevention (`app/repositories/complaint_repository.py`)
- `get_next_public_id_number`: Checks PostgreSQL `complaint_public_seq` against `MAX(public_id_seq)` in the complaints table.
- If the sequence ever lags behind seeded or manually inserted records, it automatically advances to `max + 1` and calls `setval`, preventing `UniqueViolation` on `ix_complaints_public_id`.

### 3. Open Intake & Unified Authentication
- `POST /api/v1/complaints`: Utilizes `Depends(get_optional_user)` to allow both authenticated citizens and guest reporters to submit complaints without 401/403 errors.
- `POST /api/v1/auth/login`: Unified citizen login accepting all registered user roles.
- `POST /api/v1/auth/officer-login`: Dedicated administrative authentication for officers and commissioners.

### 4. Canonical Grouping & Deduplication (`app/services/canonical_grouping.py`)
- Automatically links complaints within a 500m radius and matching categories to canonical problem groups using cosine similarity over `sentence-transformers` embeddings.

---

## Live Database Statistics (Neon PostgreSQL)

| Entity | Record Count | Description |
|---|---|---|
| **Complaints** | **142,180+** | Multi-city complaint distribution (Bengaluru, Vadodara, Mumbai, Delhi) |
| **Wards** | **48** | Authentic geo-coded wards across 4 municipal corporations |
| **Systemic Issues** | **106** | Machine-learned recurring problem clusters |
| **Contractors** | **17** | Infrastructure vendors with tri-party performance scorecards |
| **Tenders** | **45** | Municipal tenders across draft, published, and awarded states |
| **Work Orders** | **11+** | Live execution contracts with GPS evidence and SLA monitoring |
| **Audit Logs** | **400+** | Immutable operational audit trails |

---

## Local Setup

### 1. Environment Configuration
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
Copy-Item .env.example .env
```

### 2. Database Migrations
```bash
alembic upgrade head
```

### 3. Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive documentation available at `http://localhost:8000/docs`.

---

## Key API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service and database health check |
| `POST` | `/api/v1/auth/login` | Unified citizen login |
| `POST` | `/api/v1/auth/officer-login` | Administrative officer login |
| `GET` | `/api/v1/auth/me` | Current authenticated user profile |
| `POST` | `/api/v1/complaints` | Public complaint submission |
| `GET` | `/api/v1/complaints` | Paginated complaint listing |
| `GET` | `/api/v1/complaints/{id}` | Detailed complaint record with timeline |
| `POST` | `/api/v1/ai/analyze-complaint` | Text AI categorization and triage |
| `POST` | `/api/v1/ai/analyze-image` | Multi-signal visual image analysis |
| `GET` | `/api/v1/analytics/public-map` | City-level aggregate map telemetry |
| `GET` | `/api/v1/analytics/environment/{city}` | Live weather and AQI metrics |