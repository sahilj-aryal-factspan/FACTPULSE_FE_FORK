# Product Requirements Document (PRD)
## Fact+Pulse Delivery Governance Operating System
### Version 1.0 – Governance First MVP

---

## 1. Problem Statement

### 1.1 Current Scenario
Factspan manages multiple enterprise accounts such as Macy's, CVS, Baptist Health, and others. Each account contains multiple Buying Centers, stakeholders, and projects that are governed through recurring delivery processes and governance activities.

Currently, delivery information is fragmented across:
- Weekly Notes
- Weekly Business Reviews (WBRs)
- Monthly Business Reviews (MBRs)
- Quarterly Business Reviews (QBRs)
- Meeting Minutes (MOMs)
- PPT Decks
- Excel Trackers
- Google Drive Folders
- Emails
- Shared Repositories

Account Leads and Delivery Leads spend significant time gathering updates, validating compliance, preparing reports, and maintaining stakeholder relationships. There is no centralized system that provides real-time visibility into governance compliance, stakeholder engagement, project health, and account health.

### 1.2 Limitations or Challenges
*   **Governance Visibility:** No unified view of governance compliance across projects and accounts.
*   **Stakeholder Management:** Stakeholder relationships, connect frequency, and sentiment are tracked manually.
*   **Reporting Overhead:** Delivery Leads spend excessive effort creating Weekly Notes, WBRs, and Governance Reports.
*   **Executive Visibility:** Leadership lacks a consolidated account-level view.
*   **Knowledge Fragmentation:** Project knowledge is scattered across documents and folders.
*   **Compliance Monitoring:** No automated mechanism to identify missing Weekly Notes, missing WBRs, missed stakeholder connects, or overdue governance activities.

---

## 2. Objectives / Goals

### 2.1 Business Objectives
*   **BO-1:** Establish a centralized Delivery Governance Operating System.
*   **BO-2:** Improve governance compliance visibility.
*   **BO-3:** Reduce reporting effort through AI-assisted generation.
*   **BO-4:** Provide executive-level delivery visibility.
*   **BO-5:** Create an institutional knowledge repository.
*   **BO-6:** Enable future integration with enterprise systems through MCP (Model Context Protocol) architecture.

### 2.2 User Objectives
*   **Account Lead:**
    *   Understand account health within 5 minutes.
    *   Monitor governance compliance.
    *   Track stakeholder relationships.
    *   Review AI-generated governance insights.
*   **Delivery Lead:**
    *   Upload governance artifacts.
    *   Generate Weekly Notes and WBRs quickly.
    *   Track compliance and risks.
    *   Reduce reporting effort.
*   **Executive Leadership:**
    *   Monitor account health.
    *   Review governance trends.
    *   Identify high-risk accounts.

---

## 3. User Persona Prioritization

### Persona 1: Account Lead (Primary)
*   **Responsibilities:** Account governance, stakeholder management, escalation management, executive reporting.
*   **Primary Goals:** Account visibility, governance tracking, risk identification.

### Persona 2: Delivery Lead (Secondary)
*   **Responsibilities:** Project delivery, governance execution, reporting, risk management.
*   **Primary Goals:** Governance compliance, AI-assisted reporting, operational efficiency.

### Persona 3: Executive Leadership (Future)
*   **Responsibilities:** Portfolio oversight, strategic account management.

---

## 4. User Stories

### Account Management
*   **US-001:** As an Account Lead, I want to create and manage accounts so that all governance activities can be centrally monitored.
*   **US-002:** As an Executive, I want to view account health scores so that I can identify accounts requiring intervention.

### Buying Center Management
*   **US-003:** As an Account Lead, I want to maintain Buying Centers so that stakeholder relationships can be managed effectively.
*   **US-004:** As an Account Lead, I want to track stakeholder sentiment and connect history so that I can proactively manage relationships.

### Governance Tracking
*   **US-005:** As an Account Lead, I want to monitor governance compliance across projects so that delivery standards are maintained.
*   **US-006:** As a Delivery Lead, I want governance activities automatically tracked so that compliance gaps are visible.

### AI Governance
*   **US-007:** As a Delivery Lead, I want AI to generate Weekly Notes drafts.
*   **US-008:** As a Delivery Lead, I want AI to generate WBR drafts.
*   **US-009:** As an Account Lead, I want AI-generated Account Digests.
*   **US-010:** As an Account Lead, I want AI-generated Governance Summaries.

---

## 5. User Flows

### 5.1 Governance Journey
```
Portfolio
│
├── Accounts
│   └── Account Dashboard
│       ├── Buying Centers
│       ├── Projects
│       └── Stakeholders
│
├── Buying Centers
│   └── Buying Center Dashboard
│
├── Governance Center
│   ├── Compliance
│   ├── Reviews
│   ├── Risks
│   └── Exceptions
│
└── AI Workspace
    ├── Weekly Notes
    ├── WBR Generation
    ├── Account Digest
    └── Governance Summary
```

### 5.2 Governance Artifact Processing Flow
```
[Upload Artifact]
       │
       ▼
[Google Drive Sync]
       │
       ▼
[AI Classification]
       │
       ▼
[Extract Risks / Actions / Decisions]
       │
       ▼
[Update Governance Records]
       │
       ▼
[Generate Weekly Notes & WBR Draft]
       │
       ▼
[Human Review]
       │
       ▼
[Publish]
```

---

## 6. Requirements

### 6.1 Technical Requirements
*   **Frontend Architecture:** Next.js, React.js, Tailwind CSS, shadcn/ui.
*   **Backend Architecture:** Node.js, NestJS Framework, REST APIs, RBAC Engine, Governance Rules Engine, AI Orchestration Layer, MCP Integration Layer.
*   **Database & Storage:** PostgreSQL, Prisma ORM, Google Drive Integration, Google Cloud Storage.
*   **Authentication & Authorization:** Google Workspace SSO, Role-Based Access Control (RBAC).
*   **Deployment:** Vercel (Frontend), GCP Cloud Run (Backend), Cloud SQL PostgreSQL (Database).
*   **MCP Integration Layer:** Support MCP-based integrations for Google Drive, Gmail, Google Docs, and Google Sheets. Future support for Slack and MS Teams.
*   **AI Services:** Integrate OpenAI and Gemini for text generation, summaries, and extraction.
*   **Background Processing:** Redis & BullMQ for asynchronous jobs.

### 6.2 Design Requirements
*   **Design Philosophy:** Executive Delivery Command Center.
*   **UI Characteristics:** Dashboard-first, card-based layout, governance-focused, minimal clicks, executive-friendly, responsive design.
*   **Theme & Colors:**
    *   Primary Navy: `#0D2A66`
    *   Primary Orange: `#F68B1F`
    *   Primary Purple: `#8A3D78`
    *   Neutral Background: `#F5F6F8`
    *   Neutral Cards: `#FFFFFF`
    *   Neutral Borders: `#E4E7EC`

### 6.3 Functional Requirements

#### Module 1 – Account Management
*   **Features:** Create Account, Edit Account, Archive Account, Account Dashboard.
*   **Metrics:** Governance Score, Compliance Score, RAG Status.

#### Module 2 – Buying Center Management
*   **Features:** Buying Center Registry, Stakeholder Registry, Stakeholder Hierarchy, Sentiment Tracking.
*   **Metrics:** Relationship Tenure, Connect Frequency, Stakeholder Health.

#### Module 3 – Governance Tracking (MVP Core)
*   **Track:** Daily Standups, Weekly Notes, WBR, FBR, MBR, QBR, Stakeholder 1x1, Security Reviews, NPS Feedback, Employee 1x1.
*   **Outputs:** Governance Score, Compliance Alerts, Governance Trends.

#### Module 4 – AI Governance Assistant
*   **Generate:** Weekly Notes Draft, WBR Draft, Governance Summary, Account Digest.
*   **Input Sources:** Google Drive, Uploaded Documents, Weekly Notes, WBR Repository, MOM Repository.
*   *Note: All outputs require human review and approval.*

#### Module 5 – Dashboards
*   **Portfolio Dashboard:** Account Health, Governance Trends, Compliance Visibility.
*   **Account Dashboard:** Buying Centers, Governance Health, Stakeholder Health.
*   **Buying Center Dashboard:** Stakeholder Hierarchy, Sentiment, Connect History.
*   **Project Dashboard:** Governance Compliance, Risks, Actions, Upcoming Reviews.

### 6.4 Non-Functional Requirements
*   **Security:** RBAC at backend. Supported roles: Platform Admin, Executive Leadership, Account Lead, Delivery Lead.
*   **Performance:** Dashboard load time < 3 seconds.
*   **Availability:** 99% uptime.
*   **Scalability:** Support 100+ Accounts, 1,000+ Projects, 100,000+ Governance Records, 500+ Concurrent Users.
*   **Auditability:** Audit trail for user actions, governance updates, AI-generated content, and approval history.
*   **Maintainability:** Modular architecture to support future MCP integrations.

---

## 7. Wireframes List
*   **WF-01:** Portfolio Dashboard
*   **WF-02:** Account Dashboard
*   **WF-03:** Buying Center Dashboard
*   **WF-04:** Project Governance Dashboard
*   **WF-05:** AI Governance Workspace

---

## 8. Success Metrics

### Governance Metrics
*   95% Weekly Notes Visibility.
*   95% WBR Compliance Visibility.
*   90% Governance Activity Tracking.

### Productivity Metrics
*   80% Reduction in WBR Creation Effort.
*   70% Reduction in Weekly Notes Preparation Time.
*   60% Reduction in Executive Reporting Effort.

### Adoption Metrics
*   90% Account Adoption.
*   80% Weekly Active Usage.
*   100% Buying Center Coverage.

### AI Metrics
*   75% AI Draft Acceptance Rate.
*   80% Weekly Notes Generation Success.
*   80% WBR Generation Success.

---

## 9. Future Releases (Out of MVP)
*   **Phase Management:** Development, SIT, UAT, Production workflows.
*   **Team Management:** Onshore/Offshore teams, skills matrix, resource planning, open roles tracking.
*   **Advanced Integrations:** Teams, Slack, Calendar, Jira.
*   **Predictive Intelligence:** Governance risk forecasting, stakeholder risk prediction, account health forecasting.
