# Civic Sathi — Public Citizen Portal (`apps/public`)

Production citizen-facing web application for the **Civic Sathi** Integrated Grievance Redressal Platform (SIH 2026 Problem Statement PS26129).

- **Production URL**: [https://janmind-public.vercel.app](https://janmind-public.vercel.app)
- **Framework**: React 19, Vite, TanStack Router, TanStack Query, Tailwind CSS v4
- **Shared Package**: `@civicsathi/api-client`

---

## Key Features

### 1. Multi-Step Guided Reporting
- **Step 0 — Description & Voice Input**: Multilingual speech-to-text recognition supporting English (`en-IN`), Hindi (`hi-IN`), Gujarati (`gu-IN`), Marathi (`mr-IN`), and Kannada (`kn-IN`).
- **Step 1 — Geo-fenced Location Picker**: Interactive Leaflet map with GPS detection. Enforces municipal boundaries via Haversine distance checks:
  - **Vadodara**: 25 km radius
  - **Mumbai**: 40 km radius
  - **Bengaluru**: 30 km radius
  - **Delhi**: 35 km radius
  - Rejects GPS coordinates outside supported city areas and provides visual warnings for manual pins dragged outside municipal limits.
- **Step 2 — Photo Evidence & Multi-Signal AI Vision**: Upload camera capture or gallery photo. Features live client-to-backend analysis synthesizing image luminance, saturation, texture roughness, and asphalt monochrome metrics with Groq LLM intelligence.
- **Step 3 — Review & Confirmation**: Displays AI-suggested category, estimated severity, and municipal interpretation before submission.

### 2. Intelligent Duplicate Detection (`/analyzing`)
- Scans nearby reports within a 500m radius matching the detected civic category.
- If an existing open complaint is detected, citizens can click **"Yes, I'm also affected"** to upvote the existing issue instead of creating a duplicate ticket, clustering community demand.
- Citizens can choose **"No, report as a new issue"** to proceed with a standalone ticket.

### 3. Real-Time Tracking & Public Transparency (`/complaint/:id`)
- Visual status timeline: `Report Received` → `Department Assigned` → `Work Order Issued` → `Field Inspection` → `Resolved`.
- Real-time work execution progress, assigned department details, and contractor scorecard visibility.
- Citizen confirmation loop allowing citizens to verify completed field work and earn civic reputation points (XP).

### 4. Public Civic Map & Environmental Telemetry (`/map`)
- City-wide interactive complaint density heatmap and status markers.
- Live real-time environmental metrics (Air Quality Index PM2.5/PM10, temperature, weather condition) fetched via Open-Meteo API.

### 5. Internationalization (i18n)
- Full localized interface across **English**, **Hindi (हिंदी)**, **Gujarati (ગુજરાતી)**, **Marathi (मराठी)**, and **Kannada (ಕನ್ನಡ)**.

---

## Local Development

```bash
# From repository root
npm install

# Run public portal in development mode
cd apps/public
npm run dev
# Running on http://localhost:8080 (or vite default port)
```

## Environment Configuration

Create a `.env` or `.env.local` inside `apps/public/`:

```env
VITE_API_BASE_URL=https://civic-sathi-f7ml.onrender.com
```

## Build and Deployment

The portal builds via Vite and Nitro serverless preset for Vercel:

```bash
npm run build
```
Build output is generated into `.vercel/output/` and deployed automatically on commit to `main`.