import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import ThemeToggle from '../../components/ThemeToggle';

// Mock data for Interactive Compliance Tab
const complianceMockData = {
  macys: {
    name: "Macy's Inc. (Digital Commerce)",
    rag: 'GREEN',
    score: 94,
    buyingCenters: 3,
    projects: ['Checkout Redesign', 'Mobile Cart Optimization', 'Personalized Search'],
    alerts: [
      { type: 'info', text: 'All 3 active projects are fully compliant.' },
      { type: 'success', text: 'Weekly Notes submitted on time for all projects.' },
      { type: 'success', text: 'Next MBR scheduled and pre-read document loaded.' }
    ]
  },
  cvs: {
    name: 'CVS Health (Digital Analytics)',
    rag: 'AMBER',
    score: 82,
    buyingCenters: 2,
    projects: ['Analytics Pipeline', 'Customer Loyalty Portal'],
    alerts: [
      { type: 'warning', text: '1 project (Customer Loyalty Portal) has missing weekly notes.' },
      { type: 'info', text: 'Stakeholder NPS review is due in 4 days.' },
      { type: 'success', text: 'WBR completed and updated on July 2nd.' }
    ]
  },
  chevron: {
    name: 'Chevron Corp. (Supply Chain Operations)',
    rag: 'RED',
    score: 58,
    buyingCenters: 4,
    projects: ['Inventory Sync Engine', 'Logistics Dashboard', 'Vendor Portal API'],
    alerts: [
      { type: 'danger', text: 'Governance Exception: Missed last 2 WBRs.' },
      { type: 'danger', text: 'Critical Risk: Stakeholder sentiment is Negative on Vendor Portal API.' },
      { type: 'warning', text: '3 Weekly Notes entries are currently overdue.' }
    ]
  }
};

// Mock data for Interactive Stakeholder Tab
const initialStakeholders = [
  { id: '1', name: 'Sarah Jenkins', role: 'VP of Digital Technology', sentiment: 'POSITIVE', lastConnect: '3 days ago', reportsTo: null },
  { id: '2', name: 'David Miller', role: 'IT Delivery Director', sentiment: 'NEUTRAL', lastConnect: '12 days ago', reportsTo: 'Sarah Jenkins' },
  { id: '3', name: 'Alok Mehta', role: 'Principal Architect', sentiment: 'NEGATIVE', lastConnect: '28 days ago', reportsTo: 'David Miller' }
];

export default function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Tabs for interactive playground
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<'compliance' | 'ai-workspace' | 'stakeholders'>('compliance');

  // Interactive state: Compliance
  const [selectedAccount, setSelectedAccount] = useState<'macys' | 'cvs' | 'chevron'>('macys');

  // Interactive state: AI Workspace Simulation
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [aiDraftContent, setAiDraftContent] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [draftState, setDraftState] = useState<'IDLE' | 'DRAFT' | 'UNDER_REVIEW' | 'PUBLISHED'>('IDLE');

  // Interactive state: Stakeholder Tree Connect Tracker
  const [stakeholders, setStakeholders] = useState(initialStakeholders);
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string>('3');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Trigger auto logs for AI Workspace Simulator
  const runAiSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);
    setDraftState('DRAFT');
    setSimulationLogs(['[15:52:01] Initializing secure file upload...']);
    setAiDraftContent('');

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, '[15:52:02] job:progress ➔ 15% | Extracting raw text from StatusReport.pdf...']);
      setSimulationStep(2);
    }, 1000);

    setTimeout(() => {
      setSimulationLogs(prev => [...prev, '[15:52:03] job:progress ➔ 55% | Invoking BullMQ LLM Risk Parser...']);
      setSimulationStep(3);
    }, 2200);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        '[15:52:04] job:progress ➔ 85% | Extracting 2 risks & 3 action items...',
        '[15:52:05] job:completed ➔ Success | Transitioning state to UNDER_REVIEW'
      ]);
      setDraftState('UNDER_REVIEW');
      setAiDraftContent(
        `# WEEKLY GOVERNANCE REPORT (AI GENERATED DRAFT)
Date: July 06, 2026
Account: Macy's Inc. (Digital Commerce)

## 📋 Delivery Status Summary
Overall project trajectory remains stable. The checkout redesign API integration is completed, but performance optimization is ongoing.

## ⚠️ Identified Risks & Blockers
1. Checkout API latency currently exceeds 250ms (SLA is 150ms).
   - Mitigation: Implementing Redis caching layers by sprint end.
2. Resource constraint on mobile app UI team.
   - Mitigation: Swapping two frontend developers from portfolio pool.

## ✅ Actions Required / Tasks
- [ ] Deploy Redis caching middleware (Assigned: Delivery Lead)
- [ ] Align withSarah Jenkins on mobile roadmap (Assigned: Account Lead)
`
      );
      setSimulationStep(4);
      setIsSimulating(false);
    }, 3800);
  };

  const publishAiDraft = () => {
    setDraftState('PUBLISHED');
    setSimulationLogs(prev => [
      ...prev,
      '[15:52:10] Executing publish action...',
      '[15:52:11] Syncing to Google Drive & Sheets via MCP connector...',
      '[15:52:12] Task complete! Published successfully.'
    ]);
    triggerToast('Report published! Synced to Google Workspace via MCP.');
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const logStakeholderConnect = (id: string) => {
    setStakeholders(prev =>
      prev.map(sh => {
        if (sh.id === id) {
          return {
            ...sh,
            lastConnect: 'Today',
            sentiment: sh.sentiment === 'NEGATIVE' ? 'NEUTRAL' : 'POSITIVE' // Improved due to connect
          };
        }
        return sh;
      })
    );
    triggerToast(`Logged contact with ${stakeholders.find(s => s.id === id)?.name}. Sentiment updated.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-200 relative overflow-hidden">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-navy/10 dark:bg-brand-navy/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50%] right-[-5%] w-96 h-96 bg-brand-orange/10 dark:bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-[20%] w-80 h-80 bg-brand-purple/10 dark:bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-emerald-600 text-white font-semibold px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-bounce">
          <span>✓</span> {successToast}
        </div>
      )}

      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md border-b border-neutral-200/50 dark:border-neutral-800/50 px-6 py-4 flex items-center justify-between transition-colors duration-200">
        <Link to="/" className="font-extrabold text-2xl text-brand-navy dark:text-white tracking-tight no-underline">
          FACT<span className="text-brand-orange">PULSE</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/portfolio"
              className="bg-brand-navy hover:bg-neutral-900 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all no-underline shadow-md shadow-brand-navy/10 active:scale-95"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-brand-navy dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-sm font-semibold py-2 px-4 rounded-lg transition-colors no-underline"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-brand-navy hover:bg-neutral-900 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all no-underline shadow-md shadow-brand-navy/10 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 pt-16 pb-12 text-center relative z-10">
        <span className="inline-block bg-brand-orange/10 dark:bg-brand-orange/20 text-brand-orange text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
          Delivery Governance Operating System
        </span>
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl text-brand-navy dark:text-white leading-tight max-w-[900px] mx-auto tracking-tight">
          Eliminate Governance Blindspots & Delivery Fragmentation
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-neutral-500 dark:text-neutral-400 mt-6 max-w-[750px] mx-auto leading-relaxed font-medium">
          Fact+Pulse consolidates client metrics, weekly standups, governance scores, and stakeholder sentiment into a single command center. Empower delivery leads with context-aware AI status compiling.
        </p>

        <div className="flex flex-col xs:flex-row justify-center items-center gap-4 mt-8">
          {isAuthenticated ? (
            <Link
              to="/portfolio"
              className="w-full xs:w-auto text-center bg-brand-navy hover:bg-neutral-900 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-brand-navy/20 no-underline active:scale-95"
            >
              Access Command Center
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full xs:w-auto text-center bg-brand-navy hover:bg-neutral-900 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-brand-navy/20 no-underline active:scale-95"
            >
              Sign In with Google SSO
            </Link>
          )}
          <a
            href="#playground"
            className="w-full xs:w-auto text-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-brand-navy dark:text-white border border-neutral-300 dark:border-neutral-700 font-semibold py-3 px-8 rounded-lg transition-all no-underline"
          >
            Explore Interactive Demo
          </a>
        </div>
      </section>

      {/* Interactive Playground Section */}
      <section id="playground" className="w-full py-16 px-6 relative z-10 max-w-[1200px] mx-auto">
        <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Fact+Pulse Live Simulator
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-[600px] mx-auto">
              Click the tabs below to interact directly with the core features of the Fact+Pulse Delivery Governance MVP.
            </p>
          </div>

          {/* Playground Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-6 overflow-x-auto gap-2">
            <button
              onClick={() => setActivePlaygroundTab('compliance')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activePlaygroundTab === 'compliance'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              📊 Portfolio Compliance Dashboard
            </button>
            <button
              onClick={() => setActivePlaygroundTab('ai-workspace')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activePlaygroundTab === 'ai-workspace'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              ⚡ AI Workspace & Websockets
            </button>
            <button
              onClick={() => setActivePlaygroundTab('stakeholders')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                activePlaygroundTab === 'stakeholders'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
              }`}
            >
              🌳 Buying Center Stakeholder Tree
            </button>
          </div>

          {/* Playground Tab Contents */}
          <div className="min-h-[400px]">
            {/* Tab 1: Compliance Dashboard Mockup */}
            {activePlaygroundTab === 'compliance' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <h3 className="text-sm uppercase font-extrabold text-neutral-400 dark:text-neutral-500 tracking-wider">
                    Select Account Directory
                  </h3>
                  {(['macys', 'cvs', 'chevron'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setSelectedAccount(key)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedAccount === key
                          ? 'border-brand-navy bg-brand-navy/5 dark:border-brand-orange dark:bg-brand-orange/5 shadow-md scale-[1.01]'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                          {key === 'macys' ? "Macy's" : key === 'cvs' ? 'CVS Health' : 'Chevron'}
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          {complianceMockData[key].projects.length} Active Projects
                        </p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          complianceMockData[key].rag === 'GREEN'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30'
                            : complianceMockData[key].rag === 'AMBER'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900/30'
                        }`}
                      >
                        {complianceMockData[key].rag}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-8 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800/60 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div>
                      <span className="text-xs font-semibold text-neutral-400">Selected Corporate Account</span>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
                        {complianceMockData[selectedAccount].name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-neutral-400">Compliance Score</span>
                        <div className="text-2xl font-black text-brand-navy dark:text-brand-orange">
                          {complianceMockData[selectedAccount].score}%
                        </div>
                      </div>
                      {/* Circular Progress Ring */}
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="rgba(217, 119, 6, 0.1)"
                          strokeWidth="4"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#d97706"
                          strokeWidth="4"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - complianceMockData[selectedAccount].score / 100)}
                          className="transition-all duration-500 ease-out"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider mb-3">
                        Active Project Roster
                      </h4>
                      <ul className="space-y-2 p-0 m-0">
                        {complianceMockData[selectedAccount].projects.map((proj, idx) => (
                          <li
                            key={idx}
                            className="bg-white dark:bg-neutral-900 px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-brand-orange" />
                            {proj}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider mb-3">
                        RAG Governance Actions & Alerts
                      </h4>
                      <div className="space-y-2">
                        {complianceMockData[selectedAccount].alerts.map((alt, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                              alt.type === 'success'
                                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-400'
                                : alt.type === 'warning'
                                ? 'bg-amber-50/50 border-amber-100 text-amber-800 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400'
                                : alt.type === 'danger'
                                ? 'bg-red-50/50 border-red-100 text-red-800 dark:bg-red-950/10 dark:border-red-900/30 dark:text-red-400'
                                : 'bg-blue-50/50 border-blue-100 text-blue-800 dark:bg-blue-950/10 dark:border-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            <span>
                              {alt.type === 'success' && '✓'}
                              {alt.type === 'warning' && '⚠️'}
                              {alt.type === 'danger' && '🛑'}
                              {alt.type === 'info' && '🛈'}
                            </span>
                            <p className="m-0 leading-relaxed">{alt.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: AI Workspace & Websockets Simulator */}
            {activePlaygroundTab === 'ai-workspace' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      Document Processing & AI Generator
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      Delivery Leads upload raw status decks (PPTX, PDF). BullMQ background jobs parse them, and broadcast real-time events over WebSockets before generating editable AI markdown drafts.
                    </p>

                    {/* Interactive Dropzone Trigger */}
                    <button
                      onClick={runAiSimulation}
                      disabled={isSimulating}
                      className={`w-full py-8 px-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        isSimulating
                          ? 'border-brand-orange bg-brand-orange/5 cursor-wait'
                          : 'border-neutral-300 hover:border-brand-navy dark:border-neutral-700 dark:hover:border-brand-orange hover:bg-neutral-50 dark:hover:bg-neutral-800/20'
                      }`}
                    >
                      <svg
                        className={`w-10 h-10 ${isSimulating ? 'text-brand-orange animate-spin' : 'text-neutral-400'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        {isSimulating ? 'Processing file extraction...' : 'Upload & Parse StatusReport.pdf'}
                      </span>
                      <span className="text-[10px] text-neutral-400">Simulates BullMQ + WS processing</span>
                    </button>
                  </div>

                  {/* Terminal Log Console */}
                  <div className="mt-4 bg-neutral-900 text-neutral-200 font-mono text-[11px] p-4 rounded-xl border border-neutral-800 flex-1 min-h-[140px] flex flex-col justify-end">
                    <span className="text-brand-orange font-bold border-b border-neutral-800 pb-1.5 mb-2 block">
                      📡 Live WebSocket Events (wss://api.factpulse.factspan.com/realtime)
                    </span>
                    <div className="space-y-1 overflow-y-auto max-h-[100px] text-left">
                      {simulationLogs.length === 0 ? (
                        <span className="text-neutral-500 italic">Waiting to upload document...</span>
                      ) : (
                        simulationLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed">
                            {log}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-neutral-100 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-400">AI Draft Editor</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          draftState === 'UNDER_REVIEW'
                            ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950/30'
                            : draftState === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30'
                            : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {draftState}
                      </span>
                    </div>
                    {draftState === 'UNDER_REVIEW' && (
                      <button
                        onClick={publishAiDraft}
                        className="bg-brand-navy hover:bg-neutral-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded transition-all cursor-pointer active:scale-95"
                      >
                        Publish Report
                      </button>
                    )}
                  </div>

                  <div className="flex-1 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-y-auto max-h-[250px] min-h-[220px]">
                    {aiDraftContent ? (
                      <pre className="text-left font-mono text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap select-text leading-relaxed">
                        {aiDraftContent}
                      </pre>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-neutral-400 italic text-xs gap-2">
                        <span>💡 Upload a file to generate context-aware Weekly Notes automatically.</span>
                        {isSimulating && (
                          <div className="w-24 bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-orange h-full animate-pulse w-2/3" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Stakeholder Management Org tree Mockup */}
            {activePlaygroundTab === 'stakeholders' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-left">
                  <h4 className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider mb-4">
                    Buying Center Stakeholder Organization Tree
                  </h4>

                  {/* Render simulated Hierarchy Tree */}
                  <div className="space-y-4 font-sans text-xs">
                    {/* Tier 1 */}
                    <div className="flex items-center gap-4">
                      <div
                        onClick={() => setSelectedStakeholderId('1')}
                        className={`p-3 rounded-xl border flex-1 transition-all cursor-pointer flex items-center justify-between ${
                          selectedStakeholderId === '1'
                            ? 'border-brand-navy bg-brand-navy/5 dark:border-brand-orange dark:bg-brand-orange/5'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white m-0">Sarah Jenkins</p>
                          <p className="text-[10px] text-neutral-400 m-0">VP of Digital Technology</p>
                        </div>
                        <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/25" />
                      </div>
                    </div>

                    {/* Connecting line */}
                    <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-700 ml-6" />

                    {/* Tier 2 */}
                    <div className="flex items-center gap-4 pl-6">
                      <div
                        onClick={() => setSelectedStakeholderId('2')}
                        className={`p-3 rounded-xl border flex-1 transition-all cursor-pointer flex items-center justify-between ${
                          selectedStakeholderId === '2'
                            ? 'border-brand-navy bg-brand-navy/5 dark:border-brand-orange dark:bg-brand-orange/5'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white m-0">David Miller</p>
                          <p className="text-[10px] text-neutral-400 m-0">IT Delivery Director</p>
                        </div>
                        <span className="w-3 h-3 rounded-full bg-neutral-400" />
                      </div>
                    </div>

                    {/* Connecting line */}
                    <div className="w-0.5 h-4 bg-neutral-300 dark:bg-neutral-700 ml-12" />

                    {/* Tier 3 */}
                    <div className="flex items-center gap-4 pl-12">
                      <div
                        onClick={() => setSelectedStakeholderId('3')}
                        className={`p-3 rounded-xl border flex-1 transition-all cursor-pointer flex items-center justify-between ${
                          selectedStakeholderId === '3'
                            ? 'border-brand-navy bg-brand-navy/5 dark:border-brand-orange dark:bg-brand-orange/5'
                            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white m-0">Alok Mehta</p>
                          <p className="text-[10px] text-neutral-400 m-0">Principal Architect</p>
                        </div>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            stakeholders.find((s) => s.id === '3')?.sentiment === 'NEUTRAL'
                              ? 'bg-amber-400'
                              : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-left flex flex-col justify-between min-h-[300px]">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-neutral-400 tracking-wider">
                      Stakeholder Detail Profile
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                      {stakeholders.find((s) => s.id === selectedStakeholderId)?.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-semibold mt-0.5">
                      {stakeholders.find((s) => s.id === selectedStakeholderId)?.role}
                    </p>

                    <div className="mt-6 space-y-3">
                      <div className="flex justify-between items-center text-xs border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <span className="text-neutral-400">Current Sentiment Badge:</span>
                        <span
                          className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                            stakeholders.find((s) => s.id === selectedStakeholderId)?.sentiment === 'POSITIVE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20'
                              : stakeholders.find((s) => s.id === selectedStakeholderId)?.sentiment === 'NEUTRAL'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/20'
                          }`}
                        >
                          {stakeholders.find((s) => s.id === selectedStakeholderId)?.sentiment}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400">Last Touchpoint Logged:</span>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {stakeholders.find((s) => s.id === selectedStakeholderId)?.lastConnect}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => logStakeholderConnect(selectedStakeholderId)}
                    className="w-full mt-6 bg-brand-navy hover:bg-neutral-900 text-white font-bold py-2.5 rounded-lg text-xs transition-all cursor-pointer active:scale-95 text-center"
                  >
                    🤝 Log Client Touchpoint / Connect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The 11 Checkpoints Governance Rituals Grid */}
      <section className="w-full py-16 px-6 bg-neutral-100 dark:bg-neutral-950/40 relative border-y border-neutral-200/50 dark:border-neutral-800/40">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              The 11 Governance Checkpoints
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-[600px] mx-auto">
              Fact+Pulse tracks and compliance-scores the complete operational cadence for enterprise accounts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'Weekly Notes', desc: 'Project status compilations.', icon: '📝' },
              { title: 'WBR Standups', desc: 'Weekly Business Reviews.', icon: '📅' },
              { title: 'MBR Synces', desc: 'Monthly Business Reviews.', icon: '📊' },
              { title: 'QBR Sessions', desc: 'Quarterly Executive alignments.', icon: '🎯' },
              { title: 'NPS Surveys', desc: 'Systemized client feedback score.', icon: '⭐' },
              { title: 'CSAT Metrics', desc: 'Customer satisfaction records.', icon: '❤️' },
              { title: 'Security Reviews', desc: 'Compliance validation logs.', icon: '🛡️' },
              { title: 'Risk Registers', desc: 'Proactive mitigation tracking.', icon: '⚠️' },
              { title: 'Stakeholder Trees', desc: 'Org charts and connects.', icon: '🌳' },
              { title: 'Sentiment Tracking', desc: 'Relationship health indexes.', icon: '💬' },
              { title: '1-on-1 Logs', desc: 'Delivery resource health.', icon: '👥' }
            ].map((chk, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-brand-orange/30 group text-left"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform inline-block mb-2">
                  {chk.icon}
                </span>
                <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{chk.title}</h4>
                <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">{chk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Dashboards & Workflows */}
      <section className="w-full py-16 px-6 max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Role-Tailored Operational Views
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-[600px] mx-auto">
            The platform serves the entire hierarchy with specific access privileges and interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              role: 'Account Lead',
              badge: 'ACCOUNT_LEAD',
              desc: 'Oversees absolute governance scores, manages stakeholder charts, aligns NPS surveys, and handles client relation escalations.',
              color: 'text-brand-orange border-brand-orange/20 bg-brand-orange/5'
            },
            {
              role: 'Delivery Lead',
              badge: 'DELIVERY_LEAD',
              desc: 'Tracks project checklist compliance daily, logs weekly standups, uploads raw status files, and edits AI-generated draft briefs.',
              color: 'text-brand-purple border-brand-purple/20 bg-brand-purple/5'
            },
            {
              role: 'Executive Leadership',
              badge: 'EXECUTIVE_LEADERSHIP',
              desc: 'Has access to high-level portfolio cards, reading total corporate scores, client sentiment RAG markers, and missing-ritual alerts.',
              color: 'text-brand-navy border-brand-navy/20 bg-brand-navy/5'
            },
            {
              role: 'Platform Admin',
              badge: 'PLATFORM_ADMIN',
              desc: 'IT administration workspace with capabilities to manage users, configure workspace tabs, seed db assets, and audit connection rooms.',
              color: 'text-neutral-500 border-neutral-500/20 bg-neutral-500/5'
            }
          ].map((roleObj, idx) => (
            <div
              key={idx}
              className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl text-left hover:shadow-lg transition-all duration-300"
            >
              <span className={`text-[9px] font-black tracking-widest uppercase border px-2 py-1 rounded-full ${roleObj.color}`}>
                {roleObj.badge}
              </span>
              <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white mt-4">{roleObj.role}</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{roleObj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Architecture & Security */}
      <section className="w-full py-16 px-6 bg-neutral-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest">
              Technical Architecture Specs
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
              Built for Scale, Security, and Speed
            </h2>
            <p className="text-xs text-neutral-400 mt-2 max-w-[500px] mx-auto">
              Real-time synchronization and secure dual-token authentication protocols inside the core engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 text-left">
              <h4 className="font-extrabold text-xs text-brand-orange uppercase tracking-wider mb-2">
                🔒 Dual-Token Security
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Tokens are stored securely: JWT Access Tokens reside strictly in-memory (combating XSS), while 27-day Refresh Tokens are configured inside <code>HttpOnly SameSite=Lax Secure</code> cookies. Proactive silent refreshing triggers every 55 minutes to minimize latency.
              </p>
            </div>

            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 text-left">
              <h4 className="font-extrabold text-xs text-brand-orange uppercase tracking-wider mb-2">
                📡 Socket.io WebSockets
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Connects to <code>wss://api.factpulse.factspan.com/realtime</code>. Integrates with the backend event gateway to pipe instant file extraction indicators, project RAG updates, and BullMQ worker job notifications straight to client dashboards.
              </p>
            </div>

            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 text-left">
              <h4 className="font-extrabold text-xs text-brand-orange uppercase tracking-wider mb-2">
                ⚡ BullMQ Queue Processing
              </h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Deploys Redis-based BullMQ task schedulers inside the backend framework to queue raw document extractions and LLM-assisted compiling. Assures heavy processing routines run in background threads without blocking client interface operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-purple text-white py-16 px-6 text-center relative z-10">
        <h2 className="font-extrabold text-2xl xs:text-3xl sm:text-4xl tracking-tight mb-4 text-white">
          Establish Operational Excellence Today
        </h2>
        <p className="text-sm text-neutral-200 max-w-[650px] mx-auto mb-8 leading-relaxed">
          Unify team delivery rhythms, automate compilation overhead, monitor project metrics, and visual-score compliance. Get started with Fact+Pulse.
        </p>
        {isAuthenticated ? (
          <Link
            to="/portfolio"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm py-3.5 px-8 rounded-lg transition-colors no-underline shadow-lg shadow-brand-orange/30 active:scale-95"
          >
            Access Command Center
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm py-3.5 px-8 rounded-lg transition-colors no-underline shadow-lg shadow-brand-orange/30 active:scale-95"
          >
            Access Command Center (Google SSO)
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-500 py-6 text-center text-xs border-t border-neutral-900 font-medium relative z-10">
        © 2026 Factspan Inc. All rights reserved. Delivery Governance Operating System (Fact+Pulse v1.0).
      </footer>
    </div>
  );
}

