# Civic Sathi — Complete Developer and AI Handoff

**Project:** Civic Sathi — Municipal Intelligence and Civic Operations Platform  
**Repository:** `Maher-Bhatt/Civic-Sathi`  
**Branch:** `main`  
**Prepared for:** A new AI assistant, developer, SIH team member, or maintainer who must understand and safely continue the system  
**Audit date:** 26 August 2026  
**Author:** Manus AI

> **One-sentence product definition:** Civic Sathi turns a citizen civic complaint into a traceable city-scoped workflow: report, classify, locate, validate, prioritize, group, tender, assign, execute, inspect, and resolve.

---

## 1. Read this first

Civic Sathi is not a single website. It is a monorepo containing four independent browser portals connected to one shared production REST API and one relational production database. The four portals are the public citizen portal, municipality operations portal, contractor portal, and super-admin portal.

The most important architectural rule is that **the backend is the source of truth**. Frontends may format, normalize, filter, and visualize responses, but they must not invent complaint counts, user roles, issue groups, severity values, tender states, contractor permissions, or resolution states.

The system uses a role-authoritative authentication design. A municipality user does not select “Commissioner,” “Ward Officer,” or another role on the login screen. The user submits their email, password, and city; the backend identifies the account and returns the authorized role and designation. This prevents a user from claiming a higher role merely by changing a dropdown.

The separate file `verified_sih_credentials_2026-08-21.md` contains the current credential handoff. Do not copy passwords into source code, screenshots, presentations, Git commits, or this architecture document. The old shared password `Janmind@2026` is no longer valid for the rotated official SIH accounts.

---

## 2. Current verified production topology

| Layer | Production location | Responsibility |
|---|---|---|
| Public citizen portal | `https://janmind-public.vercel.app` | Citizen registration/login, complaint submission, map, status tracking, notifications, profile, ratings |
| Municipality portal | `https://janmind-municipality.vercel.app` | Collector/officer operations, dashboard, complaint queue, AI triage, map, issue grouping, procurement, work orders, alerts, analytics |
| Contractor portal | `https://janmind-contractor.vercel.app` | Tender discovery, bidding, assigned work orders, progress, evidence upload, inspection readiness, performance |
| Admin portal | `https://janmind-admin.vercel.app` | Super-admin user governance, contractor/account administration, audit visibility, settings, operational oversight |
| Shared backend | `https://civic-sathi-f7ml.onrender.com` | FastAPI REST API, JWT authentication, authorization, business logic, analytics, AI-assisted services |
| API prefix | `https://civic-sathi-f7ml.onrender.com/api/v1` | Versioned REST endpoint namespace |
| Production database | PostgreSQL configured through backend `DATABASE_URL` | Durable users, complaints, issues, procurement, work orders, evidence, audit records |
| Backend host | Render | Runs migrations and Uvicorn/FastAPI service |
| Frontend hosts | Vercel | Four independently deployed TanStack Start applications |

### Vercel project mapping

All four portals are GitHub-linked projects in the Vercel team **Maher’s projects** (`team_wh283DVUA3g5KaKaiDq0bKbk`) and point to the `Maher-Bhatt/Civic-Sathi` repository.

| Portal | Vercel project ID |
|---|---|
| Admin | `prj_GZcT4ZJgJYwH7qnipvtnJvq4svqN` |
| Public | `prj_uFOqDZritFRerA7lAxQ2asAMqeA2` |
| Municipality | `prj_Z0bfNyFBuaCYBLJ0Fn6mnBHmm81H` |
| Contractor | `prj_BExnq303IM53DwPb8pInEau0b8IV` |

### Supabase clarification

The connected Supabase management integration currently exposes projects named **Finmate**, **Maher-Bhatt’s Project**, and **Z Tees Core**. None is named Civic Sathi. The Civic Sathi repository and Render deployment use the shared FastAPI/PostgreSQL configuration through `DATABASE_URL`; do not run migrations or destructive SQL against those Supabase projects unless the team explicitly confirms that the production database has been moved there. Supabase access is available for inspection, but it is not evidence that Civic Sathi uses Supabase in production.

---

## 3. Repository structure

```text
Civic-Sathi/
├── apps/
│   ├── admin/                 # Super-admin TanStack Start portal
│   ├── municipality/          # Municipality operations portal
│   ├── contractor/            # Contractor execution portal
│   └── public/                # Citizen-facing portal
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI application entry point
│   │   ├── api/v1/             # Versioned route composition and REST routes
│   │   ├── core/               # Settings, database, security, dependencies
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response models
│   │   └── services/            # Business logic, AI, analytics, grouping
│   ├── alembic/                # Database migration environment
│   ├── requirements.txt        # Python runtime dependencies
│   └── render.yaml             # Render service configuration
├── packages/
│   └── api-client/             # Shared TypeScript API client and APIClientError
├── raw/                        # Source or imported data where present; treat as data only
├── package.json                # npm workspace configuration
└── .env.example                # Names and examples of environment variables
```

### Frontend route layout

Each frontend uses file-based TanStack Router routes. Important route groups are:

| Portal | Route areas |
|---|---|
| Public | `/`, `/login`, `/register`, `/report`, `/complaints`, `/complaint.$id`, `/map`, `/notifications`, `/profile`, `/contractors`, `/forgot-password` |
| Municipality | `/login`, `/forgot-password`, protected `/_auth/dashboard`, `/_auth/complaints`, `/_auth/civic-issues`, `/_auth/map`, `/_auth/ai-triage`, `/_auth/tenders`, `/_auth/work-orders`, `/_auth/alerts`, `/_auth/departments`, `/_auth/areas`, `/_auth/analytics`, `/_auth/administration`, `/_auth/profile`, `/_auth/settings` |
| Contractor | `/login`, `/forgot-password`, protected `/contractor/dashboard`, `/contractor/tenders`, `/contractor/work-orders`, `/contractor/performance`, `/contractor/profile` |
| Admin | `/login`, `/forgot-password`, protected `/admin/dashboard`, `/admin/users`, `/admin/contractors`, `/admin/audit-logs`, `/admin/work-orders-overview`, `/admin/sla`, `/admin/settings` |

---

## 4. Frontend technology and design

### 4.1 Framework and runtime

The frontends use **React 19** and **TypeScript**. TanStack Start supplies the application framework and SSR-capable deployment structure. TanStack Router supplies file-based routing and navigation. TanStack Query is used for server-state fetching, loading states, cache invalidation, and mutation lifecycle management.

Vite is the build tool. The Vite configuration uses the TanStack Start plugin, React plugin, Tailwind CSS v4 plugin, TypeScript path aliases, and the Nitro Vercel preset. Each app is built independently under `apps/<portal>` and deployed as its own Vercel project.

### 4.2 Styling and component system

The visual design uses Tailwind CSS v4, Radix UI primitives, reusable glass-card/glass-button/glass-input components, and Lucide icons. The brand direction is Indian civic heritage rather than a generic blue SaaS theme: terracotta, maroon, sandstone, ivory, turmeric, and muted green are used for hierarchy and status.

The public portal uses a citizen-friendly top navigation and map-led layout. The municipality and admin portals use persistent operational sidebars because those users repeatedly move between queues, maps, analytics, procurement, and governance screens. The contractor portal uses a focused operations shell with dashboard, tenders, work orders, performance, and profile navigation.

Every data-heavy screen should provide loading, empty, error, and success states. A loading screen is not a successful data state. If the backend fails, the UI must say that the data could not be loaded rather than showing made-up numbers.

### 4.3 API service boundary

Components should not construct ad-hoc fetch calls. Each portal has an API adapter under `src/services/api.ts`. This adapter is responsible for:

1. Choosing the backend base URL from `VITE_API_BASE_URL` or the production fallback.
2. Calling the correct versioned endpoint.
3. Attaching the stored Bearer token for protected requests.
4. Converting backend response shapes into the frontend’s stable types.
5. Translating backend status/category/severity values into UI labels.
6. Clearing stale credentials after a 401 response where appropriate.
7. Returning errors that the route can display to the user.

The shared implementation is in `packages/api-client/client.ts`. It raises `APIClientError` with the HTTP status and backend detail. This is important because a 401 invalid password, a 403 city authorization failure, and a 500 backend failure are different operational problems.

### 4.4 Authentication state in the frontend

The municipality authentication context is in `apps/municipality/src/lib/muni-auth.tsx`; the contractor context is in `apps/contractor/src/lib/contractor-auth.tsx`. The API adapters store the JWT and normalized user object in browser storage for the selected portal.

On application startup, the context reads the stored token and calls the backend current-user endpoint. If the token is valid, the user is hydrated and protected routes render. If the token is expired or invalid, storage is cleared and the user is returned to `/login`.

Login redirects happen inside event handlers or effects, never in render. This avoids React navigation warnings and hydration loops. A protected route should not assume that a token in localStorage is valid; it must wait for auth hydration and use the backend response.

---

## 5. Backend technology and structure

### 5.1 Runtime

The backend is written in **Python** using **FastAPI** and **Uvicorn**. Pydantic models validate requests and responses. SQLAlchemy 2 provides ORM access to PostgreSQL. Alembic applies migrations. The runtime dependency list is in `backend/requirements.txt`.

The entry point is `backend/app/main.py`. The API v1 router is composed in `backend/app/api/v1/router.py`, then included in the application with the `/api/v1` prefix. FastAPI also exposes OpenAPI documentation through `/openapi.json` and the normal interactive documentation routes when enabled.

### 5.2 Backend layers

| Layer | Location | Responsibility |
|---|---|---|
| Application | `backend/app/main.py` | Creates FastAPI app, middleware, health routes, CORS, API router |
| Settings | `backend/app/core/` | Reads environment variables and runtime configuration |
| Security | `backend/app/core/security.py` and auth dependencies | Password hashing, JWT creation/verification, role checks |
| Routes | `backend/app/api/v1/routes/` | HTTP request handling, dependency injection, response models |
| Schemas | `backend/app/schemas/` | Pydantic request/response contracts |
| Models | `backend/app/models/` | SQLAlchemy entities and relationships |
| Services | `backend/app/services/` | Business rules and multi-step operations |
| Migrations | `backend/alembic/versions/` | Durable schema changes applied by Alembic |

Routes should remain thin. A route authenticates the request, validates input, calls a service, and serializes the response. Complex grouping, procurement, scoring, AI, or workflow logic belongs in services rather than being duplicated in route functions.

### 5.3 Service modules

| Service | Purpose |
|---|---|
| `ai_service.py` | AI-assisted complaint analysis, recommendations, and image/text interpretation where configured |
| `analytics_service.py` | Dashboard aggregates, map summaries, trends, severity distributions, hotspot calculations |
| `canonical_grouping.py` | Order-independent complaint normalization and canonical grouping logic |
| `complaint_service.py` | Complaint creation, normalization, status operations, and complaint-level business rules |
| `data_integrity.py` | Consistency checks and data-quality safeguards |
| `issue_service.py` | Durable civic issue and IssueCluster behavior |
| `merge_service.py` | Officer-reviewed AI merge proposal and confirmation workflow |
| `job_service.py` | Background or operational job behavior where used |
| `password_reset.py` | Password-reset and OTP/email workflow support |
| `reputation_service.py` | Citizen/contractor reputation and performance calculations |

---

## 6. Authentication contracts

### 6.1 Municipality officer login

**Endpoint:** `POST /api/v1/auth/officer-login`

The current municipality form submits the officer email, password, and selected city. Older cached bundles may also submit a legacy designation value. The backend now treats the stored account and city as authoritative and does not let a legacy selector override the account’s actual role.

Typical request shape:

```json
{
  "email": "collector.office@vmc.gov.in",
  "password": "<current official password>",
  "city": "vadodara"
}
```

The successful response contains an access token plus normalized officer information. The important fields are the account ID, email, role, designation, city, department, and name.

For the VMC Collector account, the verified response is:

```text
HTTP 200
role: Collector
designation: Commissioner
city: vadodara
```

For BBMP, the verified response is:

```text
HTTP 200
role: Collector
designation: Commissioner
city: bengaluru
```

The login page intentionally does not expose a role-selection dropdown. It now explains that supported roles include Commissioner/Collector, Department Head, Supervisor, and Ward Officer, but the role is assigned to the professional account and validated by the backend.

### 6.2 Contractor login

**Endpoint:** `POST /api/v1/auth/contractor-login`

Request shape:

```json
{
  "email": "operations@bharatinfra.in",
  "password": "<current official password>",
  "city": "vadodara"
}
```

The backend performs these checks in order:

1. Normalize the email to lowercase and trim whitespace.
2. Find a user whose role is `contractor`.
3. Verify the bcrypt password hash.
4. Require a city value.
5. Find the contractor company profile linked to the user.
6. Find an approved city registration for the selected city.
7. Create a JWT containing user ID, email, role, and city.
8. Return the token and normalized contractor/citizen information.

A contractor may receive HTTP 401 for invalid credentials, HTTP 400 for a missing city, or HTTP 403 when the company profile is missing or the contractor is not approved for the selected municipality.

The verified Bharat Infra and BuildRight accounts both returned HTTP 200 for Vadodara. Bharat Infra’s live dashboard showed the company name, two active work orders, one inspection pending, and current tender opportunities.

### 6.3 Citizen login and registration

**Endpoints:**

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout` where implemented by the relevant client flow

Citizen authentication returns the same general token shape but restricts the allowed roles to the citizen-facing account model. User profile data includes city and notification preferences where available.

### 6.4 Password reset

All portals expose `/forgot-password`. The backend has password reset request and confirmation schemas under the auth route and `password_reset.py` service. The intended production flow is email or SMS OTP verification; a reset should never reveal the current password. Brevo email and MSG91/SMS settings must be configured in the deployment environment before treating delivery as production-ready.

---

## 7. How a frontend API call works

A normal protected request follows this sequence:

```text
User interaction
   ↓
React route/component event handler
   ↓
Portal service adapter: apps/<portal>/src/services/api.ts
   ↓
Shared APIClient: packages/api-client/client.ts
   ↓
HTTP request to https://civic-sathi-f7ml.onrender.com/api/v1/...
   ↓
Bearer JWT added from browser storage
   ↓
FastAPI route dependency validates token and role/city
   ↓
Pydantic request validation
   ↓
Service layer executes business logic
   ↓
SQLAlchemy transaction/query against PostgreSQL
   ↓
Pydantic response serialization
   ↓
APIClient returns typed data
   ↓
React Query/state updates the screen
```

Example complaint list flow:

1. Municipality complaint route mounts.
2. Auth context verifies the officer session.
3. `getMuniComplaints()` in `apps/municipality/src/services/api.ts` calls the complaint list endpoint with city/filter parameters.
4. The API client attaches the JWT.
5. Backend authorization confirms the officer and city.
6. Complaint service queries the database.
7. The frontend normalizes every complaint, preserving backend IDs, city, area, ward, category, status, severity, coordinates, and timestamps.
8. The table renders the response. It does not create placeholder complaints.

Example mutation flow for bulk verification:

1. Officer selects currently `Received` complaints.
2. The Bulk Verify handler loops through the selected IDs or calls the supported bulk status operation.
3. Each operation requests the backend transition to `Under Review`/`in_review` according to the API mapping.
4. Backend authorization and status validation run for each record.
5. Successful responses are displayed and the list is invalidated/refetched.
6. Already assigned or resolved complaints are not moved backward.

---

## 8. Core domain model

The names below describe the business entities represented by SQLAlchemy models and API schemas. Always inspect the current model/schema file before adding a migration or field.

| Entity | Main purpose | Important relationships |
|---|---|---|
| User | Identity for citizen, officer, collector, contractor, or admin | Has role, city/department context, password hash, profile information |
| City | Municipality boundary and city identity | Owns complaints, users, registrations, analytics scope |
| Complaint | Citizen civic report | Belongs to city; may have category, area, ward, severity, coordinates, status, evidence, issue link |
| IssueCluster/Civic Issue | Durable operational problem grouping | Contains related complaints; may connect to tender/work package |
| Merge Proposal | Non-mutating grouping recommendation | References selected complaint IDs, confidence, evidence, and freshness/version data |
| Contractor | Registered company profile | Linked to contractor user and city registrations |
| ContractorCityRegistration | City-specific contractor eligibility | Has approved/pending/rejected status |
| Department | Municipal operational department | Receives complaints/issues/work packages |
| Tender/Package | Procurement unit | May originate from a civic issue and produce a work order |
| Bid | Contractor response to a tender | Links contractor, tender, price, technical proposal, and status |
| Work Order | Execution assignment | Links tender/package, contractor, issue, status, progress, inspection state |
| Field Evidence | Contractor evidence submission | Stores metadata and photo URL/reference; bytes belong in file storage, not a database blob |
| Audit Event | Durable governance record | Records important status changes, grouping confirmation, assignment, inspection, and administrative actions |
| Alert/Notification | Operational communication | Links user/role to a system event or required action |
| Reputation/Performance | Quality and reliability indicators | Aggregates contractor or citizen operational history |

### Complaint status lifecycle

The exact enum values are defined in backend schemas and frontend mappings. Conceptually the lifecycle is:

```text
Received
  → Under Review
  → Verified / Accepted
  → Assigned or Linked to Civic Issue
  → Included in Tender/Package
  → Work Order Created
  → Contractor Accepted
  → In Progress
  → Evidence Submitted
  → Inspection Pending
  → Resolved
```

Failure or rejection paths must remain explicit, for example rejected triage, failed inspection, or returned evidence. A UI label such as “Verify & Accept” must map to the backend’s accepted status value rather than to an unrelated assignment or department value.

---

## 9. Complaint creation and live civic workflow

### Citizen side

The citizen chooses a category, writes a description, optionally attaches an image, and places a location pin. The public route calls the complaint creation endpoint through `apps/public/src/services/api.ts`. The backend stores the original text, category, city, area/ward context, coordinates, timestamps, and normalized operational fields.

The original complaint text should be preserved. Translation or AI interpretation may produce additional fields, but the submitted citizen content must not be silently replaced.

### Municipality side

The complaint appears in the city-scoped queue. The officer can inspect the text, location, category, severity, attachments, and related complaints. The dashboard, queue, map, and analytics all query backend data rather than local mock arrays.

### AI grouping side

The officer selects at least two complaints. The backend evaluates category, city, area, coordinates, ward/address signals, normalized tokens, lexical/sequence similarity, and optional semantic embedding similarity. It returns a proposal.

Proposal generation does not mutate the database. The officer must review and confirm. Confirmation creates or reuses a durable IssueCluster, links the complaints, and records an audit event. A stale proposal check prevents confirmation when the underlying complaints have changed since proposal generation.

### Procurement and contractor side

The authorized municipality officer creates a tender or work package from the civic issue. A contractor sees eligible tenders, submits a bid where permitted, receives or accepts a work order, updates progress, and uploads field evidence. Municipal inspection determines whether the work can move to resolved status.

### Audit side

Important transitions must be written to audit/event records. Judges should be told that Civic Sathi is not only a ticketing UI; it creates traceability from citizen report to government decision, contractor execution, evidence, inspection, and resolution.

---

## 10. AI and analytics design

Civic Sathi uses a hybrid approach rather than treating AI as an authority.

### Deterministic components

Deterministic rules provide repeatability and accountability for city scope, role authorization, approved contractor eligibility, status transitions, coordinate presence, same-area checks, and proposal confirmation. These rules are easier to test and explain to a public-sector reviewer.

### AI-assisted components

AI-assisted features may help with complaint category interpretation, multilingual text understanding, severity/priority recommendations, image analysis, related-complaint similarity, operations briefs, and evidence validation. Model availability and credentials are environment-dependent; the application must display a controlled fallback or error when an AI provider is unavailable.

### Canonical grouping

`backend/app/services/canonical_grouping.py` implements order-independent grouping. It normalizes category and area values, compares complaint text symmetrically, uses area and city constraints, and avoids making the first complaint the permanent authority merely because it arrived first. The result is a stable canonical relationship rather than a fabricated sample list.

### Officer-reviewed merge

`backend/app/services/merge_service.py` and the issue routes implement the two-step workflow:

```text
Selected complaints
   ↓
POST /api/v1/issues/merge-proposals
   ↓
Non-mutating proposal with evidence/confidence
   ↓
Officer reviews proposal
   ↓
POST /api/v1/issues/merge-proposals/confirm
   ↓
Create/reuse durable IssueCluster
   ↓
Link complaints
   ↓
Write audit event
```

The correct viva statement is:

> “AI assists classification, similarity, prioritization, and grouping. Authorized municipal officers remain responsible for confirmation, procurement, inspection, and final resolution.”

### Analytics and maps

`analytics_service.py` produces city-scoped summaries, severity distribution, trends, hotspot rankings, area activity, and map data. The public map uses real complaint coordinates and live locality activity. It may cap the number of point records sent to the browser for performance, but headline totals must be calculated from the full backend query and labeled honestly.

Severity zones are based on live locality activity and use Low, Moderate, High, and Critical colors. Precise complaint markers are separate from the zone layer. Synthetic population-impact estimates and fake complaint samples must not return to the UI.

---

## 11. API route families

The exact endpoint list is generated by FastAPI and should be checked in `/openapi.json`. The route families currently include:

| Route family | Used for |
|---|---|
| `/api/v1/auth/*` | Citizen, officer, contractor login, current user, password reset |
| `/api/v1/cities/*` | City list and city metadata |
| `/api/v1/complaints/*` | Citizen complaint creation, retrieval, status, evidence, and related records |
| `/api/v1/issues/*` | Civic issues, issue clusters, related complaints, merge proposals, confirmation |
| `/api/v1/procurement/*` | Tenders, packages, bids, work orders, contractor execution |
| `/api/v1/analytics/*` | KPI, trends, map summaries, hotspots, severity distributions |
| `/api/v1/triage/*` | AI triage queue, approval, rejection, and review actions |
| `/api/v1/ai/*` | AI analysis and recommendations where configured |
| `/api/v1/admin/*` | User governance, account updates, password rotation, administrative operations |
| `/api/v1/reputation/*` | Citizen/contractor reputation and performance |
| `/api/v1/alerts/*` | Municipal alerts and acknowledgements |
| `/api/v1/notifications/*` | User notification reads and updates |
| `/api/v1/departments/*` | Department data and assignment context |
| `/api/v1/areas/*` | Area/locality overviews and city geography |
| `/health`, `/api/v1/health` | Service health checks; the API v1 health alias is the reliable Render health check |

When adding or changing a route, update the Pydantic schema, route, service, frontend adapter, frontend normalization, tests, and API documentation together.

---

## 12. Environment variables and secrets

The repository contains environment-variable names and examples, but production values belong in Render/Vercel environment settings and must not be committed.

| Variable category | Typical purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by SQLAlchemy |
| `JWT_SECRET` | Signs and validates access tokens |
| CORS allowlist variables | Restrict browser origins to the four portals |
| Brevo/email variables | Password-reset and email notifications |
| MSG91/SMS variables | OTP delivery and mobile verification |
| AI provider variables | Text/image analysis provider configuration |
| File-storage variables | Upload and evidence storage references |
| `VITE_API_BASE_URL` | Frontend build-time API base URL override |
| Vercel project variables | Portal-specific build/runtime configuration |

Never print secret values in a terminal log, Markdown file, screenshot, presentation, Git commit, or browser recording. If a secret is rotated, update the deployment environment and immediately test the affected endpoint.

---

## 13. Build and deployment process

### Frontend

From the repository root, use the app-specific build command:

```bash
npm --prefix apps/municipality run build
npm --prefix apps/contractor run build
npm --prefix apps/public run build
npm --prefix apps/admin run build
```

A successful local build proves only that the source compiles. It does not prove the correct Vercel project consumed the commit. After pushing, verify the project deployment in Vercel and open the actual production domain in a browser.

### Backend

Render runs the backend service from `backend/render.yaml`. The deployment must apply Alembic migrations before starting Uvicorn. If a migration revision is longer than PostgreSQL’s version column limit or the migration graph is broken, the service may fail before any API route becomes available.

Verify:

```text
GET https://civic-sathi-f7ml.onrender.com/api/v1/health
GET https://civic-sathi-f7ml.onrender.com/openapi.json
```

The OpenAPI document should contain the expected route families, including `merge-proposals` after the merge deployment.

### Monorepo deployment behavior

Vercel projects can use affected-path/ignored-build behavior. A GitHub deployment record may say `inactive` with `Skipped - Not affected` when a commit changes only another portal. This is a skipped historical deployment, not necessarily a production outage. Always inspect the deployment status and test the production domain before diagnosing downtime.

---

## 14. Live authentication troubleshooting runbook

### Municipality login

1. Open `https://janmind-municipality.vercel.app/login`.
2. Select the correct city: Vadodara or Bengaluru.
3. Enter the exact email from the credential handoff.
4. Enter the current official password from the separate verified credential file.
5. Do not try to select a role; the backend assigns it.
6. Click Sign In and wait for the request to finish.
7. Confirm the sidebar shows the expected role. For the Collector account it should show `Commissioner` as the designation and `Collector` as the role.
8. If the form still behaves strangely, run `Ctrl + Shift + R` to clear the stale JavaScript bundle.

### Contractor login

1. Open `https://janmind-contractor.vercel.app/login`.
2. Select the city registered for the company.
3. Use the exact contractor email and current official password.
4. Do not use the retired `Janmind@2026` password for rotated accounts.
5. A successful login redirects to `/contractor/dashboard`.
6. Confirm the company name, work-order cards, and tender cards load.

### Error interpretation

| Error | Meaning | Correct response |
|---|---|---|
| HTTP 401 | Email/password rejected | Check the current official password and exact email; do not rotate blindly |
| HTTP 403 on officer login | City/account authorization problem | Select the correct city and verify the account’s backend city scope |
| HTTP 403 on contractor login | Company missing or not approved in selected city | Select the registered municipality or fix the city registration administratively |
| HTTP 422 | Request shape or validation problem | Inspect frontend payload and backend Pydantic schema |
| HTTP 500 | Backend code/data/deployment problem | Check Render logs and the failing route, then reproduce with a safe request |
| Browser stuck on loading | Post-login API or stale session problem | Wait once, inspect network/console, clear session, then retry |

### Verified current login facts

On the latest audit, the live backend returned HTTP 200 for:

| Account | City | Result |
|---|---|---|
| VMC Collector account | Vadodara | Collector role, Commissioner designation |
| BBMP Collector account | Bengaluru | Collector role, Commissioner designation |
| Bharat Infra | Vadodara | Contractor login success |
| BuildRight | Vadodara | Contractor login success |

The municipality role selector was intentionally removed to prevent self-selected privilege. The login page now presents the supported role types as read-only information and states that the backend assigns the role.

---

## 15. Testing strategy

### Source/build checks

- Run `git diff --check`.
- Build every affected frontend.
- Run backend compilation and targeted pytest tests.
- Validate Alembic migration ordering before deployment.
- Review changed files before committing.

### API smoke checks

- Health endpoint.
- OpenAPI route presence.
- Officer login for Vadodara and Bengaluru.
- Contractor login for Vadodara and any approved second city.
- Complaint list with city scope.
- Complaint status transition.
- Merge proposal generation, which must not mutate data.
- Merge proposal confirmation in a controlled demo dataset.
- Tender/work-order retrieval.
- Evidence upload metadata and inspection transition.

### Browser checks

- Fresh login after clearing stale storage.
- Role and city shown correctly.
- Dashboard metrics finish loading.
- Complaints page renders without runtime ReferenceErrors.
- Bulk Verify changes only valid `Received` complaints.
- Map shows live severity zones and precise markers.
- Contractor dashboard shows company and current work orders.
- Admin pages expose only super-admin operations.
- Forgot-password forms render and provide a clear delivery result.

A green build is not enough. The release is ready only when the deployed URL opens in the browser and the workflow is tested with real production data.

---

## 16. SIH live-demo sequence

Use four laptops or four browser windows:

1. **Citizen laptop:** open the public portal and submit a complaint with category, description, and precise location.
2. **Municipality laptop:** open the complaints queue and show that the record arrives in the correct city.
3. **Grouping step:** select similar same-area complaints, request the AI proposal, explain that the proposal is non-mutating, then confirm it as the authorized officer.
4. **Procurement step:** open the durable civic issue, create or show the associated tender/package.
5. **Contractor laptop:** sign in as the approved contractor, open the work order, accept or update it, and upload evidence.
6. **Municipality inspection:** review the evidence, perform the inspection action, and show the final status/audit trail.
7. **Public map:** show the severity zones and precise complaint marker without exposing private citizen details.

Do not describe pre-seeded records as newly generated citizen reports. Explain which records are production demo fixtures and which event was just created during the demonstration.

---

## 17. What another AI should do before changing code

A new AI assistant should follow this order:

1. Read this file and `SIH_2026_TECHNOLOGY_AND_VIVA_GUIDE.md`.
2. Run `git status` and inspect the latest commit.
3. Read the nearest `AGENTS.md` before editing a portal.
4. Confirm the relevant frontend service adapter and backend route/schema/service together.
5. Reproduce the issue against the production endpoint with a non-destructive request.
6. Decide whether the issue is source code, data, credentials, deployment freshness, or browser cache.
7. Make the smallest source-of-truth fix.
8. Build the affected app and run targeted tests.
9. Commit with a meaningful message and push to `main`.
10. Verify the correct Vercel/Render deployment, then test the real production URL in a browser.
11. Record the commit, endpoint, test result, and any remaining limitations.

Never delete production users, complaints, civic issues, tenders, work orders, or audit records during a debugging session without explicit approval and a backup/rollback plan.

---

## 18. Known production lessons and repaired defects

The project has already repaired several failure classes that future maintainers must avoid repeating:

| Defect class | Lesson |
|---|---|
| Missing router import | TypeScript source can compile differently from a stale bundle; browser route testing is required |
| Misleading role dropdown | Role must come from the backend account, not a user-selected designation |
| Stale password handoff | Credential documents and database hashes must be audited together |
| City-count mismatch | Every metric needs a city-scoped backend query and an honest label |
| Synthetic map polygons | Visual polish must not override real coordinates and real severity data |
| Bulk action mislabeling | UI text and backend status transition must be reviewed together |
| Automatic AI merge | High-impact grouping requires proposal, evidence, officer confirmation, and audit event |
| Render migration failure | Alembic identifiers and migration graph must be PostgreSQL-safe before startup |
| GitHub inactive deployment | `Skipped - Not affected` is a monorepo deployment status, not proof of outage |
| Loading dashboard | Wait for the API response and inspect the route; loading is not authentication failure |

---

## 19. References

[1]: https://github.com/Maher-Bhatt/Civic-Sathi "Civic Sathi GitHub repository"

[2]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/package.json "Root workspace configuration"

[3]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/requirements.txt "Backend dependency manifest"

[4]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/main.py "FastAPI application entry point"

[5]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/api/v1/router.py "API v1 router composition"

[6]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/api/v1/routes/auth.py "Authentication route contracts"

[7]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/services/canonical_grouping.py "Canonical complaint grouping service"

[8]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/services/merge_service.py "Officer-reviewed AI merge service"

[9]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/app/services/analytics_service.py "Analytics and map aggregation service"

[10]: https://github.com/Maher-Bhatt/Civic-Sathi/blob/main/backend/render.yaml "Render deployment configuration"

[11]: https://github.com/Maher-Bhatt/Civic-Sathi/tree/main/apps/public "Public citizen portal source"

[12]: https://github.com/Maher-Bhatt/Civic-Sathi/tree/main/apps/municipality "Municipality portal source"

[13]: https://github.com/Maher-Bhatt/Civic-Sathi/tree/main/apps/contractor "Contractor portal source"

[14]: https://github.com/Maher-Bhatt/Civic-Sathi/tree/main/apps/admin "Admin portal source"

[15]: https://fastapi.tiangolo.com/ "FastAPI documentation"

[16]: https://tanstack.com/router/latest "TanStack Router documentation"

[17]: https://vercel.com/docs "Vercel documentation"

[18]: https://render.com/docs "Render documentation"

---

## 20. Final handoff summary

Civic Sathi is a four-portal React/TypeScript system backed by a FastAPI/PostgreSQL service. Vercel hosts independent frontends; Render hosts the API; Alembic manages database migrations; JWT and bcrypt protect sessions and passwords; SQLAlchemy executes durable relational operations; AI services assist rather than replace authorized human decisions.

The municipality role is backend-authoritative. The contractor city is checked against approved company registration. Complaint grouping is canonical and order-independent. AI grouping is a reviewable proposal. Maps combine live severity zones with precise complaint markers. Procurement, work orders, evidence, inspection, and audit events form the final operational chain.

For any future AI, the safest rule is: **inspect the source, reproduce against the real API, change the smallest authoritative layer, build, deploy, and verify in the browser.**
