import { create } from 'zustand';
import api from '../api';

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
  governanceScore: number;
  complianceScore: number;
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
  buyingCenterId: string;
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  health: 'GREEN' | 'AMBER' | 'RED';
  complianceRate: number;
  details?: string;
  lead?: string;
  projectType: 'CUSTOMER_MANAGED' | 'INTERNAL_TEAM_MANAGED';
  seniorDirector?: string;
  vicePresident?: string;
  supervisor?: string;
  sprintStartDate?: string;
  sprintEndDate?: string;
  deliveryPerformance?: number;
  overflow?: number;
}

export interface Artifact {
  id: string;
  projectId: string;
  name: string;
  type: 'PDF' | 'PPT' | 'DOC';
  uploadedAt: string;
  size: string;
  status: 'PROCESSING' | 'COMPLETED';
  category?: 'WBR' | 'MOM' | 'ARCHITECTURE' | 'NOTE';
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
    | 'STANDUP'
    | 'WEEKLY_NOTE'
    | 'WBR'
    | 'FBR'
    | 'MBR'
    | 'QBR'
    | 'STAKEHOLDER_1X1'
    | 'SECURITY_REVIEW'
    | 'NPS_FEEDBACK'
    | 'EMPLOYEE_1X1';
  title: string;
  dueDate: string;
  completedAt?: string;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  notes?: string;
}

export interface AIReport {
  id: string;
  projectId: string;
  accountId?: string;
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

  // Fetch Actions
  fetchAccounts: () => Promise<void>;
  fetchBuyingCenters: () => Promise<void>;
  fetchStakeholders: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  fetchArtifacts: () => Promise<void>;
  fetchRisks: () => Promise<void>;
  fetchActions: () => Promise<void>;
  fetchDecisions: () => Promise<void>;
  fetchMilestones: () => Promise<void>;
  fetchGovernanceRecords: () => Promise<void>;
  fetchAIReports: () => Promise<void>;

  // CRUD Actions
  // Users
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Accounts
  addAccount: (
    account: Omit<Account, 'id' | 'governanceScore' | 'complianceScore' | 'ragStatus'>
  ) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  // Buying Centers
  addBuyingCenter: (center: Omit<BuyingCenter, 'id' | 'health' | 'sentiment'>) => Promise<void>;
  updateBuyingCenter: (id: string, updates: Partial<BuyingCenter>) => Promise<void>;
  deleteBuyingCenter: (id: string) => Promise<void>;

  // Stakeholders
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'lastConnectDate' | 'nextScheduledConnect'>) => Promise<void>;
  updateStakeholder: (id: string, updates: Partial<Stakeholder>) => Promise<void>;
  deleteStakeholder: (id: string) => Promise<void>;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'buyingCenterId'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Artifacts
  uploadArtifact: (
    projectId: string,
    file: { name: string; type: 'PDF' | 'PPT' | 'DOC'; size: string; category?: 'WBR' | 'MOM' | 'ARCHITECTURE' | 'NOTE' }
  ) => Promise<string>;
  deleteArtifact: (id: string) => Promise<void>;

  // Risks
  addRisk: (projectId: string, risk: Omit<Risk, 'id' | 'projectId' | 'status'>) => Promise<void>;
  updateRisk: (id: string, updates: Partial<Risk>) => Promise<void>;
  deleteRisk: (id: string) => Promise<void>;

  // Actions
  addAction: (projectId: string, action: Omit<Action, 'id' | 'projectId' | 'status'>) => Promise<void>;
  updateAction: (id: string, updates: Partial<Action>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;

  // Decisions
  addDecision: (projectId: string, decision: Omit<Decision, 'id' | 'projectId'>) => Promise<void>;
  updateDecision: (id: string, updates: Partial<Decision>) => Promise<void>;
  deleteDecision: (id: string) => Promise<void>;

  // Milestones
  addMilestone: (
    projectId: string,
    milestone: Omit<Milestone, 'id' | 'projectId' | 'status'>
  ) => Promise<void>;
  updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (id: string) => Promise<void>;

  // Governance
  completeGovernanceRecord: (id: string, notes?: string) => Promise<void>;
  recalculateGovernance: (projectId: string) => Promise<void>;

  // AI Workspace
  addAIReport: (projectId: string, type: AIReport['type'], content: string, accountId?: string) => Promise<string>;
  updateAIReport: (id: string, content: string) => Promise<void>;
  publishAIReport: (id: string) => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  // Default Mock Users - Static as no backend routes exist to register / delete users in front
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
  
  // Dynamic Arrays initialized to empty (fetched from backend)
  accounts: [],
  buyingCenters: [],
  stakeholders: [],
  projects: [],
  artifacts: [],
  risks: [],
  actions: [],
  decisions: [],
  milestones: [],
  governanceRecords: [],
  aiReports: [],

  // ── Fetch Actions Implementation ──
  
  fetchAccounts: async () => {
    try {
      const response = await api.get('/accounts');
      if (response.data?.success && response.data.data?.items) {
        set({ accounts: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    }
  },

  fetchBuyingCenters: async () => {
    try {
      const response = await api.get('/buying-centers');
      if (response.data?.success && response.data.data?.items) {
        set({ buyingCenters: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch buying centers:', err);
    }
  },

  fetchStakeholders: async () => {
    try {
      const response = await api.get('/stakeholders');
      if (response.data?.success && response.data.data?.items) {
        set({ stakeholders: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch stakeholders:', err);
    }
  },

  fetchProjects: async () => {
    try {
      const response = await api.get('/projects');
      if (response.data?.success && response.data.data?.items) {
        set({ projects: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  },

  fetchArtifacts: async () => {
    try {
      const response = await api.get('/artifacts');
      if (response.data?.success && response.data.data?.items) {
        set({ artifacts: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch artifacts:', err);
    }
  },

  fetchRisks: async () => {
    try {
      const response = await api.get('/risks');
      if (response.data?.success && response.data.data?.items) {
        set({ risks: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch risks:', err);
    }
  },

  fetchActions: async () => {
    try {
      const response = await api.get('/action-items');
      if (response.data?.success && response.data.data?.items) {
        set({ actions: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch actions:', err);
    }
  },

  fetchDecisions: async () => {
    try {
      const response = await api.get('/decisions');
      if (response.data?.success && response.data.data?.items) {
        set({ decisions: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch decisions:', err);
    }
  },

  fetchMilestones: async () => {
    try {
      const response = await api.get('/milestones');
      if (response.data?.success && response.data.data?.items) {
        set({ milestones: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch milestones:', err);
    }
  },

  fetchGovernanceRecords: async () => {
    try {
      const response = await api.get('/governance-activities');
      if (response.data?.success && response.data.data?.items) {
        set({ governanceRecords: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch governance activities:', err);
    }
  },

  fetchAIReports: async () => {
    try {
      const response = await api.get('/ai-drafts');
      if (response.data?.success && response.data.data?.items) {
        set({ aiReports: response.data.data.items });
      }
    } catch (err) {
      console.error('Failed to fetch AI reports:', err);
    }
  },

  // ── Users CRUD (In Memory static fallbacks) ──
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

  // ── Accounts CRUD ──
  addAccount: async (acc) => {
    try {
      const response = await api.post('/accounts', acc);
      if (response.data?.success && response.data.data) {
        set((state) => ({ accounts: [...state.accounts, response.data.data] }));
      }
    } catch (err) {
      console.error('Failed to add account:', err);
    }
  },
  updateAccount: async (id, updates) => {
    try {
      const response = await api.patch(`/accounts/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? response.data.data : a)),
        }));
      }
    } catch (err) {
      console.error('Failed to update account:', err);
    }
  },
  deleteAccount: async (id) => {
    try {
      const response = await api.delete(`/accounts/${id}`);
      if (response.data?.success) {
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  },

  // ── Buying Centers CRUD ──
  addBuyingCenter: async (center) => {
    try {
      const response = await api.post('/buying-centers', center);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          buyingCenters: [...state.buyingCenters, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add buying center:', err);
    }
  },
  updateBuyingCenter: async (id, updates) => {
    try {
      const response = await api.patch(`/buying-centers/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          buyingCenters: state.buyingCenters.map((bc) => (bc.id === id ? response.data.data : bc)),
        }));
      }
    } catch (err) {
      console.error('Failed to update buying center:', err);
    }
  },
  deleteBuyingCenter: async (id) => {
    try {
      const response = await api.delete(`/buying-centers/${id}`);
      if (response.data?.success) {
        set((state) => ({
          buyingCenters: state.buyingCenters.filter((bc) => bc.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete buying center:', err);
    }
  },

  // ── Stakeholders CRUD ──
  addStakeholder: async (stakeholder) => {
    try {
      const response = await api.post('/stakeholders', stakeholder);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          stakeholders: [...state.stakeholders, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add stakeholder:', err);
    }
  },
  updateStakeholder: async (id, updates) => {
    try {
      const response = await api.patch(`/stakeholders/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          stakeholders: state.stakeholders.map((s) => (s.id === id ? response.data.data : s)),
        }));
      }
    } catch (err) {
      console.error('Failed to update stakeholder:', err);
    }
  },
  deleteStakeholder: async (id) => {
    try {
      const response = await api.delete(`/stakeholders/${id}`);
      if (response.data?.success) {
        set((state) => ({
          stakeholders: state.stakeholders.filter((s) => s.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete stakeholder:', err);
    }
  },

  // ── Projects CRUD ──
  addProject: async (proj) => {
    try {
      const response = await api.post('/projects', proj);
      if (response.data?.success && response.data.data) {
        const newProj = response.data.data;
        const projectId = newProj.id;
        
        // Generate and seed backend governance activity records
        const defaultRecords = [
          {
            type: 'STANDUP',
            title: 'Daily Standup Check',
            dueDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            type: 'WEEKLY_NOTE',
            title: 'Weekly Note - Week 25',
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            type: 'WBR',
            title: 'WBR - Week 25',
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            type: 'MBR',
            title: 'MBR - June 2026',
            dueDate: new Date(Date.now() + 86400000 * 14).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            type: 'QBR',
            title: 'QBR - Q2 2026',
            dueDate: new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 10),
            status: 'PENDING',
          },
        ];

        // Save records to database sequentially
        const savedRecords: GovernanceRecord[] = [];
        for (const record of defaultRecords) {
          const res = await api.post('/governance-activities', {
            projectId,
            ...record,
          });
          if (res.data?.success) {
            savedRecords.push(res.data.data);
          }
        }

        set((state) => ({
          projects: [...state.projects, newProj],
          governanceRecords: [...state.governanceRecords, ...savedRecords],
        }));
      }
    } catch (err) {
      console.error('Failed to add project:', err);
    }
  },

  updateProject: async (id, updates) => {
    try {
      const response = await api.patch(`/projects/${id}`, updates);
      if (response.data?.success && response.data.data) {
        const updatedProj = response.data.data;
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updatedProj : p)),
        }));
      }
    } catch (err) {
      console.error('Failed to update project:', err);
    }
  },

  deleteProject: async (id) => {
    try {
      const response = await api.delete(`/projects/${id}`);
      if (response.data?.success) {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  },

  // ── Artifacts CRUD ──
  uploadArtifact: async (projectId, file) => {
    const id = `art-${Date.now()}`;
    try {
      const response = await api.post('/artifacts', {
        id,
        projectId,
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'PROCESSING',
      });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          artifacts: [...state.artifacts, response.data.data],
        }));

        // Simulate background processing completion
        setTimeout(async () => {
          set((state) => ({
            artifacts: state.artifacts.map((a) => (a.id === id ? { ...a, status: 'COMPLETED' } : a)),
          }));
        }, 4000);
      }
    } catch (err) {
      console.error('Failed to upload artifact:', err);
    }
    return id;
  },

  deleteArtifact: async (id) => {
    try {
      const response = await api.delete(`/artifacts/${id}`);
      if (response.data?.success) {
        set((state) => ({
          artifacts: state.artifacts.filter((a) => a.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete artifact:', err);
    }
  },

  // ── Risks CRUD ──
  addRisk: async (projectId, risk) => {
    try {
      const response = await api.post('/risks', { ...risk, projectId });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          risks: [...state.risks, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add risk:', err);
    }
  },
  updateRisk: async (id, updates) => {
    try {
      const response = await api.patch(`/risks/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          risks: state.risks.map((r) => (r.id === id ? response.data.data : r)),
        }));
      }
    } catch (err) {
      console.error('Failed to update risk:', err);
    }
  },
  deleteRisk: async (id) => {
    try {
      const response = await api.delete(`/risks/${id}`);
      if (response.data?.success) {
        set((state) => ({
          risks: state.risks.filter((r) => r.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete risk:', err);
    }
  },

  // ── Actions CRUD ──
  addAction: async (projectId, action) => {
    try {
      const response = await api.post('/action-items', { ...action, projectId });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          actions: [...state.actions, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add action:', err);
    }
  },
  updateAction: async (id, updates) => {
    try {
      const response = await api.patch(`/action-items/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          actions: state.actions.map((a) => (a.id === id ? response.data.data : a)),
        }));
      }
    } catch (err) {
      console.error('Failed to update action:', err);
    }
  },
  deleteAction: async (id) => {
    try {
      const response = await api.delete(`/action-items/${id}`);
      if (response.data?.success) {
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete action:', err);
    }
  },

  // ── Decisions CRUD ──
  addDecision: async (projectId, decision) => {
    try {
      const response = await api.post('/decisions', { ...decision, projectId });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          decisions: [...state.decisions, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add decision:', err);
    }
  },
  updateDecision: async (id, updates) => {
    try {
      const response = await api.patch(`/decisions/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          decisions: state.decisions.map((d) => (d.id === id ? response.data.data : d)),
        }));
      }
    } catch (err) {
      console.error('Failed to update decision:', err);
    }
  },
  deleteDecision: async (id) => {
    try {
      const response = await api.delete(`/decisions/${id}`);
      if (response.data?.success) {
        set((state) => ({
          decisions: state.decisions.filter((d) => d.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete decision:', err);
    }
  },

  // ── Milestones CRUD ──
  addMilestone: async (projectId, milestone) => {
    const id = `ms-${Date.now()}`;
    try {
      const response = await api.post('/milestones', { ...milestone, id, projectId });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          milestones: [...state.milestones, response.data.data],
        }));
      }
    } catch (err) {
      console.error('Failed to add milestone:', err);
    }
  },
  updateMilestone: async (id, updates) => {
    try {
      const response = await api.patch(`/milestones/${id}`, updates);
      if (response.data?.success && response.data.data) {
        set((state) => ({
          milestones: state.milestones.map((m) => (m.id === id ? response.data.data : m)),
        }));
      }
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  },
  deleteMilestone: async (id) => {
    try {
      const response = await api.delete(`/milestones/${id}`);
      if (response.data?.success) {
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
        }));
      }
    } catch (err) {
      console.error('Failed to delete milestone:', err);
    }
  },

  // ── Governance ──
  completeGovernanceRecord: async (id, notes) => {
    try {
      const record = get().governanceRecords.find((r) => r.id === id);
      if (!record) return;

      const response = await api.patch(`/governance-activities/${id}`, {
        status: 'COMPLETED',
        notes,
        completedAt: new Date().toISOString().substring(0, 10),
      });

      if (response.data?.success && response.data.data) {
        set((state) => ({
          governanceRecords: state.governanceRecords.map((r) =>
            r.id === id ? response.data.data : r
          ),
        }));
        await get().recalculateGovernance(record.projectId);
      }
    } catch (err) {
      console.error('Failed to complete governance record:', err);
    }
  },

  recalculateGovernance: async (projectId) => {
    const records = get().governanceRecords.filter((r) => r.projectId === projectId);
    if (records.length === 0) return;
    const completedCount = records.filter((r) => r.status === 'COMPLETED').length;
    const totalCount = records.length;
    const rate = Math.round((completedCount / totalCount) * 100);

    let health: Project['health'] = 'GREEN';
    if (rate < 50) health = 'RED';
    else if (rate < 80) health = 'AMBER';

    try {
      const response = await api.patch(`/projects/${projectId}`, {
        complianceRate: rate,
        health,
      });

      if (response.data?.success && response.data.data) {
        const updatedProj = response.data.data;
        set((state) => ({
          projects: state.projects.map((p) => (p.id === projectId ? updatedProj : p)),
        }));

        const accountId = updatedProj.accountId;
        const accountProjects = get().projects.filter((p) => p.accountId === accountId);
        const avgCompliance = Math.round(
          accountProjects.reduce((sum, p) => sum + p.complianceRate, 0) / accountProjects.length
        );

        let accRAG: Account['ragStatus'] = 'GREEN';
        if (avgCompliance < 50) accRAG = 'RED';
        else if (avgCompliance < 80) accRAG = 'AMBER';

        const accResponse = await api.patch(`/accounts/${accountId}`, {
          complianceScore: avgCompliance,
          governanceScore: avgCompliance,
          ragStatus: accRAG,
        });

        if (accResponse.data?.success && accResponse.data.data) {
          set((state) => ({
            accounts: state.accounts.map((a) =>
              a.id === accountId ? accResponse.data.data : a
            ),
          }));
        }
      }
    } catch (err) {
      console.error('Failed to recalculate governance scores:', err);
    }
  },

  // ── AI Workspace ──
  addAIReport: async (projectId, type, content, accountId?) => {
    try {
      const response = await api.post('/ai-drafts', {
        projectId,
        accountId,
        type,
        content,
      });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          aiReports: [...state.aiReports, response.data.data],
        }));
        return response.data.data.id;
      }
    } catch (err) {
      console.error('Failed to add AI report:', err);
    }
    return '';
  },

  updateAIReport: async (id, content) => {
    try {
      const response = await api.patch(`/ai-drafts/${id}`, { content });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          aiReports: state.aiReports.map((r) => (r.id === id ? response.data.data : r)),
        }));
      }
    } catch (err) {
      console.error('Failed to update AI report:', err);
    }
  },

  publishAIReport: async (id) => {
    try {
      const response = await api.patch(`/ai-drafts/${id}`, { status: 'PUBLISHED' });
      if (response.data?.success && response.data.data) {
        set((state) => ({
          aiReports: state.aiReports.map((r) => (r.id === id ? response.data.data : r)),
        }));
      }
    } catch (err) {
      console.error('Failed to publish AI report:', err);
    }
  },
}));
