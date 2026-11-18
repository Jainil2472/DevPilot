// src/pages/TaskBoardPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Plus,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Filter,
  FolderGit2,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

// --- TypeScript Interfaces ---
type TaskStatus = 'todo' | 'in_progress' | 'review';
type TaskPriority = 'High' | 'Medium' | 'Low';

interface BoardTask {
  id: string;
  code: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: { label: string; color: string }[];
  subtasksDone: number;
  subtasksTotal: number;
  commentsCount: number;
  dueDate: string;
  assigneeAvatar: string;
  assigneeName: string;
  linkedBranch?: string;
}

interface GitCommitLog {
  id: string;
  hash: string;
  message: string;
  author: string;
  authorAvatar: string;
  branch: string;
  timeAgo: string;
  verified: boolean;
}

// --- Initial DevPilot Board Data ---
const PROJECTS = [
  { id: 'connect-4', name: 'Connect 4', branch: 'feat/minimax-ai', openPRs: 3 },
  { id: 'devpilot-client', name: 'DevPilot Client', branch: 'main', openPRs: 4 },
  { id: 'ecommerce-core', name: 'E-Commerce Core', branch: 'fix/webhook-sync', openPRs: 2 },
];

const INITIAL_BOARD_TASKS: BoardTask[] = [
  {
    id: 'task-101',
    code: 'DP-101',
    title: 'WebSocket Room Matchmaking State',
    description: 'Sync player turn timers and disconnect recovery payloads across sockets.',
    status: 'todo',
    priority: 'High',
    tags: [
      { label: 'TS', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'Socket.io', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
    ],
    subtasksDone: 1,
    subtasksTotal: 4,
    commentsCount: 3,
    dueDate: 'Mar 14',
    assigneeName: 'Sarah',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    linkedBranch: 'feat/socket-rooms',
  },
  {
    id: 'task-102',
    code: 'DP-102',
    title: 'Zod Schema Validation for Join Requests',
    description: 'Validate incoming project invite tokens and role permissions.',
    status: 'todo',
    priority: 'Medium',
    tags: [
      { label: 'Node', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { label: 'Zod', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
    ],
    subtasksDone: 0,
    subtasksTotal: 2,
    commentsCount: 1,
    dueDate: 'Mar 16',
    assigneeName: 'John',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 'task-103',
    code: 'DP-103',
    title: 'Minimax Alpha-Beta Pruning Engine',
    description: 'Optimize depth-7 board heuristic evaluation under 120ms.',
    status: 'in_progress',
    priority: 'High',
    tags: [
      { label: 'TS', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'AI Engine', color: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' },
    ],
    subtasksDone: 3,
    subtasksTotal: 5,
    commentsCount: 6,
    dueDate: 'Mar 12',
    assigneeName: 'John',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    linkedBranch: 'feat/minimax-ai',
  },
  {
    id: 'task-104',
    code: 'DP-104',
    title: 'Interactive Board Grid GSAP Drop Physics',
    description: 'Add smooth bounce easing when tokens drop into Connect 4 columns.',
    status: 'in_progress',
    priority: 'Medium',
    tags: [
      { label: 'React', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { label: 'GSAP', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
    ],
    subtasksDone: 2,
    subtasksTotal: 3,
    commentsCount: 2,
    dueDate: 'Mar 15',
    assigneeName: 'Patty',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    linkedBranch: 'ui/gsap-grid',
  },
  {
    id: 'task-105',
    code: 'DP-105',
    title: 'Environment Setup & Docker Compose',
    description: 'Configure hot-reloading container for backend TS + MongoDB replica.',
    status: 'review',
    priority: 'Low',
    tags: [
      { label: 'Docker', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
      { label: 'MongoDB', color: 'bg-green-500/15 text-green-300 border-green-500/30' },
    ],
    subtasksDone: 4,
    subtasksTotal: 4,
    commentsCount: 4,
    dueDate: 'Mar 11',
    assigneeName: 'Alex',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    linkedBranch: 'chore/docker-env',
  },
];

const GIT_COMMITS: GitCommitLog[] = [
  {
    id: 'c1',
    hash: '8f4d2a1',
    message: 'feat(ai): add alpha-beta pruning depth cache',
    author: 'John Carraher',
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    branch: 'feat/minimax-ai',
    timeAgo: '14m ago',
    verified: true,
  },
  {
    id: 'c2',
    hash: '3c9e11b',
    message: 'fix(auth): attach HttpOnly refresh token cookie',
    author: 'Patty Nguyen',
    authorAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    branch: 'main',
    timeAgo: '1h ago',
    verified: true,
  },
  {
    id: 'c3',
    hash: '7a2b90c',
    message: 'chore(docker): bind volume for tsx watch reload',
    author: 'Alex Rivera',
    authorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    branch: 'chore/docker-env',
    timeAgo: '3h ago',
    verified: true,
  },
];

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: 'todo', label: 'Todo', dotColor: 'bg-purple-400 shadow-[0_0_8px_#a855f7]' },
  { id: 'in_progress', label: 'In Progress', dotColor: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' },
  { id: 'review', label: 'Review & Done', dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]' },
];

const TaskBoardPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0]);
  const [tasks, setTasks] = useState<BoardTask[]>(INITIAL_BOARD_TASKS);
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');

  // Quick Add Task Modal/Inline State
  const [addingToColumn, setAddingToColumn] = useState<TaskStatus | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  // GSAP Scope Ref
  const boardRef = useRef<HTMLDivElement | null>(null);

  // 1. INITIAL PAGE ENTRANCE ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.board-top-bar', {
        y: -15,
        opacity: 0,
        duration: 0.45,
      })
        .from(
          '.kanban-column',
          {
            y: 25,
            opacity: 0,
            duration: 0.55,
            stagger: 0.1,
          },
          '-=0.2'
        )
        .from(
          '.git-sync-panel',
          {
            x: 25,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        );
    }, boardRef);

    return () => ctx.revert();
  }, [selectedProject.id]);

  // Move task to the next column (Todo -> In Progress -> Review -> Todo)
  const handleAdvanceTask = (taskId: string) => {
    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'review',
      review: 'todo',
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: nextStatusMap[t.status] } : t
      )
    );
  };

  // Add a new task inline to any column
  const handleCreateTask = (status: TaskStatus) => {
    if (!newTaskTitle.trim()) return;

    const newTask: BoardTask = {
      id: `task-${Date.now()}`,
      code: `DP-${106 + tasks.length}`,
      title: newTaskTitle.trim(),
      description: 'Newly initialized task in workspace.',
      status,
      priority: 'Medium',
      tags: [{ label: 'TS', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' }],
      subtasksDone: 0,
      subtasksTotal: 3,
      commentsCount: 0,
      dueDate: 'Mar 20',
      assigneeName: 'John',
      assigneeAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setAddingToColumn(null);
  };

  const filteredTasks = tasks.filter((t) =>
    priorityFilter === 'All' ? true : t.priority === priorityFilter
  );

  const getPriorityBadgeStyle = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Low':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div ref={boardRef} className="space-y-6">
      {/* =========================================================
          TOP PROJECT & GIT BRANCH CONTROL BAR
      ========================================================= */}
      <div className="board-top-bar flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/[0.07]">
        {/* Left: Project Selector Pills + Active Branch */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <FolderGit2 className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Project Board
            </h1>
          </div>

          {/* Project Switcher Tabs */}
          <div className="flex items-center bg-[#110e1c] p-1 rounded-xl border border-white/[0.07]">
            {PROJECTS.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProject(proj)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedProject.id === proj.id
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>

          {/* Active Branch Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono text-[11px]">{selectedProject.branch}</span>
          </div>
        </div>

        {/* Right: Priority Filter + New Task Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#110e1c] border border-white/[0.07] rounded-xl p-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-zinc-500 ml-2 mr-1" />
            {(['All', 'High', 'Medium', 'Low'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setPriorityFilter(level)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  priorityFilter === level
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAddingToColumn('todo')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600/20 text-purple-200 border border-purple-500/50 hover:bg-purple-600 hover:text-white shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          MAIN BOARD GRID: 3 KANBAN COLUMNS (9 Cols) + GIT PANEL (3 Cols)
      ========================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* LEFT 9 COLUMNS: 3 KANBAN COLUMNS */}
        <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="kanban-column rounded-2xl bg-[#0b0914] border border-white/[0.07] p-4 flex flex-col min-h-[540px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                    <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      {col.label}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.06] text-zinc-300">
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAddingToColumn(col.id)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title={`Add task to ${col.label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Inline Quick-Add Task Box */}
                {addingToColumn === col.id && (
                  <div className="mb-3 p-3 rounded-xl bg-[#141124] border border-purple-500/50 space-y-2.5">
                    <input
                      type="text"
                      autoFocus
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateTask(col.id)}
                      placeholder="Enter task title..."
                      className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setAddingToColumn(null)}
                        className="p-1 text-zinc-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateTask(col.id)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 text-[11px] font-semibold text-white hover:bg-purple-500 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                )}

                {/* Task Cards Stack */}
                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => {
                    const progressPercent = Math.round(
                      (task.subtasksDone / task.subtasksTotal) * 100
                    );

                    return (
                      <div
                        key={task.id}
                        className="group rounded-xl bg-[#120f1e] border border-white/[0.07] hover:border-purple-500/50 p-3.5 transition-all shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.16)] flex flex-col justify-between gap-3"
                      >
                        <div>
                          {/* Top Row: Task Code + Priority Badge */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-mono text-[10px] font-semibold text-purple-300/90 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              {task.code}
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getPriorityBadgeStyle(
                                task.priority
                              )}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          {/* Task Title & Description */}
                          <h3 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                            {task.title}
                          </h3>
                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>

                          {/* Tech Stack Pills */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3">
                            {task.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={`px-2 py-0.5 rounded text-[10px] font-medium border ${tag.color}`}
                              >
                                {tag.label}
                              </span>
                            ))}

                            {task.linkedBranch && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/90 text-zinc-300 border border-white/5">
                                <GitBranch className="w-2.5 h-2.5 text-purple-400" />
                                {task.linkedBranch}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subtask Progress + Footer */}
                        <div className="pt-2 border-t border-white/[0.05] space-y-2.5">
                          {/* Mini Subtask Bar */}
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                              <span>Subtasks</span>
                              <span className="text-zinc-300 font-medium">
                                {task.subtasksDone}/{task.subtasksTotal}
                              </span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-zinc-800 overflow-hidden">
                              <div
                                style={{ width: `${progressPercent}%` }}
                                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-300"
                              />
                            </div>
                          </div>

                          {/* Assignee + Meta + Quick Advance Button */}
                          <div className="flex items-center justify-between pt-0.5">
                            <div className="flex items-center gap-2">
                              <img
                                src={task.assigneeAvatar}
                                alt={task.assigneeName}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-500/40"
                              />
                              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                {task.dueDate}
                              </span>
                              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-zinc-500" />
                                {task.commentsCount}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAdvanceTask(task.id)}
                              title="Move to next stage"
                              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-purple-600 text-zinc-300 hover:text-white transition-all cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Column Add Button */}
                <button
                  type="button"
                  onClick={() => setAddingToColumn(col.id)}
                  className="mt-4 w-full py-2 rounded-xl border border-dashed border-white/10 hover:border-purple-500/40 text-xs text-zinc-400 hover:text-purple-300 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Task</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            RIGHT 3 COLUMNS: GIT COMMITS & OCTOKIT SYNC PANEL
        ========================================================= */}
        <div className="git-sync-panel xl:col-span-3 space-y-4">
          <div className="rounded-2xl bg-[#0b0914] border border-purple-500/35 p-4 shadow-[0_0_30px_rgba(139,92,246,0.12)]">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-purple-400" />
                <h2 className="text-xs sm:text-sm font-bold text-white">
                  Git Activity &amp; Sync
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Octokit Live
              </span>
            </div>

            {/* Active Pull Request Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-950/50 to-[#120f1e] border border-purple-500/30 mb-4">
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-purple-400" />
                  PR #42 Ready to Merge
                </span>
                <ExternalLink className="w-3 h-3 opacity-75" />
              </div>
              <p className="text-xs font-bold text-white">
                feat: Minimax AI depth evaluation
              </p>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
                <span>All 6 checks passed</span>
                <span className="text-emerald-400 font-medium">+312 / -48</span>
              </div>
            </div>

            {/* Recent Commits Stream */}
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
              Recent Automated Commits
            </div>

            <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-px before:bg-white/10">
              {GIT_COMMITS.map((commit) => (
                <div key={commit.id} className="relative pl-8">
                  <span className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-[#131022] border-2 border-purple-400 shadow-[0_0_8px_#a855f7]" />

                  <div className="p-2.5 rounded-xl bg-[#120f1e] border border-white/[0.06] space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                        {commit.hash}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {commit.timeAgo}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-zinc-200 leading-snug">
                      {commit.message}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={commit.authorAvatar}
                          alt={commit.author}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-[10px] text-zinc-400">
                          {commit.author}
                        </span>
                      </div>

                      {commit.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-400">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoardPage;