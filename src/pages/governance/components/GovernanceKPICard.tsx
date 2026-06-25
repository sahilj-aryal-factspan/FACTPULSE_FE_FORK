import { useState, useEffect } from 'react';

interface GovernanceKPICardProps {
  label: string;
  icon: string;
  value: number;
  trend: number; // positive = up, negative = down
  target: number;
}

export default function GovernanceKPICard({ label, icon, value, trend, target }: GovernanceKPICardProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getStatus = (v: number): 'GREEN' | 'AMBER' | 'RED' => {
    if (v >= 90) return 'GREEN';
    if (v >= 75) return 'AMBER';
    return 'RED';
  };

  const status = getStatus(value);

  const statusColors = {
    GREEN: { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#22c55e' },
    AMBER: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
    RED: { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#ef4444' },
  };

  const sc = statusColors[status];
  const trendUp = trend >= 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: `1px solid #E4E7EC`,
        padding: '20px',
        boxShadow: '0 2px 8px rgba(13,42,102,0.06)',
        transition: 'all 0.3s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,42,102,0.12)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,42,102,0.06)';
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: sc.dot,
          borderRadius: '14px 14px 0 0',
        }}
      />

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              marginBottom: '4px',
            }}
          >
            {label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '9px',
                fontWeight: 700,
                padding: '2px 7px',
                borderRadius: '20px',
                background: sc.bg,
                color: sc.text,
                border: `1px solid ${sc.border}`,
                letterSpacing: '0.4px',
              }}
            >
              {status}
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: '22px',
            background: 'rgba(13,42,102,0.04)',
            padding: '8px',
            borderRadius: '10px',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Circular progress + value */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '72px', height: '72px', flexShrink: 0 }}>
          <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r={radius} stroke="#f1f5f9" strokeWidth="5" fill="transparent" />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke={sc.dot}
              strokeWidth="5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? circumference - dash : circumference}
              style={{ transition: 'stroke-dashoffset 1.2s ease' }}
              strokeLinecap="round"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#0D2A66', lineHeight: 1 }}>{value}%</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0D2A66', lineHeight: 1 }}>{value}%</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: trendUp ? '#16a34a' : '#dc2626',
            }}
          >
            <span>{trendUp ? '▲' : '▼'}</span>
            <span>
              {Math.abs(trend)}% vs last period
            </span>
          </div>
          {/* Target bar */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', marginBottom: '3px' }}>
              <span>Target: {target}%</span>
              <span>{value >= target ? '✓ On target' : `${target - value}% gap`}</span>
            </div>
            <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: animated ? `${Math.min(value, 100)}%` : '0%',
                  background: sc.dot,
                  borderRadius: '2px',
                  transition: 'width 1.2s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
