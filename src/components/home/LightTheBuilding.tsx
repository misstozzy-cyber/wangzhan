import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Plus, ArrowUpRight, Power, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { useGlow } from '../../context/GlowContext';
import { useInquiry } from '../../context/InquiryContext';

interface LightTheBuildingProps {
  products: Product[];
}

interface BuildingZone {
  id: string;
  name: string;
  zoneCode: string;
  x: number;
  y: number;
  challenge: string;
  solution: string;
  matchKeywords: string[];
  specs: string;
}

const BUILDING_ZONES: BuildingZone[] = [
  {
    id: 'facade',
    name: 'Curved Facade Wall Grazing',
    zoneCode: 'ZONE A · EXTERIOR FACADE',
    x: 24,
    y: 44,
    challenge: 'Textured stone & curved curtain walls require tight beam control without rigid linear brackets.',
    solution: 'Silicone Wall Grazer 2621 Pro & 1615 with 15° / 30° / 20×55° optical lenses conform directly to facade curves.',
    matchKeywords: ['2621', '1615 Flexible Wall Grazer'],
    specs: '24W/m · 15°/30°/20×55° · IP67 · DC24V CC',
  },
  {
    id: 'roofline',
    name: 'Roofline & Arch Contours',
    zoneCode: 'ZONE B · PARAPET OUTLINE',
    x: 52,
    y: 16,
    challenge: 'Continuous 30-meter outdoor parapet lines exposed to UV, wind load, and thermal expansion.',
    solution: 'Top-View 1617 TV & Side-View 1220 SV co-extruded in Dow SILASTIC™ ET-7021 silicone.',
    matchKeywords: ['1617 TV', '1220 SV'],
    specs: '10W–15W/m · SDCM ≤ 3 · IP67/IP68 · 30m Run',
  },
  {
    id: 'atrium',
    name: 'Atrium 360° Suspended Sculpture',
    zoneCode: 'ZONE C · HOTEL ATRIUM',
    x: 54,
    y: 52,
    challenge: '360-degree visibility from multi-floor balconies requires shadow-free radial illumination.',
    solution: '360° Round R25 & R40 Full-CCT (1600K–12000K) tubes suspended via pendant cables or rigid clear sleeves.',
    matchKeywords: ['360° R40', '360° R25', '360° R13'],
    specs: 'Ø25mm / Ø40mm · 360° Radial · 1600K–12000K',
  },
  {
    id: 'office',
    name: 'Executive Office Low-Glare Ceiling',
    zoneCode: 'ZONE D · WORKSPACE UGR<19',
    x: 78,
    y: 36,
    challenge: 'Open-plan offices demand continuous architectural lines with strict UGR < 19 visual comfort.',
    solution: 'Anti-Glare 1617 TV Honeycomb & Deep Recessed Louver Neon with 45° cut-off shielding.',
    matchKeywords: ['Anti-Glare', 'UGR'],
    specs: 'UGR < 19 · Ra ≥ 90 · 10W/m · Honeycomb Louver',
  },
  {
    id: 'cove',
    name: 'Hospitality Indirect Cove & Stone',
    zoneCode: 'ZONE E · INTERIOR COVE',
    x: 34,
    y: 72,
    challenge: 'Shallow architectural coves and polished marble reflect LED dots from conventional SMD strips.',
    solution: 'COB PLUS (480–896 LEDs/m) & 160–180 lm/W High-Efficiency Strips on 2oz rolled copper.',
    matchKeywords: ['COB', '160LM', 'Sheet'],
    specs: '180° Dot-Free · Up to 180 lm/W · Ra ≥ 90/98',
  },
  {
    id: 'signage',
    name: 'Dynamic Media Canopy & Pool Deck',
    zoneCode: 'ZONE F · PLAZA & POOL IP68',
    x: 74,
    y: 78,
    challenge: 'Interactive retail canopies and submerged water features require addressable pixels and IP68 sealing.',
    solution: 'Pixel Neon DMX512/SPI (UCS512/WS2818) & In-Ground IP68 S1617 Submersible Neon.',
    matchKeywords: ['Pixel', 'IP68', 'In-Ground'],
    specs: 'DMX512 / SPI Breakpoint · IP68 Submersible',
  },
];

export const LightTheBuilding: React.FC<LightTheBuildingProps> = ({ products }) => {
  const { color, kelvin } = useGlow();
  const { addItem } = useInquiry();

  const [activeZoneId, setActiveZoneId] = useState<string>('facade');
  const [litZones, setLitZones] = useState<Record<string, boolean>>({
    facade: true,
    roofline: true,
    atrium: true,
    office: true,
    cove: true,
    signage: true,
  });

  const activeZone =
    BUILDING_ZONES.find((z) => z.id === activeZoneId) || BUILDING_ZONES[0];

  const recommendedProducts = useMemo(() => {
    const matched = products.filter((p) =>
      activeZone.matchKeywords.some(
        (kw) =>
          p.model.toLowerCase().includes(kw.toLowerCase()) ||
          p.series.toLowerCase().includes(kw.toLowerCase()) ||
          p.itemNo.toLowerCase().includes(kw.toLowerCase())
      )
    );
    return matched.slice(0, 3);
  }, [products, activeZone]);

  const toggleAllZones = (state: boolean) => {
    setLitZones({
      facade: state,
      roofline: state,
      atrium: state,
      office: state,
      cove: state,
      signage: state,
    });
  };

  return (
    <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Light the Building — Architectural Simulation
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[65ch]">
              Click any hotspot on the mixed-use architectural complex to illuminate that zone at <span className="font-mono text-[var(--text-primary)]">{kelvin}K</span> and inspect the exact TYRIA models engineered for that environment.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => toggleAllZones(true)}
              className="px-3.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--text-primary)] text-[var(--text-primary)] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--text-primary)]" />
              <span>Illuminate All Zones</span>
            </button>
            <button
              type="button"
              onClick={() => toggleAllZones(false)}
              className="px-3.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-white/25 text-[var(--text-secondary)] flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Blackout Scene</span>
            </button>
          </div>
        </div>

        {/* Interactive 12-Col Architectural Complex & Spec Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Interactive Night Architecture Canvas (8 cols) */}
          <div className="lg:col-span-8 relative bg-[#07080B] border border-[var(--border-hairline)] p-4 sm:p-6 flex flex-col justify-between overflow-hidden min-h-[480px]">
            {/* Architectural SVG Night Complex */}
            <div className="relative w-full my-auto">
              <svg
                viewBox="0 0 860 480"
                className="w-full h-auto select-none"
                aria-label="Interactive Architectural Lighting Complex"
              >
                {/* Night Sky Grid & Ground Horizon */}
                <line x1="20" y1="420" x2="840" y2="420" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <line x1="60" y1="440" x2="800" y2="440" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                {/* Left Tower (Facade Grazing Zone A) */}
                <rect
                  x="90"
                  y="90"
                  width="220"
                  height="330"
                  fill="#0D1017"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />
                {/* Vertical Facade Fins */}
                {[115, 145, 175, 205, 235, 265, 290].map((vx) => (
                  <line
                    key={vx}
                    x1={vx}
                    y1={95}
                    x2={vx}
                    y2={418}
                    stroke={litZones.facade ? 'var(--glow)' : 'rgba(255,255,255,0.07)'}
                    strokeWidth={litZones.facade ? '2.5' : '1'}
                    strokeOpacity={litZones.facade ? 0.75 : 1}
                    style={
                      litZones.facade
                        ? { filter: `drop-shadow(0 0 8px var(--glow))` }
                        : undefined
                    }
                  />
                ))}

                {/* Center Atrium Podium (Roofline Zone B + Atrium Zone C + Cove Zone E) */}
                <path
                  d="M 310 420 L 310 130 Q 450 55 590 130 L 590 420 Z"
                  fill="#0F131C"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />

                {/* Zone B: Parapet & Arch Roofline Glow */}
                {litZones.roofline && (
                  <path
                    d="M 90 90 L 310 90 M 310 130 Q 450 55 590 130 L 770 130"
                    fill="none"
                    stroke="var(--glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{
                      filter: `drop-shadow(0 0 10px var(--glow)) drop-shadow(0 0 22px rgba(${color.rgbString}, 0.8))`,
                    }}
                  />
                )}

                {/* Zone C: Atrium 360° Suspended Light Rings */}
                <g>
                  <ellipse
                    cx="450"
                    cy="215"
                    rx="76"
                    ry="24"
                    fill="none"
                    stroke={litZones.atrium ? 'var(--glow)' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={litZones.atrium ? '4' : '1.5'}
                    style={
                      litZones.atrium
                        ? { filter: `drop-shadow(0 0 10px var(--glow))` }
                        : undefined
                    }
                  />
                  <ellipse
                    cx="450"
                    cy="255"
                    rx="55"
                    ry="17"
                    fill="none"
                    stroke={litZones.atrium ? 'var(--glow)' : 'rgba(255,255,255,0.15)'}
                    strokeWidth={litZones.atrium ? '3.5' : '1.5'}
                    style={
                      litZones.atrium
                        ? { filter: `drop-shadow(0 0 10px var(--glow))` }
                        : undefined
                    }
                  />
                </g>

                {/* Zone E: Hospitality Interior Cove Levels */}
                {[325, 365, 400].map((cy) => (
                  <line
                    key={cy}
                    x1="125"
                    y1={cy}
                    x2="555"
                    y2={cy}
                    stroke={litZones.cove ? 'var(--glow)' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={litZones.cove ? '4' : '1'}
                    style={
                      litZones.cove
                        ? { filter: `drop-shadow(0 0 9px var(--glow))` }
                        : undefined
                    }
                  />
                ))}

                {/* Right Wing (Office UGR<19 Zone D + Media Canopy & Pool Zone F) */}
                <rect
                  x="590"
                  y="130"
                  width="180"
                  height="290"
                  fill="#0D1017"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1.5"
                />

                {/* Zone D: Office Anti-Glare Linear Ceiling Grid */}
                {[165, 200, 235, 270].map((oy) => (
                  <line
                    key={oy}
                    x1="610"
                    y1={oy}
                    x2="750"
                    y2={oy}
                    stroke={litZones.office ? 'var(--glow)' : 'rgba(255,255,255,0.1)'}
                    strokeWidth={litZones.office ? '3' : '1'}
                    strokeDasharray="24 8"
                    style={
                      litZones.office
                        ? { filter: `drop-shadow(0 0 6px var(--glow))` }
                        : undefined
                    }
                  />
                ))}

                {/* Zone F: Plaza Media Canopy & Submerged Pool Contour */}
                <rect
                  x="605"
                  y="325"
                  width="150"
                  height="75"
                  rx="4"
                  fill={litZones.signage ? `rgba(${color.rgbString}, 0.12)` : '#0A0D13'}
                  stroke={litZones.signage ? 'var(--glow)' : 'rgba(255,255,255,0.15)'}
                  strokeWidth={litZones.signage ? '3.5' : '1.2'}
                  style={
                    litZones.signage
                      ? { filter: `drop-shadow(0 0 12px var(--glow))` }
                      : undefined
                  }
                />
                {litZones.signage && (
                  <path
                    d="M 560 432 L 810 432"
                    stroke="#38BDF8"
                    strokeWidth="4"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 10px #38BDF8)' }}
                  />
                )}
              </svg>

              {/* Interactive Hotspot Pins */}
              {BUILDING_ZONES.map((z, idx) => {
                const isSelected = activeZoneId === z.id;
                const isLit = litZones[z.id];
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => {
                      setActiveZoneId(z.id);
                      setLitZones((prev) => ({ ...prev, [z.id]: true }));
                    }}
                    style={{ left: `${z.x}%`, top: `${z.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[11px] border transition-all ${
                      isSelected
                        ? 'bg-[#111111] text-white border-white shadow-lg scale-110 z-20'
                        : isLit
                        ? 'bg-[#0D0F14]/90 text-[#F3F5F8] border-white/30 hover:border-[var(--text-primary)] z-10'
                        : 'bg-[#07080B]/80 text-[#949BA8] border-white/15'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: isLit ? 'var(--glow)' : '#5E6573',
                        boxShadow: isLit ? '0 0 6px var(--glow)' : 'none',
                      }}
                    />
                    <span>{String.fromCharCode(65 + idx)}</span>
                    <span className="hidden sm:inline">{z.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Quick Zone Selector Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {BUILDING_ZONES.map((z, i) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => {
                      setActiveZoneId(z.id);
                      setLitZones((prev) => ({ ...prev, [z.id]: true }));
                    }}
                    className={`px-2.5 py-1 font-mono text-[11px] border transition-colors ${
                      activeZoneId === z.id
                        ? 'border-[#111111] bg-[#111111]/20 text-white'
                        : 'border-white/10 text-[#949BA8] hover:text-white'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}: {z.name}
                  </button>
                ))}
              </div>
              <Link
                to="/applications"
                className="font-mono text-xs text-[#111111] hover:underline flex items-center gap-1"
              >
                <span>All 7 Application Guides</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Recommended Models & Zone Specification Card (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                <div>
                  <span className="font-mono text-[11px] text-[#111111] block">
                    {activeZone.zoneCode}
                  </span>
                  <h3 className="font-display font-medium text-xl text-[var(--text-primary)] mt-0.5">
                    {activeZone.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setLitZones((prev) => ({
                      ...prev,
                      [activeZone.id]: !prev[activeZone.id],
                    }))
                  }
                  className="px-2.5 py-1 font-mono text-[11px] border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {litZones[activeZone.id] ? 'Lit' : 'Muted'}
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] block mb-0.5">
                    ARCHITECTURAL CHALLENGE
                  </span>
                  <p className="text-[var(--text-secondary)]">{activeZone.challenge}</p>
                </div>
                <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                  <span className="font-mono text-[10px] text-[#111111] block mb-0.5">
                    TYRIA ENGINEERING SOLUTION
                  </span>
                  <p className="text-[var(--text-primary)]">{activeZone.solution}</p>
                  <div className="font-mono text-[11px] text-[var(--text-primary)] mt-1.5">
                    {activeZone.specs}
                  </div>
                </div>
              </div>

              {/* Matched Product Cards */}
              <div className="space-y-2.5 pt-1">
                <div className="font-mono text-[11px] text-[var(--text-muted)]">
                  RECOMMENDED MODELS FOR THIS ZONE
                </div>
                {recommendedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-[var(--bg-primary)] border border-[var(--border-hairline)] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <Link
                        to={`/product/${prod.id}`}
                        className="font-display font-medium text-xs text-[var(--text-primary)] hover:text-[var(--text-primary)] block truncate"
                      >
                        {prod.model}
                      </Link>
                      <div className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                        {prod.itemNo} · {prod.size.w}×{prod.size.h}mm · {prod.ip}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        to={`/product/${prod.id}`}
                        className="px-2 py-1 border border-[var(--border-hairline)] font-mono text-[10px] hover:border-white/30"
                      >
                        Spec
                      </Link>
                      <button
                        type="button"
                        onClick={() => addItem(prod)}
                        className="px-2.5 py-1 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-[10px] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> RFQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
