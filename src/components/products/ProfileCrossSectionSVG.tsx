import React from 'react';

interface ProfileCrossSectionSVGProps {
  w: number;
  h: number;
  view: string;
  scale?: number;
  showDimensions?: boolean;
  className?: string;
  dimmed?: boolean;
}

/**
 * Renders a 1:1 true-scale architectural cross-section SVG for any TYRIA profile.
 * Emitting surfaces dynamically glow with CSS variable --glow (1600K - 12000K).
 */
export const ProfileCrossSectionSVG: React.FC<ProfileCrossSectionSVGProps> = ({
  w,
  h,
  view,
  scale = 4.2,
  showDimensions = true,
  className = '',
  dimmed = false,
}) => {
  // Normalize ultra-wide sheet dimensions so it fits in card previews while keeping label accuracy
  const isSheet = view === 'Sheet';
  const isStrip = view === 'Strip' || view === 'COB';

  const drawW = isSheet ? 52 : Math.max(18, Math.min(200, w * scale));
  const drawH = isSheet ? 10 : isStrip ? Math.max(8, h * scale * 1.8) : Math.max(18, Math.min(140, h * scale));

  const pad = showDimensions ? 24 : 12;
  const svgW = Math.max(84, drawW + pad * 2);
  const svgH = Math.max(76, drawH + pad * 2);

  const x0 = (svgW - drawW) / 2;
  const y0 = (svgH - drawH) / 2;
  const cx = svgW / 2;
  const cy = svgH / 2;

  const glowColor = 'var(--glow)';
  const glowFilter = dimmed
    ? 'none'
    : 'drop-shadow(0 0 4px var(--glow)) drop-shadow(0 0 10px rgba(var(--glow-rgb), 0.65))';

  return (
    <svg
      width={svgW}
      height={svgH}
      viewBox={`0 0 ${svgW} ${svgH}`}
      className={`select-none overflow-visible transition-opacity duration-300 ${
        dimmed ? 'opacity-20' : 'opacity-100'
      } ${className}`}
      aria-label={`${w}x${h}mm ${view} cross section`}
    >
      {/* Subtle technical crosshair */}
      <line
        x1={cx}
        y1={4}
        x2={cx}
        y2={svgH - 4}
        stroke="currentColor"
        strokeOpacity={0.07}
        strokeDasharray="2 2"
      />
      <line
        x1={4}
        y1={cy}
        x2={svgW - 4}
        y2={cy}
        stroke="currentColor"
        strokeOpacity={0.07}
        strokeDasharray="2 2"
      />

      {view === '360' ? (
        <g>
          {/* Outer 360° glowing silicone jacket */}
          <circle
            cx={cx}
            cy={cy}
            r={drawW / 2}
            fill="rgba(var(--glow-rgb), 0.16)"
            stroke={glowColor}
            strokeWidth={3.5}
            style={{ filter: glowFilter }}
          />
          {/* Inner optical core & dual PCB */}
          <circle
            cx={cx}
            cy={cy}
            r={drawW * 0.26}
            fill="#151922"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1}
          />
          <rect
            x={cx - drawW * 0.18}
            y={cy - 1.5}
            width={drawW * 0.36}
            height={3}
            rx={1}
            fill={glowColor}
          />
        </g>
      ) : view === 'Dome' ? (
        <g>
          {/* Base silicone body */}
          <path
            d={`M ${x0} ${y0 + drawH} L ${x0} ${y0 + drawH * 0.45} A ${drawW / 2} ${drawH * 0.45} 0 0 1 ${
              x0 + drawW
            } ${y0 + drawH * 0.45} L ${x0 + drawW} ${y0 + drawH} Z`}
            fill="#1B202B"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* Internal PCB */}
          <rect
            x={x0 + drawW * 0.2}
            y={y0 + drawH * 0.72}
            width={drawW * 0.6}
            height={2.5}
            fill="#949BA8"
          />
          {/* Glowing Dome Cap */}
          <path
            d={`M ${x0} ${y0 + drawH * 0.48} A ${drawW / 2} ${drawH * 0.48} 0 0 1 ${x0 + drawW} ${
              y0 + drawH * 0.48
            }`}
            fill="rgba(var(--glow-rgb), 0.22)"
            stroke={glowColor}
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
        </g>
      ) : view === 'Anti-Glare' ? (
        <g>
          {/* Deep U-channel body for UGR<19 */}
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            rx={2.5}
            fill="#141821"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.2}
          />
          {/* Recessed dark baffle walls */}
          <rect
            x={x0 + drawW * 0.16}
            y={y0}
            width={drawW * 0.68}
            height={drawH * 0.42}
            fill="#07080B"
          />
          {/* Deep recessed glowing optical surface */}
          <line
            x1={x0 + drawW * 0.18}
            y1={y0 + drawH * 0.42}
            x2={x0 + drawW * 0.82}
            y2={y0 + drawH * 0.42}
            stroke={glowColor}
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
          {/* Honeycomb micro-louver indicator lines */}
          <line
            x1={cx - drawW * 0.14}
            y1={y0 + 1}
            x2={cx - drawW * 0.14}
            y2={y0 + drawH * 0.38}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1}
          />
          <line
            x1={cx + drawW * 0.14}
            y1={y0 + 1}
            x2={cx + drawW * 0.14}
            y2={y0 + drawH * 0.38}
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1}
          />
        </g>
      ) : view === 'Embedded' ? (
        <g>
          {/* Main recessed body */}
          <rect
            x={x0 + drawW * 0.12}
            y={y0}
            width={drawW * 0.76}
            height={drawH}
            rx={2}
            fill="#1B202C"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* Flush mounting side wings */}
          <rect
            x={x0 - 3}
            y={y0 + 2}
            width={drawW + 6}
            height={4}
            rx={1}
            fill="#252C3B"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1}
          />
          {/* Top flush emitting surface */}
          <line
            x1={x0 + 1}
            y1={y0 + 1}
            x2={x0 + drawW - 1}
            y2={y0 + 1}
            stroke={glowColor}
            strokeWidth={3.8}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
        </g>
      ) : view === 'Dual' ? (
        <g>
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            rx={3}
            fill="#1B202C"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* Top & Bottom dual emitting surfaces */}
          <line
            x1={x0 + 2}
            y1={y0}
            x2={x0 + drawW - 2}
            y2={y0}
            stroke={glowColor}
            strokeWidth={3.6}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
          <line
            x1={x0 + 2}
            y1={y0 + drawH}
            x2={x0 + drawW - 2}
            y2={y0 + drawH}
            stroke={glowColor}
            strokeWidth={3.6}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
          <line
            x1={x0 + drawW * 0.22}
            y1={cy}
            x2={x0 + drawW * 0.78}
            y2={cy}
            stroke="#949BA8"
            strokeWidth={2}
          />
        </g>
      ) : view === 'SV' ? (
        <g>
          {/* Side-View body (taller than wide, emits on the side or narrow top with vertical PCB) */}
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            rx={2.5}
            fill="#1B202C"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* Vertical internal FPC */}
          <line
            x1={cx}
            y1={y0 + drawH * 0.22}
            x2={cx}
            y2={y0 + drawH * 0.85}
            stroke="#949BA8"
            strokeWidth={2}
          />
          {/* Optical diffusion chamber */}
          <rect
            x={x0 + 1.5}
            y={y0 + 1.5}
            width={drawW - 3}
            height={drawH * 0.32}
            rx={1.5}
            fill="rgba(var(--glow-rgb), 0.22)"
          />
          {/* Narrow Side-View emitting surface */}
          <line
            x1={x0 + 1.5}
            y1={y0}
            x2={x0 + drawW - 1.5}
            y2={y0}
            stroke={glowColor}
            strokeWidth={3.8}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
        </g>
      ) : view === '3D' ? (
        <g>
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            rx={3}
            fill="#1B202C"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* 3-sided / 3D bend emitting cap */}
          <path
            d={`M ${x0} ${y0 + drawH * 0.45} L ${x0} ${y0 + 2} Q ${x0} ${y0} ${x0 + 2} ${y0} L ${
              x0 + drawW - 2
            } ${y0} Q ${x0 + drawW} ${y0} ${x0 + drawW} ${y0 + 2} L ${x0 + drawW} ${y0 + drawH * 0.45}`}
            fill="rgba(var(--glow-rgb), 0.18)"
            stroke={glowColor}
            strokeWidth={3.5}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
        </g>
      ) : view === 'Grazer' ? (
        <g>
          {/* Wall Grazer body with optical lens dome */}
          <rect
            x={x0}
            y={y0 + drawH * 0.22}
            width={drawW}
            height={drawH * 0.78}
            rx={2.5}
            fill="#181D27"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1.2}
          />
          {/* Precision Optical Lens */}
          <path
            d={`M ${x0 + drawW * 0.2} ${y0 + drawH * 0.35} Q ${cx} ${y0 - drawH * 0.18} ${
              x0 + drawW * 0.8
            } ${y0 + drawH * 0.35} Z`}
            fill="rgba(var(--glow-rgb), 0.35)"
            stroke={glowColor}
            strokeWidth={2.8}
            style={{ filter: glowFilter }}
          />
          {/* Grazing beam rays */}
          <line
            x1={cx - 4}
            y1={y0}
            x2={cx - 10}
            y2={y0 - 9}
            stroke={glowColor}
            strokeWidth={1.2}
            strokeOpacity={0.7}
          />
          <line
            x1={cx + 4}
            y1={y0}
            x2={cx + 10}
            y2={y0 - 9}
            stroke={glowColor}
            strokeWidth={1.2}
            strokeOpacity={0.7}
          />
        </g>
      ) : isStrip || isSheet ? (
        <g>
          {/* Rolled copper FPC base */}
          <rect
            x={x0}
            y={cy + 1}
            width={drawW}
            height={3.5}
            rx={1}
            fill="#C88A4B"
          />
          {/* Continuous COB phosphor or SMD array */}
          <rect
            x={x0 + 2}
            y={cy - 3.5}
            width={drawW - 4}
            height={4.5}
            rx={2}
            fill={glowColor}
            style={{ filter: glowFilter }}
          />
        </g>
      ) : (
        /* Default Top-View (TV) or Corner */
        <g>
          <rect
            x={x0}
            y={y0}
            width={drawW}
            height={drawH}
            rx={2.5}
            fill="#1B202C"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth={1.2}
          />
          {/* Internal optical chamber */}
          <rect
            x={x0 + 2}
            y={y0 + 1.5}
            width={drawW - 4}
            height={drawH * 0.36}
            rx={1.5}
            fill="rgba(var(--glow-rgb), 0.20)"
          />
          {/* Horizontal FPC */}
          <line
            x1={x0 + drawW * 0.18}
            y1={y0 + drawH * 0.65}
            x2={x0 + drawW * 0.82}
            y2={y0 + drawH * 0.65}
            stroke="#949BA8"
            strokeWidth={2}
          />
          {/* Top-View wide emitting surface */}
          <line
            x1={x0 + 1.5}
            y1={y0}
            x2={x0 + drawW - 1.5}
            y2={y0}
            stroke={glowColor}
            strokeWidth={3.8}
            strokeLinecap="round"
            style={{ filter: glowFilter }}
          />
        </g>
      )}

      {/* Technical Dimension Annotations */}
      {showDimensions && (
        <g className="font-mono text-[9.5px] fill-[#949BA8]">
          <text x={cx} y={svgH - 4} textAnchor="middle">
            {w}×{h}mm
          </text>
        </g>
      )}
    </svg>
  );
};
