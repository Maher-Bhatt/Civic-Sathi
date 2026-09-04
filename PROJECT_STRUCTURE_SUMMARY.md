# Civic Sathi - Project Structure Summary

## Repository Overview

Civic Sathi is a municipal intelligence and civic operations platform with:
- **4 React portals** (citizen, municipality, contractor, admin)
- **FastAPI/PostgreSQL backend** with Alembic migrations
- **Shared TypeScript packages** (api-client, visual-system)
- **Sathi Setu** - Separate interoperability service for SIH26129

## Root Configuration

```
Civic-Sathi/
├── package.json              # Monorepo workspace config (npm workspaces)
├── .gitignore                # Ignores node_modules, build artifacts, env files
├── README.md                 # Project overview and development setup
├── CIVIC_SATHI_COMPLETE_DEVELOPER_HANDOFF.md  # Comprehensive handoff document
├── .env.example              # Environment variable template
├── apps/                     # React applications (4 portals)
├── backend/                  # FastAPI backend
├── packages/                 # Shared TypeScript packages
├── sathi-setu/               # Interoperability service (SIH26129)
├── docs/                     # Operational documentation
├── mock-grievance-service/   # Mock external system for Sathi Setu demo
├── node_modules/             # Root dependencies (ts-morph)
└── tmp/, scratch/            # Ignored local artifacts
```

## Root package.json

```json
{
  "name": "civicsathi-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "build": "npm run build --workspaces --if-present"
  },
  "dependencies": { "ts-morph": "^28.0.0" }
}
```

## Apps (4 React Portals)

All portals use: **TanStack Start (React 19, SSR) + Tailwind v4 + shadcn/ui + Radix UI**

| Portal | Package Name | Port | Purpose |
|--------|-------------|------|---------|
| `apps/public` | civicsathi-citizen-portal | 8080 | Citizen complaint reporting & tracking |
| `apps/municipality` | municipality-frontend | 8081 | Officer dashboard & complaint management |
| `apps/contractor` | contractor-frontend | TBD | Contractor tender/work-order portal |
| `apps/admin` | admin-frontend | TBD | Super-admin governance & audit |

### Common App Structure

```
apps/{portal}/
├── package.json
├── tsconfig.json
├── vite.config.ts          # Pinned to Vercel Nitro preset
├── .env.example
├── .prettierrc / .eslint.config.js
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn/ui primitives + glass-* custom layer
│   │   └── *.tsx           # Feature components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Auth, i18n, theme, utils, error handling
│   ├── routes/             # TanStack Router file-based routes
│   ├── services/           # API layer (mock + types)
│   ├── router.tsx          # Router config
│   ├── routeTree.gen.ts    # Auto-generated route tree
│   ├── server.ts           # TanStack Start server entry
│   ├── start.ts            # Client entry
│   └── styles.css          # Global styles + Tailwind v4
└── public/                 # Static assets
```

### Key App Files

**vite.config.ts** - All apps pin Nitro to Vercel preset:
```typescript
plugins: [
  tailwindcss(),
  tsConfigPaths(),
  tanstackStart({ server: { entry: "server" } }),
  ...(command === "build" ? [nitro({ preset: "vercel" })] : []),
  viteReact(),
]
```

**src/services/api.ts** - Single integration point (currently mock, localStorage-based)
**src/services/types.ts** - Working API contract (coordinate with backend before changes)

## Shared Packages

### packages/api-client
```typescript
// Canonical TypeScript transport & response normalization layer
// Exports: APIClient, Endpoints, types (User, Complaint, AuthResponse, APIError)
// Usage: Apps import @civicsathi/api-client and configure with baseUrl + getToken()
```

Files:
- `index.ts` - Barrel export
- `client.ts` - APIClient class with fetch wrapper, auth, error handling
- `endpoints.ts` - Typed endpoint methods (auth, complaints, tenders, workOrders, cities, contractors)
- `types.ts` - Shared TypeScript interfaces
- `package.json` / `tsconfig.json`

### packages/civic-visual-system
```typescript
// Shared visual system components (minimal currently)
// Exports from index.ts
```
Files: `index.ts`, `package.json`

## Backend (FastAPI + PostgreSQL)

```
backend/
├── requirements.txt
├── alembic.ini
├── alembic/
│   ├── env.py              # Uses settings.database_url
│   ├── script.py.mako
│   └── versions/           # 18+ migration files
├── app/
│   ├── main.py             # FastAPI app with CORS, exception handlers
│   ├── core/
│   │   ├── config.py       # Pydantic Settings (all env-driven)
│   │   ├── database.py     # SQLAlchemy engine/session + health check
│   │   ├── logging.py
│   │   ├── errors.py       # Custom exceptions & handlers
│   │   └── security.py     # JWT, password hashing
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic request/response schemas
│   ├── api/
│   │   └── v1/
│   │       ├── router.py   # API v1 router aggregation
│   │       └── routes/     # Individual route modules
│   ├── services/           # Business logic (complaint, AI, procurement, etc.)
│   ├── repositories/       # Data access layer
│   └── tests/              # Pytest suite (PostgreSQL via Testcontainers)
└── scripts/
    └── repair_data.py      # Explicit data repair operations
```

### Key Backend Config (app/core/config.py)

```python
class Settings(BaseSettings):
    environment: Literal["local", "preview", "production"] = "local"
    database_url: str  # Required
    cors_origins: str  # Comma-separated, parsed to list
    officer_api_key: str  # Required
    jwt_secret: str = "dev_key"
    super_admin_emails: str = "maherbhatt01@gmail.com"
    command_center_city_names: str = "Vadodara,Bengaluru"
    # Password reset / OTP (Brevo, MSG91)
    # AI/LLM (Groq, xAI)
    # ML (sentence-transformers, similarity thresholds)
```

### Alembic Migrations (18 files)
- `8923e23adcee_initial_schema.py` - Core tables (users, complaints, wards, departments, issue_clusters, alerts, ML tables)
- Subsequent migrations add: procurement, contractor governance, civic reputation, password reset, evidence, etc.

## Sathi Setu (SIH26129 Interoperability Service)

```
sathi-setu/
├── requirements.txt          # Minimal: fastapi, sqlalchemy, alembic, pydantic, psycopg, pytest, httpx
├── alembic.ini
├── pytest.ini
├── .env.example
├── alembic/
│   ├── env.py               # Uses SATHI_SETU_DATABASE_URL env var
│   └── versions/
│       └── 0001_initial_schema.py  # 10 tables for interoperability
├── app/
│   ├── main.py              # FastAPI + static web console mount
│   ├── core/config.py       # Settings
│   ├── models/              # 10 SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── api/routes.py        # REST endpoints
│   ├── connectors/          # External system adapters (base, civic_sathi, mock_legacy)
│   └── services/            # Identity resolution, consent, tracking, reconciliation
├── web/index.html           # Single-file WCAG 2.2 AA web console (Marathi/English i18n)
└── scripts/init_demo.py     # Demo data seeding
```

### Sathi Setu Tables (10)
1. `external_systems` - Registered external grievance systems
2. `connector_configs` - Field mappings per system version
3. `identities` - Canonical citizen identities
4. `identity_links` - Links canonical ID to source system records
5. `consents` - Cross-system data sharing consent
6. `unified_applications` - Unified view of applications across systems
7. `events` - Event stream for inter-system communication
8. `data_quality_issues` - Detected data quality problems
9. `audit_entries` - Immutable audit trail
10. `idempotency_records` - Deduplication for external calls

## Development Commands

```bash
# Frontend (from root)
npm install                    # Install all workspace deps
npm run dev                    # Start all dev servers
cd apps/public && bun install  # Per-app (Bun lockfile)
bunx tsc --noEmit -p apps/public/tsconfig.json  # Typecheck

# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
python scripts/repair_data.py --city-separation
pytest

# Sathi Setu
cd sathi-setu
pip install -r requirements.txt
alembic upgrade head
pytest
```

## Key Architectural Rules

1. **API Boundary**: `packages/api-client` is the canonical transport layer
2. **Backend Authority**: Auth, roles, city scoping = backend-only
3. **Migrations Only**: Alembic owns schema; no `create_all()` at startup
4. **No Mocks in Production**: Mock API layer is temporary; replace with real fetch
5. **Explicit Repairs**: Data repairs are opt-in CLI commands, not startup logic
6. **PostgreSQL for Tests**: SQLite incompatible with JSONB schema