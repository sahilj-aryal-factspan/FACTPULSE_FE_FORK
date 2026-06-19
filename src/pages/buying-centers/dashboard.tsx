import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function BuyingCenterDashboardPage() {
  const { centerId } = useParams<{ centerId: string }>();
  const { buyingCenters, accounts, stakeholders, projects } = useDataStore();

  const center = buyingCenters.find((bc) => bc.id === centerId);
  if (!center) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Buying Center Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a', fontWeight: 600 }}>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const account = accounts.find((a) => a.id === center.accountId);
  const centerStakeholders = stakeholders.filter((s) => s.buyingCenterId === center.id);
  const accountProjects = projects.filter((p) => p.accountId === center.accountId);

  // Setup hierarchical mapping
  const rootStakeholders = centerStakeholders.filter((s) => !s.parentId);
  const getChildren = (parentId: string) =>
    centerStakeholders.filter((s) => s.parentId === parentId);

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

  const getSentimentColor = (sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE') => {
    switch (sentiment) {
      case 'POSITIVE':
        return '#34a853';
      case 'NEUTRAL':
        return '#d97706';
      case 'NEGATIVE':
        return '#ef4444';
    }
  };

  // Node renderer for stakeholder hierarchy
  const renderStakeholderNode = (s: (typeof stakeholders)[0], level: number = 0) => {
    const children = getChildren(s.id);
    const borderColor = getSentimentColor(s.sentiment);

    return (
      <div
        key={s.id}
        style={{ marginLeft: `${level * 24}px`, marginBottom: '16px', position: 'relative' }}
      >
        {level > 0 && (
          <div
            style={{
              position: 'absolute',
              left: '-16px',
              top: '-8px',
              width: '14px',
              height: '24px',
              borderLeft: '2px dashed #cbd5e1',
              borderBottom: '2px dashed #cbd5e1',
            }}
          />
        )}
        <div
          style={{
            background: '#ffffff',
            border: `1px solid #e2e8f0`,
            borderLeft: `4px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '500px',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '14px' }}>{s.name}</div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              {s.role} • {s.email}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              Last Connect: {s.lastConnectDate}
            </div>
            <div
              style={{ fontSize: '11px', fontWeight: 600, color: borderColor, marginTop: '2px' }}
            >
              {getSentimentEmoji(s.sentiment)}
            </div>
          </div>
        </div>

        {children.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            {children.map((child) => renderStakeholderNode(child, level + 1))}
          </div>
        )}
      </div>
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
        {account && (
          <>
            <Link
              to={`/accounts/${account.id}`}
              style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
            >
              {account.name}
            </Link>{' '}
            /
          </>
        )}
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          {center.name}
        </span>
      </div>

      {/* Main Grid Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Stakeholder Hierarchy */}
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
              marginBottom: '24px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
                Stakeholder Reporting Hierarchy
              </h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '12px' }}>
                Client organizational tree with active sentiment tracking
              </p>
            </div>
            <Link
              to={`/buying-centers/${center.id}/stakeholders`}
              style={{
                textDecoration: 'none',
                background: '#1e3a8a',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              Manage Stakeholders
            </Link>
          </div>

          <div style={{ padding: '8px 0' }}>
            {rootStakeholders.length > 0 ? (
              rootStakeholders.map((root) => renderStakeholderNode(root, 0))
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                No stakeholders configured for this buying center.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Buying Center Stats & Project Alignment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stats Card */}
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
              style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: 700 }}
            >
              Buying Center Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '13px' }}>Stakeholder Health</span>
                <span style={{ fontWeight: 'bold', color: '#1e3a8a', fontSize: '18px' }}>
                  {center.health}%
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <span style={{ color: '#64748b', fontSize: '13px' }}>Average Sentiment</span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: getSentimentColor(center.sentiment),
                    fontSize: '14px',
                  }}
                >
                  {getSentimentEmoji(center.sentiment)}
                </span>
              </div>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: '#64748b', fontSize: '13px' }}>Contacts Tracked</span>
                <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '14px' }}>
                  {centerStakeholders.length}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Projects */}
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
              style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '16px', fontWeight: 700 }}
            >
              Aligned Delivery Projects
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {accountProjects.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Compliance: {p.complianceRate}%
                    </div>
                  </div>
                  <Link
                    to={`/accounts/${p.accountId}/projects/${p.id}`}
                    style={{
                      textDecoration: 'none',
                      background: '#f1f5f9',
                      color: '#1e3a8a',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
