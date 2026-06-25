interface GovernanceSummaryProps {
  governanceScore: number;
  complianceScore: number;
  ragStatus: 'GREEN' | 'AMBER' | 'RED';
  highlights: string[];
  keyRisks: string[];
  upcomingEvents: { date: string; event: string; type: 'REVIEW' | 'MEETING' | 'DEADLINE' }[];
  generatedAt: string;
}

export default function GovernanceSummary({
  governanceScore,
  complianceScore,
  ragStatus,
  highlights,
  keyRisks,
  upcomingEvents,
  generatedAt,
}: GovernanceSummaryProps) {
  const ragConfig = {
    GREEN: { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#22c55e', label: 'Healthy', emoji: '🟢' },
    AMBER: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b', label: 'At Risk', emoji: '🟡' },
    RED: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444', label: 'Critical', emoji: '🔴' },
  };

  const rc = ragConfig[ragStatus];

  const eventTypeConfig = {
    REVIEW: { icon: '📊', color: '#0D2A66' },
    MEETING: { icon: '🤝', color: '#8A3D78' },
    DEADLINE: { icon: '⏰', color: '#dc2626' },
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E4E7EC',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
        height: 'fit-content',
      }}
    >
      {/* AI Badge Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(13,42,102,0.06) 0%, rgba(138,61,120,0.06) 100%)',
          padding: '20px 22px',
          borderBottom: '1px solid #E4E7EC',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0D2A66, #8A3D78)',
              color: '#FFFFFF',
              letterSpacing: '0.5px',
            }}
          >
            ⚡ AI DIGEST
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{generatedAt}</span>
        </div>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0D2A66' }}>
          Governance Summary Panel
        </h3>
        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
          Executive-level delivery governance digest
        </p>
      </div>

      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Overall Health */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            Overall Governance Health
          </div>
          <div
            style={{
              background: rc.bg,
              border: `1px solid ${rc.border}`,
              borderRadius: '10px',
              padding: '14px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: rc.text }}>
                {rc.emoji} {rc.label} — {ragStatus}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { label: 'Governance Score', value: governanceScore, color: '#0D2A66' },
                { label: 'Compliance Score', value: complianceScore, color: '#F68B1F' },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ fontSize: '10px', color: rc.text, opacity: 0.7, marginBottom: '3px' }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: item.color }}>
                      {item.value}%
                    </div>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px', marginTop: '4px' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.value}%`,
                        background: item.color,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Highlights */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            Compliance Highlights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  background: '#f8faff',
                  borderRadius: '8px',
                  border: '1px solid #e0e7ff',
                }}
              >
                <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Risks */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            Key Risks
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {keyRisks.map((risk, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start',
                  padding: '8px 10px',
                  background: '#fff5f5',
                  borderRadius: '8px',
                  border: '1px solid #fecaca',
                }}
              >
                <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>⚠</span>
                <span style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5 }}>{risk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.5px',
              marginBottom: '10px',
            }}
          >
            Upcoming Governance Events
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {upcomingEvents.map((ev, i) => {
              const ec = eventTypeConfig[ev.type];
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    padding: '8px 10px',
                    background: '#F5F6F8',
                    borderRadius: '8px',
                    border: '1px solid #E4E7EC',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{ec.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: ec.color }}>{ev.event}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{ev.date}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '20px',
                      background: 'rgba(13,42,102,0.07)',
                      color: ec.color,
                    }}
                  >
                    {ev.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 22px',
          borderTop: '1px solid #f1f5f9',
          background: '#F5F6F8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>AI-assisted digest · Last updated {generatedAt}</span>
        <button
          style={{
            background: 'linear-gradient(135deg, #0D2A66, #8A3D78)',
            color: '#FFFFFF',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Regenerate
        </button>
      </div>
    </div>
  );
}
