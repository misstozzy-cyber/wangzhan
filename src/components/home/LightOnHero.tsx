import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sliders, Layers, Power } from 'lucide-react';
import { useGlow } from '../../context/GlowContext';
import { KELVIN_PRESETS } from '../../utils/kelvinToRGB';

const TECHNICAL_MATRIX_CODES = [
  'TY-NT1617V24P10-Cx  16×17MM  TV  R≥100MM  RA90  SDCM≤3',
  'TY-NS1220V24P12-Cx  12×20MM  SV  R≥60MM   IP68  DOW-ET7021',
  'TY-NR40V24P18-CCx   Ø40MM   360° 1600K-12000K   FULL-SPECTRUM',
  'TY-NT1617V24P10-HWUGR  UGR<19  HONEYCOMB  ANTI-GLARE  LOUVER',
  'TY-WL2621ProV24P24  26×21MM  15°/30°/20×55°  WALL-GRAZER',
  'TY-ST28Q160V24W10-HE  170LM/W  CRI90  1-BIN  2OZ-COPPER',
  'TY-STCOBQ896V24W12-RGBW  WS2814  ADDRESSABLE  DOT-FREE  COB',
  'TY-ST28Q128V48W10-CC  DC48V  60M-SINGLE-FEED  ZERO-DROP',
  'TY-N3D1615V24P12-Cx  16×15MM  3D-DUAL-AXIS  BEND-LAB-VERIFIED',
  'TY-NT1615EV24P10-Cx  RECESSED-WING  FLUSH-MOUNT  CABINET-GROOVE',
  'TY-PUNT1615V24IP68  POLYURETHANE+SILICONE  POOL-CHLORINE-PROOF',
  'TY-ST28Q800V24P92-UCS2904  490×245MM  BACKLIT-MARBLE-SHEET',
];

interface CountUpStatProps {
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  monoSub: string;
  noComma?: boolean;
}

const CountUpStat: React.FC<CountUpStatProps> = ({
  end,
  suffix = '',
  prefix = '',
  label,
  monoSub,
  noComma = false,
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const stepTime = 24;
    const steps = duration / stepTime;
    const inc = end / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="py-5 px-6 flex flex-col justify-between">
      <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F3F5F8] tabular-nums tracking-tight">
        {prefix}
        {noComma ? val : val.toLocaleString()}
        <span style={{ color: 'var(--glow)' }}>{suffix}</span>
      </div>
      <div className="mt-1.5">
        <div className="text-xs font-medium text-[#F3F5F8]">{label}</div>
        <div className="font-mono text-[10px] text-[#949BA8] mt-0.5">{monoSub}</div>
      </div>
    </div>
  );
};

export const LightOnHero: React.FC = () => {
  const { kelvin, setKelvin, color, isPowerOn, setIsPowerOn } = useGlow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 680, y: 320 });
  const [ignited, setIgnited] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIgnited(true), 1750);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between bg-[#07080B] text-[#F3F5F8] border-b border-[var(--border-hairline)] overflow-hidden select-none"
    >
      {/* Flashlight Technical Part-Number Watermark Layer */}
      <div
        className="pointer-events-none absolute inset-0 font-mono text-[11px] leading-7 tracking-widest overflow-hidden transition-opacity duration-500"
        style={{
          opacity: isPowerOn ? 1 : 0.25,
          WebkitMaskImage: `radial-gradient(380px circle at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.03) 100%)`,
          maskImage: `radial-gradient(380px circle at ${cursor.x}px ${cursor.y}px, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.03) 100%)`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-4 p-8 opacity-20">
          {Array.from({ length: 36 }).map((_, idx) => (
            <div key={idx} className="truncate text-[#949BA8]">
              {TECHNICAL_MATRIX_CODES[idx % TECHNICAL_MATRIX_CODES.length]}
            </div>
          ))}
        </div>
      </div>

      {/* Ambient Bloom when Ignited */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isPowerOn && ignited ? 0.24 : 0.03,
          background: `radial-gradient(680px circle at 68% 44%, rgba(${color.rgbString}, 0.35), transparent 72%)`,
        }}
      />

      {/* Main Hero 12-Col Grid */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-8 pt-12 pb-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        {/* Left Column: Architectural Typography & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <h1 className="font-display font-bold text-4xl sm:text-6xl xl:text-[4.25rem] leading-[1.04] tracking-[-0.035em] text-[#F3F5F8] max-w-[15ch]">
            Light, Engineered to Bend.
          </h1>

          <p className="text-base sm:text-lg text-[#949BA8] max-w-[58ch] leading-relaxed font-normal">
            Silicone LED neon flex, high-efficacy LED strips, dot-free COB, and flexible wall grazers — co-extruded in Dow SILASTIC™ optical silicone with goniophotometer{' '}
            <span className="font-mono text-[#F3F5F8]">.IES / .LDT</span> files for every model.
          </p>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              to="/products/neon-flex"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-display font-semibold text-sm tracking-tight transition-all"
            >
              <span>Explore Neon Flex</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/spec-finder"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-sm bg-[#0D0F14] hover:bg-[#13161F] text-[#F3F5F8] border border-white/15 font-mono text-xs font-medium transition-all glow-border-hover"
            >
              <Sliders className="w-4 h-4 text-[var(--glow)]" />
              <span>Find by Spec (110+ Models)</span>
            </Link>

            <Link
              to="/products/neon-flex/atlas"
              className="inline-flex items-center gap-2 px-4 py-3.5 text-xs font-mono text-[#949BA8] hover:text-[#F3F5F8] transition-colors"
            >
              <Layers className="w-4 h-4 text-[#1E6FD9]" />
              <span>1:1 Profile Atlas →</span>
            </Link>
          </div>

          {/* Interactive Kelvin Swatch Strip */}
          <div className="pt-4 border-t border-white/10 max-w-xl space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#949BA8]">
                INTERACTIVE KELVIN ENGINE · R40 FULL-CCT 1600K–12000K
              </span>
              <span style={{ color: isPowerOn ? color.hex : '#5E6573' }}>
                {isPowerOn ? `${kelvin}K (${color.label})` : 'CIRCUIT OFF'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {KELVIN_PRESETS.map((p) => {
                const active = isPowerOn && Math.abs(kelvin - p.kelvin) < 150;
                return (
                  <button
                    key={p.kelvin}
                    type="button"
                    onClick={() => {
                      setIsPowerOn(true);
                      setKelvin(p.kelvin);
                    }}
                    className={`px-2.5 py-1 rounded-sm font-mono text-[11px] border transition-all ${
                      active
                        ? 'border-white bg-white/10 text-white font-semibold'
                        : 'border-white/10 bg-[#0D0F14] text-[#949BA8] hover:border-white/30'
                    }`}
                  >
                    {p.short}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIsPowerOn(!isPowerOn)}
                className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-sm font-mono text-[11px] border transition-all ${
                  isPowerOn
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-white/15 bg-white/5 text-[#949BA8]'
                }`}
                title="Physical Circuit Breaker Toggle"
              >
                <Power className="w-3 h-3" />
                {isPowerOn ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Continuous SVG Neon Tube Drawing & Architectural Contour (5 cols) */}
        <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
          <div className="w-full bg-[#0D0F14]/90 border border-white/10 p-6 sm:p-8 relative overflow-hidden">
            {/* Top Engineering HUD Bar */}
            <div className="flex items-center justify-between font-mono text-[11px] text-[#949BA8] pb-4 mb-4 border-b border-white/10">
              <span>PROFILE: TY-NT1617V24P10-Cx</span>
              <span>MIN. BEND Ø200MM · IP67/IP68</span>
            </div>

            {/* Animated Continuous Neon Path */}
            <svg
              viewBox="0 0 520 340"
              className="w-full h-auto overflow-visible"
              aria-label="Animated TYRIA Silicone LED Neon Flex sculpture"
            >
              {/* Faint Structural Blueprint Grid */}
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                <line x1="0" y1="60" x2="520" y2="60" />
                <line x1="0" y1="140" x2="520" y2="140" />
                <line x1="0" y1="220" x2="520" y2="220" />
                <line x1="0" y1="300" x2="520" y2="300" />
                <line x1="100" y1="0" x2="100" y2="340" />
                <line x1="260" y1="0" x2="260" y2="340" />
                <line x1="420" y1="0" x2="420" y2="340" />
              </g>

              {/* Unlit Silicone Jacket Base Path */}
              <path
                d="M 30 270 L 95 270 Q 130 270 130 230 L 130 95 Q 130 55 170 55 L 235 55 Q 275 55 275 95 L 275 215 Q 275 255 315 255 L 365 255 Q 405 255 405 205 L 405 110 Q 405 60 455 60 L 495 60"
                fill="none"
                stroke="#1E2430"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Glowing Neon Core (Draws in 2s, then flickers & blooms) */}
              {isPowerOn && (
                <motion.path
                  d="M 30 270 L 95 270 Q 130 270 130 230 L 130 95 Q 130 55 170 55 L 235 55 Q 275 55 275 95 L 275 215 Q 275 255 315 255 L 365 255 Q 405 255 405 205 L 405 110 Q 405 60 455 60 L 495 60"
                  fill="none"
                  stroke="var(--glow)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.3 }}
                  animate={{
                    pathLength: 1,
                    opacity: [0.3, 1, 0.45, 1, 0.85, 1],
                  }}
                  transition={{
                    pathLength: { duration: 1.9, ease: 'easeInOut' },
                    opacity: { duration: 2.3, times: [0, 0.7, 0.76, 0.82, 0.88, 1] },
                  }}
                  style={{
                    filter: `drop-shadow(0 0 8px var(--glow)) drop-shadow(0 0 24px rgba(${color.rgbString}, 0.75))`,
                  }}
                />
              )}

              {/* TYRIA Continuous Neon Wordmark Accent */}
              {isPowerOn && (
                <motion.text
                  x="260"
                  y="318"
                  textAnchor="middle"
                  className="font-display font-bold text-[22px] tracking-[0.38em]"
                  fill="var(--glow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  style={{
                    filter: `drop-shadow(0 0 10px var(--glow))`,
                  }}
                >
                  TYRIA NEON FLEX
                </motion.text>
              )}

              {/* Bending Radius Callout Annotations */}
              <g className="font-mono text-[10px]" fill="#949BA8">
                <circle
                  cx="170"
                  cy="95"
                  r="38"
                  fill="none"
                  stroke="#1E6FD9"
                  strokeDasharray="3 3"
                />
                <text x="170" y="98" textAnchor="middle" fill="#1E6FD9">
                  R=100mm
                </text>
                <text x="35" y="42">
                  DOW SILASTIC™ ET-7021 CO-EXTRUSION
                </text>
              </g>
            </svg>

            {/* Bottom Spec Telemetry Row */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-[#5E6573] block">LUMINOUS EFFICACY</span>
                <span className="text-[#F3F5F8]">Up to 180 lm/W</span>
              </div>
              <div>
                <span className="text-[#5E6573] block">COLOR CONSISTENCY</span>
                <span className="text-[#F3F5F8]">1-Bin · SDCM ≤ 3</span>
              </div>
              <div>
                <span className="text-[#5E6573] block">ANTI-GLARE OPTION</span>
                <span className="text-[#F3F5F8]">UGR &lt; 19 Louver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Count-Up Telemetry Bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#0D0F14]/90">
        <div className="max-w-[1440px] mx-auto lg:pr-44 grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <CountUpStat
            end={2012}
            noComma={true}
            label="Founded in Shenzhen"
            monoSub="11,000 m² · Two Factories (F1 & F2)"
          />
          <CountUpStat
            end={2000}
            suffix="+"
            label="Custom Engineered Models"
            monoSub="50+ Silicone Neon Cross-Sections"
          />
          <CountUpStat
            end={259}
            label="IES & LDT Photometric Sets"
            monoSub="In-House Goniophotometer Darkroom"
          />
          <CountUpStat
            end={50}
            suffix="+"
            label="Export Countries Worldwide"
            monoSub="ETL · TUV-CE · UKCA · RCM · RoHS"
          />
          <CountUpStat
            end={5}
            suffix=" Years"
            label="Architectural Warranty"
            monoSub="LM-80 > 50,000 hrs Lifespan"
          />
        </div>
      </div>
    </section>
  );
};
