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

7. **Seed demo data**
   ```bash
   python seed_master.py
   ```

8. **Start development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

9. **Access Swagger docs**
   Open http://localhost:8000/docs

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

- `DATABASE_URL`: Neon pooled connection string with sslmode=require
- `ENVIRONMENT`: production
- `CORS_ORIGINS`: https://civicsathi.vercel.app
- `OFFICER_API_KEY`: Strong random key
- `ENABLE_SEED_ENDPOINT`: false

### Health Check

GET `/api/v1/health`

## API Documentation

API is versioned at `/api/v1`. Full interactive docs available at `/docs`.

### Key Endpoints

- `POST /api/v1/complaints` - Submit citizen complaint
- `GET /api/v1/complaints` - List complaints (officer)
- `GET /api/v1/complaints/{id}/similar` - Find similar complaints
- `POST /api/v1/issues/rebuild` - Rebuild systemic issues
- `GET /api/v1/issues` - List systemic issues
- `GET /api/v1/analytics/summary` - Dashboard summary
- `GET /api/v1/analytics/map` - Map data for Leaflet

## Architecture

```
FastAPI Backend
├── API Layer (routes)
├── Service Layer (business logic)
├── Repository Layer (data access)
├── ML Pipeline (AI/ML processing)
└── PostgreSQL (Neon)
```

## License

MIT
