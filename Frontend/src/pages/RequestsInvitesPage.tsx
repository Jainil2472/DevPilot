import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  UserPlus,
  Users,
  Check,
  X,
  Clock,
  GitBranch,
  Send,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  ArrowUpRight,
  ShieldCheck,
  Code2,
  RotateCcw,
  Inbox,
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface OutletContextType {
  globalSearch?: string;
}

type RequestTab = 'incoming' | 'invites' | 'outgoing';

interface IncomingJoinRequest {
  id: string;
  applicantName: string;
  applicantHandle: string;
  applicantAvatar: string;
  specialty: string;
  projectName: string;
  branchName: string;
  pitchMessage: string;
  skills: string[];
  matchScore: number;
  timeAgo: string;
}

interface ReceivedProjectInvite {
  id: string;
  inviterName: string;
  inviterHandle: string;
  inviterAvatar: string;
  projectName: string;
  projectDescription: string;
  offeredRole: string;
  tags: string[];
  expiresIn: string;
  timeAgo: string;
}

interface OutgoingItem {
  id: string;
  kind: 'sent_request' | 'sent_invite';
  targetUserHandle: string;
  targetAvatar: string;
  projectName: string;
  roleNote: string;
  sentAgo: string;
}

interface ActivityLogItem {
  id: string;
  text: string;
  project: string;
  time: string;
  status: 'approved' | 'accepted' | 'declined' | 'sent';
}

// --- Initial DevPilot Data ---
const INITIAL_INCOMING: IncomingJoinRequest[] = [
  {
    id: 'inc-1',
    applicantName: 'Sarah Jenkins',
    applicantHandle: '@sarahj',
    applicantAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    specialty: 'Full-Stack TypeScript & Socket.io',
    projectName: 'Connect 4',
    branchName: 'feat/minimax-ai',
    pitchMessage:
      'I built a similar turn-based WebSocket state machine and would love to help optimize the Minimax room reconnection logic.',
    skills: ['TS', 'Socket.io', 'Node.js', 'React'],
    matchScore: 96,
    timeAgo: '18m ago',
  },
  {
    id: 'inc-2',
    applicantName: 'Marcus Vance',
    applicantHandle: '@marcusvance',
    applicantAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    specialty: 'Docker & Backend Microservices',
    projectName: 'StockCore Engine',
    branchName: 'release/v2.4',
    pitchMessage:
      'Can help containerize the Express webhook workers and set up Redis idempotency keys for payment retries.',
    skills: ['Docker', 'Express', 'TS', 'PostgreSQL'],
    matchScore: 92,
    timeAgo: '2h ago',
  },
  {
    id: 'inc-3',
    applicantName: 'Elena Rostova',
    applicantHandle: '@elenarostova',
    applicantAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    specialty: 'MongoDB Aggregation & Zod Schemas',
    projectName: 'E-Commerce Core',
    branchName: 'feat/cart-locks',
    pitchMessage:
      'Interested in collaborating on the atomic inventory reservation pipeline and Zod validation middleware.',
    skills: ['MongoDB', 'Zod', 'Node.js'],
    matchScore: 89,
    timeAgo: '5h ago',
  },
];

const INITIAL_INVITES: ReceivedProjectInvite[] = [
  {
    id: 'inv-1',
    inviterName: 'Marcus Vance',
    inviterHandle: '@marcusvance',
    inviterAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    projectName: 'AI Sandbox',
    projectDescription:
      'Multi-agent code execution sandbox with containerized TypeScript workers and live AST streaming.',
    offeredRole: 'Core TypeScript & React Collaborator',
    tags: ['TS', 'Node.js', 'Docker', 'React'],
    expiresIn: '46 hours left',
    timeAgo: '1h ago',
  },
  {
    id: 'inv-2',
    inviterName: 'Jadon Sann',
    inviterHandle: '@jadonsann',
    inviterAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    projectName: 'Synapse Canvas RTC',
    projectDescription:
      'Low-latency collaborative system architecture whiteboard with CRDT state sync and E2E rooms.',
    offeredRole: 'Frontend GSAP & Canvas Partner',
    tags: ['React', 'Tailwind', 'GSAP', 'WebSockets'],
    expiresIn: '3 days left',
    timeAgo: 'Yesterday',
  },
];

const INITIAL_OUTGOING: OutgoingItem[] = [
  {
    id: 'out-1',
    kind: 'sent_request',
    targetUserHandle: '@senashae',
    targetAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    projectName: 'GitSentinel Webhook CLI',
    roleNote: 'Requested to join as Full-Stack TypeScript Contributor',
    sentAgo: '3h ago',
  },
  {
    id: 'out-2',
    kind: 'sent_invite',
    targetUserHandle: '@pattyn',
    targetAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    projectName: 'DevPilot Client',
    roleNote: 'Invited to collaborate on Auth & JWT Refresh Middleware',
    sentAgo: 'Yesterday',
  },
];

const MY_PROJECTS = [
  'Connect 4',
  'DevPilot Client',
  'StockCore Engine',
  'E-Commerce Core',
];

const RequestsInvitesPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const globalSearch = (outletContext?.globalSearch ?? '').toLowerCase();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<RequestTab>('incoming');

  // Lists State
  const [incomingList, setIncomingList] =
    useState<IncomingJoinRequest[]>(INITIAL_INCOMING);
  const [invitesList, setInvitesList] =
    useState<ReceivedProjectInvite[]>(INITIAL_INVITES);
  const [outgoingList, setOutgoingList] =
    useState<OutgoingItem[]>(INITIAL_OUTGOING);

  // Quick Invite Form State
  const [inviteHandle, setInviteHandle] = useState<string>('');
  const [inviteProject, setInviteProject] = useState<string>(MY_PROJECTS[0]);
  const [inviteNote, setInviteNote] = useState<string>('');

  // Recent Audit Log State
  const [activityLog, setActivityLog] = useState<ActivityLogItem[]>([
    {
      id: 'log-1',
      text: 'Patty Nguyen accepted your invite',
      project: 'DevPilot Client',
      time: '2h ago',
      status: 'accepted',
    },
    {
      id: 'log-2',
      text: 'Approved Alex Rivera join request',
      project: 'E-Commerce Core',
      time: 'Yesterday',
      status: 'approved',
    },
  ]);

  // GSAP Scope Ref
  const pageRef = useRef<HTMLDivElement | null>(null);

  // 1. INITIAL PAGE & TAB SWITCH ENTRANCE ANIMATION (Safe gsap.fromTo)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.req-header-block',
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, clearProps: 'transform' }
      )
        .fromTo(
          '.req-card-item',
          { y: 20, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            clearProps: 'transform,scale',
          },
          '-=0.2'
        )
        .fromTo(
          '.req-right-widget',
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, clearProps: 'transform' },
          '-=0.35'
        );
    }, pageRef);

    return () => ctx.revert();
  }, [activeTab]);

  // 2. SMOOTH GSAP EXIT ANIMATION BEFORE REMOVING ITEM FROM STATE
  const animateOutAndRemove = (
    elementId: string,
    onRemoveComplete: () => void
  ) => {
    const cardEl = document.getElementById(elementId);
    if (!cardEl) {
      onRemoveComplete();
      return;
    }

    gsap.to(cardEl, {
      x: 35,
      opacity: 0,
      scale: 0.96,
      duration: 0.28,
      ease: 'power2.in',
      onComplete: onRemoveComplete,
    });
  };

  // Handle Approve / Ignore on Incoming Requests
  const handleIncomingDecision = (
    item: IncomingJoinRequest,
    decision: 'approved' | 'declined'
  ) => {
    animateOutAndRemove(`card-${item.id}`, () => {
      setIncomingList((prev) => prev.filter((req) => req.id !== item.id));
      setActivityLog((prev) => [
        {
          id: `log-${Date.now()}`,
          text:
            decision === 'approved'
              ? `Approved ${item.applicantName} to join`
              : `Ignored request from ${item.applicantName}`,
          project: item.projectName,
          time: 'Just now',
          status: decision,
        },
        ...prev,
      ]);
    });
  };

  // Handle Accept / Decline on Received Project Invites
  const handleInviteDecision = (
    item: ReceivedProjectInvite,
    decision: 'accepted' | 'declined'
  ) => {
    animateOutAndRemove(`card-${item.id}`, () => {
      setInvitesList((prev) => prev.filter((inv) => inv.id !== item.id));
      setActivityLog((prev) => [
        {
          id: `log-${Date.now()}`,
          text:
            decision === 'accepted'
              ? `Accepted invitation to join`
              : `Declined invitation to`,
          project: item.projectName,
          time: 'Just now',
          status: decision,
        },
        ...prev,
      ]);
    });
  };

  // Handle Cancel on Outgoing Requests/Invites
  const handleCancelOutgoing = (item: OutgoingItem) => {
    animateOutAndRemove(`card-${item.id}`, () => {
      setOutgoingList((prev) => prev.filter((out) => out.id !== item.id));
    });
  };

  // Handle Direct Partner Invite Form Submit
  const handleSendDirectInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteHandle.trim()) return;

    const formattedHandle = inviteHandle.trim().startsWith('@')
      ? inviteHandle.trim()
      : `@${inviteHandle.trim()}`;

    const newOutgoing: OutgoingItem = {
      id: `out-${Date.now()}`,
      kind: 'sent_invite',
      targetUserHandle: formattedHandle,
      targetAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      projectName: inviteProject,
      roleNote:
        inviteNote.trim() || 'Invited to collaborate on project workspace',
      sentAgo: 'Just now',
    };

    setOutgoingList((prev) => [newOutgoing, ...prev]);
    setActivityLog((prev) => [
      {
        id: `log-${Date.now()}`,
        text: `Sent project invite to ${formattedHandle}`,
        project: inviteProject,
        time: 'Just now',
        status: 'sent',
      },
      ...prev,
    ]);

    setInviteHandle('');
    setInviteNote('');
    setActiveTab('outgoing');
  };

  // Filter helpers based on top global search bar
  const filteredIncoming = incomingList.filter(
    (item) =>
      item.applicantName.toLowerCase().includes(globalSearch) ||
      item.projectName.toLowerCase().includes(globalSearch)
  );

  const filteredInvites = invitesList.filter(
    (item) =>
      item.projectName.toLowerCase().includes(globalSearch) ||
      item.inviterName.toLowerCase().includes(globalSearch)
  );

  const filteredOutgoing = outgoingList.filter(
    (item) =>
      item.projectName.toLowerCase().includes(globalSearch) ||
      item.targetUserHandle.toLowerCase().includes(globalSearch)
  );

  return (
    <div
      ref={pageRef}
      className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start"
    >
      {/* =========================================================
          LEFT / CENTER COLUMN (8 Cols): REQUESTS & INVITES QUEUE
      ========================================================= */}
      <div className="xl:col-span-8 space-y-6">
        {/* Top Banner */}
        <div className="req-header-block relative rounded-2xl bg-gradient-to-br from-[#15102a] via-[#0d0b18] to-[#090812] border border-purple-500/30 p-6 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-semibold text-purple-300 mb-2.5">
                <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Team Access &amp; Approvals</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Requests &amp; Invites
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Review incoming developer join requests, accept team invitations, or
                manage your pending outbound invites.
              </p>
            </div>

            {/* Quick Summary Counters */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2.5 rounded-xl bg-[#090710]/85 border border-purple-500/30 text-center min-w-[82px]">
                <div className="text-lg font-extrabold text-purple-300 leading-none">
                  {incomingList.length}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Incoming</div>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-[#090710]/85 border border-white/[0.08] text-center min-w-[82px]">
                <div className="text-lg font-extrabold text-white leading-none">
                  {invitesList.length}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Invites</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Tab Switcher Bar */}
        <div className="req-header-block flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
          <div className="flex items-center gap-2 bg-[#0d0b16] p-1.5 rounded-xl border border-white/[0.07]">
            <button
              type="button"
              onClick={() => setActiveTab('incoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'incoming'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Incoming Requests</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'incoming'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                {incomingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('invites')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'invites'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Project Invites</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'invites'
                    ? 'bg-white/20 text-white'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                {invitesList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('outgoing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'outgoing'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>Sent &amp; Outgoing</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === 'outgoing'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/10 text-zinc-300'
                }`}
              >
                {outgoingList.length}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/discovery')}
            className="text-xs font-medium text-purple-300 hover:text-purple-200 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Open Projects</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* =========================================================
            TAB 1: INCOMING JOIN REQUESTS (Approve / Ignore)
        ========================================================= */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {filteredIncoming.length === 0 ? (
              <div className="rounded-2xl bg-[#0d0b16] border border-white/[0.07] p-12 text-center space-y-3">
                <Inbox className="w-8 h-8 text-purple-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  No Pending Incoming Requests
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  When developers request to join your public repositories, their
                  applications will appear here for approval.
                </p>
              </div>
            ) : (
              filteredIncoming.map((req) => (
                <div
                  id={`card-${req.id}`}
                  key={req.id}
                  className="req-card-item rounded-2xl bg-[#0d0b16] border border-white/[0.08] hover:border-purple-500/45 p-5 transition-[border-color,box-shadow] duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4"
                >
                  {/* Top Row: Applicant Info + Target Project Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={req.applicantAvatar}
                        alt={req.applicantName}
                        className="w-11 h-11 rounded-full object-cover border border-purple-500/40 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white">
                            {req.applicantName}
                          </h3>
                          <span className="text-xs text-zinc-400 font-mono">
                            {req.applicantHandle}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {req.matchScore}% Stack Match
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {req.specialty}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/35 text-xs font-semibold text-purple-200">
                        <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                        {req.projectName}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {req.timeAgo}
                      </span>
                    </div>
                  </div>

                  {/* Applicant Pitch Note */}
                  <div className="p-3.5 rounded-xl bg-[#131020] border border-white/[0.05] text-xs text-zinc-300 leading-relaxed">
                    &ldquo;{req.pitchMessage}&rdquo;
                  </div>

                  {/* Bottom Row: Skills + Approve / Ignore Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {req.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-white/[0.05] text-zinc-300 border border-white/[0.07]"
                        >
                          {skill}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-950/50 text-purple-300 border border-purple-500/25">
                        <GitBranch className="w-2.5 h-2.5" />
                        {req.branchName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleIncomingDecision(req, 'approved')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.5)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Approve &amp; Add</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleIncomingDecision(req, 'declined')}
                        className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-300 border border-white/10 hover:border-zinc-600 hover:text-white transition-colors cursor-pointer"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================
            TAB 2: RECEIVED PROJECT INVITES (Accept / Decline)
        ========================================================= */}
        {activeTab === 'invites' && (
          <div className="space-y-4">
            {filteredInvites.length === 0 ? (
              <div className="rounded-2xl bg-[#0d0b16] border border-white/[0.07] p-12 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  All Project Invitations Handled
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  You have no pending project invitations right now.
                </p>
              </div>
            ) : (
              filteredInvites.map((inv) => (
                <div
                  id={`card-${inv.id}`}
                  key={inv.id}
                  className="req-card-item rounded-2xl bg-[#0d0b16] border border-purple-500/35 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">
                            Invited by{' '}
                            <strong className="text-white">
                              {inv.inviterName}
                            </strong>{' '}
                            ({inv.inviterHandle})
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                          {inv.projectName}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-[11px] font-medium text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {inv.expiresIn}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {inv.projectDescription}
                  </p>

                  <div className="p-3 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Code2 className="w-4 h-4 text-purple-400" />
                      <span className="text-zinc-400">Role Offered:</span>
                      <span className="font-semibold text-purple-200">
                        {inv.offeredRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      {inv.timeAgo}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {inv.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleInviteDecision(inv, 'accepted')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.5)] hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Accept Invite</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInviteDecision(inv, 'declined')}
                        className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: SENT & OUTGOING (Cancel Request / Revoke Invite)
        ========================================================= */}
        {activeTab === 'outgoing' && (
          <div className="space-y-3.5">
            {filteredOutgoing.length === 0 ? (
              <div className="rounded-2xl bg-[#0d0b16] border border-white/[0.07] p-12 text-center space-y-3">
                <Send className="w-8 h-8 text-zinc-500 mx-auto" />
                <h3 className="text-sm font-bold text-white">
                  No Outbound Requests or Invites
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Use the Quick Partner Invite panel on the right or explore open
                  projects in Discovery to team up.
                </p>
              </div>
            ) : (
              filteredOutgoing.map((out) => (
                <div
                  id={`card-${out.id}`}
                  key={out.id}
                  className="req-card-item rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={out.targetAvatar}
                      alt={out.targetUserHandle}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/40 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            out.kind === 'sent_invite'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {out.kind === 'sent_invite'
                            ? 'Outbound Invite'
                            : 'Join Request Sent'}
                        </span>
                        <h3 className="text-sm font-bold text-white">
                          {out.projectName}
                        </h3>
                        <span className="text-xs font-mono text-zinc-400">
                          • {out.targetUserHandle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        {out.roleNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-zinc-500">
                      {out.sentAgo}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCancelOutgoing(out)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* =========================================================
          RIGHT COLUMN (4 Cols): DIRECT INVITE FORM + AUDIT LOG
      ========================================================= */}
      <div className="xl:col-span-4 space-y-5">
        {/* WIDGET 1: Send Direct Partner Invite */}
        <div className="req-right-widget rounded-2xl bg-[#0d0b16] border border-purple-500/40 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Invite Partner to Project</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Send a direct collaboration invite by unique username.
          </p>

          <form onSubmit={handleSendDirectInvite} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Partner Username
              </label>
              <input
                type="text"
                value={inviteHandle}
                onChange={(e) => setInviteHandle(e.target.value)}
                placeholder="@username (e.g. @jadonsann)"
                className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Select Target Repository
              </label>
              <select
                value={inviteProject}
                onChange={(e) => setInviteProject(e.target.value)}
                className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/60 transition-colors"
              >
                {MY_PROJECTS.map((proj) => (
                  <option key={proj} value={proj} className="bg-[#0d0b16]">
                    {proj}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Sprint / Role Note (Optional)
              </label>
              <input
                type="text"
                value={inviteNote}
                onChange={(e) => setInviteNote(e.target.value)}
                placeholder="e.g. Help with WebSocket rooms & task board"
                className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-[0_0_22px_rgba(168,85,247,0.55)] hover:brightness-110 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Collaboration Invite</span>
            </button>
          </form>
        </div>

        {/* WIDGET 2: Recent Membership Activity Log */}
        <div className="req-right-widget rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Membership Activity</span>
            </h2>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Audit Log
            </span>
          </div>

          <div className="space-y-2.5">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#131020] border border-white/[0.05] flex items-start justify-between gap-2"
              >
                <div className="text-xs text-zinc-300 leading-snug">
                  <div>{log.text}</div>
                  <div className="font-semibold text-purple-300 mt-0.5">
                    {log.project}
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 shrink-0">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsInvitesPage;