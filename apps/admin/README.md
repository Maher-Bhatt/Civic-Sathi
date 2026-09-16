# Civic Sathi — Admin Command Center (`apps/admin`)

State-level command center and system administration portal for **Civic Sathi** (SIH 2026 Problem Statement PS26129).

- **Production URL**: [https://janmind-admin.vercel.app](https://janmind-admin.vercel.app)
- **Framework**: React 19, Vite, TanStack Router, TanStack Query, Recharts, Tailwind CSS v4
- **Shared Package**: `@civicsathi/api-client`
- **Authorized Role**: `admin` / Super-Administrator

---

## Key Capabilities

### 1. Cross-City Telemetry & Overview (`/admin`)
- Real-time aggregated metrics across all supported municipal corporations: Vadodara (VMC), Mumbai (BMC), Bengaluru (BBMP), and Delhi (MCD).
- Total complaints volume, open vs resolved rates, active SLA health, and systemic issue density.

### 2. Sathi Setu Interoperability Catalogue (`/admin/interoperability`)
- Master-Data Management (MDM) exceptions and canonical case exchange directory.
- Connected municipal system status, ping latency, and live cross-system handoff simulations.
- DEPA (Data Empowerment and Protection Architecture) consent registry tracking citizen data exchange permissions.

### 3. Service Level Agreement (SLA) & Liquidated Damages (`/admin/sla`)
- Auto-calculated SLA breach tracking across municipal departments and active work orders.
- Penalty calculation and liquidated damages assessments.

### 4. Contractor Ecosystem Health (`/admin/contractors`)
- Contractor licensing and city registration approval management.
- Suspended contractor registers and ecosystem-wide performance benchmarking.

### 5. Immutable Audit Logs (`/admin/audit`)
- Real-time tamper-evident compliance trails capturing every administrative change, status update, and tender award.

---

## Local Development

```bash
# From repository root
npm install

# Run admin portal in development mode
cd apps/admin
npm run dev
```

## Environment Configuration

```env
VITE_API_BASE_URL=https://civic-sathi-f7ml.onrender.com
```

## Build and Deployment

```bash
npm run build
```