import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import DevPilotLogo from '../components/ui/DevPilotLogo';
import {
  ArrowLeft,
  LayoutGrid,
  Terminal,
  Compass,
  KanbanSquare,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

interface NotFoundLocationState {
  attemptedPath?: string;
}

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Captures the broken URL passed during the redirect to /404
  const state = location.state as NotFoundLocationState | null;
  const attemptedPath = state?.attemptedPath || location.pathname;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.nf-reveal',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.1,
          clearProps: 'transform',
        }
      );

      // Gentle ambient hover float on the 404 heading
      gsap.to('.nf-float', {
        y: -8,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Soft pulse on the purple radial aura
      gsap.to('.nf-aura', {
        scale: 1.08,
        opacity: 0.85,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Decorative 4-point star rotation
      gsap.to('.nf-sparkle', {
        rotation: 18,
        scale: 1.1,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const quickLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Task Board', path: '/tasks', icon: KanbanSquare },
    { label: 'Partner Chats', path: '/chats', icon: MessageSquare },
    { label: 'Discovery', path: '/discovery', icon: Compass },
  ];

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#050508] text-white font-sans relative overflow-hidden flex flex-col items-center justify-center px-6 py-12 selection:bg-purple-600 selection:text-white"
    >
      {/* Subtle Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px]"
      />

      {/* Ambient Neon Purple Aura */}
      <div
        aria-hidden="true"
        className="nf-aura pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-purple-700/25 via-fuchsia-600/15 to-indigo-600/20 blur-3xl opacity-70"
      />

      {/* Top Brand Logo */}
      <div className="nf-reveal mb-8 relative z-10">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer focus:outline-none"
        >
          <DevPilotLogo size={34} showText={true} autoPlayInterval={12} />
        </button>
      </div>

      {/* Main Glassmorphic 404 Card */}
      <div className="nf-reveal relative z-10 w-full max-w-xl rounded-3xl bg-[#0c0a14]/90 backdrop-blur-xl border border-purple-500/40 shadow-[0_0_55px_rgba(147,51,234,0.2)] p-7 sm:p-10 text-center">
        {/* Status Pill */}
        <div className="nf-reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[11px] font-semibold uppercase tracking-widest text-rose-300 mb-5">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>Route Signal Lost</span>
        </div>

        {/* Floating Giant 404 */}
        <div className="nf-float relative select-none">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tighter leading-none bg-gradient-to-b from-white via-purple-200 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(168,85,247,0.55)]">
            404
          </h1>
        </div>

        <h2 className="nf-reveal mt-4 text-xl sm:text-2xl font-bold text-white tracking-tight">
          Coordinates Not Found
        </h2>

        <p className="nf-reveal mt-2 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
          The workspace route you tried to access doesn&apos;t exist or may have
          been moved to another branch.
        </p>

        {/* Terminal Diagnostic Box */}
        <div className="nf-reveal mt-6 rounded-2xl bg-[#07060d] border border-white/[0.08] overflow-hidden text-left font-mono text-xs">
          <div className="px-3.5 py-2 bg-[#110e1c] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Terminal className="w-3 h-3 text-purple-400" />
              devpilot-router
            </span>
          </div>

          <div className="p-4 space-y-1.5 text-[11px] sm:text-xs">
            <div className="text-zinc-400">
              <span className="text-purple-400">$</span> resolve-route{' '}
              <span className="text-white break-all">{attemptedPath}</span>
            </div>
            <div className="text-rose-400">
              ✖ Error 404: No matching workspace endpoint found.
            </div>
            <div className="text-emerald-400/90">
              ➜ Ready to reroute back to safe dock.
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="nf-reveal mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 text-white shadow-[0_0_26px_rgba(168,85,247,0.6)] hover:brightness-110 flex items-center justify-center gap-2 transition-[filter,box-shadow] cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#131020] text-zinc-300 border border-white/10 hover:border-purple-500/50 hover:text-white flex items-center justify-center gap-2 transition-[border-color,color] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Quick Jump Workspace Links */}
        <div className="nf-reveal mt-7 pt-6 border-t border-white/[0.06]">
          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-3">
            Quick Navigation
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131020] hover:bg-purple-600/20 border border-white/[0.07] hover:border-purple-500/40 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-purple-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decorative 4-Point Star (Matches Landing & Auth Pages) */}
        <svg
          viewBox="0 0 100 100"
          className="nf-sparkle w-10 h-10 text-zinc-600/60 absolute -bottom-3 -right-4 pointer-events-none"
          fill="currentColor"
        >
          <path d="M50 0 C55 35 65 45 100 50 C65 55 55 65 50 100 C45 65 35 55 0 50 C35 45 45 35 50 0 Z" />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundPage;