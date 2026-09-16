# Civic Sathi — Contractor Portal (`apps/contractor`)

Execution portal for registered infrastructure vendors and civic maintenance contractors in **Civic Sathi** (SIH 2026 Problem Statement PS26129).

- **Production URL**: [https://janmind-contractor.vercel.app](https://janmind-contractor.vercel.app)
- **Framework**: React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS v4
- **Shared Package**: `@civicsathi/api-client`

---

## Key Capabilities

### 1. Municipal Tender Discovery & Bidding (`/tenders`)
- Discover active published tenders in registered cities (Vadodara, Mumbai, Bengaluru, Delhi).
- Submit competitive commercial quotes, technical methodologies, and estimated completion timelines.

### 2. Work Order Execution (`/work-orders`)
- View awarded work contracts with clear SLA deadlines, budget caps, and assigned departmental oversight.
- Update execution milestones from `issued` to `in_progress` and submit for municipal inspection.

### 3. GPS-Tagged Field Evidence Upload
- Upload before-and-after photo evidence directly from job sites.
- Captures automated GPS coordinates and timestamps to guarantee evidence authenticity.

### 4. Billing & Milestone Invoicing (`/billing`)
- Submit milestone invoices against verified work orders.
- Track municipal department-head approval status and payment release history.

### 5. Tri-Party Performance Scorecards (`/ratings`)
- Review comprehensive performance ratings synthesized from three authoritative sources:
  - **Citizen Ratings**: Verified community feedback post-resolution.
  - **AI Compliance Audits**: SLA punctuality and photographic evidence verification.
  - **Municipal Officer Inspections**: Engineering standards and on-site quality approvals.

---

## Local Development

```bash
# From repository root
npm install

# Run contractor portal in development mode
cd apps/contractor
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