import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import {
  Plus,
  Lock,
  MoreHorizontal,
  Check,
  Clock,
  Users,
  MessageCircle,
  GitBranch,
  GitPullRequest,
  Sparkles,
  ArrowUpRight,
  FolderGit2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface OutletContextType {
  globalSearch?: string;
}

interface TechTag {
  label: string;
  colorClass: string;
}

interface ProjectItem {
  id: string;
  name: string;
  description: string;
  visibility: 'Public' | 'Private';
  branch: string;
  accentGradient: string;
  isActiveSprint?: boolean;
  tags: TechTag[];
  progress: number;
  members: string[];
  extraMembers?: number;
  footerMeta: string;
}

interface TaskItem {
  id: string;
  title: string;
  projectTag: string;
  meta: string;
  priority: 'High' | 'Medium' | 'Done';
  completed: boolean;
}

interface JoinRequestItem {
  id: string;
  type: 'incoming_request' | 'project_invite';
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  projectName: string;
  timeAgo: string;
}

interface PartnerChatItem {
  id: string;
  name: string;
  preview: string;
  time?: string;
  isGroupE2E?: boolean;
  unreadCount?: number;
  avatar?: string;
  online?: boolean;
}

// --- DevPilot Workspace Data ---
const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'connect-4',
    name: 'Connect 4',
    description: 'Real-time AI multiplayer board engine with Socket.io rooms',
    visibility: 'Public',
    branch: 'feat/minimax-ai',
    accentGradient: 'from-purple-500 via-fuchsia-500 to-indigo-500',
    tags: [
      { label: 'TS', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'Node', colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { label: 'React', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
    ],
    progress: 74,
    members: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    ],
    extraMembers: 6,
    footerMeta: '12 days left',
  },
  {
    id: 'devpilot-client',
    name: 'DevPilot Client',
    description: 'Core developer collaboration platform & Octokit sync',
    visibility: 'Private',
    branch: 'main',
    accentGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    tags: [
      { label: 'TS', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'React', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { label: 'Tailwind', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    ],
    progress: 62,
    members: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    ],
    footerMeta: '4 open PRs',
  },
  {
    id: 'stockcore-api',
    name: 'StockCore Engine',
    description: 'Distributed inventory & Razorpay webhook service',
    visibility: 'Private',
    branch: 'release/v2.4',
    accentGradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    tags: [
      { label: 'TS', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'Express', colorClass: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
      { label: 'Docker', colorClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
    ],
    progress: 85,
    members: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    ],
    footerMeta: 'Updated 2h ago',
  },
  {
    id: 'ecommerce-core',
    name: 'E-Commerce Core',
    description: 'High-throughput order pipeline & MongoDB aggregation',
    visibility: 'Private',
    branch: 'feat/cart-locks',
    accentGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    isActiveSprint: true,
    tags: [
      { label: 'Node', colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { label: 'MongoDB', colorClass: 'bg-green-500/15 text-green-300 border-green-500/30' },
      { label: 'Zod', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    ],
    progress: 48,
    members: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ],
    footerMeta: 'Active sprint',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: 'Environment Setup & Docker Compose',
    projectTag: 'DevPilot Client',
    meta: 'Due Mar 11',
    priority: 'Done',
    completed: true,
  },
  {
    id: 't2',
    title: 'Minimax Alpha-Beta Pruning Depth 7',
    projectTag: 'Connect 4',
    meta: 'In Progress',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 't3',
    title: 'Octokit GitHub Commit Webhook Sync',
    projectTag: 'DevPilot Client',
    meta: 'High Priority',
    priority: 'High',
    completed: false,
  },
];

const INITIAL_REQUESTS: JoinRequestItem[] = [
  {
    id: 'req-1',
    type: 'incoming_request',
    userName: 'Sarah Jenkins',
    userRole: 'Full-Stack TS',
    userAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    projectName: 'Connect 4',
    timeAgo: '18m ago',
  },
  {
    id: 'req-2',
    type: 'project_invite',
    projectName: 'AI Sandbox',
    timeAgo: '1h ago',
  },
];

const PARTNER_CHATS: PartnerChatItem[] = [
  {
    id: 'chat-1',
    name: 'Connect 4 Team',
    preview: 'Sarah: Pushed the socket room recovery patch',
    isGroupE2E: true,
    unreadCount: 2,
  },
  {
    id: 'chat-2',
    name: 'Patty Nguyen',
    preview: 'Merged the JWT cookie middleware PR...',
    time: '2h ago',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    online: true,
    unreadCount: 1,
  },
  {
    id: 'chat-3',
    name: 'Alex Rivera',
    preview: 'Can we test the join request endpoint?',
    time: '5h ago',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    online: false,
  },
];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const searchQuery = outletContext?.globalSearch ?? '';

  const [visibilityFilter, setVisibilityFilter] = useState<'All' | 'Public' | 'Private'>('All');
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [requests, setRequests] = useState<JoinRequestItem[]>(INITIAL_REQUESTS);

  const dashboardRef = useRef<HTMLDivElement | null>(null);

  // Filter projects by top search bar + All/Public/Private pill
  const filteredProjects = INITIAL_PROJECTS.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVisibility =
      visibilityFilter === 'All' || project.visibility === visibilityFilter;
    return matchesSearch && matchesVisibility;
  });

  // --- SAFE GSAP ANIMATIONS (Using gsap.fromTo so cards NEVER get stuck at opacity 0) ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // 1. Header Banner & Filter Row
      tl.fromTo(
        '.dash-header-item',
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, clearProps: 'transform' }
      )
        // 2. Project Cards + My Tasks Bento Grid
        .fromTo(
          '.bento-project-card',
          { y: 24, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.07,
            clearProps: 'transform,scale',
          },
          '-=0.25'
        )
        // 3. Right Sidebar Widgets
        .fromTo(
          '.right-panel-widget',
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, clearProps: 'transform' },
          '-=0.4'
        );

      // 4. Activity Progress Bars animate from 0% to their data-progress width
      gsap.fromTo(
        '.activity-progress-fill',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          stagger: 0.08,
          delay: 0.15,
        }
      );
    }, dashboardRef);

    return () => ctx.revert();
  }, [visibilityFilter]);

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleResolveRequest = (id: string) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  const activeTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div
      ref={dashboardRef}
      className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start"
    >
      {/* =====================================================
          LEFT / CENTER WORKSPACE (8 Columns)
      ===================================================== */}
      <div className="xl:col-span-8 space-y-6">
        {/* Top Hero Greeting + Workspace Telemetry Banner */}
        <div className="dash-header-item relative rounded-2xl bg-gradient-to-br from-[#130f24] via-[#0d0b18] to-[#090812] border border-purple-500/25 p-6 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          {/* Ambient Background Glow Orb */}
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-semibold text-purple-300 mb-2.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Developer Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Good morning, John!
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                You have{' '}
                <span className="text-purple-300 font-semibold">
                  {requests.length} pending join requests
                </span>{' '}
                and{' '}
                <span className="text-purple-300 font-semibold">
                  {activeTasksCount} active tasks
                </span>{' '}
                in your sprint queue today.
              </p>
            </div>

            {/* Quick Telemetry Mini-Stats */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="px-3.5 py-2.5 rounded-xl bg-[#090710]/80 border border-white/[0.07] text-center min-w-[78px]">
                <div className="text-lg font-extrabold text-white leading-none">
                  {INITIAL_PROJECTS.length}
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Repos</div>
              </div>
              <div className="px-3.5 py-2.5 rounded-xl bg-[#090710]/80 border border-purple-500/30 text-center min-w-[78px]">
                <div className="text-lg font-extrabold text-purple-300 leading-none">
                  7
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Open PRs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header + Filter Pills */}
        <div className="dash-header-item flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span>My Projects</span>
            </h2>

            {/* Filter Switcher (All / Public / Private) */}
            <div className="flex items-center bg-[#0d0b16] p-1 rounded-xl border border-white/[0.07] text-xs">
              {(['All', 'Public', 'Private'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setVisibilityFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    visibilityFilter === tab
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                  {tab === 'All' && ` (${INITIAL_PROJECTS.length})`}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-300 hover:text-purple-200 transition-colors cursor-pointer"
          >
            <span>Open Task Board</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* =====================================================
            3-COLUMN BENTO GRID (Guaranteed Visible + Upgraded UI)
        ===================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* CARD 1: Create New Project Card */}
          <button
            type="button"
            className="bento-project-card group relative min-h-[235px] rounded-2xl bg-gradient-to-b from-[#120e22]/80 to-[#0a0812]/90 border-2 border-dashed border-purple-500/40 hover:border-purple-400 p-5 flex flex-col items-center justify-center text-center transition-[border-color,box-shadow,background-color] duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-[0_0_24px_rgba(168,85,247,0.75)] transition-transform duration-300 mb-3.5">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white">
              Create New Project
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 max-w-[195px] leading-relaxed">
              Initialize a repository, task board, and encrypted partner room.
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] text-[10px] font-medium text-purple-300 group-hover:border-purple-500/40">
              <span> Launch Wizard</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </button>

          {/* CARDS 2 - 5: Redesigned Project Cards */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate('/tasks')}
              className="bento-project-card group relative min-h-[235px] rounded-2xl bg-[#0d0b16] border border-white/[0.08] hover:border-purple-500/55 p-5 flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_0_32px_rgba(139,92,246,0.22)] cursor-pointer overflow-hidden"
            >
              {/* Top Gradient Accent Line */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accentGradient} opacity-80 group-hover:opacity-100`}
              />

              {/* Top Content: Title + Public/Private Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 pt-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {project.name}
                      </h3>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 opacity-0 group-hover:opacity-100 group-hover:text-purple-400 transition-opacity shrink-0" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.visibility === 'Public' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      Public
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800/90 text-zinc-300 border border-white/10 shrink-0">
                      <Lock className="w-2.5 h-2.5 text-amber-400" />
                      Private
                    </span>
                  )}
                </div>

                {/* Tech Stack Badges + Active Branch Pill */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${tag.colorClass}`}
                    >
                      {tag.label}
                    </span>
                  ))}

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-zinc-300 border border-white/[0.07]">
                    <GitBranch className="w-2.5 h-2.5 text-purple-400" />
                    {project.branch}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Sprint Activity Bar + Contributors */}
              <div className="pt-4 mt-2 border-t border-white/[0.05]">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <span>Activity</span>
                    {project.isActiveSprint && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </span>
                  <span className="text-purple-300 font-semibold">
                    {project.progress}%
                  </span>
                </div>

                {/* Progress Bar Track */}
                <div className="w-full h-1.5 rounded-full bg-zinc-800/90 overflow-hidden mb-3.5">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className={`activity-progress-fill h-full rounded-full bg-gradient-to-r ${project.accentGradient} shadow-[0_0_10px_#a855f7]`}
                  />
                </div>

                {/* Contributors Stack + Footer Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {project.members.map((avatarUrl, idx) => (
                      <img
                        key={idx}
                        src={avatarUrl}
                        alt="Contributor"
                        className="w-6 h-6 rounded-full object-cover ring-2 ring-[#0d0b16]"
                      />
                    ))}
                    {project.extraMembers && (
                      <span className="w-6 h-6 rounded-full bg-zinc-800 border border-white/10 text-[10px] font-semibold text-zinc-300 flex items-center justify-center ring-2 ring-[#0d0b16]">
                        +{project.extraMembers}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    {project.footerMeta}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* CARD 6: Upgraded "My Tasks" Bento Card */}
          <div className="bento-project-card min-h-[235px] rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">My Tasks</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {completedTasksCount}/{tasks.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  title="Open full Task Board"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#131020]/90 hover:bg-[#19152b] border border-white/[0.05] cursor-pointer transition-colors"
                  >
                    <button
                      type="button"
                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                        task.completed
                          ? 'bg-purple-500 text-white shadow-[0_0_8px_#a855f7]'
                          : 'border border-zinc-600 bg-transparent hover:border-purple-400'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-xs font-medium truncate ${
                          task.completed
                            ? 'line-through text-zinc-500'
                            : 'text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                        <span className="text-purple-300/80">{task.projectTag}</span>
                        <span>{task.meta}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT COLLABORATION PANEL (4 Columns)
      ===================================================== */}
      <div className="xl:col-span-4 space-y-5">
        {/* WIDGET 1: Join Requests & Invites */}
        <div className="right-panel-widget rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Join Requests &amp; Invites
              </h2>
              {requests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {requests.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => navigate('/requests')}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <span>All join requests &amp; project invites handled!</span>
            </div>
          ) : (
            <div className="space-y-3.5">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-[#131020] border border-white/[0.06] space-y-3"
                >
                  {req.type === 'incoming_request' ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={req.userAvatar}
                            alt={req.userName}
                            className="w-9 h-9 rounded-full object-cover border border-purple-500/40 shrink-0"
                          />
                          <div className="text-xs text-zinc-300 leading-snug">
                            <span className="font-semibold text-white">
                              {req.userName}
                            </span>{' '}
                            requested to join
                            <div className="font-bold text-purple-300 mt-0.5">
                              {req.projectName}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0">
                          {req.timeAgo}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleResolveRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.45)] hover:brightness-110 transition-all cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-white/10 hover:border-zinc-600 hover:text-white transition-colors cursor-pointer"
                        >
                          Ignore
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="text-xs text-zinc-300 leading-snug">
                            Invited to collaborate on:
                            <div className="font-bold text-white mt-0.5">
                              {req.projectName}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0">
                          {req.timeAgo}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleResolveRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium bg-zinc-800/90 text-white border border-purple-500/40 hover:bg-purple-600/20 transition-colors cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveRequest(req.id)}
                          className="py-1.5 px-3 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-400 border border-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WIDGET 2: Encrypted Partner Chats */}
        <div className="right-panel-widget rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                Encrypted Partner Chats
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <button
              type="button"
              onClick={() => navigate('/chats')}
              className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            End-to-end encrypted direct &amp; project threads
          </p>

          <div className="space-y-2.5">
            {PARTNER_CHATS.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate('/chats')}
                className="p-3 rounded-xl bg-[#131020] hover:bg-[#181429] border border-white/[0.05] hover:border-purple-500/30 flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {chat.isGroupE2E ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="relative shrink-0">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#131020]" />
                      )}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white truncate">
                        {chat.name}
                      </span>
                      {chat.isGroupE2E && (
                        <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {chat.preview}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {chat.isGroupE2E ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      E2E
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500">{chat.time}</span>
                  )}

                  {chat.unreadCount && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 text-[10px] font-bold text-white flex items-center justify-center shadow-[0_0_8px_#a855f7]">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;