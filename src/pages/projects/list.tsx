import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import { useAuthStore } from '../../store/auth-store';

export default function ProjectsListPage() {
  const { projects, accounts } = useDataStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED'>('ALL');
  const [healthFilter, setHealthFilter] = useState<'ALL' | 'GREEN' | 'AMBER' | 'RED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'CUSTOMER_MANAGED' | 'INTERNAL_TEAM_MANAGED'>('ALL');

  const user = useAuthStore((state) => state.user);
  const canCreateProject = user && ['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD'].includes(user.role);

  const filteredProjects = projects.filter((p) => {
    const account = accounts.find((a) => a.id === p.accountId);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (account?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesHealth = healthFilter === 'ALL' || p.health === healthFilter;
    const matchesType = typeFilter === 'ALL' || p.projectType === typeFilter;

    return matchesSearch && matchesStatus && matchesHealth && matchesType;
  });

  const getHealthBadgeStyle = (health: 'GREEN' | 'AMBER' | 'RED') => {
    switch (health) {
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
            All Projects
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Track compliance rates and active checkpoints across delivery streams
          </p>
        </div>
        {canCreateProject && (
          <Link
            to="/projects/new"
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
            + Create Project
          </Link>
        )}
      </div>

      {/* Filter Toolbar */}
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
        {/* Search */}
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search projects or accounts..."
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

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Status:</span>
          {(['ALL', 'ACTIVE', 'ARCHIVED'] as const).map((opt) => (
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
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Health Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Health:</span>
          {(['ALL', 'GREEN', 'AMBER', 'RED'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setHealthFilter(opt)}
              style={{
                background: healthFilter === opt ? '#1e3a8a' : '#ffffff',
                color: healthFilter === opt ? '#ffffff' : '#475569',
                border: `1px solid ${healthFilter === opt ? '#1e3a8a' : '#cbd5e1'}`,
                padding: '6px 12px',
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

        {/* Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Type:</span>
          {([
            { value: 'ALL', label: 'ALL' },
            { value: 'CUSTOMER_MANAGED', label: 'Customer' },
            { value: 'INTERNAL_TEAM_MANAGED', label: 'Internal' }
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              style={{
                background: typeFilter === opt.value ? '#1e3a8a' : '#ffffff',
                color: typeFilter === opt.value ? '#ffffff' : '#475569',
                border: `1px solid ${typeFilter === opt.value ? '#1e3a8a' : '#cbd5e1'}`,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Directory Table */}
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
              <th style={{ padding: '16px 24px' }}>Project Name</th>
              <th style={{ padding: '16px 24px' }}>Account</th>
              <th style={{ padding: '16px 24px' }}>Management Type</th>
              <th style={{ padding: '16px 24px' }}>Health</th>
              <th style={{ padding: '16px 24px' }}>Status</th>
              <th style={{ padding: '16px 24px' }}>Compliance Rate</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((p) => {
                const account = accounts.find((a) => a.id === p.accountId);
                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <td style={{ padding: '16px 24px', fontWeight: 600, color: '#1e3a8a' }}>
                      <div>{p.name}</div>
                      {p.lead && (
                        <div style={{ fontSize: '11px', color: '#475569', fontWeight: 500, marginTop: '4px' }}>
                          👤 Lead: {p.lead}
                        </div>
                      )}
                      {p.details && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'normal', marginTop: '4px', maxWidth: '400px', lineHeight: '1.3' }}>
                          {p.details}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', color: '#1e293b' }}>
                      🏢 {account?.name || 'Unknown'}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          color: p.projectType === 'INTERNAL_TEAM_MANAGED' ? '#1e3a8a' : '#475569',
                          background: p.projectType === 'INTERNAL_TEAM_MANAGED' ? '#eff6ff' : '#f1f5f9',
                          border: p.projectType === 'INTERNAL_TEAM_MANAGED' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.projectType === 'INTERNAL_TEAM_MANAGED' ? 'Internal Team Managed' : 'Customer Managed'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          ...getHealthBadgeStyle(p.health),
                        }}
                      >
                        {p.health}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          textTransform: 'lowercase',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '100px',
                            height: '6px',
                            background: '#f1f5f9',
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${p.complianceRate}%`,
                              height: '100%',
                              background: '#1e3a8a',
                              borderRadius: '3px',
                            }}
                          ></div>
                        </div>
                        <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>
                          {p.complianceRate}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <Link
                        to={`/accounts/${p.accountId}/projects/${p.id}`}
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
                        Manage
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                  No projects found matching search constraints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
