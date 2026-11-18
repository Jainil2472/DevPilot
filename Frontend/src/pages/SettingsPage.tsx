import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Settings,
  User,
  GitBranch,
  ShieldCheck,
  Bell,
  Lock,
  Key,
  Check,
  Plus,
  X,
  RefreshCw,
  Sparkles,
  Copy,
  Laptop,
  Code2,
  Save,
  CheckCircle2,
} from 'lucide-react';

// --- TypeScript Interfaces ---
type SettingsSection = 'profile' | 'github' | 'security' | 'notifications';

interface ConnectedRepo {
  id: string;
  name: string;
  branch: string;
  autoSyncCommits: boolean;
  lastSynced: string;
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  lastActive: string;
}

// --- Initial DevPilot Settings Data ---
const INITIAL_REPOS: ConnectedRepo[] = [
  {
    id: 'repo-1',
    name: 'johncarraher/connect-4-ai',
    branch: 'feat/minimax-ai',
    autoSyncCommits: true,
    lastSynced: '14m ago',
  },
  {
    id: 'repo-2',
    name: 'devpilot-org/devpilot-client',
    branch: 'main',
    autoSyncCommits: true,
    lastSynced: '1h ago',
  },
  {
    id: 'repo-3',
    name: 'johncarraher/ecommerce-core',
    branch: 'feat/cart-locks',
    autoSyncCommits: false,
    lastSynced: 'Yesterday',
  },
];

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'Ubuntu Linux • Chrome 130',
    location: 'Active Workspace',
    ip: '192.168.1.42',
    isCurrent: true,
    lastActive: 'Active now',
  },
  {
    id: 'sess-2',
    device: 'MacBook Pro • VS Code Webview',
    location: 'Remote SSH Session',
    ip: '10.0.14.88',
    isCurrent: false,
    lastActive: '4h ago',
  },
];

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // 1. Developer Profile State (Reflects live in the Right Preview Card)
  const [displayName, setDisplayName] = useState<string>('John Carraher');
  const [username, setUsername] = useState<string>('@johncarraher');
  const [specialty, setSpecialty] = useState<string>(
    'Full-Stack TypeScript & Distributed Systems'
  );
  const [bio, setBio] = useState<string>(
    'Building real-time developer collaboration tools, WebSocket engines, and containerized Node.js microservices.'
  );
  const [openToInvites, setOpenToInvites] = useState<boolean>(true);
  const [skills, setSkills] = useState<string[]>([
    'TS',
    'Node',
    'React',
    'Tailwind',
    'MongoDB',
    'Docker',
  ]);
  const [newSkillInput, setNewSkillInput] = useState<string>('');

  // 2. GitHub & Octokit State
  const [repos, setRepos] = useState<ConnectedRepo[]>(INITIAL_REPOS);
  const [webhookSecretCopied, setWebhookSecretCopied] = useState<boolean>(false);
  const [prAutoLink, setPrAutoLink] = useState<boolean>(true);

  // 3. Security & E2E Encryption State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [e2eFingerprint, setE2eFingerprint] = useState<string>(
    '8F:4D:2A:99:C1:7E:04:B2'
  );
  const [isRotatingKey, setIsRotatingKey] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);

  // 4. Notification Preferences State
  const [notifyJoinRequests, setNotifyJoinRequests] = useState<boolean>(true);
  const [notifyProjectInvites, setNotifyProjectInvites] = useState<boolean>(true);
  const [notifyEncryptedChats, setNotifyEncryptedChats] = useState<boolean>(true);
  const [notifyGitCommits, setNotifyGitCommits] = useState<boolean>(false);

  // GSAP Scope Ref
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // SAFE GSAP ENTRANCE & TAB SWITCH ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.settings-header-item',
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.07, clearProps: 'transform' }
      )
        .fromTo(
          '.settings-card-block',
          { y: 20, opacity: 0, scale: 0.99 },
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
          '.settings-right-widget',
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, clearProps: 'transform' },
          '-=0.35'
        );
    }, settingsRef);

    return () => ctx.revert();
  }, [activeSection]);

  // Add a skill tag to Developer Profile
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newSkillInput.trim();
    if (!cleaned || skills.includes(cleaned)) return;
    setSkills((prev) => [...prev, cleaned]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Toggle Octokit Auto-Sync on a repository
  const handleToggleRepoSync = (repoId: string) => {
    setRepos((prev) =>
      prev.map((r) =>
        r.id === repoId ? { ...r, autoSyncCommits: !r.autoSyncCommits } : r
      )
    );
  };

  // Rotate E2E Encryption Keypair with GSAP spin feedback
  const handleRotateE2EKey = () => {
    setIsRotatingKey(true);
    gsap.fromTo(
      '.rotate-key-icon',
      { rotation: 0 },
      { rotation: 360, duration: 0.65, ease: 'power2.inOut' }
    );

    setTimeout(() => {
      const randomHex = () =>
        Math.floor(16 + Math.random() * 239)
          .toString(16)
          .toUpperCase();
      setE2eFingerprint(
        `${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}:${randomHex()}`
      );
      setIsRotatingKey(false);
    }, 650);
  };

  // Revoke a secondary session
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  // Trigger Save Changes Toast
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2600);
  };

  const handleCopyWebhookSecret = () => {
    navigator.clipboard.writeText('whsec_devpilot_99482a10f8c3e7d1');
    setWebhookSecretCopied(true);
    setTimeout(() => setWebhookSecretCopied(false), 1800);
  };

  const navTabs: { id: SettingsSection; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Developer Profile', icon: User },
    { id: 'github', label: 'GitHub & Octokit', icon: GitBranch },
    { id: 'security', label: 'Security & E2E Keys', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div
      ref={settingsRef}
      className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start"
    >
      {/* =========================================================
          LEFT / CENTER COLUMN (8 Cols): SETTINGS CONFIGURATION
      ========================================================= */}
      <div className="xl:col-span-8 space-y-6">
        {/* Top Settings Banner */}
        <div className="settings-header-item relative rounded-2xl bg-gradient-to-br from-[#15102a] via-[#0d0b18] to-[#090812] border border-purple-500/30 p-6 overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[11px] font-semibold text-purple-300 mb-2.5">
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                <span>Workspace Configuration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Account &amp; Engine Settings
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage your developer discovery profile, Octokit repository webhooks,
                and end-to-end encryption keys.
              </p>
            </div>

            {/* Save Confirmation Pill */}
            {saveToast && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Settings Saved</span>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="settings-header-item flex flex-wrap items-center gap-2 border-b border-white/[0.07] pb-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0d0b16] p-1.5 rounded-xl border border-white/[0.07]">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            SECTION 1: DEVELOPER PROFILE & STACK
        ========================================================= */}
        {activeSection === 'profile' && (
          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="settings-card-block rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">
                    Public Developer Identity
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Displayed on Project Discovery and partner invite cards.
                  </p>
                </div>

                {/* Availability Toggle */}
                <button
                  type="button"
                  onClick={() => setOpenToInvites(!openToInvites)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-colors cursor-pointer ${
                    openToInvites
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                      : 'bg-zinc-900 text-zinc-400 border-white/10'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      openToInvites ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'
                    }`}
                  />
                  <span>
                    {openToInvites ? 'Open to Invites' : 'Busy / Do Not Disturb'}
                  </span>
                </button>
              </div>

              {/* Name & Unique Username Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Unique Username
                    </label>
                    <span className="text-[10px] text-purple-300 font-medium">
                      Must be unique
                    </span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl bg-[#131020] border border-purple-500/40 px-3.5 py-2.5 text-xs sm:text-sm text-purple-200 font-mono focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>
              </div>

              {/* Primary Specialty Headline */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Developer Specialty Headline
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500/60 transition-colors"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Collaboration Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl bg-[#131020] border border-white/[0.08] p-3.5 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
                />
              </div>

              {/* Interactive Tech Stack Tags */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  Primary Tech Stack (Used for Discovery Matching)
                </label>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/15 text-purple-200 border border-purple-500/35"
                    >
                      <Code2 className="w-3 h-3 text-purple-400" />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-purple-300/70 hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add New Skill Pill */}
                <div className="flex items-center gap-2 max-w-xs">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    placeholder="Add skill (e.g. Socket.io, Zod)..."
                    className="flex-1 rounded-xl bg-[#131020] border border-white/[0.08] px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/60"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-purple-600 text-xs font-semibold text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Save Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white font-semibold text-xs sm:text-sm shadow-[0_0_24px_rgba(168,85,247,0.55)] hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =========================================================
            SECTION 2: GITHUB & OCTOKIT WEBHOOK SYNC
        ========================================================= */}
        {activeSection === 'github' && (
          <div className="space-y-5">
            <div className="settings-card-block rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">
                      Octokit Automated Git Sync
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      Connected
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Automatically link GitHub commits and branch pushes to your
                    DevPilot Task Board.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl">
                    github.com/johncarraher
                  </span>
                </div>
              </div>

              {/* Webhook Signing Secret Box */}
              <div className="p-4 rounded-xl bg-[#131020] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">
                    Octokit Webhook Signing Secret
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Used to verify automated commit payloads from your repositories.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyWebhookSecret}
                  className="px-3.5 py-2 rounded-xl bg-[#0b0914] border border-white/10 hover:border-purple-500/50 text-xs font-mono text-zinc-200 flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                >
                  <span>whsec_devpilot_••••••e7d1</span>
                  {webhookSecretCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </button>
              </div>

              {/* Connected Repositories List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-zinc-300">
                  Repository Commit Auto-Sync
                </div>

                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-3.5 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {repo.name}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/25">
                          <GitBranch className="w-2.5 h-2.5" />
                          {repo.branch}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        Last webhook payload: {repo.lastSynced}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleRepoSync(repo.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                        repo.autoSyncCommits
                          ? 'bg-purple-600/25 text-purple-200 border-purple-500/50'
                          : 'bg-zinc-900 text-zinc-400 border-white/10'
                      }`}
                    >
                      {repo.autoSyncCommits ? 'Sync Active' : 'Paused'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Auto-move task on PR merge toggle */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Auto-Advance Task Card on PR Merge
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Automatically move linked DP-XXX tasks to &ldquo;Review &amp;
                    Done&rdquo; when a pull request merges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPrAutoLink(!prAutoLink)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    prAutoLink ? 'bg-purple-600' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      prAutoLink ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 3: SECURITY, PASSWORD & E2E ENCRYPTION KEYS
        ========================================================= */}
        {activeSection === 'security' && (
          <div className="space-y-5">
            {/* E2E Encryption Keypair Card */}
            <div className="settings-card-block rounded-2xl bg-[#0d0b16] border border-purple-500/35 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">
                      End-to-End Partner Chat Keypair
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Cryptographic identity used for WhatsApp-style E2E partner
                      threads.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRotateE2EKey}
                  disabled={isRotatingKey}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-200 flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
                >
                  <RefreshCw className="rotate-key-icon w-3.5 h-3.5" />
                  <span>{isRotatingKey ? 'Rotating...' : 'Rotate E2E Key'}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-[#131020] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Active Key Fingerprint:</span>
                <span className="text-emerald-300 font-semibold">
                  {e2eFingerprint}
                </span>
              </div>
            </div>

            {/* Password Update Form */}
            <form
              onSubmit={handleSaveSettings}
              className="settings-card-block rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4"
            >
              <h2 className="text-base font-bold text-white">
                Update Password
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Re-enter New Password
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-[#131020] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500/60"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-xs font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] hover:brightness-110 cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>

            {/* Active JWT Sessions */}
            <div className="settings-card-block rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-3">
              <h2 className="text-base font-bold text-white">
                Active Device Sessions
              </h2>

              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <Laptop className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {sess.device}
                        </span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        {sess.location} • {sess.ip} • {sess.lastActive}
                      </p>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-medium cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            SECTION 4: WORKSPACE NOTIFICATIONS
        ========================================================= */}
        {activeSection === 'notifications' && (
          <div className="settings-card-block rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4">
            <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-3">
              Real-Time Collaboration Alerts
            </h2>

            {[
              {
                title: 'Incoming Project Join Requests',
                desc: 'Notify immediately when a developer requests to join your repository.',
                enabled: notifyJoinRequests,
                toggle: () => setNotifyJoinRequests(!notifyJoinRequests),
              },
              {
                title: 'Partner Collaboration Invites',
                desc: 'Notify when another project owner invites your @username to collaborate.',
                enabled: notifyProjectInvites,
                toggle: () => setNotifyProjectInvites(!notifyProjectInvites),
              },
              {
                title: 'Encrypted Partner Chat Messages',
                desc: 'Show unread badges and sound alerts for E2E direct and room messages.',
                enabled: notifyEncryptedChats,
                toggle: () => setNotifyEncryptedChats(!notifyEncryptedChats),
              },
              {
                title: 'Octokit Automated Commit Pushes',
                desc: 'Show toast alerts when a partner pushes commits to an active sprint branch.',
                enabled: notifyGitCommits,
                toggle: () => setNotifyGitCommits(!notifyGitCommits),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={item.toggle}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                    item.enabled ? 'bg-purple-600' : 'bg-zinc-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          RIGHT COLUMN (4 Cols): LIVE DISCOVERY CARD PREVIEW
      ========================================================= */}
      <div className="xl:col-span-4 space-y-5">
        {/* WIDGET 1: Live Discovery Profile Preview */}
        <div className="settings-right-widget rounded-2xl bg-[#0d0b16] border border-purple-500/40 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Live Discovery Preview</span>
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300">
              Public Card
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            How other developers see you in Project Discovery:
          </p>

          {/* Simulated Developer Discovery Card */}
          <div className="p-4 rounded-2xl bg-[#131020] border border-purple-500/30 space-y-3.5 shadow-inner">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt={displayName}
                    className="w-11 h-11 rounded-full object-cover border border-purple-500/50"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#131020] ${
                      openToInvites ? 'bg-emerald-400' : 'bg-zinc-500'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {displayName || 'Developer Name'}
                  </div>
                  <div className="text-xs font-mono text-purple-300 truncate">
                    {username || '@username'}
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-purple-600/25 text-purple-200 border border-purple-500/40 shrink-0">
                98% Match
              </span>
            </div>

            <div className="text-xs font-medium text-zinc-200">
              {specialty}
            </div>

            <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
              {bio}
            </p>

            {/* Skills Preview */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0b0914] text-zinc-300 border border-white/[0.06]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* WIDGET 2: Account Verification & Security Status */}
        <div className="settings-right-widget rounded-2xl bg-[#0d0b16] border border-white/[0.08] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verification &amp; Trust Status</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between">
              <span className="text-zinc-300">Email Token Verification</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between">
              <span className="text-zinc-300">E2E Chat Encryption</span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>

            <div className="p-3 rounded-xl bg-[#131020] border border-white/[0.05] flex items-center justify-between">
              <span className="text-zinc-300">Octokit Webhook Status</span>
              <span className="text-purple-300 font-semibold">
                {repos.filter((r) => r.autoSyncCommits).length}/{repos.length} Repos
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;