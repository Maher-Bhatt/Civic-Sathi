# Civic Sathi

## Municipal Intelligence and Civic Operations Platform

Civic Sathi is a multi-city civic technology platform that connects citizens, municipal officers, contractors, and administrators through one operational workflow. Citizens can report civic problems with text, location, voice input, and evidence. Municipal teams can triage complaints, identify duplicate reports, group recurring problems into systemic issues, publish tenders, award work, inspect execution evidence, and monitor service-level performance.

The repository is a monorepo containing four web portals, a shared TypeScript API client, a FastAPI backend, PostgreSQL persistence, Alembic migrations, analytics, authentication, procurement workflows, audit logging, and AI/ML-assisted complaint analysis.

> **Project status:** Civic Sathi is implemented as a production-oriented Smart India Hackathon 2026 platform. Production deployments must provide the required environment variables, database connection, migration step, and frontend API URL before they are considered operational.

## Contents

- [Platform Overview](#platform-overview)
- [Core Workflow](#core-workflow)
- [Portals](#portals)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Authentication and Authorization](#authentication-and-authorization)
- [Backend API](#backend-api)
- [Database and Migrations](#database-and-migrations)
- [Local Development](#local-development)
- [Environment Configuration](#environment-configuration)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Testing and Validation](#testing-and-validation)
- [Security and Operations](#security-and-operations)
- [Known Limitations](#known-limitations)
- [License](#license)

## Platform Overview

| Capability | Description |
|---|---|
| Citizen reporting | Authenticated citizens submit complaints with descriptions, category suggestions, severity, location, language, and optional photo evidence. |
| AI-assisted analysis | Complaint text and evidence can be analyzed for category, severity, interpretation, recommended action, and possible duplicates. |
| Duplicate and systemic issue detection | Similar complaints can be linked to a canonical issue group so municipalities can solve recurring problems rather than process every report independently. |
| Municipal operations | Officers review queues, assign complaints, update status, triage AI suggestions, manage departments, and coordinate inspections. |
| Procurement | Officers create tenders, contractors submit bids, winning bids become work orders, and execution progresses through evidence and inspection stages. |
| Contractor management | Contractors manage bids and work orders, upload field evidence, and receive public, AI, and officer performance ratings. |
| Command center | Administrators monitor multi-city telemetry, users, audit events, SLAs, integrations, and system-level operations. |
| Interoperability | The Sathi Setu integration layer supports canonical case exchange and connected municipal systems. |
| Transparency and reputation | Citizens can track complaint progress, view public status information, and participate in reputation and civic contribution features. |

## Core Workflow

```text
Citizen submits complaint
        |
        v
AI analysis: category, severity, language, entities, duplicates
        |
        +--> Similar existing issue found --> Citizen can support/upvote the issue
        |
        +--> New issue --> Complaint is persisted and routed to a department
                                      |
                                      v
                         Officer triage and issue clustering
                                      |
                                      v
                              Tender publication
                                      |
                                      v
                              Contractor bids
                                      |
                                      v
                        Awarded bid becomes work order
                                      |
                                      v
                        Field evidence and inspection
                                      |
                                      v
                         Resolution and citizen tracking
```

The procurement state machine is designed around the following progression:

```text
DRAFT -> PUBLISHED -> EVALUATING -> AWARDED -> ISSUED -> IN_PROGRESS
      -> INSPECTION_PENDING -> COMPLETED
```

## Portals

| Portal | Audience | Main responsibilities | Application directory |
|---|---|---|---|
| Public Portal | Citizens | Registration, login, complaint reporting, location and photo evidence, complaint tracking, maps, community support, contractor scorecards, notifications, and civic reputation. | `apps/public` |
| Municipality Portal | Ward officers, engineers, supervisors, and municipal users | Dashboard, complaint queue, AI triage, systemic issue review, tenders, work orders, inspections, analytics, and department routing. | `apps/municipality` |
| Contractor Portal | Registered contractors | Contractor authentication, tender discovery, bid submission, awarded work orders, field evidence upload, progress tracking, and performance history. | `apps/contractor` |
| Admin Portal | Super administrators and state-level operators | Cross-city command center, user management, SLA monitoring, audit logs, system telemetry, AI oversight, and operational administration. | `apps/admin` |

The portals use TanStack Router, React, Tailwind CSS, Radix-based UI components, React Query, and a shared `@civicsathi/api-client` package. Each portal is built independently but communicates with the same versioned FastAPI API.

## Architecture

```mermaid
flowchart TD
    Citizen[Citizen] --> Public[Public Portal]
    Officer[Officer] --> Municipality[Municipality Portal]
    Contractor[Contractor] --> ContractorPortal[Contractor Portal]
    Admin[Administrator] --> AdminPortal[Admin Portal]

    Public --> Client[Shared API Client]
    Municipality --> Client
    ContractorPortal --> Client
    AdminPortal --> Client

    Client --> API[FastAPI /api/v1]
    API --> Auth[JWT Authentication and RBAC]
    API --> Services[Domain Services]
    Services --> ML[AI and ML Analysis]
    Services --> DB[(Neon PostgreSQL)]
    API --> Audit[Audit Logging]
    API --> SathiSetu[Sathi Setu Integrations]
```

### Frontend-to-backend contract

All frontend API traffic is centralized through `packages/api-client`. The client:

1. Resolves the backend URL from `VITE_API_BASE_URL`.
2. Adds the JWT as an `Authorization: Bearer` header when a token is available.
3. Sends JSON or `FormData` payloads through typed client methods.
4. Converts FastAPI errors, including Pydantic validation arrays, into readable client errors.
5. Removes invalid sessions after a definitive HTTP 401 response.

The frontend does not need Axios or manually managed cookie plumbing. API procedures are exposed as methods in the shared client and consumed by the portal service layers.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite, TanStack Start, TanStack Router, TanStack React Query |
| Styling and UI | Tailwind CSS v4, Radix UI primitives, class-variance-authority, Lucide icons |
| Forms and validation | React Hook Form and Zod |
| Maps and geospatial features | Leaflet, Turf helpers, geospatial API responses |
| Charts and analytics | Recharts, Pandas, NumPy |
| Backend | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| Persistence | SQLAlchemy 2.x, Alembic, PostgreSQL, Neon Serverless PostgreSQL |
| Authentication | JWT with PyJWT, bcrypt password hashing, HTTP Bearer authentication |
| AI and ML | Sentence Transformers, scikit-learn, optional spaCy and LLM integrations |
| Testing | Pytest, HTTPX, Testcontainers PostgreSQL |
| Deployment | Vercel, Netlify, Render, or another compatible frontend/backend hosting platform |

## Repository Structure

```text
Civic-Sathi/
├── apps/
│   ├── public/                  # Citizen-facing portal
│   ├── municipality/            # Municipal operations portal
│   ├── contractor/              # Contractor portal
│   └── admin/                   # Administrative command center
├── backend/
│   ├── alembic/                 # Database migrations
│   ├── app/
│   │   ├── api/v1/routes/       # Versioned FastAPI route modules
│   │   ├── core/                # Configuration, security, database, logging
│   │   ├── models/              # SQLAlchemy entities
│   │   ├── schemas/              # Pydantic request and response models
│   │   └── services/             # Domain and ML service logic
│   ├── requirements.txt
│   └── README.md
├── packages/
│   ├── api-client/              # Shared TypeScript API client, endpoints, and types
│   └── visual-system/           # Shared visual and design-system utilities
├── sathi-setu/                  # Interoperability gateway and integrations
├── docs/                        # Developer, product, and operations documentation
├── package.json                 # Root npm workspace configuration
├── package-lock.json
└── .env.example                 # Environment variable template
```

## Authentication and Authorization

Civic Sathi uses JWT access tokens. The standard flow is:

1. A user registers or submits credentials.
2. The backend validates the account and password hash.
3. The backend issues a signed JWT containing the user subject, email, role, name, and expiry.
4. The frontend stores the token locally and sends it with subsequent API requests.
5. Backend dependencies validate the token and resolve the authenticated database user.

Supported operational roles include `citizen`, `contractor`, `officer`, `supervisor`, `municipality`, `collector`, and `admin`. Officer permissions are further constrained by role and designation for complaint, triage, tender, work-order, inspection, and analytics operations.

Important authentication endpoints include:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Register a citizen account and return a JWT. |
| `POST` | `/api/v1/auth/login` | Authenticate a citizen or contractor account. |
| `POST` | `/api/v1/auth/officer-login` | Authenticate an officer or administrator. |
| `GET` | `/api/v1/auth/me` | Return the current authenticated profile. |
| `PATCH` | `/api/v1/auth/me` | Update permitted profile fields or change a password. |
| `POST` | `/api/v1/auth/password-reset/request` | Start a password reset flow. |
| `POST` | `/api/v1/auth/password-reset/confirm` | Confirm a password reset using an OTP. |

## Backend API

The backend is mounted under `/api/v1`. Interactive documentation is available at `/docs` when documentation is enabled.

### Core route groups

| Route group | Responsibility |
|---|---|
| `/api/v1/health` | Health and database connectivity checks. |
| `/api/v1/auth` | Registration, login, profiles, demo access, and password reset. |
| `/api/v1/complaints` | Complaint creation, listing, detail, status, assignment, similar complaints, and upvotes. |
| `/api/v1/issues` | Systemic issue clusters and ML clustering operations. |
| `/api/v1/ai` | Complaint and image analysis endpoints. |
| `/api/v1/ai/triage` | Pending triage items and officer review actions. |
| `/api/v1/procurement` | Tenders, bids, work orders, evidence, inspections, contractors, and reviews. |
| `/api/v1/analytics` | Summary metrics, maps, trends, and public aggregate data. |
| `/api/v1/admin` | Command center, user administration, SLAs, and audit operations. |
| `/api/v1/municipality` | Municipal dashboard and operational views. |
| `/api/v1/reputation` | Citizen reputation, badges, missions, and impact records. |
| `/api/v1/integrations` | Connected systems and event exchange. |
| `/api/v1/cases` | Multi-department case coordination. |
| `/api/v1/mdm` | Master-data management operations. |

### Complaint submission example

```bash
curl -X POST "http://localhost:8000/api/v1/complaints" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Water supply interruption in Ward 14",
    "description": "There has been no water supply in our area for three days.",
    "category": "Water Supply",
    "severity": "High",
    "city": "Vadodara",
    "ward_number": 14,
    "lat": 22.3072,
    "lng": 73.1812,
    "address_text": "Ward 14, Vadodara",
    "language": "en"
  }'
```

## Database and Migrations

The backend uses SQLAlchemy models with PostgreSQL persistence. The primary domains are:

- Users, cities, wards, zones, departments, and permissions.
- Complaints and complaint analyses.
- Issue clusters and complaint-to-cluster relationships.
- Contractors, city registrations, tenders, bids, and work orders.
- Field evidence, inspections, reviews, SLA records, and audit logs.
- Reputation profiles, missions, badges, and impact events.
- Integration systems, external tickets, cases, and department workflows.

Apply schema changes with Alembic before starting the application:

```bash
cd backend
alembic upgrade head
```

Do not rely on application startup to create or mutate production schema. Production deployments should run migrations as an explicit release step.

## Local Development

### Prerequisites

- Node.js 20 or newer.
- npm.
- Python 3.11 or newer.
- PostgreSQL-compatible database, preferably Neon PostgreSQL for production parity.
- Git.

### Frontend setup

```bash
npm install
npm run dev
```

The root workspace command starts the development scripts exposed by the application workspaces. To work on one portal independently:

```bash
cd apps/public
npm run dev
```

Build all available frontend workspaces with:

```bash
npm run build
```

### Backend setup

Linux/macOS:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Windows PowerShell:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open the API at `http://localhost:8000` and Swagger UI at `http://localhost:8000/docs`.

### Optional seed data

The backend includes seed scripts for local demonstrations. Use them only against an intentional development or demo database:

```bash
cd backend
python seed_master.py
python seed_sih_demo.py
python seed_city_complaints.py
```

## Environment Configuration

Never commit real credentials to GitHub. Start with `.env.example` and provide secrets through the hosting provider.

### Frontend variables

```env
VITE_API_BASE_URL=https://your-backend-host.example.com
```

### Backend variables

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
ENVIRONMENT=production
JWT_SECRET=replace-with-a-long-random-secret
OFFICER_API_KEY=replace-with-a-random-administrative-key
CORS_ORIGINS=https://public.example.com,https://municipality.example.com,https://contractor.example.com,https://admin.example.com
ENABLE_SEED_ENDPOINT=false
```

Optional variables support LLM providers, OTP delivery, password reset email or SMS delivery, ML thresholds, logging, and feature flags. See `backend/app/core/config.py` for the authoritative settings list.

## Frontend Deployment

Vercel is not required. The frontend portals can be deployed independently to Netlify, Render Static Sites, or another provider that supports Node-based builds.

For each portal, configure the corresponding workspace directory and run:

```text
Build command: npm run build
```

| Portal | Workspace directory |
|---|---|
| Public | `apps/public` |
| Municipality | `apps/municipality` |
| Contractor | `apps/contractor` |
| Admin | `apps/admin` |

Set the following environment variable on every frontend deployment:

```text
VITE_API_BASE_URL=https://your-deployed-backend.example.com
```

After deployment, add every frontend origin to the backend `CORS_ORIGINS` value. Confirm that the frontend can load the backend health endpoint, authenticate, and submit a test complaint before treating the deployment as complete.

## Backend Deployment

The backend can run on Render or another Python-compatible service. A typical service uses:

```text
Root directory: backend
Build command: pip install -r requirements.txt
Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Run `alembic upgrade head` as a release or deploy step before the application process starts. Configure `DATABASE_URL`, `JWT_SECRET`, `OFFICER_API_KEY`, `ENVIRONMENT`, and `CORS_ORIGINS` in the provider dashboard.

Health checks:

```text
GET /health
GET /api/v1/health
```

A healthy response should confirm that the application is running and the database is connected.

## Testing and Validation

Backend checks:

```bash
cd backend
python -m compileall -q app
pytest -q
```

Frontend checks:

```bash
npm run build
```

Recommended end-to-end smoke test:

1. Open the public portal.
2. Register a citizen account.
3. Sign in and confirm `/api/v1/auth/me` succeeds.
4. Submit a complaint with a valid location.
5. Confirm the complaint appears in the citizen complaint list.
6. Sign in to the municipality portal.
7. Confirm the complaint is visible to the authorized officer.
8. Verify that unauthorized roles cannot access officer-only operations.
9. If procurement is enabled, create a tender, submit a bid, award it, upload evidence, and complete an inspection.

## Security and Operations

- Use a long, randomly generated `JWT_SECRET` in every non-local environment.
- Rotate `OFFICER_API_KEY` if it is exposed.
- Keep `CORS_ORIGINS` limited to trusted deployment origins.
- Do not commit `.env`, database credentials, API keys, JWT secrets, or user exports.
- Run Alembic migrations explicitly instead of modifying schema from application startup.
- Add rate limiting at the edge or API layer for login and public complaint submission endpoints.
- Keep audit logging enabled for authenticated operational actions.
- Use a background worker or queue for expensive embedding and clustering workloads as traffic increases.
- Use separate databases for local development, staging, demos, and production.
- Treat seed scripts as destructive or data-generating operations and never run them blindly against production.

## Known Limitations

The following areas require operational hardening or continued implementation work:

| Area | Current concern | Recommended next step |
|---|---|---|
| ML execution | Embedding and clustering work can be expensive inside the API process. | Move heavy analysis to a queue-backed worker such as Redis with Celery or RQ. |
| Rate limiting | Login and public submission endpoints need explicit abuse controls. | Add gateway or application-level rate limiting and monitoring. |
| Administrative setup | Officer setup relies on a protected API key. | Replace or supplement it with an invite-based administrative flow. |
| Contractor AI insights | Some contractor insight and rating values may require a dedicated refresh job. | Persist model runs and update insights asynchronously from verified evidence. |
| Production observability | Application health is exposed, but full deployment monitoring depends on the hosting provider. | Add structured metrics, alerting, tracing, and log retention policies. |

## Documentation Map

- `backend/README.md` — backend installation, migrations, seeders, API highlights, and production notes.
- `docs/` — feature, developer, and operations documentation.
- `packages/api-client/` — shared frontend API transport, endpoints, and types.
- `backend/app/api/v1/routes/` — authoritative route registration and endpoint implementations.
- `backend/app/core/config.py` — authoritative backend environment settings.
- `backend/app/schemas/` — request and response contracts.
- `backend/alembic/` — database migration history.

## License

MIT License.

Copyright © Civic Sathi contributors.

## References

[1]: https://fastapi.tiangolo.com/ "FastAPI Documentation"
[2]: https://docs.sqlalchemy.org/ "SQLAlchemy Documentation"
[3]: https://alembic.sqlalchemy.org/ "Alembic Documentation"
[4]: https://tanstack.com/router/latest "TanStack Router Documentation"
[5]: https://react.dev/ "React Documentation"
[6]: https://docs.netlify.com/ "Netlify Documentation"
[7]: https://render.com/docs "Render Documentation"
[8]: https://docs.github.com/ "GitHub Documentation"

<!-- Civic Sathi repository handoff README. -->
<!-- Updated September 2026. -->
