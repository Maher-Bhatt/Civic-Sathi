# Requirements Document

## Introduction

Dynamic Audit Logging (Phase 1) converts the Civic Sathi IGRS admin audit trail
from a manually-populated record into a live, automatically-generated stream.
SQLAlchemy event listeners intercept state changes on four core models —
`Complaint`, `WorkOrder`, `Tender`, and `SLARule` — and write structured
`AuditLog` entries to `platform_audit_logs` without modifying existing business
logic. The admin panel at `/admin/audit-logs` polls the table every 30 seconds
and will surface these entries immediately once the backend writes them.

The actor identity that triggered each change (officer, admin, municipality user)
is captured via a `ContextVar` set by an HTTP middleware from the JWT in every
authenticated request, and falls back to a `"system"` identity when no request
context is present (e.g. pipeline scripts).

A `DISABLE_AUTO_AUDIT=true` environment variable allows bulk-import scripts to
suppress listener writes, preventing noise from mass-insert operations against
the 118,000+ complaint record dataset.

---

## Glossary

- **Audit_Listener**: The SQLAlchemy event-listener subsystem defined in
  `backend/app/services/audit_listeners.py` that intercepts model changes and
  writes `AuditLog` rows.
- **Audit_Context**: The `contextvars.ContextVar` mechanism defined in
  `backend/app/core/audit_context.py` that carries the authenticated actor's
  identity for the lifetime of a single HTTP request.
- **AuditLog**: The `platform_audit_logs` SQLAlchemy model whose fields include
  `actor_id`, `actor_name`, `actor_role`, `action`, `entity_type`, `entity_id`,
  `entity_label`, `previous_value`, `new_value`, `reason`, and `at`.
- **Auditable_Model**: Any of the four instrumented SQLAlchemy models:
  `Complaint`, `WorkOrder`, `Tender`, `SLARule`.
- **Actor**: The authenticated user (officer, admin, municipality, or supervisor)
  whose JWT is present on the HTTP request, or the `"system"` identity when no
  request context is available.
- **Bulk_Guard**: The `DISABLE_AUTO_AUDIT` environment variable mechanism that
  suppresses `Audit_Listener` writes during bulk-import operations.
- **System_Identity**: The fallback actor used when `Audit_Context` holds no
  value: `actor_id="system"`, `actor_name="System"`, `actor_role="system"`.

---

## Requirements

### Requirement 1: Actor Identity Propagation

**User Story:** As an admin, I want every audit log entry to identify the
officer or admin who caused the change, so that I can trace accountability for
each platform action.

#### Acceptance Criteria

1. WHEN an HTTP request carrying a JWT that passes signature validation, has not expired, and contains all three claims `sub`, `name`, and `role`, THE Audit_Context SHALL extract those claims and store them as the current Actor with `actor_id` set to the `sub` value, `actor_name` set to the `name` value, and `actor_role` set to the `role` value for the duration of that request.

2. IF the JWT is absent, expired, fails signature validation, or is present but missing one or more of the `sub`, `name`, or `role` claims, THEN THE Audit_Context SHALL set the current Actor to System_Identity, where System_Identity has `actor_id` set to `"system"`, `actor_name` set to `"System"`, and `actor_role` set to `"system"`, so that listener writes still complete without raising an exception.

3. THE Audit_Context SHALL use a `contextvars.ContextVar` so that each concurrent async request carries an independent Actor value, and reading the Actor from one request context SHALL NOT return the Actor value set by any other concurrent request.

4. WHEN a request completes or raises an exception, THE Audit_Context SHALL reset the Actor `contextvars.ContextVar` to its default value so that no Actor value persists beyond the request that set it.

5. WHEN a listener write is executed from outside an HTTP request (e.g. a background task or CLI script), THE Audit_Listener SHALL read the Actor from Audit_Context and use System_Identity if the value is `None`.

---

### Requirement 2: SQLAlchemy Event Listener Registration

**User Story:** As a platform engineer, I want audit listeners to be registered
once at application startup so that every subsequent database session
automatically captures changes without per-route instrumentation.

#### Acceptance Criteria

1. WHEN the FastAPI application lifespan startup handler completes, THE Audit_Listener SHALL have registered `after_insert`, `after_update`, and `after_delete` mapper events on each of the four Auditable_Models (`Complaint`, `WorkOrder`, `Tender`, `SLARule`) before the application begins accepting HTTP requests.

2. THE Audit_Listener SHALL use SQLAlchemy mapper-level events rather than session-level events so that each listener fires within the same database transaction that produced the change.

3. WHEN `setup_auditing()` is called and a listener function is already attached to a given Auditable_Model mapper, THE Audit_Listener SHALL skip re-registration for that model and emit no duplicate `AuditLog` rows, leaving the existing registration unchanged.

4. WHEN the `DISABLE_AUTO_AUDIT` environment variable is set to the string `"true"` at process start, THE Audit_Listener SHALL skip registration of all mapper events, producing zero `AuditLog` rows for any insert, update, or delete operation in that process.

5. IF `setup_auditing()` raises an unhandled exception during event registration, THEN THE Audit_Listener SHALL propagate the exception to the caller, preventing the application from starting in a partially-instrumented state.

6. WHEN an `after_insert`, `after_update`, or `after_delete` mapper event fires, THE Audit_Listener SHALL complete its `AuditLog` write within the same open transaction as the triggering operation, such that both the model change and the `AuditLog` row are committed or rolled back atomically.

---

### Requirement 3: Complaint Change Capture

**User Story:** As an admin, I want status transitions, assignment changes, and
priority updates on complaints to appear in the audit trail automatically, so
that I can review the full lifecycle of every civic report without relying on
manual log writes.

#### Acceptance Criteria

1. WHEN a `Complaint` row is updated and the `status` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"COMPLAINT_STATUS_CHANGED"`, `previous_value` containing the old status
   string, and `new_value` containing the new status string.

2. WHEN a `Complaint` row is updated and the `assigned_officer_id` field has
   changed, THE Audit_Listener SHALL write one `AuditLog` entry with `action`
   set to `"COMPLAINT_ASSIGNED"`, recording the previous and new officer UUIDs
   in `previous_value` and `new_value` respectively.

3. WHEN a `Complaint` row is updated and the `priority` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"COMPLAINT_PRIORITY_CHANGED"`, recording the old and new priority values.

4. WHEN a single `Complaint` flush contains changes to multiple tracked fields
   simultaneously, THE Audit_Listener SHALL write one `AuditLog` entry per
   changed tracked field, not one combined entry.

5. WHEN a `Complaint` row is updated but none of `status`, `assigned_officer_id`,
   or `priority` have changed, THE Audit_Listener SHALL produce no `AuditLog`
   entry for that flush.

6. THE Audit_Listener SHALL populate `entity_type` with `"complaint"`,
   `entity_id` with the complaint UUID, and `entity_label` with the complaint's
   `public_id` field (e.g. `"JN-2024-00042"`) on every `Complaint` audit entry.

---

### Requirement 4: WorkOrder Change Capture

**User Story:** As an admin, I want work order status transitions and risk level
changes to appear in the audit trail automatically, so that I can monitor
contractor execution and governance risk without waiting for manual entries.

#### Acceptance Criteria

1. WHEN a `WorkOrder` row is updated and the `status` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"WORK_ORDER_STATUS_CHANGED"`, `previous_value` containing the old status
   value, and `new_value` containing the new status value.

2. WHEN a `WorkOrder` row is updated and the `risk_level` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"WORK_ORDER_RISK_CHANGED"`, recording the old and new risk level strings.

3. WHEN a `WorkOrder` row is updated and the `verified_progress_pct` field has
   changed, THE Audit_Listener SHALL write one `AuditLog` entry with `action`
   set to `"WORK_ORDER_PROGRESS_VERIFIED"`, recording the old and new percentage
   values as strings.

4. WHEN a `WorkOrder` row is updated but none of `status`, `risk_level`, or
   `verified_progress_pct` have changed, THE Audit_Listener SHALL produce no
   `AuditLog` entry for that flush.

5. THE Audit_Listener SHALL populate `entity_type` with `"work_order"` and
   `entity_id` with the work order UUID on every `WorkOrder` audit entry.

---

### Requirement 5: Tender Change Capture

**User Story:** As an admin, I want tender status changes and budget
modifications to be automatically logged, so that the procurement pipeline is
traceable end-to-end in the audit trail.

#### Acceptance Criteria

1. WHEN a `Tender` row is updated and the `status` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"TENDER_STATUS_CHANGED"`, `previous_value` containing the old status value,
   and `new_value` containing the new status value.

2. WHEN a `Tender` row is updated and the `estimated_budget` field has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"TENDER_BUDGET_CHANGED"`, recording the old and new budget values as
   decimal strings.

3. WHEN a `Tender` row is updated but neither `status` nor `estimated_budget`
   has changed, THE Audit_Listener SHALL produce no `AuditLog` entry for that
   flush.

4. THE Audit_Listener SHALL populate `entity_type` with `"tender"`, `entity_id`
   with the tender UUID, and `entity_label` with the tender's `title` field on
   every `Tender` audit entry.

---

### Requirement 6: SLARule Change Capture

**User Story:** As an admin, I want every modification to SLA hour thresholds
and active/inactive toggles to be automatically recorded, so that configuration
drift can be detected and reverted if service targets regress.

#### Acceptance Criteria

1. WHEN a `SLARule` row is updated and any of `response_hours`,
   `resolution_hours`, or `escalation_hours` has changed, THE Audit_Listener
   SHALL write one `AuditLog` entry per changed hour field with the corresponding
   `action` value: `"SLA_RESPONSE_HOURS_CHANGED"`, `"SLA_RESOLUTION_HOURS_CHANGED"`,
   or `"SLA_ESCALATION_HOURS_CHANGED"`.

2. WHEN a `SLARule` row is updated and `is_active` has changed,
   THE Audit_Listener SHALL write one `AuditLog` entry with `action` set to
   `"SLA_RULE_TOGGLED"`, with `previous_value` and `new_value` reflecting the
   boolean as the string `"true"` or `"false"`.

3. WHEN a `SLARule` row is updated but none of `response_hours`,
   `resolution_hours`, `escalation_hours`, or `is_active` has changed,
   THE Audit_Listener SHALL produce no `AuditLog` entry for that flush.

4. THE Audit_Listener SHALL populate `entity_type` with `"sla_rule"`,
   `entity_id` with the rule UUID, and `entity_label` with a concatenation of
   the rule's `category` and `severity` fields (e.g. `"Road Damage / CRITICAL"`)
   on every `SLARule` audit entry.

---

### Requirement 7: AuditLog Row Integrity

**User Story:** As an admin, I want every automatically-generated audit log
entry to carry a complete, well-formed record, so that the `/admin/audit-logs`
page can render it without gaps or broken rows.

#### Acceptance Criteria

1. THE Audit_Listener SHALL set `reason` to `"Automated system audit"` on every `AuditLog` entry it creates, distinguishing automated entries from manually-written entries which carry operation-specific reason strings.

2. THE Audit_Listener SHALL set `at` to the current UTC timestamp recorded at the moment the listener fires.

3. THE Audit_Listener SHALL assign a newly-generated UUID v4 to each `AuditLog` row's `id` field.

4. IF `entity_label` is `None` or an empty string, THEN THE Audit_Listener SHALL store `None` (SQL NULL) in the `entity_label` field. IF the `entity_label` value exceeds 255 characters, THEN THE Audit_Listener SHALL truncate it to 255 characters before writing.

5. WHEN `previous_value` or `new_value` is `None` (e.g. on an INSERT), THE Audit_Listener SHALL store `None` (SQL NULL) rather than the string `"None"` or an empty string.

6. THE Audit_Listener SHALL write the `AuditLog` row using the SQLAlchemy `Connection` object received from the mapper event, without dispatching the write through the ORM session, so that the insert does not trigger re-entrant flush cycles.

---

### Requirement 8: Bulk Operation Guard

**User Story:** As a platform engineer, I want to suppress automated audit
writes during bulk data imports and seeding scripts, so that pipeline operations
against the 118,000+ complaint dataset do not generate noise entries or degrade
import performance.

#### Acceptance Criteria

1. WHEN the environment variable `DISABLE_AUTO_AUDIT` is set to the exact
   string `"true"` at process startup, THE Audit_Listener SHALL bypass all
   write logic for `after_insert`, `after_update`, and `after_delete` events
   across all Auditable_Models.

2. WHEN `DISABLE_AUTO_AUDIT` is absent, empty, or set to any value other than
   `"true"`, THE Audit_Listener SHALL operate normally and write entries.

3. THE Audit_Listener SHALL evaluate `DISABLE_AUTO_AUDIT` at the time each
   listener callback is invoked (runtime check), not once at import time, so
   that the variable can be set before starting a bulk process without requiring
   an application restart.

4. IF `DISABLE_AUTO_AUDIT` is `"true"` and a listener callback is invoked,
   THEN THE Audit_Listener SHALL return immediately without executing any
   database statements or raising any exceptions.

---

### Requirement 9: Non-Interference with Business Logic

**User Story:** As a platform engineer, I want the audit listener subsystem to
be transparent to all existing routes and services, so that adding audit
instrumentation does not alter business outcomes or introduce regressions.

#### Acceptance Criteria

1. WHEN the Audit_Listener raises an exception during a write attempt, THE Audit_Listener SHALL catch the exception, log it at `WARNING` level via the application logger, and return without re-raising, so that the originating business transaction is not rolled back. IF logging the exception itself raises a secondary exception, THEN THE Audit_Listener SHALL silently suppress that secondary exception and return without re-raising.

2. THE Audit_Listener SHALL NOT modify any instrumented attribute, mapped column field, or relationship collection on the Auditable_Model instance during the event callback execution.

3. THE Audit_Listener SHALL NOT invoke any session-level operations on the SQLAlchemy Session during the event callback, including but not limited to `flush`, `expire`, `refresh`, `add`, and `merge`.

4. THE Audit_Listener SHALL perform all AuditLog writes exclusively using the raw connection object provided by the mapper event, issuing zero additional database round-trips beyond that single write execution.

5. WHEN a transaction that triggered a listener write is subsequently rolled back by the caller, THE Audit_Listener's `AuditLog` write SHALL also be rolled back, such that no `AuditLog` row persists for that transaction after the rollback completes.

6. WHEN the Audit_Listener completes its write, THE Audit_Listener SHALL release no connections to the connection pool and acquire no new connections beyond the single connection already held by the mapper event.
