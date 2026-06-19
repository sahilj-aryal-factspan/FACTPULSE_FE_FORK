import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import type { GovernanceRecord } from '../../store/data-store';

export default function GovernanceCenterPage() {
  const { governanceRecords, projects, accounts, completeGovernanceRecord, recalculateGovernance } =
    useDataStore();
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'WEEKLY_NOTE' | 'WBR' | 'MBR' | 'QBR'>(
    'ALL'
  );
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING' | 'OVERDUE'>(
    'ALL'
  );

  // Stats calculation
  const totalRecords = governanceRecords.length;
  const completedCount = governanceRecords.filter((r) => r.status === 'COMPLETED').length;
  const pendingCount = governanceRecords.filter((r) => r.status === 'PENDING').length;
  const overdueCount = governanceRecords.filter((r) => r.status === 'OVERDUE').length;

  const complianceRate = totalRecords > 0 ? Math.round((completedCount / totalRecords) * 100) : 0;

  // Filter logic
  const filteredRecords = governanceRecords.filter((r) => {
    const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const handleComplete = (id: string, projectId: string) => {
    completeGovernanceRecord(id, 'Marked complete in Governance console.');
    recalculateGovernance(projectId);
  };

  const getStatusColor = (status: GovernanceRecord['status']) => {
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
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '28px', fontWeight: 700 }}>
            Governance Control Center
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Consolidated review checklist and audit history logs
          </p>
        </div>
        <Link
          to="/governance/exceptions"
          style={{
            textDecoration: 'none',
            background: '#8a3d78',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#703061')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#8a3d78')}
        >
          ⚠️ View Exceptions Board
        </Link>
      </div>

      {/* Stats Summary Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Governance Records
          </div>
          <div style={{ color: '#1e3a8a', fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
            {totalRecords}
          </div>
        </div>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Completed Reviews
          </div>
          <div style={{ color: '#10b981', fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
            {completedCount}
          </div>
        </div>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Overdue Tasks
          </div>
          <div style={{ color: '#ef4444', fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
            {overdueCount}
          </div>
        </div>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            Total Compliance Rate
          </div>
          <div style={{ color: '#d97706', fontSize: '28px', fontWeight: 800, marginTop: '8px' }}>
            {complianceRate}%
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          marginBottom: '24px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            Activity Type:
          </span>
          {(['ALL', 'WEEKLY_NOTE', 'WBR', 'MBR', 'QBR'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setTypeFilter(opt)}
              style={{
                background: typeFilter === opt ? '#1e3a8a' : '#ffffff',
                color: typeFilter === opt ? '#ffffff' : '#475569',
                border: `1px solid ${typeFilter === opt ? '#1e3a8a' : '#cbd5e1'}`,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {opt.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Status:</span>
          {(['ALL', 'COMPLETED', 'PENDING', 'OVERDUE'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              style={{
                background: statusFilter === opt ? '#1e3a8a' : '#ffffff',
                color: statusFilter === opt ? '#ffffff' : '#475569',
                border: `1px solid ${statusFilter === opt ? '#1e3a8a' : '#cbd5e1'}`,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Checklist Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <table
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'left' }}
        >
          <thead>
            <tr
              style={{
                background: '#f8fafc',
                borderBottom: '2px solid #e2e8f0',
                color: '#64748b',
                fontWeight: 600,
              }}
            >
              <th style={{ padding: '16px 24px' }}>Review Checkpoint</th>
              <th style={{ padding: '16px 24px' }}>Project</th>
              <th style={{ padding: '16px 24px' }}>Account</th>
              <th style={{ padding: '16px 24px' }}>Due Date</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((r) => {
                const proj = projects.find((p) => p.id === r.projectId);
                const acc = accounts.find((a) => a.id === proj?.accountId);
                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: 600, color: '#1e3a8a' }}>{r.title}</div>
                      <span
                        style={{
                          fontSize: '10px',
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '1px 4px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        {r.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: '#1e293b' }}>
                      💻 {proj?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#1e293b' }}>
                      🏢 {acc?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#475569' }}>{r.dueDate}</td>
                    <td
                      style={{
                        padding: '16px 24px',
                        fontWeight: 600,
                        color: getStatusColor(r.status),
                      }}
                    >
                      ● {r.status}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      {r.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleComplete(r.id, r.projectId)}
                          style={{
                            background: '#34a853',
                            color: '#ffffff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Complete
                        </button>
                      ) : (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>✓ Logged</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No governance activities found matching filter constraints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
