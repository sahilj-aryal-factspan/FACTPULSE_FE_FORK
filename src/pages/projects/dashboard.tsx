import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import type { GovernanceRecord, Risk, Action, Decision, Milestone } from '../../store/data-store';

export default function ProjectDashboardPage() {
  const { accountId, projectId } = useParams<{ accountId: string; projectId: string }>();
  const {
    accounts,
    projects,
    risks,
    actions,
    decisions,
    milestones,
    governanceRecords,
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
  } = useDataStore();

  const account = accounts.find((a) => a.id === accountId);
  const project = projects.find((p) => p.id === projectId);

  // Filter project memory
  const projectRisks = risks.filter((r) => r.projectId === projectId);
  const projectActions = actions.filter((a) => a.projectId === projectId);
  const projectDecisions = decisions.filter((d) => d.projectId === projectId);
  const projectMilestones = milestones.filter((m) => m.projectId === projectId);
  const projectGovRecords = governanceRecords.filter((r) => r.projectId === projectId);

  // Form states
  const [riskDesc, setRiskDesc] = useState('');
  const [riskSeverity, setRiskSeverity] = useState<Risk['severity']>('MEDIUM');
  const [riskMitigation, setRiskMitigation] = useState('');

  const [actDesc, setActDesc] = useState('');
  const [actAssignee, setActAssignee] = useState('');
  const [actDueDate, setActDueDate] = useState('');

  const [decDesc, setDecDesc] = useState('');
  const [decMadeBy, setDecMadeBy] = useState('');

  if (!project) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Project Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a' }}>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  // Handle submissions
  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskDesc || !riskMitigation) return;
    addRisk(project.id, {
      description: riskDesc,
      severity: riskSeverity,
      mitigationPlan: riskMitigation,
    });
    setRiskDesc('');
    setRiskMitigation('');
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actDesc || !actAssignee || !actDueDate) return;
    addAction(project.id, { description: actDesc, assignee: actAssignee, dueDate: actDueDate });
    setActDesc('');
    setActAssignee('');
    setActDueDate('');
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decDesc || !decMadeBy) return;
    addDecision(project.id, {
      description: decDesc,
      madeBy: decMadeBy,
      date: new Date().toISOString().substring(0, 10),
    });
    setDecDesc('');
    setDecMadeBy('');
  };

  const handleCompleteGov = (recordId: string) => {
    completeGovernanceRecord(recordId, 'Completed during audit review.');
    recalculateGovernance(project.id);
  };

  const getRagBadgeStyle = (status: 'GREEN' | 'AMBER' | 'RED') => {
    switch (status) {
      case 'GREEN':
        return { backgroundColor: '#def7ec', color: '#03543f', border: '1px solid #bcf0da' };
      case 'AMBER':
        return { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'RED':
        return { backgroundColor: '#fde8e8', color: '#9b1c1c', border: '1px solid #fabdbe' };
    }
  };

  const getGovStatusColor = (status: GovernanceRecord['status']) => {
    switch (status) {
      case 'COMPLETED':
        return '#10b981';
      case 'PENDING':
        return '#f59e0b';
      case 'OVERDUE':
        return '#ef4444';
    }
  };

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '1250px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/portfolio" style={{ textDecoration: 'none', color: '#64748b' }}>
          Portfolio
        </Link>{' '}
        /
        {account && (
          <>
            <Link
              to={`/accounts/${account.id}`}
              style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
            >
              {account.name}
            </Link>{' '}
            /
          </>
        )}
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          {project.name}
        </span>
      </div>

      {/* Project Overview Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
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
                ...getRagBadgeStyle(project.health),
              }}
            >
              {project.health} Health
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Account Partner: {account?.name || 'Unknown'} • Status: {project.status}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                color: '#64748b',
                fontSize: '12px',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Compliance Rate
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
              {project.complianceRate}%
            </div>
          </div>
          <div
            style={{
              width: '100px',
              height: '8px',
              background: '#f1f5f9',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{ width: `${project.complianceRate}%`, height: '100%', background: '#1e3a8a' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 10-Checkpoint Governance Compliance Grid */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
              Activity Compliance Matrix
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>
              Track required 10 delivery governance check-gates
            </p>
          </div>
          <Link
            to="/ai-workspace"
            style={{
              textDecoration: 'none',
              background: '#8a3d78',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ⚡ Open AI Assistant
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          {projectGovRecords.map((r) => {
            const statusColor = getGovStatusColor(r.status);
            return (
              <div
                key={r.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: r.status === 'COMPLETED' ? 'rgba(16,185,129,0.02)' : 'transparent',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      {r.type.replace('_', ' ')}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: statusColor }}>
                      ● {r.status}
                    </span>
                  </div>
                  <h5
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '14px',
                      color: '#1e3a8a',
                      fontWeight: 700,
                    }}
                  >
                    {r.title}
                  </h5>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                    Due date: {r.dueDate}
                  </p>
                  {r.completedAt && (
                    <p
                      style={{
                        margin: '4px 0 0 0',
                        fontSize: '11px',
                        color: '#10b981',
                        fontWeight: 500,
                      }}
                    >
                      Completed: {r.completedAt}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  {r.status !== 'COMPLETED' ? (
                    <>
                      <button
                        onClick={() => handleCompleteGov(r.id)}
                        style={{
                          flex: 1,
                          background: '#1e3a8a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        Complete
                      </button>
                      <Link
                        to="/ai-workspace/upload"
                        style={{
                          textDecoration: 'none',
                          border: '1px solid #cbd5e1',
                          color: '#475569',
                          padding: '5px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          textAlign: 'center',
                        }}
                      >
                        Upload
                      </Link>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#10b981',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Risks (Left) vs Actions & Decisions (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left: Risks & Mitigation Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
            Risks & Mitigations
          </h3>

          {/* Add Risk Form */}
          <form
            onSubmit={handleAddRisk}
            style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <input
              type="text"
              required
              placeholder="Describe risk..."
              style={{
                flex: 1,
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '13px',
              }}
              value={riskDesc}
              onChange={(e) => setRiskDesc(e.target.value)}
            />
            <input
              type="text"
              required
              placeholder="Mitigation plan..."
              style={{
                flex: 1,
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '13px',
              }}
              value={riskMitigation}
              onChange={(e) => setRiskMitigation(e.target.value)}
            />
            <select
              style={{
                padding: '8px 10px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '13px',
              }}
              value={riskSeverity}
              onChange={(e) => setRiskSeverity(e.target.value as any)}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <button
              type="submit"
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Log Risk
            </button>
          </form>

          {/* Risks List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {projectRisks.map((r) => (
              <div
                key={r.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        background: r.severity === 'HIGH' ? '#fde8e8' : '#fffbeb',
                        color: r.severity === 'HIGH' ? '#e11d48' : '#d97706',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {r.severity}
                    </span>
                    <strong style={{ color: '#1e3a8a', fontSize: '14px' }}>{r.description}</strong>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    <strong>Mitigation:</strong> {r.mitigationPlan}
                  </p>
                </div>
                <button
                  onClick={() => deleteRisk(r.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions & Decisions Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Action Items Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3
              style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}
            >
              Action Items
            </h3>

            {/* Add Action Form */}
            <form
              onSubmit={handleAddAction}
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <input
                type="text"
                required
                placeholder="Action desc..."
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Assignee..."
                style={{
                  width: '100px',
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                value={actAssignee}
                onChange={(e) => setActAssignee(e.target.value)}
              />
              <input
                type="date"
                required
                style={{
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                value={actDueDate}
                onChange={(e) => setActDueDate(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  background: '#1e3a8a',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Add
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projectActions.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={a.status === 'COMPLETED'}
                      onChange={(e) =>
                        updateAction(a.id, { status: e.target.checked ? 'COMPLETED' : 'PENDING' })
                      }
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span
                      style={{
                        textDecoration: a.status === 'COMPLETED' ? 'line-through' : 'none',
                        color: a.status === 'COMPLETED' ? '#94a3b8' : '#1e293b',
                        fontSize: '13px',
                      }}
                    >
                      {a.description}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                      <div>{a.assignee}</div>
                      <div>Due: {a.dueDate}</div>
                    </div>
                    <button
                      onClick={() => deleteAction(a.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#cbd5e1',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decisions Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3
              style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}
            >
              Decision Log
            </h3>

            <form
              onSubmit={handleAddDecision}
              style={{
                display: 'flex',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <input
                type="text"
                required
                placeholder="Decision made..."
                style={{
                  flex: 1,
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                value={decDesc}
                onChange={(e) => setDecDesc(e.target.value)}
              />
              <input
                type="text"
                required
                placeholder="Approved by..."
                style={{
                  width: '120px',
                  padding: '8px 10px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  fontSize: '13px',
                }}
                value={decMadeBy}
                onChange={(e) => setDecMadeBy(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  background: '#1e3a8a',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Log
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projectDecisions.map((d) => (
                <div
                  key={d.id}
                  style={{
                    borderLeft: '3px solid #8a3d78',
                    paddingLeft: '12px',
                    paddingBottom: '4px',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b' }}>
                    {d.description}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    Authorized by {d.madeBy} on {d.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
