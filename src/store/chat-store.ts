import { create } from 'zustand';
import api from '../api';

export interface ChatSessionRef {
  id: string;
  name: string;
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  accountId: string;
  projectId: string;
  account?: ChatSessionRef;
  project?: ChatSessionRef;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt?: string;
}

interface ChatState {
  sessions: ChatSessionSummary[];
  currentSession: ChatSessionSummary | null;
  messages: ChatMessage[];
  loadingSessions: boolean;
  loadingMessages: boolean;
  streaming: boolean;
  error: string | null;

  loadSessions: () => Promise<void>;
  startNewChat: () => void;
  createSession: (accountId: string, projectId: string) => Promise<ChatSessionSummary | null>;
  openSession: (id: string) => Promise<void>;
  renameSession: (id: string, title: string) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  sendMessage: (content: string, sessionId?: string) => Promise<void>;
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '');

function genId() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: [],
  currentSession: null,
  messages: [],
  loadingSessions: false,
  loadingMessages: false,
  streaming: false,
  error: null,

  loadSessions: async () => {
    set({ loadingSessions: true, error: null });
    try {
      const res = await api.get('/ai/chat/sessions');
      set({ sessions: res.data.data || [], loadingSessions: false });
    } catch (e: any) {
      set({ loadingSessions: false, error: e?.message || 'Failed to load chats' });
    }
  },

  startNewChat: () => {
    set({ currentSession: null, messages: [], error: null });
  },

  createSession: async (accountId, projectId) => {
    try {
      const res = await api.post('/ai/chat/sessions', { accountId, projectId });
      const session: ChatSessionSummary = res.data.data;
      set((state) => ({
        currentSession: session,
        messages: [],
        sessions: [session, ...state.sessions.filter((s) => s.id !== session.id)],
      }));
      return session;
    } catch (e: any) {
      set({ error: e?.response?.data?.message || e?.message || 'Failed to create chat' });
      return null;
    }
  },

  openSession: async (id) => {
    set({ loadingMessages: true, error: null });
    try {
      const res = await api.get(`/ai/chat/sessions/${id}`);
      const session = res.data.data;
      set({
        currentSession: {
          id: session.id,
          title: session.title,
          accountId: session.accountId,
          projectId: session.projectId,
          account: session.account,
          project: session.project,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        },
        messages: session.messages || [],
        loadingMessages: false,
      });
    } catch (e: any) {
      set({ loadingMessages: false, error: e?.message || 'Failed to open chat' });
    }
  },

  renameSession: async (id, title) => {
    try {
      const res = await api.patch(`/ai/chat/sessions/${id}`, { title });
      const updated: ChatSessionSummary = res.data.data;
      set((state) => ({
        sessions: state.sessions.map((s) => (s.id === id ? { ...s, title: updated.title } : s)),
        currentSession:
          state.currentSession?.id === id
            ? { ...state.currentSession, title: updated.title }
            : state.currentSession,
      }));
    } catch (e: any) {
      set({ error: e?.message || 'Failed to rename chat' });
    }
  },

  deleteSession: async (id) => {
    try {
      await api.delete(`/ai/chat/sessions/${id}`);
      set((state) => {
        const isCurrent = state.currentSession?.id === id;
        return {
          sessions: state.sessions.filter((s) => s.id !== id),
          currentSession: isCurrent ? null : state.currentSession,
          messages: isCurrent ? [] : state.messages,
        };
      });
    } catch (e: any) {
      set({ error: e?.message || 'Failed to delete chat' });
    }
  },

  sendMessage: async (content, sessionId) => {
    let activeSession = get().currentSession;
    if (sessionId) {
      if (activeSession?.id !== sessionId) {
        activeSession =
          get().sessions.find((s) => s.id === sessionId) || activeSession;
        if (activeSession) {
          set({ currentSession: activeSession });
        }
      }
    }
    if (!activeSession || !content.trim() || get().streaming) return;

    const userMsg: ChatMessage = { id: genId(), role: 'USER', content };
    const assistantMsg: ChatMessage = { id: genId(), role: 'ASSISTANT', content: '' };

    set((state) => ({
      messages: [...state.messages, userMsg, assistantMsg],
      streaming: true,
      error: null,
    }));

    const appendToAssistant = (text: string) => {
      set((state) => {
        const messages = [...state.messages];
        const last = messages[messages.length - 1];
        if (last && last.id === assistantMsg.id) {
          messages[messages.length - 1] = { ...last, content: last.content + text };
        }
        return { messages };
      });
    };

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/ai/chat/sessions/${activeSession.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const evt of events) {
            const line = evt.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(payload);
              if (parsed.token) appendToAssistant(parsed.token);
              if (parsed.error) set({ error: parsed.error });
            } catch {
              // Ignore malformed keep-alive/partial lines.
            }
          }
        }
      }
    } catch (e: any) {
      const errMsg = e?.message || 'Failed to get a response';
      set({ error: errMsg });
      appendToAssistant('\n\n_Sorry, something went wrong while generating a response._');
    } finally {
      set({ streaming: false });
      get().loadSessions();
    }
  },
}));
