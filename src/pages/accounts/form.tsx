import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function AccountFormPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const { accounts, addAccount, updateAccount } = useDataStore();

  const isEdit = !!accountId;
  const account = accounts.find((a) => a.id === accountId);

  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [ragStatus, setRagStatus] = useState<'GREEN' | 'AMBER' | 'RED'>('GREEN');
  const [govScore, setGovScore] = useState(100);
  const [compScore, setCompScore] = useState(100);

  useEffect(() => {
    if (isEdit && account) {
      setName(account.name);
      setLogoUrl(account.logoUrl || '');
      setRagStatus(account.ragStatus);
      setGovScore(account.governanceScore);
      setCompScore(account.complianceScore);
    }
  }, [isEdit, account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (isEdit && accountId) {
      updateAccount(accountId, {
        name,
        logoUrl: logoUrl || undefined,
        ragStatus,
        governanceScore: Number(govScore),
        complianceScore: Number(compScore),
      });
      navigate(`/accounts/${accountId}`);
    } else {
      addAccount({ name, logoUrl: logoUrl || undefined });
      navigate('/accounts');
    }
  };

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/accounts" style={{ textDecoration: 'none', color: '#64748b' }}>
          Accounts
        </Link>{' '}
        /
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          {isEdit ? `Edit ${account?.name}` : 'Create Account'}
        </span>
      </div>

      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ color: '#1e3a8a', margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>
          {isEdit ? 'Modify Account Details' : 'Initialize New Account'}
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>
          {isEdit
            ? 'Modify governance records and visual configurations'
            : 'Register a new enterprise client to the command workspace'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Account Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#334155',
              }}
            >
              Account Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CVS Pharmacy"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Logo URL */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '13px',
                color: '#334155',
              }}
            >
              Logo Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>

          {isEdit && (
            <>
              {/* RAG Status */}
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#334155',
                  }}
                >
                  RAG Status
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  value={ragStatus}
                  onChange={(e) => setRagStatus(e.target.value as any)}
                >
                  <option value="GREEN">GREEN (Compliance Met)</option>
                  <option value="AMBER">AMBER (Under Review)</option>
                  <option value="RED">RED (Critical Intervention)</option>
                </select>
              </div>

              {/* Governance & Compliance Scores */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#334155',
                    }}
                  >
                    Governance Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    value={govScore}
                    onChange={(e) => setGovScore(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: 600,
                      fontSize: '13px',
                      color: '#334155',
                    }}
                  >
                    Compliance Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    value={compScore}
                    onChange={(e) => setCompScore(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0b204e')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e3a8a')}
            >
              {isEdit ? 'Save Changes' : 'Initialize Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate(isEdit ? `/accounts/${accountId}` : '/accounts')}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#475569',
                padding: '12px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
