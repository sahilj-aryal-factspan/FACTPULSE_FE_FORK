import { useState } from 'react';
import { useDataStore } from '../../../store/data-store';
import type { User } from '../../../store/data-store';

export default function UserManagementPage() {
  const { users, addUser, updateUser, deleteUser } = useDataStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<User['role']>('DELIVERY_LEAD');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<User['role']>('DELIVERY_LEAD');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // Assign mock permissions based on role
    let permissions = ['READ_ONLY'];
    if (role === 'PLATFORM_ADMIN') permissions = ['ALL'];
    else if (role === 'ACCOUNT_LEAD') permissions = ['READ_WRITE', 'APPROVE'];
    else if (role === 'DELIVERY_LEAD') permissions = ['READ_WRITE'];

    addUser({ name, email, role, permissions });
    setName('');
    setEmail('');
    setRole('DELIVERY_LEAD');
  };

  const handleSaveEdit = (id: string) => {
    updateUser(id, { name: editName, role: editRole });
    setEditingId(null);
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '28px', fontWeight: 700 }}>
            User Management
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Manage users, roles, and platform permissions
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        {/* Users List Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px' }}>
            Active Workspace Users
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr
                style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}
              >
                <th style={{ padding: '12px 8px' }}>User Details</th>
                <th style={{ padding: '12px 8px' }}>System Role</th>
                <th style={{ padding: '12px 8px' }}>Permissions</th>
                <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}
                >
                  <td style={{ padding: '16px 8px' }}>
                    {editingId === u.id ? (
                      <input
                        type="text"
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          width: '180px',
                        }}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    {editingId === u.id ? (
                      <select
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                        }}
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as any)}
                      >
                        <option value="PLATFORM_ADMIN">Platform Admin</option>
                        <option value="EXECUTIVE_LEADERSHIP">Executive Leadership</option>
                        <option value="ACCOUNT_LEAD">Account Lead</option>
                        <option value="DELIVERY_LEAD">Delivery Lead</option>
                      </select>
                    ) : (
                      <span
                        style={{
                          background: u.role === 'PLATFORM_ADMIN' ? '#f5e6f3' : '#f0f5ff',
                          color: u.role === 'PLATFORM_ADMIN' ? '#8a3d78' : '#1e3a8a',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.permissions.map((p) => (
                        <span
                          key={p}
                          style={{
                            background: '#f1f5f9',
                            color: '#475569',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 500,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                    {editingId === u.id ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleSaveEdit(u.id)}
                          style={{
                            background: '#34a853',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
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
                            background: '#64748b',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => startEdit(u)}
                          style={{
                            background: 'transparent',
                            border: '1px solid #cbd5e1',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          disabled={users.length <= 1} // Do not delete last user
                          style={{
                            background: 'transparent',
                            border: '1px solid #fca5a5',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Card */}
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
          <h3 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '18px' }}>Create User</h3>
          <form onSubmit={handleAdd}>
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '6px',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: '#334155',
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="john.doe@factspan.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

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
                Platform Role
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="PLATFORM_ADMIN">Platform Admin</option>
                <option value="EXECUTIVE_LEADERSHIP">Executive Leadership</option>
                <option value="ACCOUNT_LEAD">Account Lead</option>
                <option value="DELIVERY_LEAD">Delivery Lead</option>
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
                fontSize: '14px',
                transition: 'background-color 0.2s',
              }}
            >
              Add User Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
