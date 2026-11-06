import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ruler, Grid, Compass, Plus, ArrowUpRight, Sparkles } from 'lucide-react';
import { Product } from '../../types/product';
import { ProfileCrossSectionSVG } from './ProfileCrossSectionSVG';
import { useInquiry } from '../../context/InquiryContext';

interface ProfileAtlasProps {
  products: Product[];
  isPreview?: boolean;
}

const VIEW_FILTERS = [
  { id: 'ALL', label: 'All Profiles' },
  { id: 'TV', label: 'Top View (TV)' },
  { id: 'SV', label: 'Side View (SV)' },
  { id: '360', label: '360° Round' },
  { id: '3D', label: '3D Bend' },
  { id: 'Dome', label: 'Dome' },
  { id: 'Dual', label: 'Dual-Side' },
  { id: 'Embedded', label: 'Embedded' },
  { id: 'Anti-Glare', label: 'Anti-Glare UGR<19' },
  { id: 'IP68', label: 'IP68 Submersible' },
];

export const ProfileAtlas: React.FC<ProfileAtlasProps> = ({ products, isPreview = false }) => {
  const navigate = useNavigate();
  const { addItem } = useInquiry();

  const [maxWidthMm, setMaxWidthMm] = useState<number>(50);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'scatter'>('grid');
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);

  // Filter to Neon Flex & Wall Grazer profiles that have architectural cross-sections
  const neonProfiles = useMemo(() => {
    const list = products
      .filter((p) => p.familySlug === 'neon-flex' || p.familySlug === 'wall-grazer')
      .sort((a, b) => a.size.w * a.size.h - b.size.w * b.size.h);
    return isPreview ? list.slice(0, 24) : list;
  }, [products, isPreview]);

  const matchesCategory = (p: Product) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'IP68') return p.ip.includes('IP68') || p.series.includes('IP68');
    return p.view === activeFilter;
  };

  const matchingCount = neonProfiles.filter(
    (p) => matchesCategory(p) && p.size.w <= maxWidthMm
  ).length;

  return (
    <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              1:1 Architectural Profile Atlas
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[66ch]">
              Every silicone neon cross-section is rendered to physical scale (<span className="font-mono text-[var(--text-primary)]">1mm = 4.2px</span>) with its true emitting surface glowing in real time. Drag the millimeter caliper ruler below to filter profiles by mounting groove width.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Layout Mode Switcher */}
            <div className="inline-flex border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-[#111111] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>1:1 Scale Wall</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('scatter')}
                className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
                  layoutMode === 'scatter'
                    ? 'bg-[#111111] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>W×H Scatter Plane</span>
              </button>
            </div>

            {isPreview && (
              <Link
                to="/products/neon-flex/atlas"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold"
              >
                <span>Explore Full 50+ Profile Atlas</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Interactive Millimeter Caliper Ruler & View Chips */}
        <div className="p-5 sm:p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-5">
          {/* Draggable Ruler */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Ruler className="w-4 h-4 text-[var(--text-primary)]" />
                <span>GROOVE WIDTH CALIPER FILTER:</span>
                <span
                  className="px-2 py-0.5 font-bold rounded-sm bg-[var(--bg-primary)] border border-[var(--border-hairline)]"
                  style={{ color: 'var(--glow)' }}
                >
                  WIDTH ≤ {maxWidthMm} mm
                </span>
              </div>
              <div className="text-[var(--text-secondary)]">
                Showing <span className="text-[var(--text-primary)] font-semibold">{matchingCount}</span> of {neonProfiles.length} profiles
                {maxWidthMm < 50 && (
                  <button
                    type="button"
                    onClick={() => setMaxWidthMm(50)}
                    className="ml-3 text-[#111111] hover:underline"
                  >
                    Reset (50mm)
                  </button>
                )}
              </div>
            </div>

            <div className="relative pt-1">
              <input
                type="range"
                min={3}
                max={50}
                step={1}
                value={maxWidthMm}
                onChange={(e) => setMaxWidthMm(Number(e.target.value))}
                aria-label="Maximum profile width in millimeters"
                className="w-full h-2 rounded-sm appearance-none cursor-pointer bg-[var(--bg-surface)] accent-[#111111]"
              />
              {/* Millimeter Tick Marks */}
              <div className="flex justify-between font-mono text-[10px] text-[var(--text-muted)] pt-1.5 select-none">
                {[3, 6, 8, 10, 12, 16, 20, 25, 30, 40, 50].map((tick) => (
                  <button
                    key={tick}
                    type="button"
                    onClick={() => setMaxWidthMm(tick)}
                    className={`hover:text-[var(--text-primary)] ${
                      maxWidthMm === tick ? 'text-[var(--text-primary)] font-bold' : ''
                    }`}
                  >
                    {tick}mm
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Emitting Surface Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-hairline)]">
            {VIEW_FILTERS.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 font-mono text-xs border transition-all ${
                    active
                      ? 'border-[#111111] bg-[#111111]/15 text-[var(--text-primary)] font-semibold'
                      : 'border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-white/25'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mode 1: 1:1 Scale Architectural Matrix Wall */}
        {layoutMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {neonProfiles.map((p) => {
              const isMatch = matchesCategory(p) && p.size.w <= maxWidthMm;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className={`group relative cursor-pointer p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between items-center transition-all duration-300 ${
                    isMatch
                      ? 'opacity-100 hover:border-[var(--text-primary)] hover:-translate-y-0.5 glow-border-hover'
                      : 'opacity-20 grayscale pointer-events-none'
                  }`}
                >
                  {/* Top Meta Row */}
                  <div className="w-full flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
                    <span className="px-1.5 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-secondary)]">
                      {p.view}
                    </span>
                    <span>R≥{p.minBendRadius}mm</span>
                  </div>

                  {/* True-Scale Cross-Section SVG */}
                  <div className="my-3 flex items-center justify-center min-h-[110px] group-hover:scale-110 transition-transform duration-300">
                    <ProfileCrossSectionSVG
                      w={p.size.w}
                      h={p.size.h}
                      view={p.view}
                      scale={4.0}
                      dimmed={!isMatch}
                    />
                  </div>

                  {/* Bottom Spec Info */}
                  <div className="w-full pt-2.5 border-t border-[var(--border-hairline)] flex items-end justify-between gap-1">
                    <div className="min-w-0">
                      <div className="font-display font-medium text-xs text-[var(--text-primary)] truncate group-hover:text-[var(--text-primary)]">
                        {p.model}
                      </div>
                      <div className="font-mono text-[10px] text-[var(--text-muted)] truncate">
                        {p.wattOptions.join('/')}W/m · {p.ip}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(p);
                      }}
                      title="Add to RFQ Inquiry"
                      className="p-1.5 bg-[var(--bg-primary)] hover:bg-[#111111] hover:text-white border border-[var(--border-hairline)] text-[var(--text-secondary)] transition-colors shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Mode 2: 2D Coordinate Scatter Plane (X = Width mm, Y = Height mm) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 relative h-[540px] bg-[#07080B] border border-[var(--border-hairline)] p-8 overflow-hidden">
              {/* Coordinate Grid Lines */}
              <div className="absolute inset-8 border-l border-b border-white/15 pointer-events-none">
                {[10, 20, 30, 40, 50].map((wTick) => (
                  <div
                    key={wTick}
                    style={{ left: `${(wTick / 54) * 100}%` }}
                    className="absolute top-0 bottom-0 border-l border-dashed border-white/5"
                  >
                    <span className="absolute -bottom-6 -translate-x-1/2 font-mono text-[10px] text-[#5E6573]">
                      {wTick}mm W
                    </span>
                  </div>
                ))}
                {[10, 20, 30, 40].map((hTick) => (
                  <div
                    key={hTick}
                    style={{ bottom: `${(hTick / 44) * 100}%` }}
                    className="absolute left-0 right-0 border-b border-dashed border-white/5"
                  >
                    <span className="absolute -left-7 translate-y-1/2 font-mono text-[10px] text-[#5E6573]">
                      {hTick}
                    </span>
                  </div>
                ))}

                {/* Active Caliper Cut-off Line */}
                <div
                  style={{ left: `${Math.min(98, (maxWidthMm / 54) * 100)}%` }}
                  className="absolute top-0 bottom-0 border-l border-[#111111] transition-all duration-200"
                >
                  <span className="px-1.5 py-0.5 bg-[#111111] text-white font-mono text-[9px] whitespace-nowrap">
                    ≤ {maxWidthMm}mm
                  </span>
                </div>
              </div>

              {/* Plotted Cross-Sections */}
              <div className="relative w-full h-full">
                {neonProfiles.map((p, idx) => {
                  const isMatch = matchesCategory(p) && p.size.w <= maxWidthMm;
                  // Slight deterministic offset for profiles sharing identical WxH
                  const jitterX = ((idx % 3) - 1) * 1.6;
                  const jitterY = ((Math.floor(idx / 3) % 3) - 1) * 1.6;
                  const leftPct = Math.min(94, Math.max(4, (p.size.w / 54) * 100 + jitterX));
                  const bottomPct = Math.min(92, Math.max(6, (p.size.h / 44) * 100 + jitterY));

                  return (
                    <button
                      key={p.id}
                      type="button"
                      onMouseEnter={() => setHoveredProduct(p)}
                      onFocus={() => setHoveredProduct(p)}
                      onClick={() => navigate(`/product/${p.id}`)}
                      style={{ left: `${leftPct}%`, bottom: `${bottomPct}%` }}
                      className={`absolute -translate-x-1/2 translate-y-1/2 p-1 rounded transition-all duration-200 ${
                        isMatch
                          ? 'opacity-100 hover:scale-150 hover:z-30'
                          : 'opacity-15 pointer-events-none'
                      }`}
                    >
                      <ProfileCrossSectionSVG
                        w={p.size.w}
                        h={p.size.h}
                        view={p.view}
                        scale={2.2}
                        showDimensions={false}
                        dimmed={!isMatch}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Inspector Panel for Hovered Scatter Profile */}
            <div className="lg:col-span-4 p-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] min-h-[540px] flex flex-col justify-between">
              {hoveredProduct ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
                    <div>
                      <div className="font-display font-medium text-xl text-[var(--text-primary)]">
                        {hoveredProduct.model}
                      </div>
                      <div className="font-mono text-xs text-[#111111]">
                        {hoveredProduct.itemNo}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 font-mono text-xs bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                      {hoveredProduct.view}
                    </span>
                  </div>

                  <div className="py-4 flex justify-center bg-[#07080B] border border-[var(--border-hairline)]">
                    <ProfileCrossSectionSVG
                      w={hoveredProduct.size.w}
                      h={hoveredProduct.size.h}
                      view={hoveredProduct.view}
                      scale={5.0}
                    />
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {hoveredProduct.pitch}
                  </p>

                  <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                    <div className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">CROSS-SECTION</span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {hoveredProduct.size.w} × {hoveredProduct.size.h} mm
                      </span>
                    </div>
                    <div className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">MIN. BEND RADIUS</span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        R {hoveredProduct.minBendRadius}mm (Ø{hoveredProduct.minBendDiameter}mm)
                      </span>
                    </div>
                    <div className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">POWER OPTIONS</span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {hoveredProduct.wattOptions.join(' / ')} W/m
                      </span>
                    </div>
                    <div className="p-2.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">PROTECTION</span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {hoveredProduct.ip} · {hoveredProduct.warranty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      to={`/product/${hoveredProduct.id}`}
                      className="flex-1 py-2.5 px-4 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold text-center"
                    >
                      Open Full Spec →
                    </Link>
                    <button
                      type="button"
                      onClick={() => addItem(hoveredProduct)}
                      className="py-2.5 px-4 border border-[var(--border-hairline)] hover:border-[var(--text-primary)] font-mono text-xs font-semibold"
                    >
                      + Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <div className="my-auto text-center space-y-3 py-12">
                  <Sparkles className="w-8 h-8 text-[var(--text-primary)] mx-auto" />
                  <div className="font-display font-medium text-base text-[var(--text-primary)]">
                    Hover Any Coordinate Profile
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                    Move your cursor across the Width × Height scatter plane to inspect 1:1 cross-section geometry, minimum bending radius, and wattage options.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
