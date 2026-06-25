import { useState } from 'react';

export interface ActivityRow {
  id: string;
  type: string;
  typeLabel: string;
  owner: string;
  frequency: string;
  lastCompleted: string;
  nextDue: string;
  status: 'COMPLETED' | 'PENDING' | 'OVERDUE';
  icon: string;
}

interface GovernanceActivityTrackerProps {
  activities: ActivityRow[];
  onMarkComplete?: (id: string) => void;
}

export default function GovernanceActivityTracker({ activities, onMarkComplete }: GovernanceActivityTrackerProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'OVERDUE'>('ALL');
  const [freqFilter, setFreqFilter] = useState<'ALL' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'>('ALL');

  const statusConfig = {
    COMPLETED: { bg: '#f0fdf4', text: '#166534', border: '#86efac', dot: '#22c55e', label: 'Completed' },
    PENDING: { bg: '#fffbeb', text: '#92400e', border: '#fcd34d', dot: '#f59e0b', label: 'Pending' },
    OVERDUE: { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444', label: 'Overdue' },
  };

  const filtered = activities.filter((a) => {
    const matchSearch =
      search === '' ||
      a.typeLabel.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchFreq = freqFilter === 'ALL' || a.frequency === freqFilter;
    return matchSearch && matchStatus && matchFreq;
  });

  const filterBtnStyle = (active: boolean) => ({
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    border: `1px solid ${active ? '#0D2A66' : '#E4E7EC'}`,
    background: active ? '#0D2A66' : '#FFFFFF',
    color: active ? '#FFFFFF' : '#64748b',
    transition: 'all 0.2s',
  });

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
          background: 'linear-gradient(135deg, rgba(13,42,102,0.02) 0%, rgba(246,139,31,0.02) 100%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0D2A66' }}>
              📋 Governance Activity Tracker
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              All 10 governance checkpoints · Real-time status
            </p>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search activities, owners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 12px 8px 34px',
                border: '1px solid #E4E7EC',
                borderRadius: '8px',
                fontSize: '13px',
                outline: 'none',
                width: '220px',
                color: '#334155',
                background: '#F5F6F8',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                fontSize: '14px',
              }}
            >
              🔍
            </span>
          </div>
        </div>

        {/* Filter Row */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Status:</span>
          {(['ALL', 'COMPLETED', 'PENDING', 'OVERDUE'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} style={filterBtnStyle(statusFilter === s)}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginLeft: '8px' }}>Frequency:</span>
          {(['ALL', 'Daily', 'Weekly', 'Monthly', 'Quarterly'] as const).map((f) => (
            <button key={f} onClick={() => setFreqFilter(f)} style={filterBtnStyle(freqFilter === f)}>
              {f === 'ALL' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#F5F6F8', borderBottom: '2px solid #E4E7EC' }}>
              {['Activity Type', 'Owner', 'Frequency', 'Last Completed', 'Next Due', 'Status', 'Action'].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    color: '#64748b',
                    fontWeight: 700,
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No activities match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => {
                const sc = statusConfig[row.status];
                const isOverdue = row.status === 'OVERDUE';
                return (
                  <tr
                    key={row.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: isOverdue ? 'rgba(239,68,68,0.02)' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = '#f0f5ff')}
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = isOverdue
                        ? 'rgba(239,68,68,0.02)'
                        : idx % 2 === 0
                        ? '#ffffff'
                        : '#fafafa')
                    }
                  >
                    {/* Activity Type */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{row.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0D2A66', fontSize: '13px' }}>{row.typeLabel}</div>
                          <div
                            style={{
                              fontSize: '10px',
                              background: 'rgba(13,42,102,0.06)',
                              color: '#475569',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              display: 'inline-block',
                              marginTop: '2px',
                            }}
                          >
                            {row.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Owner */}
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: 500 }}>{row.owner}</td>
                    {/* Frequency */}
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: 'rgba(13,42,102,0.06)',
                          color: '#0D2A66',
                        }}
                      >
                        {row.frequency}
                      </span>
                    </td>
                    {/* Last Completed */}
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '12px' }}>
                      {row.lastCompleted || '—'}
                    </td>
                    {/* Next Due */}
                    <td style={{ padding: '14px 20px', color: isOverdue ? '#dc2626' : '#334155', fontWeight: isOverdue ? 700 : 400, fontSize: '12px' }}>
                      {row.nextDue}
                      {isOverdue && <span style={{ marginLeft: '4px', fontSize: '10px' }}>⚠️</span>}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`,
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: sc.dot,
                            display: 'inline-block',
                          }}
                        />
                        {sc.label}
                      </span>
                    </td>
                    {/* Action */}
                    <td style={{ padding: '14px 20px' }}>
                      {row.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => onMarkComplete?.(row.id)}
                          style={{
                            background: '#0D2A66',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = '#F68B1F')}
                          onMouseOut={(e) => (e.currentTarget.style.background = '#0D2A66')}
                        >
                          Mark Done
                        </button>
                      ) : (
                        <span style={{ color: '#22c55e', fontWeight: 600, fontSize: '12px' }}>✓ Logged</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div style={{ padding: '12px 24px', borderTop: '1px solid #f1f5f9', background: '#F5F6F8' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          Showing {filtered.length} of {activities.length} activities
        </span>
      </div>
    </div>
  );
}
