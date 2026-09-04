# Sathi Setu Implementation Brief

## Status And Scope

This brief records the pre-implementation audit for a **prototype** submitted
in the context of Smart India Hackathon problem statement `SIH26129`. It does
not assert Government of Maharashtra approval, deployment, certification, or
integration with any production government system.

Sathi Setu is a new interoperability platform. Civic Sathi remains an
independent civic-operations reference system connected through a demo
connector; its existing portals, API contracts, and database remain intact.

## Research Findings

- [Maharashtra State Innovation Society](https://msins.in/) identifies itself
  as a Government of Maharashtra organisation under the Department of Skills,
  Employment, Entrepreneurship and Innovation. This supports the problem
  context shown in the prototype, but is not an endorsement of this product.
- [API Setu](https://apisetu.gov.in/sop) describes a government API platform
  with onboarding, API discovery, authentication, permissions, and documented
  consumption. Sathi Setu adopts those architectural ideas only.
- [API Setu data standards](https://apisetu.gov.in/data-standard) describes
  metadata and data standards as prerequisites for interoperability. Sathi
  Setu therefore uses explicit, configurable field mappings.
- [X-Road architecture](https://docs.x-road.global/Architecture/arc-g_x-road_arhitecture.html)
  reinforces decentralised exchanges, data-owner control, and monitoring. The
  prototype uses connector boundaries, correlation IDs, audit records, and
  does not copy X-Road software, branding, or protocol.
- No current official SIH page for `SIH26129`, its submitted title, or its
  portal lock state was found during this audit. A 2024 official SIH FAQ says
  team details may be changed once during team onboarding, while older
  guidance says submitted details cannot be altered. Neither establishes the
  state of this team's current submission. Portal-side verification is
  required before changing any submitted team or idea field.

## Naming Audit

| Current name | Type | Decision | Reason |
| --- | --- | --- | --- |
| Civic Sathi | Existing product and connected system | Keep | Existing application, package names, portals, and API contracts remain valid. |
| Sathi Setu | New product / solution brand | Add | Names the separate interoperability service and its console. |
| SIH26129 | Problem-statement reference | Keep exactly | Official reference supplied with the project material. |
| Government of Maharashtra | Problem context | Context only | Must not be presented as a product owner, endorsement, or live integration. |
| Maharashtra State Innovation Society | Department context | Presentation/documentation only | Referenced exactly as problem material context; no logo or approval claim. |
| SIH team / idea title | Portal submission data | Do not change | Not available in the repository and must be verified in the portal. |

The product header may say `SATHI SETU — Government Interoperability
Platform`, followed by `Prototype for SIH26129`. It must not say `Official
Government of Maharashtra Portal`.

## Current Civic Sathi Architecture

- `apps/public`, `apps/municipality`, `apps/contractor`, and `apps/admin` are
  independently built React/TanStack portals.
- `backend/` is a FastAPI and PostgreSQL-oriented service using Alembic,
  backend-authoritative role checks, structured logging, ML classification,
  canonical complaint grouping, procurement, auditing, and city scoping.
- `packages/api-client` is the shared TypeScript transport layer.
- Existing English/Marathi localisation and design primitives are retained.
- The baseline already removes startup schema mutation, runtime repair jobs,
  duplicate municipal UI stacks, fake admin auth, and misleading success
  stubs. The new work must preserve those changes.

## Sathi Setu Architecture

`sathi-setu/` is a separately deployable FastAPI service with an independent
database URL. In production it requires a separate PostgreSQL database or
schema; it never imports or migrates Civic Sathi's database.

```text
Civic Sathi (reference system) ---- CivicSathiConnector ----+
                                                            |
Mock Maharashtra State Grievance Service -- LegacyConnector -+--> Sathi Setu
                                                                   canonical data
                                                                   identity / consent
                                                                   tracking / events
                                                                   audit / data quality
```

The service exposes a formal demo console, a machine-readable API catalogue,
and HTTP APIs. The second system is explicitly a **MOCK / DEMONSTRATION
SYSTEM**, has independently shaped payloads and source IDs, and is never
described as an official Maharashtra service.

## Data Model

The service owns these tables:

- `external_systems`: registered source and target systems plus status.
- `connector_configs`: versioned, editable canonical-field mappings.
- `identities`: canonical `SAT-ID-*` identities with only demo attributes.
- `identity_links`: source IDs linked to canonical identities and match basis.
- `consents`: purpose-, source-, and target-scoped data-sharing grants.
- `unified_applications`: `SAT-YYYY-*` records retaining all source IDs.
- `events`: append-only events with event and correlation identifiers.
- `data_quality_issues`: reconciliation conflicts with an auditable outcome.
- `audit_entries`: actor, action, resource, correlation ID, and payload digest.
- `idempotency_records`: replay protection for inbound event keys.

## Security Model

- System clients authenticate with a configured bearer token in the prototype.
- Mutating requests require a correlation ID, source-system ID, and
  idempotency key.
- Consent is enforced server-side before cross-system identity data is
  returned. A denied, revoked, expired, or missing consent produces `403`.
- API input is Pydantic-validated. Sensitive demo fields are redacted from
  audit previews and never embedded in static UI text.
- Audit records are append-only in application code. Production deployment
  must add database permissions, TLS, secrets management, rotation, and a
  tamper-evident audit-store policy.

## Connector And Canonical Model

`BaseConnector` defines `fetch`, `push`, and `map_to_canonical`. The Civic
Sathi connector maps `submitted_by_name`, `submitted_by_phone`, and complaint
fields. The legacy mock connector maps deliberately different fields such as
`citizen_name`, `mobile_no`, `grievance_ref`, and `complaint_text`.

Canonical applications retain the source record reference instead of replacing
it. Identity resolution uses normalised name, masked demo phone, and email
signals. A confident match links an identity; conflicting strong identifiers
generate a reviewable data-quality issue.

## Demo Flow

1. Submit a demo Civic Sathi road complaint event with an idempotency key.
2. Map it to canonical data, resolve or create a `SAT-ID-*` identity, and
   create a `SAT-YYYY-*` unified application.
3. Create a consent request for the mock system. Cross-system access is denied
   until that consent is granted.
4. Grant consent and retrieve the permitted canonical tracking summary.
5. Ingest a mock-system status change; emit and list the correlated event.
6. Ingest a close identity with a conflicting high-confidence attribute; show
   a data-quality review item and its audit trail.

## User Experience And Accessibility

- The standalone Sathi Setu console uses an original, restrained administrative
  visual language: deep blue, warm saffron accent, neutral surfaces, dense but
  readable operational information, and an original bridge/node mark.
- English and Marathi labels are stored in a translation dictionary rather than
  duplicated through the UI. Technical IDs remain un-translated.
- The console provides a semantic header, skip link, keyboard-visible focus,
  accessible status descriptions, labelled controls, responsive tables, and
  reduced-motion support.
- The product marks each integration as `REFERENCE`, `MOCK`, `SANDBOX`, or
  `UNAVAILABLE`; it does not use a fabricated `LIVE government` status.

## Testing Strategy

- Unit tests: mappings, identity matching, consent enforcement, unified ID
  generation, event idempotency, reconciliation, and audit writing.
- API tests: invalid payloads, unauthorised client, missing consent, consent
  grant/revoke, duplicate event, unavailable connector, and status propagation.
- Existing Civic Sathi TypeScript checks and backend tests stay required.
- Full integration tests require an isolated PostgreSQL service; SQLite is
  allowed only as a lightweight test harness and is not the production target.

## Risks And Non-Fabrication Rules

- No Aadhaar, PAN, DigiLocker, MeriPehchaan, government API, or production
  database integration exists in this repository.
- All identities, phone numbers, systems, mappings, events, and consent data
  in the demo are synthetic and visibly labelled.
- The prototype cannot change SIH portal fields; a team lead must verify the
  current portal workflow before submission changes.
- SSO is an OAuth2/OIDC-compatible design boundary, not a live federation.
- PostgreSQL notifications or Redis may replace the in-process demo dispatcher
  for multi-instance deployment; the first prototype stores durable events and
  exposes a polling feed.

## Delivery Order

1. Build the isolated service, schema, connectors, and demo seed data.
2. Implement identity, consent, tracking, events, reconciliation, and audit.
3. Add the console/API catalogue with bilingual and accessible presentation.
4. Add test coverage and operations documentation.
5. Re-run existing Civic Sathi checks and complete visual/demo QA.
