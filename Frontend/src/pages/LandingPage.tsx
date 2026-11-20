import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Lock,
  Users,
  ShieldCheck,
  AtSign,
  Type,
  LayoutGrid,
  CheckCircle2,
  Circle,
  Send,
  Smile,
  Paperclip,
} from 'lucide-react';
import { DevPilotLogo } from '#/components/ui/DevPilotLogo';

// Register ScrollTrigger plugin once at module level
gsap.registerPlugin(ScrollTrigger);

// --- TypeScript Interfaces ---
interface DeveloperProfile {
  id: number;
  name: string;
  roleWidth: string;
  avatarColor: string;
}

interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

// --- Static Data ---
const DEVELOPERS: DeveloperProfile[] = [
  { id: 1, name: 'Dev profiles', roleWidth: 'w-16', avatarColor: 'from-amber-400 to-orange-500' },
  { id: 2, name: 'Jadon Sann', roleWidth: 'w-14', avatarColor: 'from-purple-400 to-indigo-500' },
  { id: 3, name: 'Sena Shae', roleWidth: 'w-12', avatarColor: 'from-pink-400 to-rose-500' },
];

const WORK_STEPS: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Initialize',
    description: 'Set up your project and task stack.',
  },
  {
    number: '02',
    title: 'Invite',
    description: 'Partner with other developers.',
  },
  {
    number: '03',
    title: 'Collaborate',
    description: 'Chat, code, and track progress together.',
  },
];

const LandingPage: React.FC = () => {
  // Typed Ref for GSAP Context scoping
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // gsap.context scopes all selector strings (like '.hero-item') to mainRef
    const ctx = gsap.context(() => {
      // 1. HERO TIMELINE (Runs automatically on page load)
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      heroTl
        .from('.nav-bar', {
          y: -25,
          opacity: 0,
          duration: 0.7,
        })
        .from(
          '.hero-item',
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.15, // Animates each hero element 0.15s apart
          },
          '-=0.3' // Starts 0.3s before the navbar finishes
        )
        .from(
          '.hero-blank-screen',
          {
            y: 50,
            scale: 0.96,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.4'
        );

      // 2. CONTINUOUS AMBIENT GLOW ANIMATIONS (Infinite Yoyo Loops)
      gsap.to('.hero-aura', {
        scale: 1.06,
        opacity: 0.85,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.floating-lock', {
        y: -6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 3. SCROLLTRIGGER: CORE CAPABILITIES BENTO GRID
      gsap.from('.bento-card', {
        scrollTrigger: {
          trigger: '.bento-section',
          start: 'top 78%', // Starts when top of section hits 78% of viewport height
          toggleActions: 'play none none reverse',
        },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.15,
        ease: 'power2.out',
      });

      // 4. SCROLLTRIGGER: HOW IT WORKS STEPS
      gsap.from('.step-card', {
        scrollTrigger: {
          trigger: '.steps-section',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.18,
        ease: 'power2.out',
      });

      // Subtle rotation on the decorative 4-point star
      gsap.to('.sparkle-star', {
        rotation: 15,
        scale: 1.08,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, mainRef);

    // Cleanup GSAP animations when component unmounts
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className="min-h-screen bg-[#050508] text-white font-sans selection:bg-purple-600 selection:text-white overflow-x-hidden"
    >
      {/* =========================================================
          TOP SECTION: NAVBAR & HERO (Left side of reference image)
      ========================================================= */}
      <header className="nav-bar max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
      
      {/* Left Group: Logo and Nav clustered together */}
      <div className="flex items-center gap-48">
        <div className="flex items-center justify-start -ml-28 cursor-pointer">
          <DevPilotLogo className="h-16 w-auto cursor-pointer" />
        </div>

        <nav className="hidden md:flex items-center gap-12 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </nav>
      </div>

      {/* Right CTA Button */}
      <button className="px-5 py-2 rounded-full text-xs font-medium bg-[#120d24] text-purple-200 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.45)] hover:shadow-[0_0_28px_rgba(168,85,247,0.75)] hover:border-purple-400 transition-all">
        Signup
      </button>

      </header>

      {/* HERO CONTENT */}
      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 text-center relative">
        {/* Small DEVPILOT Badge */}
        <div className="hero-item inline-block mb-5 px-3.5 py-1 rounded-md bg-purple-950/60 border border-purple-500/30 text-[11px] font-semibold tracking-widest uppercase text-purple-300">
          DEVPILOT
        </div>

        {/* Main Title */}
        <h1 className="hero-item text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.12] text-white max-w-3xl mx-auto">
          The Developer
          <br />
          Collaboration Engine
        </h1>

        {/* Subtitle */}
        <p className="hero-item mt-5 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Discover partners, create projects, manage tasks, and collaborate in real-time.
        </p>

        {/* Action Buttons */}
        <div className="hero-item mt-8 flex items-center justify-center gap-4">
          <button className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-[0_0_28px_rgba(168,85,247,0.75)] hover:brightness-110 transition-all">
            Launch App
          </button>
          <button className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-900/90 text-zinc-300 border border-zinc-700/80 hover:border-zinc-500 hover:text-white transition-all">
            How it Works
          </button>
        </div>

        {/* =========================================================
            BLANK HOME PAGE SCREEN FRAME (With Realistic Purple Glow)
        ========================================================= */}
        <div className="hero-blank-screen relative mt-16 max-w-4xl mx-auto">
          {/* Glowing Purple Backlight Aura */}
          <div className="hero-aura absolute -inset-6 bg-linear-to-t from-purple-600/35 via-purple-600/50 to-indigo-500/30 rounded-3xl blur-2xl opacity-70 pointer-events-none" />

          {/* Main Blank Dashboard Frame */}
          <div className="relative h-[340px] sm:h-105 w-full rounded-2xl bg-[#0c0a15] border border-purple-500/40 shadow-[0_0_50px_rgba(139,92,246,0.25)] overflow-hidden flex flex-col">
            {/* Minimal Top Window Bar */}
            <div className="h-10 px-4 border-b border-white/5 bg-[#120f1d] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
              <div className="w-48 h-4 rounded bg-white/5" />
              <div className="w-12 h-4 rounded bg-white/5" />
            </div>

            {/* Blank Screen Body (Ready for your screenshot or static view) */}
            <div className="flex-1 bg-gradient-to-b from-[#0e0b18] to-[#07060c] flex items-center justify-center">
              {/* Intentionally left blank as requested */}
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Divider Line */}
      <div className="max-w-5xl mx-auto h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      {/* =========================================================
          BOTTOM SECTION 1: CORE CAPABILITIES (Bento Grid)
      ========================================================= */}
      <section id="features" className="bento-section max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 tracking-tight">
          Core Capabilities
        </h2>

        {/* 12-Column Asymmetric Bento Grid matching the right screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* LEFT COLUMN (Spans 5 cols): Two Stacked Cards */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Card 1: Project Creation & Management */}
            <div className="bento-card flex-1 rounded-2xl bg-[#0b0914] border border-purple-500/40 p-5 shadow-[0_0_25px_rgba(139,92,246,0.1)] flex flex-col justify-between">
              <h3 className="text-base font-bold text-white leading-snug mb-4">
                Project Creation &<br />
                Management
              </h3>

              {/* Mini Mockup Box */}
              <div className="rounded-xl bg-[#12101e] border border-white/5 p-3.5 space-y-3">
                {/* Top Purple Progress Indicator */}
                <div className="w-20 h-2 rounded-full bg-purple-500/80 mb-2" />

                {/* 3 Task Rows */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <Circle className="w-3.5 h-3.5 text-zinc-500" />
                      <div className="space-y-1">
                        <div className="w-24 h-2 rounded bg-zinc-600/70" />
                        <div className="w-14 h-1.5 rounded bg-zinc-700/60" />
                      </div>
                    </div>
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Clean Card-style Highlights */}
            <div className="bento-card flex-1 rounded-2xl bg-[#0b0914] border border-purple-500/40 p-5 shadow-[0_0_25px_rgba(139,92,246,0.1)] flex flex-col justify-between">
              <h3 className="text-base font-bold text-white leading-snug mb-4">
                Clean Card-style
                <br />
                Highlights
              </h3>

              {/* Mini Mockup Box */}
              <div className="rounded-xl bg-[#12101e] border border-white/5 p-4 space-y-3.5">
                <div className="flex items-center gap-3">
                  <AtSign className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="w-28 h-2 rounded bg-zinc-600/80" />
                </div>
                <div className="flex items-center gap-3">
                  <Type className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="w-36 h-2 rounded bg-zinc-600/80" />
                </div>
                <div className="flex items-center gap-3">
                  <LayoutGrid className="w-4 h-4 text-zinc-400 shrink-0" />
                  <div className="w-32 h-2 rounded bg-zinc-600/80" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Spans 7 cols): Encrypted Partner Chat + Developer Discovery */}
          <div className="md:col-span-7 flex flex-col gap-5">
            {/* Top Card: Encrypted Partner Chat */}
            <div className="bento-card rounded-2xl bg-[#0b0914] border border-purple-500/40 p-5 shadow-[0_0_25px_rgba(139,92,246,0.1)]">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white">Encrypted Partner Chat</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed">
                  End-to-end encrypted chats with Whatsapp, text threads, and secure paddtocs.
                </p>
              </div>

              {/* Lower Split: Phone Chat UI on Left + Security Icons on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Mobile Chat Mockup (7 cols) */}
                <div className="sm:col-span-7 rounded-2xl bg-[#080b11] border border-zinc-800 p-3 shadow-inner">
                  {/* Phone Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-600/40 border border-emerald-400/50" />
                      <div>
                        <div className="text-[10px] font-semibold text-zinc-200">DevPilot AI</div>
                        <div className="text-[8px] text-emerald-400">Online</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    </div>
                  </div>

                  {/* Chat Bubbles */}
                  <div className="space-y-2 text-[10px]">
                    <div className="bg-zinc-800/90 text-zinc-300 rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[85%]">
                      Hey! Are we pushing the auth schema today?
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-emerald-700/80 text-white rounded-lg rounded-tr-none px-2.5 py-1.5 max-w-[85%]">
                        Yes, JWT + refresh tokens are ready 👍
                      </div>
                    </div>

                    <div className="bg-zinc-800/90 text-zinc-300 rounded-lg rounded-tl-none px-2.5 py-1.5 max-w-[80%]">
                      Awesome, merging the PR now!
                    </div>

                    {/* Input Bar */}
                    <div className="pt-2 flex items-center gap-1.5">
                      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-2.5 py-1 flex items-center justify-between text-zinc-500">
                        <span className="text-[9px]">Message...</span>
                        <div className="flex items-center gap-1">
                          <Smile className="w-3 h-3" />
                          <Paperclip className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                        <Send className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: 3 Icons (Users, Glowing Lock, Shield) */}
                <div className="sm:col-span-5 flex items-center justify-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <Users className="w-4 h-4" />
                  </div>

                  {/* Floating Glowing Lock */}
                  <div className="floating-lock w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/60 shadow-[0_0_25px_rgba(168,85,247,0.65)] flex items-center justify-center text-purple-200">
                    <Lock className="w-5 h-5" />
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Right Card: Developer Discovery */}
            <div className="bento-card rounded-2xl bg-[#0b0914] border border-purple-500/40 p-5 shadow-[0_0_25px_rgba(139,92,246,0.1)]">
              <h3 className="text-base font-bold text-white mb-3.5">Developer Discovery</h3>

              <div className="space-y-2.5">
                {DEVELOPERS.map((dev) => (
                  <div
                    key={dev.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#12101e] border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full bg-gradient-to-tr ${dev.avatarColor} shrink-0`}
                      />
                      <div>
                        <div className="text-xs font-medium text-zinc-200">{dev.name}</div>
                        <div className={`h-1.5 ${dev.roleWidth} rounded bg-zinc-700 mt-1`} />
                      </div>
                    </div>

                    <button className="px-3 py-1 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-purple-500 hover:text-white transition-colors">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOTTOM SECTION 2: HOW IT WORKS
      ========================================================= */}
      <section id="how-it-works" className="steps-section max-w-4xl mx-auto px-6 pb-28 pt-4 relative">
        {/* Heading + Decorative 4-Point Star */}
        <div className="relative flex items-center justify-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center tracking-tight">
            How It Works
          </h2>
        </div>

        {/* 3 Step Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {WORK_STEPS.map((step) => (
            <div key={step.number} className="step-card text-left">
              <div className="text-sm sm:text-base font-bold mb-1.5">
                <span className="text-purple-400">{step.number} / </span>
                <span className="text-white">{step.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;