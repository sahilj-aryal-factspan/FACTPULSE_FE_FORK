import { useState, useEffect } from 'react';
import api from '../../../api';
import { useAuthStore } from '../../../store/auth-store';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'PLATFORM_ADMIN' | 'EXECUTIVE_LEADERSHIP' | 'ACCOUNT_LEAD' | 'DELIVERY_LEAD';
  roleLabel: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function UserManagementPage() {
  const currentUser = useAuthStore((state) => state.user);

  // List states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<AdminUser['role']>('DELIVERY_LEAD');
  const [editIsActive, setEditIsActive] = useState(true);

  // Add states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminUser['role']>('DELIVERY_LEAD');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchUsers = async () => {
    await Promise.resolve();
    setLoading(true);
    setListError(null);
    try {
      const response = await api.get('/admin/users');
      if (response.data?.success && response.data?.data?.items) {
        setUsers(response.data.data.items);
      } else {
        setListError('Invalid response format from server');
      }
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      const apiError = err as { response?: { data?: { message?: string } } };
      setListError(apiError.response?.data?.message || 'Failed to load workspace users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setActionLoading(true);
    setActionError(null);
    try {
      const payload: { name: string; email: string; role: AdminUser['role']; password?: string } = {
        name,
        email,
        role,
      };
      if (password) {
        if (password.length < 8) {
          setActionError('Password must be at least 8 characters long');
          setActionLoading(false);
          return;
        }
        payload.password = password;
      }

      await api.post('/admin/users', payload);

      // Reset form and close modal
      setName('');
      setEmail('');
      setRole('DELIVERY_LEAD');
      setPassword('');
      setShowPassword(false);
      setIsAddModalOpen(false);

      // Refresh list
      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error creating user:', err);
      const apiError = err as { response?: { status?: number; data?: { message?: string } } };
      if (apiError.response?.status === 409) {
        setActionError('Conflict: A user with this email address already exists.');
      } else {
        setActionError(apiError.response?.data?.message || 'Failed to create user account');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (id: string) => {
    setListError(null);
    try {
      const payload = {
        name: editName,
        role: editRole,
        isActive: editIsActive,
      };
      await api.patch(`/admin/users/${id}`, payload);
      setEditingId(null);
      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      const apiError = err as { response?: { data?: { message?: string } } };
      setListError(apiError.response?.data?.message || 'Failed to update user');
    }
  };

  const startEdit = (user: AdminUser) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  const handleDelete = async (id: string, userName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`
      )
    ) {
      setListError(null);
      try {
        await api.delete(`/admin/users/${id}`);
        await fetchUsers();
      } catch (err: unknown) {
        console.error('Error deleting user:', err);
        const apiError = err as { response?: { data?: { message?: string } } };
        setListError(apiError.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return { background: '#f5e6f3', color: '#8a3d78' };
      case 'ACCOUNT_LEAD':
        return { background: '#eff6ff', color: '#1e40af' };
      case 'DELIVERY_LEAD':
        return { background: '#f0fdf4', color: '#166534' };
      case 'EXECUTIVE_LEADERSHIP':
        return { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' };
      default:
        return { background: '#f1f5f9', color: '#475569' };
    }
  };

  const getPermissionsByRole = (role: string): string[] => {
    switch (role) {
      case 'PLATFORM_ADMIN':
        return ['ALL'];
      case 'ACCOUNT_LEAD':
        return ['READ_WRITE', 'APPROVE'];
      case 'DELIVERY_LEAD':
        return ['READ_WRITE'];
      case 'EXECUTIVE_LEADERSHIP':
        return ['READ_ONLY'];
      default:
        return ['READ_ONLY'];
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
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

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
        <button
          onClick={() => {
            setActionError(null);
            setShowPassword(false);
            setIsAddModalOpen(true);
          }}
          style={{
            background: '#1e3a8a',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow:
              '0 4px 6px -1px rgba(30, 58, 138, 0.1), 0 2px 4px -1px rgba(30, 58, 138, 0.06)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#1e3a8a')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add User
        </button>
      </div>

      {listError && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{listError}</span>
          <button
            onClick={() => setListError(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#b91c1c',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            &times;
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        width: '24px',
                        height: '24px',
                        border: '3px solid rgba(30, 58, 138, 0.2)',
                        borderTop: '3px solid #1e3a8a',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span
                      style={{
                        marginLeft: '12px',
                        color: '#64748b',
                        fontSize: '14px',
                        verticalAlign: 'super',
                      }}
                    >
                      Loading users...
                    </span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}
                  >
                    No users found in the workspace.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = currentUser?.id === u.id || currentUser?.email === u.email;
                  const perms =
                    u.permissions && u.permissions.length > 0
                      ? u.permissions
                      : getPermissionsByRole(u.role);
                  return (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <td style={{ padding: '16px 8px' }}>
                        {editingId === u.id ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <input
                              type="text"
                              style={{
                                padding: '6px 10px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                width: '220px',
                                fontSize: '14px',
                              }}
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                            />
                            <label
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                marginTop: '2px',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
                                color: isSelf ? '#94a3b8' : '#475569',
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={editIsActive}
                                disabled={isSelf}
                                onChange={(e) => setEditIsActive(e.target.checked)}
                              />
                              Active Account {isSelf && '(Your account cannot be deactivated)'}
                            </label>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 600, color: '#1e293b' }}>{u.name}</span>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '2px 6px',
                                  borderRadius: '9999px',
                                  fontSize: '10px',
                                  fontWeight: 600,
                                  background: u.isActive ? '#ecfdf5' : '#f1f5f9',
                                  color: u.isActive ? '#059669' : '#64748b',
                                  border: u.isActive ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                                }}
                              >
                                {u.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {u.email}
                            </div>
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
                              background: '#ffffff',
                              fontSize: '14px',
                            }}
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as AdminUser['role'])}
                          >
                            <option value="PLATFORM_ADMIN">Platform Admin</option>
                            <option value="EXECUTIVE_LEADERSHIP">Executive Leadership</option>
                            <option value="ACCOUNT_LEAD">Account Lead</option>
                            <option value="DELIVERY_LEAD">Delivery Lead</option>
                          </select>
                        ) : (
                          <span
                            style={{
                              ...getRoleBadgeStyle(u.role),
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            {u.roleLabel || u.role.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {perms.map((p) => (
                            <span
                              key={p}
                              style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 500,
                                border: '1px solid #e2e8f0',
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
                                color: '#334155',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(u.id, u.name)}
                              disabled={isSelf}
                              title={isSelf ? 'You cannot delete your own account' : 'Delete user'}
                              style={{
                                background: 'transparent',
                                border: isSelf ? '1px solid #e2e8f0' : '1px solid #fca5a5',
                                color: isSelf ? '#94a3b8' : '#ef4444',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: isSelf ? 'not-allowed' : 'pointer',
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {isAddModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => {
            setIsAddModalOpen(false);
            setShowPassword(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              width: '100%',
              maxWidth: '480px',
              position: 'relative',
              animation: 'slideUp 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '20px', fontWeight: 700 }}>
                Create New User
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setShowPassword(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdd}>
              {actionError && (
                <div
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '13px',
                  }}
                >
                  {actionError}
                </div>
              )}

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
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Platform Role
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                  value={role}
                  onChange={(e) => setRole(e.target.value as AdminUser['role'])}
                >
                  <option value="PLATFORM_ADMIN">Platform Admin</option>
                  <option value="EXECUTIVE_LEADERSHIP">Executive Leadership</option>
                  <option value="ACCOUNT_LEAD">Account Lead</option>
                  <option value="DELIVERY_LEAD">Delivery Lead</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#334155',
                  }}
                >
                  Password <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min 8 characters"
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        style={{ width: '18px', height: '18px' }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        style={{ width: '18px', height: '18px' }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  If omitted, a random temporary password is generated and hashed automatically.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setShowPassword(false);
                  }}
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    background: '#1e3a8a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px',
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                >
                  {actionLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
