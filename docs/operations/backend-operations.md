# Backend Operations

## Deployment sequence

Run these commands from `backend/` with production environment variables set:

```bash
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Schema changes are managed exclusively by Alembic. The FastAPI application does
not create tables or perform data mutations during startup.

## Explicit data repairs

Use repairs only after reviewing the target database and taking the usual
backup precautions. Each repair is idempotent and writes only when selected:

```bash
python scripts/repair_data.py --city-separation
python scripts/repair_data.py --contractor-access
python scripts/repair_data.py --all
```

The command exits nonzero if a selected repair fails and records completion in
the application log. It never runs as part of the API process lifecycle.

## Test database

Backend tests require PostgreSQL because the production schema uses PostgreSQL
types such as `JSONB`. Set `TEST_DATABASE_URL` to an isolated PostgreSQL
database before running `pytest`; never point it at a shared development or
production database.
