# Maharashtra State Grievance Service — MOCK / DEMONSTRATION SYSTEM

> ⚠️ **This is an independent demonstration system created for Smart India Hackathon SIH26129.**
>
> It is **NOT** an officially deployed Government of Maharashtra service.
> It is **NOT** connected to any production government database.
> It exists solely to demonstrate cross-system interoperability through Sathi Setu.

---

## Purpose

This service acts as the **second independently built government system** in the Sathi Setu interoperability demonstration. It uses deliberately different:

- **Field names** (`grievance_ref`, `citizen_name`, `mobile_no`, `complaint_text`) vs Civic Sathi (`complaint_id`, `name`, `phone`, `description`)
- **Identifier scheme** (`MGS-YYYY-NNNNNN`) vs Civic Sathi (`CS-YYYY-NNNNN`)
- **Database** (its own SQLite/PostgreSQL schema)
- **Port** (default: 8002) vs Civic Sathi backend (8000) and Sathi Setu (8001)

Sathi Setu's `MockLegacyPortalConnector` maps this system's schema to the canonical data model, demonstrating schema heterogeneity resolution.

## Run the mock service

```bash
# Install dependencies
pip install -r requirements.txt

# Copy and edit environment
cp .env.example .env
# Edit DATABASE_URL if you want PostgreSQL instead of SQLite

# Seed demo data
python seed_demo.py

# Start the service on port 8002
uvicorn main:app --port 8002 --reload
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health |
| GET | `/grievances` | List all grievances |
| POST | `/grievances` | Submit a new grievance |
| GET | `/grievances/{ref}` | Get a specific grievance |
| PATCH | `/grievances/{ref}/status` | Update grievance status |

## Field schema (deliberately different from Civic Sathi)

```json
{
  "grievance_ref": "MGS-2026-000001",
  "citizen_name": "Rahul K.",
  "mobile_no": "9876543210",
  "contact_email": "rahul@example.com",
  "legacy_citizen_ref": "LEG-0042",
  "complaint_text": "Broken street light on MG Road since last week",
  "case_state": "RECEIVED",
  "district": "Pune",
  "priority": "HIGH"
}
```

## Sathi Setu integration

Sathi Setu ingests from this system using:

```
POST http://localhost:8001/v1/applications/ingest
{
  "source_system_key": "mock-grievance-service",
  "payload": <grievance JSON above>
}
```

The `MockLegacyPortalConnector` maps:
- `grievance_ref` → `source_reference`
- `citizen_name` → `citizen.name`
- `mobile_no` → `citizen.phone`
- `complaint_text` → `summary`
- `case_state` → `status`
