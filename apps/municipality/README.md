# Civic Sathi — Municipality Portal (`apps/municipality`)

Operational dashboard and triaging workspace for municipal officers, ward engineers, department heads, and field supervisors in **Civic Sathi** (SIH 2026 Problem Statement PS26129).

- **Production URL**: [https://janmind-municipality.vercel.app](https://janmind-municipality.vercel.app)
- **Framework**: React 19, Vite, TanStack Router, TanStack Query, Recharts, Tailwind CSS v4
- **Shared Package**: `@civicsathi/api-client`

---

## Key Capabilities

### 1. Officer Triaging & Queue Management (`/queue`)
- Real-time complaint filtering by city, ward, department, severity, and status (`received`, `assigned`, `in_progress`, `resolved`, `rejected`).
- AI Triage review panel displaying machine-learned risk scores, citizen descriptions, and AI-suggested actions.
- Departmental routing to relevant authorities (Public Works, Water Works, Sanitation, Electricity, Drainage).

### 2. Systemic Issue Clustering (`/issues`)
- View AI/ML-clustered systemic problem groups derived via sentence embeddings and spatial proximity.
- Merge recurring complaints into single high-impact issues to eliminate repetitive operational tickets.

### 3. Procurement & Tender Lifecycle (`/tenders`)
- Create municipal tenders directly from systemic issues or individual complaints.
- Evaluate multi-vendor competitive bids.
- Award bids to verified contractors to automatically generate binding work orders.

### 4. Work Order Execution & Evidence Review (`/work-orders`)
- Track contractor field execution status (`issued`, `in_progress`, `inspection_pending`, `completed`).
- Review GPS-tagged photographic evidence uploaded by field crews.
- Perform municipal inspection sign-off and approve contractor milestone bills.

### 5. Live Interoperability Transit Stream (`/transit`)
- Real-time Server-Sent Events (SSE) stream displaying cross-system grievance transfers and Sathi Setu handoffs.

---

## Local Development

```bash
# From repository root
npm install

# Run municipality portal in development mode
cd apps/municipality
npm run dev
# Running on http://localhost:8081 (or vite default port)
```

## Environment Configuration

```env
VITE_API_BASE_URL=https://civic-sathi-f7ml.onrender.com
```

## Build and Deployment

```bash
npm run build
```