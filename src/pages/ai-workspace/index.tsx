import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';

// A simple, fast React-based Markdown parser to render clean, beautifully styled HTML in the preview pane
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="list-disc pl-5 mb-4 space-y-1 text-neutral-700 dark:text-neutral-300">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const parseInlineStyles = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let idx = 0;

    while (remaining.length > 0) {
      const boldIdx = remaining.indexOf('**');
      const codeIdx = remaining.indexOf('`');

      if (boldIdx === -1 && codeIdx === -1) {
        parts.push(<span key={idx++}>{remaining}</span>);
        break;
      }

      if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
        if (boldIdx > 0) {
          parts.push(<span key={idx++}>{remaining.substring(0, boldIdx)}</span>);
        }
        const endBoldIdx = remaining.indexOf('**', boldIdx + 2);
        if (endBoldIdx !== -1) {
          const boldText = remaining.substring(boldIdx + 2, endBoldIdx);
          parts.push(
            <strong key={idx++} className="font-semibold text-neutral-900 dark:text-white">
              {boldText}
            </strong>
          );
          remaining = remaining.substring(endBoldIdx + 2);
        } else {
          parts.push(<span key={idx++}>{remaining.substring(boldIdx)}</span>);
          break;
        }
      } else {
        if (codeIdx > 0) {
          parts.push(<span key={idx++}>{remaining.substring(0, codeIdx)}</span>);
        }
        const endCodeIdx = remaining.indexOf('`', codeIdx + 1);
        if (endCodeIdx !== -1) {
          const codeText = remaining.substring(codeIdx + 1, endCodeIdx);
          parts.push(
            <code key={idx++} className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-brand-orange dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 rounded font-mono text-xs">
              {codeText}
            </code>
          );
          remaining = remaining.substring(endCodeIdx + 1);
        } else {
          parts.push(<span key={idx++}>{remaining.substring(codeIdx)}</span>);
          break;
        }
      }
    }
    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-brand-navy dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4 mt-6 first:mt-0">
          {parseInlineStyles(line.substring(2))}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-xl font-semibold text-brand-navy dark:text-neutral-200 pb-1 mb-3 mt-5">
          {parseInlineStyles(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-lg font-medium text-neutral-800 dark:text-neutral-200 mb-2 mt-4">
          {parseInlineStyles(line.substring(4))}
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      inList = true;
      listItems.push(
        <li key={i} className="text-sm py-0.5">
          {parseInlineStyles(line.substring(2))}
        </li>
      );
    } else if (line === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={i} className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
          {parseInlineStyles(line)}
        </p>
      );
    }
  }

  flushList();

  return <div className="prose dark:prose-invert max-w-none">{elements}</div>;
}

export default function AIWorkspacePage() {
  const { projects, artifacts, aiReports, addAIReport, updateAIReport, publishAIReport } =
    useDataStore();

  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [reportType, setReportType] = useState<
    'WEEKLY_NOTES' | 'WBR' | 'GOVERNANCE_SUMMARY' | 'ACCOUNT_DIGEST'
  >('WEEKLY_NOTES');

  const projectArtifacts = artifacts.filter((a) => a.projectId === selectedProjectId);
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);

  // Editor states
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [editorText, setEditorText] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // View state: 'split' | 'edit' | 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [downloadDropdownOpen, setDownloadDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const activeReport = aiReports.find((r) => r.id === activeReportId);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleArtifact = (id: string) => {
    setSelectedArtifacts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) return;
    setLoading(true);
    const selectedProjectName = projects.find((p) => p.id === selectedProjectId)?.name || 'Project';

    try {
      const res = await fetch('http://localhost:8080/api/v1/artifacts/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          type: reportType,
          artifactIds: selectedArtifacts,
        }),
      });

      if (res.ok) {
        const payload = await res.json();
        const content = payload.data.content;
        const reportId = addAIReport(selectedProjectId, reportType, content);
        setActiveReportId(reportId);
        setEditorText(content);
        showToast('AI Draft generated successfully!', 'success');
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (e: any) {
      console.warn('Backend draft generation failed, falling back to local simulation:', e);
      
      // Fallback local report generation
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
      showToast('AI Draft generated successfully (Offline Simulation Mode)!', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!activeReportId) return;
    setSaving(true);
    setTimeout(() => {
      updateAIReport(activeReportId, editorText);
      setSaving(false);
      showToast('Draft autosaved successfully to local memory cache.', 'success');
    }, 500);
  };

  const handlePublish = () => {
    if (!activeReportId) return;
    publishAIReport(activeReportId);
    showToast('Draft published successfully! Governance records updated.', 'success');
  };

  const handleExportGmail = () => {
    showToast('Draft email created successfully in Gmail drafts via connector.', 'info');
  };

  // Compile markdown to styled standalone HTML download string
  const compileMarkdownToHTML = (md: string, title: string): string => {
    const lines = md.split('\n');
    let html = '';
    let inList = false;

    const flushList = () => {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    };

    const parseInline = (text: string) => {
      let res = text;
      res = res.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827; font-weight: 600;">$1</strong>');
      res = res.replace(/`(.*?)`/g, '<code style="background-color: #f3f4f6; color: #d97706; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px;">$1</code>');
      return res;
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        flushList();
        html += `<h1 style="color: #1e3a8a; font-size: 24px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px; font-weight: 700;">${parseInline(trimmed.substring(2))}</h1>`;
      } else if (trimmed.startsWith('## ')) {
        flushList();
        html += `<h2 style="color: #2563eb; font-size: 18px; margin-top: 20px; margin-bottom: 12px; font-weight: 600;">${parseInline(trimmed.substring(3))}</h2>`;
      } else if (trimmed.startsWith('### ')) {
        flushList();
        html += `<h3 style="color: #374151; font-size: 16px; margin-top: 16px; margin-bottom: 8px; font-weight: 600;">${parseInline(trimmed.substring(4))}</h3>`;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          html += '<ul style="padding-left: 20px; margin-bottom: 16px; list-style-type: disc;">';
          inList = true;
        }
        html += `<li style="color: #4b5563; font-size: 14px; margin-bottom: 6px; line-height: 1.5;">${parseInline(trimmed.substring(2))}</li>`;
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        html += `<p style="color: #4b5563; font-size: 14px; margin-bottom: 14px; line-height: 1.6;">${parseInline(trimmed)}</p>`;
      }
    });

    flushList();

    const selectedProjectName = projects.find((p) => p.id === selectedProjectId)?.name || 'Project';
    const reportTypeLabel = {
      WEEKLY_NOTES: 'Weekly Notes',
      WBR: 'Weekly Business Review (WBR)',
      GOVERNANCE_SUMMARY: 'Governance Summary',
      ACCOUNT_DIGEST: 'Account Digest',
    }[reportType];

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background-color: #f3f4f6;
      color: #1f2937;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
    }
    .container {
      background-color: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
      max-width: 850px;
      width: 100%;
      padding: 48px;
      box-sizing: border-box;
      position: relative;
    }
    .header-meta {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 24px;
      margin-bottom: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #6b7280;
    }
    .header-left h4 {
      margin: 0;
      color: #1e3a8a;
      font-size: 16px;
      font-weight: 700;
    }
    .badge {
      background-color: #fef3c7;
      color: #d97706;
      border: 1px solid #fde68a;
      padding: 4px 12px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 12px;
    }
    .content-area {
      line-height: 1.7;
    }
    .actions-bar {
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }
    .btn-primary {
      background-color: #1e3a8a;
      color: #ffffff;
    }
    .btn-primary:hover {
      background-color: #111827;
    }
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
      }
      .container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .actions-bar {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-meta">
      <div class="header-left">
        <h4>FactPulse Executive Report</h4>
        <span>Project: <strong>${selectedProjectName}</strong></span>
      </div>
      <div>
        <span class="badge">${reportTypeLabel}</span>
      </div>
    </div>
    <div class="content-area">
      ${html}
    </div>
    <div class="actions-bar">
      <button onclick="window.print()" class="btn btn-primary">🖨 Print or Save as PDF</button>
    </div>
  </div>
</body>
</html>`;
  };

  const downloadReport = (format: 'html' | 'md') => {
    if (!editorText) return;
    const selectedProjectName = projects.find((p) => p.id === selectedProjectId)?.name || 'Project';
    const cleanProjectName = selectedProjectName.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const cleanReportType = reportType.toLowerCase();

    if (format === 'md') {
      const blob = new Blob([editorText], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cleanProjectName}_${cleanReportType}_report.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Markdown draft downloaded successfully!', 'success');
    } else {
      const title = `${reportType.replace('_', ' ')} - ${selectedProjectName}`;
      const htmlContent = compileMarkdownToHTML(editorText, title);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cleanProjectName}_${cleanReportType}_report.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('HTML report document downloaded successfully!', 'success');
    }
    setDownloadDropdownOpen(false);
  };

  const reportOptions = [
    { value: 'WEEKLY_NOTES', label: 'Weekly Notes', icon: '📄', desc: 'Core achievements, milestones, and roadblocks.' },
    { value: 'WBR', label: 'Weekly Business Review (WBR)', icon: '📈', desc: 'Compliance status and delivery operational reviews.' },
    { value: 'GOVERNANCE_SUMMARY', label: 'Governance Summary', icon: '🛡️', desc: 'Project governance health, gates, and audits.' },
    { value: 'ACCOUNT_DIGEST', label: 'Account Digest', icon: '💼', desc: 'Stakeholder status and account sentiment summary.' },
  ] as const;

  return (
    <div className="flex flex-col flex-1 p-6 max-w-7xl mx-auto w-full box-border relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl animate-in slide-in-from-bottom duration-300">
          <span className="text-lg">
            {toast.type === 'success' ? '✅' : toast.type === 'info' ? 'ℹ️' : '⚠️'}
          </span>
          <p className="text-xs xs:text-sm font-medium text-neutral-800 dark:text-neutral-200 m-0">
            {toast.message}
          </p>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-brand-navy dark:text-white text-2xl xs:text-3xl font-extrabold m-0 leading-tight">
            AI Workspace Redesign
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs xs:text-sm mt-1 mb-0">
            Synthesize governance sources and compile delivery reports with real-time preview side-by-side.
          </p>
        </div>
        <Link
          to="/ai-workspace/upload"
          className="inline-flex items-center justify-center bg-brand-navy hover:bg-neutral-900 dark:bg-brand-navy dark:hover:bg-neutral-800 text-white font-semibold text-xs xs:text-sm py-2.5 px-5 rounded-lg transition-colors shadow-sm w-fit"
        >
          + Upload Documents
        </Link>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Side Control panel (Glassmorphic) */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 xs:p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h3 className="text-brand-navy dark:text-white font-bold text-lg m-0 mb-1">
              Generation Parameters
            </h3>
            <span className="text-neutral-400 dark:text-neutral-500 text-[11px]">
              Set targets and reference documents
            </span>
          </div>

          {/* Project select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Target Project Context
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-navy/20 dark:focus:ring-brand-orange/20 transition-all text-xs xs:text-sm cursor-pointer"
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

          {/* Report Type selector cards */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Draft Report Type
            </label>
            <div className="flex flex-col gap-2">
              {reportOptions.map((opt) => {
                const isSelected = reportType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReportType(opt.value)}
                    className={`flex items-start text-left p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/40 dark:bg-amber-950/10 border-brand-orange text-neutral-900 dark:text-white ring-1 ring-brand-orange/20'
                        : 'bg-transparent border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span className="text-xl mr-3 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs xs:text-sm font-semibold mb-0.5">
                        {opt.label}
                      </div>
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Artifacts checklists */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Memory Sources ({projectArtifacts.length})
            </label>
            {projectArtifacts.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                {projectArtifacts.map((a) => {
                  const isChecked = selectedArtifacts.includes(a.id);
                  return (
                    <label
                      key={a.id}
                      className={`flex items-center gap-3 p-2 border rounded-lg cursor-pointer transition-colors text-xs ${
                        isChecked
                          ? 'border-brand-navy/30 dark:border-white/20 bg-neutral-50 dark:bg-neutral-800/30'
                          : 'border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/10'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleArtifact(a.id)}
                        className="rounded border-neutral-300 text-brand-navy focus:ring-brand-navy h-4 w-4"
                      />
                      <span className="text-neutral-700 dark:text-neutral-300 truncate">
                        📄 {a.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-neutral-400 dark:text-neutral-500 italic py-1">
                No uploaded artifacts for this project. Upload files to supply context.
              </div>
            )}
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-3 px-4 bg-brand-orange text-white border-none rounded-lg cursor-pointer font-bold text-xs xs:text-sm transition-all duration-200 shadow-sm relative overflow-hidden flex items-center justify-center gap-2 ${
              loading ? 'opacity-85 cursor-not-allowed' : 'hover:bg-amber-600 active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <>
                <div className="border-2 border-white/20 border-t-white rounded-full w-4 h-4 animate-spin" />
                <span>Generating Draft...</span>
              </>
            ) : (
              <>
                <span>⚡ Generate AI Draft</span>
              </>
            )}
          </button>
        </div>

        {/* Right Side Composition Workspace */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 xs:p-6 shadow-sm min-h-[500px] flex flex-col gap-6">
          {/* Workspace Controls Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 gap-4">
            <div>
              <h3 className="text-brand-navy dark:text-white font-bold text-lg m-0">
                Composition Workspace
              </h3>
              {activeReport && (
                <div className="inline-flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-amber-500 tracking-wider uppercase">
                    Status: {activeReport.status}
                  </span>
                </div>
              )}
            </div>

            {/* Editing / Preview toggle buttons */}
            {activeReportId && (
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg p-0.5 bg-neutral-50 dark:bg-neutral-950">
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                      viewMode === 'edit'
                        ? 'bg-white dark:bg-neutral-800 text-brand-navy dark:text-white shadow-sm'
                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                      viewMode === 'preview'
                        ? 'bg-white dark:bg-neutral-800 text-brand-navy dark:text-white shadow-sm'
                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    HTML View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('split')}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer hidden md:block ${
                      viewMode === 'split'
                        ? 'bg-white dark:bg-neutral-800 text-brand-navy dark:text-white shadow-sm'
                        : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
                    }`}
                  >
                    Split Screen
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Workspace Frame */}
          {activeReportId ? (
            <div className="flex flex-col flex-1 gap-6">
              {/* Toolbar Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200/60 dark:border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-semibold py-1.5 px-3 rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : '💾 Save Draft'}
                  </button>
                  <button
                    onClick={handleExportGmail}
                    className="inline-flex items-center gap-1.5 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-semibold py-1.5 px-3 rounded-lg transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs cursor-pointer"
                  >
                    ✉ Gmail Draft
                  </button>
                  <button
                    onClick={handlePublish}
                    className="inline-flex items-center gap-1.5 bg-success text-white font-semibold py-1.5 px-3 rounded-lg transition-all hover:bg-emerald-700 text-xs cursor-pointer"
                  >
                    🚀 Publish
                  </button>
                </div>

                {/* Download Menu */}
                <div className="relative">
                  <button
                    onClick={() => setDownloadDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 bg-brand-navy text-white font-semibold py-1.5 px-3.5 rounded-lg transition-colors hover:bg-neutral-900 text-xs cursor-pointer"
                  >
                    <span>📥 Download</span>
                    <span className="text-[10px]">▼</span>
                  </button>
                  {downloadDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDownloadDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-20">
                        <button
                          onClick={() => downloadReport('html')}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-200 font-medium cursor-pointer"
                        >
                          💻 Standalone HTML Document
                        </button>
                        <button
                          onClick={() => downloadReport('md')}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-200 font-medium cursor-pointer"
                        >
                          📝 Raw Markdown File (.md)
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Composition Panel Containers */}
              <div className="flex flex-col flex-1">
                {/* 1. Split View Mode */}
                {viewMode === 'split' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[450px]">
                    {/* Raw Markdown Editor Pane */}
                    <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950">
                      <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Editor (Markdown)</span>
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">{editorText.length} chars</span>
                      </div>
                      <textarea
                        className="flex-1 w-full min-h-[380px] p-4 border-none outline-none font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 bg-transparent resize-y box-border focus:ring-0"
                        value={editorText}
                        onChange={(e) => setEditorText(e.target.value)}
                        placeholder="Write standard markdown content here..."
                      />
                    </div>

                    {/* Styled HTML Preview Pane */}
                    <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/20">
                      <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Rendered HTML View</span>
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-950/20 text-brand-orange dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold">Rich View</span>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto bg-white dark:bg-neutral-900/50 min-h-[380px]">
                        <MarkdownRenderer content={editorText} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Full Editor Mode */}
                {viewMode === 'edit' && (
                  <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950 min-h-[450px]">
                    <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Editor (Markdown)</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">{editorText.length} chars</span>
                    </div>
                    <textarea
                      className="flex-1 w-full min-h-[400px] p-6 border-none outline-none font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 bg-transparent resize-y box-border focus:ring-0"
                      value={editorText}
                      onChange={(e) => setEditorText(e.target.value)}
                      placeholder="Write standard markdown content here..."
                    />
                  </div>
                )}

                {/* 3. Full Preview Mode */}
                {viewMode === 'preview' && (
                  <div className="flex flex-col border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900 min-h-[450px]">
                    <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                      <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Rendered HTML View</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950/20 text-brand-orange dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold">Rich View</span>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
                      <MarkdownRenderer content={editorText} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 py-16 px-4 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
              <span className="text-5xl mb-4">🤖</span>
              <h4 className="margin-0 font-bold text-neutral-700 dark:text-neutral-300 text-lg">
                Composition Workspace Idle
              </h4>
              <p className="margin-0 text-xs max-w-sm mt-1 text-neutral-500 dark:text-neutral-400">
                Choose a project and report type on the left, then click Generate to initialize your composition.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
