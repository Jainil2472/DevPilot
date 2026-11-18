import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import gsap from 'gsap';
import {
  Compass,
  Sparkles,
  Search,
  GitBranch,
  Star,
  Users,
  Check,
  UserPlus,
  ArrowUpRight,
  Code2,
  Flame,
  Clock,
  ShieldCheck,
  Lock,
  Filter,
} from 'lucide-react';

// --- TypeScript Interfaces ---
interface OutletContextType {
  globalSearch?: string;
}

interface TechBadge {
  label: string;
  colorClass: string;
}

interface DiscoverProject {
  id: string;
  name: string;
  ownerHandle: string;
  ownerAvatar: string;
  description: string;
  category: 'Trending' | 'Needs Partners' | 'AI & WebSockets';
  lookingForRole: string;
  openSpots: number;
  stars: number;
  activeBranch: string;
  accentGradient: string;
  tags: TechBadge[];
  updatedAgo: string;
}

interface DiscoverDeveloper {
  id: string;
  name: string;
  handle: string;
  specialty: string;
  avatar: string;
  online: boolean;
  skills: string[];
  matchScore: number;
}

// --- Initial DevPilot Discovery Data ---
const TECH_FILTERS = [
  'All',
  'TypeScript',
  'React',
  'Node.js',
  'MongoDB',
  'Docker',
  'WebSockets',
] as const;

type TechFilterType = (typeof TECH_FILTERS)[number];

const DISCOVER_PROJECTS: DiscoverProject[] = [
  {
    id: 'ai-sandbox',
    name: 'AI Sandbox',
    ownerHandle: '@marcusvance',
    ownerAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    description:
      'Multi-agent code execution sandbox with containerized TypeScript workers and live AST streaming.',
    category: 'Trending',
    lookingForRole: 'Backend Node.js & Docker Engineer',
    openSpots: 2,
    stars: 148,
    activeBranch: 'feat/docker-runner',
    accentGradient: 'from-purple-500 via-fuchsia-500 to-indigo-500',
    tags: [
      { label: 'TypeScript', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
      { label: 'Node.js', colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { label: 'Docker', colorClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
    ],
    updatedAgo: '24m ago',
  },
  {
    id: 'pulse-metrics',
    name: 'PulseDB Telemetry',
    ownerHandle: '@elenarostova',
    ownerAvatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    description:
      'Real-time MongoDB aggregation visualizer and slow-query profiler with glassmorphic dashboard charts.',
    category: 'Needs Partners',
    lookingForRole: 'React + Tailwind UI Developer',
    openSpots: 1,
    stars: 92,
    activeBranch: 'main',
    accentGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    tags: [
      { label: 'React', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { label: 'MongoDB', colorClass: 'bg-green-500/15 text-green-300 border-green-500/30' },
      { label: 'TypeScript', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    ],
    updatedAgo: '1h ago',
  },
  {
    id: 'synapse-rtc',
    name: 'Synapse Canvas RTC',
    ownerHandle: '@jadonsann',
    ownerAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    description:
      'Low-latency collaborative system architecture whiteboard with CRDT state sync and E2E voice rooms.',
    category: 'AI & WebSockets',
    lookingForRole: 'WebSockets & State Sync Partner',
    openSpots: 3,
    stars: 215,
    activeBranch: 'feat/crdt-canvas',
    accentGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    tags: [
      { label: 'WebSockets', colorClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
      { label: 'React', colorClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
      { label: 'TypeScript', colorClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30' },
    ],
    updatedAgo: '3h ago',
  },
  {
    id: 'git-sentinel',
    name: 'GitSentinel Webhook CLI',
    ownerHandle: '@senashae',
    ownerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    description:
      'Automated PR security scanner and Octokit commit validator with zero-config Docker deployment.',
    category: 'Needs Partners',
    lookingForRole: 'Full-Stack TypeScript Contributor',
    openSpots: 2,
    stars: 84,
    activeBranch: 'release/v1.2',
    accentGradient: 'from-amber-400 via-orange-500 to-rose-500',
    tags: [
      { label: 'Node.js', colorClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
      { label: 'Docker', colorClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
      { label: 'MongoDB', colorClass: 'bg-green-500/15 text-green-300 border-green-500/30' },
    ],
    updatedAgo: '6h ago',
  },
];

// Matches "Developer Discovery" from Reference Image 1 (Jadon Sann, Sena Shae, etc.)
const DISCOVER_DEVELOPERS: DiscoverDeveloper[] = [
  {
    id: 'dev-1',
    name: 'Jadon Sann',
    handle: '@jadonsann',
    specialty: 'Distributed Systems & TS',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    online: true,
    skills: ['TS', 'Node', 'WebSockets'],
    matchScore: 98,
  },
  {
    id: 'dev-2',
    name: 'Sena Shae',
    handle: '@senashae',
    specialty: 'React, GSAP & UI Architecture',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    online: true,
    skills: ['React', 'Tailwind', 'GSAP'],
    matchScore: 94,
  },
  {
    id: 'dev-3',
    name: 'Marcus Vance',
    handle: '@marcusvance',
    specialty: 'Docker & Microservices',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    online: false,
    skills: ['Docker', 'MongoDB', 'Express'],
    matchScore: 91,
  },
  {
    id: 'dev-4',
    name: 'Elena Rostova',
    handle: '@elenarostova',
    specialty: 'Database & API Security',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    online: true,
    skills: ['MongoDB', 'Zod', 'TS'],
    matchScore: 89,
  },
];

const ProjectDiscoveryPage: React.FC = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const globalSearch = outletContext?.globalSearch ?? '';

  // Interactive Filters & States
  const [selectedTech, setSelectedTech] = useState<TechFilterType>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [followedDevs, setFollowedDevs] = useState<string[]>(['dev-2']);

  // GSAP Scope Ref
  const discoveryRef = useRef<HTMLDivElement | null>(null);

  // Filter projects by search input + selected tech pill
  const effectiveQuery = (localSearch || globalSearch).toLowerCase();
  const filteredProjects = DISCOVER_PROJECTS.filter((project) => {
    const matchesTech =
      selectedTech === 'All' ||
      project.tags.some((t) => t.label.toLowerCase() === selectedTech.toLowerCase());

    const matchesSearch =
      project.name.toLowerCase().includes(effectiveQuery) ||
      project.description.toLowerCase().includes(effectiveQuery) ||
      project.lookingForRole.toLowerCase().includes(effectiveQuery);

    return matchesTech && matchesSearch;
  });

  // 1. SAFE GSAP ENTRANCE & FILTER RE-ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Top Hero & Filter Bar
      tl.fromTo(
        '.discovery-header-block',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.08, clearProps: 'transform' }
      )
        // Project Cards Grid
        .fromTo(
          '.discover-project-card',
          { y: 24, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            clearProps: 'transform,scale',
          },
          '-=0.25'
        )
        // Right Column Widgets (Developer Discovery + Partner Network)
        .fromTo(
          '.discovery-right-widget',
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.12, clearProps: 'transform' },
          '-=0.4'
        );

      // Continuous subtle pulse on Partner Network constellation nodes
      gsap.to('.network-constellation-node', {
        scale: 1.14,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
        ease: 'sine.inOut',
      });
    }, discoveryRef);

    return () => ctx.revert();
  }, [selectedTech]);

  // Toggle "Request to Join" on a project card with a tactile GSAP button pop
  const handleToggleJoinRequest = (
    projectId: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.92 },
      { scale: 1, duration: 0.25, ease: 'back.out(2)' }
    );

    setRequestedIds((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  // Toggle "Follow / Following" on a developer row
  const handleToggleFollow = (devId: string) => {
    setFollowedDevs((prev) =>
      prev.includes(devId) ? prev.filter((id) => id !== devId) : [...prev, devId]
    );
  };

  return (
    <div
      ref={discoveryRef}
      className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start"
    >
      {/* =========================================================
          LEFT / CENTER COLUMN (8 Cols): OPEN PROJECTS MARKETPLACE
      ========================================================= */}
      <div className="xl:col-span-8 space-y-6">
        {/* Top Discovery Hero Banner */}
        <div className="discovery-header-block relative rounded-2xl bg-gradient-to-br from-[#16102b] via-[#0e0b1a] to-[#090812] border border-purple-500/30 p-6 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-semibold text-purple-300 mb-2.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" />
                <span>Collaboration Engine • Discovery</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Discover Projects &amp; Partners
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
                Explore open repositories seeking collaborators, match with verified
                developers, and join active sprint boards in real-time.
              </p>
            </div>

            {/* Quick Search Input inside Discovery */}
            <div className="w-full md:w-64 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Filter by role or repo..."
                  className="w-full rounded-xl bg-[#090710]/90 border border-white/[0.1] pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Filter Bar */}
        <div className="discovery-header-block flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>Stack:</span>
            </span>

            {TECH_FILTERS.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => setSelectedTech(tech)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedTech === tech
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'bg-[#0d0b16] text-zinc-400 border border-white/[0.07] hover:text-zinc-200 hover:border-purple-500/30'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          <span className="text-xs text-zinc-400">
            Showing <strong className="text-white">{filteredProjects.length}</strong> open
            projects
          </span>
        </div>

        {/* Open Projects 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => {
            const isRequested = requestedIds.includes(project.id);

            return (
              <div
                key={project.id}
                className="discover-project-card group relative rounded-2xl bg-[#0d0b16] border border-white/[0.08] hover:border-purple-500/50 p-5 flex flex-col justify-between transition-[border-color,box-shadow,background-color] duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.45)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] overflow-hidden"
              >
                {/* Top Gradient Highlight Bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${project.accentGradient}`}
                />

                <div>
                  {/* Owner Row + Star Count */}
                  <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={project.ownerAvatar}
                        alt={project.ownerHandle}
                        className="w-6 h-6 rounded-full object-cover border border-purple-500/40"
                      />
                      <span className="text-xs text-zinc-400 font-medium">
                        {project.ownerHandle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {project.stars}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        {project.openSpots} {project.openSpots === 1 ? 'spot' : 'spots'} left
                      </span>
                    </div>
                  </div>

                  {/* Project Title & Description */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                    <span>{project.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                  </h3>

                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* "Looking For" Role Highlight Box */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-[#131022] border border-purple-500/25 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                          Seeking Partner Role
                        </span>
                        <span className="text-xs font-semibold text-purple-200 truncate block">
                          {project.lookingForRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tech Stack Pills + Active Branch */}
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
                      {project.activeBranch}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Updated Time + Interactive Join Request Button */}
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Active {project.updatedAgo}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => handleToggleJoinRequest(project.id, e)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isRequested
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] hover:brightness-110'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Request Sent</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Request to Join</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          RIGHT COLUMN (4 Cols): DEVELOPER DISCOVERY & NETWORK GRAPH
      ========================================================= */}
      <div className="xl:col-span-4 space-y-5">
        {/* WIDGET 1: Developer Discovery (Matches Reference Image 1) */}
        <div className="discovery-right-widget rounded-2xl bg-[#0d0b16] border border-purple-500/35 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Developer Discovery</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </h2>
            <span className="text-[11px] text-purple-300 font-medium">
              Top Matches
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Recommended partners based on your TypeScript &amp; React stack
          </p>

          <div className="space-y-3">
            {DISCOVER_DEVELOPERS.map((dev) => {
              const isFollowing = followedDevs.includes(dev.id);

              return (
                <div
                  key={dev.id}
                  className="p-3 rounded-xl bg-[#131020] hover:bg-[#171327] border border-white/[0.05] transition-colors space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={dev.avatar}
                          alt={dev.name}
                          className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-[#131020] ${
                            dev.online ? 'bg-emerald-400' : 'bg-zinc-600'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white truncate">
                            {dev.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-purple-500/20 text-purple-300">
                            {dev.matchScore}% match
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {dev.specialty}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFollow(dev.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                        isFollowing
                          ? 'bg-purple-600/25 text-purple-200 border border-purple-500/50'
                          : 'bg-zinc-800 text-zinc-200 border border-white/10 hover:border-purple-500 hover:text-white'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>

                  {/* Mini Skill Pills */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {dev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0b0914] text-zinc-300 border border-white/[0.05]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WIDGET 2: Partner Networks Constellation Card (Matches Reference Image 3) */}
        <div className="discovery-right-widget rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-white">Partner Networks</h2>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
              <Flame className="w-3 h-3" />
              24 Active Rooms
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Live encrypted collaboration graph across your stack
          </p>

          {/* Interactive SVG Constellation Box */}
          <div className="relative h-40 w-full rounded-xl bg-[#110e1d] border border-purple-500/30 overflow-hidden flex items-center justify-center">
            <svg
              viewBox="0 0 240 140"
              className="absolute inset-0 w-full h-full stroke-purple-500/30"
              strokeWidth="1.2"
              fill="none"
            >
              <line x1="45" y1="45" x2="115" y2="25" />
              <line x1="115" y1="25" x2="190" y2="55" />
              <line x1="45" y1="45" x2="65" y2="110" />
              <line x1="45" y1="45" x2="125" y2="78" />
              <line x1="115" y1="25" x2="125" y2="78" />
              <line x1="190" y1="55" x2="125" y2="78" />
              <line x1="65" y1="110" x2="125" y2="78" />
              <line x1="125" y1="78" x2="185" y2="112" />
              <line x1="190" y1="55" x2="185" y2="112" />
            </svg>

            {/* Center Hub Node */}
            <div className="network-constellation-node relative z-10 w-9 h-9 rounded-full bg-purple-600/40 border border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)] flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>

            {/* Outer Satellite Nodes */}
            <div className="network-constellation-node absolute top-3 left-[44%] w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/70 flex items-center justify-center text-purple-200">
              <Code2 className="w-3 h-3" />
            </div>

            <div className="network-constellation-node absolute top-7 left-7 w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-400/70 flex items-center justify-center text-indigo-200">
              <Users className="w-3 h-3" />
            </div>

            <div className="network-constellation-node absolute top-9 right-6 w-7 h-7 rounded-full bg-purple-600/50 border border-purple-300 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.75)]">
              <Lock className="w-3.5 h-3.5" />
            </div>

            <div className="network-constellation-node absolute bottom-3 left-11 w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-400/60 flex items-center justify-center text-emerald-200">
              <ShieldCheck className="w-3 h-3" />
            </div>

            <div className="network-constellation-node absolute bottom-3 right-7 w-6 h-6 rounded-full bg-purple-600/30 border border-purple-400/60 flex items-center justify-center text-purple-200">
              <GitBranch className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiscoveryPage;