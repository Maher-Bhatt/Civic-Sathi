# Dynamic Audit Logging — Design Document

## Overview

Dynamic Audit Logging converts the Civic Sathi admin audit trail from a
manually-populated record into a live, automatically-generated stream. SQLAlchemy
mapper-level event listeners intercept state changes on four core models
(`Complaint`, `WorkOrder`, `Tender`, `SLARule`) and write structured `AuditLog`
rows to `platform_audit_logs` within the same database transaction — without
modifying any existing business logic, route, or service.

The actor who triggered each change (officer, admin, municipality user) is
propagated via a `ContextVar` set by an HTTP middleware that decodes the JWT on
every authenticated request. When no request context is present (background tasks,
CLI pipelines) the system falls back to a stable `"system"` identity rather than
silently dropping the write.

The admin portal at `/admin/audit-logs` polls the backend every 30 seconds and
renders new entries as they appear.

---

## Glossary

| Term | Definition |
|------|-----------|
| **Audit_Context** | The `contextvars.ContextVar` mechanism in `audit_context.py` that carries the authenticated actor's identity for exactly one HTTP request's lifetime. |
| **Audit_Listener** | The SQLAlchemy event-listener subsystem in `audit_listeners.py` that intercepts model changes and writes `AuditLog` rows. |
| **AuditLog** | The `platform_audit_logs` SQLAlchemy model — the immutable record written for every tracked change. |
| **Auditable_Model** | Any of the four instrumented models: `Complaint`, `WorkOrder`, `Tender`, `SLARule`. |
| **Actor** | The authenticated user whose JWT is present on the request (`actor_id`, `actor_name`, `actor_role`), or System_Identity when absent. |
| **System_Identity** | Fallback actor: `actor_id="system"`, `actor_name="System"`, `actor_role="system"`. Used when `Audit_Context` holds `None`. |
| **Bulk_Guard** | The `DISABLE_AUTO_AUDIT` environment variable that suppresses all listener writes during bulk-import operations. |
| **`_FIELD_MAP`** | The dictionary in `audit_listeners.py` mapping each Auditable_Model class to its list of `(field_name, action_string)` tuples. |
| **`_registered_listeners`** | The module-level dict in `audit_listeners.py` keyed by model class; prevents duplicate listener registration on hot-reload. |
| **`setup_auditing()`** | The public function called during FastAPI lifespan startup that registers all mapper-level events idempotently. |
| **Connection-level write** | Writing the `AuditLog` row via the raw `Connection` object from the mapper event rather than via the ORM `Session`, avoiding re-entrant flush cycles. |
| **`get_history()`** | `sqlalchemy.orm.attributes.get_history()` — reads the pre-flush committed value and the post-flush new value for a given attribute, used inside `after_update` callbacks. |

---

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  FastAPI Process                                                             │
│                                                                             │
│  ┌───────────────────────┐    lifespan startup                             │
│  │   main.py             │────────────────────► setup_auditing()           │
│  │                       │                          │                      │
│  │  audit_actor_middleware│                          ▼                     │
│  │  (HTTP middleware)    │              ┌─────────────────────────┐        │
│  └──────────┬────────────┘              │  audit_listeners.py     │        │
│             │                           │                         │        │
│     JWT decode                         │  _FIELD_MAP             │        │
│             │                           │  _registered_listeners  │        │
│             ▼                           │  _make_after_insert()   │        │
│  ┌──────────────────────┐               │  _make_after_update()   │        │
│  │  audit_context.py    │               │  _make_after_delete()   │        │
│  │                      │               └──────────┬──────────────┘        │
│  │  current_audit_actor │                          │                       │
│  │  (ContextVar)        │◄─── get_audit_actor() ───┘                       │
│  │                      │                                                  │
│  │  set_audit_actor()   │     mapper events fire                           │
│  │  get_audit_actor()   │     (after_insert / after_update / after_delete) │
│  └──────────────────────┘                  │                               │
│                                            ▼                               │
│  ┌──────────────────────────────────────────────────────┐                 │
│  │  PostgreSQL / Neon                                   │                 │
│  │                                                      │                 │
│  │  Auditable tables        platform_audit_logs         │                 │
│  │  ─────────────────       ────────────────────────    │                 │
│  │  complaints              id (UUID v4)                │                 │
│  │  work_orders             actor_id / name / role      │                 │
│  │  tenders                 action                      │                 │
│  │  sla_rules               entity_type / id / label   │                 │
│  │                          previous_value / new_value  │                 │
│  │                          reason / at (UTC)           │                 │
│  └──────────────────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  Admin Frontend  (apps/admin)                                               │
│                                                                             │
│  audit-logs.tsx                                                             │
│  ──────────────────────────────────────────────────────                     │
│  useEffect → loadData() on mount + setInterval(30 000 ms)                  │
│                │                                                            │
│                ▼                                                            │
│  getAuditLogs()  (shared-store.ts)                                         │
│  GET /api/v1/admin/audit-logs?limit=200&[filters]                          │
│                │                                                            │
│                ▼                                                            │
│  admin.py → list_audit_logs()                                              │
│  SELECT * FROM platform_audit_logs ORDER BY at DESC                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Authenticated HTTP Request Path

```
HTTP Request (Authorization: Bearer <jwt>)
        │
        ▼
audit_actor_middleware  (main.py)
        │
        ├─ jwt.decode(raw_token, settings.jwt_secret, algorithms=["HS256"])
        │       extracts: sub → actor_id
        │                 name → actor_name
        │                 role → actor_role
        │
        ├─ set_audit_actor(actor_id, actor_name, actor_role)
        │       stores Token returned by ContextVar.set() for later reset
        │
        ▼
  [route handler executes — ORM operations happen]
        │
        ├─ Session.flush() / Session.commit()
        │       SQLAlchemy fires mapper event on Auditable_Model
        │               │
        │               ▼
        │       _make_after_update(ModelClass) callback
        │               │
        │               ├─ _is_disabled() check  ← DISABLE_AUTO_AUDIT guard
        │               │
        │               ├─ get_audit_actor() → reads ContextVar
        │               │       returns Actor dict (or _SYSTEM_ACTOR if None)
        │               │
        │               ├─ attributes.get_history(target, field)
        │               │       per tracked field in _FIELD_MAP[ModelClass]
        │               │
        │               └─ connection.execute(insert(AuditLog).values(...))
        │                       Connection-level write — no Session re-entry
        │
        ▼
  finally block in audit_actor_middleware
        └─ current_audit_actor.reset(token_reset)
                clears actor — prevents bleed into next async task
```

### System / Background Task Path

```
Background task / CLI script
        │
        ├─ No HTTP middleware runs → ContextVar holds default (None)
        │
        ▼
  ORM operation on Auditable_Model
        │
        ▼
  mapper event callback
        │
        ├─ get_audit_actor() → returns None
        │
        └─ actor = _SYSTEM_ACTOR  (fallback)
                → writes row with actor_id="system"
```

---

## Actor Injection Mechanism

### ContextVar Isolation

`current_audit_actor` is a `contextvars.ContextVar[Optional[Dict]]` with
`default=None`. Python's asyncio executor gives each coroutine its own
`Context` snapshot, so concurrent requests each see their own value and
cannot read another request's actor.

```python
# audit_context.py
current_audit_actor: ContextVar[Optional[Dict[str, Any]]] = ContextVar(
    "current_audit_actor", default=None
)

def set_audit_actor(actor_id, actor_name, actor_role):
    return current_audit_actor.set({
        "actor_id": actor_id,
        "actor_name": actor_name,
        "actor_role": actor_role,
    })

def get_audit_actor() -> Optional[Dict[str, Any]]:
    return current_audit_actor.get()
```

### Middleware Reset (Req 1.4)

`audit_actor_middleware` stores the `Token` returned by `set_audit_actor()` and
calls `current_audit_actor.reset(token_reset)` in a `finally` block, ensuring
the actor is cleared regardless of whether the route handler succeeds or raises.
This prevents actor bleed across reused async tasks in the uvicorn worker pool.

```python
# main.py (simplified)
async def audit_actor_middleware(request, call_next):
    token_reset = None
    if auth_header:
        token_reset = set_audit_actor(actor_id, actor_name, actor_role)
    try:
        response = await call_next(request)
    finally:
        if token_reset is not None:
            current_audit_actor.reset(token_reset)
    return response
```

### System_Identity Fallback (Req 1.2, 1.5)

Inside every listener callback, `get_audit_actor() or _SYSTEM_ACTOR` is the
single expression that resolves the actor. If the ContextVar returns `None`
(absent JWT, expired token, background task, CLI script), `_SYSTEM_ACTOR` is
used. This path is also exercised in `_write_audit_rows()` directly.

---

## Listener Registration Pattern

### Startup Registration

`setup_auditing()` is called from the FastAPI `lifespan` context manager
before the application starts accepting requests:

```python
# main.py
@asynccontextmanager
async def lifespan(app_instance):
    setup_auditing()
    yield
```

`setup_auditing()` iterates over the four model classes in `_FIELD_MAP` and
registers three mapper-level events per model using `sqlalchemy.event.listen()`.

### Idempotency Guard (Req 2.3)

The module-level `_registered_listeners: dict[type, dict[str, Any]]` dict
records which model classes have already been instrumented. If a class key is
already present, `setup_auditing()` skips it without re-registering, preventing
duplicate `AuditLog` rows on uvicorn hot-reload cycles.

```python
_registered_listeners: dict[type, dict[str, Any]] = {}

def setup_auditing() -> None:
    if _is_disabled():
        return
    for model_cls in _FIELD_MAP:
        if model_cls in _registered_listeners:
            continue            # already registered — skip
        after_insert_fn = _make_after_insert(model_cls)
        after_update_fn = _make_after_update(model_cls)
        after_delete_fn = _make_after_delete(model_cls)
        event.listen(model_cls, "after_insert", after_insert_fn)
        event.listen(model_cls, "after_update", after_update_fn)
        event.listen(model_cls, "after_delete", after_delete_fn)
        _registered_listeners[model_cls] = {
            "after_insert": after_insert_fn,
            "after_update": after_update_fn,
            "after_delete": after_delete_fn,
        }
```

### Listener Factory Pattern

Each event type uses a factory function (`_make_after_insert`, `_make_after_update`,
`_make_after_delete`) that closes over `model_cls`. This gives each registered
callback its own scope, avoids late-binding issues in the loop, and allows the
`_registered_listeners` dict to store distinct function references per model.

---

## Tracked Fields Per Model

```
_FIELD_MAP = {
    Complaint: [
        ("status",               "COMPLAINT_STATUS_CHANGED"),
        ("assigned_officer_id",  "COMPLAINT_ASSIGNED"),
        ("priority",             "COMPLAINT_PRIORITY_CHANGED"),
    ],
    WorkOrder: [
        ("status",                  "WORK_ORDER_STATUS_CHANGED"),
        ("risk_level",              "WORK_ORDER_RISK_CHANGED"),
        ("verified_progress_pct",   "WORK_ORDER_PROGRESS_VERIFIED"),
    ],
    Tender: [
        ("status",            "TENDER_STATUS_CHANGED"),
        ("estimated_budget",  "TENDER_BUDGET_CHANGED"),
    ],
    SLARule: [
        ("response_hours",    "SLA_RESPONSE_HOURS_CHANGED"),
        ("resolution_hours",  "SLA_RESOLUTION_HOURS_CHANGED"),
        ("escalation_hours",  "SLA_ESCALATION_HOURS_CHANGED"),
        ("is_active",         "SLA_RULE_TOGGLED"),
    ],
}
```

On `after_update`, `_write_audit_rows()` iterates this list and emits **one
`AuditLog` row per changed field** (Req 3.4, 6.1). If none of the tracked fields
have changed, no rows are written (Req 3.5, 4.4, 5.3, 6.3).

---

## Write Mechanism: Connection vs Session

### Why Connection-level (Req 7.6, 9.3, 9.4)

SQLAlchemy mapper events fire inside an open unit-of-work. Calling
`session.add()`, `session.flush()`, or `session.merge()` from within a mapper
event creates a re-entrant flush — the session emits another round of
`before_flush` / `after_flush` events on top of the in-progress one, producing
recursive loops and potential data corruption.

The `Connection` object passed to every mapper event callback is the raw
DBAPI-level connection already holding the transaction. Writing via
`connection.execute(insert(...).values(...))` bypasses the ORM layer entirely:
no session state is touched, no extra round-trips occur, and the insert
participates in the **same open transaction** as the triggering operation.

### Transactional Consistency (Req 2.6, 9.5)

Because the `AuditLog` insert shares the connection that owns the current
transaction, if the caller rolls back that transaction the `AuditLog` row is
rolled back with it. There is never a case where a model change is rolled back
but its corresponding audit entry persists.

```
Session.commit()
    └─ flushes pending changes
           └─ fires after_update on Auditable_Model
                  └─ connection.execute(insert(AuditLog)...)
                         └─ INSERT is part of same transaction
    └─ transaction commits → both model row and AuditLog row committed

Session.rollback()
    └─ transaction rolled back → both rows discarded
```

### Attribute History API (Req design note)

Inside `after_update`, the post-flush unit of work has already expired most
attribute values on the `target` instance. `attributes.get_history(target, field)`
is the correct SQLAlchemy API for reading the **pre-flush committed value**
(in `history.deleted`) and the **post-flush new value** (in `history.added`)
from the identity map without triggering a SELECT. This is the mechanism behind
the `_serialize(old_val)` and `_serialize(new_val)` comparison that skips rows
where the value didn't actually change.

---

## Row Integrity Details (Req 7)

| Field | Value | Notes |
|-------|-------|-------|
| `id` | `uuid.uuid4()` | Generated fresh per row |
| `at` | `datetime.now(timezone.utc)` | Recorded at callback fire time |
| `actor_id / name / role` | From ContextVar or `_SYSTEM_ACTOR` | Never NULL |
| `entity_type` | `model_cls.__tablename__` | e.g. `"complaints"` |
| `entity_id` | `str(target.id)` | UUID as string |
| `entity_label` | Derived per model; `None` → SQL NULL; `>255 chars` → truncated | |
| `previous_value` | `_serialize(old_val)` → `None` if old was `None` | SQL NULL, not `"None"` |
| `new_value` | `_serialize(new_val)` → `None` if new was `None` | SQL NULL on INSERT if field is null |
| `reason` | `"Automated system audit"` | Distinguishes from manual entries |

`_serialize()` handles `datetime` → ISO 8601, `uuid.UUID` → string, SQLAlchemy
enum values → `val.value`, `None` → `None` (passes through as SQL NULL).

### Entity Label Strategy

```
Complaint  → target.public_id  (e.g. "JN-2024-00042")  or str(target.id)
WorkOrder  → str(target.id)
Tender     → target.title
SLARule    → "{category} / {severity}"  (e.g. "Road Damage / CRITICAL")
```

All labels are passed through `label[:255]` to enforce the 255-character cap.

---

## Bulk Operation Guard (Req 8)

`_is_disabled()` is evaluated on **every callback invocation**, not once at
import time. This allows `DISABLE_AUTO_AUDIT=true` to be set in the shell
before running a bulk-import process without requiring an application restart.

```python
def _is_disabled() -> bool:
    return os.environ.get("DISABLE_AUTO_AUDIT", "").strip().lower() == "true"
```

The exact string `"true"` is required (case-insensitive after `.lower()`).
Any other value — absent, empty string, `"1"`, `"yes"`, `"false"` — leaves
the listeners active. When disabled, the `setup_auditing()` guard also skips
listener registration entirely and logs the fact at `INFO` level.

---

## Non-Interference Guarantees (Req 9)

| Constraint | Implementation |
|-----------|----------------|
| Exception never propagates | `try/except Exception` wraps every `connection.execute()` call; caught exceptions are logged at `WARNING` |
| Secondary exception suppressed | Inner `try/except` around `logger.warning(...)` swallows logger failures |
| No model mutation | Callbacks only read attributes via `get_history()` and `getattr()`; `setattr()` is never called |
| No session operations | Only `connection.execute()` is used — no `session.add/flush/expire/refresh/merge` |
| Zero extra round-trips | Single `INSERT` per changed field; `get_history()` reads from identity map with no SELECT |
| Connection pool untouched | Callback receives the event's existing connection; no `engine.connect()` calls |

---

## API Layer

### Endpoints (admin.py)

```
GET  /api/v1/admin/audit-logs
     Query params: limit (1–1000, default 200), offset, actor_role, entity_type
     Auth: require_admin (super-admin only)
     Returns: List[AuditLogOut] ordered by at DESC

POST /api/v1/admin/audit-logs
     Body: AuditLogCreate
     Auth: require_admin
     Returns: AuditLogOut (201)
     Purpose: manual entry injection for operator-written notes
```

The `GET` endpoint supports filtering on `actor_role` and `entity_type`, which
the frontend passes via `URLSearchParams`. Pagination uses `limit`/`offset`.

### Response Shape (AuditLogOut)

```
id              string  (UUID)
actor_id        string
actor_name      string
actor_role      string
action          string  (e.g. "COMPLAINT_STATUS_CHANGED")
entity_type     string  (e.g. "complaints")
entity_id       string
entity_label    string | null
previous_value  string | null
new_value       string | null
reason          string | null
at              datetime (ISO 8601, UTC)
```

### Frontend Field Mapping (shared-store.ts)

`getAuditLogs()` normalizes snake_case API fields to camelCase for TypeScript
consumers:

```
entry.actor_id    → log.actorId
entry.actor_name  → log.actorName
entry.actor_role  → log.actorRole
entry.entity_type → log.entityType
entry.entity_id   → log.entityId
entry.entity_label → log.entityLabel
entry.previous_value → log.previousValue
entry.new_value   → log.newValue
entry.at          → log.at
```

---

## Frontend Polling Integration

### Polling Strategy

`audit-logs.tsx` uses a plain `setInterval` rather than TanStack Query — a
deliberate choice for simplicity given the read-only, append-only nature of
the log. The interval is 30 000 ms.

```typescript
useEffect(() => {
    loadData();                                     // immediate fetch on mount
    const interval = setInterval(loadData, 30000);  // then every 30 s
    return () => clearInterval(interval);           // cleanup on unmount
}, []);
```

`loadData()` calls `getAuditLogs()` (no filters on the interval refresh,
full 200-entry fetch) and replaces the entire `logs` state array. Filtering
by role, entity type, date range, and free-text search is applied client-side
on the `filteredLogs` derived array.

### Filter Architecture

Filters are applied entirely in the browser against the fetched dataset:

```
logs (state, 200 entries from API)
    │
    └─ filteredLogs (derived)
           ├─ roleFilter !== "ALL"   → log.actorRole === roleFilter
           ├─ entityFilter !== "ALL" → log.entityType === entityFilter
           ├─ search                 → includes match on actorName or action
           ├─ startDate              → log.at >= startDate
           └─ endDate                → log.at <= endDate (23:59:59)
```

`uniqueRoles` and `uniqueEntities` are derived from the live `logs` array
and drive the `<select>` filter dropdowns, so filter options always reflect
what is actually present in the fetched page.

---

## Correctness Properties

Property 1: Actor Propagation — Per-Request Isolation

_For any_ two concurrent HTTP requests carrying different valid JWTs, the
`AuditLog` rows written during each request SHALL carry that request's actor
identity exclusively, and SHALL NOT contain actor fields from the other
concurrent request.

**Validates: Requirements 1.1, 1.3, 1.4**

Property 2: System_Identity Fallback

_For any_ listener write executed when `get_audit_actor()` returns `None`
(no JWT, expired token, background task), the written `AuditLog` row SHALL
have `actor_id="system"`, `actor_name="System"`, and `actor_role="system"`.

**Validates: Requirements 1.2, 1.5**

Property 3: Field-Level Granularity

_For any_ `after_update` event where N tracked fields have changed values,
the Audit_Listener SHALL write exactly N `AuditLog` rows (one per changed
field) with distinct `action` values, and SHALL write zero rows when no
tracked field has changed.

**Validates: Requirements 3.4, 3.5, 4.4, 5.3, 6.1, 6.3**

Property 4: Transactional Atomicity

_For any_ database transaction that triggers a listener write and is
subsequently rolled back, zero `AuditLog` rows from that write SHALL persist
in `platform_audit_logs` after the rollback completes.

**Validates: Requirements 2.6, 9.5**

Property 5: Non-Interference

_For any_ listener invocation that raises an exception during the
`connection.execute()` call, the exception SHALL be swallowed (logged at
WARNING) and the originating business transaction SHALL proceed to commit
without error.

**Validates: Requirements 9.1**

Property 6: Idempotent Registration

_For any_ number of calls to `setup_auditing()` on the same process, the
Audit_Listener SHALL register each model's mapper events at most once,
producing no duplicate `AuditLog` rows for any single database operation.

**Validates: Requirements 2.3**

Property 7: Bulk Guard Bypass

_For any_ listener callback invoked when `DISABLE_AUTO_AUDIT` equals `"true"`
(exact match), the callback SHALL execute zero database statements and return
immediately.

**Validates: Requirements 8.1, 8.3, 8.4**

---

## File Map

```
backend/
  app/
    core/
      audit_context.py       ContextVar declaration, set_audit_actor(), get_audit_actor()
      audit_listeners.py     _FIELD_MAP, _write_audit_rows(), listener factories, setup_auditing()
    models/
      audit.py               AuditLog and ModelRun SQLAlchemy models
    api/v1/routes/
      admin.py               GET/POST /admin/audit-logs, AuditLogOut schema
    main.py                  audit_actor_middleware, lifespan → setup_auditing()

apps/admin/src/
  services/
    shared-store.ts          getAuditLogs() — fetch + camelCase normalization
  routes/admin/
    audit-logs.tsx           30 s polling UI, client-side filter, table render
```
