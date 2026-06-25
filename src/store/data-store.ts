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
  name: string;
  status: 'ACTIVE' | 'ARCHIVED';
  health: 'GREEN' | 'AMBER' | 'RED';
  complianceRate: number;
  details?: string;
  lead?: string;
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

  // CRUD Actions
  // Users
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Accounts
  addAccount: (
    account: Omit<Account, 'id' | 'governanceScore' | 'complianceScore' | 'ragStatus'>
  ) => void;
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
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Artifacts
  uploadArtifact: (
    projectId: string,
    file: { name: string; type: 'PDF' | 'PPT' | 'DOC'; size: string; category?: 'WBR' | 'MOM' | 'ARCHITECTURE' | 'NOTE' }
  ) => string;
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
  isGovernanceLoading: boolean;
  fetchGovernanceActivities: () => Promise<void>;
  completeGovernanceRecord: (id: string, notes?: string) => Promise<void>;
  recalculateGovernance: (projectId: string) => void;

  // AI Workspace
  addAIReport: (projectId: string, type: AIReport['type'], content: string, accountId?: string) => string;
  updateAIReport: (id: string, content: string) => void;
  publishAIReport: (id: string) => void;
}

export const useDataStore = create<DataStore>((set, get) => ({
  isGovernanceLoading: false,
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
      governanceScore: 88,
      complianceScore: 92,
      ragStatus: 'GREEN',
    },
    {
      id: 'acc-2',
      name: 'CVS Health',
      logoUrl:
        'https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=100&h=100&q=80',
      governanceScore: 68,
      complianceScore: 70,
      ragStatus: 'AMBER',
    },
    {
      id: 'acc-3',
      name: 'Baptist Health',
      logoUrl:
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=100&h=100&q=80',
      governanceScore: 42,
      complianceScore: 45,
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
  projects: [],
  artifacts: [
    {
      id: 'art-1',
      projectId: 'proj-1',
      name: 'Macy_MOM_Week24.docx',
      type: 'DOC',
      uploadedAt: '2026-06-15 10:00',
      size: '2.4 MB',
      status: 'COMPLETED',
      category: 'MOM',
    },
    {
      id: 'art-2',
      projectId: 'proj-1',
      name: 'LoyaltyPortal_WBR_Q2.pptx',
      type: 'PPT',
      uploadedAt: '2026-06-14 14:30',
      size: '8.1 MB',
      status: 'COMPLETED',
      category: 'WBR',
    },
    {
      id: 'art-3',
      projectId: 'proj-1',
      name: 'LoyaltyPortal_Architecture_V2.pdf',
      type: 'PDF',
      uploadedAt: '2026-06-10 11:15',
      size: '4.2 MB',
      status: 'COMPLETED',
      category: 'ARCHITECTURE',
    },
    {
      id: 'art-4',
      projectId: 'proj-1',
      name: 'SSO_Setup_Developer_Notes.docx',
      type: 'DOC',
      uploadedAt: '2026-06-12 09:45',
      size: '1.8 MB',
      status: 'COMPLETED',
      category: 'NOTE',
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
  governanceRecords: [
    {
      id: 'gov-1',
      projectId: 'proj-1',
      type: 'WEEKLY_NOTE',
      title: 'Weekly Note - Week 24',
      dueDate: '2026-06-19',
      status: 'COMPLETED',
      completedAt: '2026-06-18',
      notes: 'Completed notes sync.',
    },
    {
      id: 'gov-2',
      projectId: 'proj-1',
      type: 'WBR',
      title: 'WBR - Week 24',
      dueDate: '2026-06-18',
      status: 'COMPLETED',
      completedAt: '2026-06-18',
      notes: 'Successful presentation.',
    },
    {
      id: 'gov-3',
      projectId: 'proj-1',
      type: 'MBR',
      title: 'MBR - June 2026',
      dueDate: '2026-06-30',
      status: 'PENDING',
    },
    {
      id: 'gov-4',
      projectId: 'proj-5',
      type: 'WEEKLY_NOTE',
      title: 'Weekly Note - Week 24',
      dueDate: '2026-06-19',
      status: 'OVERDUE',
    },
    {
      id: 'gov-5',
      projectId: 'proj-5',
      type: 'WBR',
      title: 'WBR - Week 24',
      dueDate: '2026-06-18',
      status: 'OVERDUE',
    },
  ],
  aiReports: [
    {
      id: 'rep-seed-macy',
      projectId: 'proj-1',
      accountId: 'acc-1',
      type: 'ACCOUNT_DIGEST',
      content: `# Account Digest – Macy's\n\n## Executive Summary\nMacy's remains a **Green** account with strong delivery governance scores. Both active projects are on track with high compliance rates. Stakeholder sentiment across the Digital Front buying center is predominantly positive.\n\n## Compliance Highlights\n- **WBR Compliance**: 100% – All Weekly Business Reviews completed on time for the current period.\n- **Weekly Notes Compliance**: 100% – All weekly notes filed for the current sprint cycle.\n- **Active Projects**: 2 (Loyalty Portal, Mobile Checkout) — Both in GREEN health status.\n\n## Risk Posture\nNo open risks recorded for Macy's projects at this time. The sandbox API integration for the Loyalty Portal remains under monitoring.\n\n## Stakeholder Sentiment\nKey stakeholders, including Jane Doe (VP of Digital Engineering) and Bob Johnson (Engineering Director), reflect positive engagement. Last connects recorded within the past week.\n\n## Recommendations\n1. Schedule a proactive check-in with Bob Johnson ahead of the Core Portal deployment milestone (June 30).\n2. Prepare the MBR report for end-of-June review — governance records are in good shape.\n3. Confirm artifact uploads for the Mobile Checkout sprint closure documentation.`,
      createdAt: '2026-06-19 08:00',
      status: 'PUBLISHED',
    },
  ],

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

  addAccount: (acc) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        {
          ...acc,
          id: `acc-${state.accounts.length + 1}`,
          governanceScore: 100,
          complianceScore: 100,
          ragStatus: 'GREEN',
        },
      ],
    })),
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

  addProject: async (proj) => {
    try {
      const response = await api.post('/projects', proj);
      if (response.data?.success && response.data.data) {
        const newProj = response.data.data;
        const projectId = newProj.id;
        const defaultRecords: GovernanceRecord[] = [
          {
            id: `gov-${Date.now()}-1`,
            projectId,
            type: 'STANDUP',
            title: 'Daily Standup Check',
            dueDate: new Date(Date.now() + 86400000).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            id: `gov-${Date.now()}-2`,
            projectId,
            type: 'WEEKLY_NOTE',
            title: 'Weekly Note - Week 25',
            dueDate: new Date(Date.now() + 86400000 * 7).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            id: `gov-${Date.now()}-3`,
            projectId,
            type: 'WBR',
            title: 'WBR - Week 25',
            dueDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            id: `gov-${Date.now()}-4`,
            projectId,
            type: 'MBR',
            title: 'MBR - June 2026',
            dueDate: new Date(Date.now() + 86400000 * 14).toISOString().substring(0, 10),
            status: 'PENDING',
          },
          {
            id: `gov-${Date.now()}-5`,
            projectId,
            type: 'QBR',
            title: 'QBR - Q2 2026',
            dueDate: new Date(Date.now() + 86400000 * 30).toISOString().substring(0, 10),
            status: 'PENDING',
          },
        ];
        set((state) => ({
          projects: [...state.projects, newProj],
          governanceRecords: [...state.governanceRecords, ...defaultRecords],
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

  uploadArtifact: (projectId, file) => {
    const id = `art-${Date.now()}`;
    const newArt: Artifact = {
      id,
      projectId,
      name: file.name,
      type: file.type,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      size: file.size,
      status: 'PROCESSING',
      category: file.category,
    };
    set((state) => ({
      artifacts: [...state.artifacts, newArt],
    }));
    // Simulate background processing completion
    setTimeout(() => {
      set((state) => ({
        artifacts: state.artifacts.map((a) => (a.id === id ? { ...a, status: 'COMPLETED' } : a)),
      }));
    }, 4000);
    return id;
  },
  deleteArtifact: (id) =>
    set((state) => ({
      artifacts: state.artifacts.filter((a) => a.id !== id),
    })),

  addRisk: (projectId, risk) =>
    set((state) => ({
      risks: [...state.risks, { ...risk, id: `risk-${Date.now()}`, projectId, status: 'OPEN' }],
    })),
  updateRisk: (id, updates) =>
    set((state) => ({
      risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),
  deleteRisk: (id) =>
    set((state) => ({
      risks: state.risks.filter((r) => r.id !== id),
    })),

  addAction: (projectId, action) =>
    set((state) => ({
      actions: [
        ...state.actions,
        { ...action, id: `act-${Date.now()}`, projectId, status: 'PENDING' },
      ],
    })),
  updateAction: (id, updates) =>
    set((state) => ({
      actions: state.actions.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  deleteAction: (id) =>
    set((state) => ({
      actions: state.actions.filter((a) => a.id !== id),
    })),

  addDecision: (projectId, decision) =>
    set((state) => ({
      decisions: [...state.decisions, { ...decision, id: `dec-${Date.now()}`, projectId }],
    })),
  updateDecision: (id, updates) =>
    set((state) => ({
      decisions: state.decisions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  deleteDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.filter((d) => d.id !== id),
    })),

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

  fetchGovernanceActivities: async () => {
    set({ isGovernanceLoading: true });
    try {
      const response = await api.get('/governance/activities');
      let activities: any[] = [];
      if (Array.isArray(response.data)) {
        activities = response.data;
      } else if (response.data?.success && Array.isArray(response.data.data)) {
        activities = response.data.data;
      } else if (response.data?.success && Array.isArray(response.data.data?.items)) {
        activities = response.data.data.items;
      }

      if (activities.length > 0) {
        const checkLabels: Record<string, string> = {
          STANDUP: 'Daily Stand-Up',
          WEEKLY_NOTE: 'Weekly Notes',
          WBR: 'Weekly Business Review',
          FBR: 'Fortnightly Business Review',
          MBR: 'Monthly Business Review',
          QBR: 'Quarterly Business Review',
          STAKEHOLDER_1X1: 'Stakeholder 1:1',
          SECURITY_REVIEW: 'Security Review',
          NPS_FEEDBACK: 'NPS Feedback Survey',
          EMPLOYEE_1X1: 'Employee 1:1',
        };

        const mappedRecords: GovernanceRecord[] = activities.map((act) => {
          let type: GovernanceRecord['type'] = 'STANDUP';
          if (act.type === 'DAILY_STANDUP') type = 'STANDUP';
          else if (act.type === 'WEEKLY_NOTES') type = 'WEEKLY_NOTE';
          else type = act.type as GovernanceRecord['type'];

          const label = checkLabels[type] || type.replace('_', ' ');
          const title = act.notes || `${label} Record`;

          return {
            id: act.id,
            projectId: act.projectId,
            type,
            title,
            dueDate: act.activityDate ? act.activityDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
            completedAt: act.isCompliant && act.updatedAt ? act.updatedAt.substring(0, 10) : undefined,
            status: act.isCompliant ? 'COMPLETED' : (new Date(act.activityDate) < new Date() ? 'OVERDUE' : 'PENDING'),
            notes: act.notes || undefined,
          };
        });
        set({ governanceRecords: mappedRecords });
      }
    } catch (err) {
      console.error('Failed to fetch governance activities:', err);
    } finally {
      set({ isGovernanceLoading: false });
    }
  },

  completeGovernanceRecord: async (id, notes) => {
    // 1. Immediately update the local state synchronously
    set((state) => ({
      governanceRecords: state.governanceRecords.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'COMPLETED',
              completedAt: new Date().toISOString().substring(0, 10),
              notes: notes || r.notes,
            }
          : r
      ),
    }));

    // 2. Perform backend update
    try {
      await api.patch(`/governance/activities/${id}/complete`);
    } catch (err) {
      console.error('Failed to complete governance record on backend:', err);
    }
  },

  recalculateGovernance: (projectId) => {
    const records = get().governanceRecords.filter((r) => r.projectId === projectId);
    if (records.length === 0) return;
    const completedCount = records.filter((r) => r.status === 'COMPLETED').length;
    const totalCount = records.length;
    const rate = Math.round((completedCount / totalCount) * 100);

    // Determine health
    let health: Project['health'] = 'GREEN';
    if (rate < 50) health = 'RED';
    else if (rate < 80) health = 'AMBER';

    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, complianceRate: rate, health } : p
      ),
    }));

    // Update account totals
    const project = get().projects.find((p) => p.id === projectId);
    if (project) {
      const accountId = project.accountId;
      const accountProjects = get().projects.filter((p) => p.accountId === accountId);
      const avgCompliance = Math.round(
        accountProjects.reduce((sum, p) => sum + p.complianceRate, 0) / accountProjects.length
      );

      let accRAG: Account['ragStatus'] = 'GREEN';
      if (avgCompliance < 50) accRAG = 'RED';
      else if (avgCompliance < 80) accRAG = 'AMBER';

      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === accountId
            ? {
                ...a,
                complianceScore: avgCompliance,
                governanceScore: avgCompliance,
                ragStatus: accRAG,
              }
            : a
        ),
      }));
    }
  },

  addAIReport: (projectId, type, content, accountId?) => {
    const id = `rep-${Date.now()}`;
    const newReport: AIReport = {
      id,
      projectId,
      accountId,
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
}));
