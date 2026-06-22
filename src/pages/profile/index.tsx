import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
          fontSize: '18px',
          color: '#64748b',
        }}
      >
        No user profile found. Please sign in.
      </div>
    );
  }

  // Get initials for avatar (e.g. "Sahil Jaryal" -> "SJ")
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleLabel = (role: string) => {
    return role.replace('_', ' ');
  };

  return (
    <div
      style={{
        padding: '32px',
        maxWidth: '700px',
        margin: '40px auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
          overflow: 'hidden',
        }}
      >
        {/* Header background banner */}
        <div
          style={{
            height: '140px',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            position: 'relative',
          }}
        />

        <div style={{ padding: '32px', position: 'relative' }}>
          {/* Avatar circle overlapping the header banner */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              left: '32px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 800,
              border: '4px solid #ffffff',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          >
            {getInitials(user.name || 'User')}
          </div>

          <div style={{ marginTop: '50px' }}>
            <h2
              style={{ margin: '0 0 4px 0', color: '#1e3a8a', fontSize: '24px', fontWeight: 700 }}
            >
              {user.name}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  background: user.role === 'PLATFORM_ADMIN' ? '#f5e6f3' : '#eff6ff',
                  color: user.role === 'PLATFORM_ADMIN' ? '#8a3d78' : '#1e40af',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border:
                    user.role === 'PLATFORM_ADMIN' ? '1px solid #f3d0eb' : '1px solid #bfdbfe',
                }}
              >
                {getRoleLabel(user.role)}
              </span>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #a7f3d0',
                }}
              >
                Active Account
              </span>
            </div>

            <div
              style={{
                borderTop: '1px solid #f1f5f9',
                marginTop: '28px',
                paddingTop: '24px',
              }}
            >
              <h4
                style={{
                  margin: '0 0 16px 0',
                  color: '#334155',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              >
                Account Information
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    Email Address
                  </span>
                  <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 600 }}>
                    {user.email}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    User ID
                  </span>
                  <span style={{ color: '#475569', fontSize: '13px', fontFamily: 'monospace' }}>
                    {user.id}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr',
                    gap: '8px',
                    alignItems: 'start',
                  }}
                >
                  <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 500 }}>
                    Active Permissions
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {user.permissions && Object.keys(user.permissions).length > 0 ? (
                      Object.values(user.permissions)
                        .flat()
                        .map((perm) => (
                          <span
                            key={perm}
                            style={{
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              border: '1px solid #e2e8f0',
                            }}
                          >
                            {perm}
                          </span>
                        ))
                    ) : (
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {user.role === 'PLATFORM_ADMIN' ? 'ALL' : 'READ_ONLY'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                borderTop: '1px solid #f1f5f9',
                paddingTop: '24px',
              }}
            >
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
              >
                Go Back
              </button>
              <button
                onClick={() => navigate('/portfolio')}
                style={{
                  background: '#1e3a8a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#1e3a8a')}
              >
                Go to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
