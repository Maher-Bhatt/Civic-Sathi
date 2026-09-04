# Civic Sathi

Civic Sathi is a municipal intelligence and civic operations platform with
citizen, municipality, contractor, and administrator portals backed by a
FastAPI service.

## Repository layout

- `apps/`: React portals for each user role.
- `backend/`: FastAPI service, Alembic migrations, and backend tests.
- `packages/`: shared TypeScript packages.
- `docs/operations/`: maintained operational documentation.

## Development

Install frontend dependencies from the repository root:

```bash
npm install
```

Backend setup, migrations, and test instructions live in
[`backend/README.md`](backend/README.md). The deployment sequence and explicit
data-repair commands are documented in
[`docs/operations/backend-operations.md`](docs/operations/backend-operations.md).
