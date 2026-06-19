import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { useUIStore } from './store/ui-store';
import { useAuthStore } from './store/auth-store';

function App() {
  const theme = useUIStore((state) => state.theme);
  const checkMe = useAuthStore((state) => state.checkMe);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      await checkMe();
      setInitializing(false);
    };
    initAuth();
  }, [checkMe]);

  if (initializing) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: '#1e3a8a',
          background: '#f3f4f6',
        }}
      >
        <div
          style={{
            border: '4px solid rgba(30, 58, 138, 0.1)',
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
        <h4 style={{ margin: 0, fontWeight: 600 }}>Connecting to Fact+Pulse...</h4>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
