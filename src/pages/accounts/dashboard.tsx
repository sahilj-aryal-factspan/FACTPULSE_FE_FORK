import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function getSentimentColors(s: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE') {
  switch (s) {
    case 'POSITIVE':
      return { icon: '🟢', color: '#10b981', label: 'Positive' };
    case 'NEUTRAL':
      return { icon: '🟡', color: '#f59e0b', label: 'Neutral' };
    case 'NEGATIVE':
      return { icon: '🔴', color: '#ef4444', label: 'Negative' };
  }
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtext?: string;
  accent: string;
  accentBg: string;
  trend?: 'up' | 'down' | 'neutral';
}

function MetricCard({ icon, label, value, subtext, accent, accentBg, trend }: MetricCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        border: `1.5px solid ${hovered ? accent : '#e2e8f0'}`,
        padding: '20px 22px',
        boxShadow: hovered
          ? `0 8px 30px -8px ${accent}40`
          : '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-3px)' : 'none',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: accentBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8',
              background: trend === 'up' ? '#d1fae5' : trend === 'down' ? '#fee2e2' : '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '20px',
            }}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'}
          </span>
        )}
      </div>
      <div>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: '26px', fontWeight: 800, color: accent, lineHeight: 1 }}>
          {value}
        </div>
        {subtext && (
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Compliance Bar ───────────────────────────────────────────────────────────

function ComplianceBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
          marginBottom: '5px',
        }}
      >
        <span style={{ fontWeight: 600 }}>{label}</span>
        <span style={{ fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div
        style={{
          width: '100%',
          height: '7px',
          background: '#f1f5f9',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            borderRadius: '4px',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
    </div>
  );
}

// ─── Skeleton Lines ───────────────────────────────────────────────────────────

function SkeletonLine({ width = '100%', height = '14px' }: { width?: string; height?: string }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: '6px',
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s infinite',
        marginBottom: '8px',
      }}
    />
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AccountDashboardPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const {
    accounts,
    projects,
    buyingCenters,
    stakeholders,
    risks,
    governanceRecords,
    aiReports,
    addAIReport,
    updateAIReport,
    publishAIReport,
  } = useDataStore();

  // ── Find Account ───────────────────────────────────────────────────────────
  const account = accounts.find((a) => a.id === accountId);
  if (!account) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Account Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a', fontWeight: 600 }}>
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  // ── Related Entities ───────────────────────────────────────────────────────
  const accountProjects = projects.filter((p) => p.accountId === account.id);
  const accountCenters = buyingCenters.filter((bc) => bc.accountId === account.id);
  const centerIds = accountCenters.map((bc) => bc.id);
  const accountStakeholders = stakeholders.filter((s) => centerIds.includes(s.buyingCenterId));
  const projectIds = accountProjects.map((p) => p.id);

  // ── Compute Metrics ────────────────────────────────────────────────────────
  const activeProjects = accountProjects.filter((p) => p.status === 'ACTIVE').length;

  const allGovRecords = governanceRecords.filter((r) => projectIds.includes(r.projectId));

  const wbrRecords = allGovRecords.filter((r) => r.type === 'WBR');
  const wbrCompleted = wbrRecords.filter((r) => r.status === 'COMPLETED').length;
  const wbrCompliance =
    wbrRecords.length > 0 ? Math.round((wbrCompleted / wbrRecords.length) * 100) : 100;

  const notesRecords = allGovRecords.filter((r) => r.type === 'WEEKLY_NOTE');
  const notesCompleted = notesRecords.filter((r) => r.status === 'COMPLETED').length;
  const notesCompliance =
    notesRecords.length > 0 ? Math.round((notesCompleted / notesRecords.length) * 100) : 100;

  const openRisks = risks.filter(
    (r) => projectIds.includes(r.projectId) && r.status === 'OPEN'
  ).length;

  const positiveStkCount = accountStakeholders.filter((s) => s.sentiment === 'POSITIVE').length;
  const negativeStkCount = accountStakeholders.filter((s) => s.sentiment === 'NEGATIVE').length;
  const sentimentScore =
    accountStakeholders.length > 0
      ? Math.round((positiveStkCount / accountStakeholders.length) * 100)
      : 0;

  const avgCenterHealth =
    accountCenters.length > 0
      ? Math.round(accountCenters.reduce((sum, bc) => sum + bc.health, 0) / accountCenters.length)
      : 0;

  // Composite account health score
  const accountHealthScore = Math.round(
    account.governanceScore * 0.3 +
      account.complianceScore * 0.3 +
      sentimentScore * 0.2 +
      avgCenterHealth * 0.2
  );

  // ── AI Digest ──────────────────────────────────────────────────────────────
  const existingDigest = aiReports
    .filter((r) => r.accountId === account.id && r.type === 'ACCOUNT_DIGEST')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  const [digestId, setDigestId] = useState<string | null>(existingDigest?.id ?? null);
  const [editMode, setEditMode] = useState(false);
  const [editorText, setEditorText] = useState(existingDigest?.content ?? '');
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [saved, setSaved] = useState(false);

  const activeDigest = aiReports.find((r) => r.id === digestId);

  // Simulate step-by-step generation
  const handleGenerate = () => {
    setGenerating(true);
    setEditMode(false);
    setSaved(false);

    const steps = [
      'Scanning compliance records…',
      'Aggregating governance activity…',
      'Synthesising stakeholder sentiment logs…',
      'Computing health score breakdown…',
      'Composing executive digest…',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setGeneratingStep(steps[i]);
        i++;
      } else {
        clearInterval(interval);
        // Build dynamic content
        const wbrLabel = wbrCompliance >= 90 ? 'excellent' : wbrCompliance >= 75 ? 'acceptable' : 'below threshold';
        const notesLabel = notesCompliance >= 90 ? 'fully compliant' : notesCompliance >= 75 ? 'mostly compliant' : 'non-compliant';
        const riskLabel = openRisks === 0 ? 'No open risks recorded.' : `${openRisks} open risk${openRisks > 1 ? 's' : ''} require attention.`;
        const sentLabel = negativeStkCount > 0
          ? `${negativeStkCount} stakeholder${negativeStkCount > 1 ? 's' : ''} are showing negative sentiment — escalation touchpoints are advised.`
          : 'Stakeholder sentiment is positive across all buying centers.';
        const healthLabel =
          accountHealthScore >= 85 ? 'Strong' : accountHealthScore >= 70 ? 'Moderate' : 'At Risk';

        const content = `# Account Digest – ${account.name}\n\n## Executive Summary\nThis account is currently rated **${account.ragStatus}** with an overall Health Score of **${accountHealthScore}%** (${healthLabel}). Governance scores indicate ${wbrLabel} WBR adherence and ${notesLabel} Weekly Notes compliance.\n\n## Compliance Highlights\n- **WBR Compliance**: ${wbrCompliance}% — ${wbrCompleted} of ${wbrRecords.length} reviews completed.\n- **Weekly Notes Compliance**: ${notesCompliance}% — ${notesCompleted} of ${notesRecords.length} notes filed.\n- **Active Projects**: ${activeProjects} project${activeProjects !== 1 ? 's' : ''} in progress.\n\n## Risk Posture\n${riskLabel}\n\n## Stakeholder Sentiment\n${sentLabel} Current positive engagement rate: ${sentimentScore}%.\n\n## Account Health Score Breakdown\n- Governance Score: ${account.governanceScore}% (weight 30%)\n- Compliance Score: ${account.complianceScore}% (weight 30%)\n- Stakeholder Sentiment: ${sentimentScore}% (weight 20%)\n- Buying Center Health: ${avgCenterHealth}% (weight 20%)\n\n## Recommended Actions\n1. Review and resolve any overdue governance items across active projects.\n2. Schedule proactive stakeholder connects to maintain positive sentiment.\n3. Ensure all project milestones are confirmed before the next business review cycle.`;

        const newId = addAIReport('', 'ACCOUNT_DIGEST', content, account.id);
        setDigestId(newId);
        setEditorText(content);
        setGenerating(false);
        setGeneratingStep('');
      }
    }, 600);
  };

  const handleSave = () => {
    if (!digestId) return;
    updateAIReport(digestId, editorText);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePublish = () => {
    if (!digestId) return;
    publishAIReport(digestId);
  };

  const ragColors = getRagColors(account.ragStatus);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>

      <div
        style={{
          padding: '32px',
          maxWidth: '1300px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          animation: 'fadeIn 0.35s ease',
        }}
      >
        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <div style={{ marginBottom: '20px', fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link to="/portfolio" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 500 }}>
            Portfolio
          </Link>
          <span>›</span>
          <Link to="/accounts" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 500 }}>
            Accounts
          </Link>
          <span>›</span>
          <span style={{ color: '#1e3a8a', fontWeight: 700 }}>{account.name}</span>
        </div>

        {/* ── Account Header Card ─────────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 60%, #1d4ed8 100%)',
            borderRadius: '16px',
            padding: '28px 32px',
            marginBottom: '28px',
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
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-30px', right: '80px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '20px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', position: 'relative' }}>
            {account.logoUrl ? (
              <img
                src={account.logoUrl}
                alt={account.name}
                style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.25)' }}
              />
            ) : (
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '22px',
                }}
              >
                {account.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ color: '#ffffff', margin: 0, fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  {account.name}
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
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: ragColors.dot, display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
                  {account.ragStatus}
                </span>
              </div>
              <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '13px' }}>
                Enterprise Client · Delivery Governance Center
              </p>
            </div>
          </div>

          {/* Scores cluster */}
          <div style={{ display: 'flex', gap: '28px', alignItems: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Governance</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>{account.governanceScore}%</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Compliance</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>{account.complianceScore}%</div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Health Score</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: accountHealthScore >= 80 ? '#4ade80' : accountHealthScore >= 60 ? '#fbbf24' : '#f87171', marginTop: '2px' }}>
                {accountHealthScore}%
              </div>
            </div>
            <Link
              to={`/accounts/${account.id}/edit`}
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        {/* ── 6-Metric Cards Grid ────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <MetricCard
            icon="🚀"
            label="Active Projects"
            value={activeProjects}
            subtext={`${accountProjects.length} total in portfolio`}
            accent="#1e3a8a"
            accentBg="rgba(30,58,138,0.08)"
            trend="neutral"
          />
          <MetricCard
            icon="📊"
            label="WBR Compliance"
            value={`${wbrCompliance}%`}
            subtext={`${wbrCompleted}/${wbrRecords.length} reviews done`}
            accent={wbrCompliance >= 90 ? '#10b981' : wbrCompliance >= 70 ? '#f59e0b' : '#ef4444'}
            accentBg={wbrCompliance >= 90 ? 'rgba(16,185,129,0.08)' : wbrCompliance >= 70 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}
            trend={wbrCompliance >= 90 ? 'up' : wbrCompliance >= 70 ? 'neutral' : 'down'}
          />
          <MetricCard
            icon="📝"
            label="Weekly Notes"
            value={`${notesCompliance}%`}
            subtext={`${notesCompleted}/${notesRecords.length} notes filed`}
            accent={notesCompliance >= 90 ? '#10b981' : notesCompliance >= 70 ? '#f59e0b' : '#ef4444'}
            accentBg={notesCompliance >= 90 ? 'rgba(16,185,129,0.08)' : notesCompliance >= 70 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}
            trend={notesCompliance >= 90 ? 'up' : notesCompliance >= 70 ? 'neutral' : 'down'}
          />
          <MetricCard
            icon="⚠️"
            label="Open Risks"
            value={openRisks}
            subtext={openRisks === 0 ? 'No critical issues' : 'Needs attention'}
            accent={openRisks === 0 ? '#10b981' : openRisks <= 1 ? '#f59e0b' : '#ef4444'}
            accentBg={openRisks === 0 ? 'rgba(16,185,129,0.08)' : openRisks <= 1 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}
            trend={openRisks === 0 ? 'up' : 'down'}
          />
          <MetricCard
            icon="🤝"
            label="Stakeholder Sentiment"
            value={`${sentimentScore}%`}
            subtext={`${positiveStkCount} positive · ${negativeStkCount} at risk`}
            accent={sentimentScore >= 70 ? '#10b981' : sentimentScore >= 40 ? '#f59e0b' : '#ef4444'}
            accentBg={sentimentScore >= 70 ? 'rgba(16,185,129,0.08)' : sentimentScore >= 40 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}
            trend={sentimentScore >= 70 ? 'up' : 'down'}
          />
          <MetricCard
            icon="🏥"
            label="Account Health Score"
            value={`${accountHealthScore}%`}
            subtext="Composite score · 4 dimensions"
            accent={accountHealthScore >= 80 ? '#10b981' : accountHealthScore >= 60 ? '#f59e0b' : '#ef4444'}
            accentBg={accountHealthScore >= 80 ? 'rgba(16,185,129,0.08)' : accountHealthScore >= 60 ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)'}
            trend={accountHealthScore >= 80 ? 'up' : accountHealthScore >= 60 ? 'neutral' : 'down'}
          />
        </div>

        {/* ── AI Account Digest Panel ────────────────────────────────────── */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(138,61,120,0.04) 0%, rgba(30,58,138,0.04) 100%)',
            border: '1.5px solid #e0d4f7',
            borderLeft: '5px solid #8a3d78',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 4px 24px rgba(138,61,120,0.07)',
          }}
        >
          {/* Digest Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #8a3d78, #6d28d9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '17px',
                }}
              >
                ⚡
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '17px', color: '#1e293b' }}>
                  AI-Generated Account Digest
                </div>
                {activeDigest && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                    Last generated: {activeDigest.createdAt} ·{' '}
                    <span
                      style={{
                        fontWeight: 700,
                        color: activeDigest.status === 'PUBLISHED' ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {activeDigest.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {activeDigest && !editMode && !generating && (
                <>
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditorText(activeDigest.content);
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      color: '#475569',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.borderColor = '#8a3d78')}
                    onMouseOut={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
                  >
                    ✏️ Edit
                  </button>
                  {activeDigest.status !== 'PUBLISHED' && (
                    <button
                      onClick={handlePublish}
                      style={{
                        background: '#10b981',
                        border: 'none',
                        color: '#ffffff',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      ✅ Publish
                    </button>
                  )}
                  <button
                    onClick={() => alert('📧 Gmail draft created via MCP connector.')}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      color: '#475569',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    ✉️ Gmail Draft
                  </button>
                </>
              )}

              {editMode && (
                <>
                  <button
                    onClick={handleSave}
                    style={{
                      background: '#1e3a8a',
                      border: 'none',
                      color: '#ffffff',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    💾 Save Draft
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      color: '#475569',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    ✕ Cancel
                  </button>
                </>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  background: generating
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #8a3d78, #6d28d9)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '7px 18px',
                  borderRadius: '8px',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  transition: 'opacity 0.2s',
                  letterSpacing: '0.3px',
                }}
                onMouseOver={(e) => { if (!generating) e.currentTarget.style.opacity = '0.9'; }}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {generating ? '⏳ Generating…' : activeDigest ? '🔄 Regenerate' : '⚡ Generate Digest'}
              </button>
            </div>
          </div>

          {/* Saved confirmation banner */}
          {saved && (
            <div
              style={{
                background: '#d1fae5',
                border: '1px solid #6ee7b7',
                borderRadius: '8px',
                padding: '10px 16px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#065f46',
                fontWeight: 600,
                animation: 'fadeIn 0.3s ease',
              }}
            >
              ✅ Draft saved successfully.
            </div>
          )}

          {/* Digest Content Area */}
          {generating ? (
            /* ── Skeleton Loading ── */
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: '#8a3d78',
                  fontWeight: 600,
                }}
              >
                <span style={{ animation: 'pulse-dot 1s infinite', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#8a3d78' }} />
                {generatingStep}
              </div>
              <SkeletonLine width="55%" height="18px" />
              <SkeletonLine width="100%" />
              <SkeletonLine width="90%" />
              <SkeletonLine width="95%" />
              <SkeletonLine width="40%" height="16px" />
              <SkeletonLine width="100%" />
              <SkeletonLine width="85%" />
              <SkeletonLine width="70%" height="16px" />
              <SkeletonLine width="100%" />
              <SkeletonLine width="60%" />
            </div>
          ) : editMode ? (
            /* ── Edit Textarea ── */
            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              style={{
                width: '100%',
                minHeight: '320px',
                border: '1.5px solid #e0d4f7',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '13px',
                lineHeight: '1.7',
                color: '#334155',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                background: '#faf5ff',
              }}
            />
          ) : activeDigest ? (
            /* ── Rendered Digest ── */
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {activeDigest.content.split('\n').map((line, idx) => {
                if (line.startsWith('## ')) {
                  return (
                    <div
                      key={idx}
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#8a3d78',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: idx === 0 ? 0 : '18px',
                        marginBottom: '8px',
                        paddingBottom: '4px',
                        borderBottom: '1px solid #e0d4f7',
                      }}
                    >
                      {line.replace('## ', '')}
                    </div>
                  );
                }
                if (line.startsWith('# ')) {
                  return (
                    <div
                      key={idx}
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#1e3a8a',
                        marginBottom: '12px',
                      }}
                    >
                      {line.replace('# ', '')}
                    </div>
                  );
                }
                if (line.startsWith('- ')) {
                  const text = line.replace('- ', '');
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '13.5px',
                        lineHeight: '1.6',
                        color: '#334155',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: '#8a3d78', marginTop: '2px', flexShrink: 0 }}>•</span>
                      <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  );
                }
                if (/^\d+\./.test(line)) {
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px',
                        fontSize: '13.5px',
                        lineHeight: '1.6',
                        color: '#334155',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: '#8a3d78', fontWeight: 700, flexShrink: 0 }}>{line.match(/^\d+/)![0]}.</span>
                      <span dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                    </div>
                  );
                }
                if (line.trim() === '') return <div key={idx} style={{ height: '6px' }} />;
                return (
                  <p
                    key={idx}
                    style={{ margin: '0 0 6px 0', fontSize: '13.5px', lineHeight: '1.6', color: '#334155' }}
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
                  />
                );
              })}
            </div>
          ) : (
            /* ── Empty State ── */
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#94a3b8',
              }}
            >
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#64748b' }}>No Digest Generated Yet</div>
              <p style={{ fontSize: '13px', margin: '6px 0 0 0' }}>
                Click <strong>⚡ Generate Digest</strong> to produce an AI-synthesised account summary based on live compliance data.
              </p>
            </div>
          )}
        </div>

        {/* ── Bottom Grid: Projects / Centers / Stakeholders ─────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 420px',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* LEFT: Projects */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>
                Projects Portfolio
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                {accountProjects.length} Total
              </span>
            </div>

            {/* Compliance bars header */}
            <div style={{ marginBottom: '20px' }}>
              <ComplianceBar label="WBR Compliance" value={wbrCompliance} color={wbrCompliance >= 90 ? '#10b981' : wbrCompliance >= 70 ? '#f59e0b' : '#ef4444'} />
              <ComplianceBar label="Weekly Notes Compliance" value={notesCompliance} color={notesCompliance >= 90 ? '#10b981' : notesCompliance >= 70 ? '#f59e0b' : '#ef4444'} />
              <ComplianceBar label="Account Health Score" value={accountHealthScore} color={accountHealthScore >= 80 ? '#1e3a8a' : accountHealthScore >= 60 ? '#f59e0b' : '#ef4444'} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {accountProjects.map((p) => {
                const projColors = getRagColors(p.health);
                return (
                  <div
                    key={p.id}
                    style={{
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      cursor: 'default',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#1e3a8a';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '14px' }}>
                        {p.name}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: p.status === 'ACTIVE' ? '#dbeafe' : '#f1f5f9',
                            color: p.status === 'ACTIVE' ? '#1d4ed8' : '#64748b',
                            border: `1px solid ${p.status === 'ACTIVE' ? '#bfdbfe' : '#e2e8f0'}`,
                          }}
                        >
                          {p.status}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: projColors.bg,
                            color: projColors.text,
                            border: `1px solid ${projColors.border}`,
                          }}
                        >
                          {p.health}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Compliance</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: p.complianceRate >= 80 ? '#10b981' : p.complianceRate >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {p.complianceRate}%
                        </div>
                      </div>
                      <Link
                        to={`/accounts/${account.id}/projects/${p.id}`}
                        style={{
                          textDecoration: 'none',
                          background: '#f1f5f9',
                          color: '#1e3a8a',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#1e3a8a';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#f1f5f9';
                          e.currentTarget.style.color = '#1e3a8a';
                        }}
                      >
                        Manage →
                      </Link>
                    </div>
                  </div>
                );
              })}
              {accountProjects.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>
                  No projects found for this account.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Buying Centers + Stakeholders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Buying Centers */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1.5px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>
                Buying Centers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accountCenters.map((bc) => {
                  const st = getSentimentColors(bc.sentiment);
                  return (
                    <Link
                      key={bc.id}
                      to={`/buying-centers/${bc.id}`}
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        color: 'inherit',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#1e3a8a';
                        e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '13px' }}>
                          {bc.name}
                        </div>
                        <div style={{ fontSize: '11px', color: st.color, fontWeight: 600, marginTop: '2px' }}>
                          {st.icon} {st.label} Sentiment
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: bc.health >= 80 ? '#10b981' : bc.health >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {bc.health}%
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Health</div>
                      </div>
                    </Link>
                  );
                })}
                {accountCenters.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                    No buying centers configured.
                  </div>
                )}
              </div>
            </div>

            {/* Key Stakeholders */}
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
                <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '17px', fontWeight: 800 }}>
                  Key Stakeholders
                </h3>
                {accountCenters.length > 0 && (
                  <Link
                    to={`/buying-centers/${accountCenters[0].id}/stakeholders`}
                    style={{ textDecoration: 'none', color: '#d97706', fontSize: '12px', fontWeight: 700 }}
                  >
                    + Add Contact
                  </Link>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {accountStakeholders.map((s) => {
                  const st = getSentimentColors(s.sentiment);
                  return (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '11px',
                            flexShrink: 0,
                          }}
                        >
                          {s.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{s.role}</div>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: '20px',
                          background: st.color + '18',
                          color: st.color,
                          border: `1px solid ${st.color}40`,
                        }}
                      >
                        {st.icon} {st.label}
                      </span>
                    </div>
                  );
                })}
                {accountStakeholders.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '13px' }}>
                    No stakeholders configured.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
