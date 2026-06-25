export interface RiskItem {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  owner: string;
  dueDate: string;
  account: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED';
  account: string;
}

interface RisksActionsProps {
  risks: RiskItem[];
  actions: ActionItem[];
  onResolveRisk?: (id: string) => void;
  onCompleteAction?: (id: string) => void;
}

export default function RisksActions({ risks, actions, onResolveRisk, onCompleteAction }: RisksActionsProps) {
  const severityConfig = {
    CRITICAL: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
    HIGH: { bg: '#fff7ed', border: '#fed7aa', text: '#9a3412', dot: '#f97316' },
    MEDIUM: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
    LOW: { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#22c55e' },
  };

  const openRisks = risks.filter((r) => r.status === 'OPEN');
  const pendingActions = actions.filter((a) => a.status === 'PENDING');

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '14px',
    border: '1px solid #E4E7EC',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
    flex: 1,
    minWidth: '280px',
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      {/* Risks Card */}
      <div style={cardStyle}>
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E4E7EC',
            background: 'linear-gradient(135deg, rgba(239,68,68,0.03) 0%, rgba(13,42,102,0.02) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D2A66' }}>
              🚨 Active Risks Register
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              {openRisks.length} open risk{openRisks.length !== 1 ? 's' : ''} requiring attention
            </p>
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: openRisks.length > 0 ? '#dc2626' : '#16a34a',
            }}
          >
            {openRisks.length}
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {openRisks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#16a34a', fontWeight: 600 }}>
              ✓ No open risks — excellent!
            </div>
          ) : (
            openRisks.map((risk) => {
              const sc = severityConfig[risk.severity];
              return (
                <div
                  key={risk.id}
                  style={{
                    background: sc.bg,
                    border: `1px solid ${sc.border}`,
                    borderLeft: `4px solid ${sc.dot}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(2px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '13px', color: sc.text }}>{risk.title}</span>
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.7)',
                            color: sc.text,
                            border: `1px solid ${sc.border}`,
                          }}
                        >
                          {risk.severity}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: sc.text, opacity: 0.75 }}>
                          👤 {risk.owner}
                        </span>
                        <span style={{ fontSize: '11px', color: sc.text, opacity: 0.75 }}>
                          📅 Due: {risk.dueDate}
                        </span>
                        <span style={{ fontSize: '11px', color: sc.text, opacity: 0.75 }}>
                          🏢 {risk.account}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onResolveRisk?.(risk.id)}
                      style={{
                        background: '#0D2A66',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#F68B1F')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#0D2A66')}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Actions Card */}
      <div style={cardStyle}>
        <div
          style={{
            padding: '18px 22px',
            borderBottom: '1px solid #E4E7EC',
            background: 'linear-gradient(135deg, rgba(138,61,120,0.03) 0%, rgba(13,42,102,0.02) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D2A66' }}>
              ✅ Action Items Board
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              {pendingActions.length} pending action{pendingActions.length !== 1 ? 's' : ''} open
            </p>
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: pendingActions.length > 0 ? '#8A3D78' : '#16a34a',
            }}
          >
            {pendingActions.length}
          </span>
        </div>

        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {pendingActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#16a34a', fontWeight: 600 }}>
              ✓ All actions completed — excellent!
            </div>
          ) : (
            pendingActions.map((action) => {
              const isOverdue = new Date(action.dueDate) < new Date();
              return (
                <div
                  key={action.id}
                  style={{
                    background: isOverdue ? '#fef2f2' : '#f8faff',
                    border: `1px solid ${isOverdue ? '#fca5a5' : '#E4E7EC'}`,
                    borderLeft: `4px solid ${isOverdue ? '#ef4444' : '#8A3D78'}`,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(2px)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: '#0D2A66', marginBottom: '4px' }}>
                        {action.title}
                      </div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>👤 {action.owner}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: isOverdue ? '#dc2626' : '#64748b',
                            fontWeight: isOverdue ? 700 : 400,
                          }}
                        >
                          📅 {action.dueDate} {isOverdue && '⚠️'}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>🏢 {action.account}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onCompleteAction?.(action.id)}
                      style={{
                        background: '#8A3D78',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = '#F68B1F')}
                      onMouseOut={(e) => (e.currentTarget.style.background = '#8A3D78')}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
