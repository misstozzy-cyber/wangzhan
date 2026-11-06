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
import lightHeroes from '../data/light_heroes.json';

const LIGHT_HEROES = new Set<string>(lightHeroes as string[]);

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
  const [cardVisualMode, setCardVisualMode] = useState<'both' | 'section' | 'photo'>('photo');

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
            <h1 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
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
                    ? 'bg-[#111111] text-white'
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
                    ? 'bg-[#111111] text-white'
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
                    ? 'bg-[#111111] text-white'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" /> Studio Photo
              </button>
            </div>

            <Link
              to="/products/neon-flex/atlas"
              className="px-3.5 py-2 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] hover:border-[var(--text-primary)] font-mono text-xs text-[var(--text-primary)]"
            >
              Open 1:1 Profile Atlas →
            </Link>
          </div>
        </div>

        {/* 12-Col Layout: Sticky Filter Panel (3 cols) + Product Cards Grid (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Filter Panel */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 pr-4 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                SPECIFICATION FILTERS ({filteredProducts.length})
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 font-mono text-[11px] text-[#111111] hover:underline"
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
                        ? 'border-[#111111] bg-[#111111]/15 text-[var(--text-primary)] font-semibold'
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
                          ? 'border-[#111111] bg-[#111111]/15 text-[var(--text-primary)] font-semibold'
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
                <span className="text-[var(--text-primary)]">
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
                className="w-full accent-[#111111]"
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
                <div className="font-display font-medium text-lg text-[var(--text-primary)]">
                  No Profiles Match Current Filter Combination
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Reset filters or contact our engineering team for custom silicone extrusion tooling.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#111111] text-white font-mono text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14">
                {filteredProducts.map((p) => {
                  const showPhoto = cardVisualMode !== 'section' && p.images?.hero && !LIGHT_HEROES.has(p.id);
                  return (
                    <article key={p.id} className="group">
                      <Link
                        to={`/product/${p.id}`}
                        className="relative block aspect-[4/5] rounded-[20px] overflow-hidden bg-[#111111] [transform:perspective(1200px)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:perspective(1200px)_rotateX(2deg)_translateY(-4px)]"
                      >
                        {showPhoto ? (
                          <img
                            src={p.images.hero}
                            alt={p.model}
                            loading="lazy"
                            width={600}
                            height={750}
                            className="absolute inset-0 w-full h-full object-cover scale-[1.04] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#E9E6DF]">
                            <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={4.2} />
                          </div>
                        )}
                        {cardVisualMode === 'both' && showPhoto && (
                          <div className="absolute left-4 bottom-4 rounded-xl bg-[#F5F4F0]/90 backdrop-blur px-3 pt-3 pb-2">
                            <ProfileCrossSectionSVG w={p.size.w} h={p.size.h} view={p.view} scale={2.2} />
                          </div>
                        )}
                        <span className={`absolute right-4 top-4 font-mono text-[10px] tracking-[0.08em] uppercase ${showPhoto ? 'text-[#F5F4F0]/70' : 'text-[#8C8A84]'}`}>
                          {p.size.w}×{p.size.h} mm
                        </span>
                      </Link>
                      <div className="pt-5 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="spec-label truncate">{p.series}</div>
                          <Link
                            to={`/product/${p.id}`}
                            className="mt-1.5 block font-display text-[20px] leading-tight tracking-[-0.03em] text-[#111111] truncate"
                          >
                            {p.model}
                          </Link>
                          <div className="mt-2 font-mono text-[11px] tracking-[0.04em] text-[#8C8A84] truncate">
                            {p.voltage} · {p.wattOptions.slice(0, 3).join('/')} W/m · {p.ip}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => addItem(p)}
                          className="shrink-0 mt-1 w-9 h-9 rounded-full border border-[rgba(17,17,17,0.15)] text-[#111111] flex items-center justify-center hover:bg-[#111111] hover:text-[#F5F4F0] transition-colors"
                          aria-label={`Add ${p.model} to sample request`}
                          title="Add to sample request"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </article>
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
