# Civic Sathi — Complete Developer Handoff

Welcome to the **Civic Sathi** platform, an advanced Smart Governance and Civic Grievance Intelligence system. This document serves as the complete technical handoff, detailing the architecture, the functionalities of the four web portals, backend integration, and all the required credentials for testing and demoing the application across its four supported cities (Bengaluru, Vadodara, Mumbai, and Delhi).

---

## 1. System Architecture & Backend Connectivity

Civic Sathi is built using a modern decoupled architecture:

### Frontend Layer (React + TanStack Router + Tailwind CSS)
The frontend is a monorepo structure containing four distinct React Single-Page Applications (SPAs) built with Vite.
- **apps/public:** Citizen-facing portal.
- **apps/municipality:** Civic officer and departmental view.
- **apps/contractor:** Third-party field worker portal.
- **apps/admin:** Super-administrator system management.
- **packages/api-client:** A shared TypeScript Axios client that handles all network requests, JWT injection, and standardizes backend responses across all four apps.

### Backend Layer (FastAPI + Python)
The backend is a high-performance Python FastAPI service.
- **Language/Framework:** Python 3.12+ with FastAPI.
- **Database:** PostgreSQL (with SQLite fallback for local dev) using SQLAlchemy ORM and Alembic for migrations.
- **Authentication:** JWT-based stateless authentication. Passwords use Bcrypt hashing.
- **Machine Learning Integrations:** Integrated NLP for automated category triage, sentiment analysis, and severity prediction using `spaCy` and HuggingFace models.
- **Sathi Setu Interoperability:** A specialized module for cross-platform data exchange (e.g., interoperability with other state grievance systems like Maharashtra State Grievance Service).

### How the Frontend connects to the Backend
All four frontend portals utilize the shared `@civicsathi/api-client` package. 
- API calls are routed to `VITE_API_URL` (usually `http://localhost:8000/api` locally).
- When a user logs in via any portal, the backend issues an `access_token`. 
- This token is saved in `localStorage` and automatically injected into the `Authorization: Bearer <token>` header for all subsequent API requests by the Axios interceptor in the API client package.
- Role checks are enforced securely on the backend. A citizen token cannot access municipality routes, and a municipality token cannot access admin routes.

---

## 2. Portal Details & Functionalities

### 2.1 Public Portal (Citizen App)
**Target Audience:** General public, residents.
**Key Features:**
- **Civic Map & Reporting:** Users can view live maps of city complaints, click on the map, and file new reports with photo evidence.
- **City Hub:** Provides one-tap dialing for Emergency Services (Police, Fire, Ambulance) and live Civic Announcements.
- **Social Sharing:** Complaints generate unique links that can be shared via native device share integrations (WhatsApp, Twitter) to gather community upvotes.
- **Gamification & Profile:** Citizens earn badges (e.g., "Civic Hero") based on the number of validated reports they submit.

### 2.2 Municipality Portal (Civic Officer App)
**Target Audience:** Ward officers, department supervisors, and city administrators.
**Key Features:**
- **Command Center Dashboard:** Real-time metrics on open vs. closed complaints, departmental load, and SLA performance.
- **Predictive Analytics:** AI-driven SLA breach forecasts and a Resource Allocation Heatmap to proactively deploy crews (e.g., identifying pothole spikes before a monsoon).
- **Citizen Sentiment Analysis:** Live NLP analysis of citizen feedback and satisfaction metrics.
- **Tender & Work Order Generation:** Officers can bundle clustered complaints into Tenders, assign them to Contractors, and track execution.

### 2.3 Contractor Portal (Field Worker App)
**Target Audience:** Third-party vendors and construction crews hired by the municipality.
**Key Features:**
- **Work Order Execution:** A kanban-style dashboard to view assigned work orders.
- **Geo-Verified Check-in:** (Advanced Feature) Field workers are forced to click "Check-in at Site" which uses HTML5 `navigator.geolocation` to ensure they are physically at the repair site before they can upload execution evidence.
- **Material Logging:** Input fields to log the quantity of materials used (e.g., "2 tons of asphalt") for budget justification.
- **Progress Tracking:** Multi-stage photo uploads (Before, Start, During, Completion).

### 2.4 Admin Portal (Super-Admin System)
**Target Audience:** Platform owners and top-level state officials.
**Key Features:**
- **Master Data Management (MDM):** Ability to define global categories, SLAs, and onboard new cities.
- **Interoperability (Open Data):** "Export Open Data" generates RFC-compliant CSVs of system metrics. "API Key Management" allows admins to generate masked keys for third-party integrations (Sathi Setu).
- **AI Oversight:** Tools to monitor the accuracy of the automated NLP triage system.
- **Advanced Audit Logs:** Immutable system logs tracking every action by every user. Now features strict Date Range filtering for security investigations.

---

## 3. Login Credentials (Complete Data)

The backend has been seeded with rich mock data for four major Indian cities: **Bengaluru**, **Vadodara**, **Mumbai**, and **Delhi**. 
Use the following credentials to log into the respective portals.

### Super Admin Credentials (Admin Portal)
**URL:** `http://localhost:5176` (or respective port)
| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Maher Bhatt | `maherbhatt01@gmail.com` | `MHB@2007` |

### Municipality Credentials (Municipality Portal)
**URL:** `http://localhost:5174` (or respective port)
**Universal Password for all Officers:** `CivicSathi@2026`

| City | Department | Role | Name | Email |
| :--- | :--- | :--- | :--- | :--- |
| **Bengaluru** | Roads | Officer | Priya Sharma | `priya.sharma@bbmp.gov.in` |
| **Bengaluru** | Electricity | Officer | Rajan Nair | `rajan.nair@bbmp.gov.in` |
| **Bengaluru** | Sanitation | Supervisor | Kavya Reddy | `kavya.reddy@bbmp.gov.in` |
| **Bengaluru** | Health | Municipality | Arjun Menon | `arjun.menon@bbmp.gov.in` |
| **Vadodara** | Roads | Officer | Dhruv Patel | `dhruv.patel@vmc.gov.in` |
| **Vadodara** | Sanitation | Supervisor | Sneha Desai | `sneha.desai@vmc.gov.in` |
| **Vadodara** | Electricity | Municipality | Mihir Shah | `mihir.shah@vmc.gov.in` |
| **Mumbai** | Roads | Officer | Raj Thackeray | `raj.thackeray@bmc.gov.in` |
| **Mumbai** | Sanitation | Officer | Sunita Pawar | `sunita.pawar@bmc.gov.in` |
| **Mumbai** | Water Supply | Municipality | Vikram Deshmukh | `vikram.deshmukh@bmc.gov.in` |
| **Mumbai** | Health | Supervisor | Anita Joshi | `anita.joshi@bmc.gov.in` |
| **Delhi** | Roads | Officer | Amit Sharma | `amit.sharma@mcd.gov.in` |
| **Delhi** | Sanitation | Officer | Neha Gupta | `neha.gupta@mcd.gov.in` |
| **Delhi** | Electricity | Municipality | Rajesh Kumar | `rajesh.kumar@mcd.gov.in` |
| **Delhi** | Health | Supervisor | Priyanka Singh | `priyanka.singh@mcd.gov.in` |

### Contractor Credentials (Contractor Portal)
**URL:** `http://localhost:5175` (or respective port)
**Universal Password for all Contractors:** `CONTRACTOR@2026`
Note: Contractors operate across zones and cities based on tender awards.

| Company Name | Contact Person | Login Email |
| :--- | :--- | :--- |
| BuildRight Infrastructure | Ramesh Kumar | `buildright.login@contractor.com` |
| CivicTech Solutions | Preethi Iyer | `civictech.login@contractor.com` |
| Greenway Constructions | Suresh Patel | `greenway.login@contractor.com` |
| Pioneer Public Works | Anil Verma | `pioneer.login@contractor.com` |
| Urban Infra Ltd | Nalini Reddy | `urbaninfra.login@contractor.com` |

### Citizen Credentials (Public Portal)
**URL:** `http://localhost:5173` (or respective port)
Citizens register their own accounts. You can easily create a new account by clicking "Sign Up" on the Public Portal login page, or use an existing test account if generated during your session.

---

## 4. Developer Commands & Scripts

Run these commands from the repository root to start and test the system.

### Install & Start Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python scripts/repair_data.py --city-separation
python seed_master.py
uvicorn app.main:app --reload
```

### Install & Start Frontend Portals
The frontend uses npm workspaces (or bun).
```bash
npm install
# To run all apps concurrently:
npm run dev
```

### Final Note on UI Aesthetics
The system uses an advanced CSS Glassmorphism aesthetic. We have explicitly calibrated the `--glass` and `--surface` backdrop filters to 85% opacity (`apps/*/src/styles.css`). This maintains the frosted heritage visuals while strictly conforming to WCAG 2.2 AA text contrast readability standards over complex imagery. Do not reduce these variables below 70% without UX consultation.

**End of Document.**
