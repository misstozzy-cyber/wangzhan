import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { useGlow } from '../../context/GlowContext';

export const GlareCompare: React.FC = () => {
  const { color } = useGlow();
  const [splitPct, setSplitPct] = useState<number>(52);

  // Compute simulated effective UGR based on slider position
  const simulatedUgr = (16.2 + ((100 - splitPct) / 100) * 8.6).toFixed(1);

  return (
    <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Copy & Live UGR Gauge (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Anti-Glare UGR &lt; 19 Optical Control
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Conventional flat-top silicone neon emits across a 120°–160° hemisphere, causing high direct glare in offices, classrooms, and hospitality lounges. TYRIA’s <span className="font-mono text-[var(--text-primary)]">Anti-Glare UGR&lt;19</span> series integrates a deep optical baffle channel or micro-honeycomb louver directly into the co-extruded silicone profile.
            </p>

            {/* Live UGR Telemetry Gauge */}
            <div className="p-5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <EyeOff className="w-4 h-4 text-[#111111]" />
                  UNIFIED GLARE RATING (UGR)
                </span>
                <span
                  className={`font-bold text-sm px-2 py-0.5 border ${
                    Number(simulatedUgr) < 19
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-700'
                  }`}
                >
                  UGR {simulatedUgr} {Number(simulatedUgr) < 19 ? '(EN 12464-1 Office Pass)' : '(High Direct Glare)'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs pt-1">
                <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                  <div className="text-[10px] text-[var(--text-muted)]">STANDARD NEON</div>
                  <div className="text-base font-bold text-amber-700 mt-0.5">UGR ~24.8</div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    120° Unshielded Surface
                  </div>
                </div>
                <div className="p-3 bg-[var(--bg-elevated)] border border-[#111111]/50">
                  <div className="text-[10px] text-[#111111]">TYRIA UGR&lt;19 SERIES</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">UGR &lt; 16.5–18.8</div>
                  <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                    45° Shielded Baffle / Louver
                  </div>
                </div>
              </div>

              <div className="font-mono text-[11px] text-[var(--text-muted)]">
                AVAILABLE MODELS: <span className="text-[var(--text-primary)]">1010 TV · 1617 TV · 1617 TV Honeycomb · 1617 SV · 2222 TV</span>
              </div>
            </div>

            <Link
              to="/products/neon-flex/anti-glare"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold"
            >
              <span>Explore All 5 Anti-Glare UGR&lt;19 Profiles</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Interactive Drag Comparison Viewport (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative h-[400px] bg-[#07080B] border border-[var(--border-hairline)] overflow-hidden select-none">
              {/* Layer 1 (Right / Full Base): TYRIA Anti-Glare UGR<19 Controlled Beam */}
              <div className="absolute inset-0 flex flex-col justify-between p-8 bg-[#07080B]">
                <div className="flex justify-end">
                  <span className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 font-mono text-xs font-semibold">
                    TYRIA ANTI-GLARE UGR &lt; 19 (HONEYCOMB / DEEP BAFFLE)
                  </span>
                </div>

                {/* Controlled Downward Cone Visualization */}
                <svg viewBox="0 0 600 260" className="w-full h-64">
                  {/* Ceiling Plane */}
                  <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  {/* Deep Baffle Housing */}
                  <rect x="275" y="30" width="50" height="36" fill="#181D27" stroke="#949BA8" strokeWidth="1.5" />
                  <rect x="285" y="46" width="30" height="20" fill="#07080B" />
                  {/* Recessed Light Source */}
                  <line
                    x1="286"
                    y1="46"
                    x2="314"
                    y2="46"
                    stroke="var(--glow)"
                    strokeWidth="4"
                  />
                  {/* Controlled 45-degree Cut-Off Beam Cone (Zero Eye-Level Glare) */}
                  <polygon
                    points="286,48 314,48 415,245 185,245"
                    fill={` rgba(${color.rgbString}, 0.22)`}
                  />
                  <line x1="286" y1="48" x2="185" y2="245" stroke="var(--glow)" strokeDasharray="4 4" strokeOpacity="0.6" />
                  <line x1="314" y1="48" x2="415" y2="245" stroke="var(--glow)" strokeDasharray="4 4" strokeOpacity="0.6" />

                  <text x="450" y="110" className="font-mono text-[11px] fill-emerald-400">
                    ✓ 45° Shielding Cut-Off
                  </text>
                  <text x="450" y="130" className="font-mono text-[11px] fill-[#949BA8]">
                    Zero direct eye glare at viewing angles
                  </text>
                </svg>

                <div className="text-right font-mono text-xs text-[#949BA8]">
                  MODEL: TY-NT1617V24P10-Cx-HWUGR · 16×17mm
                </div>
              </div>

              {/* Layer 2 (Left Clipped): Conventional Unshielded Neon (High Glare Halo) */}
              <div
                style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
                className="absolute inset-0 flex flex-col justify-between p-8 bg-[#0B0D13]"
              >
                <div>
                  <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-700 font-mono text-xs font-semibold">
                    STANDARD FLAT NEON (UGR ~24.8 UNSHIELDED)
                  </span>
                </div>

                {/* Uncontrolled 160-degree Glare Bloom */}
                <svg viewBox="0 0 600 260" className="w-full h-64">
                  <line x1="40" y1="30" x2="560" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <rect x="275" y="30" width="50" height="32" fill="#1E2430" stroke="#949BA8" strokeWidth="1.5" />
                  {/* Wide Harsh Glare Halo */}
                  <ellipse
                    cx="300"
                    cy="95"
                    rx="255"
                    ry="115"
                    fill={`rgba(${color.rgbString}, 0.34)`}
                    style={{ filter: 'blur(18px)' }}
                  />
                  <line
                    x1="276"
                    y1="62"
                    x2="324"
                    y2="62"
                    stroke="var(--glow)"
                    strokeWidth="7"
                    style={{ filter: 'drop-shadow(0 0 18px var(--glow))' }}
                  />
                  <text x="45" y="110" className="font-mono text-[11px] fill-amber-400">
                    ⚠ Harsh 140° Spill into Viewer Eyes
                  </text>
                  <text x="45" y="130" className="font-mono text-[11px] fill-[#949BA8]">
                    High veiling reflections on screens
                  </text>
                </svg>

                <div className="font-mono text-xs text-[#949BA8]">
                  CONVENTIONAL FLUSH DIFFUSER · 120°–160° BEAM
                </div>
              </div>

              {/* Vertical Divider Handle */}
              <div
                style={{ left: `${splitPct}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-[#111111] pointer-events-none"
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#111111] text-white flex items-center justify-center shadow-lg">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              {/* Invisible Full-Area Range Input for Smooth Dragging */}
              <input
                type="range"
                min={8}
                max={92}
                value={splitPct}
                onChange={(e) => setSplitPct(Number(e.target.value))}
                aria-label="Compare Standard Neon vs Anti-Glare UGR<19"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
