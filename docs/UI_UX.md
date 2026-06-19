# UI/UX Specifications & Design System
## Fact+Pulse Delivery Governance Operating System

---

## 1. Design Philosophy
The UI/UX is built to serve as an **Executive Delivery Command Center**. It aims to deliver high-level visibility in seconds while allowing deep dives within 2 clicks.

*   **Dashboard First:** Data is represented visually with cards, progress indicators, and trend charts.
*   **Card-Based Layout:** Visual information is containerized using clear borders, shadows, and spacing.
*   **Minimal Clicks:** Avoid nested navigation paths; sub-menus slide out (Drawers) or open in place (Modals).
*   **Theme Integration:** Clean white and light gray theme with high-contrast Factspan primary colors, plus a fully functional dark mode.

---

## 2. Visual Tokens & Theme (Tailwind CSS v4 Configuration)

### 2.1 Theme Color Mappings
Tailwind utilities map to these standard Fact+Pulse palette tokens inside `src/index.css`:
*   **Primary Navy (`bg-primary`, `text-primary`, or `bg-brand-navy`):** `#1E3A8A` (Primary brand color, headers, primary buttons)
*   **Secondary Blue (`bg-secondary`, `text-secondary`):** `#2563EB` (Action elements, secondary buttons, interactive highlights)
*   **Success Green (`bg-success`, `text-success`):** `#059669` (Completed checklists, "On Track" status pills)
*   **Warning Orange (`bg-warning`, `text-warning`, or `bg-brand-orange`):** `#D97706` (Milestones pending, "At Risk" status pills)
*   **Danger Red (`bg-danger`, `text-danger`):** `#DC2626` (Overdue activities, "Off Track" status pills)
*   **Neutral Dark (`bg-neutral`, `text-neutral`):** `#111827` (Dark mode background resets, primary dark text)
*   **Neutral Light (`bg-neutral-light`):** `#F3F4F6` (Light mode background resets)
*   **Neutral Border (`border-neutral-border`):** `#D1D5DB` (Table gridlines, card borders)

### 2.2 Typography
*   **Heading Font (`font-sans` with Outfit heading):** `Outfit` (sans-serif) for executive titles, dashboard scores, and card headers.
*   **Body Font (`font-sans` with Inter body):** `Inter` (sans-serif) for tabular lists, notes, forms, and general content.

---

## 3. Responsive Breakpoints & Scaling System (250px - 4K TV)
To ensure the interface is fully readable on small phone screens (e.g. 250px wide viewports) and scales elegantly to giant 4K TV status boards (3840px wide) without stretching, the system defines these custom Tailwind breakpoint constraints:

| Breakpoint Name | Viewport Target | Design Constraints & Class Behavior |
| :--- | :--- | :--- |
| `xs` | `>= 250px` | **Extreme Mobile:** Grid columns collapse to 1. Margin & padding minimized (`p-4`). Input text size scales to `text-xs` to prevent word wrapping. |
| `sm` | `>= 640px` | **Standard Mobile:** Default Tailwind layout base. Navigation sidebars move to drawers. |
| `md` | `>= 768px` | **Tablets:** Grid structures change to 2 columns. Sidebar collapses to icons. |
| `lg` | `>= 1024px` | **Laptops:** Full left navigation panel (260px wide) is permanently visible. |
| `3xl` | `>= 1920px` | **Desktops:** Grid structures change to 3 columns. Cards use maximum width caps to avoid stretching. |
| `4k` | `>= 2560px` | **QHD/2K Boards:** Layout expands. Text size increases to `text-lg` or `text-xl` by default. |
| `4k-tv` | `>= 3840px` | **4K TV Resolution:** Maximum scaling. Padding scales (`p-16` / `p-24`), card width limits expand (`4k-tv:max-w-[800px]`), text sizes scale up to 4x (`4k-tv:text-6xl`). |

---

## 3.5 Dark Mode Architecture
All components *must* implement class-based dark mode styling:
1.  **DOM Binding:** The global layout listens to `useUIStore.theme` and adds/removes the `.dark` class from the `<html>` and `<body>` tags.
2.  **Tailwind Utility Rules:** Every component MUST explicitly declare its dark mode equivalent styling.
    *   *Correct:* `<div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">`
    *   *Incorrect:* `<div className="bg-white border text-neutral-900">`
3.  **Local Storage Sync:** The selected theme persists under `factpulse_theme` in localStorage to prevent style flicker on subsequent reloads.---

## 4. Screen Wireframe Specifications

### 4.1 WF-01: Portfolio Dashboard
*   **Main Header:** Welcome banner displaying the current date and user profile.
*   **Summary Stats Grid (3 Columns):**
    *   *Accounts Managed:* Number metric with a subtext showing monthly change.
    *   *Average Governance Score:* Circular Gauge with a colored border corresponding to the value.
    *   *High-Risk Alerts:* Warning pill displaying number of RED status accounts.
*   **Account Catalog Grid:**
    *   Render each enterprise account inside a grid container.
    *   Displays Account Logo, Account Name, Governance & Compliance status bars, active buying centers badges, and a "Quick Digest" action button that opens an AI Summary Drawer in place.

### 4.2 WF-02: Account Dashboard
*   **Overview Banner:** Account detail cards showing primary Leads, RAG health status indicator, and Google Drive synchronized folders list.
*   **Buying Center Registry Tab:**
    *   List of active buying centers.
    *   Sentiment index sparkline showing the sentiment trends of stakeholders.
*   **Projects Grid:**
    *   Cards representing individual delivery projects.
    *   Displays compliance rate percentages, upcoming key reviews, and a "Go to Project Workspace" link.

### 4.3 WF-03: Buying Center Dashboard
*   **Stakeholder Tree Viewer:**
    *   Render hierarchical relationship maps representing reporting lines.
    *   Stakeholders are visual cards showing Name, Role, and Sentiment colored borders:
        *   Green border: Positive sentiment.
        *   Yellow/Amber border: Neutral sentiment.
        *   Red border: Negative sentiment (indicates relationship at risk).
*   **Interaction Timeline:**
    *   Tabular list of logged stakeholder connects.
    *   Form to log a new connect (Date, Type, Summary, Sentiment drop-down).

### 4.4 WF-04: Project Governance Dashboard
*   **Activity Compliance Matrix (Grid):**
    *   Cards representing the 10 key governance checkpoints (Weekly Notes, WBR, MBR, Employee 1x1s, etc.).
    *   Cards show status: **Completed** (Green check), **Overdue** (Red warning), or **Pending** (Amber dot) with dates.
*   **Document Upload Widget:**
    *   Drag-and-drop zone supporting PDF and PPT uploads.
    *   Status bar showing upload progress, Drive sync status, and AI Risk extraction progress.
*   **Risks & Actions Board:**
    *   Two-column split displaying:
        1.  *Risks:* Color-coded cards indicating severity, details, and mitigation plans.
        2.  *Action Items:* Task lists showing assignees, description, and status checkboxes.

### 4.5 WF-05: AI Governance Workspace
```
┌──────────────────────────────────────────────────────────────────┐
│  AI Workspace  >  Weekly Notes Generation                        │
├────────────────────────────────┬─────────────────────────────────┤
│ INPUT SOURCES                  │ DRAFT PREVIEW & EDITOR          │
│ ┌────────────────────────────┐ │ [Publish Draft] [Regenerate]     │
│ │ Select Base Project       ▼│ │                                 │
│ ├────────────────────────────┤ │ # Weekly Notes - Macy's Integration│
│ │ Available Source Docs:     │ │ ## Highlights                   │
│ │ [x] MOM_Week_24.docx       │ │ - Completed frontend API integration│
│ │ [ ] WBR_Week_23_Macy.pptx  │ │                                 │
│ └────────────────────────────┘ │ ## Actions                      │
│ ┌────────────────────────────┐ │ - [ ] Update database migrations │
│ │ Google Drive Sync Status   │ │                                 │
│ │ Sync Completed (2m ago)    │ │                                 │
│ └────────────────────────────┘ │                                 │
└────────────────────────────────┴─────────────────────────────────┘
```
*   **Configuration Left Panel:** Select target Account/Project, choose draft type (Weekly Notes, WBR, Account Digest), and check/uncheck source documents fetched from Drive.
*   **Visual Editor Right Panel:**
    *   Markdown-supported text area populated by the AI generation model.
    *   "Publish" actions triggering PDF generation, Gmail drafts, or MS Teams exports.
    *   History slider showing past versions of drafts for audits.
