# Implementation Plan

## Overview

This task list follows the exploratory bugfix workflow:
1. **Explore** — write a bug-condition test *before* the fix to confirm each defect exists
2. **Preserve** — write preservation tests that must pass on *unfixed* code
3. **Implement** — apply all 20 fixes guided by the exploration findings
4. **Verify** — confirm the audit system works end-to-end
5. **Document** — update AGENTS.md

---

- [ ] 1. Write bug condition exploration tests (BEFORE any fix)
  - **Property 1: Bug Condition** - 20-Bug Code Defect Suite
  - **CRITICAL**: Write and run these tests BEFORE making any code changes — failures confirm the bugs exist
  - **DO NOT attempt to fix the code when tests fail**
  - **GOAL**: Surface concrete counterexamples that demonstrate each defect
  - **Scoped PBT Approach**: For deterministic bugs, scope each property to the known failing input to ensure reproducibility
  - Backend defects to probe (isBugCondition pseudocode):
    - `complaints.py`: duplicate UUID import causes `ImportError` on module load → test: attempt to import the module
    - `complaints.py upvote_complaint`: `Session`/`HTTPException` imported inline per call → test: call upvote with valid complaint id, assert no `ImportError`
    - `auth.py` demo-login: `contractor.contact_email` AttributeError because field is `email` → test: POST `/auth/demo-login` with `role=contractor`, assert 200 not 500
    - `auth.py` demo-login: missing `db.refresh(user)` in contractor else-branch → test: contractor demo-login returns stale/incomplete user object
    - `auth.py`: `SECRET_KEY`/`ALGORITHM` re-imported inside function bodies → test: measure import cost / assert constants are module-level
    - `procurement.py submit_contractor_rating`: average calculated before `db.flush()` → test: submit rating, assert returned average equals DB average
    - `reputation.py`: double-filter chain gives wrong resolved count → test: seed complaints and compare `.count()` result to expected
    - `triage.py reject_duplicate`: no orphan guard when `complaint is None` → test: call with non-existent complaint id, assert 404 not 500
    - `analytics.py state-command-center`: missing `ImportError` guard → test: import the route module, assert no `ImportError` even when optional deps absent
    - `analytics.py predict-systemic-risk`: same `ImportError` guard missing → same approach
    - `main.py`: `setup_auditing()` called before `app` creation → test: import `main.py`, assert no `NameError`
    - `security.py get_current_user`: UUID column compared to raw string → test: authenticate with valid UUID token, assert no `DataError`
    - `security.py get_current_officer_user`: same UUID-vs-string comparison → same approach
    - `audit-logs.tsx`: `entityId.substring(0, 8)` throws when `entityId` is `undefined` → test: render component with a log entry where `entityId` is `undefined`, assert no crash
    - `work-orders-overview.tsx`: `WO_STATUS_COLORS["ACCEPTED"]` is `undefined` → test: render with work order in ACCEPTED state, assert no missing-color crash
    - `work-orders-overview.tsx`: `wo.cityId` rendered as raw UUID → test: render, assert display is human-readable
    - `dashboard.tsx`: `monthly_trend` null access crash → test: render with API response missing `monthly_trend`, assert no crash
    - `sla.tsx`: SLA toggle has no optimistic local state → test: click toggle, assert UI updates immediately before API resolves
    - `public/api.ts getComplaint`: `normalizeComplaint` null check missing → test: call with id that returns null from API, assert no `TypeError`
    - `contractor/profile.tsx`: "Verified Contractor" badge always shown → test: render with `is_verified=false`, assert badge is hidden
  - Run each test on **unfixed** code; each **SHOULD FAIL** confirming the bug exists
  - Document the counterexample for each failure
  - Mark task complete when all tests are written, run, and failures are documented
  - _Requirements: 1.1, 2.1, 3.1, 9.1_

- [ ] 2. Write preservation property tests (BEFORE implementing fixes)
  - **Property 2: Preservation** - Audit Listener Core Behaviour
  - **IMPORTANT**: Follow observation-first methodology — observe unfixed code for non-buggy paths first
  - **Scoped to non-bug-condition inputs**: these are all paths where `isBugCondition` is `false`
  - Observe and assert the following on **unfixed** code:
    - `audit_context.py`: `get_audit_actor()` returns `None` when no actor is set (baseline)
    - `audit_context.py`: `set_audit_actor()` / `get_audit_actor()` round-trip preserves all three fields (`actor_id`, `actor_name`, `actor_role`)
    - `audit_context.py`: `ContextVar` is isolated across two asyncio tasks running concurrently (actor set in task A not visible in task B)
    - `audit_listeners.py setup_auditing()`: calling twice does **not** double-register listeners (idempotency — Property 6 in design)
    - `audit_listeners.py`: `DISABLE_AUTO_AUDIT=true` causes listener callbacks to return immediately without executing SQL (Property 7 in design)
    - `audit_listeners.py`: after `setup_auditing()`, a Complaint status change writes exactly one `AuditLog` row with correct fields (Property 3 in design)
    - `audit_listeners.py`: listener exception is swallowed; business transaction still commits (Property 5 in design)
    - `admin.py GET /admin/audit-logs`: returns 200 with a list; `actor_role` filter returns only matching rows
    - `shared-store.ts getAuditLogs()`: snake_case → camelCase normalization is correct for all AuditLogOut fields
  - Write property-based tests where input space is large (e.g., any valid JWT payload → actor fields round-trip)
  - Run all tests on **unfixed** code — all **SHOULD PASS** confirming preserved baseline
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.3, 2.4, 8.1, 8.3, 9.1_

- [ ] 3. Apply all 20 bug fixes

  - [ ] 3.1 Fix `backend/app/api/v1/routes/complaints.py` — duplicate import & inline imports
    - Remove the duplicate `import uuid` statement (keep the one at the top of the file)
    - Move `Session` and `HTTPException` imports in `upvote_complaint` to the module-level import block
    - _Bug_Condition: module import fails / per-call import overhead_
    - _Expected_Behavior: module loads cleanly; imports are resolved once at startup_
    - _Preservation: all existing complaint endpoints continue to function correctly_
    - _Requirements: 9.1, 9.2_

  - [ ] 3.2 Fix `backend/app/api/v1/routes/auth.py` — wrong Contractor field names in demo-login
    - Replace `contractor.contact_email` with `contractor.email`
    - Replace `contractor.contact_phone` with `contractor.phone`
    - _Bug_Condition: `POST /auth/demo-login` with `role=contractor` raises `AttributeError` 500_
    - _Expected_Behavior: demo-login returns a valid JWT and contractor profile with correct fields_
    - _Preservation: officer and admin demo-login paths are unchanged_
    - _Requirements: 9.1_

  - [ ] 3.3 Fix `backend/app/api/v1/routes/auth.py` — missing `db.refresh(user)` in contractor else-branch
    - Add `db.refresh(user)` after the `else` branch in contractor demo-login to ensure the returned user object reflects the persisted state
    - _Bug_Condition: contractor else-branch returns stale user without DB-assigned defaults_
    - _Expected_Behavior: contractor user object is fully populated from DB after creation_
    - _Preservation: the happy-path (existing contractor found) is unchanged_
    - _Requirements: 9.1_

  - [ ] 3.4 Fix `backend/app/api/v1/routes/auth.py` — `SECRET_KEY`/`ALGORITHM` imported inside function bodies
    - Move `SECRET_KEY` and `ALGORITHM` imports/references to module-level constants
    - _Bug_Condition: constants re-imported on every request, wasting CPU cycles_
    - _Expected_Behavior: constants resolved once at module load_
    - _Preservation: JWT signing/verification behaviour is identical_
    - _Requirements: 9.1_

  - [ ] 3.5 Fix `backend/app/api/v1/routes/procurement.py` — rating average calculated before `db.flush()`
    - Call `db.flush()` before calculating the average contractor rating in `submit_contractor_rating`
    - _Bug_Condition: isBugCondition: the new rating row is not yet visible to the aggregate query_
    - _Expected_Behavior: expectedBehavior: returned average includes the just-submitted rating_
    - _Preservation: all other procurement endpoints and rating logic are unchanged_
    - _Requirements: 9.1, 9.2_

  - [ ] 3.6 Fix `backend/app/api/v1/routes/reputation.py` — double-filter gives wrong resolved count
    - Replace the chained double-filter with a single correct filter expression for resolved complaint count
    - _Bug_Condition: `.filter(...).filter(...)` silently drops rows, returning a count lower than actual_
    - _Expected_Behavior: resolved count matches the true number of resolved complaints for the officer_
    - _Preservation: other reputation metrics (average rating, pending count) are unchanged_
    - _Requirements: 9.1_

  - [ ] 3.7 Fix `backend/app/api/v1/routes/triage.py` — missing orphan guard in `reject_duplicate`
    - Add a `None` check for `complaint` at the start of `reject_duplicate` and raise `HTTPException(404)` if absent
    - _Bug_Condition: isBugCondition(input): `complaint_id` does not exist in DB; `complaint is None`_
    - _Expected_Behavior: expectedBehavior: returns 404 Not Found with descriptive message_
    - _Preservation: valid complaint rejection flow is unchanged_
    - _Requirements: 9.1_

  - [ ] 3.8 Fix `backend/app/api/v1/routes/analytics.py` — missing `ImportError` guards
    - Wrap optional heavy dependencies in `state-command-center` and `predict-systemic-risk` endpoints with `try/except ImportError`
    - Return a 503 with a descriptive message when the optional dependency is unavailable
    - _Bug_Condition: route module fails to import when optional ML/analytics deps are absent_
    - _Expected_Behavior: routes load cleanly; unavailable endpoints return 503 instead of crashing_
    - _Preservation: all other analytics endpoints are unaffected_
    - _Requirements: 9.1_

  - [ ] 3.9 Fix `backend/app/main.py` — `setup_auditing()` called before `app` creation
    - Ensure `setup_auditing()` is invoked inside the `lifespan` async context manager, after `app` is created
    - _Bug_Condition: `NameError` or premature execution because `app` does not exist when the call runs_
    - _Expected_Behavior: `setup_auditing()` runs during lifespan startup, after `app` is fully initialised_
    - _Preservation: all other lifespan startup steps (middleware, routers) are unchanged_
    - _Requirements: 2.1, 2.5_

  - [ ] 3.10 Fix `backend/app/core/security.py` — UUID column compared to string
    - In `get_current_user` and `get_current_officer_user`, cast the JWT `sub` claim to `uuid.UUID` before filtering on the UUID primary-key column
    - _Bug_Condition: isBugCondition: `sub` is a raw string; DB raises `DataError` on UUID column comparison_
    - _Expected_Behavior: filter uses a `uuid.UUID` instance; no type mismatch_
    - _Preservation: authentication flow for all roles is unchanged_
    - _Requirements: 1.1, 9.1_

  - [ ] 3.11 Fix `apps/admin/src/routes/admin/audit-logs.tsx` — `entityId.substring` crash
    - Guard the `entityId.substring(0, 8)` call: use `(log.entityId ?? "").substring(0, 8)` or equivalent null-safe expression
    - _Bug_Condition: isBugCondition: `log.entityId` is `undefined`; `.substring` throws `TypeError`_
    - _Expected_Behavior: renders an empty string or `"—"` when `entityId` is absent_
    - _Preservation: all rows with a defined `entityId` continue to display the truncated prefix_
    - _Requirements: 7.3, 7.4_

  - [ ] 3.12 Fix `apps/admin/src/routes/admin/work-orders-overview.tsx` — missing status colours
    - Add `ACCEPTED` and `ISSUED` entries to `WO_STATUS_COLORS`
    - Replace the raw `wo.cityId` UUID display with a human-readable city name lookup or formatted label
    - _Bug_Condition: work orders with `ACCEPTED`/`ISSUED` status render with `undefined` colour class_
    - _Expected_Behavior: all work order status values map to a defined colour; cityId shows a label_
    - _Preservation: existing status colours for other states are unchanged_
    - _Requirements: 4.1_

  - [ ] 3.13 Fix `apps/admin/src/routes/admin/dashboard.tsx` — null-safety on trend/load/health fields
    - Add null-safe access (`?.`) on `monthly_trend`, `department_load`, and `subsystem_health` fields from the API response
    - Use fallback empty arrays / zero values so the dashboard renders without crashing on a partial response
    - _Bug_Condition: API returns response without one of these fields; component throws `TypeError`_
    - _Expected_Behavior: dashboard renders gracefully with empty/zero placeholders for missing fields_
    - _Preservation: all dashboard widgets that receive complete data are unaffected_
    - _Requirements: 9.1_

  - [ ] 3.14 Fix `apps/admin/src/routes/admin/sla.tsx` — SLA toggle visual flicker
    - Add optimistic local state update in the SLA toggle handler: update the local `rules` state immediately before the API call resolves, then reconcile with the server response on completion
    - _Bug_Condition: UI reverts to old toggle state during API round-trip, causing visible flicker_
    - _Expected_Behavior: toggle appears to change instantly; reverts only on API error_
    - _Preservation: API call and error handling logic are unchanged_
    - _Requirements: 6.2_

  - [ ] 3.15 Fix `apps/admin/src/services/public/api.ts` — null checks on `normalizeComplaint`
    - Add null/undefined guards on the return value of `normalizeComplaint` in both `getComplaint` and `createComplaint`
    - Return `null` or throw a typed error rather than propagating `undefined` to callers
    - _Bug_Condition: `normalizeComplaint` returns `null`; caller crashes on `.status` access_
    - _Expected_Behavior: callers receive `null` or a typed error; no unhandled `TypeError`_
    - _Preservation: the happy-path normalization flow is unchanged_
    - _Requirements: 9.1_

  - [ ] 3.16 Fix `apps/contractor/src/routes/profile.tsx` — hardcoded "Verified Contractor" badge
    - Conditionally render the "Verified Contractor" badge based on `contractor.is_verified === true`
    - _Bug_Condition: badge always rendered regardless of actual verification status_
    - _Expected_Behavior: badge visible only when `is_verified` is `true`_
    - _Preservation: all other profile fields and layout are unchanged_
    - _Requirements: 9.1_

  - [ ] 3.17 Fix `backend/app/api/v1/routes/complaints.py list_complaints` — wrong admin role check
    - Replace the raw `role` string comparison in `list_complaints` with a call to `is_super_admin_user()`
    - _Bug_Condition: raw role string check may miss admin variants, returning filtered instead of full list_
    - _Expected_Behavior: super-admin users receive the unfiltered complaint list_
    - _Preservation: officer and citizen scoped views are unchanged_
    - _Requirements: 3.1, 9.1_

  - [ ] 3.18 Verify bug condition exploration test (Property 1) now passes
    - **Property 1: Expected Behavior** - 20-Bug Code Defect Suite
    - **IMPORTANT**: Re-run the **same** tests written in task 1 — do NOT write new tests
    - Run all backend pytest exploration tests and all frontend component tests from task 1
    - **EXPECTED OUTCOME**: Every test that previously FAILED now **PASSES** (confirms all 20 bugs are fixed)
    - If any test still fails, return to the relevant fix sub-task (3.1–3.17)
    - _Requirements: Expected Behavior Properties from design_

  - [ ] 3.19 Verify preservation tests still pass
    - **Property 2: Preservation** - Audit Listener Core Behaviour
    - **IMPORTANT**: Re-run the **same** tests written in task 2 — do NOT write new tests
    - Run the full preservation test suite from task 2
    - **EXPECTED OUTCOME**: All preservation tests still **PASS** (confirms no regressions)
    - Confirm `audit_context`, `audit_listeners`, `admin.py` endpoints, and `getAuditLogs()` normalization all behave as observed before the fixes
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.3, 2.4, 8.1, 8.3, 9.1_

- [ ] 4. Verification — confirm end-to-end audit system

  - [ ] 4.1 Run pytest and confirm audit listener tests pass
    - Run `pytest backend/tests/ -v -k "audit"` (or full suite if no dedicated audit tests exist)
    - Confirm all tests related to `audit_context`, `audit_listeners`, and `/admin/audit-logs` pass
    - If no audit tests exist, write minimal integration tests covering: listener registration, complaint status change produces one AuditLog row, system identity fallback, bulk guard
    - _Requirements: 2.1, 2.3, 3.1, 8.1, 9.1_

  - [ ] 4.2 Confirm audit-logs page shows real entries after a complaint status change
    - Start the backend and admin frontend
    - Authenticate as a super-admin user
    - Trigger a complaint status change via the admin portal (or directly via the API)
    - Navigate to `/admin/audit-logs`
    - Confirm a `COMPLAINT_STATUS_CHANGED` entry appears within 30 seconds (next poll cycle)
    - Confirm `actor_id`, `actor_name`, `previous_value`, `new_value` are populated correctly
    - _Requirements: 1.1, 3.1, 7.1, 7.2, 7.3_

  - [ ] 4.3 Confirm `DISABLE_AUTO_AUDIT=true` suppresses all writes
    - Start the backend with `DISABLE_AUTO_AUDIT=true` in the environment
    - Trigger a complaint status change, a work order status change, and an SLA rule toggle
    - Query `platform_audit_logs` directly — confirm zero new rows were inserted
    - Restart without the variable; trigger the same changes; confirm rows appear this time
    - _Requirements: 2.4, 8.1, 8.2, 8.3, 8.4_

- [ ] 5. Update backend AGENTS.md to document the audit listener subsystem
  - Open `backend/AGENTS.md` (create it if it does not exist)
  - Add a section titled `## Audit Listener Subsystem` covering:
    - Purpose: automatic structured audit trail for Complaint, WorkOrder, Tender, SLARule changes
    - Key files: `core/audit_context.py`, `core/audit_listeners.py`
    - How it integrates: `setup_auditing()` called from FastAPI lifespan; `audit_actor_middleware` sets ContextVar from JWT
    - Bulk-import guidance: set `DISABLE_AUTO_AUDIT=true` to suppress writes during seeding
    - Extension guide: to track a new model field, add an entry to `_FIELD_MAP` in `audit_listeners.py`
  - _Requirements: 2.1, 2.2_

- [ ] 6. Checkpoint — ensure all tests pass
  - Run the full backend test suite: `pytest backend/tests/ -v`
  - Run the frontend type-check: `tsc --noEmit` in `apps/admin` and `apps/contractor`
  - Confirm zero new TypeScript errors introduced by the fixes
  - Confirm all property tests (tasks 1 and 2) pass
  - Ensure all verification steps (tasks 4.1–4.3) have been completed
  - Ask the user if any questions arise before closing the spec
