import React, { useId } from "react";

export interface DevPilotLogoProps extends React.SVGProps<SVGSVGElement> {
  /**
   * "horizontal" renders the full brand mark + DevPilot wordmark.
   * "icon" renders only the Nexus Loop symbol (ideal for mobile navbars or favicons).
   */
  variant?: "horizontal" | "icon";
  /**
   * Displays the subtitle underneath the "DevPilot" wordmark.
   */
  showTagline?: boolean;
  /**
   * Customizes the subtitle text when showTagline is enabled.
   */
  tagline?: string;
}

export const DevPilotLogo: React.FC<DevPilotLogoProps> = ({
  variant = "horizontal",
  showTagline = false,
  tagline = "Integrating Developer Platform",
  className = "h-10 w-auto",
  ...props
}) => {
  const rawId = useId().replace(/:/g, "");
  const ids = {
    mainArrowGrad: `dp-arrow-${rawId}`,
    arrowRightFacet: `dp-arrow-facet-${rawId}`,
    leftRibbonGrad: `dp-left-ribbon-${rawId}`,
    underRibbonGrad: `dp-under-ribbon-${rawId}`,
    rightBracketGrad: `dp-right-bracket-${rawId}`,
    bevelGrad: `dp-bevel-${rawId}`,
    edgeGlowGrad: `dp-edge-${rawId}`,
    textGrad: `dp-text-${rawId}`,
    neonFilter: `dp-neon-${rawId}`,
    overlapShadow: `dp-shadow-${rawId}`,
  };

  const isIconOnly = variant === "icon";
  const viewBox = isIconOnly ? "0 0 148 120" : "0 0 430 120";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      fill="none"
      role="img"
      aria-label="DevPilot Logo"
      className={className}
      {...props}
    >
      <defs>
        {/* Main Ascending Launch Shaft Gradient (Bright Neon Lavender -> Electric Violet) */}
        <linearGradient
          id={ids.mainArrowGrad}
          x1="44"
          y1="96"
          x2="132"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="35%" stopColor="#A855F7" />
          <stop offset="75%" stopColor="#D8B4FE" />
          <stop offset="100%" stopColor="#F3E8FF" />
        </linearGradient>

        {/* 3D Right Facet of the Delta Arrowhead */}
        <linearGradient
          id={ids.arrowRightFacet}
          x1="108"
          y1="14"
          x2="128"
          y2="52"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>

        {/* Left '<' Bracket Ribbon Gradient */}
        <linearGradient
          id={ids.leftRibbonGrad}
          x1="16"
          y1="40"
          x2="58"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        {/* Center Under-Passing Ribbon Gradient (Creates 3D Depth at Crossing) */}
        <linearGradient
          id={ids.underRibbonGrad}
          x1="44"
          y1="40"
          x2="102"
          y2="96"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#9333EA" />
          <stop offset="42%" stopColor="#4C1D95" />
          <stop offset="58%" stopColor="#3B0764" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        {/* Right '>' Bracket Ribbon Gradient */}
        <linearGradient
          id={ids.rightBracketGrad}
          x1="90"
          y1="94"
          x2="130"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="55%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>

        {/* Metallic 3D Inner Bevel Gradient */}
        <linearGradient
          id={ids.bevelGrad}
          x1="20"
          y1="36"
          x2="126"
          y2="98"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#581C87" />
          <stop offset="50%" stopColor="#3B0764" />
          <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>

        {/* Specular Highlight Stroke Gradient */}
        <linearGradient
          id={ids.edgeGlowGrad}
          x1="16"
          y1="12"
          x2="132"
          y2="98"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F5D0FE" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>

        {/* Wordmark Subtle Metallic White Gradient */}
        <linearGradient
          id={ids.textGrad}
          x1="160"
          y1="32"
          x2="160"
          y2="82"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Ambient Neon Violet Bloom Filter */}
        <filter
          id={ids.neonFilter}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="3.2" result="blur1" />
          <feComponentTransfer in="blur1" result="glow1">
            <feFuncA type="linear" slope="0.55" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Drop Shadow for Over-Passing Arrow Shaft */}
        <filter
          id={ids.overlapShadow}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3.5"
            floodColor="#090414"
            floodOpacity="0.85"
          />
        </filter>
      </defs>

      {/* ==================== 7A: THE NEXUS LOOP BRAND MARK ==================== */}
      <g filter={`url(#${ids.neonFilter})`}>
        {/* 1. OUTER FLANKING GIT CIRCUIT TRACES (Left '<' & Right '>' Halo Tracks) */}
        <g stroke="#C084FC" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {/* Left Outer Bracket Circuit */}
          <path d="M 33 43 L 12 64 L 12 68 L 28 84" opacity="0.85" />
          <circle cx="33" cy="43" r="2.8" fill="#0B0716" stroke="#F3E8FF" strokeWidth="1.8" />
          <circle cx="28" cy="84" r="2.4" fill="#E9D5FF" stroke="none" />

          {/* Right Outer Bracket Circuit */}
          <path d="M 114 48 L 132 64 L 132 68 L 113 87" opacity="0.85" />
          <circle cx="114" cy="48" r="2.8" fill="#0B0716" stroke="#F3E8FF" strokeWidth="1.8" />
          <circle cx="113" cy="87" r="2.4" fill="#E9D5FF" stroke="none" />
        </g>

        {/* 2. UNDER-PASSING DIAGONAL & RIGHT '>' LOOP (Goes underneath the main arrow) */}
        <g>
          {/* 3D Inner Bevel Rim for Under-Ribbon */}
          <path
            d="M 48 39 L 100 91 L 124 66 L 103 45 L 99 49 L 116 66 L 96 86 L 44 34 Z"
            fill={`url(#${ids.bevelGrad})`}
          />

          {/* Main Under-Passing Diagonal Ribbon (Top-Left Fold -> Bottom-Right Fold) */}
          <path
            d="M 41 42
               C 45 38, 52 38, 56 42
               L 99 85
               C 101 87, 103 87, 105 85
               L 95 95
               C 91 99, 85 99, 81 95
               L 41 55 Z"
            fill={`url(#${ids.underRibbonGrad})`}
            stroke={`url(#${ids.edgeGlowGrad})`}
            strokeWidth="1"
          />

          {/* Right '>' Bracket Ribbon (Bottom-Right Fold -> Right Apex -> Upper Tuck) */}
          <path
            d="M 81 95
               C 85 99, 91 99, 95 95
               L 122 68
               C 125 65, 125 62, 122 59
               L 106 43
               L 96 53
               L 109 64
               L 88 85
               C 86 87, 83 87, 81 85 Z"
            fill={`url(#${ids.rightBracketGrad})`}
            stroke={`url(#${ids.edgeGlowGrad})`}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />

          {/* Git Circuit Trace & Commit Nodes inside the Right '>' Loop */}
          <path
            d="M 60 56 L 88 84 L 116 64 L 103 51"
            stroke="#E9D5FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          <circle cx="88" cy="84" r="3" fill="#1E0B36" stroke="#F3E8FF" strokeWidth="1.8" />
          <circle cx="107" cy="71" r="2.6" fill="#1E0B36" stroke="#E9D5FF" strokeWidth="1.6" />
        </g>

        {/* 3. LEFT '<' BRACKET RIBBON (Top-Left Fold -> Left Apex -> Bottom-Left Fold) */}
        <g>
          {/* 3D Inner Bevel Rim for Left '<' Loop */}
          <path
            d="M 55 48 L 35 66 L 55 84 L 59 80 L 42 66 L 59 52 Z"
            fill={`url(#${ids.bevelGrad})`}
          />

          {/* Left '<' Main Metallic Ribbon Surface */}
          <path
            d="M 56 42
               C 52 38, 45 38, 41 42
               L 21 60
               C 18 63, 18 68, 21 71
               L 41 91
               C 45 95, 52 95, 56 91
               L 56 79
               C 52 82, 48 82, 45 79
               L 32 66
               L 45 53
               C 48 50, 52 50, 56 53 Z"
            fill={`url(#${ids.leftRibbonGrad})`}
            stroke={`url(#${ids.edgeGlowGrad})`}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Git Circuit Trace & Commit Nodes inside the Left '<' Loop */}
          <path
            d="M 49 46 L 26 66 L 47 86"
            stroke="#F3E8FF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <circle cx="36" cy="57" r="3" fill="#1E0B36" stroke="#F3E8FF" strokeWidth="1.8" />
          <circle cx="36" cy="75" r="2.8" fill="#1E0B36" stroke="#E9D5FF" strokeWidth="1.7" />
        </g>

        {/* 4. FOREGROUND ASCENDING LAUNCH SHAFT & 3D DELTA ARROWHEAD (Passes OVER center) */}
        <g filter={`url(#${ids.overlapShadow})`}>
          {/* 3D Lower-Right Bevel Edge of the Ascending Shaft */}
          <path
            d="M 48 95 L 114 29 L 119 34 L 55 98 C 52 99, 49 97, 48 95 Z"
            fill={`url(#${ids.bevelGrad})`}
          />

          {/* Main Ascending Ribbon Shaft (Bottom-Left Fold -> Arrowhead Base) */}
          <path
            d="M 41 91
               C 45 95, 52 97, 57 92
               L 115 34
               L 104 23
               L 45 82
               C 41 86, 40 89, 41 91 Z"
            fill={`url(#${ids.mainArrowGrad})`}
            stroke="#F5D0FE"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* 3D Faceted Delta Arrowhead — Left Bright Wing Facet */}
          <path
            d="M 134 10
               L 92 22
               L 106 27
               L 111 32
               Z"
            fill="#F3E8FF"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* 3D Faceted Delta Arrowhead — Right Shaded Wing Facet */}
          <path
            d="M 134 10
               L 111 32
               L 116 37
               L 122 52
               Z"
            fill={`url(#${ids.arrowRightFacet})`}
            stroke="#E9D5FF"
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Central Git Launch Pipeline & Commit Nodes on the Arrow Shaft */}
          <line
            x1="50"
            y1="88"
            x2="110"
            y2="28"
            stroke="#FFFFFF"
            strokeWidth="1.7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="65" cy="73" r="3.4" fill="#1E0B36" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="84" cy="54" r="3.4" fill="#1E0B36" stroke="#FFFFFF" strokeWidth="2" />
        </g>
      </g>

      {/* ==================== HORIZONTAL WORDMARK ("DevPilot") ==================== */}
      {!isIconOnly && (
        <g transform={showTagline ? "translate(152, 0)" : "translate(152, 10)"}>
          {/* Main "DevPilot" Brand Title */}
          <text
            x="0"
            y="68"
            fill={`url(#${ids.textGrad})`}
            fontFamily="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="54"
            fontWeight="800"
            letterSpacing="-1.5"
          >
            Dev
            <tspan fill="#F3E8FF">Pilot</tspan>
          </text>

          {/* Optional Subtitle ("Integrating Developer Platform") */}
          {showTagline && (
            <text
              x="2"
              y="95"
              fill="#A1A1AA"
              fontFamily="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
              fontSize="15.5"
              fontWeight="500"
              letterSpacing="0.4"
            >
              {tagline}
            </text>
          )}
        </g>
      )}
    </svg>
  );
};

export default DevPilotLogo;