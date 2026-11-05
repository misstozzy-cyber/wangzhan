import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  FileText,
  Download,
  Plus,
  Layers,
  Image as ImageIcon,
  RotateCcw,
  ArrowLeftRight,
} from 'lucide-react';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileCrossSectionSVG } from '../components/products/ProfileCrossSectionSVG';
import { useInquiry } from '../context/InquiryContext';

interface ProductsPageProps {
  products: Product[];
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  const { family, series } = useParams<{ family?: string; series?: string }>();
  const { addItem, compareIds, toggleCompare } = useInquiry();

  const [selectedFamily, setSelectedFamily] = useState<string>(family || 'ALL');
  const [selectedSeries, setSelectedSeries] = useState<string>(series || 'ALL');
  const [selectedView, setSelectedView] = useState<string>('ALL');
  const [selectedIp, setSelectedIp] = useState<string>('ALL');
  const [selectedControl, setSelectedControl] = useState<string>('ALL');
  const [maxWidth, setMaxWidth] = useState<number>(60);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cardVisualMode, setCardVisualMode] = useState<'both' | 'section' | 'photo'>('both');

  useEffect(() => {
    setSelectedFamily(family || 'ALL');
    setSelectedSeries(series || 'ALL');
  }, [family, series]);

  const availableSeries = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => {
      if (selectedFamily === 'ALL' || p.familySlug === selectedFamily) {
        map.set(p.seriesSlug, p.series);
      }
    });
    return Array.from(map.entries());
  }, [products, selectedFamily]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedFamily !== 'ALL' && p.familySlug !== selectedFamily) return false;
      if (selectedSeries !== 'ALL' && p.seriesSlug !== selectedSeries) return false;
      if (selectedView !== 'ALL' && p.view !== selectedView) return false;
      if (selectedIp !== 'ALL' && !p.ip.includes(selectedIp)) return false;
      if (
        selectedControl !== 'ALL' &&
        !p.controls.some((c) => c.toLowerCase().includes(selectedControl.toLowerCase()))
      ) {
        return false;
      }
      if (maxWidth < 60 && p.size.w > maxWidth && p.view !== 'Sheet') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${p.model} ${p.itemNo} ${p.series} ${p.family} ${p.pitch}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    products,
    selectedFamily,
    selectedSeries,
    selectedView,
    selectedIp,
    selectedControl,
    maxWidth,
    searchQuery,
  ]);

  const resetFilters = () => {
    setSelectedFamily('ALL');
    setSelectedSeries('ALL');
    setSelectedView('ALL');
    setSelectedIp('ALL');
    setSelectedControl('ALL');
    setMaxWidth(60);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <SEOHead
        title={
          selectedSeries !== 'ALL'
            ? `${selectedSeries.toUpperCase()} — Architectural Linear Catalogue`
            : 'All LED Neon Flex, LED Strips & Wall Grazers'
        }
        description="Browse 115+ TYRIA Lighting silicone LED neon flex profiles, 160–180 lm/W LED strips, COB strips, and flexible wall grazers with true-scale cross-sections, datasheets, and IES files."
        canonicalPath={family ? `/products/${family}${series ? `/${series}` : ''}` : '/products'}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Top Page Title & Visual Mode Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hairline)]">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Architectural Product Catalogue
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-[66ch]">
              Filter by profile dimension, emitting geometry, IP rating, or control protocol. Every card renders a live 1:1 cross-section alongside direct Datasheet PDF and IES photometric downloads.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setCardVisualMode('both')}
                className={`px-3 py-1.5 ${
                  cardVisualMode === 'both'
                    ? 'bg-[#1E6FD9] text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                Photo + 1:1 Section
              </button>
              <button
                type="button"
                onClick={() => setCardVisualMode('section')}
                className={`px-3 py-1.5 flex items-center gap-1 ${
                  cardVisualMode === 'section'
                    ? 'bg-[#1E6FD9] text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> 1:1 Section
              </button>
              <button
                type="button"
                onClick={() => setCardVisualMode('photo')}
                className={`px-3 py-1.5 flex items-center gap-1 ${
                  cardVisualMode === 'photo'
                    ? 'bg-[#1E6FD9] text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Studio Photo
              </button>
            </div>

            <Link
              to="/products/neon-flex/atlas"
              className="px-3.5 py-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:border-[var(--glow)] font-mono text-xs text-[var(--text-primary)]"
            >
              Open 1:1 Profile Atlas →
            </Link>
          </div>
        </div>

        {/* 12-Col Layout: Sticky Filter Panel (3 cols) + Product Cards Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Filter Panel */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                SPECIFICATION FILTERS ({filteredProducts.length})
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-[#1E6FD9] hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model (e.g. 1617, R40, COB)..."
                className="w-full pl-9 pr-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
              />
            </div>

            {/* Product Family */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1.5">
                PRODUCT FAMILY
              </label>
              <div className="space-y-1 font-mono text-xs">
                {[
                  { slug: 'ALL', label: 'All Product Families' },
                  { slug: 'neon-flex', label: 'LED Neon Flex' },
                  { slug: 'led-strip', label: 'Architectural LED Strip' },
                  { slug: 'wall-grazer', label: 'Flexible Wall Grazer' },
                  { slug: 'led-sheet', label: 'Flex LED Backlit Sheet' },
                ].map((f) => (
                  <button
                    key={f.slug}
                    type="button"
                    onClick={() => {
                      setSelectedFamily(f.slug);
                      setSelectedSeries('ALL');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 border transition-colors ${
                      selectedFamily === f.slug
                        ? 'border-[#1E6FD9] bg-[#1E6FD9]/15 text-[var(--text-primary)] font-semibold'
                        : 'border-transparent hover:bg-[var(--bg-surface)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Series */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1.5">
                SERIES ({availableSeries.length})
              </label>
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="w-full px-2.5 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
              >
                <option value="ALL">All Series</option>
                {availableSeries.map(([slug, label]) => (
                  <option key={slug} value={slug}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Emitting View */}
            <div>
              <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1.5">
                EMITTING ORIENTATION
              </label>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                {['ALL', 'TV', 'SV', '360', '3D', 'Dome', 'Dual', 'Embedded', 'Anti-Glare', 'COB'].map(
                  (v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedView(v)}
                      className={`px-2 py-1 border text-center ${
                        selectedView === v
                          ? 'border-[#1E6FD9] bg-[#1E6FD9]/15 text-[var(--text-primary)] font-semibold'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {v}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Max Width Slider */}
            <div>
              <div className="flex justify-between font-mono text-[11px] mb-1">
                <span className="text-[var(--text-muted)]">MAX WIDTH</span>
                <span className="text-[var(--glow)]">
                  {maxWidth >= 60 ? 'Any Width' : `≤ ${maxWidth} mm`}
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={60}
                step={2}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full accent-[#1E6FD9]"
              />
            </div>

            {/* Control Protocol & IP */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1">
                  IP RATING
                </label>
                <select
                  value={selectedIp}
                  onChange={(e) => setSelectedIp(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
                >
                  <option value="ALL">All IP</option>
                  <option value="IP68">IP68</option>
                  <option value="IP67">IP67</option>
                  <option value="IP65">IP65</option>
                  <option value="IP20">IP20</option>
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-[var(--text-muted)] mb-1">
                  CONTROL
                </label>
                <select
                  value={selectedControl}
                  onChange={(e) => setSelectedControl(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
                >
                  <option value="ALL">All Controls</option>
                  <option value="Single">Single Color</option>
                  <option value="Tunable">Tunable CCT</option>
                  <option value="RGB">RGB / RGBW</option>
                  <option value="DMX">DMX512</option>
                  <option value="SPI">SPI Pixel</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Right Product Grid (9 cols) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-center space-y-3">
                <div className="font-display font-bold text-lg text-[var(--text-primary)]">
                  No Profiles Match Current Filter Combination
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Reset filters or contact our engineering team for custom silicone extrusion tooling.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#1E6FD9] text-white font-mono text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const isCompared = compareIds.includes(p.id);
                  const hasIes = p.downloads.ies && p.downloads.ies.length > 0;
                  return (
                    <div
                      key={p.id}
                      className="bg-[#07080B] border border-[var(--border-hairline)] glow-border-hover flex flex-col justify-between transition-all duration-300 group"
                    >
                      {/* Top Header Row */}
                      <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-[#1E6FD9] block truncate">
                            {p.series.toUpperCase()}
                          </span>
                          <Link
                            to={`/product/${p.id}`}
                            className="font-display font-bold text-base text-[#F3F5F8] group-hover:text-[var(--glow)] transition-colors block truncate"
                          >
                            {p.model}
                          </Link>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.id)}
                          title="Compare side-by-side"
                          className={`px-2 py-1 font-mono text-[10px] border flex items-center gap-1 shrink-0 ${
                            isCompared
                              ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white'
                              : 'border-white/15 text-[#949BA8] hover:text-white'
                          }`}
                        >
                          <ArrowLeftRight className="w-3 h-3" />
                          {isCompared ? 'Comparing' : 'Compare'}
                        </button>
                      </div>

                      {/* Center Visual Viewport (Studio Photo + 1:1 Cross Section SVG) */}
                      <Link
                        to={`/product/${p.id}`}
                        className="relative h-52 bg-[#07080B] flex items-center justify-center p-4 overflow-hidden"
                      >
                        {cardVisualMode !== 'section' && p.images?.hero && (
                          <img
                            src={p.images.hero}
                            alt={p.model}
                            loading="lazy"
                            width={400}
                            height={400}
                            className={`h-full object-contain transition-transform duration-500 group-hover:scale-105 ${
                              cardVisualMode === 'both' ? 'w-3/5 mr-auto opacity-85' : 'w-full'
                            }`}
                          />
                        )}

                        {cardVisualMode !== 'photo' && (
                          <div
                            className={
                              cardVisualMode === 'both'
                                ? 'absolute right-3 bottom-3 bg-[#0D0F14]/90 border border-white/10 p-2'
                                : 'flex items-center justify-center'
                            }
                          >
                            <ProfileCrossSectionSVG
                              w={p.size.w}
                              h={p.size.h}
                              view={p.view}
                              scale={cardVisualMode === 'both' ? 2.6 : 4.2}
                            />
                          </div>
                        )}
                      </Link>

                      {/* Monospace Engineering Specs Block */}
                      <div className="p-4 border-t border-white/10 bg-[#0D0F14] space-y-3">
                        <div className="font-mono text-[11px] text-[#949BA8] truncate">
                          ITEM NO: <span className="text-[#F3F5F8]">{p.itemNo}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                          <div className="p-2 bg-[#07080B] border border-white/5">
                            <span className="text-[9px] text-[#5E6573] block">SIZE (MM)</span>
                            <span className="text-[#F3F5F8] font-semibold">
                              {p.size.w}×{p.size.h}
                            </span>
                          </div>
                          <div className="p-2 bg-[#07080B] border border-white/5">
                            <span className="text-[9px] text-[#5E6573] block">POWER</span>
                            <span className="text-[#F3F5F8] font-semibold">
                              {p.wattOptions.slice(0, 3).join('/')}W
                            </span>
                          </div>
                          <div className="p-2 bg-[#07080B] border border-white/5">
                            <span className="text-[9px] text-[#5E6573] block">MIN. BEND</span>
                            <span className="text-[#F3F5F8] font-semibold">
                              R{p.minBendRadius}mm
                            </span>
                          </div>
                        </div>

                        {/* Three Action Buttons: Datasheet / IES / + Inquiry */}
                        <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                          <a
                            href={p.downloads.datasheet}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-2 bg-[#07080B] hover:bg-white/10 border border-white/15 text-[#F3F5F8] flex items-center justify-center gap-1"
                            title="Download Official Specification PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#1E6FD9]" />
                            <span>Datasheet</span>
                          </a>

                          <Link
                            to={hasIes ? `/product/${p.id}#downloads` : `/designer-hub`}
                            className="py-2 px-2 bg-[#07080B] hover:bg-white/10 border border-white/15 text-[#F3F5F8] flex items-center justify-center gap-1"
                            title="Download Photometric IES / LDT"
                          >
                            <Download className="w-3.5 h-3.5 text-[var(--glow)]" />
                            <span>IES ({hasIes ? p.downloads.ies.length : 'Hub'})</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => addItem(p)}
                            className="py-2 px-2 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-semibold flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Inquiry</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
