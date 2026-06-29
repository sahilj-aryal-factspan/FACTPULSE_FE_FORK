import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function ProjectFormPage() {
  const { accountId, projectId } = useParams<{ accountId?: string; projectId?: string }>();
  const navigate = useNavigate();
  const { accounts, projects, addProject, updateProject } = useDataStore();

  const isEdit = !!projectId;
  const project = projects.find((p) => p.id === projectId);

  const [name, setName] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'ARCHIVED'>('ACTIVE');
  const [health, setHealth] = useState<'GREEN' | 'AMBER' | 'RED'>('GREEN');
  const [complianceRate, setComplianceRate] = useState(100);
  const [details, setDetails] = useState('');
  const [lead, setLead] = useState('');

  // New Stakeholder Roles
  const [projectType, setProjectType] = useState<'CUSTOMER_MANAGED' | 'INTERNAL_TEAM_MANAGED'>('CUSTOMER_MANAGED');
  const [seniorDirector, setSeniorDirector] = useState('');
  const [vicePresident, setVicePresident] = useState('');
  const [supervisor, setSupervisor] = useState('');

  // New Sprint Metrics
  const [sprintStartDate, setSprintStartDate] = useState('');
  const [sprintEndDate, setSprintEndDate] = useState('');
  const [deliveryPerformance, setDeliveryPerformance] = useState('');
  const [overflow, setOverflow] = useState('');

  // Initialize fields
  useEffect(() => {
    if (isEdit && project) {
      setName(project.name);
      setSelectedAccountId(project.accountId);
      setStatus(project.status);
      setHealth(project.health);
      setComplianceRate(project.complianceRate);
      setDetails(project.details || '');
      setLead(project.lead || '');
      setProjectType(project.projectType || 'CUSTOMER_MANAGED');
      setSeniorDirector(project.seniorDirector || '');
      setVicePresident(project.vicePresident || '');
      setSupervisor(project.supervisor || '');
      setSprintStartDate(project.sprintStartDate ? project.sprintStartDate.substring(0, 10) : '');
      setSprintEndDate(project.sprintEndDate ? project.sprintEndDate.substring(0, 10) : '');
      setDeliveryPerformance(project.deliveryPerformance !== undefined && project.deliveryPerformance !== null ? String(project.deliveryPerformance) : '');
      setOverflow(project.overflow !== undefined && project.overflow !== null ? String(project.overflow) : '');
    } else if (accountId) {
      setSelectedAccountId(accountId);
      setDetails('');
      setLead('');
      setProjectType('CUSTOMER_MANAGED');
      setSeniorDirector('');
      setVicePresident('');
      setSupervisor('');
      setSprintStartDate('');
      setSprintEndDate('');
      setDeliveryPerformance('');
      setOverflow('');
    } else if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
      setDetails('');
      setLead('');
      setProjectType('CUSTOMER_MANAGED');
      setSeniorDirector('');
      setVicePresident('');
      setSupervisor('');
      setSprintStartDate('');
      setSprintEndDate('');
      setDeliveryPerformance('');
      setOverflow('');
    }
  }, [isEdit, project, accountId, accounts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedAccountId) return;

    const projectPayload = {
      name,
      status,
      health,
      complianceRate: Number(complianceRate),
      details,
      lead,
      projectType,
      seniorDirector: seniorDirector || null,
      vicePresident: vicePresident || null,
      supervisor: supervisor || null,
      sprintStartDate: projectType === 'INTERNAL_TEAM_MANAGED' && sprintStartDate ? sprintStartDate : null,
      sprintEndDate: projectType === 'INTERNAL_TEAM_MANAGED' && sprintEndDate ? sprintEndDate : null,
      deliveryPerformance: projectType === 'INTERNAL_TEAM_MANAGED' && deliveryPerformance ? Number(deliveryPerformance) : null,
      overflow: projectType === 'INTERNAL_TEAM_MANAGED' && overflow ? Number(overflow) : null,
    } as any;

    if (isEdit && projectId) {
      updateProject(projectId, projectPayload);
      navigate(`/accounts/${selectedAccountId}/projects/${projectId}`);
    } else {
      addProject({
        ...projectPayload,
        accountId: selectedAccountId,
      });
      navigate(`/accounts/${selectedAccountId}`);
    }
  };

  const currentAccount = accounts.find((a) => a.id === selectedAccountId);

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
      {/* Breadcrumbs */}
      <div style={{ marginBottom: '24px', fontSize: '14px', color: '#64748b' }}>
        <Link to="/portfolio" style={{ textDecoration: 'none', color: '#64748b' }}>
          Portfolio
        </Link>{' '}
        /
        {currentAccount && (
          <>
            <Link
              to={`/accounts/${currentAccount.id}`}
              style={{ textDecoration: 'none', color: '#64748b', marginLeft: '6px' }}
            >
              {currentAccount.name}
            </Link>{' '}
            /
          </>
        )}
        <span style={{ color: '#1e3a8a', fontWeight: 'bold', marginLeft: '6px' }}>
          {isEdit ? `Edit ${project?.name}` : 'Create Project'}
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
          {isEdit ? 'Modify Project Details' : 'Initialize New Project'}
        </h1>
        <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>
          {isEdit
            ? 'Update delivery targets, health, and compliance scores'
            : 'Register a new project stream within your client portfolio'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Project Name */}
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
              Project Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Loyalty Engine API"
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

          {/* Account Selection */}
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
              Associated Account *
            </label>
            <select
              required
              disabled={isEdit || !!accountId}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: isEdit || !!accountId ? '#f1f5f9' : '#ffffff',
                cursor: isEdit || !!accountId ? 'not-allowed' : 'default',
              }}
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="" disabled>Select an account</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status & Health */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
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
                Project Status
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
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
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
                Health Status (RAG)
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
                value={health}
                onChange={(e) => setHealth(e.target.value as any)}
              >
                <option value="GREEN">GREEN</option>
                <option value="AMBER">AMBER</option>
                <option value="RED">RED</option>
              </select>
            </div>
          </div>

          {/* Compliance Rate */}
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
              Initial Compliance Score (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
              value={complianceRate}
              onChange={(e) => setComplianceRate(Number(e.target.value))}
            />
          </div>

          {/* Project Management Type */}
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
              Project Management Type *
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
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as any)}
            >
              <option value="CUSTOMER_MANAGED">Customer Managed</option>
              <option value="INTERNAL_TEAM_MANAGED">Internal Team Managed</option>
            </select>
          </div>

          {/* Project Stakeholders Section */}
          <div style={{ marginBottom: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <h3 style={{ color: '#1e3a8a', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Defined Project Stakeholders</h3>
            
            {/* Project Lead */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Project Lead</label>
              <input
                type="text"
                placeholder="e.g. Sahil Jaryal"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                value={lead}
                onChange={(e) => setLead(e.target.value)}
              />
            </div>

            {/* Senior Director */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Senior Director</label>
              <input
                type="text"
                placeholder="e.g. Balaji Rajan"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                value={seniorDirector}
                onChange={(e) => setSeniorDirector(e.target.value)}
              />
            </div>

            {/* Vice President */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Vice President</label>
              <input
                type="text"
                placeholder="e.g. Venkatesh Executive"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                value={vicePresident}
                onChange={(e) => setVicePresident(e.target.value)}
              />
            </div>

            {/* Supervisor */}
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#475569' }}>Supervisor</label>
              <input
                type="text"
                placeholder="e.g. Delivery Manager"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
              />
            </div>
          </div>

          {/* Conditional Sprint Metrics Section (Only for Internal Team Managed) */}
          {projectType === 'INTERNAL_TEAM_MANAGED' && (
            <div style={{ marginBottom: '24px', padding: '16px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
              <h3 style={{ color: '#1e40af', margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Internal Sprint Metrics</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                {/* Start Date */}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#1e40af' }}>Sprint Start Date</label>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                    value={sprintStartDate}
                    onChange={(e) => setSprintStartDate(e.target.value)}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#1e40af' }}>Sprint End Date</label>
                  <input
                    type="date"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                    value={sprintEndDate}
                    onChange={(e) => setSprintEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Delivery Performance */}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#1e40af' }}>Delivery Performance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="e.g. 95"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                    value={deliveryPerformance}
                    onChange={(e) => setDeliveryPerformance(e.target.value)}
                  />
                </div>

                {/* Overflow */}
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: '#1e40af' }}>Sprint Overflow (Tasks)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', boxSizing: 'border-box' }}
                    value={overflow}
                    onChange={(e) => setOverflow(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Project Details */}
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
              Project Details
            </label>
            <textarea
              placeholder="Describe the project stream objectives, deliverables, and architecture..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

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
              {isEdit ? 'Save Changes' : 'Initialize Project'}
            </button>
            <button
              type="button"
              onClick={() =>
                navigate(
                  isEdit
                    ? `/accounts/${selectedAccountId}/projects/${projectId}`
                    : selectedAccountId
                    ? `/accounts/${selectedAccountId}`
                    : '/projects'
                )
              }
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
