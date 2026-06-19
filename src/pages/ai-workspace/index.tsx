import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

export default function AIWorkspacePage() {
  const { projects, artifacts, aiReports, addAIReport, updateAIReport, publishAIReport } =
    useDataStore();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [reportType, setReportType] = useState<
    'WEEKLY_NOTES' | 'WBR' | 'GOVERNANCE_SUMMARY' | 'ACCOUNT_DIGEST'
  >('WEEKLY_NOTES');

  // Selected source files checkboxes
  const projectArtifacts = artifacts.filter((a) => a.projectId === selectedProjectId);
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);

  // Editor states
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [editorText, setEditorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const activeReport = aiReports.find((r) => r.id === activeReportId);

  const toggleArtifact = (id: string) => {
    setSelectedArtifacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setLoading(true);
    const selectedProjectName = projects.find((p) => p.id === selectedProjectId)?.name || 'Project';

    // Mock content generation based on type
    setTimeout(() => {
      let content = '';
      if (reportType === 'WEEKLY_NOTES') {
        content = `# Weekly Notes - ${selectedProjectName}\n\n## 1. Executive Summary\nAll weekly deliverables are on track. Code integration for authentication SSO modules has been completed successfully.\n\n## 2. Key Accomplishments\n- Migrated repository context definitions to Vite React configuration.\n- Standardized client routing controls and route guards.\n\n## 3. Risks & Roadblocks\n- Delay in Sandbox API keys white-listing from enterprise network administration team.\n\n## 4. Key Decisions\n- Migration to React Router DOM v7 for guarding admin routes.\n`;
      } else if (reportType === 'WBR') {
        content = `# Weekly Business Review (WBR) - ${selectedProjectName}\n\n## 1. Compliance Metric Overview\n- Review compliance rate: **90%**\n- Open Action Items: **3**\n- Active Risks: **1**\n\n## 2. Milestone Alignment Status\n- Deploy Core Portal: On Track (Target June 30)\n- Sandbox Integration Phase 1: Delayed\n\n## 3. Escalations & Asks\nNeed network whitelist approval from the client sponsor to unblock sandbox development.\n`;
      } else if (reportType === 'GOVERNANCE_SUMMARY') {
        content = `# Governance Summary - ${selectedProjectName}\n\nThis summary digests all recent delivery activities. 10 core governance check-gates are tracked. Compliance rate is at optimal thresholds. RAG status is GREEN. Review meetings completed on schedule.\n`;
      } else {
        content = `# Account Digest - ${selectedProjectName}\n\nClient sentiment remains neutral-to-positive. Relationship tenure is healthy. Recommended next scheduled contact is in 5 days. Checkpoint audits indicate all critical actions are documented.\n`;
      }

      const reportId = addAIReport(selectedProjectId, reportType, content);
      setActiveReportId(reportId);
      setEditorText(content);
      setLoading(false);
    }, 1500);
  };

  const handleSave = () => {
    if (!activeReportId) return;
    setSaving(true);
    setTimeout(() => {
      updateAIReport(activeReportId, editorText);
      setSaving(false);
      alert('Draft autosaved successfully to local memory cache.');
    }, 500);
  };

  const handlePublish = () => {
    if (!activeReportId) return;
    publishAIReport(activeReportId);
    alert('Draft published successfully! Governance records and audit logs updated.');
  };

  const handleExportGmail = () => {
    alert('Draft email created successfully in Gmail drafts via MCP connector.');
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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ color: '#1e3a8a', margin: 0, fontSize: '28px', fontWeight: 700 }}>
            AI Workspace Assistant
          </h1>
          <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
            Draft and review Weekly Notes, WBRs, and executive reports quickly
          </p>
        </div>
        <Link
          to="/ai-workspace/upload"
          style={{
            textDecoration: 'none',
            background: '#1e3a8a',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          + Upload Source Documents
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '380px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Control Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
            Generation Parameters
          </h3>

          {/* Project Selection */}
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
              Target Project
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
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setSelectedArtifacts([]);
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                fontWeight: 600,
                fontSize: '12px',
                color: '#334155',
              }}
            >
              Draft Report Type
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(
                [
                  { value: 'WEEKLY_NOTES', label: 'Weekly Notes' },
                  { value: 'WBR', label: 'Weekly Business Review (WBR)' },
                  { value: 'GOVERNANCE_SUMMARY', label: 'Governance Summary' },
                  { value: 'ACCOUNT_DIGEST', label: 'Account Digest' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: '#1e293b',
                  }}
                >
                  <input
                    type="radio"
                    name="reportType"
                    checked={reportType === opt.value}
                    onChange={() => setReportType(opt.value)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Source Artifacts Checkbox List */}
          <div style={{ marginBottom: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                fontSize: '12px',
                color: '#334155',
              }}
            >
              Include Memory Sources ({projectArtifacts.length})
            </label>
            {projectArtifacts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {projectArtifacts.map((a) => (
                  <label
                    key={a.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArtifacts.includes(a.id)}
                      onChange={() => toggleArtifact(a.id)}
                      style={{ width: '14px', height: '14px' }}
                    />
                    📄 {a.name}
                  </label>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                No uploaded artifacts for this project. Upload files to improve draft accuracy.
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: '100%',
              background: '#d97706',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '🤖 AI Writing Draft...' : '⚡ Generate AI Draft'}
          </button>
        </div>

        {/* Right Preview & Editor Panel */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Editor Header Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '18px', fontWeight: 700 }}>
                Composition Workspace
              </h3>
              {activeReport && (
                <span
                  style={{
                    fontSize: '11px',
                    color: activeReport.status === 'PUBLISHED' ? '#10b981' : '#f59e0b',
                    fontWeight: 600,
                  }}
                >
                  Status: {activeReport.status}
                </span>
              )}
            </div>

            {activeReportId && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={handleExportGmail}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    color: '#475569',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  ✉ Gmail Draft
                </button>
                <button
                  onClick={handlePublish}
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
                  Publish Draft
                </button>
              </div>
            )}
          </div>

          {/* Markdown Text Area */}
          {activeReportId ? (
            <textarea
              style={{
                flex: 1,
                width: '100%',
                minHeight: '350px',
                border: 'none',
                outline: 'none',
                fontFamily: 'Courier New, monospace',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#334155',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
            />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                padding: '60px 0',
              }}
            >
              <span style={{ fontSize: '48px', marginBottom: '16px' }}>📝</span>
              <h4 style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>
                No Active Composition
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px' }}>
                Configure the target parameters on the left and click Generate to start
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
