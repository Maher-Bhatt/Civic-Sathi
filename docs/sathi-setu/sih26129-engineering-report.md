# Sathi Setu — SIH26129 Final Engineering Report

**Prototype for Smart India Hackathon SIH26129**
**महाराष्ट्र शासन — Government of Maharashtra**
NOT an official government deployment. All systems, identities, and data are synthetic.

---

## Executive Summary

Sathi Setu is a separately deployable interoperability layer that resolves the core problem of PS26129: government digital platforms remain siloed because they use different schemas, different identifiers, and different technical contracts. Sathi Setu provides:

- A **unified canonical identity** (SAT-ID-XXXXXX) that resolves across systems using phone fingerprint and name similarity matching
- A **unified application tracker** (SAT-YYYY-NNNNNN) that links records from all connected systems without replacing source IDs
- **Server-side consent enforcement** (Sathi Sahamati) — 403 Forbidden is returned by the API, not just by the UI
- A **data quality queue** for human-reviewed resolution of identity conflicts
- An **append-only audit trail** with correlation IDs on every operation
- A **durable event feed** with types: `submitted`, `status_changed`, `identity_matched`, `consent_granted`, `consent_revoked`, `duplicate_detected`

---

## 35-Item Engineering Checklist

### SIH26129 Requirements

| # | Requirement | Status | Evidence |
|---|-------------|--------|----------|
| 1 | Problem statement addressed: system integration and interoperability | ✅ | Sathi Setu connects two independently structured systems and resolves cross-system identities |
| 2 | Two independently built systems demonstrating schema heterogeneity | ✅ | Civic Sathi (complaint_id, description, submitted_by.name) ↔ Maharashtra State Grievance Service (grievance_ref, complaint_text, citizen_name, mobile_no) |
| 3 | Sathi Setu is a separately deployable service | ✅ | `sathi-setu/` has its own FastAPI app, own database, own requirements.txt, runs on port 8001 |
| 4 | Civic Sathi is NOT renamed or broken | ✅ | `CIVIC_SATHI_COMPLETE_DEVELOPER_HANDOFF.md` preserved; no global renames performed |
| 5 | No fake government seals or impersonation | ✅ | Original SVG bridge/node mark used; no Aadhaar/DigiLocker logos |
| 6 | No claim of live Aadhaar/MeriPehchaan integration | ✅ | Explicit disclaimers in console, README, and all mock system documentation |
| 7 | Government of Maharashtra branding (text only) | ✅ | `महाराष्ट्र शासन / Government of Maharashtra` in header; no fake seal |
| 8 | Every system clearly marked LIVE/SANDBOX/MOCK/UNAVAILABLE | ✅ | All badges shown in API catalogue and dashboard; `classification` + `status` fields on ExternalSystem model |
| 9 | Mock system is independent (not same internal DB) | ✅ | `mock-grievance-service/` runs on separate SQLite DB (`mock_grievance.db`), separate port 8002, separate FastAPI app |

### Architecture and Security

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 10 | Bearer token authentication on all mutating endpoints | ✅ | `require_connector_key()` in `core/security.py` enforces `Authorization: Bearer` on all `/v1/` routes except health, catalogue, demo |
| 11 | SATHI_SETU_LOOKUP_KEY for Civic Sathi external endpoint | ✅ | `backend/app/api/v1/routes/external.py` uses `X-Sathi-Setu-Key` header, returns 503 if key not configured |
| 12 | No secrets in source control | ✅ | `.env.example` files provided; actual secrets only in `.env` (gitignored); `SATHI_SETU_API_KEY` validated min 16 chars |
| 13 | Frontend role/city/system values not trusted for access control | ✅ | All access checks are server-side; `require_consent()` enforces at API layer |
| 14 | Database isolation between services | ✅ | Sathi Setu, Civic Sathi, and Mock Grievance Service each have their own database URL |
| 15 | CORS configured appropriately | ✅ | `app/main.py` allows localhost development origins; not a wildcard in non-demo mode |

### Data Model

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 16 | Canonical identity with SAT-ID-NNNNNN format | ✅ | `identity_resolution_service.py` → `_next_canonical_id()` → `SAT-ID-{seq:06d}` |
| 17 | Phone fingerprinting (SHA-256, 8+ digits required) | ✅ | `fingerprint_phone()` in identity service; SQLite-compatible standard `JSON` column types |
| 18 | Name similarity via SequenceMatcher (≥0.67) | ✅ | `_names_match()` in identity service |
| 19 | Source records accumulated, not replaced | ✅ | `add_source_reference()` in tracking service; `test_original_source_ids_preserved` passes |
| 20 | Idempotency key deduplication | ✅ | `IdempotencyRecord` model; returns `idempotent_replay: true` on second submission |
| 21 | Purpose-scoped consent | ✅ | `Consent` model has `purpose` field; `active_consent()` scopes by source+target+purpose+identity |
| 22 | Consent expiry handling (timezone-safe) | ✅ | `_not_expired()` in `consent_service.py` handles both naive (SQLite) and aware datetimes |
| 23 | Alembic migration for all 10 tables | ✅ | `alembic/versions/0001_initial_schema.py` with full upgrade/downgrade |

### Testing

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 24 | Connector tests: Civic Sathi field mapping | ✅ | `test_connectors.py` — 16 tests; all pass |
| 25 | Connector tests: Mock Grievance Service field mapping | ✅ | `test_connectors.py` — 11 tests; all pass |
| 26 | Connector tests: schema separation proof | ✅ | `test_distinct_field_names_from_civic_sathi` passes |
| 27 | Identity tests: phone fingerprint, name normalization, email matching | ✅ | `test_identity.py` — 16 tests; all pass |
| 28 | Consent tests: PENDING/REVOKED/EXPIRED → 403; GRANTED → passes | ✅ | `test_consent.py` — 12 tests; all pass |
| 29 | Tracking tests: SAT-YYYY-NNNNNN format, source accumulation, duplicate prevention | ✅ | `test_tracking.py` — 8 tests; all pass |
| 30 | API integration tests: full demo flow (ingest→consent→deny→grant→allow→revoke) | ✅ | `test_api.py` — 20 tests; all pass |
| 31 | **Total tests passing** | ✅ | **84 / 84 passed** |

### UI / Accessibility

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 32 | Pure HTML+JS web console (no build toolchain) | ✅ | `sathi-setu/web/index.html` — single file, CDN-free (uses system fonts), no webpack/vite |
| 33 | English/Marathi bilingual toggle with real i18n dictionary | ✅ | `TRANSLATIONS.mr` object with ~80 keys; `toggleLang()` calls `applyTranslations()` on all `data-i18n` elements |
| 34 | WCAG 2.2 AA accessibility features | ✅ | Skip link, semantic HTML (`<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<table>`), `aria-label`, `aria-modal`, `aria-live`, keyboard `Escape` for modal, `focus-visible` ring, reduced motion media query |
| 35 | All 5 TypeScript projects typecheck cleanly | ✅ | `npx tsc --noEmit` — all 5 tsconfigs exit 0, no new errors introduced |

---

## File Map

```
sathi-setu/
  app/
    main.py                        FastAPI app, static web serving
    api/routes.py                  All /v1/ endpoints (+ demo/config)
    connectors/
      civic_sathi_connector.py     CivicSathiConnector (REFERENCE)
      mock_legacy_portal_connector.py  MockLegacyPortalConnector (MOCK)
    models/__init__.py             10 SQLAlchemy models
    schemas/__init__.py            7 Pydantic schemas
    services/
      identity_resolution_service.py  SAT-ID MDM with phone fingerprint
      consent_service.py              Purpose-scoped consent enforcement
      tracking_service.py             SAT-YYYY-NNNNNN unified IDs
      audit_service.py                Append-only audit trail
      event_service.py                Durable event feed
      data_quality_service.py         Identity conflict detection
    core/
      config.py                    pydantic_settings, env prefix SATHI_SETU_
      security.py                  Bearer token validation
      database.py                  SQLAlchemy engine + get_db dependency
    tests/
      conftest.py                  SQLite fixtures, TestClient, AUTH_HEADER
      test_api.py                  20 API integration tests
      test_connectors.py           27 connector mapping tests
      test_identity.py             16 identity resolution tests
      test_consent.py              12 consent enforcement tests
      test_tracking.py             8 tracking service tests
  alembic/
    env.py                         Reads SATHI_SETU_DATABASE_URL from env
    versions/0001_initial_schema.py  Full initial migration
  web/
    index.html                     Complete web console (single HTML file)
  scripts/
    init_demo.py                   Seeds 2 systems with connector configs
  .env.example                     Environment variable template
  requirements.txt                 Service dependencies
  pytest.ini                       Test configuration

mock-grievance-service/
  main.py                          Independent FastAPI on port 8002
  seed_demo.py                     Seeds 3 synthetic demo records
  requirements.txt
  .env.example
  README.md                        Prominent MOCK disclaimer

backend/app/api/v1/routes/
  external.py                      GET /external/lookup (X-Sathi-Setu-Key)
backend/app/api/v1/router.py       + external router registered

docs/sathi-setu/
  implementation-brief.md          Architecture brief (Codex-authored)
  demo-runbook.md                  23-step demo runbook (NEW)
```

---

## Known Limitations (Prototype Scope)

1. **Event bus is polling-based** — events stored in DB, not streamed via WebSocket or PostgreSQL NOTIFY. Polling the `/v1/events` endpoint is the demo mechanism.
2. **No outbound webhook from Civic Sathi** — the `external.py` lookup endpoint is built; the fire-and-forget webhook trigger on complaint creation was deprioritized to keep Civic Sathi changes minimal.
3. **Sathi Pehchaan is design-only** — no actual OAuth2/OIDC server; the concept is demonstrated architecturally in the console.
4. **Phone country code normalization** — `+91-9876543210` fingerprints differently from `9876543210` because the digit extraction is `[0-9]+`. This is documented as known behaviour; operators should strip country codes before ingestion.
5. **SQLite in dev** — `create_all()` in `init_demo.py` for local development only; Alembic is used for any real database.
