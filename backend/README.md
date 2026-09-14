# Civic Sathi Backend

Civic complaint intelligence platform backend built with FastAPI, PostgreSQL, and AI/ML.

## Tech Stack

- **Framework**: FastAPI
- **Database**: Neon PostgreSQL with SQLAlchemy 2.x
- **Validation**: Pydantic v2
- **ML/AI**: spaCy, Sentence Transformers, FAISS, scikit-learn
- **Analytics**: Pandas, NumPy

## Local Setup

### Prerequisites

- Python 3.11+
- Neon PostgreSQL account
- pip and virtualenv

### Installation Steps

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

4. **Configure environment**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and set your Neon DATABASE_URL and OFFICER_API_KEY.

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Run optional data repairs**
   ```bash
   python scripts/repair_data.py --city-separation
   # Or, only when the documented contractor account needs repair:
   python scripts/repair_data.py --contractor-access
   ```
   Repairs are never run automatically when the API starts. See
   [`../docs/operations/backend-operations.md`](../docs/operations/backend-operations.md)
   for the production sequence.

7. **Seed production & SIH demo data**
   ```bash
   # Base seeder (cities, departments, core accounts)
   python seed_master.py

   # Massive SIH Demo dataset (wards, issue clusters, contractors, tenders, bids, work orders, reviews, audit logs)
   python seed_sih_demo.py

   # Multi-city complaint balancer (adds 24,000 complaints across Mumbai, Delhi, Vadodara)
   python seed_city_complaints.py
   ```

8. **Start development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

9. **Access Swagger docs**
   Open http://localhost:8000/docs

## Current Live Database Statistics (Neon PostgreSQL)

As of September 2026, the live production database contains:

| Category | Record Count | Details |
|---|---|---|
| **Total Complaints** | **142,180** | Bengaluru (100,008), Vadodara (20,171), Mumbai (11,001), Delhi (11,000) |
| **Wards** | **48** | 12 geo-coded wards per city with authentic coordinates |
| **Systemic Issue Clusters** | **106** | Machine-learned clusters across 8 categories with risk scores (20–95) |
| **Contractors** | **17** | Major infrastructure companies with tri-party ratings |
| **Contractor Registrations** | **43** | City-specific verified licenses (Class A/B/C, APPROVED) |
| **Tenders** | **45** | Distributed across DRAFT, PUBLISHED, EVALUATING, AWARDED |
| **Bids** | **108** | Multi-vendor competitive quotes with technical proposals |
| **Work Orders** | **11** | Live execution contracts with SLA tracking and defect liability |
| **Contractor Reviews** | **102** | Tri-party performance ratings (Public Citizen, AI Audit, Municipal Officer) |
| **Platform Audit Logs** | **385** | Immutable compliance trails across administrative actions |
| **Cities** | **4** | Bengaluru (KA), Vadodara (GJ), Mumbai (MH), Delhi (DL) |
| **Departments** | **15** | Roads, Sanitation, Electricity, Water Supply, Health, etc. |

## Testing

```bash
pytest
pytest tests/test_complaints_api.py -v
pytest tests/test_ml_pipeline.py -v
```

## Deployment

See `render.yaml` for Render deployment configuration.

Run `alembic upgrade head` as an explicit deploy step before starting an API
process. Do not rely on application startup to create or modify the schema.

### Environment Variables for Production

- `DATABASE_URL`: Neon pooled connection string with `sslmode=require`
- `ENVIRONMENT`: `production`
- `CORS_ORIGINS`: `https://janmind-public.vercel.app,https://janmind-municipality.vercel.app,https://janmind-admin.vercel.app,https://janmind-contractor.vercel.app`
- `OFFICER_API_KEY`: Strong random key
- `ENABLE_SEED_ENDPOINT`: `false`

### Health Check

GET `/api/v1/health`

## API Documentation

API is versioned at `/api/v1`. Full interactive OpenAPI documentation available at `/docs`.

### Key Endpoints

- `POST /api/v1/complaints` - Submit citizen complaint (auto-assigned public ID)
- `GET /api/v1/complaints` - List complaints with city, department, and status filters
- `GET /api/v1/complaints/{id}/similar` - Find vector-similar duplicate complaints
- `GET /api/v1/admin/command-center` - Super-admin cross-city telemetry snapshot
- `GET /api/v1/issues` - List systemic ML-clustered civic issues
- `POST /api/v1/issues/rebuild` - Trigger ML systemic issue clustering pipeline
- `GET /api/v1/procurement/tenders` - List municipal procurement tenders
- `GET /api/v1/procurement/work-orders` - List active contractor work orders
- `GET /api/v1/procurement/contractors` - List registered contractors with tri-party scores
- `GET /api/v1/analytics/summary` - Multi-city aggregated analytics summary
- `GET /api/v1/analytics/map` - Geospatial GeoJSON map layer for Leaflet basemaps

## Architecture

```
FastAPI Backend
├── API Layer (app/api/v1/routes/)
│   ├── admin.py (Command center, user management, audit logs)
│   ├── complaints.py (Ingestion, assignment, tracking)
│   ├── issues.py (Systemic ML issue clusters)
│   ├── procurement.py (Tenders, bids, work orders, inspections)
│   ├── reputation.py (Gamification, XP, citizen badges)
│   └── analytics.py (Cross-city aggregate telemetry)
├── Service Layer (app/services/)
│   ├── complaint_service.py
│   ├── issue_service.py (HDBSCAN / TF-IDF clustering)
│   ├── reputation_service.py
│   └── procurement_service.py
├── Data Models (app/models/)
│   ├── complaint.py (Complaint, ComplaintAnalysis)
│   ├── issue.py (IssueCluster, IssueComplaint, RootCause)
│   ├── procurement.py (Tender, Bid, WorkOrder, Contractor, Review)
│   ├── user.py (User, Ward, Zone, Department)
│   └── audit.py (ModelRun, AuditLog)
└── Database
    └── Neon Serverless PostgreSQL (142k+ records)
```

## License

MIT
