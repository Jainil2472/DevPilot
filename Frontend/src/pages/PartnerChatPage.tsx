import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import {
  Lock,
  ShieldCheck,
  Send,
  Smile,
  Paperclip,
  Code2,
  Search,
  MessageCircle,
  Users,
  GitPullRequest,
  GitBranch,
  CheckCheck,
  Terminal,
  FileCode2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface OutletContextType {
  globalSearch?: string;
}

type ThreadFilter = 'all' | 'rooms' | 'direct';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  timestamp: string;
  isMe: boolean;
}

interface ChatThread {
  id: string;
  name: string;
  handleOrRole: string;
  type: 'room' | 'direct';
  isGroupE2E?: boolean;
  online?: boolean;
  unreadCount: number;
  lastTime: string;
  linkedProject: string;
  linkedBranch: string;
  avatar?: string;
  fingerprint: string;
  members: {
    name: string;
    role: string;
    avatar: string;
    online: boolean;
  }[];
  sharedItems: {
    id: string;
    title: string;
    subtitle: string;
    type: 'pr' | 'file';
  }[];
}

// --- Initial DevPilot Threads & Messages ---
const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'chat-1',
    name: 'Connect 4 Team',
    handleOrRole: '4 Members • Project Room',
    type: 'room',
    isGroupE2E: true,
    unreadCount: 2,
    lastTime: 'Just now',
    linkedProject: 'Connect 4',
    linkedBranch: 'feat/minimax-ai',
    fingerprint: '8F:4D:2A:99:C1:7E',
    members: [
      {
        name: 'John Carraher',
        role: '@johncarraher',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
      {
        name: 'Sarah Jenkins',
        role: '@sarahj',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
      {
        name: 'Patty Nguyen',
        role: '@pattyn',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
      {
        name: 'Alex Rivera',
        role: '@arivera',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        online: false,
      },
    ],
    sharedItems: [
      { id: 's1', title: 'PR #42: Minimax Depth 7', subtitle: 'Merged 20m ago', type: 'pr' },
      { id: 's2', title: 'socketRoomManager.ts', subtitle: '142 lines • TypeScript', type: 'file' },
      { id: 's3', title: 'minimaxHeuristic.ts', subtitle: '88 lines • TypeScript', type: 'file' },
    ],
  },
  {
    id: 'chat-2',
    name: 'Patty Nguyen',
    handleOrRole: '@pattyn • Full-Stack Developer',
    type: 'direct',
    online: true,
    unreadCount: 1,
    lastTime: '2h ago',
    linkedProject: 'DevPilot Client',
    linkedBranch: 'main',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    fingerprint: '3C:9E:11:B4:08:A2',
    members: [
      {
        name: 'Patty Nguyen',
        role: '@pattyn',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
      {
        name: 'John Carraher',
        role: '@johncarraher',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
    ],
    sharedItems: [
      { id: 's4', title: 'PR #19: JWT Cookie Middleware', subtitle: 'Approved', type: 'pr' },
      { id: 's5', title: 'auth.middleware.ts', subtitle: '64 lines • TypeScript', type: 'file' },
    ],
  },
  {
    id: 'chat-3',
    name: 'Alex Rivera',
    handleOrRole: '@arivera • Backend & Docker',
    type: 'direct',
    online: false,
    unreadCount: 0,
    lastTime: '5h ago',
    linkedProject: 'E-Commerce Core',
    linkedBranch: 'feat/cart-locks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    fingerprint: '7A:2B:90:C4:55:D1',
    members: [
      {
        name: 'Alex Rivera',
        role: '@arivera',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        online: false,
      },
      {
        name: 'John Carraher',
        role: '@johncarraher',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
    ],
    sharedItems: [
      { id: 's6', title: 'docker-compose.yml', subtitle: 'MongoDB replica config', type: 'file' },
    ],
  },
  {
    id: 'chat-4',
    name: 'DevPilot Core Room',
    handleOrRole: '3 Members • Project Room',
    type: 'room',
    isGroupE2E: true,
    unreadCount: 0,
    lastTime: 'Yesterday',
    linkedProject: 'DevPilot Client',
    linkedBranch: 'chore/octokit-webhooks',
    fingerprint: '5E:12:88:F0:33:B9',
    members: [
      {
        name: 'John Carraher',
        role: '@johncarraher',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
      {
        name: 'Patty Nguyen',
        role: '@pattyn',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        online: true,
      },
    ],
    sharedItems: [
      { id: 's7', title: 'octokitWebhook.controller.ts', subtitle: '112 lines • TypeScript', type: 'file' },
    ],
  },
];

const INITIAL_MESSAGES_BY_THREAD: Record<string, ChatMessage[]> = {
  'chat-1': [
    {
      id: 'm1',
      senderId: 'sarah',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Hey team! I just pushed the WebSocket room reconnection patch for Connect 4.',
      timestamp: '10:42 AM',
      isMe: false,
    },
    {
      id: 'm2',
      senderId: 'me',
      senderName: 'John Carraher',
      text: 'Nice! Did we cap the Minimax evaluation depth so turn latency stays under 120ms?',
      timestamp: '10:44 AM',
      isMe: true,
    },
    {
      id: 'm3',
      senderId: 'sarah',
      senderName: 'Sarah Jenkins',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Yes, here is the alpha-beta cutoff guard we added to the worker:',
      codeSnippet: {
        language: 'typescript',
        code: `if (depth === 0 || board.isTerminal()) {\n  return evaluateBoardWindow(board, playerPiece);\n}\n// Alpha-Beta pruning cutoff\nif (alpha >= beta) break;`,
      },
      timestamp: '10:46 AM',
      isMe: false,
    },
    {
      id: 'm4',
      senderId: 'me',
      senderName: 'John Carraher',
      text: 'Clean implementation 👍 Merging PR #42 into feat/minimax-ai right now.',
      timestamp: '10:48 AM',
      isMe: true,
    },
  ],
  'chat-2': [
    {
      id: 'm201',
      senderId: 'patty',
      senderName: 'Patty Nguyen',
      senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
      text: 'Merged the JWT cookie middleware PR! HttpOnly refresh tokens are rotating cleanly now.',
      timestamp: '2h ago',
      isMe: false,
    },
    {
      id: 'm202',
      senderId: 'me',
      senderName: 'John Carraher',
      text: 'Awesome work Patty, I will wire up the ProtectedRoutes check next.',
      timestamp: '1h ago',
      isMe: true,
    },
  ],
  'chat-3': [
    {
      id: 'm301',
      senderId: 'alex',
      senderName: 'Alex Rivera',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      text: 'Can we test the join request endpoint with the new Zod validator schema?',
      timestamp: '5h ago',
      isMe: false,
    },
  ],
  'chat-4': [
    {
      id: 'm401',
      senderId: 'me',
      senderName: 'John Carraher',
      text: 'Octokit automated commit hooks are live on the main monorepo.',
      timestamp: 'Yesterday',
      isMe: true,
    },
  ],
};

const PartnerChatsPage: React.FC = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const globalSearch = outletContext?.globalSearch ?? '';

  // State
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('chat-1');
  const [threadFilter, setThreadFilter] = useState<ThreadFilter>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    INITIAL_MESSAGES_BY_THREAD
  );
  const [messageInput, setMessageInput] = useState<string>('');
  const [isCodeMode, setIsCodeMode] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Refs for GSAP & Auto-scroll
  const pageRef = useRef<HTMLDivElement | null>(null);
  const chatStreamRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0];
  const currentMessages = messagesMap[activeThread.id] ?? [];

  // 1. INITIAL PAGE LOAD GSAP ANIMATION (Using safe gsap.fromTo)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.chat-panel-col',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          clearProps: 'transform',
        }
      );

      // Subtle floating animation on the E2E security lock icon
      gsap.to('.e2e-floating-lock', {
        y: -4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // 2. ANIMATE MESSAGES WHEN SWITCHING THREADS
  useEffect(() => {
    if (!chatStreamRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.chat-bubble-item',
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      );
    }, chatStreamRef);

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => ctx.revert();
  }, [activeThreadId]);

  // Select thread and clear unread badge
  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unreadCount: 0 } : t))
    );
  };

  // Send a new text or code message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'John Carraher',
      text: isCodeMode
        ? 'Shared a TypeScript snippet:'
        : messageInput.trim(),
      codeSnippet: isCodeMode
        ? {
            language: 'typescript',
            code: messageInput.trim(),
          }
        : undefined,
      timestamp: 'Just now',
      isMe: true,
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeThread.id]: [...(prev[activeThread.id] ?? []), newMsg],
    }));

    setMessageInput('');
    setIsCodeMode(false);

    // Scroll to bottom and animate the newly added message bubble
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (chatStreamRef.current) {
        const bubbles =
          chatStreamRef.current.querySelectorAll('.chat-bubble-item');
        const lastBubble = bubbles[bubbles.length - 1];
        if (lastBubble) {
          gsap.fromTo(
            lastBubble,
            { scale: 0.95, y: 10, opacity: 0 },
            { scale: 1, y: 0, opacity: 1, duration: 0.25, ease: 'back.out(1.5)' }
          );
        }
      }
    }, 20);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filter threads by search + filter tab
  const effectiveSearch = (localSearch || globalSearch).toLowerCase();
  const filteredThreads = threads.filter((t) => {
    const matchesTab =
      threadFilter === 'all'
        ? true
        : threadFilter === 'rooms'
        ? t.type === 'room'
        : t.type === 'direct';
    const matchesQuery =
      t.name.toLowerCase().includes(effectiveSearch) ||
      t.linkedProject.toLowerCase().includes(effectiveSearch);
    return matchesTab && matchesQuery;
  });

  return (
    <div
      ref={pageRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[calc(100vh-8.5rem)]"
    >
      {/* =========================================================
          1. LEFT COLUMN (3.5 -> 4 Cols): ENCRYPTED THREADS LIST
      ========================================================= */}
      <div className="chat-panel-col lg:col-span-4 xl:col-span-3 rounded-2xl bg-[#0d0b16] border border-white/[0.08] flex flex-col overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
        {/* Top Header */}
        <div className="p-4 border-b border-white/[0.06] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Partner Chats
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Lock className="w-2.5 h-2.5" />
                E2E
              </span>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Search Threads Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter rooms or partners..."
              className="w-full rounded-xl bg-[#131020] border border-white/[0.07] pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>

          {/* Filter Pills (All / Project Rooms / Direct) */}
          <div className="grid grid-cols-3 bg-[#131020] p-1 rounded-xl border border-white/[0.05] text-[11px]">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'rooms', label: 'Rooms' },
                { id: 'direct', label: 'Direct' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setThreadFilter(tab.id)}
                className={`py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  threadFilter === tab.id
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Thread Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredThreads.map((thread) => {
            const isSelected = thread.id === activeThread.id;
            const threadMessages = messagesMap[thread.id] ?? [];
            const lastMsg = threadMessages[threadMessages.length - 1];

            return (
              <div
                key={thread.id}
                onClick={() => handleSelectThread(thread.id)}
                className={`p-3 rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600/20 via-purple-600/10 to-[#151126] border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                    : 'bg-[#120f1d]/70 hover:bg-[#161224] border-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {thread.isGroupE2E ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="relative shrink-0">
                      <img
                        src={thread.avatar}
                        alt={thread.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      {thread.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0d0b16]" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {thread.name}
                      </span>
                      {thread.isGroupE2E && (
                        <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : thread.handleOrRole}
                    </p>
                  </div>
                </div>

                {/* Right Meta: E2E / Time + Unread Badge */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {thread.isGroupE2E ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      E2E
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">
                      {thread.lastTime}
                    </span>
                  )}

                  {thread.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_#a855f7]">
                      {thread.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          2. CENTER COLUMN (5 -> 6 Cols): LIVE E2E CHAT CANVAS
      ========================================================= */}
      <div className="chat-panel-col lg:col-span-8 xl:col-span-6 rounded-2xl bg-[#0d0b16] border border-white/[0.08] flex flex-col overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.5)]">
        {/* Chat Room Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.06] bg-[#110e1c]/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {activeThread.isGroupE2E ? (
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                <MessageCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={activeThread.avatar}
                  alt={activeThread.name}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                />
                {activeThread.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#110e1c]" />
                )}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  {activeThread.name}
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  E2E Verified
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {activeThread.handleOrRole}
              </p>
            </div>
          </div>

          {/* Linked Repo & Branch Pill */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-950/50 border border-purple-500/30 text-[11px] font-mono text-purple-200">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              {activeThread.linkedBranch}
            </span>
          </div>
        </div>

        {/* End-to-End Encryption Notice Banner */}
        <div className="px-4 py-2 bg-[#090811] border-b border-white/[0.04] flex items-center justify-center gap-2 text-[11px] text-zinc-400">
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>
            Messages and code blocks in this channel are end-to-end encrypted.
          </span>
        </div>

        {/* Chat Messages Stream */}
        <div
          ref={chatStreamRef}
          className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-[#0b0914] to-[#08070e]"
        >
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble-item flex items-end gap-2.5 ${
                msg.isMe ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Partner Avatar on Left */}
              {!msg.isMe && (
                <img
                  src={
                    msg.senderAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                  }
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mb-1"
                />
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3.5 ${
                  msg.isMe
                    ? 'bg-gradient-to-br from-emerald-600/90 to-teal-700/90 text-white rounded-br-xs shadow-[0_6px_20px_rgba(16,185,129,0.2)]'
                    : 'bg-[#151224] text-zinc-200 border border-white/[0.07] rounded-bl-xs shadow-[0_6px_20px_rgba(0,0,0,0.35)]'
                }`}
              >
                {!msg.isMe && (
                  <div className="text-[10px] font-bold text-purple-300 mb-1">
                    {msg.senderName}
                  </div>
                )}

                <p className="text-xs sm:text-[13px] leading-relaxed">
                  {msg.text}
                </p>

                {/* Optional Embedded Code Block inside Message */}
                {msg.codeSnippet && (
                  <div className="mt-2.5 rounded-xl bg-[#090710] border border-white/10 overflow-hidden">
                    <div className="px-3 py-1.5 bg-white/[0.04] border-b border-white/[0.06] flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-purple-400" />
                        {msg.codeSnippet.language}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(msg.id, msg.codeSnippet!.code)
                        }
                        className="flex items-center gap-1 text-zinc-400 hover:text-white cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-purple-200 overflow-x-auto leading-relaxed">
                      <code>{msg.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {/* Timestamp + Read Receipt */}
                <div
                  className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] ${
                    msg.isMe ? 'text-emerald-100/80' : 'text-zinc-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck className="w-3.5 h-3.5 text-emerald-200" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message & Code Composer Footer */}
        <form
          onSubmit={handleSendMessage}
          className="p-3.5 border-t border-white/[0.06] bg-[#110e1c]"
        >
          {isCodeMode && (
            <div className="mb-2 px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-between text-[11px] text-purple-200">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-purple-400" />
                Code Snippet Mode Active (TypeScript)
              </span>
              <button
                type="button"
                onClick={() => setIsCodeMode(false)}
                className="text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Code Snippet Toggle Button */}
            <button
              type="button"
              onClick={() => setIsCodeMode(!isCodeMode)}
              title="Toggle TypeScript Code Snippet"
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                isCodeMode
                  ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                  : 'bg-[#171326] text-zinc-400 border-white/[0.07] hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
            </button>

            {/* Input Field */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={
                  isCodeMode
                    ? 'Paste or type TypeScript code snippet...'
                    : `Message ${activeThread.name}...`
                }
                className={`w-full rounded-xl bg-[#0b0914] border border-white/[0.08] pl-4 pr-20 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 ${
                  isCodeMode ? 'font-mono text-purple-200' : ''
                }`}
              />

              <div className="absolute right-3 flex items-center gap-2 text-zinc-400">
                <button
                  type="button"
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <Smile className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_18px_rgba(16,185,129,0.5)] hover:brightness-110 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================
          3. RIGHT COLUMN (3 Cols): E2E SECURITY & SHARED CONTEXT
      ========================================================= */}
      <div className="chat-panel-col hidden xl:flex xl:col-span-3 rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 flex-col justify-between shadow-[0_12px_35px_rgba(0,0,0,0.5)] space-y-6">
        <div className="space-y-6">
          {/* E2E Security Vault Card (Matches Core Capabilities Lock Icon) */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#161129] to-[#0f0c1b] border border-purple-500/35 text-center relative overflow-hidden">
            <div className="e2e-floating-lock w-12 h-12 rounded-2xl bg-purple-600/25 border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center text-purple-200 mx-auto mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-xs font-bold text-white">
              End-to-End Encrypted
            </h3>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
              Session keys are verified across all partners in{' '}
              <span className="text-purple-300 font-medium">
                {activeThread.linkedProject}
              </span>
              .
            </p>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>Key Fingerprint</span>
              <span className="text-emerald-300">{activeThread.fingerprint}</span>
            </div>
          </div>

          {/* Room Members List */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-white mb-3">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Room Participants</span>
              </span>
              <span className="text-[11px] text-zinc-400">
                {activeThread.members.length}
              </span>
            </div>

            <div className="space-y-2">
              {activeThread.members.map((member) => (
                <div
                  key={member.role}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#131020] border border-white/[0.04]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-[#131020] ${
                          member.online ? 'bg-emerald-400' : 'bg-zinc-600'
                        }`}
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">
                        {member.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {member.role}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-400/90 font-medium">
                    {member.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared PRs & Code Files */}
          <div>
            <div className="text-xs font-bold text-white mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Shared PRs &amp; Code</span>
            </div>

            <div className="space-y-2">
              {activeThread.sharedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#131020] hover:bg-[#181429] border border-white/[0.05] flex items-center justify-between gap-2 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      {item.type === 'pr' ? (
                        <GitPullRequest className="w-3.5 h-3.5" />
                      ) : (
                        <FileCode2 className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-zinc-200 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerChatsPage;