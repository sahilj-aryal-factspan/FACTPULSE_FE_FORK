# Frontend Development Tasks & Roadmap
## Fact+Pulse Delivery Governance Operating System

---

## Phase 1: Environment & Foundations (Epic-100)
Establish the base repository infrastructure, build tools, design values, and directory framework.

*   `[ ]` **Task 101: Project Initialization**
    *   Initialize Vite + React SPA with TypeScript, ESLint, Tailwind CSS, and modular `src/` directory layout.
*   `[ ]` **Task 102: Iconography & Design System setup**
    *   Install `lucide-react` and initialize shadcn/ui library.
    *   Configure Tailwind CSS variables in `src/index.css` with the Factspan Navy, Orange, Purple, and RAG status colors.
*   `[ ]` **Task 103: Base Layout Shell**
    *   Create Global Context Providers wrapper (Theme, React Query Client, Toast alerts).
    *   Implement left sidebar layout (collapsible responsive drawer for mobile/tablet).
    *   Create top navigation breadcrumbs header.

---

## Phase 2: Shared Component Library (Epic-200)
Build the foundational UI blocks that will be reused across the application.

*   `[ ]` **Task 201: UI Primitive components**
    *   Setup Button, Card, Badge, Dialog, Dropdown Menu, Alert Dialog, and Sheet from shadcn/ui.
*   `[ ]` **Task 202: Visual Data Charts wrapper**
    *   Setup `recharts` package.
    *   Create `PortfolioTrendLineChart` component.
    *   Create `GovernanceScoreGauge` circular progress component.
*   `[ ]` **Task 203: Document Upload Area**
    *   Implement drag-and-drop file upload container with visual drop states, file type checks (.pdf, .pptx, .docx), and upload progress animations.

---

## Phase 3: Dashboard Assembly (Epic-300)
Implement the core visual interfaces of the governance system.

*   `[ ]` **Task 301: Portfolio Dashboard (WF-01)**
    *   Create `/portfolio` page view.
    *   Implement high-level portfolio metrics widgets.
    *   Assemble Account grid cards mapping RAG statuses and scores.
*   `[ ]` **Task 302: Account Dashboard (WF-02)**
    *   Create `/accounts/:accountId` page view.
    *   Implement Project Grid lists, health compliance status bars, and the Google Drive connection list.
*   `[ ]` **Task 303: Buying Center Dashboard (WF-03)**
    *   Create `/buying-centers/:centerId` page view.
    *   Implement stakeholder tree visualizer (hierarchical diagram representing roles and sentiment-colored borders).
    *   Create Connect History tabular registry and log interaction modal form.
*   `[ ]` **Task 304: Project Governance Workspace (WF-04)**
    *   Create `/accounts/:accountId/projects/:projectId` page view.
    *   Build the 10-Checkpoints Compliance Grid mapping states (Completed, Pending, Overdue).
    *   Assemble Risks & Action Items registries side-by-side.

---

## Phase 4: AI Governance Workspace (Epic-400)
Build the human-in-the-loop writing environment powered by LLMs.

*   `[ ]` **Task 401: Workspace Sidebar & Controls**
    *   Create `/ai-workspace` page.
    *   Build selection panel for targeted projects, source document lists, and draft type actions.
*   `[ ]` **Task 402: Markdown Editor & Preview**
    *   Implement rich text editor using markdown plugins (supporting headings, lists, bold text).
    *   Implement side-by-side panel preview.
*   `[ ]` **Task 403: Review and Publish Flow**
    *   Build revision slider showing version logs.
    *   Implement confirmation dialogs for draft publishing ("Sync to GDrive" / "Draft email").

---

## Phase 5: API & Query Integration (Epic-500)
Connect the visual screens to live API endpoints using TanStack Query.

*   `[ ]` **Task 501: API Axios Client Configuration**
    *   Setup `api-client.ts` with error interceptors and authentication header support.
*   `[ ]` **Task 502: Custom React Query Hooks bindings**
    *   Implement query hooks (`useAccounts`, `useProjectGovernance`, `useStakeholders`).
    *   Implement mutation hooks (`useUploadArtifact`, `useUpdateSentiment`, `usePublishDraft`).
*   `[ ]` **Task 503: Mock Service Worker (MSW) Integration**
    *   Write mocks handler data for offline demonstration and testing.

---

## Phase 6: Quality Assurance & Release (Epic-600)
Ensure code reliability, browser compatibility, and visual accuracy.

*   `[ ]` **Task 601: Unit Testing setup**
    *   Install Vitest and React Testing Library. Write component unit tests for Gauge and Dropzone modules.
*   `[ ]` **Task 602: E2E Playwright Flows**
    *   Write E2E scripts validating file upload -> AI draft generation -> edit -> publication flows.
*   `[ ]` **Task 603: Production Bundle & Vercel deployment**
    *   Validate Vite production build compilation. Set up environment variables and connect deployment pipeline.
*   `[ ]` **Task 604: Responsive Design Audits (250px - 4K TV)**
    *   Verify layout structures on small phones (down to 250px viewport) to ensure text size, spacing, and forms do not overflow.
    *   Audit interface on 4K TV viewports (3840px) to verify scaling cards, readable fonts, and responsive layout constraints.

