import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function AccountDashboardPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts, projects, buyingCenters, stakeholders } = useDataStore();

  const account = accounts.find((a) => a.id === accountId);
  if (!account) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Account Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a', fontWeight: 600 }}>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  // Related Entities
  const accountProjects = projects.filter((p) => p.accountId === account.id);
  const accountCenters = buyingCenters.filter((bc) => bc.accountId === account.id);

  const centerIds = accountCenters.map((bc) => bc.id);
  const accountStakeholders = stakeholders.filter((s) => centerIds.includes(s.buyingCenterId));

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

  const getSentimentEmoji = (sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE') => {
    switch (sentiment) {
      case 'POSITIVE':
        return '🟢 Positive';
      case 'NEUTRAL':
        return '🟡 Neutral';
      case 'NEGATIVE':
        return '🔴 Negative';
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
      {/* Breadcrumb Header */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/portfolio" style={{ textDecoration: 'none', color: '#64748b' }}>
          Portfolio
        </Link>{' '}
        /
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          {account.name}
        </span>
      </div>

      {/* Account Overview Header Card */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {account.logoUrl ? (
            <img
              src={account.logoUrl}
              alt={account.name}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1px solid #e2e8f0',
              }}
            />
          ) : (
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '10px',
                background: '#1e3a8a',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px',
              }}
            >
              {account.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '24px', fontWeight: 700 }}>
                {account.name}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  ...getRagBadgeStyle(account.ragStatus),
                }}
              >
                {account.ragStatus}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
              ID: {account.id} • Corporate Governance Health Center
            </p>
          </div>
        </div>

        {/* Scores */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Governance
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>
              {account.governanceScore}%
            </div>
          </div>
          <div style={{ borderLeft: '1px solid #e2e8f0', height: '32px' }} />
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Compliance
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
              {account.complianceScore}%
            </div>
          </div>
          <Link
            to={`/accounts/${account.id}/edit`}
            style={{
              textDecoration: 'none',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Grid: Projects (Left) vs Buying Centers / Stakeholders (Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 450px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Projects */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
              Projects Portfolio
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {accountProjects.length} Total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {accountProjects.map((p) => (
              <div
                key={p.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '15px' }}>
                    {p.name}
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}
                  >
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Status: {p.status}</span>
                    <span
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: '#64748b',
                      }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Health: {p.health}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Compliance</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
                      {p.complianceRate}%
                    </div>
                  </div>
                  <Link
                    to={`/accounts/${account.id}/projects/${p.id}`}
                    style={{
                      textDecoration: 'none',
                      background: '#f1f5f9',
                      color: '#1e3a8a',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Buying Centers & Stakeholders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Buying Centers Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3
              style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}
            >
              Buying Centers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accountCenters.map((bc) => (
                <Link
                  key={bc.id}
                  to={`/buying-centers/${bc.id}`}
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#1e3a8a';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                      {bc.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Sentiment: {bc.sentiment}
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e3a8a' }}>
                    {bc.health}% Health
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stakeholders Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
                Key Stakeholders
              </h3>
              {accountCenters.length > 0 && (
                <Link
                  to={`/buying-centers/${accountCenters[0].id}/stakeholders`}
                  style={{
                    textDecoration: 'none',
                    color: '#d97706',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  + Add Contact
                </Link>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accountStakeholders.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f1f5f9',
                    paddingBottom: '10px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
                      {s.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{s.role}</div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                    }}
                  >
                    {getSentimentEmoji(s.sentiment)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
