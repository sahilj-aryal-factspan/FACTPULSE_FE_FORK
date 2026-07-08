import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function AIProcessingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { syncWithBackend } = useDataStore();

  useEffect(() => {
    // Pull the parsed risks, action items, decisions, and recalculated health scores from the backend
    syncWithBackend();

    const timer1 = setTimeout(() => setStep(2), 1500);
    const timer2 = setTimeout(() => setStep(3), 3000);
    const timer3 = setTimeout(() => {
      // Completed, redirect to workspace
      navigate('/ai-workspace');
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [navigate, syncWithBackend]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        background: '#f5f6f8',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '40px 32px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}
      >
        {/* Loading Spinner */}
        <div
          style={{
            position: 'relative',
            width: '64px',
            height: '64px',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              border: '4px solid rgba(138, 61, 120, 0.1)',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              borderLeftColor: '#8a3d78',
              animation: 'spin 1.2s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ position: 'absolute', fontSize: '24px' }}>🤖</span>
        </div>

        <h2 style={{ color: '#1e3a8a', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700 }}>
          AI Document Engine
        </h2>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 32px 0' }}>
          Classifying artifacts and indexing risks, actions, and decisions
        </p>

        {/* Pipeline steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step > 1 ? '#34a853' : '#1e3a8a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {step > 1 ? '✓' : '1'}
            </span>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: step >= 1 ? '#1e293b' : '#94a3b8',
                }}
              >
                Google Drive Sync & Cloud Storage upload
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {step > 1 ? 'Completed' : 'Syncing folders...'}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step > 2 ? '#34a853' : step === 2 ? '#1e3a8a' : '#f1f5f9',
                color: step >= 2 ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {step > 2 ? '✓' : '2'}
            </span>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: step >= 2 ? '#1e293b' : '#94a3b8',
                }}
              >
                Artifact Classification & Metadata Alignment
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {step > 2 ? 'Completed' : step === 2 ? 'Parsing document tables...' : 'Pending'}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step === 3 ? '#1e3a8a' : '#f1f5f9',
                color: step === 3 ? '#ffffff' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              3
            </span>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: step === 3 ? '#1e293b' : '#94a3b8',
                }}
              >
                Risk & Action Items Extraction
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {step === 3 ? 'Running NLP classifiers...' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
