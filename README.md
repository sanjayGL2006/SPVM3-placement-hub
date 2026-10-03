# 🎓 Placement Pro — AI-Powered Enterprise Placement & Drive Management System

> An enterprise-grade, full-stack Placement & Career Management platform built with React 19, TypeScript, Tailwind CSS with 2026 Pinterest academic design standards, Node.js/Express + Python FastAPI backends, PostgreSQL relational database, Prisma ORM, and native iOS/Android mobile deployment architecture.

---

## 🏗️ Architecture & Technology Stack

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │           SPVM3 / Placement Pro Ecosystem              │
                                  └────────────────────────────────────────────────────────┘
                                                               │
                        ┌──────────────────────────────────────┴──────────────────────────────────────┐
                        ▼                                                                            ▼
        ┌─────────────────────────────────┐                                          ┌─────────────────────────────────┐
        │   Frontend & Mobile Client      │                                          │      Backend & Data Engine      │
        │   (React 19 + TypeScript + Vite)│                                          │ (Node/Express + FastAPI + PG)   │
        ├─────────────────────────────────┤                                          ├─────────────────────────────────┤
        │ • 2026 Pinterest Design System   │                                          │ • Node.js Express TypeScript API│
        │ • Zustand Persistent State      │                                          │ • Python FastAPI ASGI Async Svc │
        │ • Recharts + Framer Motion      │                                          │ • PostgreSQL + Prisma Schema    │
        │ • Capacitor (iOS 15+ / Android) │                                          │ • JWT Role-Based Auth & RBAC    │
        │ • Axe-core a11y & Playwright E2E│                                          │ • Granular Data Wipe & Soft-Del │
        │ • Responsive Mobile App Shell   │                                          │ • Multi-format Reporting Engine │
        └─────────────────────────────────┘                                          └─────────────────────────────────┘
```

### 1. Frontend Architecture (`apps/web`)
- **Core:** React 19 + TypeScript + Vite
- **Design System:** 2026 Pinterest Academic Palette (`#FAF8F5` Cream & `#121212` Charcoal Dark), `rounded-3xl` cards, soft shadows, progressive drawers, floating action widgets
- **State Management:** Zustand with LocalStorage persistence for Students, Companies, Pipeline, Auth, Notifications, and Settings
- **Mobile Foundation:** Capacitor 6.0 config, CSS `env(safe-area-inset-*)`, viewport dynamic unit scaling (`100dvh`), fixed typography hierarchy (24pt title / 18pt section / 14-16pt body)
- **Data Visualization:** Recharts (Placement Cohort Trends, Salary Distribution, Skills Radar)
- **Document Generation:** `xlsx` (Excel import/export), `jspdf` + `html2canvas` (PDF export), and Custom Text Report (.txt) generator

### 2. Backend Architecture (`apps/api` & `apps/backend_python`)
- **Node.js Express API (`apps/api`):** TypeScript, Express 4.21, Zod schema validation, Rate Limiting, Helmet security headers, Vercel Serverless entrypoint
- **Python FastAPI Backend (`apps/backend_python`):** Python 3.11+ with FastAPI & Uvicorn ASGI server, SQLAlchemy ORM + Pydantic v2 schemas
- **Database Engine (`packages/database`):** PostgreSQL relational database with Prisma schema (`schema.prisma`) and raw DDL (`schema.sql`)
- **Security:** OAuth2 Password Bearer, bcryptjs password hashing, JWT access tokens with department isolation scopes

---

## 🚀 Quick Start & Running Locally

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Python**: `3.10` or higher
- **Package Manager**: `npm` (v10+)

### 1. Monorepo Setup & Frontend Development Server
```bash
# Clone the repository
git clone https://github.com/sanjayGL2006/SPVM3-placement-hub.git
cd SPVM3-placement-hub

# Install Monorepo dependencies
npm install

# Start Vite React Web & Mobile Preview Server
npm run dev:web
# -> Open http://localhost:5173
```

### 2. Node.js Express API Server
```bash
# Start Express API in development mode
npm run dev:api
# -> Express API running on http://localhost:5000
```

### 3. Python FastAPI Backend Server
```bash
# Navigate to backend directory
cd apps/backend_python

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run database seed & start FastAPI server
python seed.py
uvicorn main:app --reload --port 8000
# -> Interactive Swagger API Docs: http://localhost:8000/docs
```

### 4. Production Build & Validation
```bash
# Typecheck and production bundle build for all workspaces
npm run build

# Preview production web build locally
npm run preview
```

### 5. 🐳 Docker Containerization & Compose (Local Multi-Container)
```bash
# Build and start PostgreSQL, Redis, FastAPI Backend & React Nginx Frontend
docker compose up -d --build

# View container status and health
docker compose ps

# View backend and frontend logs
docker compose logs -f backend frontend

# Stop containers
docker compose down
```

### 6. ☸️ Kubernetes (K8s) Cluster Deployment
```bash
# Apply entire stack with Kustomize (Namespace, ConfigMaps, Secrets, Postgres, Redis, Deployments, Services, HPA, Ingress)
kubectl apply -k k8s/

# Check pod and deployment status
kubectl get pods -n placement-pro -w

# Check services and ingress
kubectl get svc,ingress,hpa -n placement-pro
```

---

## 🔑 Predefined Demo Credentials

Instant one-click authentication is enabled on the Login Page and via the top-bar **Instant Role Switcher**:

| Role | Department / Scope | Email | Password |
|:-----|:-------------------|:------|:---------|
| **Principal (Super Admin)** | College-Wide (Full Access) | `principal@college.edu` | `Principal@2026` |
| **HOD (BCA)** | Computer Applications (BCA) | `hod.bca@college.edu` | `HodBca@2026` |
| **HOD (BBA)** | Business Administration (BBA) | `hod.bba@college.edu` | `HodBba@2026` |
| **HOD (B.Com)** | Commerce (B.Com) | `hod.bcom@college.edu` | `HodBcom@2026` |
| **HOD (B.Sc)** | Science (B.Sc CS) | `hod.bsc@college.edu` | `HodBsc@2026` |
| **HOD (Hotel Mgmt)** | Hotel Management (BBA HM) | `hod.hm@college.edu` | `HodHm@2026` |
| **Coordinator (BCA)** | Computer Applications | `coord.bca@college.edu` | `CoordBca@2026` |
| **Coordinator (BBA)** | Business Administration | `coord.bba@college.edu` | `CoordBba@2026` |
| **Coordinator (B.Com)** | Commerce | `coord.bcom@college.edu` | `CoordBcom@2026` |
| **Faculty (View-Only)** | College-Wide (Read-Only) | `faculty@college.edu` | `Faculty@2026` |
| **Student (BCA)** | Computer Applications · Sec A | `student.bca@college.edu` | `Student@2026` |
| **Student (BBA)** | Business Administration · Sec B | `student.bba@college.edu` | `Student@2026` |

---

## ✨ Key Functional Modules & Features

### 📅 1. Placement Calendar & Executive Insights
- **Live Month Navigation:** Defaults to **September 2026** with stepper controls (`<`, `>`) and quick jump to `Today`.
- **7-Day Weekday Headers:** Clean column format (`S M T W T F S`).
- **Dynamic Scheduler Banner:**
  > *"1 Placement Drive(s) scheduled in September 2026. Click a highlighted date to view details."*
- **Interactive Drive Inspection:** Clicking highlighted dates reveals company badges, CTC packages, venue details, and direct pipeline navigation.

### 🏢 2. Company Drive Detail Page & 9-Stage Candidate Pipeline (`/companies/:id/drive`)
- **9 Interactive Metric Cards:**
  1. `Interested` — Initial candidates signaling interest.
  2. `Assigned` — Candidates mapped to the recruitment drive.
  3. `Aptitude` — In online screening and cognitive evaluation.
  4. `Technical` — In technical code pair / problem solving rounds.
  5. `HR` — In culture fit and leadership assessment.
  6. `Selected` — Qualified candidates receiving offers.
  7. `Rejected` — Disqualified candidates (with stage tracking).
  8. `Offer Given` — Official letter release with finalized package CTC.
  9. `Joined` — Final candidate onboarding confirmation.
- **Candidate Pipeline Roster Table:** Search, filter by stage/department, view CGPA, active stage, and single-click **"Update Stage"** modal.
- **Stage Progression Modal:** Advance candidate through Aptitude, Technical, GD, HR, Selected, IR, Offer Letter Request, and Joined with automated audit notes.

### 👥 3. Student Selection & Top Action Buttons
- **Multi-select & Individual Row Selection:** Select all or pick individual candidates.
- **Top Action Bar:**
  - **Company Drive:** Opens searchable modal to assign selected students into specific company drives.
  - **Download Excel:** Exports selected cohort records into formatted `.xlsx` workbook.
  - **Bulk Delete:** Removes selected candidates with safe relocation into the **Recycle Bin**.

### 🗑️ 4. Granular Reset & Recycle Bin
- **Selective Data Reset:** Wipe only Students, wipe only Companies, or perform a Full System Wipe.
- **Recycle Bin Tab:** View soft-deleted records with timestamps, deleter metadata, and **1-Click Restore**.

### 🤖 5. AI Intelligence & Career Acceleration Suite
- **AI Placement Chatbot:** Context-aware natural language assistant with RBAC boundary enforcement.
- **ATS Resume Analyzer:** Real-time resume parsing, keyword scoring (0–100), and formatting advice.
- **AI Resume Builder:** Single-column ATS-optimized PDF resume builder with 1-click download.
- **Skills Gap Radar:** Real-time radar visualization benchmarking candidate skills against industry targets.
- **AI Mock Test & Interview Coach:** Timed aptitude quizzes and simulated voice/text interview coaching.

---

## 📱 Cross-Platform Mobile Deployment (iOS & Android)

The application includes built-in Capacitor configuration supporting iOS 15+ and Android 7.0+ (API 24+):

```bash
# Build web production bundle
npm run build

# Add iOS / Android native targets
npx cap add ios
npx cap add android

# Sync assets to native project
npx cap sync

# Open in Xcode or Android Studio
npx cap open ios
npx cap open android
```

---

## 🧪 Comprehensive Quality Engineering & SDET Strategy

```
┌─────────────────────────────────┬─────────────────────────────────────────────────────────────┐
│ Quality Pillar                  │ Toolchain & Strategy                                        │
├─────────────────────────────────┼─────────────────────────────────────────────────────────────┤
│ **Unit & Component**            │ Vitest, React Testing Library, MSW network mocking (≥85% cov)│
│ **API & Contract**              │ Playwright API Test Fixtures, Zod schema validation, Pact   │
│ **Visual Regression**           │ Playwright Snapshot Diffing (Chromium, Firefox, WebKit)     │
│ **Accessibility (a11y)**        │ @axe-core/playwright enforcing zero WCAG 2.1 AA violations  │
│ **Performance & Load**          │ k6 scenario scripts (p95 < 300ms, soak & spike testing)     │
│ **CI/CD Orchestration**         │ 4-way sharded GitHub Actions with Allure Quality Reporting  │
└─────────────────────────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 📄 Repository Structure

```
├── apps/
│   ├── web/                           # React 19 Frontend Application
│   │   ├── src/
│   │   │   ├── app/                   # App routes, Layout, Sidebar, Navbar
│   │   │   ├── features/
│   │   │   │   ├── auth/              # Login, Role Switcher, Zustand Auth Store
│   │   │   │   ├── dashboard/         # Executive Insights, Placement Calendar, KPI Cards
│   │   │   │   ├── students/          # Student Directory, Assign Modal, Drawer
│   │   │   │   ├── companies/         # Company Directory, Drive Detail Page, Update Modal
│   │   │   │   ├── ai-intelligence/   # AI Chatbot, ATS Analyzer, Resume Builder, Mock Tests
│   │   │   │   ├── placements/        # Drives, Applications, Interview Management
│   │   │   │   ├── reports/           # Executive Reports & Analytics Export
│   │   │   │   └── settings/          # Granular Wipe, System Seed, Recycle Bin
│   │   │   ├── shared/                # UI Components, Modals, Tables, Export Helpers, Mobile Shell
│   │   │   └── index.css              # Pinterest Design System & Safe Area CSS Variables
│   │   └── capacitor.config.ts        # Mobile native bridge configuration
│   │
│   ├── api/                           # Node.js TypeScript Express Backend
│   │   ├── src/
│   │   │   ├── controllers/           # Auth, Student, Company, Drive, Reports controllers
│   │   │   ├── middleware/            # JWT Auth & Error Handling
│   │   │   └── server.ts              # Express Server entrypoint
│   │   ├── api/index.ts               # Vercel Serverless function handler
│   │   └── package.json
│   │
│   └── backend_python/                # Python FastAPI Backend
│       ├── main.py                    # ASGI App entrypoint & CORS middleware
│       ├── database.py                # PostgreSQL Connection Pool & Session
│       ├── models.py                  # SQLAlchemy ORM Models (Students, Companies, Pipeline)
│       ├── schemas.py                 # Pydantic Request/Response validation models
│       ├── seed.py                    # Database Seeder with 220 students & 40 companies
│       ├── schema.sql                 # Pure PostgreSQL DDL Schema
│       ├── routers/                   # Modular API route controllers
│       └── requirements.txt           # Python backend dependencies
│
├── packages/
│   └── database/                      # Prisma ORM Schema & Migrations
│       ├── prisma/schema.prisma       # PostgreSQL Prisma Relational Model
│       └── prisma/seed.ts             # Database Seeding script
│
├── k8s/                               # Production Kubernetes Manifests (Ingress, HPA, ConfigMaps)
├── performance/                       # k6 High-throughput Load Testing Scenarios
├── tests/                             # Playwright API & Stage Progression Test Suites
├── docker-compose.yml                 # Local Multi-Container Orchestration
├── .github/workflows/                 # CI/CD Quality Gate & Sharded Test Pipeline
└── README.md                          # Master Project Documentation
```

---

## 📄 License
MIT © 2026 SPVM3 / Placement Pro Ecosystem. Built for excellence in university placements.
