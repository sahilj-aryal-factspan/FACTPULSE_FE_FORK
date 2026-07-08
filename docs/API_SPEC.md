# API Client & Integration Contracts
## Fact+Pulse Delivery Governance Operating System

---

## 1. Overview
The Fact+Pulse frontend interacts with a NestJS backend via REST APIs. All frontend requests are handled by a preconfigured Axios client. In development mode, mock APIs are intercepted via MSW (Mock Service Worker) to facilitate rapid local testing.

---

## 2. API Endpoint Specifications

### 2.1 Portfolio & Dashboard API
*   **Get Portfolio Stats**
    *   `GET /api/portfolio/summary`
    *   **Response (200 OK):**
        ```json
        {
          "accountsCount": 12,
          "averageGovernanceScore": 87,
          "complianceTrend": [
            { "month": "Jan", "compliance": 82 },
            { "month": "Feb", "compliance": 85 },
            { "month": "Mar", "compliance": 90 }
          ],
          "highRiskAccounts": 1
        }
        ```

### 2.2 Account Management API
*   **List Accounts**
    *   `GET /api/accounts`
    *   **Response (200 OK):**
        ```json
        [
          {
            "id": "acc-101",
            "name": "Macy's",
            "logoUrl": "/logos/macys.png",
            "governanceScore": 92,
            "complianceScore": 95,
            "ragStatus": "GREEN"
          }
        ]
        ```

*   **Create Account**
    *   `POST /api/accounts`
    *   **Request Body:**
        ```json
        {
          "name": "CVS Health",
          "logoUrl": "/logos/cvs.png"
        }
        ```
    *   **Response (201 Created):**
        ```json
        {
          "id": "acc-102",
          "name": "CVS Health",
          "logoUrl": "/logos/cvs.png",
          "governanceScore": 100,
          "complianceScore": 100,
          "ragStatus": "GREEN",
          "createdAt": "2026-06-16T15:41:12Z"
        }
        ```

### 2.3 Buying Center & Stakeholder API
*   **Get Buying Center Details**
    *   `GET /api/buying-centers/:id`
    *   **Response (200 OK):**
        ```json
        {
          "id": "bc-201",
          "name": "CVS Digital",
          "relationshipTenure": 18,
          "connectFrequency": "WEEKLY",
          "stakeholders": [
            {
              "id": "stk-301",
              "name": "Jane Doe",
              "role": "VP of Engineering",
              "email": "jane.doe@cvs.com",
              "sentiment": "POSITIVE",
              "lastConnectDate": "2026-06-10",
              "nextScheduledConnect": "2026-06-17",
              "parentId": null
            }
          ]
        }
        ```

*   **Update Stakeholder Sentiment**
    *   `PATCH /api/stakeholders/:id`
    *   **Request Body:**
        ```json
        {
          "sentiment": "NEGATIVE",
          "lastConnectDate": "2026-06-15"
        }
        ```

### 2.4 Project & Governance API
*   **Get Governance Activities**
    *   `GET /api/projects/:id/governance`
    *   **Response (200 OK):**
        ```json
        [
          {
            "id": "gov-401",
            "type": "WBR",
            "title": "WBR Week 24",
            "dueDate": "2026-06-15",
            "completedAt": "2026-06-14",
            "status": "COMPLETED",
            "uploadedDocumentUrl": "https://gdrive.google.com/doc-123"
          }
        ]
        ```

*   **Upload Governance Document**
    *   `POST /api/projects/:id/artifacts`
    *   **Request Body (Multipart Form-Data):**
        *   `file`: (Binary File Upload)
        *   `type`: "WEEKLY_NOTE" | "WBR" | "QBR"
    *   **Response (201 Created):**
        ```json
        {
          "artifactId": "art-501",
          "fileName": "WBR_Week_24_Macy.pdf",
          "status": "PROCESSING",
          "syncStatus": "GOOGLE_DRIVE_PENDING"
        }
        ```

### 2.5 AI Governance Assistant API
*   **Generate AI Draft**
    *   `POST /api/ai/generate`
    *   **Request Body:**
        ```json
        {
          "type": "WEEKLY_NOTES",
          "projectId": "proj-901",
          "sourceDocumentIds": ["art-501"]
        }
        ```
    *   **Response (200 OK):**
        ```json
        {
          "draftId": "draft-601",
          "content": "# Weekly Notes - Macy's Integration\n## Accomplishments\n- Completed SSO integration...\n## Risks\n- Delay in Sandbox API delivery...",
          "generatedAt": "2026-06-16T15:43:00Z"
        }
        ```

*   **Publish Draft**
    *   `POST /api/ai/drafts/:id/publish`
    *   **Response (200 OK):**
        ```json
        {
          "draftId": "draft-601",
          "status": "PUBLISHED",
          "publishedAt": "2026-06-16T15:45:00Z"
        }
        ```

---

## 3. Global State Synchronization (Zustand Store)
All client-side API synchronization is managed under the central Zustand hook [data-store.ts](file:///d:/New%20Laptop/Office%20Data/Documents/FACTSPAN/FACTPULSE_FE/src/store/data-store.ts).

### 3.1 Initial Synchronization
* **`syncWithBackend()`**: Initiates parallelized fetch calls to load portfolio summary stats, AI digests, governance trends, accounts, projects, risks, action items, decisions, and raw artifacts from the backend NestJS server. Called during the initial bootstrap of the main workspace pages.

### 3.2 State Modifier Actions (CRUD)
* **`addProject(proj)`**: Sends a `POST /api/v1/projects` request. Displays a multi-step loading splash screen overlay showing workspace configuration, checkpoint auto-seeding, and database setup tasks before redirecting to the project dashboard page.
* **`deleteProject(id)`**: Sends a `DELETE /api/v1/projects/:id` request, which cascades delete operations in the PostgreSQL database. Updates local Zustand lists dynamically and navigates back to the Portfolio dashboard.
* **`uploadArtifact(projectId, file, type, size)`**: Uploads parsed artifacts via `POST /api/v1/artifacts/upload`. Runs synchronous OpenAI classification, risk/action item bifurcation, and project/account RAG status recalculations on the server. Immediately calls `syncWithBackend()` during file processing redirect transitions.
* **`addRisk(projectId, risk)`** / **`updateRisk(id, updates)`** / **`deleteRisk(id)`**: Directly updates risk entities via `POST`, `PUT`, and `DELETE` endpoints under `/api/v1/risks`. Automatically triggers `recalculateProjectAndAccount()` on backend triggers.
* **`addAction(projectId, action)`** / **`updateAction(id, updates)`** / **`deleteAction(id)`**: Directly manages actions via endpoints under `/api/v1/action-items`.
* **`addDecision(projectId, decision)`** / **`deleteDecision(id)`**: Directly manages decision history entries under `/api/v1/decisions`.
* **`addAIReport(projectId, type, content)`**: Generated dynamically via `POST /api/v1/artifacts/generate-draft`. Synthesizes Week Notes, WBRs, and Digests using OpenAI from selected artifact texts (with automatic database logs fallback).

---

## 4. API Error Handling Model
Axios interceptors are configured to standard API response errors and show interactive toast alerts:
*   **401 Unauthorized:** Redirection to the Google Workspace SSO login portal.
*   **403 Forbidden:** Render access restriction overlay (Role-Based Access Control warning).
*   **422 Unprocessable Entity:** Field-level validation mapped to React Hook Form visual fields.
*   **500 Internal Server Error:** Generic visual alert displaying "Critical Server Error, please try again."
