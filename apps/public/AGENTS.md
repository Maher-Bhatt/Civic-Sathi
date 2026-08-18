# AGENTS.md — CivicSathi Citizen Portal

Notes for anyone (human or AI agent) working on this repo next.

## Scope

This is the **public citizen portal only** — report a problem, track it, see
nearby civic activity. The municipality/officer dashboard is a **separate
project** in `../municipality front end` with its own URLs, dev port, and
Vercel deployment. The two apps share a backend via `VITE_API_BASE_URL` when
wired up, but have no code coupling.

## Dev ports

| App | Folder | Port |
|-----|--------|------|
| Citizen portal | `public front end` | 8080 |
| Municipality portal | `municipality front end` | 8081 |

## Stack

TanStack Start (React 19, SSR) + Tailwind v4 + shadcn/ui primitives, wrapped
in a small custom `glass-*` component layer (`src/components/ui/glass-*`) for
this app's frosted-glass visual identity. Package manager is **Bun**
(`bun.lock` is the lockfile of record — use `bun install`, not `npm install`).

## The mock API layer — read this before wiring up a real backend

`src/services/api.ts` is the single integration point for the real backend.
Every exported function (`analyzeComplaint`, `createComplaint`,
`analyzeComplaintPhoto`, `loginUser`, etc.) currently reads/writes
`localStorage` and returns fabricated data with an artificial delay. No
component talks to `localStorage` directly — they only call these functions.

To connect the real backend: replace the bodies in `api.ts` with real
`fetch` calls (an `API_BASE_URL` env-var switch is already stubbed in), and
no other file needs to change. Treat the current function signatures and
return types (`src/services/types.ts`) as the working API contract to build
the real backend against — flag it with whoever owns the frontend before
changing a shape, since components rely on it exactly as typed.

Two things are currently fully simulated and should not be presented as
real: category/severity detection is keyword matching (`CATEGORY_KEYWORDS`,
`SEVERITY_KEYWORDS` in `services/mockData.ts`), and photo analysis
(`analyzeComplaintPhoto`) keys off the **filename string**, not the image
content — it does not look at pixels. Both need a real model behind them.

## Auth

`services/api.ts`'s `loginUser` accepts any non-empty email/password — there
is no real authentication yet. Don't treat the current login flow as secure.

## Deployment

Deploys to Vercel. `vite.config.ts` pins the Nitro build preset to
`"vercel"` explicitly — don't remove that when editing the config, or a
zero-config build could pick the wrong server output target.
