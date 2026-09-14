# Civic Sathi — Municipal Intelligence & Civic Operations Platform
### Smart India Hackathon (SIH 2026) · Problem Statement PS26129 · Integrated Grievance Redressal System (IGRS)

Civic Sathi is a production-grade, multi-city civic intelligence and operations platform designed to eliminate duplicate grievance processing, deliver real-time NLP classification, automate procurement contracts, and achieve sovereign interoperability across disparate municipal governance systems.

Backed by a high-performance **FastAPI** backend and serverless **Neon PostgreSQL** database with **142,180+ real complaints**, Civic Sathi integrates 4 dedicated web portals with the **Sathi Setu** cross-system interoperability gateway.

---

## 🏛️ Platform Portals & Live URLs

| Portal | Target Audience | Primary Functionality | Framework |
|---|---|---|---|
| **[Public Portal](https://janmind-public.vercel.app)** | Everyday Citizens | Report civic issues, voice input, track live status, community voting, contractor scorecards | TanStack Start (React 19) + Tailwind CSS v4 |
| **[Municipality Portal](https://janmind-municipality.vercel.app)** | Ward Officers & Engineers | AI complaint triage, department routing, issue verification, work order dispatch | TanStack Start (React 19) + Tailwind CSS v4 |
| **[Contractor Portal](https://janmind-contractor.vercel.app)** | Infrastructure Contractors | Discover tenders, submit bids, track awarded work orders, upload field photo proofs | TanStack Start (React 19) + Tailwind CSS v4 |
| **[Admin Portal](https://janmind-admin.vercel.app)** | State Directors & Admins | Cross-city command center telemetry, AI model oversight, SLA management, audit trails | TanStack Start (React 19) + Tailwind CSS v4 |

---

## 📊 Live Production Database Statistics (Neon PostgreSQL)

- **Total Complaints**: **142,180**
  - **Bengaluru (BBMP)**: 100,008 complaints
  - **Vadodara (VMC)**: 20,171 complaints
  - **Mumbai (BMC)**: 11,001 complaints
  - **Delhi (MCD)**: 11,000 complaints
- **Systemic Issue Clusters**: **106** ML-clustered emerging infrastructure risks (Roads, Water, Sanitation, Street Lights, Drainage)
- **Geo-coded Wards**: **48** wards with authentic GPS boundaries & centroid coordinates
- **Registered Contractors**: **17** major Indian construction firms (Tata Projects, L&T, Shapoorji Pallonji, IRB, etc.)
- **Contractor Registrations**: **43** verified municipal licenses
- **Tenders & Bids**: **45** procurement tenders with **108** competitive contractor proposals
- **Work Orders**: **11** active construction contracts with progress monitoring and SLA penalties
- **Tri-Party Reviews**: **102** multi-perspective performance ratings (Citizen, AI Quality Audit, Municipal Engineer)
- **Audit Logs**: **385** immutable platform audit events

---

## 🏗️ Repository Layout

- `apps/`: 4 React 19 web applications using TanStack Start, Nitro SSR, and authentic Indian civic neo-glassmorphism.
  - `apps/public/`: Citizen engagement & reporting portal
  - `apps/municipality/`: Municipal officer dashboard & operations
  - `apps/contractor/`: Vendor bidding & work order management
  - `apps/admin/`: Super-admin cross-city command center & AI oversight
- `backend/`: High-performance FastAPI REST API, Alembic migrations, NLP triage pipeline, and bulk seeders.
- `packages/`: Shared TypeScript libraries (`packages/api-client` canonical SDK).
- `sathi-setu/`: Standalone SIH26129 interoperability gateway with canonical identity matching and consent gates.
- `docs/`: In-depth developer handoffs, feature documentation, and operational guides:
  - [`CIVIC_SATHI_COMPLETE_DEVELOPER_HANDOFF.md`](CIVIC_SATHI_COMPLETE_DEVELOPER_HANDOFF.md): Master technical bible & handoff guide
  - [`PLATFORM_FEATURES.md`](PLATFORM_FEATURES.md): Comprehensive feature-by-feature breakdown across all 4 portals
  - [`PROJECT_STRUCTURE_SUMMARY.md`](PROJECT_STRUCTURE_SUMMARY.md): Monorepo layout and workspace configuration
  - [`backend/README.md`](backend/README.md): Backend API, ML pipeline, and database seeding guide

---

## ⚡ Quick Start & Development

### Frontend Setup

Install workspace dependencies and start all portals simultaneously:

```bash
# Install root dependencies
npm install

# Start development servers across all 4 portals
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head

# Seed complete production & SIH demo data
python seed_master.py
python seed_sih_demo.py
python seed_city_complaints.py

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

---

## 🎨 Cultural & Civic Visual System

Civic Sathi incorporates an **authentic Indian Civic & Cultural Design System**:
- **Indian Jewel Palette**: Royal Indian Saffron (`#FF6F00`), Ashoka Emerald Green (`#0E8A4B`), 24-Spoke Chakra Navy (`#0A369D`), Haldi Gold (`#F59E0B`), and Sandalwood Pearl Ivory (`#FAF6F0`).
- **Specular Liquid Glass**: 90% opacity multi-layered glass cards with saffron refraction borders and ambient specular glows.
- **City Atmosphere Layers**: Full-bleed architectural photography representing Indian cultural identity (Rashtrapati Bhavan, Vidhana Soudha, Lakshmi Vilas Palace, BMC Heritage Building).
- **Resilient Zero-Downtime Updates**: Automatic browser reload handling on deployment chunk invalidation.

---

## 📄 License

MIT License · Built for Smart India Hackathon 2026
