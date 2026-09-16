# Civic Sathi

## Municipal Intelligence, Grievance Redressal & Civic Operations Platform
### Smart India Hackathon 2026 · Problem Statement PS26129 · Integrated Grievance Redressal System (IGRS)

Civic Sathi is an enterprise-grade multi-city civic intelligence platform that seamlessly connects citizens, municipal officers, infrastructure contractors, and state administrators through a unified, interoperable workflow. Citizens can report civic issues using voice input, geo-fenced coordinates, and photographic evidence. Municipal teams can triage complaints, automatically identify duplicates, cluster recurring failures into systemic issues, publish tenders, award work orders, inspect field execution evidence, and monitor service-level agreements (SLAs).

The repository is a monorepo containing four production web applications, a shared TypeScript API client, a high-performance FastAPI backend, Neon PostgreSQL serverless persistence, Alembic migrations, real-time analytics, and an intelligent multi-signal AI/ML complaint triage engine.

---

## Live Deployments

| Portal | Target Audience | Live Production URL | Source Directory |
|---|---|---|---|
| **Public Citizen Portal** | Citizens & Residents | [https://janmind-public.vercel.app](https://janmind-public.vercel.app) | `apps/public` |
| **Municipality Portal** | Ward Officers & Engineers | [https://janmind-municipality.vercel.app](https://janmind-municipality.vercel.app) | `apps/municipality` |
| **Contractor Portal** | Vendors & Contractors | [https://janmind-contractor.vercel.app](https://janmind-contractor.vercel.app) | `apps/contractor` |
| **Admin Command Center** | State Administrators | [https://janmind-admin.vercel.app](https://janmind-admin.vercel.app) | `apps/admin` |
| **Backend API Engine** | REST & SSE API Services | [https://civic-sathi-f7ml.onrender.com](https://civic-sathi-f7ml.onrender.com) | `backend` |

---

## Contents

- [Platform Capabilities](#platform-capabilities)
- [End-to-End Operational Lifecycle](#end-to-end-operational-lifecycle)
- [System Architecture](#system-architecture)
- [AI & Machine Learning Engine](#ai--machine-learning-engine)
- [Geo-Fencing & Boundary Engine](#geo-fencing--boundary-engine)
- [Technology Stack](#technology-stack)
- [Repository Layout](#repository-layout)
- [Authentication & Role-Based Access Control](#authentication--role-based-access-control)
- [Database & Migrations](#database--migrations)
- [Local Development Guide](#local-development-guide)
- [Production Verification & Testing](#production-verification--testing)
- [License](#license)

---

## Platform Capabilities

| Capability | Description |
|---|---|
| **Guided Citizen Reporting** | Multilingual voice input (EN, HI, GU, MR, KN), interactive map selection, photo upload, and instant AI classification. |
| **Municipal Geo-Fencing** | Real-time Haversine distance boundary validation ensuring complaints are placed within authorized municipal zones. |
| **Multi-Signal Vision AI** | Computer-vision diagnostic engine extracting luminance, saturation, and texture roughness synthesized with Groq LLM intelligence. |
| **Duplicate & Systemic Clustering** | HDBSCAN & sentence-transformer clustering that merges duplicate reports into canonical issues, preventing redundant work. |
| **Officer Triaging & Dispatch** | Departmental routing (Public Works, Water Works, Sanitation, Electricity, Drainage) with priority and risk scoring. |
| **Procurement & Contracting** | Full municipal tender publishing, competitive bid submission, automated work order generation, and milestone tracking. |
| **Field Evidence & Inspection** | GPS-tagged before-and-after photo verification, on-site inspection approvals, and liquidated damages tracking. |
| **Tri-Party Vendor Scorecards** | Performance ratings combining citizen feedback, automated SLA compliance audits, and municipal inspection scores. |
| **Sathi Setu Interoperability** | Master-Data Management (MDM) exception resolution and cross-agency grievance exchange with DEPA citizen consent controls. |
| **Real-Time City Telemetry** | Live Open-Meteo weather and AQI (PM2.5/PM10) integration alongside city-wide grievance heatmaps. |

---

## End-to-End Operational Lifecycle

```text
1. CITIZEN INTAKE
   Citizen files report (Voice / Text / Photo / GPS)
   ↓
2. AI DIAGNOSTICS & BOUNDARY CHECK
   Geo-fence validation (Haversine km check against municipal radius)
   Multi-signal vision analysis + Groq LLM categorization (Severity 1-10, Risk 1-100)
   ↓
3. CANONICAL DEDUPLICATION
   Within 500m & matching category?
   ├── YES: Citizen can upvote existing issue ("Yes, I'm also affected")
   └── NO:  Assigned unique public ID (JN-2026-NNNNN) and persisted
   ↓
4. MUNICIPAL TRIAGE & CLUSTERING
   Officer reviews queue; ML groups recurring complaints into Systemic Issues
   ↓
5. PROCUREMENT & EXECUTION
   Tender published -> Contractors bid -> Work order awarded
   ↓
6. FIELD WORK & VERIFICATION
   Contractor uploads GPS-tagged photos -> Officer inspects -> Citizen confirms
   ↓
7. RESOLUTION & CIVIC REPUTATION
   Issue marked Resolved -> Citizen awarded XP -> Vendor scorecard updated
```

---

## AI & Machine Learning Engine

Civic Sathi features a multi-tiered intelligence pipeline specifically engineered for high-accuracy civic operations:

### 1. Multi-Signal Vision Diagnostic Engine
- **Pixel-Level Feature Extraction**: Directly computes mean luminance (0-255), color saturation in HSV space, and Sobel gradient texture roughness.
- **Monochrome Asphalt Profiling**: Detects low-saturation gray surface profiles and surface depression cavities characteristic of road damage and potholes.
- **Night Scene & High-Contrast Detection**: Identifies low ambient luminance combined with localized high-intensity point light sources for street lighting diagnostics.
- **Vibrant Clutter Entropy**: Measures high-frequency gradient variance across multi-color clusters for solid waste accumulation and illegal dumping.
- **Groq LLM Synthesis (`allam-2-7b`)**: Combines extracted visual signals with citizen description text to generate structured JSON classifications with confidence levels, visual evidence summaries, and municipal safety observations.
- **Deterministic Rule-Based Fallback**: Guarantees zero downtime by providing instant, rule-based classification if external network APIs are unavailable.

### 2. Multilingual Complaint Text Classification
- Native comprehension of Indian civic terminology across Hindi, Gujarati, Marathi, Kannada, and English (e.g., *pothole*, *sadak*, *gaddha*, *kachra*, *batti*, *andhera*, *gatar*, *nali*).
- Calibrated 4-band severity scoring (1–3 Minor, 4–6 Moderate, 7–8 Serious, 9–10 Critical).

### 3. Canonical Issue Clustering & Deduplication
- Employs `sentence-transformers/all-MiniLM-L6-v2` embeddings with cosine similarity matching (threshold 0.72) to cluster related neighborhood complaints into canonical problem groups.

---

## Geo-Fencing & Boundary Engine

To maintain operational integrity and prevent out-of-jurisdiction complaints, the platform enforces strict municipal boundary validation via Haversine distance calculation:

| City | State | Municipal Corporation | Authorized Radius |
|---|---|---|---|
| **Vadodara** | Gujarat (GJ) | Vadodara Municipal Corporation (VMC) | **25 km** |
| **Mumbai** | Maharashtra (MH) | Brihanmumbai Municipal Corporation (BMC) | **40 km** |
| **Bengaluru** | Karnataka (KA) | Bruhat Bengaluru Mahanagara Palike (BBMP) | **30 km** |
| **Delhi** | National Capital Territory (DL) | Municipal Corporation of Delhi (MCD) | **35 km** |

- **Automated GPS Detection**: Rejects coordinates outside supported metropolitan zones and prompts the citizen to select a supported municipality.
- **Interactive Pin Validation**: Live visual warnings when adjusting map pins outside designated municipal boundaries.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, Vite, TanStack Router, TanStack Query |
| **UI & Styling** | Tailwind CSS v4, Radix UI primitives, Lucide Icons, Glassmorphic Jewel Theme |
| **Maps & Geospatial** | Leaflet, Open-Meteo Weather & AQI APIs, Haversine Distance Engine |
| **Data Visualization** | Recharts, Pandas, NumPy |
| **Shared Client SDK** | `@civicsathi/api-client` (TypeScript, Native Fetch, SSE Streams) |
| **Backend Framework** | Python 3.11+, FastAPI, Uvicorn, Pydantic v2 |
| **Database & ORM** | PostgreSQL 16 on Neon Serverless, SQLAlchemy 2.x, Alembic Migrations |
| **AI / ML Diagnostics** | Groq API (`allam-2-7b`), Sentence Transformers, Pillow, NumPy |
| **Security & Auth** | PyJWT, Passlib (bcrypt), HTTP Bearer tokens, Immutable Audit Logging |
| **Hosting & CI/CD** | Vercel (Nitro Serverless Web), Render (Containerized Python Service) |

---

## Repository Layout

```text
Civic-Sathi/
├── apps/
│   ├── public/                  # Citizen Portal (React 19, i18n, Geo-fencing, Reporting)
│   ├── municipality/            # Municipality Portal (Triage, Tenders, Inspections)
│   ├── contractor/              # Contractor Portal (Bids, Work Orders, Evidence)
│   └── admin/                   # State Command Center (MDM, SLAs, Audit Trails)
├── backend/
│   ├── alembic/                 # Database schema migrations
│   ├── app/
│   │   ├── api/v1/routes/       # Modular FastAPI route controllers
│   │   ├── core/                # Database connection, JWT security, configuration
│   │   ├── models/              # SQLAlchemy database entities
│   │   ├── schemas/              # Pydantic request/response validation schemas
│   │   ├── services/             # Domain logic (AI diagnostics, complaints, cases)
│   │   └── repositories/         # Database persistence and self-healing sequences
│   ├── requirements.txt         # Backend Python dependencies
│   └── README.md
├── packages/
│   ├── api-client/              # Shared TypeScript HTTP client and typed endpoints
│   └── visual-system/           # Shared Indian civic jewel design tokens
├── docs/                        # Complete technical specifications and handoffs
├── package.json                 # Monorepo npm workspaces configuration
└── .env.example                 # Environment configuration template
```

---

## Authentication & Role-Based Access Control

Civic Sathi enforces strict JWT bearer authentication with role-based operational permissions:

- **`citizen`**: Submit complaints, upload evidence, track personal reports, confirm resolution, earn XP.
- **`contractor`**: Discover tenders, submit competitive bids, execute awarded contracts, upload GPS evidence.
- **`officer` / `supervisor`**: Triage incoming complaints, assign departmental queues, publish tenders, inspect evidence.
- **`admin` / `collector`**: Access state command center, view cross-city telemetry, inspect audit trails, manage SLAs.

### Key Authentication Endpoints
- `POST /api/v1/auth/register` — Citizen registration.
- `POST /api/v1/auth/login` — Unified login supporting all registered accounts.
- `POST /api/v1/auth/officer-login` — Dedicated officer/super-admin authentication.
- `GET /api/v1/auth/me` — Current user profile and permission manifest.

---

## Local Development Guide

### Prerequisites
- Node.js 20+ and npm
- Python 3.11+ and virtualenv
- PostgreSQL database (or Neon Serverless account)

### 1. Frontend Setup
```bash
# Install dependencies across all monorepo workspaces
npm install

# Run any portal in development mode
cd apps/public        # or apps/municipality, apps/contractor, apps/admin
npm run dev
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1    # On Linux/macOS: source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
Copy-Item .env.example .env

# Apply database migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Swagger API documentation available at `http://localhost:8000/docs`.

---

## Production Verification & Testing

### Live Health Check
```bash
curl -s https://civic-sathi-f7ml.onrender.com/api/v1/health
# Returns: {"status": "ok", "database": "connected"}
```

### Live Public Complaint Submission
```bash
curl -X POST "https://civic-sathi-f7ml.onrender.com/api/v1/complaints" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Severe pothole on main road",
    "description": "Deep asphalt depression causing vehicle damage",
    "category": "road_damage",
    "severity": "high",
    "city": "Vadodara",
    "lat": 22.3072,
    "lng": 73.1812
  }'
```

---

## License

MIT License. Copyright © 2026 Civic Sathi Contributors. Smart India Hackathon 2026.