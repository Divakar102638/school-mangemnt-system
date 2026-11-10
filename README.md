# EduNexa — Central Super Admin SaaS Platform (Phase 1)

Developed by **L.Tech Solutions**  
**Tagline:** *"One Platform. Every Campus. Connected Education."*

---

## 🌟 Overview

**EduNexa** is an enterprise-grade education management SaaS platform designed to manage and monitor diverse educational institutions — from primary and secondary schools to junior colleges, degree colleges, and large engineering academies.

> [!NOTE]  
> **Phase 1 Scope**: This release delivers the central Super Admin website and multi-institution management module. Parent and staff mobile applications will be developed in subsequent phases. This version runs in **DEMO MODE (Frontend-only Prototype)** with reliable, versioned `localStorage` persistence.

---

## 🚀 Key Features

### 1. Super Admin Authentication
- Modern, clean login interface with EduNexa and L.Tech Solutions branding.
- One-click demo credentials auto-fill:
  - **Email:** `superadmin@edunexa.demo`
  - **Password:** `Demo@123`
- Session persistence across reloads.

### 2. Executive Dashboard
- **Dynamic Stats:** Total Campuses, Active & Inactive counts, Total Student Population, Staff Counts, Assigned Administrators, Active Subscriptions, and Contracted Annual Recurring Revenue (₹ ARR).
- **Interactive Visualizations:**
  - Campus Registration Growth trends (monthly cohort bars).
  - Institution Category Distribution (School, Intermediate, Degree, Engineering, Other).
  - Subscription Revenue overview by tier.
- **Recent Onboardings:** Quick jump to newly registered campuses.

### 3. Institution Management (Core)
- **Sequential Non-Reusing ID Generator:** Prefixes `SCH001`, `COL001`, `ENG001`, `DEG001`, `OTH001`. Even if an institution is deleted, its ID is never reused for a new campus.
- **Comprehensive Campus Registration:**
  - *Basic Info:* Institution name, category, established year, logo, cover banner.
  - *Contact Info:* Principal/Dean name, official email, phone, street address, city, state, postal code.
  - *Subscription:* Tier selection, student quota capacity, enrolled students, faculty staff, classes, annual fee, validity dates.
  - *Primary Administrator:* Auto-created and linked with campus registry.
- **Full CRUD:** Register new, edit existing, toggle Active/Inactive, view detailed campus profile, and delete with safety confirmation.
- **Search, Filter & Sort:** Instant keyword search across name, ID, city; filter by institution type and active/inactive status; multiple sorting criteria.
- **Pagination:** Clean paginated table with empty state fallbacks.

### 4. Institution Profile Page
- Hero banner with campus cover photo, verified badge, and institutional logo.
- Metric cards for student count, staff, class sections, and sample attendance rate.
- Full address, principal contact card, and linked primary administrator details.
- Subscription status meter showing student quota utilization and days remaining to renewal.

### 5. Campus Administrators Management
- Delegate campus management to principals and academic registrars.
- Add, edit, enable/disable account toggles, and institution re-assignment.

### 6. Subscription Plans & Licensing
- Four distinct enterprise tiers:
  - **Starter:** Up to 300 students — ₹24,999/year
  - **Standard:** 301–800 students — ₹49,999/year *(Most Popular)*
  - **Premium:** 801–1,500 students — ₹79,999/year
  - **Enterprise:** 1,501–2,500+ students — Starting at ₹1,19,999/year
- Instant plan assignment modal to update any campus license and renewal dates.

### 7. Reports & CSV Export
- Multi-campus metric audit table with student-to-staff ratios and capacity utilization.
- Filter by category and one-click download to CSV spreadsheet (`EduNexa_Institutions_Report.csv`).

### 8. Campus Broadcasts & Notifications
- System-wide or campus-specific announcement dispatcher.
- Priority levels: *Info*, *Important*, *Urgent*.
- Unread notification badges and history feed.

### 9. Sponsored Campaigns & Advertisements
- Manage educational partner banners (STEM kits, textbooks, hardware).
- Live banner preview modal.

### 10. Settings & Demo Data Persistence
- L.Tech Solutions company profile and EduNexa branding configuration.
- Versioned `localStorage` storage schema (`v1.0`).
- **Reset Demo Data:** One-click factory reset back to initial sample institutions (Sunrise International School, Green Valley Junior College, Future Tech Engineering College) with double confirmation.

---

## 🛠 Tech Stack

- **Framework:** React 18 with TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Navy Blue `#0F172A`, Clean White, Teal `#0D9488` palette)
- **Icons:** Lucide React
- **Storage:** Browser `localStorage` (Schema Versioned)
- **Export:** Browser CSV Blob Generator

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/Divakar102638/school-mangemnt-system.git

# Navigate into project directory
cd school-mangemnt-system

# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 🏢 Developed By
**L.Tech Solutions**  
*One Platform. Every Campus. Connected Education.*
