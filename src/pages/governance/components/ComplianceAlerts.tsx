import { useState } from 'react';

interface Alert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  description: string;
  account: string;
  project: string;
  date: string;
  icon: string;
}

interface ComplianceAlertsProps {
  alerts: Alert[];
}

export default function ComplianceAlerts({ alerts }: ComplianceAlertsProps) {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');

  const severityConfig = {
    CRITICAL: {
      bg: '#fef2f2',
      border: '#fca5a5',
      text: '#991b1b',
      badge: '#dc2626',
      badgeBg: '#fee2e2',
      label: 'CRITICAL',
      dot: '#ef4444',
    },
    WARNING: {
      bg: '#fffbeb',
      border: '#fcd34d',
      text: '#92400e',
      badge: '#b45309',
      badgeBg: '#fef3c7',
      label: 'WARNING',
      dot: '#f59e0b',
    },
    INFO: {
      bg: '#f0f9ff',
      border: '#bae6fd',
      text: '#0c4a6e',
      badge: '#0369a1',
      badgeBg: '#e0f2fe',
      label: 'INFO',
      dot: '#0ea5e9',
    },
  };

  const filterBtnStyle = (active: boolean, color = '#0D2A66') => ({
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    border: `1px solid ${active ? color : '#E4E7EC'}`,
    background: active ? color : '#FFFFFF',
    color: active ? '#FFFFFF' : '#64748b',
    transition: 'all 0.2s',
  });

  const filtered = filter === 'ALL' ? alerts : alerts.filter((a) => a.severity === filter);
  const critCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warnCount = alerts.filter((a) => a.severity === 'WARNING').length;
  const infoCount = alerts.filter((a) => a.severity === 'INFO').length;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E4E7EC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E4E7EC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(220,38,38,0.02) 0%, rgba(13,42,102,0.02) 100%)',
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D2A66' }}>
            ⚠️ Compliance Alerts
          </h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            Active governance gaps requiring attention
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {critCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '20px',
                background: '#fee2e2',
                color: '#dc2626',
              }}
            >
              {critCount} Critical
            </span>
          )}
          {warnCount > 0 && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '20px',
                background: '#fef3c7',
                color: '#b45309',
              }}
            >
              {warnCount} Warning
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('ALL')} style={filterBtnStyle(filter === 'ALL')}>All ({alerts.length})</button>
        <button onClick={() => setFilter('CRITICAL')} style={filterBtnStyle(filter === 'CRITICAL', '#dc2626')}>Critical ({critCount})</button>
        <button onClick={() => setFilter('WARNING')} style={filterBtnStyle(filter === 'WARNING', '#b45309')}>Warning ({warnCount})</button>
        <button onClick={() => setFilter('INFO')} style={filterBtnStyle(filter === 'INFO', '#0369a1')}>Info ({infoCount})</button>
      </div>

      {/* Alert Cards */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#16a34a', fontWeight: 600 }}>
            ✓ No alerts in this category
          </div>
        )}
        {filtered.map((alert) => {
          const sc = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              style={{
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                borderLeft: `4px solid ${sc.dot}`,
                borderRadius: '10px',
                padding: '14px 16px',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateX(3px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1 }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{alert.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: sc.text }}>{alert.title}</span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '20px',
                          background: sc.badgeBg,
                          color: sc.badge,
                          letterSpacing: '0.4px',
                        }}
                      >
                        {sc.label}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: sc.text, opacity: 0.8, lineHeight: 1.5 }}>
                      {alert.description}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '11px', color: sc.text, opacity: 0.7 }}>
                        🏢 {alert.account}
                      </span>
                      <span style={{ fontSize: '11px', color: sc.text, opacity: 0.7 }}>
                        💻 {alert.project}
                      </span>
                      <span style={{ fontSize: '11px', color: sc.text, opacity: 0.7 }}>
                        📅 {alert.date}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  style={{
                    background: 'transparent',
                    border: `1px solid ${sc.border}`,
                    color: sc.badge,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: '12px',
                  }}
                  onClick={() => window.alert(`Escalation sent for: ${alert.title}`)}
                >
                  Escalate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
