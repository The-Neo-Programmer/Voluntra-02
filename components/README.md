# 🌐 Voluntra
### AI-Assisted Volunteer Coordination & Smart Resource Allocation for Social Impact

> **Hackathon:** Cepeus 2.0 — April 22–23, 2026
> **Category:** Social Impact / AI / Operations
> **Status:** MVP v4 — Demo-Ready

---

## 📌 What Is Voluntra?

Voluntra is a **real-time operational coordination platform** for NGOs, field coordinators, and volunteer networks. It solves a critical problem in humanitarian operations: community need data is collected through fragmented channels — paper surveys, WhatsApp messages, phone calls, field notes — making it nearly impossible to triage, prioritize, and respond efficiently.

Voluntra converts that chaos into a structured, intelligent coordination system.

**The core loop:**
```
INTAKE → PRIORITIZE → MATCH → ASSIGN → TRACK → ANALYZE
```

---

## 🚨 The Problem

Local NGOs and community groups face:

- **Data fragmentation** — need reports come from paper surveys, calls, and scattered field notes
- **Missed urgency** — coordinators cannot identify the most critical cases fast enough
- **Poor volunteer matching** — assigning the wrong person wastes time and resources
- **Invisible shortages** — resource gaps discovered too late to act
- **Slow response cycles** — manual coordination creates dangerous delays

---

## ✅ What Voluntra Solves

| Problem | Voluntra's Solution |
|---|---|
| Fragmented intake | Unified need intake form with structured fields |
| No prioritization | Deterministic priority scoring engine (score + explanation) |
| Inefficient assignment | Smart volunteer-to-task matching with explainable recommendations |
| No field tracking | Volunteer mobile task workflow: accept → check-in → update → complete |
| Resource blindness | Inventory tracking + shortage reporting with dashboard alerts |
| No operational visibility | Live coordinator dashboard with KPIs, triage queue, task board |
| No accountability | Activity log, notification system, shortage escalation trail |

---

## 🧠 Core Features

### 1. 🗂️ Unified Need Intake
Coordinators can log need requests from any source (paper survey, field report, partner NGO, manual entry). Each request captures category, urgency, affected population, vulnerable groups, location, and requested resources.

### 2. 📊 Priority Scoring Engine
Every request automatically receives a **priority score (0–100)** and a **risk tier (High / Medium / Low Risk)** based on:
- Urgency level (weighted)
- Category criticality (Medical > Food > Shelter > ...)
- Number of people affected
- Vulnerability tags (elderly, children, disabled, etc.)
- Age of request (older unresolved = higher score)

Each score includes a **human-readable explanation**, so coordinators always understand *why* a case is critical.

### 3. 🤝 Smart Volunteer Matching Engine
For any request, Voluntra computes the best-fit volunteers based on:
- **Skill match** (matched to category requirement map)
- **Zone proximity** (preferred zone match)
- **Availability / workload** (penalizes overloaded volunteers)
- **Trust & reliability** (Trusted > Verified > Unverified)

Results are shown with **match score + reason chips** so the assignment decision is always transparent and auditable.

### 4. 📋 Live Operations Dashboard
The command center for NGO coordinators:
- **KPI strip**: Open Requests, Critical Needs, Active Tasks, Ready Volunteers, Open Shortages
- **Priority Triage Queue**: Top requests sorted by score, filterable
- **Zone Intelligence Panel**: Demand density by zone with color-coded strain indicators
- **Live Activity Feed**: Real-time log of all system events

### 5. 📦 Inventory & Shortage Tracking
- Track inventory items by category, zone, and stock level
- Low stock / depleted alerts surfaced on dashboard
- Shortage reports linkable to requests and tasks
- Partner NGOs can claim shortages to provide supply support

### 6. 📱 Volunteer Mobile Task Flow
Mobile-first volunteer experience:
- View assigned and recommended tasks
- Accept or decline tasks
- Check in on arrival
- Report field shortages
- Mark tasks complete with proof fields

### 7. 🔔 Notification System
In-app notifications for: new critical requests, volunteer assignments, shortage alerts, task status changes — all with unread count visible in the topbar.

### 8. 📈 Impact Analytics
Charts and KPIs covering: task velocity over time, requests by category, beneficiaries served, response time, and completion rate.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 |
| **State Management** | Zustand v5 |
| **Charts** | Recharts v3 |
| **Icons** | Lucide React |
| **Utilities** | clsx, tailwind-merge |
| **Backend** | Mocked (in-memory Zustand store with seeded data) |

---

## 📁 Project Structure

```
voluntra/
├── app/                     # Next.js App Router pages
│   ├── dashboard/           # Operations dashboard
│   ├── requests/            # Request intake & detail
│   ├── tasks/               # Task Kanban board
│   ├── volunteers/          # Volunteer directory
│   ├── inventory/           # Inventory management
│   ├── shortages/           # Shortage reports
│   ├── analytics/           # Impact analytics
│   ├── partners/            # Partner NGO panel
│   ├── volunteer/           # Volunteer mobile view
│   └── auth/                # Login & role selection
├── components/
│   ├── layout/              # App shell, sidebar, topbar
│   ├── requests/            # Request form, list, detail components
│   └── shared/              # Reusable UI: metric cards, status chips, avatars
├── lib/
│   ├── logic/               # Priority engine + matching engine
│   ├── store/               # Zustand global state (app-store.ts)
│   └── services/            # Request service layer
├── data/                    # Seeded demo data (requests, users, inventory, operations)
└── types/                   # TypeScript interfaces for all entities
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🎭 Demo Walkthrough

The recommended demo sequence for judges:

1. **Open Dashboard** → See live KPIs, triage queue, activity feed
2. **Review Priority Queue** → Identify highest-scored critical requests
3. **Open a Request** → See priority score + explanation + recommended volunteers
4. **Assign Volunteer** → Select from smart-matched top 3 with reason chips
5. **Switch to Volunteer View** → Accept task, check in, report shortage
6. **Return to Dashboard** → See activity feed updated, shortage reflected
7. **Check Inventory** → See low stock alerts, shortage panel
8. **Open Analytics** → Show impact: task velocity, category breakdown

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **Admin** | Full system access: all requests, volunteers, inventory, analytics |
| **Field Coordinator** | Zone-level request and task management, shortage escalation |
| **Volunteer** | Task feed, accept/decline, check-in, field updates |
| **Partner NGO** | Shortage visibility, support capacity offering |

---

## 📊 Data Model Highlights

**Core entities:** `NeedRequest`, `User` (volunteers/admins), `InventoryItem`, `ShortageReport`, `ActivityLog`, `Notification`, `PartnerNGO`

**Scoring system:** Deterministic, rule-based, fully explainable. No black-box AI.

**Seed data includes:**
- 1 Admin + 2 Coordinators
- ~15 Volunteers (varied skills, zones, trust levels)
- ~30 Requests (varied urgency and categories)
- 12 Inventory items
- 6 Shortage reports
- 4 Partner NGOs
- Rich activity log

---

## 🔮 Roadmap (Post-MVP)

- [ ] Real-time sync (Supabase/Firebase backend)
- [ ] AI-assisted request classification from free text
- [ ] Offline-first field mode with delayed sync
- [ ] Map-based demand/volunteer visualization
- [ ] SMS/WhatsApp notification integration
- [ ] Role-based authentication (Supabase Auth)
- [ ] Route optimization for resource delivery
- [ ] Multilingual UI (Hindi, Kannada, Tamil)
- [ ] Public beneficiary request portal
- [ ] QR-based volunteer check-in

---

## 🏆 Why Voluntra Wins

- **Real problem**: Fragmented NGO operations cost lives — this is not a toy use case
- **Complete loop**: End-to-end from data intake to impact measurement
- **Explainable intelligence**: Every recommendation and score is transparent
- **Demo-ready**: Rich seed data, smooth UX, clear narrative
- **Scalable architecture**: Clean separation of logic, state, and UI
- **Mobile-first**: Volunteer flows are designed for field usability

---

*Built for Cepeus 2.0 Hackathon — April 22–23, 2026*
