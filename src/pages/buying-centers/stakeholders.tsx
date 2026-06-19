import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import type { Stakeholder } from '../../store/data-store';

export default function StakeholderManagementPage() {
  const { centerId } = useParams<{ centerId: string }>();
  const { buyingCenters, stakeholders, addStakeholder, updateStakeholder, deleteStakeholder } =
    useDataStore();

  const center = buyingCenters.find((bc) => bc.id === centerId);
  const centerStakeholders = stakeholders.filter((s) => s.buyingCenterId === centerId);

  // Form State for creating
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [sentiment, setSentiment] = useState<Stakeholder['sentiment']>('NEUTRAL');
  const [parentId, setParentId] = useState('');

  // Form State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSentiment, setEditSentiment] = useState<Stakeholder['sentiment']>('NEUTRAL');
  const [editParentId, setEditParentId] = useState('');

  if (!center) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: '#ef4444' }}>Buying Center Not Found</h3>
        <Link to="/portfolio" style={{ color: '#1e3a8a' }}>
          Back to Portfolio
        </Link>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email) return;

    addStakeholder({
      buyingCenterId: center.id,
      name,
      role,
      email,
      sentiment,
      lastConnectDate: new Date().toISOString().substring(0, 10),
      nextScheduledConnect: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .substring(0, 10),
      parentId: parentId || undefined,
    });

    setName('');
    setRole('');
    setEmail('');
    setSentiment('NEUTRAL');
    setParentId('');
  };

  const handleSaveEdit = (id: string) => {
    updateStakeholder(id, {
      name: editName,
      role: editRole,
      email: editEmail,
      sentiment: editSentiment,
      parentId: editParentId || undefined,
    });
    setEditingId(null);
  };

  const startEdit = (s: Stakeholder) => {
    setEditingId(s.id);
    setEditName(s.name);
    setEditRole(s.role);
    setEditEmail(s.email);
    setEditSentiment(s.sentiment);
    setEditParentId(s.parentId || '');
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
          to={`/buying-centers/${center.id}`}
          style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
        >
          {center.name}
        </Link>{' '}
        /
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          Manage Stakeholders
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Stakeholders List */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
            Client Contacts Registry
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {centerStakeholders.map((s) => (
              <div
                key={s.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  backgroundColor: editingId === s.id ? '#f8fafc' : 'transparent',
                }}
              >
                {editingId === s.id ? (
                  /* Editing Mode */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '4px',
                          }}
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '4px',
                          }}
                        >
                          Role
                        </label>
                        <input
                          type="text"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '4px',
                          }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#64748b',
                            marginBottom: '4px',
                          }}
                        >
                          Sentiment
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '6px 10px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '4px',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                          value={editSentiment}
                          onChange={(e) => setEditSentiment(e.target.value as any)}
                        >
                          <option value="POSITIVE">🟢 Positive</option>
                          <option value="NEUTRAL">🟡 Neutral</option>
                          <option value="NEGATIVE">🔴 Negative</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#64748b',
                          marginBottom: '4px',
                        }}
                      >
                        Reports To Parent
                      </label>
                      <select
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                        value={editParentId}
                        onChange={(e) => setEditParentId(e.target.value)}
                      >
                        <option value="">(None - Top Level Node)</option>
                        {centerStakeholders
                          .filter((st) => st.id !== s.id) // Cannot report to self
                          .map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.role})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'flex-end',
                        marginTop: '8px',
                      }}
                    >
                      <button
                        onClick={() => handleSaveEdit(s.id)}
                        style={{
                          background: '#1e3a8a',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          background: '#e2e8f0',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Viewing Mode */
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e3a8a', fontSize: '15px' }}>
                        {s.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        {s.role} • {s.email}
                      </div>
                      {s.parentId && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#8a3d78',
                            marginTop: '4px',
                            fontWeight: 500,
                          }}
                        >
                          ↳ Reports to:{' '}
                          {centerStakeholders.find((p) => p.id === s.parentId)?.name || 'Unknown'}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        style={{
                          background:
                            s.sentiment === 'POSITIVE'
                              ? '#def7ec'
                              : s.sentiment === 'NEUTRAL'
                                ? '#fef3c7'
                                : '#fde8e8',
                          color:
                            s.sentiment === 'POSITIVE'
                              ? '#03543f'
                              : s.sentiment === 'NEUTRAL'
                                ? '#92400e'
                                : '#9b1c1c',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {s.sentiment}
                      </span>
                      <button
                        onClick={() => startEdit(s)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #cbd5e1',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStakeholder(s.id)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #fca5a5',
                          color: '#ef4444',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add Stakeholder Form */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            height: 'fit-content',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
            Add Stakeholder
          </h3>
          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#334155',
                }}
              >
                Contact Name
              </label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#334155',
                }}
              >
                Designation / Role
              </label>
              <input
                type="text"
                required
                placeholder="e.g. VP Operations"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#334155',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="jane@cvs.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#334155',
                }}
              >
                Initial Sentiment
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as any)}
              >
                <option value="POSITIVE">🟢 Positive</option>
                <option value="NEUTRAL">🟡 Neutral</option>
                <option value="NEGATIVE">🔴 Negative</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#334155',
                }}
              >
                Reporting Parent
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">(None - Top Level Node)</option>
                {centerStakeholders.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: '#1e3a8a',
                color: '#ffffff',
                border: 'none',
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Add Stakeholder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
