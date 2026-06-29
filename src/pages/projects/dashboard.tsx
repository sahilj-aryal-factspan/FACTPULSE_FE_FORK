import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import type { GovernanceRecord, Risk, Action, Decision, Milestone } from '../../store/data-store';
import { useAuthStore } from '../../store/auth-store';

// ─── Helper utilities ────────────────────────────────────────────────────────

function getRagColors(status: 'GREEN' | 'AMBER' | 'RED') {
  switch (status) {
    case 'GREEN':
      return { bg: '#def7ec', text: '#03543f', border: '#bcf0da', dot: '#10b981' };
    case 'AMBER':
      return { bg: '#fef3c7', text: '#92400e', border: '#fde68a', dot: '#f59e0b' };
    case 'RED':
      return { bg: '#fde8e8', text: '#9b1c1c', border: '#fabdbe', dot: '#ef4444' };
  }
}

function getSentimentMeta(s: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE') {
  switch (s) {
    case 'POSITIVE':
      return { icon: '🟢', color: '#10b981', label: 'Positive', bg: 'rgba(16,185,129,0.10)' };
    case 'NEUTRAL':
      return { icon: '🟡', color: '#f59e0b', label: 'Neutral', bg: 'rgba(245,158,11,0.10)' };
    case 'NEGATIVE':
      return { icon: '🔴', color: '#ef4444', label: 'Negative', bg: 'rgba(239,68,68,0.10)' };
  }
}

// ─── Mini Metric Tile ─────────────────────────────────────────────────────────

function MiniMetric({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        flex: '1 1 150px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color, lineHeight: 1.1, marginTop: '2px' }}>
          {value}
        </div>
      </div>
    </div>
  );
}

// ─── Compliance Bar ───────────────────────────────────────────────────────────

function ComplianceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
        <span style={{ color: '#64748b', fontWeight: 600 }}>{label}</span>
        <span style={{ fontWeight: 800, color }}>{value}%</span>
      </div>
      <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${Math.min(100, value)}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            borderRadius: '4px',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─── Sentiment Donut (SVG) ───────────────────────────────────────────────────

function SentimentDonut({
  positive,
  neutral,
  negative,
  total,
}: {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}) {
  const r = 36;
  const cx = 44;
  const cy = 44;
  const circumference = 2 * Math.PI * r;
  const posAngle = total > 0 ? (positive / total) * circumference : 0;
  const neutAngle = total > 0 ? (neutral / total) * circumference : 0;
  const negAngle = total > 0 ? (negative / total) * circumference : 0;

  let offset = 0;
  const segments = [
    { pct: posAngle, color: '#10b981', gap: circumference - posAngle, start: offset },
    { pct: neutAngle, color: '#f59e0b', gap: circumference - neutAngle, start: (offset += posAngle) },
    { pct: negAngle, color: '#ef4444', gap: circumference - negAngle, start: (offset += neutAngle) },
  ];

  const score = total > 0 ? Math.round((positive / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        ) : (
          segments.map((seg, i) =>
            seg.pct > 0 ? (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="9"
                strokeDasharray={`${seg.pct} ${seg.gap}`}
                strokeDashoffset={-seg.start + circumference / 4}
                strokeLinecap="round"
              />
            ) : null
          )
        )}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e293b">
          {score}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#94a3b8">
          positive
        </text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          <span style={{ color: '#475569' }}>Positive: <strong>{positive}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
          <span style={{ color: '#475569' }}>Neutral: <strong>{neutral}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
          <span style={{ color: '#475569' }}>Negative: <strong>{negative}</strong></span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProjectDashboardPage() {
  const { accountId, projectId } = useParams<{ accountId: string; projectId: string }>();
  const user = useAuthStore((state) => state.user);
  const canEditProject = user && ['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD'].includes(user.role);

  const {
    accounts,
    projects,
    buyingCenters,
    stakeholders,
    risks,
    actions,
    decisions,
    milestones,
    governanceRecords,
    artifacts,
    addRisk,
    updateRisk,
    deleteRisk,
    addAction,
    updateAction,
    deleteAction,
    addDecision,
    deleteDecision,
    completeGovernanceRecord,
    recalculateGovernance,
    uploadArtifact,
    deleteArtifact,
  } = useDataStore();

  const account = accounts.find((a) => a.id === accountId);
  const project = projects.find((p) => p.id === projectId);

  // ── Derived data ───────────────────────────────────────────────────────────
  const projectRisks = risks.filter((r) => r.projectId === projectId);
  const projectActions = actions.filter((a) => a.projectId === projectId);
  const projectDecisions = decisions.filter((d) => d.projectId === projectId);
  const projectMilestones = milestones.filter((m) => m.projectId === projectId);
  const projectGovRecords = governanceRecords.filter((r) => r.projectId === projectId);

  // Stakeholders: via account → buying centers → stakeholders
  const accountBuyingCenters = buyingCenters.filter((bc) => bc.accountId === accountId);
  const bcIds = accountBuyingCenters.map((bc) => bc.id);
  const projectStakeholders = stakeholders.filter((s) => bcIds.includes(s.buyingCenterId));

  // Sentiment breakdown
  const posCount = projectStakeholders.filter((s) => s.sentiment === 'POSITIVE').length;
  const neutCount = projectStakeholders.filter((s) => s.sentiment === 'NEUTRAL').length;
  const negCount = projectStakeholders.filter((s) => s.sentiment === 'NEGATIVE').length;
  const totalStk = projectStakeholders.length;

  // Governance compliance metrics
  const wbrRecords = projectGovRecords.filter((r) => r.type === 'WBR');
  const wbrDone = wbrRecords.filter((r) => r.status === 'COMPLETED').length;
  const wbrCompliance = wbrRecords.length > 0 ? Math.round((wbrDone / wbrRecords.length) * 100) : 100;

  const notesRecords = projectGovRecords.filter((r) => r.type === 'WEEKLY_NOTE');
  const notesDone = notesRecords.filter((r) => r.status === 'COMPLETED').length;
  const notesCompliance = notesRecords.length > 0 ? Math.round((notesDone / notesRecords.length) * 100) : 100;

  const openRisks = projectRisks.filter((r) => r.status === 'OPEN').length;
  const openActions = projectActions.filter((a) => a.status === 'PENDING').length;

  // ── Form states ────────────────────────────────────────────────────────────
  const [riskDesc, setRiskDesc] = useState('');
  const [riskSeverity, setRiskSeverity] = useState<Risk['severity']>('MEDIUM');
  const [riskMitigation, setRiskMitigation] = useState('');

  const [actDesc, setActDesc] = useState('');
  const [actAssignee, setActAssignee] = useState('');
  const [actDueDate, setActDueDate] = useState('');

  const [decDesc, setDecDesc] = useState('');
  const [decMadeBy, setDecMadeBy] = useState('');

  const [artName, setArtName] = useState('');
  const [artType, setArtType] = useState<'PDF' | 'PPT' | 'DOC'>('PDF');
  const [artCategory, setArtCategory] = useState<'WBR' | 'MOM' | 'ARCHITECTURE' | 'NOTE'>('WBR');
  const [artSize, setArtSize] = useState('1.5 MB');

  const [activeTab, setActiveTab] = useState<'governance' | 'risks' | 'actions' | 'decisions' | 'milestones' | 'artifacts'>('governance');

  if (!project) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Project Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a' }}>← Back to Portfolio</Link>
      </div>
    );
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskDesc || !riskMitigation) return;
    addRisk(project.id, { description: riskDesc, severity: riskSeverity, mitigationPlan: riskMitigation });
    setRiskDesc(''); setRiskMitigation('');
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actDesc || !actAssignee || !actDueDate) return;
    addAction(project.id, { description: actDesc, assignee: actAssignee, dueDate: actDueDate });
    setActDesc(''); setActAssignee(''); setActDueDate('');
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decDesc || !decMadeBy) return;
    addDecision(project.id, { description: decDesc, madeBy: decMadeBy, date: new Date().toISOString().substring(0, 10) });
    setDecDesc(''); setDecMadeBy('');
  };

  const handleAddArtifact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artName) return;
    uploadArtifact(project.id, {
      name: artName,
      type: artType,
      size: artSize,
      category: artCategory,
    });
    setArtName('');
    setArtSize('1.5 MB');
  };

  const handleCompleteGov = (recordId: string) => {
    completeGovernanceRecord(recordId, 'Completed during audit review.');
    recalculateGovernance(project.id);
  };

  const getGovStatusColor = (status: GovernanceRecord['status']) => {
    switch (status) {
      case 'COMPLETED': return '#10b981';
      case 'PENDING': return '#f59e0b';
      case 'OVERDUE': return '#ef4444';
    }
  };

  const ragColors = getRagColors(project.health);

  // ── Tab style helper ───────────────────────────────────────────────────────
  const tabStyle = (tab: typeof activeTab) => ({
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer' as const,
    fontSize: '13px',
    fontWeight: 600 as const,
    border: 'none',
    background: activeTab === tab ? '#1e3a8a' : 'transparent',
    color: activeTab === tab ? '#ffffff' : '#64748b',
    transition: 'all 0.2s',
  });

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.3); }
        }
      `}</style>

      <div
        style={{
          padding: '32px',
          maxWidth: '1300px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '24px', fontWeight: 700 }}>
              {project.name}
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                // ...getRagBadgeStyle(project.health),
              }}
            >
              {project.health} Health
            </span>
            {canEditProject && (
              <Link
                to={`/accounts/${account?.id}/projects/${project.id}/edit`}
                style={{
                  textDecoration: 'none',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  marginLeft: '8px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                ✏️ Edit Project
              </Link>
            )}
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Account Partner: {account?.name || 'Unknown'} • Status: {project.status}
          </p>
        </div>

        {/* ── Project Hero Header ──────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(30,58,138,0.28)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blob */}
          <div style={{ position: 'absolute', top: '-40px', right: '60px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', right: '180px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h1 style={{ color: '#ffffff', margin: 0, fontSize: '24px', fontWeight: 800, letterSpacing: '-0.4px' }}>
                {project.name}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: ragColors.bg,
                  color: ragColors.text,
                  border: `1px solid ${ragColors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ragColors.dot, display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
                {project.health} Health
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: project.status === 'ACTIVE' ? 'rgba(99,102,241,0.2)' : 'rgba(100,116,139,0.2)',
                  color: project.status === 'ACTIVE' ? '#a5b4fc' : '#94a3b8',
                  border: `1px solid ${project.status === 'ACTIVE' ? '#6366f133' : '#64748b33'}`,
                }}
              >
                {project.status}
              </span>
            </div>
            <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
              {account ? `${account.name} · ` : ''}Project Delivery Dashboard{project.lead ? ` · Lead: ${project.lead}` : ''}
            </p>
            {project.details && (
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.85)', fontSize: '13px', maxWidth: '600px', lineHeight: '1.4' }}>
                {project.details}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '28px', alignItems: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Compliance Rate</div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: project.complianceRate >= 80 ? '#4ade80' : project.complianceRate >= 60 ? '#fbbf24' : '#f87171', marginTop: '2px' }}>
                {project.complianceRate}%
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Stakeholders</div>
              <div style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{totalStk}</div>
            </div>
            <Link
              to="/ai-workspace"
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg,#8a3d78,#6d28d9)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                transition: 'opacity 0.2s',
              }}
            >
              ⚡ AI Assistant
            </Link>
          </div>
        </div>

        {/* ── Quick Metrics Strip ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <MiniMetric
            icon="📊"
            label="WBR Compliance"
            value={`${wbrCompliance}%`}
            color={wbrCompliance >= 90 ? '#10b981' : wbrCompliance >= 70 ? '#f59e0b' : '#ef4444'}
            bg={wbrCompliance >= 90 ? 'rgba(16,185,129,0.1)' : wbrCompliance >= 70 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
          />
          <MiniMetric
            icon="📝"
            label="Weekly Notes"
            value={`${notesCompliance}%`}
            color={notesCompliance >= 90 ? '#10b981' : notesCompliance >= 70 ? '#f59e0b' : '#ef4444'}
            bg={notesCompliance >= 90 ? 'rgba(16,185,129,0.1)' : notesCompliance >= 70 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
          />
          <MiniMetric
            icon="⚠️"
            label="Open Risks"
            value={openRisks}
            color={openRisks === 0 ? '#10b981' : openRisks <= 1 ? '#f59e0b' : '#ef4444'}
            bg={openRisks === 0 ? 'rgba(16,185,129,0.1)' : openRisks <= 1 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
          />
          <MiniMetric
            icon="✅"
            label="Open Actions"
            value={openActions}
            color={openActions === 0 ? '#10b981' : openActions <= 2 ? '#f59e0b' : '#ef4444'}
            bg={openActions === 0 ? 'rgba(16,185,129,0.1)' : openActions <= 2 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)'}
          />
          <MiniMetric
            icon="🏁"
            label="Milestones"
            value={`${projectMilestones.filter((m) => m.status === 'COMPLETED').length}/${projectMilestones.length}`}
            color="#1e3a8a"
            bg="rgba(30,58,138,0.08)"
          />
        </div>

        {/* ── Two-column layout: Left tabs  |  Right stakeholder panel ──── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>

          {/* LEFT: Tab-based main content */}
          <div>
            {/* Tab bar */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '6px',
                display: 'flex',
                gap: '4px',
                marginBottom: '16px',
                flexWrap: 'wrap',
              }}
            >
              {(
                [
                  { key: 'governance', label: '📋 Governance' },
                  { key: 'risks', label: '⚠️ Risks' },
                  { key: 'actions', label: '✅ Actions' },
                  { key: 'decisions', label: '🔖 Decisions' },
                  { key: 'milestones', label: '🏁 Timeline' },
                  { key: 'artifacts', label: '📁 Artifacts' },
                ] as const
              ).map((t) => (
                <button key={t.key} style={tabStyle(t.key)} onClick={() => setActiveTab(t.key)}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              {/* ── GOVERNANCE TAB ── */}
              {activeTab === 'governance' && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>
                      Activity Compliance Matrix
                    </h3>
                    <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                      Track all 10 required delivery governance check-gates
                    </p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <ComplianceBar label="WBR Compliance" value={wbrCompliance} color={wbrCompliance >= 90 ? '#10b981' : wbrCompliance >= 70 ? '#f59e0b' : '#ef4444'} />
                    <ComplianceBar label="Weekly Notes Compliance" value={notesCompliance} color={notesCompliance >= 90 ? '#10b981' : notesCompliance >= 70 ? '#f59e0b' : '#ef4444'} />
                    <ComplianceBar label="Overall Project Compliance" value={project.complianceRate} color={project.complianceRate >= 80 ? '#1e3a8a' : project.complianceRate >= 60 ? '#f59e0b' : '#ef4444'} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
                    {projectGovRecords.map((r) => {
                      const statusColor = getGovStatusColor(r.status);
                      return (
                        <div
                          key={r.id}
                          style={{
                            border: `1.5px solid ${r.status === 'COMPLETED' ? '#d1fae5' : r.status === 'OVERDUE' ? '#fee2e2' : '#e2e8f0'}`,
                            borderRadius: '12px',
                            padding: '16px',
                            background: r.status === 'COMPLETED' ? 'rgba(16,185,129,0.03)' : r.status === 'OVERDUE' ? 'rgba(239,68,68,0.03)' : 'transparent',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '10px', background: '#f1f5f9', color: '#475569', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                                {r.type.replace(/_/g, ' ')}
                              </span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: statusColor }}>● {r.status}</span>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e3a8a', marginBottom: '3px' }}>{r.title}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Due: {r.dueDate}</div>
                            {r.completedAt && <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>✓ Completed: {r.completedAt}</div>}
                          </div>
                          <div>
                            {r.status !== 'COMPLETED' ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => handleCompleteGov(r.id)}
                                  style={{ flex: 1, background: '#1e3a8a', color: '#fff', border: 'none', padding: '7px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                                >
                                  ✓ Mark Complete
                                </button>
                                <Link
                                  to="/ai-workspace/upload"
                                  style={{ textDecoration: 'none', border: '1px solid #cbd5e1', color: '#475569', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}
                                >
                                  ↑ Upload
                                </Link>
                              </div>
                            ) : (
                              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>✓ Verified</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {projectGovRecords.length === 0 && (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                        No governance records for this project yet.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── RISKS TAB ── */}
              {activeTab === 'risks' && (
                <>
                  <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>Risks & Mitigations</h3>
                  <form
                    onSubmit={handleAddRisk}
                    style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1.5px solid #f1f5f9' }}
                  >
                    <input type="text" required placeholder="Describe the risk…" style={{ flex: 2, minWidth: '160px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={riskDesc} onChange={(e) => setRiskDesc(e.target.value)} />
                    <input type="text" required placeholder="Mitigation plan…" style={{ flex: 2, minWidth: '140px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={riskMitigation} onChange={(e) => setRiskMitigation(e.target.value)} />
                    <select style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={riskSeverity} onChange={(e) => setRiskSeverity(e.target.value as Risk['severity'])}>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                    <button type="submit" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>+ Log Risk</button>
                  </form>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {projectRisks.map((r) => (
                      <div key={r.id} style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, background: r.severity === 'HIGH' ? '#fde8e8' : r.severity === 'MEDIUM' ? '#fffbeb' : '#f0fdf4', color: r.severity === 'HIGH' ? '#e11d48' : r.severity === 'MEDIUM' ? '#d97706' : '#16a34a', padding: '2px 8px', borderRadius: '6px' }}>
                              {r.severity}
                            </span>
                            <span style={{ fontSize: '10px', fontWeight: 700, background: r.status === 'OPEN' ? '#fde8e8' : '#d1fae5', color: r.status === 'OPEN' ? '#ef4444' : '#10b981', padding: '2px 8px', borderRadius: '6px' }}>
                              {r.status}
                            </span>
                            <strong style={{ color: '#1e3a8a', fontSize: '13px' }}>{r.description}</strong>
                          </div>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}><strong>Mitigation:</strong> {r.mitigationPlan}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          {r.status === 'OPEN' && (
                            <button onClick={() => updateRisk(r.id, { status: 'RESOLVED' })} style={{ background: '#d1fae5', color: '#059669', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                              Resolve
                            </button>
                          )}
                          <button onClick={() => deleteRisk(r.id)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
                        </div>
                      </div>
                    ))}
                    {projectRisks.length === 0 && <div style={{ textAlign: 'center', padding: '28px', color: '#94a3b8', fontSize: '13px' }}>✅ No risks logged for this project.</div>}
                  </div>
                </>
              )}

              {/* ── ACTIONS TAB ── */}
              {activeTab === 'actions' && (
                <>
                  <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>Action Items</h3>
                  <form onSubmit={handleAddAction} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1.5px solid #f1f5f9' }}>
                    <input type="text" required placeholder="Describe the action…" style={{ flex: 2, minWidth: '160px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={actDesc} onChange={(e) => setActDesc(e.target.value)} />
                    <input type="text" required placeholder="Assignee…" style={{ width: '110px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={actAssignee} onChange={(e) => setActAssignee(e.target.value)} />
                    <input type="date" required style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={actDueDate} onChange={(e) => setActDueDate(e.target.value)} />
                    <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>+ Add</button>
                  </form>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {projectActions.map((a: Action) => (
                      <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1 }}>
                          <input
                            type="checkbox"
                            checked={a.status === 'COMPLETED'}
                            onChange={(e) => updateAction(a.id, { status: e.target.checked ? 'COMPLETED' : 'PENDING' })}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#1e3a8a' }}
                          />
                          <span style={{ textDecoration: a.status === 'COMPLETED' ? 'line-through' : 'none', color: a.status === 'COMPLETED' ? '#94a3b8' : '#1e293b', fontSize: '13px', fontWeight: 500 }}>
                            {a.description}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexShrink: 0 }}>
                          <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                            <div style={{ fontWeight: 600 }}>{a.assignee}</div>
                            <div>Due: {a.dueDate}</div>
                          </div>
                          <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '6px', fontWeight: 700, background: a.status === 'COMPLETED' ? '#d1fae5' : '#fef3c7', color: a.status === 'COMPLETED' ? '#059669' : '#d97706' }}>
                            {a.status}
                          </span>
                          <button onClick={() => deleteAction(a.id)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '15px' }}>✕</button>
                        </div>
                      </div>
                    ))}
                    {projectActions.length === 0 && <div style={{ textAlign: 'center', padding: '28px', color: '#94a3b8', fontSize: '13px' }}>No action items logged yet.</div>}
                  </div>
                </>
              )}

              {/* ── DECISIONS TAB ── */}
              {activeTab === 'decisions' && (
                <>
                  <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>Decision Log</h3>
                  <form onSubmit={handleAddDecision} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1.5px solid #f1f5f9' }}>
                    <input type="text" required placeholder="Decision made…" style={{ flex: 2, minWidth: '180px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={decDesc} onChange={(e) => setDecDesc(e.target.value)} />
                    <input type="text" required placeholder="Approved by…" style={{ width: '130px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} value={decMadeBy} onChange={(e) => setDecMadeBy(e.target.value)} />
                    <button type="submit" style={{ background: '#8a3d78', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>+ Log</button>
                  </form>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {projectDecisions.map((d) => (
                      <div key={d.id} style={{ borderLeft: '4px solid #8a3d78', paddingLeft: '16px', paddingBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{d.description}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>Authorized by <strong style={{ color: '#64748b' }}>{d.madeBy}</strong> · {d.date}</div>
                        </div>
                        <button onClick={() => deleteDecision(d.id)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontSize: '15px', flexShrink: 0 }}>✕</button>
                      </div>
                    ))}
                    {projectDecisions.length === 0 && <div style={{ textAlign: 'center', padding: '28px', color: '#94a3b8', fontSize: '13px' }}>No decisions recorded yet.</div>}
                  </div>
                </>
              )}

              {/* ── TIMELINE TAB ── */}
              {activeTab === 'milestones' && (
                <>
                  <h3 style={{ margin: '0 0 8px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>Project Timeline</h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '12px', color: '#94a3b8' }}>
                    Visual project roadmap checkpoints and key release target dates
                  </p>
                  
                  <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid #e2e8f0', margin: '10px 0 10px 10px' }}>
                    {projectMilestones.map((m) => {
                      const isCompleted = m.status === 'COMPLETED';
                      const isDelayed = m.status === 'DELAYED';
                      const color = isCompleted ? '#10b981' : isDelayed ? '#ef4444' : '#f59e0b';
                      const bg = isCompleted ? '#d1fae5' : isDelayed ? '#fee2e2' : '#fef3c7';
                      
                      return (
                        <div key={m.id} style={{ position: 'relative', marginBottom: '24px' }}>
                          {/* Timeline dot */}
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: '-35px', 
                              top: '2px', 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              background: '#ffffff',
                              border: `3px solid ${color}`,
                              boxShadow: '0 0 0 4px #ffffff',
                              zIndex: 2 
                            }} 
                          />
                          
                          <div 
                            style={{ 
                              background: '#ffffff',
                              border: '1.5px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '16px 20px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                              transition: 'border-color 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = color}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                          >
                            <div>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '14px' }}>{m.name}</div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📅 Target Date: <strong style={{ color: '#475569' }}>{m.dueDate}</strong>
                              </div>
                            </div>
                            <span 
                              style={{ 
                                fontSize: '10px', 
                                fontWeight: 800, 
                                padding: '4px 10px', 
                                borderRadius: '12px', 
                                background: bg, 
                                color: color,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            >
                              {m.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {projectMilestones.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '28px', color: '#94a3b8', fontSize: '13px' }}>
                        No milestones or timeline checkpoints defined for this project.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── ARTIFACTS TAB ── */}
              {activeTab === 'artifacts' && (
                <>
                  <h3 style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>Project Artifacts</h3>
                  <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#94a3b8' }}>
                    Governance documents: WBRs, MOMs, Architecture plans, and sync Notes
                  </p>
                  
                  {/* Log new artifact form */}
                  <form 
                    onSubmit={handleAddArtifact} 
                    style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      flexWrap: 'wrap', 
                      marginBottom: '24px', 
                      paddingBottom: '20px', 
                      borderBottom: '1.5px solid #f1f5f9' 
                    }}
                  >
                    <input 
                      type="text" 
                      required 
                      placeholder="Artifact file name (e.g. MOM_Week25.docx)…" 
                      style={{ flex: 3, minWidth: '220px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
                      value={artName} 
                      onChange={(e) => setArtName(e.target.value)} 
                    />
                    
                    <select 
                      style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }} 
                      value={artCategory} 
                      onChange={(e) => setArtCategory(e.target.value as any)}
                    >
                      <option value="WBR">WBR (Weekly Business Review)</option>
                      <option value="MOM">MOM (Minutes of Meeting)</option>
                      <option value="ARCHITECTURE">Architecture Diagram/Doc</option>
                      <option value="NOTE">Developer/Sync Notes</option>
                    </select>

                    <select 
                      style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }} 
                      value={artType} 
                      onChange={(e) => setArtType(e.target.value as any)}
                    >
                      <option value="PDF">PDF</option>
                      <option value="PPT">PPT/PPTX</option>
                      <option value="DOC">DOC/DOCX</option>
                    </select>

                    <input 
                      type="text" 
                      required 
                      placeholder="Size (e.g. 2.1 MB)" 
                      style={{ width: '90px', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none' }} 
                      value={artSize} 
                      onChange={(e) => setArtSize(e.target.value)} 
                    />

                    <button 
                      type="submit" 
                      style={{ 
                        background: '#1e3a8a', 
                        color: '#fff', 
                        border: 'none', 
                        padding: '9px 18px', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '13px', 
                        fontWeight: 700,
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0b204e'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
                    >
                      + Add Artifact
                    </button>
                  </form>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                    {artifacts.filter((art) => art.projectId === project.id).map((art) => {
                      const icon = art.type === 'PDF' ? '📕' : art.type === 'PPT' ? '📙' : '📘';
                      const badgeBg = 
                        art.category === 'WBR' ? 'rgba(30,58,138,0.08)' :
                        art.category === 'MOM' ? 'rgba(16,185,129,0.08)' :
                        art.category === 'ARCHITECTURE' ? 'rgba(138,61,120,0.08)' : 'rgba(245,158,11,0.08)';
                      
                      const badgeColor = 
                        art.category === 'WBR' ? '#1e3a8a' :
                        art.category === 'MOM' ? '#10b981' :
                        art.category === 'ARCHITECTURE' ? '#8a3d78' : '#f59e0b';
                      
                      return (
                        <div 
                          key={art.id} 
                          style={{ 
                            border: '1.5px solid #e2e8f0', 
                            borderRadius: '12px', 
                            padding: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            background: '#ffffff',
                            transition: 'border-color 0.2s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                          onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '24px' }}>{icon}</span>
                            <div>
                              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px', wordBreak: 'break-all' }}>{art.name}</div>
                              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span 
                                  style={{ 
                                    fontSize: '9px', 
                                    fontWeight: 800, 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    background: badgeBg, 
                                    color: badgeColor 
                                  }}
                                >
                                  {art.category || 'OTHER'}
                                </span>
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{art.size} · {art.uploadedAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <button 
                            onClick={() => deleteArtifact(art.id)} 
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: '#cbd5e1', 
                              cursor: 'pointer', 
                              fontSize: '16px', 
                              padding: '4px',
                              transition: 'color 0.2s' 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#cbd5e1'}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                    {artifacts.filter((art) => art.projectId === project.id).length === 0 && (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '13px' }}>
                        📁 No artifacts uploaded for this project yet.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Stakeholder Sentiment Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Defined Project Stakeholders Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: 800 }}>
                📋 Project Governance Setup
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Project Type</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {project.projectType === 'INTERNAL_TEAM_MANAGED' ? 'Internal Team Managed' : 'Customer Managed'}
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Project Lead</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {project.lead || 'Not Assigned'}
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Senior Director</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {project.seniorDirector || 'Not Assigned'}
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Vice President</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {project.vicePresident || 'Not Assigned'}
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1.5px solid #e2e8f0' }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Supervisor</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {project.supervisor || 'Not Assigned'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sprint Metrics Card (Only if Internal Team Managed) */}
            {project.projectType === 'INTERNAL_TEAM_MANAGED' ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  borderRadius: '16px',
                  border: '1.5px solid #bfdbfe',
                  padding: '24px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                <h3 style={{ margin: '0 0 16px 0', color: '#1e40af', fontSize: '16px', fontWeight: 800 }}>
                  🏃‍♂️ Internal Sprint Metrics
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, padding: '8px 10px', background: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Start Date</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                        {project.sprintStartDate ? project.sprintStartDate.substring(0, 10) : '—'}
                      </div>
                    </div>
                    <div style={{ flex: 1, padding: '8px 10px', background: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>End Date</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                        {project.sprintEndDate ? project.sprintEndDate.substring(0, 10) : '—'}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
                      <span>Delivery Performance</span>
                      <span style={{ color: '#1e40af', fontWeight: 800 }}>{project.deliveryPerformance !== undefined && project.deliveryPerformance !== null ? `${project.deliveryPerformance}%` : '—'}</span>
                    </div>
                    {project.deliveryPerformance !== undefined && project.deliveryPerformance !== null ? (
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${project.deliveryPerformance}%`, height: '100%', background: '#2563eb', borderRadius: '3px' }} />
                      </div>
                    ) : null}
                  </div>

                  <div style={{ padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Sprint Overflow</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                        {project.overflow !== undefined && project.overflow !== null ? `${project.overflow} tasks` : '—'}
                      </div>
                    </div>
                    {project.overflow !== undefined && project.overflow !== null && project.overflow > 0 ? (
                      <span style={{ background: '#fee2e2', color: '#ef4444', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                        Carry-over
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  border: '1.5px solid #e2e8f0',
                  padding: '16px 24px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#64748b',
                }}
              >
                ℹ️ Customer managed project. Internal sprint metrics tracking not required.
              </div>
            )}

            {/* Sentiment Overview Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: 800 }}>
                🤝 Stakeholder Sentiment
              </h3>

              {totalStk > 0 ? (
                <>
                  <SentimentDonut
                    positive={posCount}
                    neutral={neutCount}
                    negative={negCount}
                    total={totalStk}
                  />
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px solid #f1f5f9' }}>
                    <ComplianceBar
                      label="Positive Sentiment Rate"
                      value={Math.round((posCount / totalStk) * 100)}
                      color="#10b981"
                    />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
                  No stakeholders found for this account.
                </div>
              )}
            </div>

            {/* Stakeholder Cards */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '16px', fontWeight: 800 }}>
                  Key Stakeholders
                </h3>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{totalStk} contacts</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projectStakeholders.map((s) => {
                  const snt = getSentimentMeta(s.sentiment);
                  const initials = s.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
                  return (
                    <div
                      key={s.id}
                      style={{
                        border: `1.5px solid ${s.sentiment === 'NEGATIVE' ? '#fee2e2' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '14px',
                        background: s.sentiment === 'NEGATIVE' ? 'rgba(239,68,68,0.02)' : '#fafafa',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.borderColor = '#1e3a8a')}
                      onMouseOut={(e) => (e.currentTarget.style.borderColor = s.sentiment === 'NEGATIVE' ? '#fee2e2' : '#e2e8f0')}
                    >
                      {/* Top row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.role}
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '20px',
                            background: snt.bg,
                            color: snt.color,
                            border: `1px solid ${snt.color}33`,
                            flexShrink: 0,
                          }}
                        >
                          {snt.icon} {snt.label}
                        </span>
                      </div>

                      {/* Details row */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div
                          style={{
                            flex: 1,
                            background: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            fontSize: '11px',
                            color: '#64748b',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>Last Connect</div>
                          <div>{s.lastConnectDate || '—'}</div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            background: '#f8fafc',
                            borderRadius: '8px',
                            padding: '8px 10px',
                            fontSize: '11px',
                            color: '#64748b',
                          }}
                        >
                          <div style={{ fontWeight: 700, color: '#475569', marginBottom: '2px' }}>Next Scheduled</div>
                          <div>{s.nextScheduledConnect || '—'}</div>
                        </div>
                      </div>

                      {/* Email */}
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✉️ {s.email}
                      </div>

                      {/* Alert for negative sentiment */}
                      {s.sentiment === 'NEGATIVE' && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '8px 10px',
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            borderRadius: '8px',
                            fontSize: '11px',
                            color: '#e11d48',
                            fontWeight: 600,
                          }}
                        >
                          ⚠️ Negative sentiment detected — schedule an immediate touchpoint.
                        </div>
                      )}
                    </div>
                  );
                })}

                {projectStakeholders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
                    No stakeholders configured for this account's buying centers.
                  </div>
                )}
              </div>

              {/* Link to manage */}
              {accountBuyingCenters.length > 0 && (
                <Link
                  to={`/buying-centers/${accountBuyingCenters[0].id}/stakeholders`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: '16px',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#1e3a8a',
                    padding: '9px',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#1e3a8a';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#1e3a8a';
                  }}
                >
                  Manage All Stakeholders →
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
