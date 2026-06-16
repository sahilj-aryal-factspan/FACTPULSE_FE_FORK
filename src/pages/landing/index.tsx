import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';
import ThemeToggle from '../../components/ThemeToggle';

export default function LandingPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors duration-200">
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 py-3 xs:px-6 xs:py-4 sm:px-8 4k:px-16 4k-tv:px-24 flex items-center justify-between transition-colors duration-200">
        <Link
          to="/"
          className="font-extrabold text-xl xs:text-2xl 4k:text-4xl 4k-tv:text-5xl text-brand-navy dark:text-white tracking-tight no-underline"
        >
          FACT<span className="text-brand-orange">PULSE</span>
        </Link>
        <div className="flex items-center gap-3 xs:gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/portfolio"
              className="bg-brand-navy hover:bg-brand-navy-dark text-white text-xs xs:text-sm 4k:text-xl 4k-tv:text-2xl font-semibold py-2 px-4 rounded-lg transition-colors no-underline shadow-md shadow-brand-navy/10"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-brand-navy dark:text-neutral-300 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 text-xs xs:text-sm 4k:text-xl 4k-tv:text-2xl font-semibold py-2 px-3 xs:px-4 rounded-lg transition-colors no-underline"
              >
                Sign In
              </Link>
              <Link
                to="/login"
                className="bg-brand-navy hover:bg-brand-navy-dark text-white text-xs xs:text-sm 4k:text-xl 4k-tv:text-2xl font-semibold py-2 px-4 rounded-lg transition-colors no-underline shadow-md shadow-brand-navy/10"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-[1200px] 4k:max-w-[2000px] 4k-tv:max-w-[3000px] mx-auto px-4 py-16 xs:px-6 xs:py-20 sm:px-8 sm:py-24 4k:py-40 4k-tv:py-52 text-center transition-colors duration-200">
        <span className="inline-block bg-brand-orange/10 text-brand-orange text-[10px] xs:text-xs 4k:text-base 4k-tv:text-lg font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 xs:mb-6">
          Governance First MVP
        </span>
        <h1 className="font-extrabold text-3xl xs:text-4xl sm:text-5xl 4k:text-7xl 4k-tv:text-8xl text-brand-navy dark:text-white leading-tight max-w-[850px] 4k:max-w-[1500px] mx-auto tracking-tight">
          Eliminate Governance Blindspots and Delivery Fragmentation
        </h1>
        <p className="text-sm xs:text-base sm:text-lg 4k:text-2xl 4k-tv:text-3xl text-neutral-500 dark:text-neutral-400 mt-4 max-w-[650px] 4k:max-w-[1100px] mx-auto leading-relaxed font-medium">
          Fact+Pulse unites weekly updates, business reviews, and stakeholder sentiment into a
          single centralized command center. Empower your delivery leads with AI-assisted report
          generation.
        </p>
        <div className="flex flex-col xs:flex-row justify-center items-center gap-3 xs:gap-4 mt-8">
          {isAuthenticated ? (
            <Link
              to="/portfolio"
              className="w-full xs:w-auto text-center bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold text-sm xs:text-base 4k:text-2xl 4k-tv:text-3xl py-3 px-6 rounded-lg transition-colors shadow-md shadow-brand-navy/20 no-underline"
            >
              Access Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full xs:w-auto text-center bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold text-sm xs:text-base 4k:text-2xl 4k-tv:text-3xl py-3 px-6 rounded-lg transition-colors shadow-md shadow-brand-navy/20 no-underline"
            >
              Sign In to Platform
            </Link>
          )}
          <a
            href="#challenges"
            className="w-full xs:w-auto text-center bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-brand-navy dark:text-white border border-neutral-300 dark:border-neutral-700 font-semibold text-sm xs:text-base 4k:text-2xl 4k-tv:text-3xl py-3 px-6 rounded-lg transition-colors no-underline"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Challenges Section */}
      <section
        id="challenges"
        className="w-full py-16 px-4 xs:px-6 sm:px-8 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800 transition-colors duration-200"
      >
        <div className="max-w-[1100px] 4k:max-w-[1800px] 4k-tv:max-w-[2400px] mx-auto">
          <div className="text-center mb-10 xs:mb-12">
            <h2 className="font-extrabold text-2xl xs:text-3xl sm:text-4xl 4k:text-5xl 4k-tv:text-6xl text-brand-navy dark:text-white tracking-tight">
              The Governance Challenge
            </h2>
            <p className="text-sm xs:text-base 4k:text-xl 4k-tv:text-2xl text-neutral-500 dark:text-neutral-400 max-w-[600px] 4k:max-w-[1000px] mx-auto mt-2">
              Factspan managers handle enterprise accounts across fragmented channels. Here is how
              Fact+Pulse bridges the gap.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8">
            {/* Fragmented Current Scenario */}
            <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 rounded-2xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left">
              <h3 className="text-lg xs:text-xl 4k:text-3xl 4k-tv:text-4xl font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                <span>⚠️</span> Current fragmented state
              </h3>
              <ul className="list-none p-0 m-0 space-y-4 text-xs xs:text-sm sm:text-base 4k:text-xl 4k-tv:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400">
                <li className="relative pl-6 before:content-['✕'] before:text-red-500 before:absolute before:left-0 before:font-bold">
                  Governance notes are scattered across WBRs, MBRs, emails, Excel sheets, and shared
                  folders.
                </li>
                <li className="relative pl-6 before:content-['✕'] before:text-red-500 before:absolute before:left-0 before:font-bold">
                  Leads waste up to 8 hours weekly gathering, compiling, and validating project
                  compliance logs.
                </li>
                <li className="relative pl-6 before:content-['✕'] before:text-red-500 before:absolute before:left-0 before:font-bold">
                  Stakeholder connections and client sentiment are managed manually via unstructured
                  trackers.
                </li>
                <li className="relative pl-6 before:content-['✕'] before:text-red-500 before:absolute before:left-0 before:font-bold">
                  No automated warnings exist to flag missed connects, delayed reviews, or missing
                  weekly notes.
                </li>
                <li className="relative pl-6 before:content-['✕'] before:text-red-500 before:absolute before:left-0 before:font-bold">
                  Leadership lacks a unified dashboard to audit delivery health across Macy's, CVS,
                  and others in real-time.
                </li>
              </ul>
            </div>

            {/* FactPulse Solution */}
            <div className="bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left">
              <h3 className="text-lg xs:text-xl 4k:text-3xl 4k-tv:text-4xl font-bold text-brand-navy dark:text-brand-orange mb-4 flex items-center gap-2">
                <span>⚡</span> Centralized Governance OS
              </h3>
              <ul className="list-none p-0 m-0 space-y-4 text-xs xs:text-sm sm:text-base 4k:text-xl 4k-tv:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400">
                <li className="relative pl-6 before:content-['✓'] before:text-emerald-500 before:absolute before:left-0 before:font-bold">
                  All governance activities are unified in a single, secure Web UI dashboard.
                </li>
                <li className="relative pl-6 before:content-['✓'] before:text-emerald-500 before:absolute before:left-0 before:font-bold">
                  Draft Weekly Notes and WBR slide reports in seconds using context-aware AI
                  generation.
                </li>
                <li className="relative pl-6 before:content-['✓'] before:text-emerald-500 before:absolute before:left-0 before:font-bold">
                  Map buying center stakeholders, reporting trees, tenure, and client sentiment
                  indexes.
                </li>
                <li className="relative pl-6 before:content-['✓'] before:text-emerald-500 before:absolute before:left-0 before:font-bold">
                  Get automated push alerts and visual markers for overdue standups and upcoming
                  reviews.
                </li>
                <li className="relative pl-6 before:content-['✓'] before:text-emerald-500 before:absolute before:left-0 before:font-bold">
                  Provide executives with instant RAG indicators and compliance score cards in under
                  5 minutes.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="w-full py-16 px-4 xs:px-6 sm:px-8 bg-neutral-100 dark:bg-neutral-950 transition-colors duration-200">
        <div className="max-w-[1100px] 4k:max-w-[1800px] 4k-tv:max-w-[2400px] mx-auto">
          <div className="text-center mb-10 xs:mb-12">
            <h2 className="font-extrabold text-2xl xs:text-3xl sm:text-4xl 4k:text-5xl 4k-tv:text-6xl text-brand-navy dark:text-white tracking-tight">
              Key Capabilities
            </h2>
            <p className="text-sm xs:text-base 4k:text-xl 4k-tv:text-2xl text-neutral-500 dark:text-neutral-400 max-w-[600px] 4k:max-w-[1000px] mx-auto mt-2">
              A comprehensive toolset designed for Account Leads, Delivery Leads, and Executive
              Leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/20 dark:text-neutral-200">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Executive Command Center
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                High-level portfolio dashboards outlining account RAG metrics, compliance health
                trends, and alert indicators.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <line x1="15" y1="3" x2="15" y2="21" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                11-Checkpoint Tracking
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Log and track standups, reviews (WBR/MBR/QBR), NPS surveys, security reviews, and
                employee 1x1 milestones.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                AI Workspace
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Process uploaded document artifacts to extract actions/risks and compile
                markdown-based WBR and Weekly Notes drafts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Stakeholder Sentiment Mapping
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Map buying centers reporting trees, track connect timelines, and flag relationship
                risks with sentiment coloring indicators.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-navy/10 text-brand-navy dark:bg-brand-navy/20 dark:text-neutral-200">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Future-Proof MCP Layers
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Client-side integrations ready to connect with Google Drive, Gmail, Docs, Slack, and
                Jira through the Model Context Protocol.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 xs:p-8 4k:p-12 4k-tv:p-16 text-left hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/20">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h4 className="text-base xs:text-lg 4k:text-2xl 4k-tv:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Real-Time Risk Board
              </h4>
              <p className="text-xs xs:text-sm 4k:text-lg 4k-tv:text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">
                A central board logging identified execution risks and assigned mitigation tasks to
                ensure zero dropped balls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="bg-gradient-to-r from-brand-navy to-brand-purple text-white py-16 px-4 text-center">
        <h2 className="font-extrabold text-2xl xs:text-3xl sm:text-4xl 4k:text-5xl 4k-tv:text-6xl text-white tracking-tight mb-4">
          Establish Operational Excellence Today
        </h2>
        <p className="text-sm xs:text-base 4k:text-xl 4k-tv:text-2xl text-neutral-200 max-w-[600px] mx-auto mb-8 leading-relaxed">
          Unify your team’s delivery, monitor compliance rates, and automate reporting overhead.
          Access the Fact+Pulse Command Center.
        </p>
        {isAuthenticated ? (
          <Link
            to="/portfolio"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm xs:text-base 4k:text-2xl 4k-tv:text-3xl py-3.5 px-8 rounded-lg transition-colors no-underline shadow-lg shadow-brand-orange/30"
          >
            Access Command Center
          </Link>
        ) : (
          <Link
            to="/login"
            className="inline-block bg-brand-orange hover:bg-orange-600 text-white font-bold text-sm xs:text-base 4k:text-2xl 4k-tv:text-3xl py-3.5 px-8 rounded-lg transition-colors no-underline shadow-lg shadow-brand-orange/30"
          >
            Sign In with Google SSO
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 text-neutral-500 py-6 text-center text-xs xs:text-sm 4k:text-lg border-t border-neutral-900 font-medium">
        © 2026 Factspan Inc. All rights reserved. Delivery Governance Operating System (Fact+Pulse
        v1.0).
      </footer>
    </div>
  );
}
