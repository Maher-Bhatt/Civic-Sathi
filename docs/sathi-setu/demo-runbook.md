# Sathi Setu — Demo Runbook

## Purpose

This runbook documents the 23-step demonstration flow for the Sathi Setu
prototype submitted for SIH26129 (Smart India Hackathon, 2026).

**NOT an official Government of Maharashtra deployment.**
All identities, systems, and data are synthetic.

---

## Prerequisites

### 1. Start the Sathi Setu service

```bash
cd sathi-setu
pip install -r requirements.txt
cp .env.example .env          # Edit SATHI_SETU_API_KEY with a real secret
python scripts/init_demo.py   # Seed connected systems and connector configs
uvicorn app.main:app --port 8001 --reload
```

### 2. (Optional) Start the mock Maharashtra State Grievance Service

```bash
cd mock-grievance-service
pip install -r requirements.txt
python seed_demo.py
uvicorn main:app --port 8002 --reload
```

### 3. Start Civic Sathi backend

```bash
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --port 8000 --reload
```

---

## Demo Steps

### Part A — System Catalogue

**Step 1**: Open `http://localhost:8001/` — the Sathi Setu console loads.

**Step 2**: Click **API Catalogue**. Two systems appear:
- **Civic Sathi** — badge: `REFERENCE SYSTEM`
- **Maharashtra State Grievance Service** — badge: `MOCK / DEMO`

*Explain:* These are independently deployed systems with different field schemas.
The catalogue is the entry point for any new government system to connect.

**Step 3**: Click **Onboard System** and walk through the 7-step wizard.
Show that each step collects schema-specific information and that the final
step explicitly says "Sandbox" — not live government activation.

---

### Part B — Identity Resolution

**Step 4**: Click **Identity Resolution**.

**Step 5**: Fill the **Civic Sathi** ingest form with:
- Name: `Rahul Kumar`
- Phone: `9876543210`
- Email: `rahul.demo@example.com`
- Complaint: `Pothole on Tilak Road blocking traffic near Shivaji Nagar`

Click **Submit to Sathi Setu**.

*Result*: A `SAT-ID-XXXXXX` canonical identity and `SAT-2026-XXXXXX` unified ID are created.

**Step 6**: Fill the **Mock Grievance Service** ingest form with:
- citizen_name: `Rahul K.` *(slightly different)*
- mobile_no: `9876543210` *(same number)*
- grievance_ref: `MGS-2026-000001`
- complaint_text: `Broken street light on MG Road near Shivaji Nagar signal`

Click **Submit to Sathi Setu**.

*Result*: Same `SAT-ID-XXXXXX` identity is matched via phone fingerprint
despite the different name and different field names. Match reason is shown.

*Explain*: Sathi Setu resolved one canonical identity from two differently-shaped
payloads. The source IDs from both systems are retained in the unified application.

---

### Part C — Consent Enforcement (Sathi Sahamati)

**Step 7**: Click **Sathi Sahamati** in the navigation.

**Step 8**: In **Try Cross-System Access**, enter the `SAT-ID-XXXXXX` from above.
Click **Try Cross-System Access**.

*Result*: `403 FORBIDDEN — Sathi Sahamati consent is required for this cross-system access.`

*Explain*: This is **server-side enforcement**, not a UI trick. The API returns 403.

**Step 9**: In **Request Consent**, enter the same canonical ID.
Select source: Civic Sathi, target: Maharashtra State Grievance Service.
Purpose: `address-sharing`. Click **Request Consent**.

*Result*: A consent ID is returned, status is `PENDING`.

**Step 10**: Try cross-system access again. Still `403` because consent is `PENDING`.

**Step 11**: Enter the consent ID in the **Consent Decision** panel. Click **✓ Grant**.

*Result*: Status becomes `GRANTED`.

**Step 12**: Try cross-system access again. Now returns the shared profile with the canonical ID and name.

**Step 13**: Click **↩ Revoke** with the same consent ID.

*Result*: Status becomes `REVOKED`.

**Step 14**: Try cross-system access again. Returns `403` — revocation is immediate.

---

### Part D — Unified Tracking

**Step 15**: Click **Unified Tracking**.

**Step 16**: Enter the `SAT-2026-XXXXXX` ID from Step 5. Click **Lookup**.

*Result*: Shows the unified application with:
- Source system: `civic-sathi` with reference `CS-DEMO-XXXXXX`
- Source system: `mock-grievance-service` with reference `MGS-2026-000001`

*Explain*: One citizen's grievance is linked across both systems under one unified ID.
Neither source ID was replaced — both are retained.

---

### Part E — Data Quality

**Step 17**: Click **Identity Resolution** again.

**Step 18**: In the Mock Grievance Service form, enter:
- citizen_name: `Completely Different Person` *(intentionally different)*
- mobile_no: `9876543210` *(same phone as Rahul Kumar)*

Click **Submit to Sathi Setu**.

*Result*: A data quality issue `POSSIBLE_IDENTITY_CONFLICT` is raised with severity `HIGH`.

**Step 19**: Click **Data Quality Queue**. The issue appears as `OPEN`.

**Step 20**: Click **Resolve**. Select action `KEPT_SEPARATE`. Add resolution notes.

*Result*: Issue status changes to `KEPT_SEPARATE`. This action is recorded in the audit trail.

---

### Part F — Audit Trail and Events

**Step 21**: Click **Audit Trail**. Shows all 12+ actions taken during the demo:
- `APPLICATION_INGESTED` ×2
- `CONSENT_REQUESTED`, `CONSENT_GRANTED`, `CONSENT_REVOKED`, `CONSENTED_PROFILE_ACCESSED`
- `STATUS_PROPAGATED`
- `DATA_QUALITY_RESOLVED`
- `CONNECTOR_MAPPING_UPDATED`

Each entry has: actor, action, resource, correlation ID.

**Step 22**: Click **Events**. Shows the event stream:
- `identity_matched`, `submitted`, `consent_granted`, `consent_revoked`, `status_changed`

*Explain*: Events are durable records with correlation IDs. In production,
these would trigger downstream notifications via PostgreSQL NOTIFY or a message bus.

---

### Part G — Sathi Pehchaan

**Step 23**: Click **Sathi Pehchaan**. Shows:
- Architecture diagram: ONE IDENTITY → multiple connected services
- Explanation of OAuth2/OIDC-compatible design boundary
- Demo identities table showing canonical IDs linked to multiple systems
- Clear disclaimer: "NOT Aadhaar / MeriPehchaan integration — design concept"

---

## Running Automated Tests

```bash
cd sathi-setu
pytest app/tests/ -v
```

Expected: **84 tests passed.**

---

## API Reference (Quick)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/v1/health` | Public | Service health check |
| GET | `/v1/catalogue` | Public | List registered systems |
| GET | `/v1/demo/snapshot` | Public | Dashboard data |
| GET | `/v1/demo/config` | Public (non-prod only) | API key for console |
| POST | `/v1/applications/ingest` | Bearer | Ingest cross-system application |
| POST | `/v1/applications/{id}/status` | Bearer | Update unified application status |
| POST | `/v1/consents` | Bearer | Request data-sharing consent |
| POST | `/v1/consents/{id}/decision` | Bearer | Grant/deny/revoke consent |
| GET | `/v1/identities/{id}/shared-profile` | Bearer | Consent-gated profile access |
| GET | `/v1/events` | Bearer | Event feed |
| GET | `/v1/data-quality` | Bearer | Open data quality issues |
| POST | `/v1/data-quality/{id}/resolve` | Bearer | Resolve a DQ issue |
| GET | `/v1/audit` | Bearer | Append-only audit log |
| PATCH | `/v1/connectors/{key}/mapping` | Bearer | Update field mapping |

All mutating requests require a `correlation_id` and `idempotency_key`.
