# Remix of Remix of Remix of Citizen Connect Hub

Build a premium, production-quality PUBLIC/CITIZEN PORTAL for:

CivicSathi

Government Grievance Intelligence Platform

IMPORTANT:

This is ONLY the public citizen portal.

Do NOT build municipality, officer, super-admin, or internal government dashboards yet.

The public portal will later connect to a separate backend developed by another team. For now, use clean mock data and a service/API abstraction so the backend can be connected without redesigning the frontend.

==================================================

PRODUCT PURPOSE

==================================================

CivicSathi allows citizens to report civic problems and helps connect individual complaints into larger patterns.

Citizens can:

• Create an account

• Sign in

• Report a civic problem

• Use live GPS location

• Adjust location manually on a map

• Upload a photo

• Receive AI-assisted category/severity suggestions

• See nearby/related complaint patterns

• See hotspot areas when multiple similar issues occur nearby

• Track their own complaints

• Receive status notifications

• Manage their profile

Supported issue types:

Water Supply

Road Damage

Garbage Collection

Drainage

Sewage

Street Lighting

Electricity

Public Transport

Sanitation

CORE DEMO:

Citizen writes:

"There has been no water supply in our area for three days."

CivicSathi analyzes:

Category: Water Supply

Severity: High

Location: Ward 14

Then shows:

127 related reports

and:

"Multiple similar reports detected in this area."

The map should visually show a concentrated hotspot.

==================================================

DESIGN DIRECTION

==================================================

Create a sophisticated civic-tech interface.

The visual identity should feel:

Premium

Elegant

Trustworthy

Institutional

Modern

Calm

Human

Intelligent

Secure

Think:

"next-generation civic infrastructure platform"

NOT:

generic SaaS

generic AI startup

crypto dashboard

gaming interface

colorful startup landing page

The UI must look carefully designed by a professional product designer.

==================================================

ABSOLUTE COLOR RESTRICTIONS

==================================================

NEVER USE:

Blue

Purple

Gold

Golden

Rainbow

Rainbow gradients

Neon

Cyan

Magenta

Pink gradients

Bright multicolor gradients

Do not use blue for buttons.

Do not use purple for AI elements.

Do not use gold for premium elements.

Do not use rainbow colors anywhere.

Do not introduce accidental blue/purple default component colors.

==================================================

PRIMARY COLOR SYSTEM

==================================================

Use an elegant grey/charcoal/green palette.

DARK MODE:

Background:

#080A0C

Background secondary:

#0D1012

Surface:

#121619

Elevated surface:

#171C1F

Glass:

rgba(255,255,255,0.045)

Glass stronger:

rgba(255,255,255,0.065)

Glass border:

rgba(255,255,255,0.10)

Primary text:

#F2F4F3

Secondary text:

#A1A8AC

Muted text:

#6D767B

Border:

#252C30

Primary accent:

#4A9277

Secondary accent:

#5C806F

Critical:

#C85B5B

Warning:

#B28A52

Success:

#4A9277

LIGHT MODE:

Background:

#EEF0EE

Secondary background:

#E5E8E6

Surface:

rgba(255,255,255,0.72)

Elevated surface:

rgba(255,255,255,0.84)

Glass:

rgba(255,255,255,0.55)

Glass stronger:

rgba(255,255,255,0.72)

Glass border:

rgba(255,255,255,0.72)

Primary text:

#171B1D

Secondary text:

#596267

Muted text:

#7A8387

Border:

rgba(30,38,40,0.12)

Primary accent:

#397B62

Secondary accent:

#527A69

Critical:

#B84E4E

Warning:

#9A743F

Success:

#397B62

IMPORTANT:

The light theme must NOT simply be "white mode".

It should have a sophisticated frosted-glass appearance with soft grey surfaces, translucent cards, subtle shadows, blurred backgrounds, and layered depth.

==================================================

GLASSMORPHISM

==================================================

Glassmorphism is a major part of the visual identity.

Use:

backdrop-filter: blur()

semi-transparent surfaces

very subtle white/black borders

soft shadows

layered surfaces

subtle highlights

background depth

Recommended glass style:

Dark:

background rgba(255,255,255,0.045)

border 1px solid rgba(255,255,255,0.10)

backdrop-filter blur(18px)

Light:

background rgba(255,255,255,0.55)

border 1px solid rgba(255,255,255,0.72)

backdrop-filter blur(18px)

Use glass for:

• Navigation

• Hero panels

• Complaint cards

• AI analysis panels

• Location cards

• Floating map panels

• Notifications

• Profile cards

• Modals

• Bottom sheets

• Important status cards

Do NOT make everything glass.

Dense forms and data-heavy areas can use more solid surfaces for readability.

The glass should look expensive and subtle, not like a translucent template.

==================================================

DEPTH SYSTEM

==================================================

Create visual depth using:

background layers

blurred ambient shapes

soft shadows

transparent surfaces

thin borders

subtle inner highlights

different surface elevations

Avoid strong drop shadows.

Dark mode:

use soft black shadows.

Light mode:

use soft grey shadows.

Never use colorful glow effects.

==================================================

TYPOGRAPHY

==================================================

Use Inter or Geist.

Typography should feel modern and premium.

Large headlines:

strong, clean, confident.

Body:

comfortable and highly readable.

Small labels:

subtle uppercase typography with slight letter spacing.

Use consistent type scale.

Avoid decorative fonts.

==================================================

LAYOUT

==================================================

Use a responsive design system.

Desktop:

large visual spacing and centered content.

Tablet:

compact spacing.

Mobile:

mobile-first citizen experience.

The public portal must feel excellent on a phone because citizens may primarily use mobile devices.

Do NOT simply shrink desktop layouts.

==================================================

NAVIGATION

==================================================

Create a floating/glass navigation bar.

Desktop:

CivicSathi logo

Home

How It Works

Report Problem

My Complaints

Right:

Notifications

Profile

Sign In / Account

The navigation should have:

glass background

backdrop blur

thin border

subtle shadow

smooth hover state

On scroll, slightly increase blur/background opacity.

Mobile:

Use a compact glass header and appropriate mobile navigation/bottom navigation.

==================================================

HOVER EFFECTS

==================================================

Every interactive element should have a polished hover state.

Buttons:

slight brightness increase

subtle vertical movement

soft shadow

smooth transition

Glass cards:

slight lift

border becomes slightly more visible

very subtle background increase

shadow increases slightly

Cards should NOT jump.

Use approximately:

transform translateY(-2px)

Transitions:

150–300ms

Links:

subtle color transition

small underline/opacity change where appropriate

Map markers:

soft scale animation

Navigation items:

subtle background highlight

Use smooth ease-out transitions.

==================================================

MICRO INTERACTIONS

==================================================

Include:

button press feedback

card hover

input focus animation

checkbox animation

toggle animation

dropdown transition

modal transition

toast animation

notification entrance

map marker appearance

upload progress

AI processing animation

status transitions

Do not over-animate.

The interface should feel alive but calm.

==================================================

LIGHT / DARK MODE

==================================================

Implement a real theme system.

The user can switch:

Dark

Light

System

Persist the selected theme.

Dark mode:

deep charcoal + frosted glass.

Light mode:

soft grey/off-white + frosted white glass.

Both modes must feel intentionally designed.

Do NOT make the light theme pure white.

Do NOT make the dark theme pure black.

All components must remain readable in both modes.

Check:

buttons

inputs

cards

maps

dialogs

notifications

badges

icons

empty states

loading states

hover states

in both themes.

==================================================

ROUTES

==================================================

Create:

/

/login

/register

/report

/analyzing

/complaint/:id

/complaints

/notifications

/profile

==================================================

LANDING PAGE

==================================================

Hero:

CivicSathi

"Make your city better, one report at a time."

Supporting text:

"Report civic problems with location and evidence. CivicSathi helps connect individual complaints into larger patterns so public-service issues can be identified faster."

Primary CTA:

REPORT A PROBLEM

Secondary CTA:

HOW IT WORKS

Hero visual:

Create a beautiful glass city/map visualization.

Show subtle civic issue markers.

Most areas should look normal.

One area should contain multiple related markers forming a subtle hotspot.

Use:

neutral grey

muted green

muted amber

muted red

No rainbow map.

Add subtle animated movement to the map markers.

==================================================

HOW IT WORKS

==================================================

Four steps:

01 REPORT

Tell CivicSathi what happened.

02 LOCATION

Use your current location or choose a location manually.

03 EVIDENCE

Upload a photo if available.

04 TRACK

Follow your complaint and receive updates.

Use glass cards with elegant hover effects.

==================================================

REPORT PAGE

==================================================

Create a beautiful multi-step complaint flow.

STEP 1:

WHAT HAPPENED?

Large glass textarea.

Placeholder:

"Describe the problem in your own words..."

Example:

"There has been no water supply in our area for three days."

Do not force users to select a category first.

CivicSathi should suggest the category.

==================================================

LOCATION STEP

==================================================

Title:

WHERE IS THE PROBLEM?

Buttons:

USE MY CURRENT LOCATION

SELECT ON MAP

Request browser geolocation permission only after user interaction.

Show:

Detecting your location...

Then:

Location detected

Ward 14

Use an interactive Leaflet/OpenStreetMap map if available.

Allow:

• drag marker

• zoom

• adjust location

• confirm location

Explain:

"Location helps CivicSathi identify nearby reports and understand where civic problems are concentrated."

==================================================

PHOTO STEP

==================================================

Title:

ADD PHOTO

Allow:

Camera

Gallery

File upload

Show beautiful image preview.

Actions:

Replace

Remove

Upload card should have a subtle glass hover state.

==================================================

AI IMAGE ANALYSIS

==================================================

When photo is uploaded, show:

ANALYZING IMAGE

Then example:

Detected:

Possible road surface damage

Suggested category:

Road Damage

Confidence:

High

OR:

Detected:

Garbage accumulation

Suggested category:

Garbage Collection

The user can:

CONFIRM

or:

CHANGE CATEGORY

Always communicate this as AI-assisted.

Never claim perfect visual certainty.

==================================================

AI PROCESSING

==================================================

After submitting:

Create a polished full-screen or centered glass processing panel.

CivicSathi INTELLIGENCE

Analyzing your report...

✓ Understanding complaint

✓ Detecting civic category

✓ Evaluating severity

✓ Checking location

✓ Finding nearby related reports

✓ Preparing your report

Use animated checkmarks and subtle progress.

Do not artificially delay the interface unnecessarily.

==================================================

ANALYSIS RESULT

==================================================

Show:

YOUR REPORT

Complaint text

AI-SUGGESTED CATEGORY

Water Supply

SEVERITY

High

LOCATION

Ward 14

RELATED REPORTS

127

Highlight "127" elegantly.

Show:

"CivicSathi found other reports that may describe a similar civic issue nearby."

CTA:

VIEW RELATED ACTIVITY

==================================================

HOTSPOT VISUALIZATION

==================================================

This is an important CivicSathi feature.

If multiple similar complaints occur in one area:

Show:

MULTIPLE REPORTS DETECTED

"Several similar civic reports have been detected in this area."

Map:

show aggregated hotspot

Use muted red for high concentration.

Do NOT reveal private citizen identities or unnecessary exact personal locations.

Show aggregate information:

23 similar reports within approximately 500m

127 related reports in Ward 14

==================================================

COMPLAINT CONFIRMATION

==================================================

Show an elegant confirmation screen.

COMPLAINT RECEIVED

Complaint ID:

JN-2026-00127

Category:

Water Supply

Location:

Ward 14

Status:

Received

CTA:

TRACK COMPLAINT

Use subtle success animation.

==================================================

MY COMPLAINTS

==================================================

Create a premium complaint history.

Each card:

Complaint ID

Category

Date

Location

Status

Statuses:

Received

Under Review

Assigned

In Progress

Resolved

Closed

Use only semantic colors.

No rainbow badges.

==================================================

COMPLAINT DETAILS

==================================================

Show:

Complaint ID

Description

Photo

Category

Severity

Location

Date

Status

Timeline:

Submitted

↓

CivicSathi analyzed

↓

Municipality received

↓

Officer assigned

↓

In progress

↓

Resolved

Use animated timeline progression.

==================================================

NOTIFICATIONS

==================================================

Show:

Complaint received

Complaint assigned

Status changed

Resolution update

Use glass notification cards.

==================================================

PROFILE

==================================================

Show:

Name

Email

Phone

Location/preferences

Notification settings

Allow:

Edit profile

Change password

Logout

Keep the profile minimal.

==================================================

MAP PRIVACY

==================================================

Public users can see:

their own complaint location

generalized nearby issue activity

aggregated hotspots

Do NOT expose:

other citizens' names

phone numbers

email addresses

private profiles

unnecessary exact personal locations

==================================================

MOCK API ARCHITECTURE

==================================================

The real backend will be connected later.

Create a clean service layer.

Example:

services/api.ts

Functions:

registerUser()

loginUser()

getCurrentUser()

createComplaint()

uploadComplaintPhoto()

analyzeComplaint()

getComplaint()

getMyComplaints()

getNearbyComplaints()

getNotifications()

updateProfile()

Use mock implementations for now.

Keep all mock data centralized.

Do NOT scatter mock data across components.

Use environment variables for the future API base URL.

==================================================

COMPONENT SYSTEM

==================================================

Create reusable components:

GlassCard

GlassButton

GlassInput

GlassModal

PageTransition

LocationPicker

MapPanel

ComplaintForm

PhotoUploader

AIAnalysisCard

ComplaintCard

ComplaintTimeline

StatusBadge

SeverityBadge

NotificationItem

EmptyState

LoadingState

ErrorState

Toast

ThemeToggle

Use a consistent design system.

==================================================

LOADING / EMPTY / ERROR

==================================================

Every important async interaction needs:

Loading state

Success state

Empty state

Error state

Loading:

"Analyzing your report..."

Error:

"We couldn't analyze your report right now."

[Try Again]

Empty:

"You haven't submitted any reports yet."

[Report a Problem]

Never show blank screens.

==================================================

ACCESSIBILITY

==================================================

Use:

semantic HTML

keyboard navigation

visible focus states

accessible labels

good contrast

ARIA where appropriate

reduced motion support

Do not sacrifice accessibility for glass effects.

==================================================

PERFORMANCE

==================================================

Optimize images.

Lazy-load heavy map components.

Avoid unnecessary rerenders.

Keep animations GPU-friendly.

Do not block the entire page while a single component loads.

==================================================

DEMO DATA

==================================================

Create realistic mock data.

Primary demo:

Water Supply

Ward 14

127 related reports

Example citizen complaint:

"There has been no water supply in our area for three days."

Additional similar reports:

"No water supply since Monday."

"Water has stopped in our neighborhood."

"Our taps have been dry for three days."

"No municipal water reaching our apartment."

Use aggregate data.

Clearly treat mock information as prototype data.

==================================================

FINAL VISUAL QUALITY CHECK

==================================================

Before finishing, review EVERY page in BOTH dark and light themes.

Check:

• typography

• spacing

• glass transparency

• backdrop blur

• borders

• shadows

• hover effects

• focus effects

• button states

• mobile responsiveness

• map appearance

• forms

• cards

• notifications

• loading states

• empty states

• error states

The result must look polished and intentional.

ABSOLUTE RESTRICTIONS:

NO BLUE

NO PURPLE

NO GOLD

NO GOLDEN

NO RAINBOW

NO NEON

NO RAINBOW GRADIENTS

Use:

charcoal

grey

off-white

muted green

muted red

minimal muted amber

==================================================

MOST IMPORTANT

==================================================

Do NOT build municipality/admin functionality.

Do NOT overcomplicate the citizen experience.

The citizen should be able to understand the application within seconds.

The primary experience is:

REPORT

→ LOCATION

→ PHOTO

→ AI ANALYSIS

→ RELATED REPORTS

→ HOTSPOT

→ TRACK STATUS

Make this flow exceptionally beautiful.

Build the design system first, then implement the pages and interactions.

Use reusable components and clean architecture.

Make every interaction feel smooth, premium, and deliberate. Perform a visual refinement pass on the entire CivicSathi public portal.

Do NOT change the product functionality or routes.

Focus exclusively on making the UI more aesthetic and premium.

Improve:

glassmorphism

backdrop blur

surface layering

border opacity

shadow depth

hover effects

button interactions

input focus states

micro animations

page transitions

card entrance animations

map interactions

AI processing animation

risk/status animations

mobile responsiveness

typography

spacing

visual hierarchy

The dark theme should feel like premium charcoal smoked glass.

The light theme should feel like frosted white/grey glass — NOT plain white.

Make dark and light themes equally beautiful.

Absolutely do not introduce:

blue

purple

gold

golden

rainbow

neon

cyan

pink gradients

Use only:

charcoal

grey

off-white

muted green

muted red

minimal muted amber.

Do not add unnecessary gradients.

Do not make every component transparent.

Do not overuse rounded corners.

Do not make the interface look like a generic AI SaaS template.

The final result should feel like a premium next-generation civic technology product.

## Development

This project uses [Bun](https://bun.com) — `bun.lock` is the lockfile of
record, so install and run with Bun rather than npm/yarn to avoid dependency
resolution mismatches.

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

Build for production (targets Vercel's serverless output via Nitro):

```sh
bun run build
```

See `AGENTS.md` for the mock-API contract the backend team should build
against, and what's still simulated (AI category/photo analysis, auth).
