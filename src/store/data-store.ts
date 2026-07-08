import { create } from 'zustand';

// Types representing Database Tables
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PLATFORM_ADMIN' | 'EXECUTIVE_LEADERSHIP' | 'ACCOUNT_LEAD' | 'DELIVERY_LEAD';
  permissions: string[];
}

export interface Account {
  id: string;
  name: string;
  logoUrl?: string;
  healthScore: number;
  deliveryScore: number;
  governanceScore: number;
  customerScore: number;
  ragStatus: 'GREEN' | 'AMBER' | 'RED';
}

export interface BuyingCenter {
  id: string;
  accountId: string;
  name: string;
  health: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}

export interface Stakeholder {
  id: string;
  buyingCenterId: string;
  name: string;
  role: string;
  email: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  lastConnectDate: string;
  nextScheduledConnect: string;
  parentId?: string;
}

export interface Project {
  id: string;
  accountId: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  health: 'GREEN' | 'AMBER' | 'RED';
  managementType: 'FS_MANAGED' | 'CLIENT_MANAGED';
  sprintVelocity?: number;
  throughputRate?: number;
  staffingCount?: number;
  staffingHealth?: number;
  wbrCompliance?: boolean;
  mbrCompliance?: boolean;
  qbrCompliance?: boolean;
  npsScore?: number;
}

export interface Artifact {
  id: string;
  projectId: string;
  name: string;
  type: 'PDF' | 'PPT' | 'DOC';
  uploadedAt: string;
  size: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  summary?: string;
}

export interface Risk {
  id: string;
  projectId: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  mitigationPlan: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface Action {
  id: string;
  projectId: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
}

export interface Decision {
  id: string;
  projectId: string;
  description: string;
  madeBy: string;
  date: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  dueDate: string;
  status: 'UPCOMING' | 'COMPLETED' | 'DELAYED';
}

export interface GovernanceRecord {
  id: string;
  projectId: string;
  type:
    | 'DAILY_STANDUP'
    | 'WEEKLY_NOTES'
    | 'WBR'
    | 'FBR'
    | 'MBR'
    | 'QBR'
    | 'STAKEHOLDER_1X1'
    | 'VP_CONNECT'
    | 'SECURITY_REVIEW'
    | 'NPS_FEEDBACK'
    | 'EMPLOYEE_1X1';
  activityDate: string;
  isCompliant: boolean;
  notes?: string;
  complianceNotes?: string;
  uploadedFileUrl?: string;
}

export interface AIReport {
  id: string;
  projectId: string;
  type: 'WEEKLY_NOTES' | 'WBR' | 'GOVERNANCE_SUMMARY' | 'ACCOUNT_DIGEST';
  content: string;
  createdAt: string;
  status: 'DRAFT' | 'PUBLISHED';
}

interface DataStore {
  // Database Tables State
  users: User[];
  accounts: Account[];
  buyingCenters: BuyingCenter[];
  stakeholders: Stakeholder[];
  projects: Project[];
  artifacts: Artifact[];
  risks: Risk[];
  actions: Action[];
  decisions: Decision[];
  milestones: Milestone[];
  governanceRecords: GovernanceRecord[];
  aiReports: AIReport[];
  aiExecutiveDigest: string;
  trendsData: any[];

  // CRUD Actions
  // Users
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Accounts
  addAccount: (
    account: Omit<Account, 'id' | 'healthScore' | 'deliveryScore' | 'governanceScore' | 'customerScore' | 'ragStatus'>
  ) => Promise<string>;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  // Buying Centers
  addBuyingCenter: (center: Omit<BuyingCenter, 'id'>) => void;
  updateBuyingCenter: (id: string, updates: Partial<BuyingCenter>) => void;
  deleteBuyingCenter: (id: string) => void;

  // Stakeholders
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  updateStakeholder: (id: string, updates: Partial<Stakeholder>) => void;
  deleteStakeholder: (id: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => Promise<void>;

  // Artifacts
  uploadArtifact: (
    projectId: string,
    file: File,
    type: 'PDF' | 'PPT' | 'DOC',
    size: string
  ) => Promise<string>;
  deleteArtifact: (id: string) => void;

  // Memory (Risks, Actions, Decisions, Milestones)
  addRisk: (projectId: string, risk: Omit<Risk, 'id' | 'projectId' | 'status'>) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  deleteRisk: (id: string) => void;

  addAction: (projectId: string, action: Omit<Action, 'id' | 'projectId' | 'status'>) => void;
  updateAction: (id: string, updates: Partial<Action>) => void;
  deleteAction: (id: string) => void;

  addDecision: (projectId: string, decision: Omit<Decision, 'id' | 'projectId'>) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;

  addMilestone: (
    projectId: string,
    milestone: Omit<Milestone, 'id' | 'projectId' | 'status'>
  ) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;

  // Governance
  completeGovernanceRecord: (id: string, notes?: string) => void;
  recalculateGovernance: (projectId: string) => void;

  // AI Workspace
  addAIReport: (projectId: string, type: AIReport['type'], content: string) => string;
  updateAIReport: (id: string, content: string) => void;
  publishAIReport: (id: string) => void;

  // Backend Sync
  syncWithBackend: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  // Default Mock Data
  users: [
    {
      id: 'usr-1',
      name: 'Sahil Jaryal',
      email: 'sahil@factspan.com',
      role: 'PLATFORM_ADMIN',
      permissions: ['ALL'],
    },
    {
      id: 'usr-2',
      name: 'Macy Account Manager',
      email: 'macy.lead@factspan.com',
      role: 'ACCOUNT_LEAD',
      permissions: ['READ_WRITE', 'APPROVE'],
    },
    {
      id: 'usr-3',
      name: 'Delivery Manager',
      email: 'delivery.lead@factspan.com',
      role: 'DELIVERY_LEAD',
      permissions: ['READ_WRITE'],
    },
    {
      id: 'usr-4',
      name: 'Venkatesh Executive',
      email: 'exec@factspan.com',
      role: 'EXECUTIVE_LEADERSHIP',
      permissions: ['READ_ONLY'],
    },
  ],
  accounts: [
    {
      id: 'acc-1',
      name: "Macy's",
      logoUrl:
        'https://images.unsplash.com/photo-1599305445671-ac291c95aba9?auto=format&fit=crop&w=100&h=100&q=80',
      healthScore: 90,
      deliveryScore: 95,
      governanceScore: 88,
      customerScore: 87,
      ragStatus: 'GREEN',
    },
    {
      id: 'acc-2',
      name: 'CVS Health',
      logoUrl:
        'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=100&h=100&q=80',
      healthScore: 69,
      deliveryScore: 65,
      governanceScore: 68,
      customerScore: 74,
      ragStatus: 'AMBER',
    },
    {
      id: 'acc-3',
      name: 'Baptist Health',
      logoUrl:
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=100&h=100&q=80',
      healthScore: 43,
      deliveryScore: 40,
      governanceScore: 42,
      customerScore: 47,
      ragStatus: 'RED',
    },
  ],
  buyingCenters: [
    {
      id: 'bc-1',
      accountId: 'acc-1',
      name: "Macy's Digital Front",
      health: 85,
      sentiment: 'POSITIVE',
    },
    {
      id: 'bc-2',
      accountId: 'acc-1',
      name: "Macy's Supply Chain",
      health: 90,
      sentiment: 'POSITIVE',
    },
    { id: 'bc-3', accountId: 'acc-2', name: 'CVS Digital', health: 70, sentiment: 'NEUTRAL' },
    {
      id: 'bc-4',
      accountId: 'acc-2',
      name: 'CVS Retail Pharmacy',
      health: 65,
      sentiment: 'NEGATIVE',
    },
    {
      id: 'bc-5',
      accountId: 'acc-3',
      name: 'Baptist Patient Portal',
      health: 40,
      sentiment: 'NEGATIVE',
    },
  ],
  stakeholders: [
    {
      id: 'stk-1',
      buyingCenterId: 'bc-1',
      name: 'Jane Doe',
      role: 'VP of Digital Engineering',
      email: 'jane.doe@macys.com',
      sentiment: 'POSITIVE',
      lastConnectDate: '2026-06-12',
      nextScheduledConnect: '2026-06-25',
    },
    {
      id: 'stk-2',
      buyingCenterId: 'bc-1',
      name: 'Bob Johnson',
      role: 'Engineering Director',
      email: 'bob.johnson@macys.com',
      sentiment: 'NEUTRAL',
      lastConnectDate: '2026-06-15',
      nextScheduledConnect: '2026-06-22',
      parentId: 'stk-1',
    },
    {
      id: 'stk-3',
      buyingCenterId: 'bc-3',
      name: 'Alice Smith',
      role: 'Product Executive',
      email: 'alice.smith@cvs.com',
      sentiment: 'NEUTRAL',
      lastConnectDate: '2026-06-10',
      nextScheduledConnect: '2026-06-24',
    },
    {
      id: 'stk-4',
      buyingCenterId: 'bc-4',
      name: 'Tom Hardy',
      role: 'VP Operations',
      email: 'tom.hardy@cvs.com',
      sentiment: 'NEGATIVE',
      lastConnectDate: '2026-06-01',
      nextScheduledConnect: '2026-06-19',
    },
    {
      id: 'stk-5',
      buyingCenterId: 'bc-5',
      name: 'Dr. Gregory House',
      role: 'CTO Baptist',
      email: 'gregory@baptist.org',
      sentiment: 'NEGATIVE',
      lastConnectDate: '2026-05-20',
      nextScheduledConnect: '2026-06-18',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      accountId: 'acc-1',
      name: "Macy's Loyalty Portal",
      status: 'ACTIVE',
      health: 'GREEN',
      managementType: 'FS_MANAGED',
      sprintVelocity: 15,
      staffingHealth: 95,
    },
    {
      id: 'proj-2',
      accountId: 'acc-1',
      name: "Macy's Mobile Checkout",
      status: 'ACTIVE',
      health: 'GREEN',
      managementType: 'FS_MANAGED',
      sprintVelocity: 14,
      staffingHealth: 90,
    },
    {
      id: 'proj-3',
      accountId: 'acc-2',
      name: 'CVS Caremark Integration',
      status: 'ACTIVE',
      health: 'AMBER',
      managementType: 'CLIENT_MANAGED',
    },
    {
      id: 'proj-4',
      accountId: 'acc-2',
      name: 'CVS Vaccine Scheduler',
      status: 'ACTIVE',
      health: 'GREEN',
      managementType: 'FS_MANAGED',
      sprintVelocity: 12,
      staffingHealth: 85,
    },
    {
      id: 'proj-5',
      accountId: 'acc-3',
      name: 'Baptist EHR Modernization',
      status: 'ACTIVE',
      health: 'RED',
      managementType: 'FS_MANAGED',
      sprintVelocity: 8,
      staffingHealth: 42,
    },
  ],
  artifacts: [
    {
      id: 'art-1',
      projectId: 'proj-1',
      name: 'Macy_MOM_Week24.docx',
      type: 'DOC',
      uploadedAt: '2026-06-15 10:00',
      size: '2.4 MB',
      status: 'COMPLETED',
    },
    {
      id: 'art-2',
      projectId: 'proj-1',
      name: 'LoyaltyPortal_WBR_Q2.pptx',
      type: 'PPT',
      uploadedAt: '2026-06-14 14:30',
      size: '8.1 MB',
      status: 'COMPLETED',
    },
  ],
  risks: [
    {
      id: 'risk-1',
      projectId: 'proj-5',
      description: 'GCP connection delays for EHR system API sandbox',
      severity: 'HIGH',
      mitigationPlan: 'Request direct access whitelist from Baptist Network team',
      status: 'OPEN',
    },
    {
      id: 'risk-2',
      projectId: 'proj-3',
      description: 'Dependencies on third-party security scanner tools',
      severity: 'MEDIUM',
      mitigationPlan: 'Parallelize development and mock scanning data logs',
      status: 'OPEN',
    },
  ],
  actions: [
    {
      id: 'act-1',
      projectId: 'proj-1',
      description: "Review WBR draft with Macy's lead sponsor",
      assignee: 'Account Lead',
      dueDate: '2026-06-20',
      status: 'PENDING',
    },
    {
      id: 'act-2',
      projectId: 'proj-5',
      description: 'Schedule meeting with Dr. Gregory House regarding sentiment drop',
      assignee: 'Delivery Lead',
      dueDate: '2026-06-22',
      status: 'PENDING',
    },
  ],
  decisions: [
    {
      id: 'dec-1',
      projectId: 'proj-1',
      description: 'Approved migrating core micro-frontends from legacy system to React SPA',
      madeBy: 'Jane Doe (VP)',
      date: '2026-06-05',
    },
  ],
  milestones: [
    {
      id: 'ms-1',
      projectId: 'proj-1',
      name: 'Deploy Core Portal',
      dueDate: '2026-06-30',
      status: 'UPCOMING',
    },
    {
      id: 'ms-2',
      projectId: 'proj-5',
      name: 'Sandbox Integration Phase 1',
      dueDate: '2026-06-15',
      status: 'DELAYED',
    },
  ],
  governanceRecords: [],
  aiReports: [],
  aiExecutiveDigest: 'Overall delivery health is loading...',
  trendsData: [],

  // CRUD Actions Implementation
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, { ...user, id: `usr-${state.users.length + 1}` }],
    })),
  updateUser: (id, updates) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),

  addAccount: async (acc) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...acc,
          healthScore: 100,
          deliveryScore: 100,
          governanceScore: 100,
          customerScore: 100,
          ragStatus: 'GREEN',
        }),
      });
      if (res.ok) {
        const createdAccount = await res.json();
        set((state) => ({ accounts: [...state.accounts, createdAccount] }));
        return createdAccount.id;
      } else {
        throw new Error('Failed to create account');
      }
    } catch (e) {
      console.error(e);
      // fallback to mock creation
      const mockId = `acc-${Date.now()}`;
      set((state) => ({
        accounts: [
          ...state.accounts,
          {
            ...acc,
            id: mockId,
            healthScore: 100,
            deliveryScore: 100,
            governanceScore: 100,
            customerScore: 100,
            ragStatus: 'GREEN',
          },
        ],
      }));
      return mockId;
    }
  },
  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  deleteAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((a) => a.id !== id),
    })),

  addBuyingCenter: (center) =>
    set((state) => ({
      buyingCenters: [
        ...state.buyingCenters,
        { ...center, id: `bc-${state.buyingCenters.length + 1}` },
      ],
    })),
  updateBuyingCenter: (id, updates) =>
    set((state) => ({
      buyingCenters: state.buyingCenters.map((bc) => (bc.id === id ? { ...bc, ...updates } : bc)),
    })),
  deleteBuyingCenter: (id) =>
    set((state) => ({
      buyingCenters: state.buyingCenters.filter((bc) => bc.id !== id),
    })),

  addStakeholder: (stakeholder) =>
    set((state) => ({
      stakeholders: [
        ...state.stakeholders,
        { ...stakeholder, id: `stk-${state.stakeholders.length + 1}` },
      ],
    })),
  updateStakeholder: (id, updates) =>
    set((state) => ({
      stakeholders: state.stakeholders.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  deleteStakeholder: (id) =>
    set((state) => ({
      stakeholders: state.stakeholders.filter((s) => s.id !== id),
    })),

  addProject: async (proj) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proj),
      });
      if (res.ok) {
        const createdProject = await res.json();
        set((state) => ({ projects: [...state.projects, createdProject] }));
        return createdProject.id;
      } else {
        throw new Error('Failed to create project');
      }
    } catch (e) {
      console.error(e);
      const mockId = `proj-${Date.now()}`;
      set((state) => ({
        projects: [...state.projects, { ...proj, id: mockId }],
      }));
      return mockId;
    }
  },
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  deleteProject: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      } else {
        throw new Error('Failed to delete project on backend');
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
      }));
    }
  },

  uploadArtifact: async (projectId, file, type, size) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', projectId);
      formData.append('type', type);
      formData.append('size', size);

      const res = await fetch('http://localhost:8080/api/v1/artifacts/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const payload = await res.json();
        const createdArtifact = payload.data;
        set((state) => ({
          artifacts: [...state.artifacts, createdArtifact],
        }));
        return createdArtifact.id;
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (e) {
      console.error(e);
      // Fallback
      const mockId = `art-${Date.now()}`;
      const newArt: Artifact = {
        id: mockId,
        projectId,
        name: file.name,
        type,
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        size,
        status: 'COMPLETED',
        summary: 'Generated mock summary (Offline Mode).',
      };
      set((state) => ({
        artifacts: [...state.artifacts, newArt],
      }));
      return mockId;
    }
  },
  deleteArtifact: (id) =>
    set((state) => ({
      artifacts: state.artifacts.filter((a) => a.id !== id),
    })),

  addRisk: async (projectId, risk) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/risks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, ...risk }),
      });
      if (res.ok) {
        const payload = await res.json();
        set((state) => ({
          risks: [...state.risks, payload.data],
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        risks: [...state.risks, { ...risk, id: `risk-${Date.now()}`, projectId, status: 'OPEN' }],
      }));
    }
  },
  updateRisk: async (id, updates) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/risks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const payload = await res.json();
        set((state) => ({
          risks: state.risks.map((r) => (r.id === id ? payload.data : r)),
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      }));
    }
  },
  deleteRisk: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/risks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set((state) => ({
          risks: state.risks.filter((r) => r.id !== id),
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        risks: state.risks.filter((r) => r.id !== id),
      }));
    }
  },

  addAction: async (projectId, action) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/action-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, ...action }),
      });
      if (res.ok) {
        const payload = await res.json();
        set((state) => ({
          actions: [...state.actions, payload.data],
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        actions: [
          ...state.actions,
          { ...action, id: `act-${Date.now()}`, projectId, status: 'PENDING' },
        ],
      }));
    }
  },
  updateAction: async (id, updates) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/action-items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const payload = await res.json();
        set((state) => ({
          actions: state.actions.map((a) => (a.id === id ? payload.data : a)),
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        actions: state.actions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
      }));
    }
  },
  deleteAction: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/action-items/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== id),
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        actions: state.actions.filter((a) => a.id !== id),
      }));
    }
  },

  addDecision: async (projectId, decision) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, ...decision }),
      });
      if (res.ok) {
        const payload = await res.json();
        set((state) => ({
          decisions: [...state.decisions, payload.data],
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        decisions: [...state.decisions, { ...decision, id: `dec-${Date.now()}`, projectId }],
      }));
    }
  },
  updateDecision: (id, updates) =>
    set((state) => ({
      decisions: state.decisions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  deleteDecision: async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/decisions/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
        }));
        await get().syncWithBackend();
      }
    } catch (e) {
      console.error(e);
      set((state) => ({
        decisions: state.decisions.filter((d) => d.id !== id),
      }));
    }
  },

  addMilestone: (projectId, milestone) =>
    set((state) => ({
      milestones: [
        ...state.milestones,
        { ...milestone, id: `ms-${Date.now()}`, projectId, status: 'UPCOMING' },
      ],
    })),
  updateMilestone: (id, updates) =>
    set((state) => ({
      milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),
  deleteMilestone: (id) =>
    set((state) => ({
      milestones: state.milestones.filter((m) => m.id !== id),
    })),

  completeGovernanceRecord: async (id, notes) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/governance-activities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompliant: true, notes, activityDate: new Date().toISOString() }),
      });
      if (res.ok) {
        set((state) => ({
          governanceRecords: state.governanceRecords.map((r) =>
            r.id === id
              ? {
                  ...r,
                  isCompliant: true,
                  activityDate: new Date().toISOString(),
                  notes,
                }
              : r
          ),
        }));
      }
    } catch (e) {
      console.error(e);
      // Fallback
      set((state) => ({
        governanceRecords: state.governanceRecords.map((r) =>
          r.id === id
            ? {
                ...r,
                isCompliant: true,
                activityDate: new Date().toISOString(),
                notes,
              }
            : r
        ),
      }));
    }
  },

  recalculateGovernance: (projectId) => {
    const records = get().governanceRecords.filter((r) => r.projectId === projectId);
    if (records.length === 0) return;
    const completedCount = records.filter((r) => r.isCompliant).length;
    const totalCount = records.length;
    const rate = Math.round((completedCount / totalCount) * 100);

    const project = get().projects.find((p) => p.id === projectId);
    if (project) {
      const accountId = project.accountId;
      get().updateAccount(accountId, { governanceScore: rate });
    }
    // Determine health
    let health: Project['health'] = 'GREEN';
    if (rate < 50) health = 'RED';
    else if (rate < 80) health = 'AMBER';

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, health } : p
      ),
    }));

    // Update account totals
    const updatedProject = get().projects.find((p) => p.id === projectId);
    if (updatedProject) {
      const accountId = updatedProject.accountId;
      const accountProjects = get().projects.filter((p) => p.accountId === accountId);
      const avgCompliance = Math.round(
        accountProjects.reduce((sum, p) => sum + (p.health === 'GREEN' ? 100 : p.health === 'AMBER' ? 70 : 40), 0) / accountProjects.length
      );

      let accRAG: Account['ragStatus'] = 'GREEN';
      if (avgCompliance < 50) accRAG = 'RED';
      else if (avgCompliance < 80) accRAG = 'AMBER';

      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                healthScore: avgCompliance,
                deliveryScore: avgCompliance,
                governanceScore: avgCompliance,
                customerScore: avgCompliance,
                ragStatus: accRAG,
              }
            : a
        ),
      }));
    }
  },

  addAIReport: (projectId, type, content) => {
    const id = `rep-${Date.now()}`;
    const newReport: AIReport = {
      id,
      projectId,
      type,
      content,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'DRAFT',
    };
    set((state) => ({
      aiReports: [...state.aiReports, newReport],
    }));
    return id;
  },
  updateAIReport: (id, content) =>
    set((state) => ({
      aiReports: state.aiReports.map((r) => (r.id === id ? { ...r, content } : r)),
    })),
  publishAIReport: (id) =>
    set((state) => ({
      aiReports: state.aiReports.map((r) => (r.id === id ? { ...r, status: 'PUBLISHED' } : r)),
    })),

  syncWithBackend: async () => {
    try {
      const [accRes, projRes, govRes, artRes, risksRes, actionsRes, decisionsRes, digestRes, trendsRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/accounts'),
        fetch('http://localhost:8080/api/v1/projects'),
        fetch('http://localhost:8080/api/v1/governance-activities'),
        fetch('http://localhost:8080/api/v1/artifacts'),
        fetch('http://localhost:8080/api/v1/risks'),
        fetch('http://localhost:8080/api/v1/action-items'),
        fetch('http://localhost:8080/api/v1/decisions'),
        fetch('http://localhost:8080/api/v1/dashboard/portfolio-summary'),
        fetch('http://localhost:8080/api/v1/dashboard/governance-trends'),
      ]);

      if (accRes.ok && projRes.ok && govRes.ok && artRes.ok) {
        const dbAccounts = await accRes.json();
        const dbProjects = await projRes.json();
        const dbGovRecords = await govRes.json();
        const dbArtifactsPayload = await artRes.json();
        const dbArtifacts = dbArtifactsPayload.data?.items || [];

        let dbRisks = [];
        if (risksRes.ok) {
          const payload = await risksRes.json();
          dbRisks = payload.data || [];
        }

        let dbActions = [];
        if (actionsRes.ok) {
          const payload = await actionsRes.json();
          dbActions = payload.data || [];
        }

        let dbDecisions = [];
        if (decisionsRes.ok) {
          const payload = await decisionsRes.json();
          dbDecisions = payload.data || [];
        }

        let aiExecutiveDigest = 'Overall health is 86%. loading...';
        if (digestRes.ok) {
          const payload = await digestRes.json();
          aiExecutiveDigest = payload.data?.aiExecutiveDigest || aiExecutiveDigest;
        }

        let trendsData = [];
        if (trendsRes.ok) {
          const payload = await trendsRes.json();
          trendsData = payload.data || [];
        }

        set(() => ({
          accounts: dbAccounts,
          projects: dbProjects,
          governanceRecords: dbGovRecords,
          artifacts: dbArtifacts,
          risks: dbRisks,
          actions: dbActions,
          decisions: dbDecisions,
          aiExecutiveDigest,
          trendsData,
        }));
      }
    } catch (e) {
      console.error('Failed to sync with backend', e);
    }
  },
}));
