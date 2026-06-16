import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import {
  LoginPage,
  LandingPage,
  PortfolioPage,
  AccountsPage,
  BuyingCentersPage,
  ProjectsPage,
  AIWorkspacePage,
} from './Lazyrout';

// Protected Route Guard Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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

// Layout Wrapper with Navbar
function Layout({ children }: { children: React.ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <header
        style={{
          background: '#0d2a66',
          color: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Link
          to="/portfolio"
          style={{
            textDecoration: 'none',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '20px',
            letterSpacing: '0.5px',
          }}
        >
          FACT<span style={{ color: '#f68b1f' }}>PULSE</span>
        </Link>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#e5e7eb' }}>
              {user.email}{' '}
              <span
                style={{
                  fontSize: '11px',
                  background: 'rgba(255,255,255,0.15)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginLeft: '6px',
                }}
              >
                {user.role}
              </span>
            </span>
            <button
              onClick={logout}
              style={{
                background: '#8a3d78',
                border: 'none',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#703061')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#8a3d78')}
            >
              Sign Out
            </button>
          </div>
        )}
      </header>
      <main style={{ flex: 1, background: '#f5f6f8', padding: '20px' }}>{children}</main>
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
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            fontFamily: 'sans-serif',
            color: '#0d2a66',
          }}
        >
          <h3>Loading page...</h3>
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
          path="/accounts/:accountId"
          element={
            <ProtectedRoute>
              <Layout>
                <AccountsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/buying-centers/:centerId"
          element={
            <ProtectedRoute>
              <Layout>
                <BuyingCentersPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/accounts/:accountId/projects/:projectId"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjectsPage />
              </Layout>
            </ProtectedRoute>
          }
        />

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

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
