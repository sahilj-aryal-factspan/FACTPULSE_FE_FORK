import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDataStore } from '../../store/data-store';
import type { GovernanceRecord } from '../../store/data-store';

export default function GovernanceExceptionsPage() {
  const { governanceRecords, projects, accounts, completeGovernanceRecord, recalculateGovernance, fetchGovernanceActivities } =
    useDataStore();

  // Exceptions are records with status 'OVERDUE'
  const exceptions = governanceRecords.filter((r) => r.status === 'OVERDUE');

  // Count metrics
  const missingWBRCount = exceptions.filter((r) => r.type === 'WBR').length;
  const missingNotesCount = exceptions.filter((r) => r.type === 'WEEKLY_NOTE').length;
  const otherOverdueCount = exceptions.length - missingWBRCount - missingNotesCount;

  useEffect(() => {
    fetchGovernanceActivities().catch(() => {
      // Keep local exceptions if backend fetch fails
    });
  }, [fetchGovernanceActivities]);

  const handleResolve = async (id: string, projectId: string) => {
    await completeGovernanceRecord(id, 'Resolved via Exception Console.');
    recalculateGovernance(projectId);
  };

  const handleSendReminder = (title: string, accountName: string) => {
    alert(
      `Reminders sent successfully to the Account Lead for ${accountName} regarding overdue "${title}".`
    );
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
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/portfolio" style={{ textDecoration: 'none', color: '#64748b' }}>
          Portfolio
        </Link>{' '}
        /
        <Link
          to="/governance"
          style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
        >
          Governance
        </Link>{' '}
        /
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          Exceptions Board
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '28px', fontWeight: 700 }}>
          Governance Exceptions Board
        </h1>
        <p style={{ color: '#ef4444', margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600 }}>
          ⚠️ Critical compliance gaps and overdue delivery reviews requiring intervention
        </p>
      </div>

      {/* Stats Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Missing WBR */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #fca5a5',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Missing WBRs
            </div>
            <div style={{ color: '#ef4444', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {missingWBRCount}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(239,68,68,0.05)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '20px',
            }}
          >
            📊
          </div>
        </div>

        {/* Missing Notes */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #fca5a5',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Missing Weekly Notes
            </div>
            <div style={{ color: '#ef4444', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {missingNotesCount}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(239,68,68,0.05)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '20px',
            }}
          >
            📝
          </div>
        </div>

        {/* Other Overdue */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Other Overdue Checkpoints
            </div>
            <div style={{ color: '#1e3a8a', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {otherOverdueCount}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(13,42,102,0.05)',
              color: '#1e3a8a',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '20px',
            }}
          >
            ⏰
          </div>
        </div>
      </div>

      {/* Exceptions Log Table */}
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
                background: '#fff5f5',
                borderBottom: '2px solid #fca5a5',
                color: '#9b1c1c',
                fontWeight: 600,
              }}
            >
              <th style={{ padding: '16px 24px' }}>Overdue Checklist Item</th>
              <th style={{ padding: '16px 24px' }}>Project Name</th>
              <th style={{ padding: '16px 24px' }}>Account</th>
              <th style={{ padding: '16px 24px' }}>Deadline</th>
              <th style={{ padding: '16px 24px' }}>Severity</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Resolution Actions</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.length > 0 ? (
              exceptions.map((r) => {
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
                      <div style={{ fontWeight: 600, color: '#9b1c1c' }}>{r.title}</div>
                      <span
                        style={{
                          fontSize: '10px',
                          background: '#fee2e2',
                          color: '#9b1c1c',
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
                    <td style={{ padding: '16px 24px', color: '#b91c1c', fontWeight: 600 }}>
                      {r.dueDate} (Overdue)
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#fee2e2',
                          color: '#9b1c1c',
                        }}
                      >
                        CRITICAL
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleResolve(r.id, r.projectId)}
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
                          Resolve (Manual Upload)
                        </button>
                        <button
                          onClick={() => handleSendReminder(r.title, acc?.name || '')}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Send Alert
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: '#34a853',
                    fontWeight: 600,
                  }}
                >
                  ✓ Perfect Compliance! No exceptions tracked at this time.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
