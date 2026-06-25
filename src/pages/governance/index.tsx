import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import GovernanceKPICard from './components/GovernanceKPICard';
import ComplianceAlerts from './components/ComplianceAlerts';
import GovernanceActivityTracker, {
  type ActivityRow,
} from './components/GovernanceActivityTracker';
import GovernanceTrends from './components/GovernanceTrends';
import RisksActions, { type RiskItem, type ActionItem } from './components/RisksActions';
import GovernanceSummary from './components/GovernanceSummary';

/* ─── Static governance checkpoint definitions (all 10 types) ─────────────── */
const CHECKPOINT_META: Record<
  string,
  { label: string; frequency: string; owner: string; icon: string }
> = {
  STANDUP: { label: 'Daily Stand-Up', frequency: 'Daily', owner: 'Delivery Lead', icon: '☀️' },
  WEEKLY_NOTE: { label: 'Weekly Notes', frequency: 'Weekly', owner: 'Account Lead', icon: '📝' },
  WBR: { label: 'Weekly Business Review', frequency: 'Weekly', owner: 'Account Lead', icon: '📊' },
  FBR: {
    label: 'Fortnightly Business Review',
    frequency: 'Bi-Weekly',
    owner: 'Delivery Lead',
    icon: '📅',
  },
  MBR: {
    label: 'Monthly Business Review',
    frequency: 'Monthly',
    owner: 'Account Lead',
    icon: '📋',
  },
  QBR: {
    label: 'Quarterly Business Review',
    frequency: 'Quarterly',
    owner: 'Executive',
    icon: '🏆',
  },
  STAKEHOLDER_1X1: {
    label: 'Stakeholder 1:1',
    frequency: 'Monthly',
    owner: 'Account Lead',
    icon: '🤝',
  },
  SECURITY_REVIEW: {
    label: 'Security Review',
    frequency: 'Quarterly',
    owner: 'Delivery Lead',
    icon: '🔒',
  },
  NPS_FEEDBACK: {
    label: 'NPS Feedback Survey',
    frequency: 'Quarterly',
    owner: 'Account Lead',
    icon: '⭐',
  },
  EMPLOYEE_1X1: { label: 'Employee 1:1', frequency: 'Monthly', owner: 'Delivery Lead', icon: '👥' },
};

/* ─── Static trend data (6-month mock) ────────────────────────────────────── */
const TREND_DATA = [
  { label: 'Jan', compliance: 62, score: 58, risks: 8, closedActions: 4 },
  { label: 'Feb', compliance: 68, score: 65, risks: 7, closedActions: 6 },
  { label: 'Mar', compliance: 74, score: 71, risks: 6, closedActions: 8 },
  { label: 'Apr', compliance: 70, score: 68, risks: 9, closedActions: 5 },
  { label: 'May', compliance: 76, score: 74, risks: 5, closedActions: 11 },
  { label: 'Jun', compliance: 80, score: 79, risks: 4, closedActions: 13 },
];

export default function GovernanceCenterPage() {
  const {
    governanceRecords,
    projects,
    accounts,
    risks,
    actions,
    completeGovernanceRecord,
    recalculateGovernance,
    fetchGovernanceActivities,
    isGovernanceLoading,
    updateRisk,
    updateAction,
  } = useDataStore();

  useEffect(() => {
    fetchGovernanceActivities().catch(() => {
      // Keep using mock state if backend fetch is unavailable.
    });
  }, [fetchGovernanceActivities]);

  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'risks' | 'trends'>(
    'overview'
  );

  /* ─── KPI Calculations ──────────────────────────────────────────────────── */
  const totalRecords = governanceRecords.length;
  const completedCount = governanceRecords.filter((r) => r.status === 'COMPLETED').length;
  const overdueCount = governanceRecords.filter((r) => r.status === 'OVERDUE').length;
  const complianceRate = totalRecords > 0 ? Math.round((completedCount / totalRecords) * 100) : 0;

  const avgGovernanceScore =
    accounts.length > 0
      ? Math.round(accounts.reduce((s, a) => s + a.governanceScore, 0) / accounts.length)
      : 0;
  const avgComplianceScore =
    accounts.length > 0
      ? Math.round(accounts.reduce((s, a) => s + a.complianceScore, 0) / accounts.length)
      : 0;

  const openRisksCount = risks.filter((r) => r.status === 'OPEN').length;
  const pendingActionsCount = actions.filter((a) => a.status === 'PENDING').length;

  /* ─── Overall RAG ───────────────────────────────────────────────────────── */
  const overallRAG: 'GREEN' | 'AMBER' | 'RED' =
    avgGovernanceScore >= 80 ? 'GREEN' : avgGovernanceScore >= 60 ? 'AMBER' : 'RED';

  /* ─── Activity Tracker rows from governance records ─────────────────────── */
  const activityRows: ActivityRow[] = governanceRecords.map((rec) => {
    const meta = CHECKPOINT_META[rec.type] ?? {
      label: rec.title,
      frequency: 'N/A',
      owner: 'Team',
      icon: '📌',
    };
    return {
      id: rec.id,
      type: rec.type,
      typeLabel: meta.label,
      owner: meta.owner,
      frequency: meta.frequency,
      lastCompleted: rec.completedAt ?? '',
      nextDue: rec.dueDate,
      status: rec.status,
      icon: meta.icon,
    };
  });

  /* ─── Compliance Alerts derived from overdue + low-scoring accounts ──────── */
  const complianceAlerts = [
    ...governanceRecords
      .filter((r) => r.status === 'OVERDUE')
      .map((r) => {
        const proj = projects.find((p) => p.id === r.projectId);
        const acc = accounts.find((a) => a.id === proj?.accountId);
        return {
          id: r.id,
          severity: 'CRITICAL' as const,
          title: `Overdue: ${r.title}`,
          description: `${CHECKPOINT_META[r.type]?.label ?? r.type} checkpoint missed. Immediate attention required.`,
          account: acc?.name ?? 'Unknown',
          project: proj?.name ?? 'Unknown',
          date: r.dueDate,
          icon: '🚨',
        };
      }),
    ...accounts
      .filter(
        (a) =>
          a.ragStatus === 'AMBER' &&
          !governanceRecords.some(
            (r) =>
              r.status === 'OVERDUE' &&
              projects.find((p) => p.accountId === a.id && p.id === r.projectId)
          )
      )
      .map((a) => ({
        id: `alert-amber-${a.id}`,
        severity: 'WARNING' as const,
        title: `${a.name} — Governance Score Declining`,
        description: `Current governance score is ${a.governanceScore}%, below the 80% threshold. Review cadence and compliance actions.`,
        account: a.name,
        project: 'All Projects',
        date: 'Ongoing',
        icon: '⚠️',
      })),
    ...accounts
      .filter((a) => a.governanceScore >= 80)
      .slice(0, 1)
      .map((a) => ({
        id: `alert-info-${a.id}`,
        severity: 'INFO' as const,
        title: `${a.name} — Leading Compliance`,
        description: `Governance score at ${a.governanceScore}% with ${a.complianceScore}% review compliance. Highlight as best-in-class.`,
        account: a.name,
        project: 'All Projects',
        date: 'This Month',
        icon: '✅',
      })),
  ];

  /* ─── Risk & Action adapters ─────────────────────────────────────────────── */
  const riskItems: RiskItem[] = risks.map((r) => {
    const proj = projects.find((p) => p.id === r.projectId);
    const acc = accounts.find((a) => a.id === proj?.accountId);
    return {
      id: r.id,
      title: r.description,
      severity: r.severity === 'HIGH' ? 'HIGH' : r.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
      owner: proj?.name ?? 'Unknown Project',
      dueDate: 'ASAP',
      account: acc?.name ?? 'Unknown',
      status: r.status,
    };
  });

  const actionItems: ActionItem[] = actions.map((a) => {
    const proj = projects.find((p) => p.id === a.projectId);
    const acc = accounts.find((ac) => ac.id === proj?.accountId);
    return {
      id: a.id,
      title: a.description,
      owner: a.assignee,
      dueDate: a.dueDate,
      status: a.status,
      account: acc?.name ?? 'Unknown',
    };
  });

  /* ─── Handlers ───────────────────────────────────────────────────────────── */
  const handleMarkComplete = async (id: string) => {
    const rec = governanceRecords.find((r) => r.id === id);
    if (!rec) return;

    await completeGovernanceRecord(id, 'Marked done via Governance Command Center.');
    recalculateGovernance(rec.projectId);
  };

  const handleResolveRisk = (id: string) => updateRisk(id, { status: 'RESOLVED' });
  const handleCompleteAction = (id: string) => updateAction(id, { status: 'COMPLETED' });

  /* ─── Tab styles ─────────────────────────────────────────────────────────── */
  const tabStyle = (active: boolean) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    border: `1px solid ${active ? '#0D2A66' : '#E4E7EC'}`,
    background: active ? '#0D2A66' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#64748b',
    transition: 'all 0.2s',
  });

  return (
    <div
      style={{
        padding: '28px 32px',
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        background: '#F5F6F8',
        minHeight: '100vh',
      }}
    >
      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0D2A66 0%, #1a3d8f 60%, #8A3D78 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          marginBottom: '28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(246,139,31,0.12)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '120px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            position: 'relative',
          }}
        >
          <div>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: 'rgba(246,139,31,0.25)',
                  color: '#F68B1F',
                  letterSpacing: '0.6px',
                  border: '1px solid rgba(246,139,31,0.4)',
                }}
              >
                EXECUTIVE COMMAND CENTER
              </span>
              <span
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                }}
              >
                Live · Updated just now
              </span>
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: '26px',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.2,
              }}
            >
              Delivery Governance Command Center
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
              {accounts.length} accounts · {projects.length} active projects · {totalRecords}{' '}
              governance checkpoints tracked
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* RAG Pill */}
            <div
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '10px 18px',
                border: '1px solid rgba(255,255,255,0.2)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.6)',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                Portfolio Health
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color:
                    overallRAG === 'GREEN'
                      ? '#4ade80'
                      : overallRAG === 'AMBER'
                        ? '#fbbf24'
                        : '#f87171',
                }}
              >
                {overallRAG === 'GREEN' ? '🟢' : overallRAG === 'AMBER' ? '🟡' : '🔴'} {overallRAG}
              </div>
            </div>

            <Link
              to="/governance/exceptions"
              style={{
                textDecoration: 'none',
                background: overdueCount > 0 ? '#dc2626' : 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                padding: '11px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#b91c1c')}
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  overdueCount > 0 ? '#dc2626' : 'rgba(255,255,255,0.15)')
              }
            >
              ⚠️ Exceptions Board
              {overdueCount > 0 && (
                <span
                  style={{
                    background: '#FFFFFF',
                    color: '#dc2626',
                    borderRadius: '20px',
                    padding: '1px 7px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {overdueCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── KPI Cards Row ──────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '28px',
        }}
      >
        <GovernanceKPICard
          label="Governance Score"
          icon="🏛️"
          value={avgGovernanceScore}
          trend={+4}
          target={85}
        />
        <GovernanceKPICard
          label="Compliance Rate"
          icon="✅"
          value={complianceRate}
          trend={+6}
          target={90}
        />
        <GovernanceKPICard
          label="Review Completion"
          icon="📊"
          value={totalRecords > 0 ? Math.round((completedCount / totalRecords) * 100) : 0}
          trend={+3}
          target={80}
        />
        <GovernanceKPICard
          label="Delivery Compliance"
          icon="🚀"
          value={avgComplianceScore}
          trend={+5}
          target={85}
        />
      </div>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          background: '#FFFFFF',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid #E4E7EC',
          boxShadow: '0 1px 4px rgba(13,42,102,0.04)',
        }}
      >
        <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>
          🏠 Overview
        </button>
        <button onClick={() => setActiveTab('activity')} style={tabStyle(activeTab === 'activity')}>
          📋 Activity Tracker
        </button>
        <button onClick={() => setActiveTab('risks')} style={tabStyle(activeTab === 'risks')}>
          🚨 Risks & Actions
          {openRisksCount + pendingActionsCount > 0 && (
            <span
              style={{
                marginLeft: '6px',
                background: '#dc2626',
                color: '#FFFFFF',
                borderRadius: '20px',
                padding: '1px 7px',
                fontSize: '10px',
                fontWeight: 800,
              }}
            >
              {openRisksCount + pendingActionsCount}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab('trends')} style={tabStyle(activeTab === 'trends')}>
          📈 Trends
        </button>
      </div>

      {/* ── TAB: Overview ────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Compliance Alerts */}
            <ComplianceAlerts alerts={complianceAlerts} />

            {/* Account Health Grid */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E4E7EC',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid #E4E7EC',
                  background:
                    'linear-gradient(135deg, rgba(13,42,102,0.02) 0%, rgba(246,139,31,0.02) 100%)',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D2A66' }}>
                  🏢 Account Governance Health
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                  Real-time compliance posture across all managed accounts
                </p>
              </div>
              <div
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {accounts.map((acc) => {
                  const accProjects = projects.filter((p) => p.accountId === acc.id);
                  const ragConfig = {
                    GREEN: { dot: '#22c55e', text: '#166534', bg: '#f0fdf4', border: '#86efac' },
                    AMBER: { dot: '#f59e0b', text: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
                    RED: { dot: '#ef4444', text: '#991b1b', bg: '#fef2f2', border: '#fca5a5' },
                  };
                  const rc = ragConfig[acc.ragStatus];
                  return (
                    <div
                      key={acc.id}
                      style={{
                        background: '#F5F6F8',
                        borderRadius: '12px',
                        border: '1px solid #E4E7EC',
                        padding: '16px 20px',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#eef2ff';
                        e.currentTarget.style.borderColor = '#c7d2fe';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#F5F6F8';
                        e.currentTarget.style.borderColor = '#E4E7EC';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {acc.logoUrl ? (
                            <img
                              src={acc.logoUrl}
                              alt={acc.name}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                border: '1px solid #E4E7EC',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: '#0D2A66',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '13px',
                              }}
                            >
                              {acc.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: '#0D2A66', fontSize: '14px' }}>
                              {acc.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {accProjects.length} project{accProjects.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            background: rc.bg,
                            color: rc.text,
                            border: `1px solid ${rc.border}`,
                          }}
                        >
                          {acc.ragStatus === 'GREEN'
                            ? '🟢'
                            : acc.ragStatus === 'AMBER'
                              ? '🟡'
                              : '🔴'}{' '}
                          {acc.ragStatus}
                        </span>
                      </div>

                      {/* Progress bars */}
                      {[
                        { label: 'Governance Score', value: acc.governanceScore, color: '#0D2A66' },
                        { label: 'Compliance Score', value: acc.complianceScore, color: '#F68B1F' },
                      ].map((bar) => (
                        <div key={bar.label} style={{ marginBottom: '8px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '11px',
                              color: '#64748b',
                              marginBottom: '3px',
                            }}
                          >
                            <span>{bar.label}</span>
                            <span style={{ fontWeight: 700, color: '#334155' }}>{bar.value}%</span>
                          </div>
                          <div
                            style={{
                              height: '5px',
                              background: '#e2e8f0',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${bar.value}%`,
                                background: bar.color,
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <Link
                        to={`/accounts/${acc.id}`}
                        style={{
                          display: 'inline-block',
                          marginTop: '8px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#0D2A66',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          background: 'rgba(13,42,102,0.06)',
                          border: '1px solid rgba(13,42,102,0.12)',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#0D2A66';
                          e.currentTarget.style.color = '#FFFFFF';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(13,42,102,0.06)';
                          e.currentTarget.style.color = '#0D2A66';
                        }}
                      >
                        View Account →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column — Summary Panel */}
          <GovernanceSummary
            governanceScore={avgGovernanceScore}
            complianceScore={avgComplianceScore}
            ragStatus={overallRAG}
            highlights={[
              `${completedCount} of ${totalRecords} governance checkpoints completed`,
              `Macy's maintains ${accounts.find((a) => a.id === 'acc-1')?.complianceScore ?? 0}% compliance — best in portfolio`,
              `${projects.filter((p) => p.health === 'GREEN').length} of ${projects.length} projects on GREEN health`,
            ]}
            keyRisks={[
              ...(overdueCount > 0
                ? [`${overdueCount} overdue checkpoint(s) require immediate resolution`]
                : []),
              ...(openRisksCount > 0
                ? [`${openRisksCount} open risk(s) with no resolved mitigation`]
                : []),
              ...(accounts.some((a) => a.ragStatus === 'RED')
                ? ['Baptist Health account is RED — escalation recommended']
                : []),
            ].slice(0, 3)}
            upcomingEvents={[
              { date: '2026-06-25', event: "Macy's Stakeholder 1:1", type: 'MEETING' },
              { date: '2026-06-30', event: 'Portfolio MBR', type: 'REVIEW' },
              { date: '2026-06-30', event: 'MBR — June 2026 Deadline', type: 'DEADLINE' },
            ]}
            generatedAt="Today, 11:00 AM"
          />
        </div>
      )}

      {/* ── TAB: Activity Tracker ──────────────────────────────────────────── */}
      {activeTab === 'activity' && (
        <GovernanceActivityTracker activities={activityRows} onMarkComplete={handleMarkComplete} />
      )}

      {/* ── TAB: Risks & Actions ──────────────────────────────────────────── */}
      {activeTab === 'risks' && (
        <RisksActions
          risks={riskItems}
          actions={actionItems}
          onResolveRisk={handleResolveRisk}
          onCompleteAction={handleCompleteAction}
        />
      )}

      {/* ── TAB: Trends ───────────────────────────────────────────────────── */}
      {activeTab === 'trends' && <GovernanceTrends data={TREND_DATA} />}
    </div>
  );
}
