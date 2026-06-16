# Frontend Architecture Specification
## Fact+Pulse Delivery Governance Operating System

---

## 1. Overview
Fact+Pulse is built as a responsive, dashboard-first web application. The frontend uses **Next.js (App Router)** as the foundation, leveraging React, Tailwind CSS, and shadcn/ui to provide an executive-level command center interface.

### Technical Stack
*   **Framework:** Next.js (Version 14+, App Router) or Vite React TypeScript
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS v4 (configured via CSS variables, using utility classes for dark mode and responsive layouts)
*   **Component Library:** shadcn/ui (Radix UI primitives under the hood)
*   **Data Fetching & Cache:** TanStack Query (React Query)
*   **Global Client State:** Zustand (for theme selection and layout switches)
*   **Forms & Validation:** React Hook Form & Zod
*   **Date Formatting:** date-fns

---

## 2. Directory Structure
The frontend project follows a highly organized, modular Next.js directory layout inside the `src/` folder:

```
src/
├── app/                      # Next.js App Router folders
│   ├── layout.tsx            # Global HTML layout (providers, font, theme)
│   ├── page.tsx              # Root redirect (to /portfolio)
│   ├── portfolio/            # Portfolio Dashboard Route
│   │   └── page.tsx
│   ├── accounts/             # Account pages
│   │   └── [accountId]/
│   │       ├── page.tsx      # Account Dashboard
│   │       └── projects/     # Project routes within an account
│   │           └── [projectId]/
│   │               └── page.tsx
│   ├── buying-centers/       # Buying Centers pages
│   │   └── [centerId]/
│   │       └── page.tsx      # Buying Center Dashboard
│   ├── ai-workspace/         # AI Governance workspace
│   │   └── page.tsx
│   └── error.tsx             # Global error boundaries
│
├── components/               # Component Architecture
│   ├── ui/                   # shadcn/ui components (buttons, dialogs, cards)
│   ├── layouts/              # Core page wrappers (Sidebar, TopHeader, Container)
│   ├── dashboard/            # Dashboard widgets and summaries
│   ├── charts/               # Recharts wrappers (Line, Bar, Radar charts)
│   ├── forms/                # Zod validated form structures
│   └── ai/                   # AI Editor, workspace utilities
│
├── hooks/                    # Reusable React Hooks (API queries, UI state)
│   ├── use-accounts.ts
│   ├── use-governance.ts
│   ├── use-ai-workspace.ts
│   └── use-stakeholders.ts
│
├── services/                 # API Clients & Service Integrations
│   ├── api-client.ts         # Axios client with interceptors
│   ├── mcp-client.ts         # Model Context Protocol integration layer
│   └── local-mock.ts         # Mock server hooks (development / demo)
│
├── store/                    # Zustand Store definitions
│   ├── ui-store.ts           # Sidebar state, theme, modal triggers
│   └── draft-store.ts        # AI draft editor temporary workspace state
│
├── lib/                      # Base libraries and configurations
│   ├── utils.ts              # cn helper, tailwind-merge configuration
│   └── theme.ts              # CSS variables injection helpers
│
└── types/                    # Common TypeScript definitions
    ├── api.d.ts              # API interfaces (Request / Response)
    └── index.d.ts            # Common entities (Account, Project, Stakeholder)
```

---

## 3. Routing & Pages Design
Routing maps directly to the navigation requirements of the Executive Command Center:

| Route Path | Dashboard View | Primary Persona | Core Functionality |
| :--- | :--- | :--- | :--- |
| `/portfolio` | Portfolio Dashboard | Executive, Account Lead | High-level account cards, portfolio RAG health tracker, compliance trends. |
| `/accounts/[accountId]` | Account Dashboard | Account Lead | Buying centers, overall project RAG states, stakeholder sentiment scores, and automated reports. |
| `/buying-centers/[centerId]` | Buying Center Dashboard | Account Lead | Stakeholder hierarchy charts, connect frequency tracker, and contact cards. |
| `/accounts/[accountId]/projects/[projectId]` | Project Dashboard | Delivery Lead | Detailed project governance activities, risks lists, action items, and upload widget. |
| `/ai-workspace` | AI Governance Workspace | Delivery Lead, Account Lead | Upload artifacts, select draft types (Weekly Notes, WBR, digest), review drafts, approve, and export. |

---

## 4. State Management
Fact+Pulse separates client state into three distinct layers to ensure clean code separation:

```mermaid
graph TD
    A[Frontend State Management] --> B[Server State / Caching]
    A --> C[Global UI/UX State]
    A --> D[Form / Component State]

    B --> B1["TanStack Query (React Query)"]
    B1 --> B2["Manages API calls, cache validation, and optimistic UI updates"]

    C --> C1["Zustand Store"]
    C1 --> C2["Manages sidebar toggle, dark mode, draft overlays, active filter selections"]

    D --> D1["React useState / Hook Form"]
    D1 --> D2["Manages inputs, validation error states, and local UI micro-interactions"]
```

### Server State (TanStack Query)
All data-fetching, caching, mutation, and synchronizations are managed via queries:
*   Queries cache details with specific TTL (e.g., dashboard graphs cache for 1 minute; configurations cache for 10 minutes).
*   Mutations (e.g., uploading a document or changing stakeholder sentiment) trigger target cache invalidations (e.g., invalidating `['project', projectId]` cache keys).

### Client UI State (Zustand)
Used purely for client-only parameters that are shared across component sub-trees, such as:
*   Sidebar collapsed/expanded state.
*   Theme selection (Light/Dark).
*   AI workspace editor draft selections.

---

## 5. MCP (Model Context Protocol) Integration Hook
To support Factspan's future vision of MCP integration, the frontend embeds a decoupled client-side abstraction:
*   **Abstraction Layer:** `src/services/mcp-client.ts` exposes API bindings that send commands to the NestJS backend's MCP integration layer.
*   **UI Components:** The frontend renders action buttons (e.g., "Draft Email in Gmail via MCP", "Sync to Google Drive via MCP") which map to backend endpoints. These trigger server-side MCP tools connecting Google workspace APIs.

---

## 6. Rendering and Layout Architecture
*   **Root Layout & Theme Wrapper:** Sets up HTML headers, embeds font stylesheets, configures the Tailwind theme provider, and subscribes to the Zustand global `useUIStore` to apply class-based theme injection (`.dark` on `<html>` and `<body>`).
*   **App Layout Wrapper:** Every dashboard page is wrapped in an administrative dashboard frame including a Collapsible Left Sidebar, Page-specific Top Breadcrumbs Header, and the Content Scroll Pane.
*   **Extreme Responsive System (250px - 4K TV):**
    *   `4k-tv` (>= 3840px): Ultra-scale layout. Margins, text sizes, cards, and container maximum widths scale up (e.g. `4k-tv:max-w-[800px]`, `4k-tv:text-6xl`) to avoid floating layouts and tiny text on massive TV boards.
    *   `4k` (>= 2560px): QHD scaling viewport adjustments.
    *   `3xl` (>= 1920px) to `2xl` (>= 1536px): Wide desktop monitors layouts.
    *   `xl` (1280px) to `lg` (1024px): Standard laptops with visible sidebars.
    *   `md` (768px) to `lg` (1024px): Medium screens; navigation sidebars collapse to icon-only.
    *   `sm` (640px) to `md` (768px): Small tablets; navigation panel shifts to popover triggers.
    *   `xs` (250px) to `sm` (640px): Extreme mobile viewports. Layouts collapse to a single high-contrast vertical stack, input sizes reduce (`px-3 py-2 text-xs`), and margins minimize to preserve layout integrity down to 250px.
*   **Dark Mode Standard:**
    *   Mandates the use of Tailwind's `dark:` modifier on all elements (e.g., `bg-white dark:bg-neutral-900`, `text-neutral-900 dark:text-white`).
    *   Any new UI components created *must* define both light and dark classes explicitly. Semicolons and styling must align with Prettier.
