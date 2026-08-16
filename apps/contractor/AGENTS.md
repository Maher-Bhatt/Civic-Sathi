# AGENTS.md — JANMIND Municipality Portal

Notes for anyone (human or AI agent) working on this repo next.

## Scope

This is the **municipality / officer frontend only** — dashboard, civic map,
complaint management, emerging issues, alerts, departments, analytics.
The public citizen portal is a **separate project** in `../public front end`.

These two apps are **not coupled**. They deploy independently, run on
different dev ports, and use different URL paths. They will share a backend
via `VITE_API_BASE_URL` when wired up.

## Stack

TanStack Start (React 19, SSR) + Tailwind v4 + shadcn/ui primitives, wrapped
in a small custom `glass-*` component layer (`src/components/ui/glass-*`).
Package manager is **Bun** (`bun.lock` is the lockfile of record).

## Dev ports

| App | Folder | Port |
|-----|--------|------|
| Citizen portal | `public front end` | 8080 |
| Municipality portal | `municipality front end` | 8081 |

## The mock API layer

`src/services/api.ts` is the single integration point for the real backend.
Every exported function currently reads/writes `localStorage` with keys
prefixed `janmind_muni_*` (separate from citizen portal storage).

To connect the real backend: replace function bodies in `api.ts` with real
`fetch` calls using `import.meta.env.VITE_API_BASE_URL`. No component should
talk to `localStorage` directly.

Treat `src/services/types.ts` as the working API contract for officer-facing
endpoints. Coordinate with the backend team before changing shapes.

## Auth

`muniLogin` accepts any non-empty email/password — mock auth only.

## Deployment

Deploys to Vercel as a **separate project** from the citizen portal.
`vite.config.ts` pins the Nitro build preset to `"vercel"` — don't remove it.
