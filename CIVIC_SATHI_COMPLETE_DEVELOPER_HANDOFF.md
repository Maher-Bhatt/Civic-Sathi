# Civic Sathi — Complete Developer Handoff
### SIH 2026 · Problem Statement PS26129 · Integrated Grievance Redressal System (IGRS)

> **For your teammates:** This document is the single source of truth for the entire project.
> It covers every file, every technology choice, every API route, every bug fix, every ML decision,
> and everything you need to pick up exactly where development left off.
> Read it fully before touching any code.

---

## Table of Contents

1. [What This Project Is (and Why It Matters for SIH)](#1-what-this-project-is)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Technology Stack — Every Choice Explained](#3-technology-stack)
4. [Repository Layout](#4-repository-layout)
5. [Backend — Deep Dive](#5-backend-deep-dive)
   - 5.1 [Models (Database Schema)](#51-models-database-schema)
   - 5.2 [API Routes — Complete List](#52-api-routes-complete-list)
   - 5.3 [Auth System](#53-auth-system)
   - 5.4 [Configuration & Environment Variables](#54-configuration--environment-variables)
   - 5.5 [Dynamic Audit Logging](#55-dynamic-audit-logging)
   - 5.6 [AI Service (Groq / xAI)](#56-ai-service-groq--xai)
   - 5.7 [Canonical Grouping (Duplicate Detection)](#57-canonical-grouping-duplicate-detection)
   - 5.8 [SLA System](#58-sla-system)
   - 5.9 [Reputation & Gamification](#59-reputation--gamification)
6. [ML Pipeline — Complete Guide](#6-ml-pipeline-complete-guide)
   - 6.1 [What the ML Actually Does](#61-what-the-ml-actually-does)
   - 6.2 [Phase-by-Phase Breakdown](#62-phase-by-phase-breakdown)
   - 6.3 [Live Inference (Per-Complaint, Real-Time)](#63-live-inference-per-complaint-real-time)
   - 6.4 [How to Run the ML Pipeline](#64-how-to-run-the-ml-pipeline)
   - 6.5 [Model Files and Sizes](#65-model-files-and-sizes)
7. [Shared Package — api-client](#7-shared-package--api-client)
8. [How the Frontend Connects to the Backend](#8-how-the-frontend-connects-to-the-backend)
9. [The Four Portals — Deep Dive](#9-the-four-portals-deep-dive)
   - 9.1 [Public Portal (Citizen)](#91-public-portal-citizen)
   - 9.2 [Municipality Portal (Officer)](#92-municipality-portal-officer)
   - 9.3 [Contractor Portal](#93-contractor-portal)
   - 9.4 [Admin Portal (Super-Admin)](#94-admin-portal-super-admin)
10. [Sathi Setu — Interoperability Service](#10-sathi-setu-interoperability-service)
11. [CSS Design System](#11-css-design-system)
12. [Deployment Guide](#12-deployment-guide)
13. [Developer Setup (Local)](#13-developer-setup-local)
14. [Login Credentials — All Portals](#14-login-credentials-all-portals)
15. [All Bugs Found and Fixed](#15-all-bugs-found-and-fixed)
16. [Architectural Rules You Must Not Break](#16-architectural-rules-you-must-not-break)
17. [SIH Demo Strategy](#17-sih-demo-strategy)

---

## 1. What This Project Is

Civic Sathi is NOT just another complaints app. The SIH problem statement PS26129 is specifically about **interoperability** — the ability for independent government systems to exchange citizen grievance data without each system needing to know about every other system.

**The core insight:** A citizen who files a pothole complaint on BBMP's portal (Bengaluru) and again on the Maharashtra State Grievance Portal is filing the same complaint twice. The municipality wastes time processing duplicates. The citizen has no unified tracking. There is no shared audit trail across departments.

**What we built:**
- A full 4-portal civic grievance system (citizen, municipality, contractor, admin)
- 118,000+ real complaint records processed and loaded into PostgreSQL (Neon)
- An ML pipeline that clusters complaints into systemic issues and scores them by risk
- A live AI triage system using Groq's LLM for complaint classification
- **Sathi Setu** — a separate interoperability service that sits between any two government systems and provides unified citizen identity, consent management, and cross-system tracking

The first four items make us competitive. The fifth item is what makes us win.

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL (4 separate projects)                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ apps/public  │ │ apps/muni    │ │ apps/contrac │ │ apps/admin│ │
│  │ (Citizen)    │ │ (Officer)    │ │ (Contractor) │ │ (Super    │ │
│  │ Port 8080    │ │ Port 8081    │ │              │ │  Admin)   │ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └─────┬─────┘ │
└─────────┼────────────────┼────────────────┼───────────────┼────────┘
          │                │                │               │
          └────────────────┴────────────────┴───────────────┘
                                    │
                    packages/api-client (@civicsathi/api-client)
                    (shared TypeScript HTTP client — all 4 portals)
                                    │
                           VITE_API_BASE_URL
                                    │
┌───────────────────────────────────▼────────────────────────────────┐
│                     RENDER (single web service)                     │
│                         FastAPI Backend                             │
│   Python 3.11 + SQLAlchemy 2.x + Alembic + pyjwt + bcrypt          │
│   Groq API (LLM) + sentence-transformers + FAISS                   │
│   Uvicorn ASGI server — http://0.0.0.0:$PORT                       │
│                   /api/v1/* routes                                  │
└───────────────────────────────┬────────────────────────────────────┘
                                │ psycopg[binary] v3
┌───────────────────────────────▼────────────────────────────────────┐
│                  NEON (Serverless PostgreSQL)                       │
│  35+ tables · JSONB for embeddings/metadata · UUID PKs             │
│  NullPool (serverless-safe — no persistent connection pool)         │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                SATHI SETU (separate service — SIH core)            │
│            FastAPI + PostgreSQL (10 interoperability tables)        │
│   Connectors: civic_sathi ↔ mock_legacy_system                      │
│   Identity resolution · Consent management · Cross-system events   │
└─────────────────────────────────────────────────────────────────────┘
```

**Request flow for a citizen filing a complaint:**

```
Browser → apps/public (React, Vercel)
  → packages/api-client (adds Bearer token header)
  → Render FastAPI /api/v1/complaints (POST)
  → complaint_service.py (assigns public_id: JN-2026-XXXXX)
  → ai_service.py (Groq LLM: category, severity, risk_score, summary)
  → canonical_grouping.py (FAISS + Haversine: is this a duplicate?)
  → PostgreSQL (Neon: saves Complaint + ComplaintAnalysis + IssueCluster link)
  → audit_listeners.py (auto-writes AuditLog for INSERT)
  → HTTP 201 response → citizen sees their complaint ID
```

---

## 3. Technology Stack

### Why Each Technology Was Chosen

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend framework | TanStack Start (React 19, SSR) | File-based routing without Next.js App Router complexity. SSR without vendor lock-in. React 19 concurrent features. |
| Router | TanStack Router v1 | Full TypeScript inference on route params and search params. Type errors on broken links at compile time. |
| Styling | Tailwind CSS v4 | CSS-native (no PostCSS). Faster builds. `@layer` and CSS variables work naturally with the glass design system. |
| Component primitives | shadcn/ui + Radix UI | Unstyled, accessible components that the project owns (copy-pasted, not imported). Can customize without fighting a library. |
| Custom UI layer | `glass-*` components | Consistent frosted-glass aesthetic across all 4 portals. Single source of truth for visual identity. |
| Server state | TanStack Query (React Query) | Auto-refetch, background updates, stale-while-revalidate. Handles the 30s polling for audit logs and dashboard. |
| Build tool | Vite | Fast HMR in dev. Nitro preset for SSR output on Vercel. |
| Package manager | Bun | Faster installs than npm. `bun.lock` is the lockfile of record. |
| Toast notifications | Sonner | Lightweight, accessible, works with Tailwind. |
| Icons | lucide-react | Consistent stroke-based icon set. Tree-shakeable. |
| Charts | recharts (admin only) | Composable chart components. Used in the admin command center dashboard. |
| Deployment (frontend) | Vercel | Git-push deployment. Each portal is a separate Vercel project for independent scaling. |
| Backend framework | FastAPI | Async Python, automatic OpenAPI docs, pydantic v2 validation built-in, dependency injection system. |
| ORM | SQLAlchemy 2.x | `mapped_column` / `Mapped[]` typed syntax. Fine-grained query control. Async-compatible. Better than Django ORM for raw performance at 118k+ records. |
| DB migrations | Alembic | The ONLY way schema changes happen. Never `create_all()`. 18+ migration files track every schema change in git history. |
| Database | PostgreSQL on Neon | JSONB for embedding vectors and metadata. UUID PKs. Serverless-friendly. `NullPool` in production prevents connection exhaustion on Render free tier. |
| DB driver | psycopg[binary] v3 | Async-compatible. Psycopg2 was removed (caused driver conflicts — see BUG-014). |
| JWT | pyjwt | Standard JWT with HS256. 24-hour expiry. Payload includes: `sub`, `email`, `role`, `name`. |
| Password hashing | bcrypt | Industry standard. Bcrypt rounds auto-tuned. |
| Async HTTP client | httpx | Used in ai_service.py to call Groq/xAI APIs. Non-blocking. 10s timeout for text, 20s for vision. |
| LLM (text) | Groq llama-3.1-8b-instant | Free tier, extremely fast (tokens/sec far exceeds OpenAI). API-compatible with OpenAI client format. |
| LLM (vision) | Groq meta-llama/llama-4-scout-17b-16e-instruct | Multimodal model. Analyzes citizen photos to classify civic issues by actual pixels (not filename). |
| Semantic embeddings | sentence-transformers all-MiniLM-L6-v2 | 384-dimensional. ~85MB download. Fits in Render free tier RAM. Fast inference. Excellent for sentence-level civic text. Multilingual. |
| Similarity search | FAISS (IndexFlatIP) | Inner product (= cosine on normalized vectors). Sub-millisecond search at 118k vectors. CPU-only — no GPU needed. Proven at 1B+ scale by Meta. |
| ML clustering | scikit-learn DBSCAN + StandardScaler | Density-based clustering with noise handling. No need to pre-specify number of clusters. |
| Email OTP | Brevo (Sendinblue) | Transactional email API for password reset codes. |
| SMS OTP | MSG91 | Indian SMS gateway for OTP delivery (phone-based password reset). |
| Backend deployment | Render | `render.yaml` in `backend/`. Free tier (cold starts ~30s — frontends handle this with cached-user pattern). |

---

## 4. Repository Layout

```
Civic-Sathi/
├── package.json                    ← Root monorepo config (npm workspaces)
├── .env.example                    ← Template for root env vars
├── CIVIC_SATHI_COMPLETE_DEVELOPER_HANDOFF.md  ← This file
│
├── apps/                           ← 4 React portals
│   ├── public/                     ← Citizen portal (port 8080)
│   ├── municipality/               ← Officer portal (port 8081)
│   ├── contractor/                 ← Contractor portal
│   └── admin/                      ← Super-admin portal
│
├── packages/
│   ├── api-client/                 ← @civicsathi/api-client (shared HTTP client)
│   └── civic-visual-system/        ← Shared visual primitives
│
├── backend/
│   ├── app/
│   │   ├── main.py                 ← FastAPI app, CORS, middleware, startup
│   │   ├── core/
│   │   │   ├── config.py           ← All settings (pydantic-settings)
│   │   │   ├── database.py         ← SQLAlchemy engine, SessionLocal, NullPool
│   │   │   ├── security.py         ← JWT, bcrypt, role guards
│   │   │   ├── audit_context.py    ← ContextVar for audit actor
│   │   │   ├── audit_listeners.py  ← SQLAlchemy event listeners (dynamic audit)
│   │   │   ├── errors.py           ← Custom exceptions + handlers
│   │   │   └── logging.py          ← Structured logging setup
│   │   ├── models/                 ← SQLAlchemy ORM models (35+ tables)
│   │   ├── schemas/                ← Pydantic request/response schemas
│   │   ├── api/v1/
│   │   │   ├── router.py           ← Master router (aggregates all routes)
│   │   │   └── routes/             ← Individual route modules
│   │   ├── services/               ← Business logic
│   │   ├── repositories/           ← Data access layer
│   │   ├── seed/                   ← DB seed data
│   │   ├── tests/                  ← Pytest suite (Testcontainers PostgreSQL)
│   │   └── worker/                 ← Background workers
│   ├── ml/                         ← Offline ML pipeline (runs once on dataset)
│   ├── alembic/                    ← DB migrations (18+ files)
│   ├── scripts/                    ← Repair and utility scripts
│   ├── data/                       ← ML data directory (gitignored)
│   │   ├── raw/                    ← Raw CSV complaint files
│   │   ├── processed/              ← Pipeline output CSVs
│   │   └── embeddings/             ← .npy vectors, FAISS index
│   ├── reports/                    ← Pipeline execution reports
│   ├── requirements.txt            ← Python dependencies
│   ├── render.yaml                 ← Render deployment config
│   ├── seed_master.py              ← Full DB seeding script
│   └── run_full_pipeline.py        ← Triggers entire ML pipeline
│
├── sathi-setu/                     ← Interoperability service (SIH core)
│   ├── app/                        ← FastAPI app
│   ├── alembic/                    ← 10-table interoperability schema
│   ├── web/index.html              ← Single-file admin console (WCAG 2.2 AA)
│   └── scripts/init_demo.py        ← Demo data seeder
│
├── mock-grievance-service/         ← Simulates a legacy government system
└── docs/operations/                ← Operational documentation
```

### Common structure inside each `apps/{portal}/`:

```
apps/{portal}/
├── package.json
├── tsconfig.json
├── vite.config.ts              ← ALWAYS has preset: "vercel" — DO NOT REMOVE
├── .env  /  .env.example
├── bun.lock                    ← Bun is the package manager here
├── src/
│   ├── components/
│   │   ├── ui/                 ← glass-card, glass-button, glass-input, states, etc.
│   │   └── *.tsx               ← Feature components
│   ├── hooks/                  ← Custom React hooks
│   ├── lib/
│   │   ├── auth.tsx            ← AuthProvider and useAuth() (public portal)
│   │   ├── muni-auth.tsx       ← MuniAuthProvider (municipality portal)
│   │   ├── admin-auth.tsx      ← AdminAuthProvider (admin portal)
│   │   ├── contractor-auth.tsx ← ContractorAuthProvider (contractor portal)
│   │   ├── theme.tsx           ← ThemeProvider (dark/light/system)
│   │   ├── i18n.tsx            ← Internationalization (Hindi/English/Gujarati)
│   │   ├── require-auth.tsx    ← Auth gate component
│   │   └── utils.ts            ← cn() and other utilities
│   ├── routes/
│   │   ├── __root.tsx          ← Root route (layout, providers)
│   │   ├── index.tsx           ← Landing / redirect
│   │   ├── login.tsx
│   │   └── {portal}/           ← Protected routes
│   ├── services/
│   │   ├── api.ts              ← THE integration point (read carefully)
│   │   ├── types.ts            ← TypeScript contracts (coordinate with backend)
│   │   └── cities.ts           ← City ID constants
│   ├── routeTree.gen.ts        ← AUTO-GENERATED. Never edit manually.
│   ├── router.tsx              ← TanStack Router config
│   ├── server.ts               ← TanStack Start server entry
│   ├── start.ts                ← Client entry
│   └── styles.css              ← Global styles + Tailwind v4
└── public/                     ← Static assets, PWA manifest
```

---

## 5. Backend — Deep Dive

### 5.1 Models (Database Schema)

All models live in `backend/app/models/`. Every model uses `UUIDMixin` (UUID PK) and most use `TimestampMixin` (`created_at`, `updated_at`).

**Core Civic Models (`complaint.py`, `user.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `User` | `users` | `role`, `name`, `email`, `phone`, `password_hash`, `city`, `department`, `designation`, `ward` | All roles: citizen, officer, supervisor, municipality, admin, collector, contractor |
| `Ward` | `wards` | `ward_number`, `name`, `centroid_lat`, `centroid_lng`, `boundary_geojson` (JSONB) | Geographic boundaries |
| `Department` | `departments` | `name`, `slug`, `contact_email` | Complaint routing targets |
| `Complaint` | `complaints` | `public_id` (JN-YYYY-NNNNN), `title`, `description`, `category`, `status`, `department_id`, `city_id`, `ward_id`, `lat`, `lng`, `priority`, `severity_score`, `risk_score`, `assigned_officer_id`, `timeline_json` | Core grievance record |
| `ComplaintAnalysis` | `complaint_analysis` | `complaint_id`, `language`, `cleaned_text`, `embedding_vector` (JSONB), `sentiment_score`, `duplicate_of_id`, `confidence_score`, `spam_score`, `candidate_issue_id`, `ai_status` | AI/ML output per complaint |

**Issue Clustering (`issue.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `IssueCluster` | `issue_clusters` | `title`, `summary`, `category`, `complaint_count`, `risk_level`, `risk_score`, `centroid_lat`, `centroid_lng`, `status`, `department_id`, `city_id`, `ward_id` | Systemic issue (cluster of similar complaints) |
| `IssueComplaint` | `issue_complaints` | `issue_id`, `complaint_id`, `similarity_score`, `relationship_type` (UNIQUE/DUPLICATE), `confidence_score` | M2M join between IssueCluster and Complaint |
| `Recommendation` | `recommendations` | `issue_id`, `title`, `action_type`, `priority`, `effort_level`, `expected_impact`, `steps_json` | AI-generated action plan for systemic issues |

**Procurement (`procurement.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `City` | `cities` | `name`, `state_code` | Multi-tenancy — every complaint belongs to a city |
| `Contractor` | `contractors` | `company_name`, `email`, `phone`, `public_rating`, `ai_rating`, `officer_rating`, `auth_user_id` | Company entity (separate from login User) |
| `ContractorCityRegistration` | `contractor_city_registrations` | `contractor_id`, `city_id`, `status` (PENDING/APPROVED/REVOKED/REJECTED), `approved_categories` | City eligibility — must be APPROVED for contractor login |
| `Tender` | `tenders` | `city_id`, `department_id`, `civic_issue_id`, `title`, `estimated_budget`, `status` (DRAFT/PUBLISHED/CLOSED/EVALUATING/AWARDED/CANCELLED) | Municipal procurement |
| `Bid` | `bids` | `tender_id`, `contractor_id`, `quoted_amount`, `status` | Contractor's sealed bid |
| `WorkOrder` | `work_orders` | `tender_id`, `bid_id`, `contractor_id`, `award_value`, `status`, `planned/reported/verified_progress_pct`, `risk_level`, `liquidated_damages_pct_per_day` | Execution contract |
| `FieldEvidence` | `field_evidence` | `work_order_id`, `photo_url`, `description` | Contractor's photo proof |
| `Inspection` | `inspections` | `field_evidence_id`, `inspector_user_id`, `result` (PASS/REWORK/FAIL), `feedback` | Officer's inspection decision |
| `ContractorReview` | `contractor_reviews` | `contractor_id`, `work_order_id`, `author_type` (PUBLIC/AI/OFFICER), `rating` (1.0-5.0), `comment`, `category` | Tri-party performance rating |

**Audit & ML (`audit.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `AuditLog` | `platform_audit_logs` | `actor_id`, `actor_name`, `actor_role`, `action`, `entity_type`, `entity_id`, `entity_label`, `previous_value`, `new_value`, `reason`, `at` | Immutable event record |
| `ModelRun` | `model_runs` | `run_type`, `model_name`, `input_count`, `output_summary_json`, `duration_ms`, `error_message` | ML/AI execution history |

**SLA (`sla.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `SLARule` | `sla_rules` | `category`, `severity`, `response_hours`, `resolution_hours`, `escalation_hours`, `is_active` | SLA targets per category and severity |

**Reputation & Gamification (`reputation.py`):**

| Model | Table | Key Fields | Purpose |
|-------|-------|-----------|---------|
| `CivicProfile` | `civic_profiles` | `user_id`, `xp_total`, `impact_score`, `reputation_score`, `level`, `streak_days`, `display_mode`, `leaderboard_opt_in` | Citizen's gamification profile |
| `XPTransaction` | `civic_xp_transactions` | `user_id`, `amount`, `action`, `reason`, `source_type`, `idempotency_key`, `status` | Immutable XP ledger (append-only) |
| `CivicImpactEvent` | `civic_impact_events` | `user_id`, `city_id`, `event_type`, `impact_points`, `idempotency_key` | Outcome-weighted civic impact (separate from activity XP) |
| `CivicAchievement` | `civic_achievements` | `code`, `name`, `description`, `role`, `criteria_json`, `active` | Badge catalog (admin-configurable) |
| `UserAchievement` | `civic_user_achievements` | `user_id`, `achievement_id`, `awarded_at`, `revoked_at` | Awarded badges |
| `CivicMission` | `civic_missions` | `code`, `title`, `description`, `city_id`, `xp_reward`, `active`, `starts_at`, `ends_at` | Timed civic challenges |
| `MissionProgress` | `civic_mission_progress` | `mission_id`, `user_id`, `progress_value`, `target_value`, `completed_at` | Per-user mission progress |
| `CivicRewardConfig` | `civic_reward_configs` | `key`, `value_json`, `version`, `active`, `updated_by_id` | Admin-editable XP multipliers (versioned) |
| `CivicReputationFlag` | `civic_reputation_flags` | `user_id`, `reason`, `severity`, `source_type`, `status`, `reviewed_by_id` | Trust & safety signal for review |

---

### 5.2 API Routes — Complete List

All routes are prefixed with `/api/v1`. The router is in `backend/app/api/v1/router.py`.

**Health (no auth required):**
```
GET  /health                      ← Backend health + DB connectivity check
GET  /                            ← Root: returns version info
```

**Auth (`/auth`):**
```
GET    /auth/me                    ← Current user profile (all roles)
PATCH  /auth/me                    ← Update profile: name, phone, ward, designation
                                      Also supports password change:
                                      { current_password, new_password }
POST   /auth/register              ← Citizen registration
POST   /auth/login                 ← Citizen / contractor login
POST   /auth/officer-login         ← Officer / admin login (validates role)
POST   /auth/contractor-login      ← Contractor login (validates city registration)
POST   /auth/admin-setup           ← Create users (requires X-Officer-Key header)
POST   /auth/password-reset/request  ← Send OTP (Brevo email or MSG91 SMS)
POST   /auth/password-reset/confirm  ← Verify OTP and change password
```

**Complaints (`/complaints`):**
```
GET    /complaints                 ← List complaints (scoped by role/city)
POST   /complaints                 ← Submit new complaint (triggers AI + grouping)
GET    /complaints/{id}            ← Single complaint
PATCH  /complaints/{id}/assignment ← Assign to officer (officer+)
PATCH  /complaints/{id}/status     ← Update status
GET    /complaints/{id}/similar    ← Find similar complaints (FAISS-powered)
POST   /complaints/{id}/upvote     ← Citizen upvote instead of duplicate
```

**Issues (`/issues`):**
```
GET    /issues                     ← List systemic issue clusters
GET    /issues/{id}                ← Single issue
PATCH  /issues/{id}                ← Update issue status/department
POST   /issues/materialize/{id}    ← Convert systemic issue to tender
POST   /issues/merge-proposals     ← Propose AI-driven complaint merges
POST   /issues/merge-proposals/confirm ← Confirm an AI merge proposal
```

**Procurement (`/procurement`):**
```
GET    /procurement/tenders                        ← List tenders (role-scoped)
POST   /procurement/tenders                        ← Create tender
GET    /procurement/tenders/{id}                   ← Single tender
POST   /procurement/tenders/{id}/publish           ← Publish tender (DRAFT→PUBLISHED)
POST   /procurement/bids                           ← Submit bid
GET    /procurement/bids/{tender_id}               ← List bids for a tender
POST   /procurement/bids/{tender_id}/{bid_id}/award ← Award bid
GET    /procurement/work-orders                    ← List work orders
GET    /procurement/work-orders/{id}               ← Single work order
PATCH  /procurement/work-orders/{id}/status        ← Update status (state machine)
POST   /procurement/work-orders/{id}/evidence      ← Upload field photo
                                                      (BUG-007 FIXED: only IN_PROGRESS/REWORK/ACCEPTED)
POST   /procurement/work-orders/{id}/inspections   ← Record inspection
                                                      (BUG-008 FIXED: FAIL→INSPECTION_FAILED not CLOSED)
GET    /procurement/contractors                    ← List contractors
GET    /procurement/contractors/{id}               ← Single contractor
POST   /procurement/contractors/{id}/ratings       ← Submit contractor rating
```

**Analytics (`/analytics`):**
```
GET  /analytics/summary            ← Dashboard KPIs (officer-scoped by city)
GET  /analytics/map                ← Map data for Leaflet visualization
GET  /analytics/public-map         ← Open public map data (no auth required)
POST /analytics/hotspots/detect    ← Trigger hotspot detection
```

**AI (`/ai` and `/ai/triage`):**
```
POST /ai/analyze                   ← Analyze complaint text (Groq LLM or heuristic)
POST /ai/analyze-image             ← Analyze citizen photo (vision model or fallback)
POST /ai/copilot                   ← Officer AI assistant chat
GET  /ai/triage                    ← Pending triage queue (BUG-016 FIXED: null check)
POST /ai/triage/{id}/route         ← Route a triage item
```

**Reputation (`/reputation`):**
```
GET    /reputation/me                              ← Citizen's full civic profile
PATCH  /reputation/me/preferences                 ← Update privacy settings
GET    /reputation/performance/me                  ← Role-based score (officer/contractor)
POST   /reputation/complaints/{id}/confirm-resolution ← Citizen confirms fix (awards XP)
GET    /reputation/city/{name}                    ← City-level impact leaderboard
```

**Cities (`/cities`):**
```
GET  /cities                       ← List all cities with IDs (used by login forms)
```

**Municipality (`/municipality`) — collector-level admin:**
```
GET  /municipality/officers                    ← List officers in collector's city
POST /municipality/officers                    ← Provision new officer
GET  /municipality/contractors                 ← List contractors in collector's city
POST /municipality/contractors                 ← Register new contractor
```

**Admin (`/admin`) — super-admin only:**
```
GET    /admin/me                   ← Super-admin profile
PATCH  /admin/me                   ← Update super-admin profile
GET    /admin/stats                ← Platform-wide stats (cached 60s)
GET    /admin/command-center       ← Live city-scoped snapshot for dashboard
GET    /admin/users                ← List all users
POST   /admin/users                ← Create any user type
GET    /admin/users/{id}           ← Single user
PATCH  /admin/users/{id}           ← Update user
DELETE /admin/users/{id}           ← Delete user (preserves complaint records)
GET    /admin/contractors          ← List all contractors with registrations
POST   /admin/contractors          ← Create contractor + optional login
POST   /admin/contractors/{id}/login ← Create/rotate contractor login credentials
PATCH  /admin/contractors/{id}/registrations/{reg_id} ← Approve/revoke/reject
POST   /admin/contractors/{id}/registrations          ← Add city registration
DELETE /admin/contractors/{id}     ← Remove demo contractor (restricted)
GET    /admin/cities               ← List all cities
POST   /admin/cities               ← Add new city
GET    /admin/work-orders          ← All work orders across all cities
GET    /admin/sla-rules            ← List SLA rules
PATCH  /admin/sla-rules/{id}       ← Update SLA thresholds
GET    /admin/audit-logs           ← Paginated audit trail (filter by role/entity)
POST   /admin/audit-logs           ← Manual audit entry (for special admin actions)
GET    /admin/reputation/summary   ← Reputation health summary
GET    /admin/reputation/ledger    ← XP transaction ledger
GET    /admin/reputation/config    ← Current XP reward config
PATCH  /admin/reputation/config    ← Update XP multipliers
POST   /admin/reputation/ledger/{id}/revoke ← Revoke an XP grant
POST   /admin/reputation/reconcile  ← Batch reconcile citizen XP
GET    /admin/model-runs           ← ML model run history (for AI Oversight page)
GET    /admin/model-runs/stats     ← AI oversight KPIs (total runs, error rate, avg duration)
```

**Master Data Management (`/mdm`):**
```
GET/POST/PATCH/DELETE  /mdm/wards        ← Ward management
GET/POST/PATCH/DELETE  /mdm/departments  ← Department management
```

**External / Sathi Setu (`/external`):**
```
POST /external/sathi-setu/ingest       ← Receive complaints from external systems
GET  /external/sathi-setu/status       ← Connection status
```

---

### 5.3 Auth System

**JWT Token Structure (after BUG-038 fix):**
```json
{
  "sub": "uuid-of-user",
  "email": "user@example.com",
  "role": "officer",
  "name": "Full Name",
  "exp": 1234567890
}
```

> **IMPORTANT:** The `name` claim was missing before our fix. Old cached tokens will show "Unknown User" in audit logs. After users log in again they'll get the correct name.

**Role hierarchy:**
```
citizen            ← Can submit complaints, view their own, earn XP
contractor         ← Can view work orders, submit evidence
officer            ← Can assign complaints, inspect work orders
supervisor         ← Officer + approve work orders, close complaints
municipality       ← Supervisor + provision officers/contractors
collector          ← Municipality + city-wide admin for one city
admin              ← Full platform access (only if email in SUPER_ADMIN_EMAILS)
```

**How each portal authenticates:**

1. **Public portal** → `POST /auth/login` → backend checks `role IN ('citizen', 'contractor')` → JWT
2. **Municipality portal** → `POST /auth/officer-login` → checks `role IN ('officer', 'supervisor', 'admin', 'municipality', 'collector')` → JWT. Also validates city match if submitted.
3. **Contractor portal** → `POST /auth/contractor-login` → checks password AND that `ContractorCityRegistration.status == APPROVED` for the selected city → JWT with city claim
4. **Admin portal** → `POST /auth/officer-login` → same endpoint, but portal additionally checks `is_super_admin` flag (`role == 'admin'` AND `email in SUPER_ADMIN_EMAILS` env set)

**Auth guard pattern (applies to all 4 portals):**

```typescript
// All portals follow this pattern in their auth context:

const refreshFromServer = async () => {
  try {
    const me = await api.auth.me();
    // Update cached user
    write(LS.user, me);
    return me;
  } catch (err: unknown) {
    // CRITICAL: Only clear session on HTTP 401 (invalid/expired token)
    // Network timeouts, 500 errors, Render cold starts — these must NOT log the user out
    const isUnauthorized = err instanceof APIClientError && err.status === 401;
    if (isUnauthorized) {
      window.localStorage.removeItem(LS.token);
      window.localStorage.removeItem(LS.user);
      return null;
    }
    // Transient error — return the cached user and try again next time
    return cached;
  }
};

// Return cached user immediately so UI never shows a loading bounce
if (cached) {
  refreshFromServer(); // background refresh, don't await
  return cached;
}
return refreshFromServer(); // no cache — must wait
```

**`PATCH /auth/me` — supports in-profile edits and password change:**

```python
# backend/app/api/v1/routes/auth.py
class MeUpdateIn(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    ward: Optional[str] = None
    designation: Optional[str] = None
    current_password: Optional[str] = None   # Required when changing password
    new_password: Optional[str] = None       # Min 8 chars, requires current_password
```

All 4 portals call `PATCH /api/v1/auth/me` from their profile pages. No OTP required for in-profile password change — the current password acts as verification.

---

### 5.4 Configuration & Environment Variables

All settings are in `backend/app/core/config.py` (pydantic-settings). They load from the `.env` file or environment variables (case-insensitive).

**Required in production (Render):**

| Variable | Example Value | Purpose |
|----------|--------------|---------|
| `DATABASE_URL` | `postgresql+psycopg://user:pass@host/db?sslmode=require` | Neon PostgreSQL connection |
| `OFFICER_API_KEY` | `change-me-secure-key` | Guards `/auth/admin-setup` endpoint |
| `JWT_SECRET` | `a-very-long-random-string` | JWT signing key |
| `ENVIRONMENT` | `production` | Controls NullPool, disables API docs |
| `CORS_ORIGINS` | `https://janmind-admin.vercel.app,...` | Comma-separated allowed origins |
| `SUPER_ADMIN_EMAILS` | `maherbhatt01@gmail.com` | Comma-separated super-admin allowlist |
| `COMMAND_CENTER_CITY_NAMES` | `Vadodara,Bengaluru,Mumbai,Delhi` | Cities visible in admin command center |

**Recommended (enables key features):**

| Variable | Purpose |
|----------|---------|
| `GROQ_API_KEY` | `gsk_...` from console.groq.com. Enables real LLM complaint analysis and vision model. Without it, falls back to keyword heuristics. |
| `BREVO_API_KEY` | Transactional email for OTP password reset |
| `BREVO_SENDER_EMAIL` | Verified sender email on Brevo |
| `MSG91_AUTHKEY` | Indian SMS gateway for OTP (alternative to email) |

**ML configuration (can leave as defaults):**

| Variable | Default | Purpose |
|----------|---------|---------|
| `SENTENCE_MODEL_NAME` | `sentence-transformers/all-MiniLM-L6-v2` | Embedding model |
| `SIMILARITY_THRESHOLD` | `0.72` | Threshold for duplicate detection in similar endpoint |
| `CANONICAL_GROUP_SIMILARITY_THRESHOLD` | `0.52` | Threshold for grouping into IssueCluster |
| `CANONICAL_GROUP_RADIUS_METERS` | `500.0` | Geographic proximity radius for grouping |
| `CANONICAL_GROUP_WINDOW_DAYS` | `30` | Temporal window for grouping candidates |
| `MIN_CLUSTER_SIZE` | `5` | Minimum complaints to form a systemic issue |

**Special flag:**

| Variable | Purpose |
|----------|---------|
| `DISABLE_AUTO_AUDIT` | Set to `"true"` before bulk import scripts to prevent thousands of noise audit entries. Checked at runtime (not import time) per listener callback. |

---

### 5.5 Dynamic Audit Logging

File: `backend/app/core/audit_listeners.py`

This was the **Phase 1 feature** from the SIH audit plan. Before this, audit logs were only written manually in 3 specific routes. Now, every significant DB change is automatically captured.

**How it works step by step:**

1. At startup, `main.py` calls `setup_auditing()`.
2. `setup_auditing()` registers SQLAlchemy mapper-level `after_insert`, `after_update`, `after_delete` events on 4 models: `Complaint`, `WorkOrder`, `Tender`, `SLARule`.
3. On every DB flush that touches these models, the listener fires.
4. The listener calls `attributes.get_history(target, field)` to see what changed.
5. It reads the current actor from a `ContextVar` (set by `audit_actor_middleware` in `main.py`).
6. It writes the `AuditLog` row using the SQLAlchemy `Connection` directly (not the ORM session — otherwise it causes re-entrant flush cycles).

**Actor identity flow:**
```
HTTP Request arrives
→ audit_actor_middleware reads Authorization: Bearer {token}
→ jwt.decode(token) extracts sub, name, role
→ set_audit_actor(actor_id, actor_name, actor_role) stores in ContextVar (per-async-task)
→ Request is processed (DB changes happen)
→ After-update listener fires → reads actor from ContextVar → writes AuditLog
→ Response is sent
→ middleware RESETS the ContextVar token (prevents leakage to next request — BUG-001 fix)
```

**Fields tracked per model:**

| Model | Field | Action Name |
|-------|-------|------------|
| `Complaint` | `status` | `COMPLAINT_STATUS_CHANGED` |
| `Complaint` | `assigned_officer_id` | `COMPLAINT_ASSIGNED` |
| `Complaint` | `priority` | `COMPLAINT_PRIORITY_CHANGED` |
| `WorkOrder` | `status` | `WORK_ORDER_STATUS_CHANGED` |
| `WorkOrder` | `risk_level` | `WORK_ORDER_RISK_CHANGED` |
| `WorkOrder` | `verified_progress_pct` | `WORK_ORDER_PROGRESS_VERIFIED` |
| `Tender` | `status` | `TENDER_STATUS_CHANGED` |
| `Tender` | `estimated_budget` | `TENDER_BUDGET_CHANGED` |
| `SLARule` | `response_hours` | `SLA_RESPONSE_HOURS_CHANGED` |
| `SLARule` | `resolution_hours` | `SLA_RESOLUTION_HOURS_CHANGED` |
| `SLARule` | `escalation_hours` | `SLA_ESCALATION_HOURS_CHANGED` |
| `SLARule` | `is_active` | `SLA_RULE_TOGGLED` |

**Safeguards:**
- `DISABLE_AUTO_AUDIT=true` → all listeners skip silently
- Idempotency: `setup_auditing()` is safe to call multiple times (idempotency guard)
- Exception swallowing: audit write failure never rolls back business transaction
- Audit rows atomically commit/rollback with the triggering operation

---

### 5.6 AI Service (Groq / xAI)

File: `backend/app/services/ai_service.py`

**Provider auto-detection:**
```python
if api_key.startswith("gsk_"):     # Groq
    base_url = "https://api.groq.com/openai/v1"
    model = "llama-3.1-8b-instant"
    vision_model = "meta-llama/llama-4-scout-17b-16e-instruct"
elif api_key.startswith("xai-"):   # xAI / Grok
    base_url = "https://api.x.ai/v1"
    model = "grok-beta"
    vision_model = "grok-2-vision-1212"
```

**`analyze_complaint(title, description, category_hint, language)`:**
- Sends to `POST {base_url}/chat/completions` with `response_format: { type: "json_object" }`
- System prompt tells the model to return:
  ```json
  {
    "category": "road_damage|water_supply|garbage_collection|drainage|street_lighting|electricity|sanitation|spam|invalid",
    "severity_score": 1-10,
    "risk_score": 1-100,
    "priority": "low|medium|high|urgent",
    "department_slug": "roads|water_supply|sanitation|drainage|electricity|public_works",
    "language": "en|hi|gu|kn",
    "interpreted_text": "...",
    "summary": "...",
    "suggested_action": "..."
  }
  ```
- Timeout: 10 seconds
- Falls back to `_local_complaint_heuristic()` on any failure

**`analyze_image(data_url, description)`:**
- Sends base64 image to the vision model
- System prompt tells the model to look at actual pixels (not filename)
- Returns: `detected`, `category`, `confidence` (Low/Medium/High), `evidence`, `safety_note`
- Falls back to `_manual_image_review()` (text-based heuristic using description words) when no vision provider

**`_local_complaint_heuristic()`:**
Full multilingual fallback. Keyword lists for English, Hindi (Devanagari), Gujarati, Kannada:
- `road_damage`: "pothole", "road", "tar", "सड़क", "गड्ढा", "રસ્તો", "ખાડો", "ರಸ್ತೆ", "ಗುಂಡಿ"
- `water_supply`: "water", "leak", "पानी", "નળ", "ಸೋರಿಕೆ"
- `garbage_collection`: "garbage", "कचरा", "કચરો", "ಕಸ"
- `drainage`: "drain", "waterlogging", "नाली", "ఛರండి"
- `street_lighting`: "light", "pole", "बत्ती", "બત્તી", "ದೀಪ"
- `electricity`: "power", "voltage", "बिजली", "વીજળી"

---

### 5.7 Canonical Grouping (Duplicate Detection)

File: `backend/app/services/canonical_grouping.py`

Called every time a new complaint is submitted. Determines whether the new complaint belongs to an existing `IssueCluster` or needs a new one.

**Algorithm:**

1. Fetch candidate complaints: same city + same category + within last 30 days + not rejected
2. For each candidate, compute a match score:
   ```
   geographic_check: Haversine distance < 500m OR same ward_id OR address token overlap
   text_score = cosine(embedding_a, embedding_b) × 0.75 + jaccard_tokens × 0.25
   if geo distance is known:
     proximity_boost = 0.15 × (1 - distance/500m)
     text_score = min(1.0, text_score + proximity_boost)
   accept if text_score >= 0.52 (configurable)
   ```
3. If matches found: merge all their `IssueCluster` groups (deterministically — lowest UUID wins)
4. If no matches: create new `IssueCluster`
5. Link complaint to group via `IssueComplaint`
6. Update `IssueCluster.centroid_lat/lng` (average of all member coordinates)
7. Update `ComplaintAnalysis.ai_status = "DUPLICATE"` for matched complaints

**Concurrency safety:**
PostgreSQL advisory lock `pg_advisory_xact_lock(hashtext('civic-group:{city_id}:{category}'))` prevents race conditions when two complaints in the same city+category are submitted simultaneously.

---

### 5.8 SLA System

`SLARule` records define targets by category + severity:

| Category | Severity | Response Hours | Resolution Hours | Escalation Hours |
|----------|----------|---------------|-----------------|-----------------|
| Road Damage | CRITICAL | 2 | 24 | 4 |
| Road Damage | HIGH | 4 | 48 | 8 |
| Water Supply | CRITICAL | 2 | 24 | 4 |
| ... | ... | ... | ... | ... |

These are editable in the Admin portal → SLA Config. Changes trigger an `AuditLog` entry automatically.

---

### 5.9 Reputation & Gamification

The gamification engine is fully built but needs the admin to configure XP values via `/admin/reputation/config`.

**How citizens earn XP:**
- Filing a complaint: XP granted via `XPTransaction`
- Complaint resolved: more XP + `CivicImpactEvent`
- Confirming resolution (citizen clicks "This was fixed"): XP + triggers `confirm_resolution` service
- Completing a `CivicMission`
- Idempotency: every XP grant has an `idempotency_key` — cannot double-grant the same event

**Admin controls:**
- Edit XP multipliers at `/admin/reputation/config`
- View XP ledger at `/admin/reputation/ledger`
- Revoke individual XP grants
- Manage flags/trust signals via Trust & Safety page

---

## 6. ML Pipeline — Complete Guide

### 6.1 What the ML Actually Does

There are **two separate ML systems**:

1. **Offline pipeline** (`backend/ml/` directory) — runs once on the full 118k complaint dataset to identify systemic issues, risk scores, and recommendations. Results are loaded into PostgreSQL.

2. **Live inference** (`backend/app/services/ai_service.py` and `canonical_grouping.py`) — runs on every new complaint in real-time to classify, analyze, and group it.

### 6.2 Phase-by-Phase Breakdown

The offline pipeline has 10 phases, orchestrated by `CivicSathiPipeline` in `backend/ml/pipeline.py`:

**Phase 1 — Data Loading (`data_loader.py`, `preprocessing.py`):**
- Loads raw CSV files from `backend/data/raw/`
- Cleans: removes duplicates, normalizes dates, standardizes categories and status strings
- Creates `civicsathi_master.csv` (raw merged) and `civicsathi_preprocessed.csv` (cleaned)
- Memory-optimized: loads in 100k-row chunks for the 118k+ dataset

**Phase 2 — Feature Engineering (`feature_engineering.py`, `nlp.py`):**
- Creates: `category_frequency`, `ward_frequency`, `is_closed`, `is_reopened`, `has_remarks`
- NLP: combines `category + subcategory + staff_remarks` → `combined_text`
- Text cleaning: lowercase, remove special chars, collapse whitespace
- Creates `civicsathi_nlp.csv`

**Phase 3 — Semantic Embeddings (`embeddings.py`):**
- Model: `sentence-transformers/all-MiniLM-L6-v2`
- Input: `text_cleaned` field for every complaint
- Output: 384-dimensional float32 vectors, L2-normalized (for cosine similarity)
- Batch size: 256 (fits in 4GB RAM)
- Saved as `backend/data/embeddings/embeddings_full.npy`
- **This is NOT training** — it's inference using a pre-trained model. No fine-tuning is needed or done.

**Phase 4 — FAISS Index (`similarity.py`):**
- Builds `IndexFlatIP` (inner product) over all 118k normalized embeddings
- Saved as `backend/data/embeddings/faiss_index_full.bin`
- Cosine similarity threshold: 0.70 for "similar complaint" endpoint
- Enables sub-millisecond similarity lookup at query time

**Phase 5 — Systemic Issue Clustering (`clustering.py`):**
Primary algorithm (`SystemicClusterer`):
1. Group by `category × ward_name` (each unique combination = one primary cluster)
2. Minimum size filter: clusters with < 5 complaints are dropped as noise
3. Temporal refinement: if complaints in a cluster span > 30 days, split into 30-day windows
4. Optional semantic refinement via FAISS (currently uses temporal as final)
Output: `cluster_id` column on each complaint

**Phase 6 — Temporal Pattern Analysis (`temporal_analysis.py`):**
For each cluster, classifies the temporal pattern:
- `ACUTE`: spike within 7 days (new emerging issue)
- `PERSISTENT`: complaints spread over > 30 days (chronic infrastructure problem)
- `SEASONAL`: annual recurring pattern
- `CYCLICAL`: recurring every few weeks
- `DECLINING`: complaint volume dropping over time
- `STABLE`: roughly flat volume

Calculates `temporal_risk_score` (0-15) based on: complaint velocity, recency weight, trend direction.

**Phase 7 — 6-Factor Risk Scoring (`risk.py`):**

The `RiskScorer` calculates a 0-100 risk score for each cluster using these 6 weighted factors:

| Factor | Weight | Calculation |
|--------|--------|-------------|
| Frequency | 20 | `complaint_count / max_count` normalized |
| Temporal | 15 | From phase 6 |
| Geographic | 15 | Ward concentration (`ward_frequency` normalized) |
| Category | 25 | Domain criticality weight (see table below) |
| Recurrence | 15 | Reopen rate of complaints |
| Persistence | 10 | `duration_days / 60` capped at 1.0 |

**Category criticality weights (domain knowledge from municipal domain):**

| Category | Criticality |
|----------|------------|
| Water Crisis | 1.00 |
| COVID/Health | 0.96 |
| Health Dept | 0.88 |
| Sanitation | 0.84 |
| Electrical | 0.80 |
| Storm Water Drain | 0.76 |
| Solid Waste (Garbage) | 0.72 |
| Road Maintenance | 0.68 |
| Road Infrastructure | 0.64 |
| Traffic | 0.56 |
| Revenue Department | 0.52 |
| Lakes | 0.48 |
| Town Planning | 0.44 |
| Parks & Playgrounds | 0.32 |

**Risk levels:**
- CRITICAL ≥ 67
- HIGH ≥ 50
- MEDIUM ≥ 34
- LOW < 34

**Phase 8 — Systemic Issue Detection (`systemic_issue.py`):**
- Clusters that pass the risk threshold become `IssueCluster` DB records
- Assigns `issue_type`, `title`, `summary` from cluster metadata

**Phase 9 — Root Cause Analysis (`root_cause.py`):**
- Pattern-matches clusters against known root cause templates
- Example: if `Road Maintenance` cluster spikes in June-September → root cause = "Monsoon damage"
- Associates infrastructure age, seasonal patterns, contractor rework history

**Phase 10 — Recommendations (`recommendations.py`):**
- Generates `Recommendation` records per systemic issue
- `action_type`: PREVENTIVE, CORRECTIVE, MONITORING
- `priority`: URGENT, HIGH, MEDIUM, LOW
- `steps_json`: ordered list of concrete actions

---

### 6.3 Live Inference (Per-Complaint, Real-Time)

When a citizen submits a complaint, this sequence runs synchronously (within the POST /complaints request):

```
1. ai_service.analyze_complaint(title, description)
   → Groq LLM returns: category, severity_score, risk_score, priority, summary
   → Falls back to multilingual keyword heuristic if API unavailable

2. canonical_grouping.assign_canonical_group(db, complaint, embedding)
   → Loads all-MiniLM-L6-v2 model (cached in memory after first call)
   → Generates 384-dim embedding for this complaint
   → Queries PostgreSQL for candidates (same city, category, last 30 days)
   → Computes cosine similarity + Haversine distance for each candidate
   → Groups complaint into existing IssueCluster or creates new one
   → Returns: (group_id, matches, operation='created'|'reused'|'merged')

3. complaint_service creates ComplaintAnalysis record with:
   → language, cleaned_text, embedding_vector, confidence_score, ai_status
   → candidate_issue_id (the IssueCluster it was grouped into)

4. AuditLog auto-written by SQLAlchemy listener (INSERT event)
```

**Important:** The sentence-transformers model is loaded lazily on first use and kept in memory. On Render free tier, the first request after a cold start takes ~30 seconds while the model loads. After that, inference is fast.

---

### 6.4 How to Run the ML Pipeline

```bash
cd backend
# Activate virtual environment first

# Option 1: Full pipeline on complete dataset
python run_full_pipeline.py

# Option 2: Sample of 50k records for testing
python run_pipeline_auto.py --sample 50000

# Option 3: Load existing pipeline output into the database
python load_ml_results_to_db.py

# Option 4: Individual phases
cd ml
python data_loader.py     # Phase 1
python preprocessing.py   # Phase 1 continued
python embeddings.py      # Phase 3 (takes ~20 min for 118k records)
python similarity.py      # Phase 4 (builds FAISS index)
python clustering.py      # Phase 5
python risk.py            # Phase 7
python pipeline.py        # All phases end-to-end
```

**Data directory expected structure:**
```
backend/data/
├── raw/
│   ├── BBMP_2021.csv        (or whatever your source files are named)
│   ├── BBMP_2022.csv
│   └── ...
├── processed/              (auto-created by pipeline)
│   ├── civicsathi_master.csv
│   ├── civicsathi_preprocessed.csv
│   ├── civicsathi_features.csv
│   ├── civicsathi_nlp.csv
│   └── ...
└── embeddings/             (auto-created)
    ├── embeddings_full.npy
    ├── faiss_index_full.bin
    ├── id_mapping_full.csv
    └── embeddings_metadata.json
```

---

### 6.5 Model Files and Sizes

| Model | Size | Where Stored | Purpose |
|-------|------|-------------|---------|
| `all-MiniLM-L6-v2` | ~85 MB | HuggingFace cache (`~/.cache/huggingface/`) | Text embedding (384-dim) |
| `en_core_web_sm` (spaCy) | ~15 MB | spaCy models dir | NLP preprocessing (optional, runtime graceful) |
| `embeddings_full.npy` | ~175 MB (118k × 384 × 4B) | `backend/data/embeddings/` | Pre-computed complaint embeddings |
| `faiss_index_full.bin` | ~175 MB | `backend/data/embeddings/` | FAISS similarity index |

To pre-download the models locally:
```bash
cd backend
python download_models.py
```

On Render production, models download on first startup. After the first cold start, they are cached for the session lifetime.

---

## 7. Shared Package — api-client

Package: `packages/api-client`
Import name: `@civicsathi/api-client`

All 4 portals import this. It provides:

**`APIClient` class:**
```typescript
const client = new APIClient({
  baseUrl: "https://civic-sathi-f7ml.onrender.com",
  getToken: () => localStorage.getItem("civicsathi.token"),
  onUnauthorized: () => { /* clear token + redirect to login */ }
});
```
- Wraps `fetch` with: `Authorization: Bearer {token}` header
- 60-second timeout (prevents UI hanging on Render cold start)
- On HTTP 401: calls `onUnauthorized()` (each portal's handler clears its specific localStorage keys)
- `client.get<T>(path)`, `client.post<T>(path, body)`, `client.patch<T>(path, body)`

**`Endpoints` class:**
```typescript
const api = new Endpoints(client);

// Auth
await api.auth.me()
await api.auth.loginCitizen({ email, password })
await api.auth.loginOfficer({ email, password, city })
await api.auth.registerCitizen({ name, email, password, phone })

// Complaints
await api.complaints.list({ limit, city, ward, category, status })
await api.complaints.get(id)
await api.complaints.create(input)
await api.complaints.updateStatus(id, status, notes)

// Tenders
await api.tenders.list(cityId)
await api.tenders.get(id)
await api.tenders.submitBid(tenderId, { quoted_amount, technical_proposal })
await api.tenders.awardBid(tenderId, bidId)

// Work Orders
await api.workOrders.list(cityId)
await api.workOrders.get(id)
await api.workOrders.updateStatus(id, status)
await api.workOrders.submitEvidence(id, { photo_url, description })
await api.workOrders.inspect(id, { result, feedback })

// Cities
await api.cities.list()

// Contractors
await api.contractors.list()
await api.contractors.getRatings(contractorId)
await api.contractors.submitRating(contractorId, { rating, comment, category })

// AI
await api.ai.analyzeComplaint({ title, description, category_hint, language })
await api.ai.analyzeImage({ data_url, description })
```

**`APIClientError` class:**
```typescript
class APIClientError extends Error {
  constructor(public status: number, public message: string) {}
}
// Usage: err instanceof APIClientError && err.status === 401
```

**`FALLBACK_BACKEND_URL`:**
```typescript
export const FALLBACK_BACKEND_URL = "https://civic-sathi-f7ml.onrender.com";
```
Used in all 4 `getApiBaseUrl()` functions as the fallback when `VITE_API_BASE_URL` env var isn't set or contains an old URL.

---

## 8. How the Frontend Connects to the Backend

Every portal's `src/services/api.ts` file follows this pattern:

```typescript
// 1. Determine the backend URL
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (!envUrl || envUrl.includes("civicsathi-backend.onrender.com") /* old URL */) {
    return FALLBACK_BACKEND_URL;
  }
  // Also switch to HTTPS if the page is HTTPS but env has HTTP
  if (window.location.protocol === "https:" && envUrl.startsWith("http://")) {
    return FALLBACK_BACKEND_URL;
  }
  return envUrl;
}

// 2. Create shared client instance (singleton)
export const client = new APIClient({
  baseUrl: getApiBaseUrl(),
  getToken: () => window.localStorage.getItem(LS.token),
  onUnauthorized: () => { /* remove tokens, redirect to /login */ }
});

// 3. Create typed endpoints wrapper
export const api = new Endpoints(client);
```

**LocalStorage keys by portal:**

| Portal | Token Key | User/Session Key |
|--------|-----------|-----------------|
| Public | `civicsathi.token` | `civicsathi.user` |
| Municipality | `civicsathi_muni_token` | `civicsathi_muni_officer` |
| Contractor | `civicsathi_contractor_token` | `civicsathi_contractor_user` |
| Admin | `civicsathi.admin_token` | `civicsathi.admin_user` |

> These keys are intentionally different. A user can be logged in to multiple portals simultaneously in the same browser without conflicts.

---

## 9. The Four Portals — Deep Dive

### 9.1 Public Portal (Citizen)

**Location:** `apps/public/`  
**Dev port:** 8080  
**Vercel URL:** `https://janmind-public.vercel.app`

**Routes:**
```
/               → Redirects to /hub (if logged in) or /login
/login          → Citizen login form
/register       → Citizen registration form
/forgot-password → OTP-based password reset
/hub            → City hub: emergency numbers, civic announcements
/report         → File a new complaint (multi-step form with AI analysis)
/analyzing      → Loading state after complaint submission
/complaints     → List all my complaints
/complaint/:id  → Single complaint with timeline
/map            → Leaflet civic map
/notifications  → My notification history
/profile        → Civic identity, gamification, privacy settings, edit profile
/contractors    → Rate contractors publicly
```

**Key files:**
- `lib/auth.tsx` — `AuthProvider` with `useAuth()`. Exports: `user`, `ready`, `save(patch)`, `signOut()`. `save()` calls `PATCH /api/v1/auth/me`.
- `lib/require-auth.tsx` — `<AuthGate redirectTo="/login">` wraps protected routes
- `services/api.ts` — ALL backend calls go through here
- `routes/report.tsx` — Multi-step complaint form. On typing, calls `analyzeComplaint()`. On photo upload, calls `analyzeImage()`.
- `routes/profile.tsx` — Full edit form + gamification stats + privacy controls + change password

**Report flow detail:**
```
1. Citizen types description
2. `analyzeComplaint()` called (debounced 500ms)
   → POST /api/v1/ai/analyze
   → Returns category, severity, summary, suggested_action
3. Citizen uploads photo (optional)
   → uploadComplaintPhoto() converts to base64 data URL
   → POST /api/v1/ai/analyze-image
   → Vision model classifies from pixels
4. Citizen submits form
   → POST /api/v1/complaints
   → Backend assigns public_id, runs grouping, stores everything
5. Frontend redirects to /analyzing (polling every 3s)
6. Redirects to /complaint/{public_id} when ready
```

**Notification system:**
- Notifications are stored locally in `civicsathi.notifications` localStorage key
- When a complaint is submitted, a notification record is created locally
- `getNotifications()` validates each notification's complaint is still readable by calling `api.complaints.get()` — removes orphaned notifications
- Mark all read: `markNotificationsRead()` — updates localStorage

---

### 9.2 Municipality Portal (Officer)

**Location:** `apps/municipality/`  
**Dev port:** 8081  
**Vercel URL:** `https://janmind-municipality.vercel.app`

**Routes (all behind `/_auth/` layout with auth gate):**
```
/_auth/dashboard          → KPI cards, hotspots, live activity
/_auth/complaints         → Searchable complaint list
/_auth/complaints/:id     → Detail: timeline, assignment, AI analysis
/_auth/issues             → Systemic issue clusters
/_auth/issues/:id         → Single issue with linked complaints + recommendations
/_auth/areas              → Area overview cards (risk by area)
/_auth/areas/:id          → Single area drill-down
/_auth/departments        → Department load stats
/_auth/departments/:id    → Single department performance
/_auth/alerts             → Auto-generated risk alerts (from complaint clustering)
/_auth/map                → Civic map with Leaflet
/_auth/analytics          → Charts: trends, severity, department load, resolution
/_auth/tenders            → Tender management
/_auth/tenders/:id        → Single tender: bids, award, work order
/_auth/work-orders        → All work orders
/_auth/work-orders/:id    → Detail: evidence, inspections, timeline
/_auth/work-packages      → Work packages
/_auth/ai-triage          → AI triage queue
/_auth/profile            → Officer profile edit, password change, theme, performance
/_auth/settings           → Portal preferences
```

**Key files:**
- `lib/muni-auth.tsx` — `MuniAuthProvider` and `useMuniAuth()`. Returns `officer`, `ready`, `settings`, `signIn()`, `signOut()`, `updateSettings()`.
- `lib/require-muni-auth.tsx` — `<RequireMuniAuth>` wraps `/_auth` layout
- `services/api.ts` — 800+ lines. THE integration point. Handles status mapping (backend `in_review` ↔ UI "Under Review"), work order normalization, alert generation from complaints.
- `services/types.ts` — TypeScript contracts. **Do not change shapes without coordinating with backend.**

**Status mapping (critical — backend strings ≠ UI labels):**

| Backend status | UI label |
|----------------|---------|
| `received` | "Received" |
| `in_review` | "Under Review" |
| `assigned` | "Assigned" |
| `in_progress` | "In Progress" |
| `resolved` | "Resolved" |
| `rejected` | "Rejected" |

**Work order status mapping:**

| Backend status | UI status |
|----------------|---------|
| `ISSUED` | `PENDING_ACCEPTANCE` |
| `ACCEPTED` | `ACCEPTED` |
| `IN_PROGRESS` | `IN_PROGRESS` |
| `INSPECTION_PENDING` | `SUBMITTED_FOR_INSPECTION` |
| `INSPECTION_FAILED` | `INSPECTION_FAILED` |
| `REWORK` | `REWORK` |
| `COMPLETED` | `COMPLETED` |
| `CLOSED` | `CLOSED` |

**Profile page features (after our fixes):**
- Edit form: name, phone, designation
- Change password (in-profile, no OTP)
- Theme toggle: light/dark/system
- Live civic performance score from `/api/v1/reputation/performance/me`

---

### 9.3 Contractor Portal

**Location:** `apps/contractor/`  
**Vercel URL:** `https://janmind-contractor.vercel.app`

**Routes (all behind `/contractor/` layout):**
```
/contractor/dashboard     → KPIs, active projects, eligible tenders
/contractor/tenders       → Available tenders in contractor's city
/contractor/work-orders   → Assigned work orders
/contractor/work-orders/:id → Detail: submit evidence, track progress
/contractor/performance   → Performance ratings, civic reputation
/contractor/profile       → Company info, edit personal account, change password
```

**Authentication gotcha:**
Contractor login uses `/auth/contractor-login` which requires:
1. Valid email + password
2. A **city** selection (dropdown in login form)
3. That city's `ContractorCityRegistration` for this contractor must have `status = APPROVED`

If a contractor gets "not approved for this municipality":
→ Log into Admin portal → Contractors section → find the contractor → click their city registration → approve it.

**Key files:**
- `lib/contractor-auth.tsx` — `ContractorAuthProvider` and `useContractorAuth()`
- `services/api.ts` — `contractorLogin()`, `getWorkOrders()`, `submitFieldEvidence()`, `getContractorPerformance()`
- `routes/contractor/profile.tsx` — Personal account edit, password change, civic reputation display

---

### 9.4 Admin Portal (Super-Admin)

**Location:** `apps/admin/`  
**Vercel URL:** `https://janmind-admin.vercel.app`

**Routes:**
```
/admin/dashboard            → Live command center with charts
/admin/contractors          → All contractors with approval controls
/admin/contractors/:id      → Single contractor detail
/admin/work-orders-overview → All work orders across all cities
/admin/sla                  → SLA rule editor
/admin/audit-logs           → Dynamic audit trail (auto-populated)
/admin/global-complaints    → God-mode: search any complaint across any city
/admin/ai-oversight         → ML model runs, accuracy KPIs
/admin/mdm                  → Master data: wards, departments
/admin/gamification         → Mission/achievement management
/admin/trust-safety         → Reputation flag review
/admin/interoperability     → Sathi Setu connection status
/admin/settings             → Profile edit, password change, theme
```

**Auth:**
- Uses `adminLogin()` which hits `/api/v1/auth/officer-login`
- Additionally checks `admin.isSuperAdmin === true` (the `is_super_admin` flag from `/api/v1/admin/me`)
- Only works if the logged-in user's email is in `SUPER_ADMIN_EMAILS` env var on the backend

**Key files:**
- `services/shared-store.ts` — ALL admin API calls. `adminApiFetch()` is now exported.
- `lib/admin-auth.tsx` — `AdminAuthProvider` and `useAdminAuth()`
- `routes/admin/route.tsx` — Sidebar layout with theme toggle in footer
- `routes/admin/dashboard.tsx` — Calls `getCommandCenterSnapshot()` and `getAuditLogs()`
- `routes/admin/ai-oversight.tsx` — Calls `/admin/model-runs/stats` and `/admin/model-runs`
- `routes/admin/settings.tsx` — Profile edit, password change, theme, platform info

**Dashboard charts (recharts):**
- City-wise breakdown: stacked bar (open/in_progress/resolved per city)
- Status distribution: donut pie chart
- Monthly trends: line chart (filed vs resolved)
- Department load: horizontal bar chart

**AI Oversight:**
- If `total_runs == 0` (no GROQ_API_KEY set): shows amber warning with setup instructions
- If `total_runs > 0`: shows green "Live ML Telemetry" badge with real KPIs

---

## 10. Sathi Setu — Interoperability Service

**Location:** `sathi-setu/`  
**This is the SIH core differentiator.**

Other teams build apps. We built infrastructure that connects apps.

### The 10 Tables:

| Table | Purpose |
|-------|---------|
| `external_systems` | Registered external grievance systems (BBMP portal, Maharashtra State portal, etc.) |
| `connector_configs` | Field mappings per system and API version. Each system has different field names — this normalizes them. |
| `identities` | **Golden record** for a canonical citizen identity, resolved across systems |
| `identity_links` | Links `identity_id` to a specific `external_id` on a specific `external_system_id` with a `confidence_score` |
| `consents` | Cross-system data sharing consent. `status` = PENDING/GRANTED/REVOKED. Before any data is shared, consent must be GRANTED. |
| `unified_applications` | A single application (complaint/grievance) tracked across multiple systems with a unified ID |
| `events` | Event stream for inter-system communication (asynchronous, with `processed` flag) |
| `data_quality_issues` | Detected problems: missing fields, format mismatches, duplicate records |
| `audit_entries` | Immutable audit trail (separate from the main backend's audit log) |
| `idempotency_records` | Deduplication keys for external webhook calls (prevents double-processing) |

### How to run the Sathi Setu demo:

```bash
cd sathi-setu

# Install dependencies
pip install -r requirements.txt

# Set up the database
cp .env.example .env
# Edit .env: SATHI_SETU_DATABASE_URL=postgresql+psycopg://...
alembic upgrade head

# Seed demo data (creates 2 connected systems + sample cross-system complaints)
python scripts/init_demo.py

# Start the service
uvicorn app.main:app --port 8001

# Open the web console
# http://localhost:8001/console
```

### The demo flow for SIH judges:

1. Submit a complaint on Civic Sathi (System A)
2. Open the Sathi Setu console at `localhost:8001/console`
3. Show the `identities` table — Civic Sathi citizen was auto-linked
4. Submit a near-duplicate complaint on the mock legacy system
5. Sathi Setu runs identity resolution — same citizen detected across two systems
6. Show the `unified_applications` table — one unified tracking ID spans both complaints
7. **The money shot:** show the consent gate. Try to share data between systems without consent — it's denied. Grant consent — it's allowed.

### Connectors:

- `app/connectors/base.py` — Abstract `BaseConnector` class
- `app/connectors/civic_sathi.py` — Adapts Civic Sathi's API (POST /api/v1/external/sathi-setu/ingest)
- `app/connectors/mock_legacy.py` — Simulates an older government portal with different JSON field names

---

## 11. CSS Design System

All portals use the same CSS variables and glass-morphism aesthetic. Never change these values without understanding WCAG 2.2 AA compliance implications.

**Core CSS variables (from `styles.css`):**

```css
/* Glass morphism */
--glass: rgba(255, 255, 255, 0.85);          /* 85% opacity — minimum for AA contrast */
--glass-strong: rgba(255, 255, 255, 0.92);
--surface: rgba(255, 255, 255, 0.60);
--surface-elevated: rgba(255, 255, 255, 0.80);
--glass-border: rgba(0, 0, 0, 0.08);

/* Brand colors */
--primary: #2563eb;      /* Civic blue */
--saffron: #f97316;      /* India-inspired saffron (accent) */
--success: #16a34a;      /* Resolution green */
--critical: #dc2626;     /* SLA breach red */
--warning: #d97706;      /* Amber warning */

/* Dark mode overrides */
.dark {
  --glass: rgba(15, 15, 15, 0.85);
  --surface: rgba(20, 20, 20, 0.60);
  /* etc. */
}
```

**Component usage:**
```tsx
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { GlassInput } from "@/components/ui/glass-input";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";

// GlassCard with elevation
<GlassCard elevation="raised" className="p-6">
  <SectionLabel>Statistics</SectionLabel>
  <h2 className="text-xl font-semibold mt-2">...</h2>
</GlassCard>

// Responsive loading state
<LoadingState message="Loading complaints..." />

// Error state
<ErrorState description={error.message} />
```

**Theme toggle:**
- Controlled by `lib/theme.tsx` in each portal
- `ThemeProvider` wraps the root
- `useTheme()` returns `{ mode, resolved, setMode }`
- Persisted in localStorage key `civicsathi.theme`
- Values: `"light"` | `"dark"` | `"system"`
- Applied via `.dark` class on `<html>` element (no flash on load — script is inlined in `<head>`)

---

## 12. Deployment Guide

### Backend (Render)

The `backend/render.yaml` file defines the entire deployment. Render reads it automatically.

```yaml
services:
  - type: web
    name: civicsathi-backend
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /api/v1/health
```

**Steps:**
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Render auto-detects `render.yaml`
4. Set environment variables (see section 5.4 above)
5. Deploy

**Free tier cold starts:** ~30 seconds after 15 minutes of inactivity. Frontends handle this with the cached-user pattern (return cached user instantly, refresh in background).

### Frontends (Vercel)

Each of the 4 portals is a **separate Vercel project**. Do not try to deploy them as a monorepo — they need independent deployment pipelines.

**For each portal:**
1. Go to vercel.com → Add New Project
2. Connect GitHub repo
3. Set root directory to `apps/public` (or municipality/contractor/admin)
4. Build command: `bun run build`
5. Set environment variable: `VITE_API_BASE_URL=https://your-render-url.onrender.com`
6. Deploy

> **DO NOT remove `preset: "vercel"` from `vite.config.ts`.** This tells Vite's Nitro SSR adapter to output in Vercel's expected format. Without it, the build may pick the wrong server output target and Vercel will serve nothing.

---

## 13. Developer Setup (Local)

### Prerequisites

- **Node.js 20+** — `node --version`
- **Bun 1.x** — `curl -fsSL https://bun.sh/install | bash` (Mac/Linux) or see bun.sh for Windows
- **Python 3.11+** — `python --version`
- **PostgreSQL** — Neon free tier works great. `https://neon.tech`
- **Git**

### Step 1: Clone and install

```bash
git clone https://github.com/Maher-Bhatt/Civic-Sathi.git
cd Civic-Sathi
npm install      # Installs workspace dependencies (includes api-client package)
```

### Step 2: Backend setup

```bash
cd backend
python -m venv .venv

# Activate virtual environment
# Windows:   .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
```

### Step 3: Configure backend environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql+psycopg://user:password@host/database?sslmode=require
OFFICER_API_KEY=any-secure-string-you-choose
JWT_SECRET=a-very-long-random-string-at-least-32-chars
ENVIRONMENT=local
CORS_ORIGINS=http://localhost:8080,http://localhost:8081,http://localhost:8082,http://localhost:8083
GROQ_API_KEY=gsk_...   # Get free from console.groq.com
ENABLE_SEED_ENDPOINT=true
```

### Step 4: Run migrations and seed data

```bash
cd backend  # (make sure venv is active)

alembic upgrade head        # Creates all 35+ tables

python seed_master.py       # Seeds all 4 cities with users, complaints, tenders, work orders

# (Optional) Run data integrity repair
python scripts/repair_data.py --city-separation
```

### Step 5: Start the backend

```bash
cd backend
uvicorn app.main:app --reload
# Backend running at http://localhost:8000
# API docs: http://localhost:8000/docs
```

### Step 6: Configure and start frontends

Each portal needs its own `.env` file:
```bash
# Create env files for each portal
echo "VITE_API_BASE_URL=http://localhost:8000" > apps/public/.env
echo "VITE_API_BASE_URL=http://localhost:8000" > apps/municipality/.env
echo "VITE_API_BASE_URL=http://localhost:8000" > apps/contractor/.env
echo "VITE_API_BASE_URL=http://localhost:8000" > apps/admin/.env
```

Start all portals:
```bash
# From repo root
npm run dev
# This runs dev in all workspace apps simultaneously
```

Or start individually:
```bash
cd apps/public        && bun run dev   # → http://localhost:8080
cd apps/municipality  && bun run dev   # → http://localhost:8081
cd apps/contractor    && bun run dev   # → http://localhost:8082
cd apps/admin         && bun run dev   # → http://localhost:8083
```

### Step 7: Regenerate route trees (after adding new routes)

```bash
cd apps/admin        && bunx tsr generate
cd apps/municipality && bunx tsr generate
cd apps/contractor   && bunx tsr generate
cd apps/public       && bunx tsr generate
```

**Never edit `routeTree.gen.ts` manually.**

### Running backend tests

```bash
cd backend
pytest                    # Requires Docker running (Testcontainers spins up PostgreSQL)
pytest -v app/tests/      # Verbose
pytest --tb=short         # Shorter tracebacks
```

> Tests use Testcontainers (a real PostgreSQL Docker container). SQLite will NOT work — the schema uses PostgreSQL-specific JSONB columns and UUID types.

---

## 14. Login Credentials — All Portals

### Admin Portal

URL: `https://janmind-admin.vercel.app` (local: `http://localhost:8083`)

| Name | Email | Password |
|------|-------|----------|
| Maher Bhatt | maherbhatt01@gmail.com | MHB@2007 |

### Municipality Portal

URL: `https://janmind-municipality.vercel.app` (local: `http://localhost:8081`)  
**Universal password for all officers:** `CivicSathi@2026`

| City | Department | Role | Name | Email |
|------|-----------|------|------|-------|
| Bengaluru | Roads | Officer | Priya Sharma | priya.sharma@bbmp.gov.in |
| Bengaluru | Electricity | Officer | Rajan Nair | rajan.nair@bbmp.gov.in |
| Bengaluru | Sanitation | Supervisor | Kavya Reddy | kavya.reddy@bbmp.gov.in |
| Bengaluru | Health | Municipality | Arjun Menon | arjun.menon@bbmp.gov.in |
| Vadodara | Roads | Officer | Dhruv Patel | dhruv.patel@vmc.gov.in |
| Vadodara | Sanitation | Supervisor | Sneha Desai | sneha.desai@vmc.gov.in |
| Vadodara | Electricity | Municipality | Mihir Shah | mihir.shah@vmc.gov.in |
| Mumbai | Roads | Officer | Raj Thackeray | raj.thackeray@bmc.gov.in |
| Mumbai | Sanitation | Officer | Sunita Pawar | sunita.pawar@bmc.gov.in |
| Mumbai | Water Supply | Municipality | Vikram Deshmukh | vikram.deshmukh@bmc.gov.in |
| Mumbai | Health | Supervisor | Anita Joshi | anita.joshi@bmc.gov.in |
| Delhi | Roads | Officer | Amit Sharma | amit.sharma@mcd.gov.in |
| Delhi | Sanitation | Officer | Neha Gupta | neha.gupta@mcd.gov.in |
| Delhi | Electricity | Municipality | Rajesh Kumar | rajesh.kumar@mcd.gov.in |
| Delhi | Health | Supervisor | Priyanka Singh | priyanka.singh@mcd.gov.in |

### Contractor Portal

URL: `https://janmind-contractor.vercel.app` (local: `http://localhost:8082`)  
**Universal password for all contractors:** `CONTRACTOR@2026`

> **If login says "not approved for this municipality":** The contractor's city registration needs to be approved in the Admin portal. Go to Admin → Contractors → find the company → click their city registration → change status to APPROVED.

| Company | Contact | Login Email | Registered City |
|---------|---------|------------|----------------|
| BuildRight Infrastructure | Ramesh Kumar | buildright.login@contractor.com | Vadodara |
| CivicTech Solutions | Preethi Iyer | civictech.login@contractor.com | Bengaluru |
| Greenway Constructions | Suresh Patel | greenway.login@contractor.com | Mumbai |
| Pioneer Public Works | Anil Verma | pioneer.login@contractor.com | Delhi |
| Urban Infra Ltd | Nalini Reddy | urbaninfra.login@contractor.com | Vadodara |

### Public Portal

URL: `https://janmind-public.vercel.app` (local: `http://localhost:8080`)  
Citizens register their own accounts. Click "Sign Up" on the login page. No pre-seeded citizen account is required.

---

## 15. All Bugs Found and Fixed

Every bug is documented here with the file changed and what was wrong.

| # | Severity | File | Bug | Fix |
|---|----------|------|-----|-----|
| 001 | 🔴 Critical | `backend/app/main.py` | `ContextVar` token not reset after request → actor leaked to next request's audit logs | `token_reset = set_audit_actor(...)` then `current_audit_actor.reset(token_reset)` in finally block |
| 002 | 🔴 Critical | `backend/app/core/audit_listeners.py` | No `DISABLE_AUTO_AUDIT` guard → bulk import scripts would flood audit table with millions of rows | Runtime check `os.environ.get("DISABLE_AUTO_AUDIT") == "true"` at top of every callback |
| 003 | 🟠 High | `backend/app/core/audit_listeners.py` | `setup_auditing()` registered duplicate listeners on every hot-reload (Uvicorn `--reload`) | `_registered_listeners` dict tracks which models already have listeners; skips if already registered |
| 004 | 🟠 High | `backend/app/core/audit_listeners.py` | Unauthenticated/background writes silently dropped instead of using System_Identity | `actor = get_audit_actor() or _SYSTEM_ACTOR` instead of `if not actor: return` |
| 005 | 🔴 Critical | `backend/app/core/audit_listeners.py` | `after_update` history was always empty (SQLAlchemy resets history after flush) | Switched from `inspect(target).attrs.*.history` to `attributes.get_history(target, field)` which reads pre-flush history |
| 006 | 🟡 Medium | `backend/app/api/v1/routes/procurement.py` | Docstring after first executable line in `list_tenders` — `enforce_city_scope` ran before docstring | Moved docstring to correct position (before function body) |
| 007 | 🟠 High | `backend/app/api/v1/routes/procurement.py` | `submit_evidence` set work order to `INSPECTION_PENDING` unconditionally — could revert COMPLETED/CLOSED orders | Added guard: only allowed when status in `{ACCEPTED, IN_PROGRESS, REWORK}` |
| 008 | 🔴 Critical | `backend/app/api/v1/routes/procurement.py` | Inspection `FAIL` result set status to `CLOSED` (permanent) instead of `INSPECTION_FAILED` | Changed to `WorkOrderStatus.INSPECTION_FAILED` — contractor can now initiate REWORK |
| 009 | 🟠 High | `backend/app/api/v1/routes/auth.py` | `officer_login` JWT missing `name` claim → audit middleware wrote "Unknown User" for every officer action | Added `"name": user.name` to all `create_access_token(data={...})` calls |
| 010 | 🟠 High | `backend/app/api/v1/routes/auth.py` | `citizen_login` and `citizen_register` also missing `name` claim | Same fix: `"name": user.name` added |
| 011 | 🟡 Medium | `backend/app/api/v1/routes/reputation.py` | `confirm_my_resolution` only caught `ValueError` — ORM errors (`DetachedInstanceError`) caused HTTP 500 | Added broad `except Exception` with `db.rollback()` and proper HTTP 500 response |
| 012 | 🟡 Medium | `backend/app/api/v1/routes/reputation.py` | `_city_impacts` queried `Complaint.city_id` (UUID) and treated results as city names | Now resolves UUID list → `City.name` via a secondary query |
| 013 | 🟠 High | `backend/app/api/v1/routes/analytics.py` | Any `role == 'admin'` user got platform-wide analytics — not just the super-admin | Replaced `role == "admin"` check with `is_super_admin_user(user)` (email allowlist check) |
| 014 | 🟡 Medium | `backend/requirements.txt` | Both `psycopg[binary]` and `psycopg2-binary` installed → conflicting DB drivers | Removed `psycopg2-binary` — only `psycopg[binary]` (v3) remains |
| 015 | 🟠 High | `backend/requirements.txt` | `spacy>=3.0` in requirements but `en_core_web_sm` model never downloaded → runtime `OSError` | Made spacy optional — `nlp.py` catches import/load error gracefully and falls back to basic preprocessing |
| 016 | 🟠 High | `backend/app/api/v1/routes/triage.py` | `triage pending` route crashed with `AttributeError: 'NoneType' has no attribute 'id'` on orphaned `ComplaintAnalysis` rows | Added `if complaint is None: continue` after fetching analysis.complaint |
| 017 | 🟡 Medium | `backend/app/api/v1/routes/municipality.py` | `OfficerProvisionRequest.phone` was `Optional[str]` — officers could be created with null phone | Changed to `phone: str = Field(..., min_length=7, max_length=20)` |
| 018 | 🔴 Critical | `apps/admin/src/` | 97+ TypeScript compile errors — stale `routeTree.gen.ts`, wrong type imports, wrong prop names | Regenerated routeTree, fixed `AuditLog` imported from wrong module, fixed `LoadingState` prop name |
| 019 | 🔴 Critical | `apps/admin/src/routes/admin/dashboard.tsx` | Entire dashboard showed hardcoded fake numbers (`"14,239"`, `"412"` etc.) | Replaced with `useQuery(() => getCommandCenterSnapshot())` — now shows live data |
| 020 | 🟡 Medium | `apps/admin/src/routes/admin/work-orders-overview.tsx` | Status color map had `"PUBLISHED"` (a tender status) instead of work order statuses | Fixed to `ISSUED`, `ACCEPTED`, `INSPECTION_PENDING`, `REWORK` etc. |
| 021 | 🟡 Medium | `apps/admin/src/routes/admin/work-orders-overview.tsx` | recharts `XAxis` received `angle` prop that doesn't exist on that version | Removed invalid prop |
| 022 | 🟡 Medium | `apps/admin/src/routes/admin/audit-logs.tsx` | `AuditLog` type imported from `shared-store` where it's not exported | Changed import to `@/services/types` |
| 023 | 🔴 Critical | `apps/municipality/src/routeTree.gen.ts` | Stale file caused all `useParams()` calls to return `never` type — every detail page broken | Regenerated with `bunx tsr generate` |
| 024 | 🟠 High | `apps/municipality/src/services/api.ts` | `acknowledgeAlert()` and `markNotificationRead()` threw unconditionally | Changed to no-op returns that silently succeed |
| 025 | 🟡 Medium | `apps/municipality/src/services/api.ts` | `bulkUpdateComplaints` used sequential `for await` → N serial API calls | Changed to `Promise.all(ids.map(...))` |
| 026 | 🟡 Medium | `apps/municipality/src/services/api.ts` | Status string `"in_review"` mismatch — needed verification against backend enum | Confirmed `in_review` matches backend `ComplaintStatus.IN_REVIEW` — mapping is correct |
| 027 | 🔴 Critical | `apps/contractor/src/routes/contractor/work-orders/$id.tsx` | Work order timeline used `event.status` (→ `event.toStatus`), `event.timestamp` (→ `event.at`), `bill.amount` (→ `bill.submittedAmount`) | Fixed all property names to match `WorkOrderEvent` and `Bill` types |
| 028 | 🟠 High | `apps/contractor/src/routes/contractor/` | `submitFieldProgress` called with wrong number of arguments | Fixed function call signatures |
| 029 | 🟡 Medium | `apps/contractor/src/routes/contractor/performance.tsx` | Accessed `contractor.specializations` (doesn't exist) | Fixed to `contractor.specializationCategories` |
| 030 | 🟡 Medium | `apps/contractor/src/routes/contractor/profile.tsx` | Accessed `contractor.name`, `contractor.contactPhone`, `contractor.contactEmail` | Fixed to `companyName`, `phone`, `email` |
| 031 | 🟠 High | `apps/contractor/src/routes/contractor/work-orders/` | Used `"INSPECTION_PENDING"` status string — not in `WorkOrderStatus` union type | Fixed to `"SUBMITTED_FOR_INSPECTION"` (the frontend-side name) |
| 032 | 🟡 Medium | `apps/contractor/src/routes/contractor/` | Used `"MEASUREMENT_APPROVED"` which is not a valid status | Removed — not a real status in the state machine |
| 033 | 🟠 High | `apps/public/src/services/api.ts` | `getCurrentUser` cleared auth token on ANY error (including 30s Render cold start timeout) | Changed to ONLY clear on `APIClientError` with `status === 401` |
| 034 | 🟡 Medium | `apps/public/src/services/api.ts` | `getNotifications` fired one `GET /complaints/{id}` per notification | Still validates but fails silently per item — removed choke on batch size |
| 035 | 🟠 High | `apps/public/src/services/api.ts` | `normalizeComplaint` returned `null as Complaint` — caused crashes when accessing `.id`, `.status` | Changed return type to `Complaint \| null`, added `.filter((c): c is Complaint => c !== null)` |
| 036 | 🟡 Medium | `backend/app/main.py` | CORS: if `CORS_ORIGINS="*"`, wildcard was stripped and localhost was excluded → local dev CORS errors | Always include `_LOCALHOST_ORIGINS` array regardless of env value |
| 037 | 🟡 Medium | All 4 `apps/*/src/services/api.ts` | Hardcoded Render backend URL as a string literal in each portal | Moved to `FALLBACK_BACKEND_URL` constant in `packages/api-client` |
| 038 | 🔴 Critical | `backend/app/api/v1/routes/auth.py` | JWT `name` claim missing from all login endpoints | Added `"name": user.name` to every `create_access_token(data={...})` call |
| 039 | 🔴 Critical | All 4 `apps/*/src/routeTree.gen.ts` | Stale auto-generated files out of sync with actual route files → 97+ TypeScript errors | Regenerate with `bunx tsr generate` in each portal after adding routes |

---

## 16. Architectural Rules You Must Not Break

> These are non-negotiable. Breaking any of these will cause deployments to fail or data to corrupt.

1. **Never edit `routeTree.gen.ts` manually.** It is always regenerated by `bunx tsr generate`. Any manual edit will be overwritten on the next `dev` start.

2. **Never remove `preset: "vercel"` from any portal's `vite.config.ts`.** This tells the Nitro SSR adapter to produce Vercel-compatible output. Without it, the build may output for the wrong platform and Vercel will serve nothing or 404 everything.

3. **Never use `create_all()` to create DB schema.** Every schema change goes through an Alembic migration file in `backend/alembic/versions/`. Run `alembic revision --autogenerate -m "description"` to create a new migration.

4. **Never use `npm install` inside an individual app directory.** The root uses npm workspaces. Install packages with `bun install` inside `apps/{portal}/` (because apps use Bun), but do not run `npm install` there — it creates a nested `node_modules` that breaks workspace resolution.

5. **All backend API calls go through `packages/api-client`.** Never use raw `fetch()` in component code. All network calls must go through `api.{endpoint}()` or `client.{method}()` from the api-client package.

6. **Only clear auth session on HTTP 401.** Network errors, timeouts, 500s, cold starts — these must NOT log the user out. Only a definitive `401 Unauthorized` (invalid/expired token) warrants clearing the session.

7. **Contractor auth requires city registration approval.** A contractor with valid credentials but a PENDING or REVOKED city registration will get 403 on login. This is by design. Approve via Admin Portal.

8. **Set `DISABLE_AUTO_AUDIT=true` before running any bulk import script.** Without it, the SQLAlchemy listeners will create an audit log entry for every single row imported — potentially millions of entries.

9. **`GROQ_API_KEY` must be set on Render for real AI.** Without it, complaint classification falls back to keyword heuristics. This still works, but the AI Oversight dashboard will show zero model runs and the demo won't look as impressive.

10. **PATCH /auth/me for password change requires `current_password`.** The backend verifies the current password before allowing the change. This is intentional security — no OTP needed for in-session changes.

11. **The `SUPER_ADMIN_EMAILS` env var controls admin access.** If your admin account email isn't in this env var on Render, you can log in but will get 403 on all `/admin/*` endpoints. Update the env var on Render, not in code.

12. **Never mix PostgreSQL migration state between environments.** Each environment (local, staging, production) has its own migration head. Never copy a production `.alembic_version` to local dev.

---

## 17. SIH Demo Strategy

### What judges score you on (PS26129)

1. **Does it solve the actual problem statement?** PS26129 is about interoperability. The demo MUST show two independent systems exchanging data — not just the complaints app.
2. **Live, non-hardcoded demo.** Submit a fresh complaint on camera. Judges watch for canned data.
3. **AI integration.** Expected in 2026, not optional. Show the Groq classification happening in real time.
4. **Scalability claim.** Can this work across all of Maharashtra's departments?
5. **5-minute pitch clarity.** Problem → Solution → Live proof → Impact.

### Recommended demo sequence (5 minutes):

| Time | What to show |
|------|-------------|
| 0:00–0:30 | Problem: show a citizen filling the same complaint on two different systems. Split screen — BBMP portal vs Maharashtra portal. "Same citizen, no shared record." |
| 0:30–1:00 | Solution one-liner: "Civic Sathi + Sathi Setu. One complaint in, unified tracking out." Show architecture diagram for 5-10 seconds. |
| 1:00–2:30 | Live: submit real complaint on public portal. Show Groq AI classifying it (category, severity, department routing appear instantly). Show it appear on municipality dashboard in real time. |
| 2:30–3:30 | Interoperability: submit near-identical complaint on Sathi Setu mock legacy system. Show identity resolution linking to the same citizen. Show unified tracking ID. **Show the consent gate denying a cross-system share when consent is absent.** |
| 3:30–4:15 | Admin command center: live numbers moving. AI Oversight KPIs. Audit log showing every action. SLA health. |
| 4:15–5:00 | Scale claim: "Onboard any Maharashtra department via the connector API. No code changes on either side. Today: 2 systems. Tomorrow: all 36 departments." End with the team slide. |

### Before the demo:

- Set `GROQ_API_KEY` in Render env vars
- Make sure at least one contractor has `ContractorCityRegistration.status = APPROVED`
- Run `python scripts/init_demo.py` in Sathi Setu to seed the cross-system demo data
- Test the full complaint submission flow and verify the AI classification appears correctly
- Have an offline recorded video backup in case of live Wi-Fi issues — judges are forgiving about recording if you mention it upfront

---

*Last updated: September 2026*  
*Maintained by the Civic Sathi SIH 2026 team*  
*For questions, refer to the code, this document, and the commit history.*
