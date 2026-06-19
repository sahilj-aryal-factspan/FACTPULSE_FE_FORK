import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function AccountsDirectoryPage() {
  const { accounts, projects } = useDataStore();
  const [search, setSearch] = useState('');
  const [ragFilter, setRagFilter] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');

  // Search & Filter Logic
  const filteredAccounts = accounts.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesRAG = ragFilter === 'ALL' || a.ragStatus === ragFilter;
    return matchesSearch && matchesRAG;
  });

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
            Accounts Directory
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Browse, search, and manage enterprise client portfolios
          </p>
        </div>
        <Link
          to="/accounts/new"
          style={{
            textDecoration: 'none',
            background: '#d97706',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e07613')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
        >
          + Create Account
        </Link>
      </div>

      {/* Filters & Search Area */}
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
        <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search accounts by name..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '12px',
              color: '#94a3b8',
              fontSize: '14px',
            }}
          >
            🔍
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>RAG Status:</span>
          {(['ALL', 'GREEN', 'AMBER', 'RED'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setRagFilter(opt)}
              style={{
                background: ragFilter === opt ? '#1e3a8a' : '#ffffff',
                color: ragFilter === opt ? '#ffffff' : '#475569',
                border: `1px solid ${ragFilter === opt ? '#1e3a8a' : '#cbd5e1'}`,
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table View */}
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
              <th style={{ padding: '16px 24px' }}>Account details</th>
              <th style={{ padding: '16px 24px' }}>RAG Status</th>
              <th style={{ padding: '16px 24px' }}>Governance Score</th>
              <th style={{ padding: '16px 24px' }}>Compliance Score</th>
              <th style={{ padding: '16px 24px' }}>Projects Count</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((a) => {
                const countProj = projects.filter((p) => p.accountId === a.id).length;
                return (
                  <tr
                    key={a.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {a.logoUrl ? (
                          <img
                            src={a.logoUrl}
                            alt={a.name}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              background: '#1e3a8a',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '12px',
                            }}
                          >
                            {a.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: '#1e3a8a' }}>{a.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          ...getRagBadgeStyle(a.ragStatus),
                        }}
                      >
                        {a.ragStatus}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#1e293b' }}>
                      {a.governanceScore}%
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 'bold', color: '#1e293b' }}>
                      {a.complianceScore}%
                    </td>
                    <td style={{ padding: '16px 24px', color: '#475569' }}>
                      🏢 {countProj} Active Project{countProj !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link
                          to={`/accounts/${a.id}`}
                          style={{
                            textDecoration: 'none',
                            background: '#1e3a8a',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          View
                        </Link>
                        <Link
                          to={`/accounts/${a.id}/edit`}
                          style={{
                            textDecoration: 'none',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            color: '#475569',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No accounts found matching search constraints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
