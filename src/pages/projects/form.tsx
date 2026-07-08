import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function ProjectFormPage() {
  const { accountId: paramAccountId, projectId } = useParams();
  const navigate = useNavigate();
  const { accounts, projects, addProject, updateProject } = useDataStore();

  const isEdit = Boolean(projectId);
  const project = isEdit ? projects.find((p) => p.id === projectId) : null;

  const [selectedAccountId, setSelectedAccountId] = useState(paramAccountId || '');
  const [name, setName] = useState('');
  const [managementType, setManagementType] = useState<'FS_MANAGED' | 'CLIENT_MANAGED'>('FS_MANAGED');
  
  // Factspan Managed Metrics
  const [sprintVelocity, setSprintVelocity] = useState<number | ''>('');
  const [throughputRate, setThroughputRate] = useState<number | ''>('');
  
  // Shared Metrics
  const [staffingCount, setStaffingCount] = useState<number | ''>('');
  const [staffingHealth, setStaffingHealth] = useState<number | ''>(100);
  
  // Client Managed Staffing Inputs
  const [membersNeeded, setMembersNeeded] = useState<number | ''>('');
  const [membersDeployed, setMembersDeployed] = useState<number | ''>('');
  
  // Compliance
  const [wbrCompliance, setWbrCompliance] = useState(false);
  const [mbrCompliance, setMbrCompliance] = useState(false);
  const [qbrCompliance, setQbrCompliance] = useState(false);

  // NPS
  const [npsScore, setNpsScore] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

  useEffect(() => {
    if (isEdit && project) {
      setSelectedAccountId(project.accountId);
      setName(project.name);
      setManagementType(project.managementType);
      setSprintVelocity(project.sprintVelocity ?? '');
      setThroughputRate(project.throughputRate ?? '');
      setStaffingCount(project.staffingCount ?? '');
      setStaffingHealth(project.staffingHealth ?? 100);
      setWbrCompliance(project.wbrCompliance ?? false);
      setMbrCompliance(project.mbrCompliance ?? false);
      setQbrCompliance(project.qbrCompliance ?? false);
      setNpsScore(project.npsScore ?? '');

      if (project.managementType === 'CLIENT_MANAGED' && project.staffingCount) {
        setMembersDeployed(project.staffingCount);
        const healthPct = project.staffingHealth ?? 100;
        const needed = healthPct > 0 ? Math.round(project.staffingCount / (healthPct / 100)) : project.staffingCount;
        setMembersNeeded(needed);
      }
    }
  }, [isEdit, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedAccountId) return;

    let finalStaffingCount = staffingCount !== '' ? Number(staffingCount) : undefined;
    let finalStaffingHealth = staffingHealth !== '' ? Number(staffingHealth) : undefined;

    if (managementType === 'CLIENT_MANAGED') {
      if (membersNeeded !== '' && membersDeployed !== '') {
        finalStaffingCount = Number(membersDeployed);
        finalStaffingHealth = Math.round((Number(membersDeployed) / Number(membersNeeded)) * 100);
      }
    }

    const payload = {
      name,
      managementType,
      sprintVelocity: managementType === 'FS_MANAGED' && sprintVelocity !== '' ? Number(sprintVelocity) : undefined,
      throughputRate: managementType === 'FS_MANAGED' && throughputRate !== '' ? Number(throughputRate) : undefined,
      staffingCount: finalStaffingCount,
      staffingHealth: finalStaffingHealth,
      wbrCompliance,
      mbrCompliance,
      qbrCompliance,
      npsScore: npsScore !== '' ? Number(npsScore) : undefined,
    };

    setLoading(true);
    setLoadingStep(1);

    if (isEdit && projectId) {
      await updateProject(projectId, payload);
      setLoading(false);
      navigate(`/accounts/${selectedAccountId}/projects/${projectId}`);
    } else {
      const newId = await addProject({
        accountId: selectedAccountId,
        status: 'ACTIVE',
        health: 'GREEN',
        ...payload,
      });

      const steps = [
        { step: 2, delay: 600 },
        { step: 3, delay: 1200 },
        { step: 4, delay: 1800 },
      ];

      for (const s of steps) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setLoadingStep(s.step);
      }
      await new Promise((resolve) => setTimeout(resolve, 300));

      setLoading(false);
      navigate(`/accounts/${selectedAccountId}/projects/${newId}`);
    }
  };

  const handleCancel = () => {
    if (paramAccountId) {
      navigate(`/accounts/${paramAccountId}`);
    } else {
      navigate('/projects');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.95)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Stunning Spinner */}
          <div
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                border: '6px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                borderLeftColor: '#3b82f6',
                borderRightColor: '#8b5cf6',
                animation: 'spin 1.5s linear infinite',
              }}
            />
            <span style={{ position: 'absolute', fontSize: '32px' }}>🚀</span>
          </div>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>

          {/* Progress Indicators */}
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px 0', color: '#f8fafc' }}>
            Setting Up Project Environment
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0' }}>
            Creating databases, default schemas, and governance check-gates...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: loadingStep >= 1 ? 1 : 0.4 }}>
              <span style={{ color: loadingStep > 1 ? '#34a853' : '#3b82f6', fontWeight: 'bold' }}>
                {loadingStep > 1 ? '✓' : '●'}
              </span>
              <span style={{ fontSize: '14px' }}>Creating project configuration in database</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: loadingStep >= 2 ? 1 : 0.4 }}>
              <span style={{ color: loadingStep > 2 ? '#34a853' : loadingStep === 2 ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>
                {loadingStep > 2 ? '✓' : '●'}
              </span>
              <span style={{ fontSize: '14px' }}>Auto-seeding default governance checkpoints</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: loadingStep >= 3 ? 1 : 0.4 }}>
              <span style={{ color: loadingStep > 3 ? '#34a853' : loadingStep === 3 ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>
                {loadingStep > 3 ? '✓' : '●'}
              </span>
              <span style={{ fontSize: '14px' }}>Recalculating delivery governance scores</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: loadingStep >= 4 ? 1 : 0.4 }}>
              <span style={{ color: loadingStep === 4 ? '#3b82f6' : '#94a3b8', fontWeight: 'bold' }}>●</span>
              <span style={{ fontSize: '14px' }}>Redirecting to project workspace dashboard</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={handleCancel}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: 0,
          marginBottom: '24px',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        ← Back
      </button>

      <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
        <h1 style={{ margin: '0 0 32px 0', fontSize: '24px', color: '#1e293b' }}>
          {isEdit ? 'Edit Project' : 'Create New Project'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Section: Basic Details */}
          <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Basic Details</h3>
            
            {!paramAccountId && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                  Account *
                </label>
                <select
                  required
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  disabled={isEdit}
                >
                  <option value="">Select an Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                Project Name *
              </label>
              <input
                type="text"
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mobile Checkout Redesign"
              />
            </div>

            <div style={{ marginBottom: '0' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                Management Type *
              </label>
              <select
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', background: '#fff' }}
                value={managementType}
                onChange={(e) => setManagementType(e.target.value as 'FS_MANAGED' | 'CLIENT_MANAGED')}
              >
                <option value="FS_MANAGED">Factspan Managed (FS_MANAGED)</option>
                <option value="CLIENT_MANAGED">Client Managed (CLIENT_MANAGED)</option>
              </select>
            </div>
          </div>

          {/* Section: Performance Metrics */}
          {managementType === 'FS_MANAGED' && (
            <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Delivery Metrics</h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                    Sprint Velocity (pts)
                  </label>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    value={sprintVelocity}
                    onChange={(e) => setSprintVelocity(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                    Throughput Rate (tasks/wk)
                  </label>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    value={throughputRate}
                    onChange={(e) => setThroughputRate(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section: Staffing Metrics */}
          <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Staffing Metrics</h3>
            {managementType === 'CLIENT_MANAGED' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                      Total Members Needed *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={membersNeeded}
                      onChange={(e) => setMembersNeeded(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                      Members Currently Deployed *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                      value={membersDeployed}
                      onChange={(e) => setMembersDeployed(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 4"
                    />
                  </div>
                </div>
                {membersNeeded && membersDeployed !== '' && (
                  <div style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 600 }}>
                    Calculated Staffing Health Score: {Math.round((Number(membersDeployed) / Number(membersNeeded)) * 100)}%
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                    Staffing Count (people)
                  </label>
                  <input
                    type="number"
                    min="0"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    value={staffingCount}
                    onChange={(e) => setStaffingCount(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                    Staffing Health (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
                    value={staffingHealth}
                    onChange={(e) => setStaffingHealth(e.target.value ? Number(e.target.value) : '')}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Compliance & Governance */}
          <div style={{ marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#0f172a' }}>Compliance & Governance</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#334155' }}>
                NPS Score
              </label>
              <input
                type="number"
                disabled
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', background: '#f1f5f9', color: '#94a3b8' }}
                value={npsScore}
                placeholder="NPS is to be populated later by the delivery lead."
              />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{ padding: '10px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name || !selectedAccountId}
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                border: 'none',
                background: !name || !selectedAccountId ? '#94a3b8' : '#0D2A66',
                color: '#fff',
                fontWeight: 600,
                cursor: !name || !selectedAccountId ? 'not-allowed' : 'pointer',
              }}
            >
              {isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
