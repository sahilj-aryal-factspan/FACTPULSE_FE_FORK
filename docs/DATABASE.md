# Client Data Models & Caching Design
## Fact+Pulse Delivery Governance Operating System

---

## 1. Overview
Fact+Pulse Frontend consumes REST APIs and mirrors the backend PostgreSQL schema (managed via Prisma ORM) as strict TypeScript interfaces. Client-side caching and global state structures are designed to ensure data consistency and instant screen transitions.

---

## 2. Core Entities (TypeScript Models)
These models reflect the primary tables in PostgreSQL and are maintained under `src/types/index.d.ts`.

### 2.1 Account Model
Represents an enterprise account (e.g., Macy's, CVS).
```typescript
export interface Account {
  id: string;
  name: string;
  logoUrl?: string;
  governanceScore: number; // 0 - 100
  complianceScore: number; // 0 - 100
  ragStatus: 'GREEN' | 'AMBER' | 'RED';
  createdAt: string;
  updatedAt: string;
}
```

### 2.2 Buying Center Model
Accounts contain multiple Buying Centers (e.g., CVS Digital, CVS Pharmacy).
```typescript
export interface BuyingCenter {
  id: string;
  accountId: string;
  name: string;
  stakeholderHealth: number; // 0 - 100
  relationshipTenure: number; // in months
  connectFrequency: 'WEEKLY' | 'BI-WEEKLY' | 'MONTHLY';
  createdAt: string;
}
```

### 2.3 Stakeholder Model
Contacts inside Buying Centers with sentiment tracking.
```typescript
export interface Stakeholder {
  id: string;
  buyingCenterId: string;
  name: string;
  role: string;
  email: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  lastConnectDate: string;
  nextScheduledConnect: string;
  parentId?: string; // For hierarchy representation
}
```

### 2.4 Project & Governance Activity Models
```typescript
export interface Project {
  id: string;
  accountId: string;
  name: string;
  ragStatus: 'GREEN' | 'AMBER' | 'RED';
  complianceRate: number; // percentage
  createdAt: string;
}

export type GovernanceType = 
  | 'STANDUP' | 'WEEKLY_NOTE' | 'WBR' 
  | 'FBR' | 'MBR' | 'QBR' 
  | 'STAKEHOLDER_1X1' | 'SECURITY_REVIEW' 
  | 'NPS_FEEDBACK' | 'EMPLOYEE_1X1';

export interface GovernanceRecord {
  id: string;
  projectId: string;
  type: GovernanceType;
  title: string;
  dueDate: string;
  completedAt?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  uploadedDocumentUrl?: string;
}
```

### 2.5 AI Draft & Action/Risk Models
```typescript
export interface AIDraft {
  id: string;
  type: 'WEEKLY_NOTES' | 'WBR' | 'ACCOUNT_DIGEST' | 'GOVERNANCE_SUMMARY';
  accountId?: string;
  projectId?: string;
  status: 'DRAFT' | 'REVIEWED' | 'PUBLISHED';
  content: string; // Markdown structure
  createdAt: string;
}

export interface Risk {
  id: string;
  projectId: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigationPlan: string;
  status: 'OPEN' | 'RESOLVED';
}
```

---

## 3. TanStack Query Cache Structure (Query Keys)
To manage API cache updates effectively and prevent unnecessary roundtrips, we implement a strict hierarchy for Query Keys:

| Cache Key Pattern | Cache Data Type | Invalidation Trigger |
| :--- | :--- | :--- |
| `['portfolio', 'health']` | `{ accountsCount: number, averageGovernanceScore: number, trendData: any[] }` | None (Stale Time: 5 min) |
| `['accounts', 'list']` | `Account[]` | Creating, archiving, or updating an Account |
| `['account', accountId]` | `Account & { buyingCenters: BuyingCenter[], projects: Project[] }` | Updating Account details |
| `['buying-center', centerId]` | `BuyingCenter & { stakeholders: Stakeholder[] }` | Changing Stakeholder details, adding a stakeholder |
| `['project', projectId, 'governance']` | `GovernanceRecord[]` | Uploading artifacts, marking record completed |
| `['project', projectId, 'risks']` | `Risk[]` | Adding, resolving, or modifying a Risk |
| `['ai-workspace', 'drafts']` | `AIDraft[]` | Creating, updating, or deleting drafts |

---

## 4. Zustand Store Schemas

### 4.1 UI Store (`src/store/ui-store.ts`)
Manages non-persisted layout configuration states.
```typescript
interface UIStoreState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeFilter: string;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveFilter: (filter: string) => void;
}
```

### 4.2 Draft Store (`src/store/draft-store.ts`)
Manages states for active editing and human-in-the-loop review of AI-generated content.
```typescript
interface DraftStoreState {
  activeDraftId: string | null;
  editorContent: string;
  isSaving: boolean;
  setActiveDraft: (id: string | null, content: string) => void;
  updateEditorContent: (content: string) => void;
  setSaving: (saving: boolean) => void;
}
```

---

## 5. Local Storage Integration
Local storage is utilized to persist user settings and recover incomplete AI-workspace reviews:
*   `factpulse_theme`: Stores `'light' | 'dark'` to prevent hydration flash.
*   `factpulse_autosave_[draftId]`: Autosaved editor draft state stored in case the page is refreshed or browser crashes during review. Removed upon successful "Publish".
