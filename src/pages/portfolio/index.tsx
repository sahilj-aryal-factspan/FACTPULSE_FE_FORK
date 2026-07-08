import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function PortfolioPage() {
  const { accounts, projects, aiExecutiveDigest } = useDataStore();

  const totalAccounts = accounts.length;
  const criticalAccountsCount = accounts.filter((a) => a.ragStatus === 'RED').length;

  // Calculate averages
  const avgHealthScore = totalAccounts > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.healthScore, 0) / totalAccounts) : 0;
  const avgDeliveryScore = totalAccounts > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.deliveryScore, 0) / totalAccounts) : 0;
  const avgGovScore = totalAccounts > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.governanceScore, 0) / totalAccounts) : 0;
  const avgCustomerScore = totalAccounts > 0 ? Math.round(accounts.reduce((sum, a) => sum + a.customerScore, 0) / totalAccounts) : 0;

  // Visual styling for RAG status
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
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '28px', fontWeight: 700 }}>
          Portfolio Command Center
        </h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
          Real-time compliance, risk posture, and delivery governance overview
        </p>
      </div>

      {/* AI Executive Digest banner */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(13,42,102,0.03) 0%, rgba(138,61,120,0.03) 100%)',
          border: '1px solid #e2e8f0',
          borderLeft: '5px solid #8a3d78',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              color: '#8a3d78',
              fontWeight: 'bold',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            ⚡ AI Executive Digest
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Generated dynamically</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#334155', fontWeight: 500 }}>
          {aiExecutiveDigest}
        </p>
      </div>

      {/* Key Stats Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {/* Total Accounts */}
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
                letterSpacing: '0.5px',
              }}
            >
              Accounts Managed
            </div>
            <div style={{ color: '#1e3a8a', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {totalAccounts}
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
            🏢
          </div>
        </div>

        {/* Avg Governance Score */}
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
                letterSpacing: '0.5px',
              }}
            >
              Average Health
            </div>
            <div style={{ color: '#1e3a8a', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {avgHealthScore}%
            </div>
          </div>
          {/* Radial progress ring mock */}
          <div
            style={{
              position: 'relative',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ transform: 'rotate(-90deg)', width: '48px', height: '48px' }}>
              <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#d97706"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * avgHealthScore) / 100}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#334155',
              }}
            >
              {avgHealthScore}%
            </span>
          </div>
        </div>

        {/* Health Score */}
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
                letterSpacing: '0.5px',
              }}
            >
              Delivery Compliance
            </div>
            <div style={{ color: '#1e3a8a', fontSize: '32px', fontWeight: 800, marginTop: '8px' }}>
              {avgDeliveryScore}%
            </div>
          </div>
          <div
            style={{
              background: 'rgba(52,168,83,0.05)',
              color: '#34a853',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '20px',
            }}
          >
            ✓
          </div>
        </div>

        {/* Critical Accounts */}
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
                letterSpacing: '0.5px',
              }}
            >
              Critical Alerts
            </div>
            <div
              style={{
                color: criticalAccountsCount > 0 ? '#ef4444' : '#1e3a8a',
                fontSize: '32px',
                fontWeight: 800,
                marginTop: '8px',
              }}
            >
              {criticalAccountsCount}
            </div>
          </div>
          <div
            style={{
              background:
                criticalAccountsCount > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(13,42,102,0.05)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '20px',
            }}
          >
            ⚠️
          </div>
        </div>
      </div>

      {/* Account Cards Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
          Enterprise Accounts Directory
        </h3>
        <Link
          to="/accounts"
          style={{
            textDecoration: 'none',
            color: '#d97706',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View Full Directory →
        </Link>
      </div>

      {/* Accounts Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {accounts.map((a) => {
          const accountProjects = projects.filter((p) => p.accountId === a.id);
          return (
            <div
              key={a.id}
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {a.logoUrl ? (
                      <img
                        src={a.logoUrl}
                        alt={a.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: '#1e3a8a',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                        }}
                      >
                        {a.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <h4 style={{ margin: 0, fontSize: '18px', color: '#1e3a8a', fontWeight: 700 }}>
                      {a.name}
                    </h4>
                  </div>
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
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Governance compliance bar */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '4px',
                      }}
                    >
                      <span>Health score</span>
                      <span style={{ fontWeight: 'bold', color: '#334155' }}>
                        {a.healthScore}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${a.healthScore}%`,
                          height: '100%',
                          background: '#1e3a8a',
                          borderRadius: '3px',
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Compliance rate bar */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#64748b',
                        marginBottom: '4px',
                      }}
                    >
                      <span>Delivery score</span>
                      <span style={{ fontWeight: 'bold', color: '#334155' }}>
                        {a.deliveryScore}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: '#f1f5f9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${a.deliveryScore}%`,
                          height: '100%',
                          background: '#d97706',
                          borderRadius: '3px',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    marginBottom: '16px',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px',
                  }}
                >
                  📌 {accountProjects.length} Active Project
                  {accountProjects.length !== 1 ? 's' : ''}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/accounts/${a.id}`}
                    style={{
                      flex: 1,
                      textDecoration: 'none',
                      textAlign: 'center',
                      background: '#1e3a8a',
                      color: '#ffffff',
                      padding: '10px 0',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0b204e')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
                  >
                    Enter Command
                  </Link>
                  <Link
                    to={`/accounts/${a.id}/edit`}
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
