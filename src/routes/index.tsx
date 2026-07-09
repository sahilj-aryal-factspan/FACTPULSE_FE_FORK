import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import {
  LoginPage,
  LandingPage,
  PortfolioPage,
  AccountsDirectoryPage,
  AccountDashboardPage,
  AccountFormPage,
  BuyingCenterDashboardPage,
  StakeholderManagementPage,
  ProjectsListPage,
  ProjectDashboardPage,
  ProjectFormPage,
  GovernanceCenterPage,
  GovernanceExceptionsPage,
  ArtifactUploadPage,
  AIProcessingPage,
  AIWorkspacePage,
  UserManagementPage,
} from './Lazyrout';

// Role-Based Protected Route Guard Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: ('PLATFORM_ADMIN' | 'EXECUTIVE_LEADERSHIP' | 'ACCOUNT_LEAD' | 'DELIVERY_LEAD')[];
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user's role is not in the allowed roles, redirect to home page (/portfolio)
    return <Navigate to="/portfolio" replace />;
  }

  return <>{children}</>;
}

// Public-Only Route Guard (redirects authenticated users to /portfolio)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/portfolio" replace />;
  }
  return <>{children}</>;
}

// Layout Wrapper with Responsive Premium Navigation Header
function Layout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const isLinkActive = (path: string) => {
    const isProjectRoute = location.pathname.startsWith('/projects') || location.pathname.includes('/projects');
    const isAccountOrBCRoute =
      (location.pathname.startsWith('/accounts') && !isProjectRoute) ||
      location.pathname.startsWith('/buying-centers');

    if (path === '/portfolio' && location.pathname === '/portfolio') return true;
    if (path === '/accounts' && isAccountOrBCRoute) return true;
    if (path === '/projects' && isProjectRoute) return true;
    if (path === '/governance' && location.pathname.startsWith('/governance')) return true;
    if (path === '/ai-workspace' && location.pathname.startsWith('/ai-workspace')) return true;
    if (path === '/admin' && location.pathname.startsWith('/admin')) return true;
    return false;
  };

  const navItemStyle = (path: string) => ({
    textDecoration: 'none',
    color: isLinkActive(path) ? '#d97706' : '#ffffff',
    fontWeight: isLinkActive(path) ? 'bold' : 'normal',
    fontSize: '14px',
    transition: 'color 0.2s',
    borderBottom: isLinkActive(path) ? '2px solid #d97706' : '2px solid transparent',
    paddingBottom: '4px',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <header
        style={{
          background: '#1e3a8a',
          color: '#ffffff',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/portfolio"
            style={{
              textDecoration: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '22px',
              letterSpacing: '0.75px',
            }}
          >
            FACT<span style={{ color: '#d97706' }}>PULSE</span>
          </Link>

          {user && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {(!user.tabsToShow || user.tabsToShow.includes('/portfolio')) && (
                <Link to="/portfolio" style={navItemStyle('/portfolio')}>
                  Portfolio
                </Link>
              )}
              {(!user.tabsToShow || user.tabsToShow.includes('/accounts')) && (
                <Link to="/accounts" style={navItemStyle('/accounts')}>
                  Accounts
                </Link>
              )}
              {(!user.tabsToShow || user.tabsToShow.includes('/projects')) && (
                <Link to="/projects" style={navItemStyle('/projects')}>
                  Projects
                </Link>
              )}
              {(!user.tabsToShow || user.tabsToShow.includes('/governance')) && (
                <Link to="/governance" style={navItemStyle('/governance')}>
                  Governance
                </Link>
              )}
              {(!user.tabsToShow || user.tabsToShow.includes('/ai-workspace')) && (
                <Link to="/ai-workspace" style={navItemStyle('/ai-workspace')}>
                  AI Workspace
                </Link>
              )}
              {user.role === 'PLATFORM_ADMIN' &&
                (!user.tabsToShow ||
                  user.tabsToShow.includes('/admin') ||
                  user.tabsToShow.includes('/admin/users')) && (
                  <Link to="/admin/users" style={navItemStyle('/admin')}>
                    Users (Admin)
                  </Link>
                )}
            </nav>
          )}
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f3f4f6' }}>
                {user.name}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  background:
                    user.role === 'PLATFORM_ADMIN' ? '#8a3d78' : 'rgba(246, 139, 31, 0.2)',
                  color: user.role === 'PLATFORM_ADMIN' ? '#ffffff' : '#d97706',
                  border: `1px solid ${user.role === 'PLATFORM_ADMIN' ? '#8a3d78' : '#d97706'}`,
                  padding: '1px 6px',
                  borderRadius: '12px',
                  marginTop: '2px',
                  fontWeight: 700,
                }}
              >
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <button
              onClick={logout}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Sign Out
            </button>
          </div>
        )}
      </header>
      <main style={{ flex: 1, background: '#f5f6f8', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'Inter, system-ui, sans-serif',
            color: '#1e3a8a',
            background: '#f5f6f8',
          }}
        >
          <div
            style={{
              border: '4px solid rgba(13, 42, 102, 0.1)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              borderLeftColor: '#1e3a8a',
              animation: 'spin 1s linear infinite',
              marginBottom: '16px',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <h4 style={{ margin: 0, fontWeight: 600 }}>Loading Fact+Pulse...</h4>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <LandingPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        {/* Protected Routes */}

        {/* Admin / User Management */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN']}>
              <Layout>
                <UserManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Portfolio */}
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Layout>
                <PortfolioPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountsDirectoryPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Account Module */}
        <Route
          path="/accounts/new"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <AccountFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId/edit"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <AccountFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Buying Center Module */}
        <Route
          path="/buying-centers/:centerId"
          element={
            <ProtectedRoute>
              <Layout>
                <BuyingCenterDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/buying-centers/:centerId/stakeholders"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <StakeholderManagementPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Project Module */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectsListPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/new"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <ProjectFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId/projects/new"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <ProjectFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId/projects/:projectId"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectDashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId/projects/:projectId/edit"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <ProjectFormPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Governance Module */}
        <Route
          path="/governance"
          element={
            <ProtectedRoute>
              <Layout>
                <GovernanceCenterPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/governance/exceptions"
          element={
            <ProtectedRoute>
              <Layout>
                <GovernanceExceptionsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* AI Workspace */}
        <Route
          path="/ai-workspace"
          element={
            <ProtectedRoute>
              <Layout>
                <AIWorkspacePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-workspace/upload"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <ArtifactUploadPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-workspace/processing"
          element={
            <ProtectedRoute allowedRoles={['PLATFORM_ADMIN', 'ACCOUNT_LEAD', 'DELIVERY_LEAD']}>
              <Layout>
                <AIProcessingPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
