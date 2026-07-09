import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { useDataStore } from '../../store/data-store';
import { useChatStore } from '../../store/chat-store';

const NAVY = '#1e3a8a';
const ORANGE = '#d97706';
const BORDER = '#e2e8f0';
const MUTED = '#64748b';

const SUGGESTIONS = [
  'What is the overall governance health of this project?',
  'List the open high-severity risks and their owners.',
  'Which governance check-gates are non-compliant?',
  'Who are the key people on this account and project?',
];

export default function FactsAiPage() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const navigate = useNavigate();
  const { accounts, projects } = useDataStore();
  const {
    sessions,
    currentSession,
    messages,
    loadingSessions,
    streaming,
    error,
    loadSessions,
    startNewChat,
    createSession,
    openSession,
    renameSession,
    deleteSession,
    sendMessage,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (conversationId) {
      if (currentSession?.id !== conversationId) {
        openSession(conversationId);
      }
    } else {
      startNewChat();
    }
    // Only react to URL changes — session state is updated by the store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const nextHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = `${nextHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > 150 ? 'auto' : 'hidden';
    }
  }, [input]);

  const accountProjects = useMemo(
    () => projects.filter((p) => p.accountId === selectedAccountId),
    [projects, selectedAccountId],
  );

  const isNewChat = !currentSession;
  const canSendNew = !!selectedAccountId && !!selectedProjectId;
  const composerDisabled = streaming || (isNewChat && !canSendNew);

  const handleNewChat = () => {
    navigate('/facts-ai');
    setSelectedAccountId('');
    setSelectedProjectId('');
    setInput('');
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    let sessionId = currentSession?.id;
    if (!sessionId) {
      if (!selectedAccountId || !selectedProjectId) return;
      const created = await createSession(selectedAccountId, selectedProjectId);
      if (!created) return;
      sessionId = created.id;
      navigate(`/facts-ai/${created.id}`, { replace: true });
    }
    setInput('');
    await sendMessage(text, sessionId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRename = async (id: string, currentTitle: string) => {
    const next = window.prompt('Rename chat', currentTitle);
    if (next && next.trim() && next.trim() !== currentTitle) {
      await renameSession(id, next.trim());
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this chat? This cannot be undone.')) {
      const wasCurrent = currentSession?.id === id;
      await deleteSession(id);
      if (wasCurrent) {
        navigate('/facts-ai');
      }
    }
  };

  const fillSuggestion = (text: string) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%', background: '#f5f6f8' }}>
      {/* ===== History Sidebar ===== */}
      <aside
        style={{
          width: '280px',
          minWidth: '280px',
          background: '#ffffff',
          borderRight: `1px solid ${BORDER}`,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '16px' }}>
          <button
            onClick={handleNewChat}
            style={{
              width: '100%',
              background: NAVY,
              color: '#ffffff',
              border: 'none',
              padding: '10px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> New chat
          </button>
        </div>

        <div style={{ padding: '0 16px 8px', fontSize: '11px', fontWeight: 700, color: MUTED, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Chat history
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px 16px' }}>
          {loadingSessions && (
            <div style={{ padding: '12px 8px', color: MUTED, fontSize: '13px' }}>Loading…</div>
          )}
          {!loadingSessions && sessions.length === 0 && (
            <div style={{ padding: '12px 8px', color: MUTED, fontSize: '13px' }}>
              No chats yet. Start a new one.
            </div>
          )}
          {sessions.map((s) => {
            const active = currentSession?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => navigate(`/facts-ai/${s.id}`)}
                style={{
                  padding: '10px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginBottom: '2px',
                  background: active ? 'rgba(217, 119, 6, 0.08)' : 'transparent',
                  borderLeft: active ? `3px solid ${ORANGE}` : '3px solid transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  position: 'relative',
                }}
                onMouseOver={(e) => {
                  if (!active) e.currentTarget.style.background = '#f8fafc';
                }}
                onMouseOut={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: active ? NAVY : '#1e293b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    paddingRight: '44px',
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: '11px', color: MUTED, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '44px' }}>
                  {s.account?.name}{s.project?.name ? ` · ${s.project.name}` : ''}
                </div>
                <div style={{ position: 'absolute', top: '8px', right: '6px', display: 'flex', gap: '2px' }}>
                  <button
                    title="Rename"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(s.id, s.title);
                    }}
                    style={iconBtnStyle}
                  >
                    ✎
                  </button>
                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(s.id);
                    }}
                    style={iconBtnStyle}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* ===== Main Chat Panel ===== */}
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Context bar */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: `1px solid ${BORDER}`,
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: NAVY }}>FactsAi</span>
            <span style={{ fontSize: '12px', color: MUTED }}>
              Ask about governance health, risks, owners and compliance
            </span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isNewChat ? (
              <>
                <select
                  value={selectedAccountId}
                  onChange={(e) => {
                    setSelectedAccountId(e.target.value);
                    setSelectedProjectId('');
                  }}
                  style={selectStyle}
                >
                  <option value="">Select account…</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={!selectedAccountId}
                  style={{ ...selectStyle, opacity: selectedAccountId ? 1 : 0.6 }}
                >
                  <option value="">Select project…</option>
                  {accountProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={pillStyle}>{currentSession?.account?.name}</span>
                <span style={{ color: MUTED }}>›</span>
                <span style={pillStyle}>{currentSession?.project?.name}</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 24px', background: '#fef2f2', color: '#b91c1c', fontSize: '13px', borderBottom: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 0' }}>
          <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 24px' }}>
            {messages.length === 0 ? (
              <EmptyState isNewChat={isNewChat} canSendNew={canSendNew} onPick={fillSuggestion} />
            ) : (
              messages.map((m) => <MessageBubble key={m.id} role={m.role} content={m.content} streaming={streaming} />)
            )}
          </div>
        </div>

        {/* Composer */}
        <div style={{ borderTop: `1px solid ${BORDER}`, background: '#ffffff', padding: '16px 24px' }}>
          <div style={{ maxWidth: '768px', margin: '0 auto' }}>
            {isNewChat && !canSendNew && (
              <div style={{ fontSize: '12px', color: MUTED, marginBottom: '8px' }}>
                Select an account and project above to start a new chat.
              </div>
            )}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '10px',
                border: `1px solid ${BORDER}`,
                borderRadius: '12px',
                padding: '8px 8px 8px 14px',
                background: composerDisabled ? '#f8fafc' : '#ffffff',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message FactsAi…"
                rows={1}
                disabled={composerDisabled}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  maxHeight: '150px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  background: 'transparent',
                  color: '#1e293b',
                }}
              />
              <button
                onClick={handleSend}
                disabled={composerDisabled || !input.trim()}
                style={{
                  background: composerDisabled || !input.trim() ? '#cbd5e1' : ORANGE,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  width: '38px',
                  height: '38px',
                  cursor: composerDisabled || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
                title="Send"
              >
                {streaming ? '…' : '↑'}
              </button>
            </div>
            <div style={{ fontSize: '11px', color: MUTED, marginTop: '6px', textAlign: 'center' }}>
              FactsAi answers using live governance data for the selected account and project.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({
  isNewChat,
  canSendNew,
  onPick,
}: {
  isNewChat: boolean;
  canSendNew: boolean;
  onPick: (text: string) => void;
}) {
  return (
    <div style={{ textAlign: 'center', paddingTop: '48px' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: NAVY,
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
          fontWeight: 800,
          margin: '0 auto 16px',
        }}
      >
        F
      </div>
      <h2 style={{ margin: '0 0 6px', color: NAVY, fontSize: '22px', fontWeight: 700 }}>
        How can I help with governance today?
      </h2>
      <p style={{ margin: '0 0 24px', color: MUTED, fontSize: '14px' }}>
        {isNewChat && !canSendNew
          ? 'Pick an account and project to begin.'
          : 'Ask a question or try one of the prompts below.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '560px', margin: '0 auto' }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            style={{
              textAlign: 'left',
              background: '#ffffff',
              border: `1px solid ${BORDER}`,
              borderRadius: '10px',
              padding: '12px 14px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#334155',
              lineHeight: '1.4',
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = ORANGE)}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = BORDER)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  role,
  content,
  streaming,
}: {
  role: 'USER' | 'ASSISTANT';
  content: string;
  streaming: boolean;
}) {
  const isUser = role === 'USER';
  const showTyping = !isUser && content.length === 0 && streaming;

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '18px' }}>
      {!isUser && (
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: NAVY,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 800,
            marginRight: '10px',
            flexShrink: 0,
          }}
        >
          F
        </div>
      )}
      <div
        style={{
          maxWidth: '80%',
          background: isUser ? NAVY : '#ffffff',
          color: isUser ? '#ffffff' : '#1e293b',
          border: isUser ? 'none' : `1px solid ${BORDER}`,
          borderRadius: '12px',
          padding: isUser ? '10px 14px' : '4px 16px',
          fontSize: '14px',
          lineHeight: '1.6',
          boxShadow: isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
          overflowWrap: 'anywhere',
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
        ) : showTyping ? (
          <TypingDots />
        ) : (
          <div className="factsai-markdown">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '10px 0' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: MUTED,
            display: 'inline-block',
            animation: `factsaiblink 1.2s ${i * 0.2}s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`
        @keyframes factsaiblink {
          0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '12px',
  padding: '2px 4px',
  borderRadius: '4px',
  color: MUTED,
  lineHeight: 1,
};

const selectStyle: React.CSSProperties = {
  padding: '7px 10px',
  border: `1px solid #cbd5e1`,
  borderRadius: '8px',
  fontSize: '13px',
  color: '#1e293b',
  background: '#ffffff',
  maxWidth: '190px',
};

const pillStyle: React.CSSProperties = {
  background: 'rgba(30, 58, 138, 0.08)',
  color: NAVY,
  padding: '4px 10px',
  borderRadius: '999px',
  fontSize: '12px',
  fontWeight: 600,
};
