import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Info,
  Clock,
  AlertCircle,
  Users,
  GitBranch,
  Database,
  Workflow,
  Search,
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  Settings,
  Eye,
  EyeOff,
} from 'lucide-react';

type AuthMode = 'signup' | 'login';

interface PendingTransition {
  startHeight: number;
  direction: number;
}

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  size: 'sm' | 'md' | 'lg';
  variant: 'glow' | 'muted';
}

const FEATURES = [
  { title: 'Discover & Build:', desc: 'Team up with project partners.' },
  { title: 'Collaborate in Real-time:', desc: 'Task board, GIT integration.' },
  { title: 'Secure Chat:', desc: 'WhatsApp-style E2E message platform.' },
];

const SIDEBAR_ITEMS = [
  { Icon: LayoutDashboard, width: 'w-11', active: true },
  { Icon: Workflow, width: 'w-9', active: false },
  { Icon: FolderKanban, width: 'w-10', active: false },
  { Icon: MessageSquare, width: 'w-8', active: false },
  { Icon: Settings, width: 'w-9', active: false, spaced: true },
];

const NETWORK_NODES: NetworkNode[] = [
  { id: 'top', x: 102, y: 24, size: 'lg', variant: 'glow' },
  { id: 'mid-left', x: 34, y: 58, size: 'md', variant: 'glow' },
  { id: 'center', x: 96, y: 74, size: 'sm', variant: 'muted' },
  { id: 'mid-right', x: 165, y: 55, size: 'lg', variant: 'glow' },
  { id: 'bot-left', x: 52, y: 115, size: 'lg', variant: 'glow' },
  { id: 'bot-right', x: 148, y: 112, size: 'lg', variant: 'glow' },
];

const NETWORK_PATHS = [
  'M 34 58 Q 65 34 102 24',
  'M 102 24 Q 136 32 165 55',
  'M 34 58 Q 36 88 52 115',
  'M 52 115 Q 100 122 148 112',
  'M 165 55 Q 162 86 148 112',
  'M 34 58 Q 66 62 96 74',
  'M 102 24 Q 102 49 96 74',
  'M 165 55 Q 130 60 96 74',
  'M 52 115 Q 72 92 96 74',
  'M 148 112 Q 124 90 96 74',
  'M 52 115 Q 102 86 165 55',
];

const INPUT_CLASS =
  'w-full rounded-lg bg-[#12101b] border border-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500/70 transition-all';

const AuthPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState(true);

  const [signUpData, setSignUpData] = useState({
    username: '@username',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loginData, setLoginData] = useState({
    email: 'mock.email@gmail.com',
    password: '',
  });

  const pageRef = useRef<HTMLDivElement>(null);
  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const formContentRef = useRef<HTMLDivElement>(null);
  const pillIndicatorRef = useRef<HTMLDivElement>(null);
  const auraGlowRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const pendingTransitionRef = useRef<PendingTransition | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.left-animate', { x: -30, opacity: 0, duration: 0.7, stagger: 0.12 })
        .from('.engine-preview-panel', { y: 25, scale: 0.96, opacity: 0, duration: 0.8 }, '-=0.4')
        // Notice the slightly different animation path for the higher float card
        .from('.partner-float-card', { x: 30, y: -10, opacity: 0, duration: 0.85, ease: "back.out(1.2)" }, '-=0.5')
        .from('.auth-card-container', { y: 30, opacity: 0, duration: 0.8 }, '-=0.65');

      gsap.to('.purple-aura', {
        scale: 1.05,
        opacity: 0.85,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.network-node-pulse', {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.28,
        ease: 'sine.inOut',
      });

      gsap.to('.sparkle-star', {
        rotation: 15,
        scale: 1.1,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleModeSwitch = (targetMode: AuthMode) => {
    if (targetMode === authMode || isTransitioningRef.current) return;
    if (!cardWrapperRef.current || !formContentRef.current) {
      setAuthMode(targetMode);
      return;
    }

    isTransitioningRef.current = true;
    setShowPassword(false);
    setShowConfirmPassword(false);

    const direction = targetMode === 'login' ? 1 : -1;
    const startHeight = cardWrapperRef.current.offsetHeight;

    gsap.set(cardWrapperRef.current, { height: startHeight, overflow: 'hidden' });

    if (pillIndicatorRef.current) {
      gsap.to(pillIndicatorRef.current, {
        xPercent: targetMode === 'signup' ? 0 : 100,
        duration: 0.75,
        ease: 'power3.inOut',
      });
    }

    if (auraGlowRef.current) {
      gsap.fromTo(
        auraGlowRef.current,
        { opacity: 0.75, scale: 1 },
        { opacity: 1, scale: 1.07, duration: 0.55, yoyo: true, repeat: 1, ease: 'sine.inOut' }
      );
    }

    gsap.to(formContentRef.current.querySelectorAll('.auth-stagger'), {
      opacity: 0,
      x: direction * -22,
      y: -8,
      filter: 'blur(5px)',
      duration: 0.42,
      stagger: 0.035,
      ease: 'power2.in',
      onComplete: () => {
        pendingTransitionRef.current = { startHeight, direction };
        setAuthMode(targetMode);
      },
    });
  };

  useLayoutEffect(() => {
    const transition = pendingTransitionRef.current;
    if (!transition || !cardWrapperRef.current || !cardInnerRef.current || !formContentRef.current) {
      return;
    }

    pendingTransitionRef.current = null;
    const { startHeight, direction } = transition;
    const endHeight = cardInnerRef.current.offsetHeight;

    const tl = gsap.timeline({
      onComplete: () => {
        if (cardWrapperRef.current) {
          gsap.set(cardWrapperRef.current, { height: 'auto', overflow: 'visible' });
        }
        isTransitioningRef.current = false;
      },
    });

    tl.fromTo(
      cardWrapperRef.current,
      { height: startHeight },
      { height: endHeight, duration: 0.75, ease: 'power3.inOut' },
      0
    ).fromTo(
      formContentRef.current.querySelectorAll('.auth-stagger'),
      { opacity: 0, x: direction * 26, y: 12, filter: 'blur(6px)' },
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.65,
        stagger: 0.075,
        ease: 'power3.out',
        clearProps: 'filter,transform',
      },
      0.18
    );
  }, [authMode]);

  const renderEyeButton = (visible: boolean, onToggle: () => void) => (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Hide password' : 'Show password'}
      className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
    >
      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  const renderSignUpForm = () => (
    <div>
      <div className="auth-stagger">
        <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 mb-6">
          Join the Developer Collaboration Engine.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 text-left">
        <div className="auth-stagger">
          <label className="block text-xs font-medium text-zinc-200 mb-1">
            Username
            <span className="block text-[11px] font-normal text-zinc-500">Must be unique</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={signUpData.username}
              onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
              placeholder="@username"
              className="w-full rounded-lg bg-[#12101b] border border-purple-500/70 px-3.5 py-2.5 pr-28 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-400 focus:shadow-[0_0_12px_rgba(168,85,247,0.35)] transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] text-zinc-400 pointer-events-none">
              <Info className="w-3.5 h-3.5" />
              <span>Must be unique</span>
            </div>
          </div>
        </div>

        <div className="auth-stagger">
          <label className="block text-xs font-medium text-zinc-200 mb-1.5">Email Address</label>
          <input
            type="email"
            value={signUpData.email}
            onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
            placeholder="email@example.com"
            className={INPUT_CLASS}
          />
        </div>

        <div className="auth-stagger">
          <label className="block text-xs font-medium text-zinc-200 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={signUpData.password}
              onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
              placeholder="••••••••••"
              className={`${INPUT_CLASS} pr-10`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {renderEyeButton(showPassword, () => setShowPassword((prev) => !prev))}
            </div>
          </div>
        </div>

        <div className="auth-stagger">
          <label className="block text-xs font-medium text-zinc-200 mb-1.5">
            Re-enter Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={signUpData.confirmPassword}
              onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
              placeholder="••••••••••"
              className={`${INPUT_CLASS} pr-10`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {renderEyeButton(showConfirmPassword, () => setShowConfirmPassword((prev) => !prev))}
            </div>
          </div>
        </div>

        <div className="auth-stagger flex items-center justify-between pt-1 text-[11px] text-zinc-400 leading-relaxed">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              A verification link will be sent to your email.
              <br />
              Expires in 1 hour.
            </span>
          </div>
        </div>

        <div className="auth-stagger pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#9353d3] via-[#a855f7] to-[#7e22ce] text-white font-semibold text-xs sm:text-sm shadow-[0_0_28px_rgba(168,85,247,0.65)] hover:shadow-[0_0_35px_rgba(168,85,247,0.9)] hover:brightness-110 transition-all cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        <p className="auth-stagger text-center text-xs text-zinc-400 pt-2">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className="text-purple-400 hover:text-purple-300 underline underline-offset-4 font-medium cursor-pointer"
          >
            Log in
          </button>
        </p>
      </form>
    </div>
  );

  const renderLoginForm = () => (
    <div>
      <div className="auth-stagger">
        <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mt-2">
          Log In
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 mb-7 leading-relaxed">
          Welcome back. Redirecting to Homepage
          <br />
          upon successful authentication.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5 text-left">
        <div className="auth-stagger">
          <label className="block text-xs font-medium text-zinc-200 mb-1.5">Email Address</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            placeholder="mock.email@gmail.com"
            className={INPUT_CLASS}
          />
        </div>

        <div className="auth-stagger">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-zinc-200">Password</label>
            <button
              type="button"
              onClick={() => setLoginError(!loginError)}
              className="text-[10px] text-zinc-500 hover:text-purple-400 transition-colors cursor-pointer"
            >
              {loginError ? 'Clear error state' : 'Show error state'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginData.password}
              placeholder="••••••••"
              onChange={(e) => {
                setLoginData({ ...loginData, password: e.target.value });
                if (loginError) setLoginError(false);
              }}
              className={`w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 transition-all focus:outline-none ${
                loginError
                  ? 'pr-16 bg-[#25131a] border border-rose-500/60 focus:border-rose-400'
                  : 'pr-10 bg-[#12101b] border border-zinc-800 focus:border-purple-500/70'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {loginError && <AlertCircle className="w-4 h-4 text-rose-400/90 pointer-events-none" />}
              {renderEyeButton(showPassword, () => setShowPassword((prev) => !prev))}
            </div>
          </div>

          {loginError && (
            <p className="text-[11px] text-rose-400/80 mt-1.5">
              Incorrect password. Please try again.
            </p>
          )}
        </div>

        <div className="auth-stagger pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-[#150f24] border border-purple-500/80 text-purple-200 font-semibold text-xs sm:text-sm shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:shadow-[0_0_32px_rgba(168,85,247,0.75)] hover:bg-purple-950/50 hover:text-white transition-all cursor-pointer"
          >
            Log In
          </button>
        </div>

        <p className="auth-stagger text-center text-xs text-zinc-400 pt-2">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => handleModeSwitch('signup')}
            className="text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
          >
            Sign Up
          </button>{' '}
          &amp;{' '}
          <a href="#forgot" className="text-purple-400 hover:text-purple-300 font-medium">
            Forgot Password?
          </a>
        </p>
      </form>
    </div>
  );

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden flex flex-col justify-between"
    >
      <main className="max-w-7xl w-full mx-auto px-6 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center flex-1">
        {/* Left Column: Product Overview & Preview */}
        <div className="lg:col-span-7 lg:pr-10 flex flex-col justify-between space-y-8 lg:border-r lg:border-zinc-900/90">
          <div>
            <div className="left-animate text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-purple-400 mb-3">
              DEVPILOT
            </div>

            <h1 className="left-animate text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12] text-white">
              The Developer
              <br />
              Collaboration Engine.
            </h1>

            {/* Engine Preview Mockup */}
            <div className="engine-preview-panel relative mt-12 max-w-[530px] sm:mr-6">
              {/* Top-left purple ambient glow */}
              <div className="purple-aura absolute -inset-3 bg-gradient-to-r from-purple-600/30 via-fuchsia-600/20 to-indigo-600/20 rounded-2xl blur-xl opacity-75 pointer-events-none" />

              {/* Main App Window */}
              <div className="relative rounded-xl bg-[#0b0914] border border-purple-500/45 shadow-[0_0_35px_rgba(139,92,246,0.2)]">
                {/* Top Window Header Bar */}
                <div className="h-8 px-3 border-b border-white/5 bg-[#120e21] rounded-t-xl flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded bg-purple-600 flex items-center justify-center text-[8px] font-bold">
                      D
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-200">DevPilot</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 bg-[#090710] border border-white/5 rounded-md px-2 py-0.5 w-36">
                    <Search className="w-2.5 h-2.5 text-zinc-500" />
                    <div className="w-16 h-1.5 rounded bg-zinc-700" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    <span className="w-2 h-2 rounded-full bg-purple-500/60" />
                    <span className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-500 to-amber-400" />
                  </div>
                </div>

                {/* Window Body */}
                <div className="grid grid-cols-12 min-h-[195px] rounded-b-xl overflow-hidden">
                  {/* Mini Sidebar */}
                  <div className="col-span-3 sm:col-span-2 border-r border-white/5 bg-[#090710]/95 p-2.5 space-y-2.5">
                    {SIDEBAR_ITEMS.map(({ Icon, width, active, spaced }, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-1.5 ${
                          active ? 'text-purple-400' : 'text-zinc-500'
                        } ${spaced ? 'pt-4' : ''}`}
                      >
                        <Icon className="w-3 h-3 shrink-0" />
                        <div
                          className={`${width} h-1.5 rounded ${
                            active ? 'bg-purple-500/50' : 'bg-zinc-800'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Workflow Diagram Canvas */}
                  <div className="col-span-9 sm:col-span-10 p-3.5 sm:pr-44 relative bg-gradient-to-b from-[#0e0b1a] to-[#08060f]">
                    <div className="text-[10px] font-semibold text-zinc-200 mb-3">Workflow</div>

                    <div className="relative space-y-3 pt-1">
                      <div className="relative z-10 w-36 rounded-lg bg-[#151226] border border-zinc-700/80 px-2.5 py-1.5 flex items-center gap-2 shadow-sm">
                        <GitBranch className="w-3 h-3 text-purple-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] font-medium text-zinc-200">
                            Workflow Timeline
                          </div>
                          <div className="w-12 h-1 rounded bg-zinc-700 mt-0.5" />
                        </div>
                      </div>

                      <div className="w-6 h-4 border-l border-b border-purple-500/50 ml-6 -my-1" />

                      <div className="relative z-10 ml-8 w-40 rounded-lg bg-[#1e1436] border border-purple-500/80 px-2.5 py-1.5 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.35)]">
                        <Database className="w-3 h-3 text-purple-300 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] font-semibold text-purple-100">
                            Database Migration
                          </div>
                          <div className="w-16 h-1 rounded bg-purple-400/50 mt-0.5" />
                        </div>
                      </div>

                      <div className="w-6 h-4 border-l border-b border-purple-500/50 ml-16 -my-1" />

                      <div className="relative z-10 ml-16 w-36 rounded-lg bg-[#151226] border border-zinc-700/80 px-2.5 py-1.5 flex items-center gap-2">
                        <Workflow className="w-3 h-3 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <div className="text-[9px] font-medium text-zinc-300">
                            API Integration
                          </div>
                          <div className="w-10 h-1 rounded bg-zinc-700 mt-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Partner Networks Card (Moved UP and OUT) */}
              <div className="partner-float-card mt-6 sm:mt-0 sm:absolute sm:-top-8 sm:-right-8 sm:w-[225px] z-20">
                <div className="rounded-xl bg-[#0e0b16]/95 backdrop-blur-md border border-purple-500/30 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_24px_rgba(139,92,246,0.18)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_55%,rgba(147,51,234,0.16),transparent_68%)] pointer-events-none" />

                  <div className="text-[11px] font-semibold text-zinc-200 tracking-tight relative z-10">
                    Partner Networks
                  </div>

                  <div className="relative w-full aspect-[200/145] mt-1">
                    <svg
                      viewBox="0 0 200 145"
                      className="absolute inset-0 w-full h-full stroke-purple-400/30"
                      strokeWidth="1.15"
                      fill="none"
                    >
                      {NETWORK_PATHS.map((d, i) => (
                        <path key={i} d={d} />
                      ))}
                    </svg>

                    {NETWORK_NODES.map(({ id, x, y, size, variant }) => {
                      const sizeClass =
                        size === 'lg'
                          ? 'w-7 h-7'
                          : size === 'md'
                            ? 'w-6 h-6'
                            : 'w-5 h-5';
                      const iconSize =
                        size === 'lg'
                          ? 'w-3.5 h-3.5'
                          : size === 'md'
                            ? 'w-3 h-3'
                            : 'w-2.5 h-2.5';
                      const styleClass =
                        variant === 'glow'
                          ? 'network-node-pulse bg-[#211438] border-purple-500/75 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.5)]'
                          : 'bg-[#161321] border-zinc-700/80 text-zinc-400';

                      return (
                        <div
                          key={id}
                          style={{
                            left: `${(x / 200) * 100}%`,
                            top: `${(y / 145) * 100}%`,
                          }}
                          className={`-translate-x-1/2 -translate-y-1/2 absolute rounded-full border flex items-center justify-center ${sizeClass} ${styleClass}`}
                        >
                          <Users className={iconSize} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <ul className="left-animate mt-12 space-y-3 text-xs sm:text-sm text-zinc-300">
              {FEATURES.map(({ title, desc }) => (
                <li key={title} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.9)] shrink-0" />
                  <span>
                    <strong className="font-bold text-white">{title}</strong> {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="left-animate text-[11px] sm:text-xs text-zinc-400 max-w-md leading-relaxed pt-4">
            <strong className="text-zinc-300 font-medium">Verification:</strong> A token expires
            in exactly 1 hour. Active verification required to access the Developer Homepage.
          </p>
        </div>

        {/* Right Column: Auth Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="auth-card-container relative w-full max-w-[410px]">
            <div
              ref={auraGlowRef}
              className="purple-aura absolute -inset-3 bg-gradient-to-b from-purple-600/30 via-purple-600/20 to-indigo-600/25 rounded-3xl blur-2xl opacity-80 pointer-events-none"
            />

            <div
              ref={cardWrapperRef}
              className="relative rounded-2xl bg-[#0c0a14] border border-purple-500/60 shadow-[0_0_40px_rgba(147,51,234,0.25)]"
            >
              <div ref={cardInnerRef} className="p-6 sm:p-8">
                <div className="relative grid grid-cols-2 p-1 rounded-full bg-[#151320] border border-white/5 mb-6">
                  <div className="absolute inset-1 pointer-events-none">
                    <div
                      ref={pillIndicatorRef}
                      className="w-1/2 h-full rounded-full bg-[#262235] shadow-[0_0_14px_rgba(168,85,247,0.25)] border border-purple-500/20"
                    />
                  </div>

                  {(['signup', 'login'] as AuthMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleModeSwitch(mode)}
                      className={`relative z-10 py-1.5 rounded-full text-xs font-semibold transition-colors duration-500 cursor-pointer ${
                        authMode === mode ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {mode === 'signup' ? 'Sign Up' : 'Log In'}
                    </button>
                  ))}
                </div>

                <div ref={formContentRef}>
                  {authMode === 'signup' ? renderSignUpForm() : renderLoginForm()}
                </div>
              </div>

              <svg
                viewBox="0 0 100 100"
                className="sparkle-star w-10 h-10 text-zinc-600/60 absolute -bottom-3 -right-5 pointer-events-none"
                fill="currentColor"
              >
                <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0 Z" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;