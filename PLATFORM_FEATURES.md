# Civic Sathi — Complete Platform Feature Bible

> **What is this document?**
> This is the single source of truth for every feature in the Civic Sathi platform.
> It covers all 4 portals (Public, Municipality, Admin, Contractor) and the entire Backend API.
> Every page, every button, every form field, every API connection is documented here.
> Your team can use this to understand exactly what exists, how it works, and how everything connects.

---

# TABLE OF CONTENTS

1. [PUBLIC PORTAL — Citizen Features](#1-public-portal--citizen-features)
2. [MUNICIPALITY PORTAL — Ward Officer Features](#2-municipality-portal--ward-officer-features)
3. [ADMIN PORTAL — Super Admin Features](#3-admin-portal--super-admin-features)
4. [CONTRACTOR PORTAL — Vendor Features](#4-contractor-portal--vendor-features)
5. [BACKEND API — All Endpoints](#5-backend-api--all-endpoints)
6. [CROSS-PORTAL CONNECTIONS — How Everything Links Together](#6-cross-portal-connections--how-everything-links-together)

---

# 1. PUBLIC PORTAL — Citizen Features

**Who uses this:** Everyday citizens, community organizers, residents
**Purpose:** Report civic problems, track resolutions, vote on community projects, view contractor ratings, manage data privacy

---

## 1.1 Landing Page (`/`)

**What it does:** The first page citizens see. Introduces the platform and shows live city data.

**Sections on this page:**
- Hero Section with a trust badge and live city intelligence intro
- Multi-City Switcher (4 buttons: Vadodara, Mumbai, Bengaluru, Delhi)
- Interactive Civic Map preview showing active issues
- City Cultural & Civic Heritage Panel (shows city-specific imagery and info)
- "How It Works" explainer (4-step guide)
- About Municipal Governance section
- AI Pattern Detection section (shows what categories the AI can detect)
- Live Civic Intelligence stats summary

**Buttons & Actions:**
- "Report a problem" → Takes citizen to `/report`
- "How it works" → Scrolls down to `#how-it-works`
- City selector buttons (Vadodara, Mumbai, Bengaluru, Delhi) → Switches the displayed city data
- "Explore Full Civic Map" → Takes citizen to `/map`
- "Start a Report" → Takes citizen to `/report`

**Backend Connection:** Calls `getPublicCityAggregate(cityId)` to fetch live stats for the selected city

---

## 1.2 Community Hub (`/hub`)

**What it does:** A daily-use civic dashboard with environmental data, gamification, and community projects.

**Sections on this page:**
- City Hub Header
- Live Environment Metrics: AQI (42), Temperature (32°C), Water Supply (94%), Active Alerts (0)
- Participatory Budgeting preview (2 community projects with vote counts)
- Emergency Services cards (Police 100, Fire 101, Medical 108)
- Top Citizen Contributors leaderboard (3 top reporters)
- Live City Announcements

**Buttons & Actions:**
- "View All" (Participatory Budgeting) → Takes citizen to `/projects`
- "Cast Your Vote" / "Voted" → Toggles the citizen's vote on a community project
- Emergency Service cards → Opens phone dialer (`tel:100`, `tel:101`, `tel:108`)

**Why it's useful:** Turns the app into a daily-use utility (weather, AQI) instead of just a complaint portal. The leaderboard gamifies participation.

---

## 1.3 Community Projects — Participatory Budgeting (`/projects`)

**What it does:** Citizens browse proposed municipal infrastructure projects and vote to influence where city money goes.

**Sections on this page:**
- Header with "Participatory Budgeting" label
- Category Filter Chips (ALL, INFRASTRUCTURE, ENVIRONMENT, HEALTH, SANITATION)
- Project Cards Grid showing: Title, Category tag, Budget amount, Description, Vote count, Funding progress bar

**4 Sample Projects:**
1. Solar Streetlights in Sector 9 — ₹12.5 Lakhs — 1,240 votes
2. Revitalize Central Lake Park — ₹45.0 Lakhs — 3,420 votes
3. Community Health Clinic Extension — ₹30.0 Lakhs — 850 votes
4. Smart Waste Bins Installation — ₹8.5 Lakhs — 2,100 votes

**Buttons & Actions:**
- Filter chips → Filters projects by category
- "Cast Your Vote" → Registers the citizen's vote (toggles to "Voted Successfully")

**Connection to Municipality:** These voting results inform the Municipality's `/tenders` system on which projects to prioritize.

---

## 1.4 Report a Problem (`/report`)

**What it does:** The primary complaint submission form. Supports both manual text and AI-assisted drafting.

**This is a 4-step wizard:**

**Step 1 — Problem Description:**
- Large text area for describing the issue
- Voice Input button (microphone) for dictation
- "Use the example" button that auto-fills: "There has been no water supply in our area for three days"

**Step 2 — Location Picker:**
- Interactive map for pinpointing the exact location
- Device geolocation integration

**Step 3 — Photo Evidence:**
- Camera/file upload for attaching photographic proof

**Step 4 — Review & Submit:**
- Shows: Description, AI-Suggested Category, AI-Suggested Severity, Municipal Interpretation, Location pin, Uploaded photo
- "Edit" buttons to go back and modify any section
- "Submit report" button → Saves the draft and navigates to `/analyzing`

**Backend Connection:** Automatically calls `analyzeComplaint` in the background during Step 3 to pre-categorize using NLP.

---

## 1.5 AI Analysis Screen (`/analyzing`)

**What it does:** A processing screen that appears after submitting a report. The AI analyzes the complaint, checks for duplicates, and either creates a new complaint or links to an existing one.

**3 possible UI states:**

**State 1 — Analyzing:** Animated progress bar showing "Analyzing your report"

**State 2 — Duplicates Found:** Shows similar nearby issues
- "Yes, I'm also affected" → Upvotes the existing issue instead of creating a duplicate
- "No, report as a new issue" → Creates a brand new complaint

**State 3 — Success:** Shows confirmation with complaint ID and stats
- "Track complaint" → Takes citizen to `/complaint/$id`

**Backend Connections:** `analyzeComplaint`, `getNearbyComplaints`, `createComplaint`, `upvoteComplaint`, `getComplaint`

**Why it's useful:** Prevents duplicate complaints flooding the system. Existing issues get upvoted instead.

---

## 1.6 Civic Map (`/map`)

**What it does:** A full-screen interactive map showing all civic issues across the city.

**Sections on this page:**
- City Switcher (Vadodara, Mumbai, Bengaluru, Delhi)
- Mode Tabs: Health view, Activity view, Hotspots view
- Search Bar with area suggestions
- Filter Chips: Issue categories, Severity levels, Time windows (24h, 7d, 30d)
- Full Civic Map (Leaflet with Turf.js clustering)
- Stats Summary: Total Reports, Last 7 Days, Localities Mapped, Resolved
- Live Charts: Activity Pulse, Issue Breakdown pie, Health Pie Chart
- Sidebar: Most Active Areas ranking / Hotspot ranking
- Area Detail Panel: Shows stats for a specific selected area

**Buttons & Actions:**
- City buttons → Switches displayed city
- Mode tabs → Changes map visualization
- "Near me" → Uses device GPS to center map
- "Reset" → Clears all filters and search
- Search suggestions → Zooms to specific area
- Issue/Severity/Time chips → Applies filters
- Area list items → Zooms and shows detail panel
- "Report an issue here" → Links to `/report`
- "View complaints" → Links to `/complaints`

**Backend Connection:** Calls `getPublicCityAggregate` for live data

---

## 1.7 My Complaints (`/complaints`)

**What it does:** Personal dashboard showing all complaints the citizen has submitted.

**Sections:** Header, List of complaint cards (each showing ID, status, date, category)

**States:** Loading spinner, Error message, Empty state with "Report a problem" button

**Backend Connection:** Calls `getMyComplaints` via React Query

---

## 1.8 Complaint Detail (`/complaint/$id`)

**What it does:** Deep-dive timeline view of a single complaint's lifecycle.

**Sections on this page:**
- Back link to `/complaints`
- Complaint Header: ID number, Status badge, Severity badge
- Share button (native share or Twitter)
- Complaint Details: Photo, Full description, Location, Submission date, Related reports count
- Nearby Civic Activity map (small map showing area)
- Resolution Timeline: Visual step-by-step showing status changes (Reported → Triaged → Assigned → Resolved)

**Backend Connection:** Calls `getComplaint(id)` via React Query

---

## 1.9 DEPA Consent Manager (`/consent`)

**What it does:** India's Data Empowerment and Protection Architecture (DEPA) privacy center. Citizens control which government departments can access their data.

**Sections on this page:**
- DPDP Act Educational Callout explaining data rights
- Summary KPI Ribbon: Active consents, Pending, Revoked, Audit Trail entries
- Consent Agreement Cards (each showing: Department name, Purpose, Status, Cryptographic hash)

**Buttons & Actions:**
- "Grant Consent" → Allows a department to access citizen data
- "Revoke Access" → Removes a department's access
- Audit Hash copy button → Copies cryptographic proof to clipboard
- Refresh button → Reloads consent list

**Backend Connection:** `getDepaConsents`, `grantDepaConsent`, `revokeDepaConsent`

**Mock Fallback:** If API fails, shows 4 mock consent entries

---

## 1.10 Contractor Ratings (`/contractors`)

**What it does:** Public transparency ledger showing all municipal contractors and their reliability scores.

**Sections on this page:**
- Hero text
- Contractor Cards Grid: Shows public rating, AI rating, and officer rating for each contractor
- Citizen Review Modal (popup for submitting ratings)

**Buttons & Actions:**
- "Rate This Contractor" → Opens the review modal
- Star Rating buttons (1-5) → Sets rating
- "Submit Verified Rating" → Submits the review

**Review Modal Form Fields:**
- Star rating (1-5)
- Work Order selector dropdown
- Category selector dropdown
- Feedback text area

**Backend Connection:** `listPublicContractors`, `submitPublicRating`

---

## 1.11 Notifications (`/notifications`)

**What it does:** Inbox for complaint updates and SLA breach alerts.

**Backend Connection:** `getNotifications`, `markNotificationsRead`

**Navigation:** Each notification links to the relevant `/complaint/$id`

---

## 1.12 Citizen Profile (`/profile`)

**What it does:** Full citizen identity and gamification dashboard.

**Sections on this page:**
- Civic Progress: Level, XP points, Total reports, Stats
- Recognition Earned: Achievement badges list
- Privacy Toggles: Show contributors, Allow sharing, Subtle animations, Reward notifications
- Display Name Mode: Initials, First Name, or Alias
- City Impact: Real progress stats for the citizen's city
- Recent Civic Ledger: Activity history
- Account Controls: Edit profile form

**Profile Form Fields:**
- Full name, Email, Phone, Preferred ward

**Buttons & Actions:**
- Privacy toggles → Calls `updateReputationPreferences()`
- Display mode buttons → Changes how the citizen's name appears publicly
- "Save changes" → Updates profile
- "Change password" → Goes to `/forgot-password`
- "Log out" → Signs out and goes to `/`

**Backend Connection:** `getMyCivicReputation`, `updateCivicReputationPreferences`

---

## 1.13 Authentication Pages

**Login (`/login`):**
- Form: Email, Password
- "Sign in" button → JWT authentication
- Links to: `/forgot-password`, `/register`

**Register (`/register`):**
- Form: Full name, Email, Phone, Password
- "Create account" button → Creates citizen account
- Links to: `/login`

**Forgot Password (`/forgot-password`):**
- Stage 1: Email/phone input, Delivery method (auto/email/sms), "Send reset code"
- Stage 2: OTP code input, New password input, "Reset password"
- "Use a different contact" → Goes back to Stage 1

---

## 1.14 Navigation Structure

**Desktop Top Nav — Primary Links:**
- Home (`/`)
- Community Hub (`/hub`)
- Civic Map (`/map`)
- Report Problem (`/report`)
- My Complaints (`/complaints`)

**Desktop Top Nav — Secondary "More" Dropdown:**
- Community Projects (`/projects`)
- How It Works (`/#how-it-works`)

**Mobile Bottom Tab Bar:**
- Home, Hub, Map, Report, Profile

**Utility Actions:** PWA Install button, Language Toggle, Theme Toggle (Light/Dark/System), Notifications bell, Profile avatar

---
---

# 2. MUNICIPALITY PORTAL — Ward Officer Features

**Who uses this:** Ward Officers, Department Heads, Municipal Commissioners, Collectors
**Purpose:** Triage citizen complaints, manage departments, orchestrate emergencies, publish tenders, track work orders

---

## 2.1 Login & Authentication

**Login (`/login`):**
- Form: Officer ID / Email, Password, Remember session checkbox
- "Sign In" button → JWT auth via `signIn(email, password)`
- Links to: `/forgot-password`

**Forgot Password (`/forgot-password`):**
- Stage 1: Officer email/mobile, Delivery method (auto/email/sms)
- Stage 2: OTP code, New password
- Same flow as public but for officers

---

## 2.2 Municipal Intelligence Dashboard (`/_auth/dashboard`)

**What it does:** Real-time operational command center for ward officers.

**KPI Cards:**
- Total Reports count
- Critical issues count
- Active issues count
- Resolved issues count
- Emerging Issues count
- Area Hotspots count

**Sections:**
- City Health Map Panel (interactive map with area health colors)
- Live Activity Feed Rail (real-time updates streaming in)
- 7-Day Activity Pulse Chart (area chart showing complaint trends)
- Issue Breakdown Chart (categories)
- Severity Distribution Chart
- Emerging Systemic Issues section
- Hotspot Analysis List

**Backend Connections:** `getDashboardKPIs`, `getSystemicIssues`, `getLiveActivity`, `getHotspotRankings`, `getAuthoritativeMapData`

**Navigation:** Links to `/issues`, `/issues/$id`, `/map`

---

## 2.3 Analytics & Charts (`/_auth/analytics`)

**What it does:** Deep data visualizations for identifying trends and predicting problems.

**8 Chart Sections:**
1. Complaint Volume Trend (AreaChart)
2. Severity Distribution (BarChart)
3. Department Workload (PieChart)
4. Category Distribution (Horizontal BarChart)
5. Emerging Issues Trend (AreaChart)
6. Average Response Time (LineChart)
7. Citizen Sentiment Analysis (68% satisfaction score)
8. Predictive Resource Heatmap (shows "+2 sanitation crews needed")

**Backend Connection:** `getAnalyticsData(city)`

---

## 2.4 AI Smart Composer (`/_auth/smart-composer`)

**What it does:** Officers describe a complex emergency and the AI breaks it down into multiple department-specific tickets automatically.

**Sections:**
- Explainer Banner
- 1-Click Demo Presets (3 pre-built scenarios for testing)
- Incident Intake Form
- AI Triage & Dependency Map Output
- 5-Stage Animated Triage Modal

**3 Demo Presets:**
1. Water Main Burst & Road Cave-in
2. Storm Drain Choke
3. Pipe Joint Rupture

**Form Fields:**
- Municipal Authority (select dropdown)
- Corridor / Ward Location (text input)
- Incident Title (text input)
- Detailed Grievance Description (large textarea)
- Visual Evidence Link (URL input)

**Buttons:**
- Demo Preset buttons → Auto-fill the form with test data
- "Run AI Pre-Triage Scan" → Sends to AI for analysis
- "Dispatch Master Case" → Creates the multi-department case

**Backend Connections:** `analyzeMultiDeptCase()`, `createMasterCase()`

**After dispatch:** Navigates to `/case/$caseNumber` to view the Digital Case Passport

---

## 2.5 Digital Case Passport (`/_auth/case/$id`)

**What it does:** Tracks a complex multi-department emergency case in real-time.

**Sections:**
- Top Action Bar with navigation
- Official Government Case Passport Card (with verification badge)
- Incident Engineering Diagnostics
- Macro Interoperability Milestone Pipeline (horizontal timeline)
- Predictive Risk Assessment banner
- Sovereign Department Child Tickets (dynamic cards for each department involved)
- Sathi Setu Cryptographic Audit Trail (immutable log)

**Buttons:**
- "Back to AI Case Composer" → Goes to Smart Composer
- "Live Orchestrator Graph" → Goes to Live Orchestration
- "Sync Telemetry" → Re-fetches the case data
- Copy Case Passport Number → Clipboard copy
- "Simulate Water Repair Completion" → Demo simulation trigger

**Backend Connections:** `getCasePassport(id)`, `simulateCompleteDepartment()`

---

## 2.6 Live Orchestration (`/_auth/live-orchestration`)

**What it does:** Interactive SVG topology graph showing real-time packet transit between systems (Citizen → MCGM → Sathi Setu → Water Board → PWD).

**Sections:**
- Control Toolbar
- Sequenced Stage Stepper (visual steps)
- Main Topology Graph Canvas (interactive SVG)

**Buttons:**
- "Play Dual-Dept Handoff" → Runs the simulation animation
- "Emit Sovereign Webhook" → Opens manual emit modal
- Speed toggles (1.0x, 2.0x, 4.0x)
- Reset Topology

**Manual Webhook Emit Form:**
- Event type, Source system, Target system, Department code, Status, External ticket ID, Notes

**Backend Connections:** `getRecentTransitEvents()`, `subscribeToLiveStream()` (SSE), `simulateHandoffScenario()`, `sendIntegrationEvent()`

---

## 2.7 AI Triage — Smart Queue (`/_auth/ai-triage`)

**What it does:** Officers review incoming complaints that have been auto-categorized by the AI. They approve or override the AI's suggestions.

**Sections:**
- Header with Pending Count
- Grid of Triage Cards (each showing the AI's duplicate matching score)
- Empty state: "All caught up"

**Buttons:**
- "Merge duplicate" → Approves the AI's suggestion to merge
- "Split / Unique" → Rejects the merge, keeps as separate complaint

**Backend Connections:** `GET /api/v1/ai/triage/pending`, `POST /api/v1/ai/triage/$complaintId/$action`

---

## 2.8 Complaint Management (`/_auth/complaints`)

### Complaints List (`/_auth/complaints/`)

**What it does:** Full ticketing system for managing all citizen complaints.

**Sections:**
- Complaint Management Header
- AI Grouping Review Modal
- Saved Views Pills (pre-saved filter combinations)
- Bulk Actions Panel
- Complaints Table (sortable, filterable)
- Filter Drawer (sidebar)

**Buttons:**
- "Filters" → Opens filter drawer
- "Export" → Downloads complaint data
- "Bulk Verify" → Batch-verifies selected complaints
- "AI Group Similar Complaints" → AI proposes merge groups
- "Review" → Opens AI merge review modal
- "Confirm Merge into Civic Issue" → Merges complaints together

**Filter Fields:** Category, Severity, Ward

**Backend Connections:** `getMuniComplaints`, `getSavedViews`, `proposeAiMergeGroups`, `confirmAiMergeGroup`, `bulkUpdateComplaints`

### Complaint Detail (`/_auth/complaints/$id`)

**What it does:** Deep dive into a single complaint with officer action tools.

**Sections:**
- Civic Map Panel (small map)
- Report Details
- AI Intelligence Analysis Panel (backend's NLP interpretation)
- Investigation Timeline
- Officer Actions panel

**Buttons & Actions:**
- "Assign complaint" → Assigns to a specific officer
- "Verify & Accept Complaint" → Marks as verified
- "Reject as Invalid" → Opens reject reason form
- "Classify/Route" → Routes to correct department
- "Link to civic issue" → Connects to an existing systemic issue
- "Create procurement opportunity" → Creates a tender from this complaint

**Form Fields:**
- Assign officer (select dropdown)
- Assignment Notes (textarea)
- Reject Reason (textarea)

**Backend Connections:** `getMuniComplaint`, `getCivicIssues`, `listMunicipalityOfficers`, `assignComplaint`, `updateComplaintStatus`

---

## 2.9 Systemic Issues (`/_auth/issues`)

### Issues List (`/_auth/issues/`)
Shows emerging systemic issues as cards. Backend: `getSystemicIssues`

### Issue Detail (`/_auth/issues/$id`)

**Sections:**
- Systemic Issue Intelligence Header
- Explainability Panel (AI reasoning)
- Root Cause Panel
- Recommended Actions Panel
- Risk Score Panel
- Field Action Card
- Related Complaints List

**Buttons:** "Start Investigation", "Assign to Municipal Water", "Acknowledge"

**Backend:** `getSystemicIssue`, `getMuniComplaints`, `startInvestigation`, `assignIssueDepartment`, `updateSystemicIssue`

---

## 2.10 Civic Issues — Clustered Reports (`/_auth/civic-issues`)

### Civic Issues List (`/_auth/civic-issues/`)
Shows clustered citizen reports grouped by AI. Backend: `getCivicIssues`

### Civic Issue Detail (`/_auth/civic-issues/$id`)

**Buttons:** "Split", "Merge with another issue", "Confirm Merge", "Create Work Package"

**Form Fields:** Target issue select (for merging)

**Backend:** `getCivicIssues`, `materializeCivicIssue`

**Navigation:** Links to `/tenders/new` to create a procurement opportunity from the issue

---

## 2.11 Tenders — Procurement System (`/_auth/tenders`)

### Tenders List (`/_auth/tenders/`)
Shows all published and draft tenders. Button: "Publish Tender" → Goes to `/tenders/new`

### Create New Tender (`/_auth/tenders/new`)

**Form Fields:**
- Title, Description, Category, Department, Ward, Area
- Estimated Cost, Priority, Scope of Work
- Civic Issue IDs (links the tender back to citizen complaints)

**Backend:** `createTender`, `publishTender`

### Tender Detail (`/_auth/tenders/$id`)

**Sections:** Tender details, Sealed Bids List, Quick Info Sidebar

**Button:** "Award Tender to this Bid" → Awards contract to winning bidder

**Backend:** `getTender`, `listBids`, `awardBid`

---

## 2.12 Work Orders (`/_auth/work-orders`)

### Work Orders List (`/_auth/work-orders/`)

**Filter Tabs:** All, Issued, In Progress, Pending Inspection, Rework, Completed, Closed

**Backend:** `getWorkOrders`

### Work Order Detail (`/_auth/work-orders/$id`)

**This is the most complex page in the Municipality portal.**

**Sections:**
- Work Order Details
- Bill of Quantities (BOQ) Table
- Inspection Form
- Measurement Form
- Bill Approval section
- Evidence AI Validation Grid (photos submitted by contractor)
- Timeline of all events
- Financial Summary

**Buttons:**
- "Record site inspection" → Opens inspection form
- "Verify & Proceed" → Advances work order status
- "Approve Bill & Initiate Payment" → Triggers payment to contractor
- "Close Work Order" → Marks as complete
- "Pass/Fail" → Inspection result

**Form Fields:**
- Inspection Notes (textarea)
- Verified Total Amount (number input)

**Backend Connections:** `getWorkOrder`, `getWorkOrderEvents`, `updateWorkOrderStatus`, `submitMeasurement`, `getMeasurement`, `getBill`, `approveBill`, `getEvidence`, `inspectWorkOrder`

---

## 2.13 GIS Map (`/_auth/map`)

**Sections:** Filter Controls, Map Canvas, 7-Day Pulse Chart, Severity Mix Chart, Area Detail Panel

**Modes:** Health, Activity, Hotspots

**Backend:** `getAuthoritativeMapData()`

---

## 2.14 Alerts (`/_auth/alerts`)

**Filter Tabs:** All, Active, Acknowledged

**Buttons:** "Acknowledge" per alert

**Backend:** `getAlerts()`, `acknowledgeAlert()`

---

## 2.15 Administration (`/_auth/administration`)

**What it does:** Collector-level tool to provision staff and register contractors.

**Officer Provisioning Form:**
- Full name, Login email, Temporary password, Phone, Department, Designation, Ward

**Contractor Registration Form:**
- Company name, Contact person, Company email, Phone, Login email, Login password, Registration class

**Backend:** `listMunicipalityOfficers`, `listMunicipalityContractors`, `createMunicipalityOfficer`, `createMunicipalityContractor`

---

## 2.16 Other Municipality Pages

**Profile (`/_auth/profile`):** Edit name/phone/designation, Change password, Theme toggle, Civic Performance Metrics, Sign Out

**Settings (`/_auth/settings`):** Theme select, Default City, Default Map Mode, Compact Mode toggle, Notification preferences (Critical, Assignments, Risk, Daily Digest)

**Areas (`/_auth/areas`):** Area Intelligence Grid with sort by risk/reports/trend

**Departments (`/_auth/departments`):** Department workload stats, drill down to individual department

**SLA Breach (`/municipality/sla-breach`):** List of complaints at risk of violating SLA deadlines

**Citizen Feedback (`/municipality/citizen-feedback`):** Feed of citizen reviews with star ratings

**Contractor Invoices (`/municipality/contractor-invoices`):** Approve/Reject pending contractor payment invoices

---
---

# 3. ADMIN PORTAL — Super Admin Features

**Who uses this:** State-level directors, system engineers, super admins
**Purpose:** Global platform oversight, multi-city management, AI model tuning, system integrity

---

## 3.1 Admin Dashboard (`/admin/dashboard`)

**What it does:** God-view aggregating metrics across ALL onboarded cities.

**Features:** CommandCenterDashboard with Recharts visualizations, real-time polling

**Backend:** `getCommandCenterSnapshot`, `getAuditLogs`

---

## 3.2 State Command Center (`/admin/state-command-center`)

**What it does:** State-wide emergency orchestration viewer. Leaflet map with layers showing telemetry across all cities.

**Mock fallback data** for city telemetry when backend is offline.

---

## 3.3 Integration Hub (`/admin/integration-hub`)

**What it does:** Monitors API gateway health for connections to external government systems (Police CAD, Fire Dept).

**Features:** Connected systems display, network latency monitoring, health status

**Mock Data:** Sovereign integrations mock data for demos

---

## 3.4 AI Oversight — MLOps Dashboard (`/admin/ai-oversight`)

**What it does:** Monitors the accuracy of the NLP triage model.

**Features:** ML telemetry dashboard showing confidence scores and false-positive rates

**Backend:** `adminApiFetch` for fetching AI metrics

---

## 3.5 Trust & Safety (`/admin/trust-safety`)

**What it does:** Platform moderation tools.

**Features:** Flagged content queue, Banned users list

**Mock Data:** `MOCK_FLAGGED`, `MOCK_BANNED` for testing

---

## 3.6 Audit Logs (`/admin/audit-logs`)

**What it does:** Immutable compliance ledger tracking every database action.

**Features:** Searchable, filterable log viewer

---

## 3.7 MDM Exceptions (`/admin/exceptions`)

**What it does:** Queue of system-wide exceptions requiring admin resolution.

**Buttons:** Resolve exception

**Backend:** Resolve mutation

---

## 3.8 Global Complaints (`/admin/global-complaints`)

**What it does:** Unfiltered access to every complaint across all cities. Paginated with search filters.

---

## 3.9 Master Data Management (`/admin/mdm`)

**What it does:** Define the foundational geographic and organizational data.

**3 Tabs:** Zones, Wards, Departments

**Features:** Create new zones/wards/departments, view existing ones

**This feeds the entire location-based routing system for the platform.**

---

## 3.10 User Management (`/admin/users`)

**What it does:** CRUD for all platform users. Extensive form for creating/editing user accounts and roles.

---

## 3.11 SLA Configuration (`/admin/sla`)

**What it does:** Rules engine for setting Service Level Agreement thresholds.

**Groups rules by:** Severity, Response Hours, Resolution Hours, Escalation Hours, Status

**Inline editing:** Click edit → type new hours → save

**Backend:** `getSLARules`, `updateSLARule`

---

## 3.12 Work Orders Overview (`/admin/work-orders-overview`)

**What it does:** Global visibility into infrastructure spending across all cities.

**Features:** Recharts BarChart showing distribution, Work orders table

**Backend:** `getWorkOrders`

---

## 3.13 Interoperability Hub (`/admin/interoperability`)

**What it does:** Sathi Setu gateway management.

**Features:**
- Gateway Connection Banner
- Connected Systems Registry
- Open Data Export (CSV download of anonymized dataset)
- API Key Management (view, copy, generate new key)

**Buttons:** Check Connectivity, Export Anonymized Dataset, Copy API Key, Generate New Key

**Backend:** `getSetuSystems`

---

## 3.14 Gamification Engine (`/admin/gamification`)

**What it does:** Configure the citizen rewards system.

**Features:**
- Achievement Badges grid (e.g., "First Report", "Civic Hero")
- Active Missions table (e.g., "Monsoon Prep", "Clean India Drive")
- XP Configuration thresholds

**Note:** Currently marked as "Prototype Concept" with a warning banner

---

## 3.15 Admin Settings (`/admin/settings`)

**Sections:** My Profile edit, Password Change, Theme (light/dark/system), Platform Info

**Form Fields:** Name, Phone, Current Password, New Password, Confirm

**Backend:** `patchMe` via `adminApiFetch("/api/v1/auth/me")`

---

## 3.16 Contractor Management (`/admin/contractors`)

### Contractors List (`/admin/contractors/`)
**Filter buttons:** ALL, VERIFIED, PENDING_VERIFICATION, SUSPENDED
**Search:** By name or registration number
**Actions:** Verify, Suspend, View Details

### Contractor Detail (`/admin/contractors/$id`)
**Sections:** Company Profile, Registration Compliance (uploaded documents), System Security Logging
**Buttons:** Verify Contractor, Suspend Contractor (with reason prompt)

**Backend:** `getContractors`, `getContractor`, `getContractorDocuments`, `verifyContractor`, `suspendContractor`

---

## 3.17 Smart Composer & Case Passport (`/admin/smart-composer`, `/admin/case/$id`)

Identical to the Municipality versions but with global cross-city permissions for state-level orchestration and testing.

---

## 3.18 Admin Navigation Sidebar

**Command Center:** Dashboard, State Command Center
**Operations:** Global Complaints, Users, Contractors, Work Orders, MDM Exceptions, SLA Config, Audit Logs, Integration Hub
**Platform:** Master Data (MDM), AI Oversight, Trust & Safety, Gamification, Interoperability, Settings

---
---

# 4. CONTRACTOR PORTAL — Vendor Features

**Who uses this:** Private contractors, field workers, vetted agencies
**Purpose:** Bid on tenders, execute work orders, upload proof of work, track reputation

---

## 4.1 Contractor Dashboard (`/contractor/`)

**Sections:**
- Operations Center (greeting, stats)
- 4 KPI Cards: Active Work Orders, Urgent Deadlines, Success Rate, Reputation Score
- Active Work Orders table
- Operations Map
- Delayed Work Orders alerts
- Quick Actions panel

**Quick Action Buttons:** Browse New Tenders, Update Work Status, View Performance Profile

**Backend:** `getWorkOrders`, `getEligibleTenders`

---

## 4.2 Tenders — Bidding Marketplace (`/contractor/tenders`)

### Tenders List (`/contractor/tenders/`)
**Features:** Search/filter bar, List of available tenders (ID, department, location, value, deadline)

### Tender Detail (`/contractor/tenders/$id`)
**Features:** Full tender description, requirements

**Bid Submission Form:**
- Proposed Amount (number)
- Estimated Days (number)
- Technical Proposal (text)

**Button:** "Submit Bid"

**Backend:** `getTenderDetails(id)`, `submitBid(id, bidData)`

---

## 4.3 Work Orders — Job Execution (`/contractor/work-orders`)

### Work Orders List (`/contractor/work-orders/`)
**Status Tabs:** All, In Progress, Pending Inspection, Completed, Delayed

### Work Order Detail (`/contractor/work-orders/$id`)

**Features:** Work Order details, Execution updates log, Location map

**Progress Update Form:**
- Progress Percentage (slider/number)
- Status Dropdown
- Remarks (text)
- Image Upload (field evidence photos)

**Button:** "Update Progress"

**Backend:** `getWorkOrder(id)`, `updateWorkOrderStatus(id, data)`, `submitFieldEvidence(id, file)`

**Connection:** When a contractor marks a job complete and uploads proof, this triggers the Municipality's inspection workflow at `/_auth/work-orders/$id`.

---

## 4.4 Performance Profile (`/contractor/performance`)

**What it does:** The Reputation Engine. Shows the contractor's trust scorecard.

**5 KPIs:**
1. On-Time Completion rate
2. Quality Rating
3. SLA Compliance rate
4. Defect Rate
5. XP Earned

**Sections:** Tri-Party Governance & Trust Scorecard, Past Projects Evaluation

**Backend:** `getContractorPerformance`

**Connection:** This score is publicly visible on the Public portal's `/contractors` page.

---

## 4.5 Contractor Profile (`/contractor/profile`)

**Sections:** Contractor details, Public Reputation score, Compliance & Certifications, Recent Badges, Contact Information

**Backend:** `getContractor`, `getMyCivicRolePerformance`, `/api/v1/auth/me`

---

## 4.6 Contractor Navigation Sidebar

**Links:** Dashboard, Work Orders, Tenders, Performance Profile

**Actions:** Notifications bell, User profile button, Logout

---
---

# 5. BACKEND API — All Endpoints

**Technology:** Python FastAPI
**Base URL:** `/api/v1`

---

## 5.1 Authentication (`auth.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| POST | `/auth/login` | Issues JWT tokens | Everyone |
| POST | `/auth/forgot-password` | Generates password reset token | Everyone |
| POST | `/auth/reset-password` | Resets password with OTP | Everyone |
| GET | `/auth/me` | Returns current user profile | Logged-in users |

---

## 5.2 Complaints (`complaints.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/complaints` | List complaints (filtered) | Citizens, Officers |
| POST | `/complaints` | Create new complaint | Citizens |
| GET | `/complaints/{id}` | Get single complaint | Citizens, Officers |
| PATCH | `/complaints/{id}` | Update complaint status | Officers only |

---

## 5.3 Cases (`cases.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/cases` | List multi-dept cases | Officers |
| POST | `/cases` | Create master case | Officers |
| GET | `/cases/{id}` | Get case detail | Officers |
| PATCH | `/cases/{id}` | Update case status | Officers |

---

## 5.4 Procurement (`procurement.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/procurement/tenders` | List tenders | Officers, Contractors |
| POST | `/procurement/tenders` | Create tender | Officers |
| GET | `/procurement/tenders/{id}` | Get tender detail | Officers, Contractors |
| POST | `/procurement/tenders/{id}/bids` | Submit bid | Contractors |
| GET | `/procurement/work-orders` | List work orders | Officers, Contractors |
| GET | `/procurement/work-orders/{id}` | Get work order detail | Officers, Contractors |
| PATCH | `/procurement/work-orders/{id}` | Update work order status | Officers, Contractors |

---

## 5.5 Reputation (`reputation.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/reputation/xp` | Get XP ledger | Logged-in users |
| GET | `/reputation/badges` | Get achievement badges | Logged-in users |
| GET | `/reputation/contractor/{id}` | Get contractor scorecard | Everyone |

---

## 5.6 AI & Triage (`ai.py`, `triage.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| POST | `/ai/analyze-image` | AI analyzes uploaded image | Citizens |
| POST | `/ai/triage` | AI auto-categorizes complaint | Internal |
| GET | `/triage/queue` | Get pending triage items | Officers |
| POST | `/triage/{id}/approve` | Approve AI suggestion | Officers |
| POST | `/triage/{id}/reject` | Override AI suggestion | Officers |

---

## 5.7 Integrations (`integrations.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/integrations/sse` | Server-Sent Events stream | Admin, Municipality |
| POST | `/integrations/ingest` | Ingest events from sovereign systems | External systems |

---

## 5.8 Analytics & Admin (`analytics.py`, `admin.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/analytics/dashboard` | Dashboard telemetry | Officers, Admins |
| GET | `/analytics/hotspots` | Map hotspot data | Officers, Admins |
| GET | `/admin/platform-stats` | Global platform stats | Admins only |
| POST | `/admin/sla-config` | Update SLA rules | Admins only |

---

## 5.9 Municipality (`municipality.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/municipality/officers` | List ward officers | Collectors |
| POST | `/municipality/officers` | Create new officer | Collectors |
| GET | `/municipality/contractors` | List local contractors | Collectors |
| POST | `/municipality/contractors` | Register new contractor | Collectors |

---

## 5.10 Issues (`issues.py`)

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/issues` | List systemic issues | Officers |
| PATCH | `/issues` | Update issue | Officers |
| GET | `/issues/{id}` | Get issue detail | Officers |
| POST | `/issues/merge-proposals` | Propose AI merge | Officers (issues.merge perm) |
| POST | `/issues/merge-proposals/confirm` | Confirm merge | Officers |
| POST | `/issues/rebuild` | Rebuild issue clusters | Officers |
| POST | `/issues/materialize/{complaint_id}` | Create issue from complaint | Officers |

---

## 5.11 Other Endpoints

| Method | Endpoint | What it does | Who can call it |
|--------|----------|-------------|-----------------|
| GET | `/mdm/zones` | List geographic zones | Officers, Admins |
| GET | `/mdm/wards` | List wards | Officers, Admins |
| GET | `/mdm/departments` | List departments | Officers, Admins |
| GET | `/cities` | List all cities | Everyone (public) |
| GET | `/external/lookup` | Sathi Setu citizen lookup | External (secret key) |
| GET | `/health` | Liveness probe | Everyone |
| Various | `/mock/*` | Mock sovereign systems | Demo only |

---
---

# 6. CROSS-PORTAL CONNECTIONS — How Everything Links Together

This section explains how data flows between portals.

## Flow 1: Citizen Reports a Problem → Gets Resolved

```
Citizen (/report) 
  → Backend AI (triage.py) auto-categorizes
  → Municipality (/complaints) sees it in queue
  → Officer assigns to Contractor
  → Contractor (/work-orders/$id) uploads proof photos
  → Municipality (/work-orders/$id) inspects & approves
  → Citizen (/complaint/$id) sees "Resolved" in timeline
```

## Flow 2: Community Budgeting → Tender → Contractor Bid → Work Order

```
Citizen (/projects) votes on "Solar Streetlights"
  → Municipality sees demand, creates Tender (/tenders/new)
  → Contractor (/tenders/$id) submits bid
  → Municipality (/tenders/$id) awards winning bid
  → System creates Work Order
  → Contractor (/work-orders/$id) executes work
  → Municipality inspects → Approves bill → Payment
```

## Flow 3: Complex Emergency → Multi-Department Orchestration

```
Officer uses Smart Composer (/smart-composer)
  → Describes "Water pipe burst causing road collapse"
  → AI breaks into: Water Board ticket + PWD Roads ticket
  → Backend (integrations.py) dispatches webhooks to external systems
  → Case Passport (/case/$id) tracks all department responses
  → Live Orchestration (/live-orchestration) shows real-time topology
```

## Flow 4: Contractor Reputation Loop

```
Contractor completes work (/work-orders/$id)
  → Municipality inspects quality
  → Backend (reputation.py) calculates Trust Score
  → Score appears on Contractor's Performance page (/performance)
  → Score is public on Citizen's Contractor Ratings page (/contractors)
  → Citizens can rate contractors → Feeds back into score
  → Municipality uses scores when evaluating future bids
```

## Flow 5: AI Triage Pipeline

```
Citizen submits complaint text
  → Backend (ai.py) runs NLP classification
  → Detects: Category = "Water Supply", Severity = "High"
  → Checks for nearby duplicates (getNearbyComplaints)
  → If duplicate found → Citizen can upvote existing issue
  → If new → Creates complaint → Appears in Officer's AI Triage queue
  → Officer approves or overrides AI suggestion
```

---

> **End of document.** This covers every single feature, button, form field, API endpoint, and data flow in the Civic Sathi platform.
