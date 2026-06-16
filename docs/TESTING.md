# Frontend Testing Specifications & Plan
## Fact+Pulse Delivery Governance Operating System

---

## 1. Overview
Fact+Pulse Frontend employs a multi-tiered testing strategy to guarantee security, interface responsiveness, and reliable data synchronization with backend APIs.

```
       / \
      /   \      E2E Testing (Playwright)
     / E2E \     - Critical User Journeys (Upload -> Draft -> Publish)
    /-------\
   /  INTEG  \   Integration & Mock API Testing (Vitest + MSW)
  /           \  - Dashboard widget data aggregation & hook state checks
 /-------------\
/     UNIT      \ Unit Testing (Vitest + React Testing Library)
/________________\ - Component UI styling (RAG badges, Gauges) & Lib helpers
```

---

## 2. Test Setup & Frameworks

### 2.1 Unit & Component Testing
*   **Framework:** Vitest (for test execution) & React Testing Library (for React DOM mounting).
*   **Target Scope:** Utility helper logic (date manipulation, text truncated rules) and isolated components (Buttons, Badges, RAG Progress circular widgets).

### 2.2 Integration Testing & API Mocking
*   **Tooling:** Mock Service Worker (MSW).
*   **Target Scope:** Mocking server responses during integration and visual tests. Ensures that component tests run deterministically without hitting the NestJS database.

### 2.3 End-to-End (E2E) Testing
*   **Framework:** Playwright.
*   **Target Scope:** Full system integration. Simulates real user interactions (typing, clicking, drag-dropping files) in chrome, safari, and firefox viewports.

---

## 3. Core Test Suites

### TS-100: Auth & Access Control
*   **Test Case 101:** Ensure unauthenticated visitors are redirected to the Google SSO landing screen.
*   **Test Case 102:** Verify Role-Based access rules (e.g. Delivery Lead role cannot access Platform Admin settings pages).

### TS-200: Portfolio & Account Dashboards
*   **Test Case 201:** Verify the Portfolio Dashboard list dynamically displays Account Cards from fetched API data.
*   **Test Case 202:** Verify that selecting the "RED RAG Status" filter hides green and amber accounts.
*   **Test Case 203:** Confirm click navigation from Portfolio Accounts grid triggers routing changes to `/accounts/[accountId]`.

### TS-300: Stakeholders & Buying Center
*   **Test Case 301:** Verify that the Stakeholder Hierarchy view renders correct parent-child reporting nodes.
*   **Test Case 302:** Assert that changing a Stakeholder's sentiment from Positive to Negative updates their visual border color immediately and makes a query invalidation network call.

### TS-400: Project Governance Checkpoints
*   **Test Case 401:** Drag-and-drop a mock `WBR_Macy.pptx` file. Assert that the dropzone changes styling state, lists the filename, and displays an upload progress bar.
*   **Test Case 402:** Validate that checking a compliance activity task logs a completed timestamp and updates the project's compliance percentage gauge.

### TS-500: AI Workspace Document Review
*   **Test Case 501:** Select a project, click "Generate Draft". Assert that the screen displays a loading spinner and then populates the editor with the AI markdown text.
*   **Test Case 502:** Edit AI draft text, click "Publish". Verify that MSW catches a `/publish` API call and a success notification displays.

---

## 4. Continuous Integration (CI) Checks
The automated CI pipeline (e.g. GitHub Actions) executes on every Pull Request and must pass the following checks before merge approval:

1.  **Format Verification:** `npm run lint` (ESLint checks).
2.  **Compilation check:** `npm run build` or `npx tsc --noEmit` (TypeScript validation).
3.  **Unit & Integration suite:** `npm run test:run` (Vitest executes all unit tests).
4.  **E2E suite:** `npx playwright test` (Playwright runs E2E scenarios inside isolated container).
