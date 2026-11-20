import React, { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';

export type LogoStylePreset = 'prism-violet' | 'nebula-aurora' | 'classic-fold';

interface DevPilotLogoProps {
  size?: number;
  showText?: boolean;
  layout?: 'horizontal' | 'stacked';
  stylePreset?: LogoStylePreset;
  /** Seconds between automatic skywriter cycles (default: 10, set 0 to disable) */
  autoPlayInterval?: number;
  className?: string;
}

const PRESETS: Record<
  LogoStylePreset,
  {
    main: [string, string, string];
    mid: [string, string, string];
    bracket: [string, string, string];
    foldStart: string;
    foldEnd: string;
    glowColor: string;
    streakColor: string;
  }
> = {
  'prism-violet': {
    main: ['#E9D5FF', '#A855F7', '#7E22CE'],
    mid: ['#F3E8FF', '#C084FC', '#9333EA'],
    bracket: ['#D8B4FE', '#A855F7', '#6D28D9'],
    foldStart: '#3B0764',
    foldEnd: '#1E1B4B',
    glowColor: 'rgba(168, 85, 247, 0.8)',
    streakColor: '#F3E8FF',
  },
  'nebula-aurora': {
    main: ['#A5F3FC', '#A855F7', '#6366F1'],
    mid: ['#E0E7FF', '#C084FC', '#8B5CF6'],
    bracket: ['#F0ABFC', '#9333EA', '#4F46E5'],
    foldStart: '#312E81',
    foldEnd: '#1E1B4B',
    glowColor: 'rgba(139, 92, 246, 0.85)',
    streakColor: '#A5F3FC',
  },
  'classic-fold': {
    main: ['#D8B4FE', '#9333EA', '#6D28D9'],
    mid: ['#E9D5FF', '#B983FF', '#8B5CF6'],
    bracket: ['#C084FC', '#9333EA', '#6D28D9'],
    foldStart: '#4C1D95',
    foldEnd: '#3B0764',
    glowColor: 'rgba(147, 51, 234, 0.75)',
    streakColor: '#D8B4FE',
  },
};

const WING_D_PATH =
  'M 6 12 H 57 Q 61 12 64 15 L 89 40 Q 91 42 89 44 L 64 69 Q 61 72 57 72 H 27.2 Q 25.5 72 26.1 70.4 L 33.5 50 Q 29.8 48.5 27.6 44 H 47.5 L 42.3 59.5 H 56.5 L 74 42 L 56.5 24.5 H 20 C 13.5 24.5 9 20 6 12 Z';

const MIDDLE_WING_PATH =
  'M 18.5 28.5 H 52.7 L 48.8 40 H 28.5 C 24 40 20.5 35.5 18.5 28.5 Z';

const BRACKET_PATH =
  'M 87.5 13 L 114.5 40 Q 116.5 42 114.5 44 L 87.5 71 L 79.5 63 L 100.5 42 L 79.5 21 L 87.5 13 Z';

const DEV_CHARS = 'Dev'.split('');
const PILOT_CHARS = 'Pilot'.split('');

export const DevPilotLogo: React.FC<DevPilotLogoProps> = ({
  size = 32,
  showText = true,
  layout = 'horizontal',
  stylePreset = 'prism-violet',
  autoPlayInterval = 10,
  className = '',
}) => {
  const uid = useId();
  const colors = PRESETS[stylePreset];

  // Unique SVG definition IDs
  const mainId = `dp-main-${uid}`;
  const midId = `dp-mid-${uid}`;
  const bracketId = `dp-bracket-${uid}`;
  const foldId = `dp-fold-${uid}`;
  const rimId = `dp-rim-${uid}`;
  const sheenId = `dp-sheen-${uid}`;
  const lowerClipId = `dp-lower-clip-${uid}`;
  const wingClipId = `dp-wing-clip-${uid}`;
  const bracketClipId = `dp-bracket-clip-${uid}`;

  // DOM & GSAP Controller Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);
  const autoTlRef = useRef<gsap.core.Timeline | null>(null);
  const timerRef = useRef<gsap.core.Tween | null>(null);
  const isHoveredRef = useRef<boolean>(false);

  // Refs for ultra-smooth magnetic hover parallax (gsap.quickTo)
  const quickParallaxRef = useRef<{
    wingX: gsap.QuickToFunc;
    wingY: gsap.QuickToFunc;
    midX: gsap.QuickToFunc;
    midY: gsap.QuickToFunc;
    bracketX: gsap.QuickToFunc;
    bracketY: gsap.QuickToFunc;
  } | null>(null);

  // =========================================================================
  // 1. SETUP HOVER TIMELINE, MAGNETIC PARALLAX, AND 10-SEC SKYWRITER LOOP
  // =========================================================================
  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(containerRef);

      // --- A. Magnetic Parallax Controllers ---
      quickParallaxRef.current = {
        wingX: gsap.quickTo(q('.parallax-wing'), 'x', { duration: 0.35, ease: 'power3.out' }),
        wingY: gsap.quickTo(q('.parallax-wing'), 'y', { duration: 0.35, ease: 'power3.out' }),
        midX: gsap.quickTo(q('.parallax-mid'), 'x', { duration: 0.3, ease: 'power3.out' }),
        midY: gsap.quickTo(q('.parallax-mid'), 'y', { duration: 0.3, ease: 'power3.out' }),
        bracketX: gsap.quickTo(q('.parallax-bracket'), 'x', { duration: 0.28, ease: 'power3.out' }),
        bracketY: gsap.quickTo(q('.parallax-bracket'), 'y', { duration: 0.28, ease: 'power3.out' }),
      };

      // --- B. Reversible Hover Launch Timeline ---
      const hoverTl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
      });

      hoverTl
        .to(
          q('.logo-wing-main'),
          {
            x: 2.5,
            scale: 1.04,
            transformOrigin: 'center center',
            duration: 0.35,
          },
          0
        )
        .to(
          q('.logo-wing-mid'),
          {
            x: 5,
            duration: 0.38,
            ease: 'back.out(2.6)',
          },
          0.03
        )
        .to(
          q('.logo-bracket-group'),
          {
            x: 8.5,
            scale: 1.06,
            transformOrigin: 'center center',
            duration: 0.42,
            ease: 'back.out(2.4)',
          },
          0.04
        )
        .to(
          q('.logo-svg-root'),
          {
            filter: `drop-shadow(0 0 20px ${colors.glowColor}) brightness(1.15)`,
            duration: 0.32,
          },
          0
        );

      hoverTlRef.current = hoverTl;

      // --- C. Periodic Skywriter Erase & Rewrite Scheduler ---
      const scheduleNextCycle = () => {
        if (autoPlayInterval <= 0) return;
        timerRef.current?.kill();
        timerRef.current = gsap.delayedCall(autoPlayInterval, runSkywriterCycle);
      };

      const runSkywriterCycle = () => {
        if (isHoveredRef.current || !containerRef.current) {
          scheduleNextCycle();
          return;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            scheduleNextCycle();
          },
        });

        if (showText && layout === 'horizontal' && wordmarkRef.current) {
          const wordWidth = wordmarkRef.current.offsetWidth || 78;
          const sweepDistance = wordWidth + 18;

          tl
            // 1. ANTICIPATION: Pull back + bank angle + charge neon aura
            .to(q('.logo-svg-root'), {
              x: -7,
              rotation: -6,
              scale: 0.96,
              transformOrigin: '50% 50%',
              filter: `drop-shadow(0 0 22px ${colors.glowColor}) brightness(1.22)`,
              duration: 0.22,
              ease: 'power2.in',
            })
            .to(
              q('.logo-bracket-group'),
              { x: -3, duration: 0.2, ease: 'power2.in' },
              '<'
            )
            // 2. IGNITION: Speed streaks
            .fromTo(
              q('.logo-speed-streak'),
              { strokeDashoffset: 22, opacity: 1 },
              {
                strokeDashoffset: -22,
                opacity: 0,
                duration: 0.42,
                stagger: 0.06,
                ease: 'power2.out',
              }
            )
            .to(
              q('.logo-bracket-group'),
              { x: 5, duration: 0.25, ease: 'back.out(2)' },
              '<'
            )
            // 3. PASS 1 (LEFT -> RIGHT): Wing rockets across "DevPilot"
            .to(
              q('.logo-svg-root'),
              {
                x: sweepDistance,
                rotation: 4,
                scale: 1.05,
                duration: 0.52,
                ease: 'power2.inOut',
              },
              '<'
            )
            // 4. VAPORIZE TEXT: Letters get sliced upward & dissolved left-to-right
            .to(
              q('.dp-char'),
              {
                opacity: 0,
                y: -7,
                skewX: -18,
                scale: 0.4,
                color: '#E9D5FF',
                filter: 'blur(5px)',
                duration: 0.16,
                stagger: { each: 0.042, from: 'start' },
                ease: 'power2.in',
              },
              '-=0.45'
            )
            // 5. RIGHT-EDGE SONIC TURN: Ghost burst + sparks + 180° flip
            .fromTo(
              q('.logo-bracket-ghost'),
              { x: 2, opacity: 0.85, scale: 1 },
              {
                x: 20,
                opacity: 0,
                scale: 1.18,
                transformOrigin: '50% 50%',
                duration: 0.34,
                ease: 'power3.out',
              },
              '-=0.12'
            )
            .fromTo(
              q('.logo-spark-dot'),
              { x: 0, y: 0, opacity: 1, scale: 1 },
              {
                x: (i: number) => 12 + i * 7,
                y: (i: number) => (i === 0 ? -12 : i === 1 ? 11 : 0),
                opacity: 0,
                scale: 0.2,
                duration: 0.35,
                ease: 'power2.out',
              },
              '<'
            )
            .to(
              q('.logo-svg-root'),
              {
                scaleX: -1,
                rotation: -3,
                duration: 0.2,
                ease: 'power3.inOut',
              },
              '-=0.22'
            )
            // 6. PASS 2 (RIGHT -> LEFT): Reversed Wing flies home
            .to(q('.logo-svg-root'), {
              x: 0,
              rotation: 0,
              scaleY: 1,
              duration: 0.54,
              ease: 'power2.inOut',
            })
            // 7. MATERIALIZE TEXT: Letters pop out behind the wing from right-to-left
            .fromTo(
              q('.dp-char'),
              {
                opacity: 0,
                y: 8,
                skewX: 14,
                scale: 0.55,
                color: '#D8B4FE',
                textShadow: `0 0 14px ${colors.glowColor}`,
                filter: 'blur(4px)',
              },
              {
                opacity: 1,
                y: 0,
                skewX: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.24,
                stagger: { each: 0.044, from: 'end' },
                ease: 'back.out(2.2)',
              },
              '-=0.46'
            )
            // 8. DOCK LANDING: Snap back forward (scaleX: 1) + Bracket settle
            .to(q('.logo-svg-root'), {
              scaleX: 1,
              scale: 1,
              duration: 0.28,
              ease: 'back.out(2)',
            })
            .to(
              q('.logo-bracket-group'),
              { x: 0, duration: 0.26, ease: 'power2.out' },
              '<'
            )
            // 9. FINISHING SHIMMER: Left-to-right glow settle + Diagonal Glass Prism Sweep
            .to(
              q('.dp-char-dev'),
              {
                color: '#FFFFFF',
                textShadow: '0 0 0px transparent',
                duration: 0.25,
                stagger: 0.03,
                clearProps: 'color,textShadow,filter,transform',
              },
              '-=0.18'
            )
            .to(
              q('.dp-char-pilot'),
              {
                color: '#E9D5FF',
                textShadow: '0 0 0px transparent',
                duration: 0.25,
                stagger: 0.03,
                clearProps: 'color,textShadow,filter,transform',
              },
              '-=0.2'
            )
            .fromTo(
              q('.logo-prism-sheen'),
              { x: -75, opacity: 0.95 },
              {
                x: 165,
                opacity: 0.95,
                duration: 0.58,
                ease: 'power2.inOut',
              },
              '-=0.3'
            )
            .to(
              q('.logo-svg-root'),
              {
                filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))',
                duration: 0.35,
              },
              '-=0.2'
            );
        } else {
          // Compact icon-only or stacked fallback
          tl.to(q('.logo-bracket-group'), {
            x: 9,
            duration: 0.32,
            ease: 'back.out(2.4)',
          })
            .fromTo(
              q('.logo-prism-sheen'),
              { x: -75, opacity: 0.95 },
              { x: 165, opacity: 0.95, duration: 0.6, ease: 'power2.inOut' },
              '<'
            )
            .to(q('.logo-bracket-group'), {
              x: 0,
              duration: 0.35,
              ease: 'power2.out',
            });
        }

        autoTlRef.current = tl;
      };

      scheduleNextCycle();
    }, containerRef);

    return () => {
      timerRef.current?.kill();
      autoTlRef.current?.kill();
      ctx.revert();
    };
  }, [autoPlayInterval, colors.glowColor, layout, showText]);

  // =========================================================================
  // 2. INTERACTIVE HOVER & MAGNETIC 3D PARALLAX HANDLERS
  // =========================================================================
  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!containerRef.current) return;

    const q = gsap.utils.selector(containerRef);

    // Safely interrupt any mid-flight 10-second skywriter animation and restore clean state
    if (autoTlRef.current?.isActive()) {
      autoTlRef.current.kill();
      gsap.to(q('.logo-svg-root'), {
        x: 0,
        scaleX: 1,
        scaleY: 1,
        scale: 1,
        rotation: 0,
        duration: 0.24,
        ease: 'power2.out',
        overwrite: 'auto',
      });
      gsap.to(q('.dp-char'), {
        opacity: 1,
        y: 0,
        skewX: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.2,
        clearProps: 'color,textShadow,filter,transform',
        overwrite: true,
      });
    }

    // Play kinetic hover posture
    hoverTlRef.current?.timeScale(1).play();

    // Diagonal Glass Prism Light Sweep
    gsap.fromTo(
      q('.logo-prism-sheen'),
      { x: -75, opacity: 0.95 },
      { x: 165, opacity: 0.95, duration: 0.62, ease: 'power2.inOut', overwrite: true }
    );

    // Sonic Echo Ghost Chevron
    gsap.fromTo(
      q('.logo-bracket-ghost'),
      { x: 2, opacity: 0.7, scale: 1 },
      {
        x: 20,
        opacity: 0,
        scale: 1.15,
        transformOrigin: '50% 50%',
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      }
    );

    // Speed Streaks + Spark Dots
    gsap.fromTo(
      q('.logo-speed-streak'),
      { strokeDashoffset: 22, opacity: 1 },
      {
        strokeDashoffset: -22,
        opacity: 0,
        duration: 0.42,
        stagger: 0.08,
        ease: 'power2.out',
        overwrite: true,
      }
    );

    gsap.fromTo(
      q('.logo-spark-dot'),
      { x: 0, y: 0, opacity: 1, scale: 1 },
      {
        x: (i: number) => 10 + i * 6,
        y: (i: number) => (i === 0 ? -9 : i === 1 ? 9 : 0),
        opacity: 0,
        scale: 0.2,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true,
      }
    );

    // Kinetic Ripple Wave across "DevPilot" letters
    if (showText) {
      gsap.fromTo(
        q('.dp-char'),
        { y: 0 },
        {
          y: -3.5,
          duration: 0.16,
          stagger: 0.028,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
  };

  // Real-time layered 3D magnetic parallax as mouse glides over logo
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !quickParallaxRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    quickParallaxRef.current.wingX(relX * 2.5);
    quickParallaxRef.current.wingY(relY * 2.5);
    quickParallaxRef.current.midX(relX * 4.5);
    quickParallaxRef.current.midY(relY * 3.5);
    quickParallaxRef.current.bracketX(relX * 6.5);
    quickParallaxRef.current.bracketY(relY * 4.5);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    hoverTlRef.current?.timeScale(1.25).reverse();

    if (quickParallaxRef.current) {
      quickParallaxRef.current.wingX(0);
      quickParallaxRef.current.wingY(0);
      quickParallaxRef.current.midX(0);
      quickParallaxRef.current.midY(0);
      quickParallaxRef.current.bracketX(0);
      quickParallaxRef.current.bracketY(0);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center select-none cursor-pointer overflow-visible ${
        layout === 'stacked' ? 'flex-col gap-2' : 'flex-row gap-2.5'
      } ${className}`}
    >
      {/* Code Wing SVG */}
      <svg
        height={size}
        viewBox="0 0 124 84"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))' }}
        className="logo-svg-root relative z-20 w-auto shrink-0 overflow-visible"
        aria-label="DevPilot Logo"
      >
        <defs>
          <linearGradient id={mainId} x1="6" y1="12" x2="92" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.main[0]} />
            <stop offset="48%" stopColor={colors.main[1]} />
            <stop offset="100%" stopColor={colors.main[2]} />
          </linearGradient>

          <linearGradient id={midId} x1="18" y1="28.5" x2="53" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.mid[0]} />
            <stop offset="50%" stopColor={colors.mid[1]} />
            <stop offset="100%" stopColor={colors.mid[2]} />
          </linearGradient>

          <linearGradient id={bracketId} x1="80" y1="13" x2="116" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.bracket[0]} />
            <stop offset="50%" stopColor={colors.bracket[1]} />
            <stop offset="100%" stopColor={colors.bracket[2]} />
          </linearGradient>

          <linearGradient id={foldId} x1="30" y1="42" x2="112" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={colors.foldStart} stopOpacity="0.46" />
            <stop offset="100%" stopColor={colors.foldEnd} stopOpacity="0.38" />
          </linearGradient>

          <linearGradient id={rimId} x1="6" y1="12" x2="112" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#E9D5FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={sheenId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="55%" stopColor="#E9D5FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          <clipPath id={lowerClipId}>
            <rect x="0" y="42" width="124" height="42" />
          </clipPath>

          <clipPath id={wingClipId}>
            <path d={WING_D_PATH} />
            <path d={MIDDLE_WING_PATH} />
          </clipPath>

          <clipPath id={bracketClipId}>
            <path d={BRACKET_PATH} />
          </clipPath>
        </defs>

        {/* Speed Streaks */}
        <g>
          <path
            d="M -14 18 H 6"
            stroke={colors.streakColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="22"
            strokeDashoffset="22"
            opacity="0"
            className="logo-speed-streak"
          />
          <path
            d="M -6 34 H 14"
            stroke={colors.streakColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="22"
            strokeDashoffset="22"
            opacity="0"
            className="logo-speed-streak"
          />
        </g>

        {/* Outer Parallax Wrapper -> Inner Hover Wrapper */}
        <g className="parallax-wing">
          <g className="logo-wing-main">
            <path d={WING_D_PATH} fill={`url(#${mainId})`} />

            <g className="parallax-mid">
              <g className="logo-wing-mid">
                <path d={MIDDLE_WING_PATH} fill={`url(#${midId})`} />
                <path
                  d="M 19.5 29.1 H 52"
                  stroke={`url(#${rimId})`}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
              </g>
            </g>

            <g clipPath={`url(#${lowerClipId})`}>
              <path d={WING_D_PATH} fill={`url(#${foldId})`} />
            </g>

            <path
              d="M 7.5 12.6 H 57 Q 60.8 12.6 63.6 15.4 L 88.6 40.4"
              stroke={`url(#${rimId})`}
              strokeWidth="1.25"
              strokeLinecap="round"
            />

            <g clipPath={`url(#${wingClipId})`}>
              <rect
                x="0"
                y="-20"
                width="38"
                height="130"
                transform="skewX(-22)"
                fill={`url(#${sheenId})`}
                opacity="0"
                className="logo-prism-sheen"
              />
            </g>
          </g>
        </g>

        {/* Sonic Echo Ghost Chevron & Micro Spark Particles */}
        <path
          d={BRACKET_PATH}
          fill={`url(#${bracketId})`}
          opacity="0"
          className="logo-bracket-ghost pointer-events-none"
        />
        <g className="pointer-events-none">
          <circle cx="110" cy="30" r="2.2" fill={colors.streakColor} opacity="0" className="logo-spark-dot" />
          <circle cx="110" cy="54" r="2.2" fill={colors.streakColor} opacity="0" className="logo-spark-dot" />
          <circle cx="116" cy="42" r="2.6" fill="#FFFFFF" opacity="0" className="logo-spark-dot" />
        </g>

        {/* Right Code Bracket (>) */}
        <g className="parallax-bracket">
          <g className="logo-bracket-group">
            <path d={BRACKET_PATH} fill={`url(#${bracketId})`} />

            <g clipPath={`url(#${lowerClipId})`}>
              <path d={BRACKET_PATH} fill={`url(#${foldId})`} />
            </g>

            <path
              d="M 87.5 13.8 L 114 40.3"
              stroke={`url(#${rimId})`}
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            <g clipPath={`url(#${bracketClipId})`}>
              <rect
                x="0"
                y="-20"
                width="38"
                height="130"
                transform="skewX(-22)"
                fill={`url(#${sheenId})`}
                opacity="0"
                className="logo-prism-sheen"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Split-Letter Wordmark */}
      {showText && (
        <span
          ref={wordmarkRef}
          className={`relative z-10 inline-flex items-baseline font-extrabold tracking-tight ${
            layout === 'stacked' ? 'text-xl' : 'text-lg'
          }`}
        >
          {/* "Dev" */}
          <span className="inline-flex text-white">
            {DEV_CHARS.map((char, idx) => (
              <span
                key={`dev-${idx}`}
                className="dp-char dp-char-dev inline-block"
              >
                {char}
              </span>
            ))}
          </span>

          {/* "Pilot" */}
          <span className="inline-flex text-purple-200">
            {PILOT_CHARS.map((char, idx) => (
              <span
                key={`pilot-${idx}`}
                className="dp-char dp-char-pilot inline-block"
              >
                {char}
              </span>
            ))}
          </span>
        </span>
      )}
    </div>
  );
};

export default DevPilotLogo;