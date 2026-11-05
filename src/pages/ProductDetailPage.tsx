import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Download,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileCrossSectionSVG } from '../components/products/ProfileCrossSectionSVG';
import { useGlow } from '../context/GlowContext';
import { useInquiry } from '../context/InquiryContext';

interface ProductDetailPageProps {
  products: Product[];
}

const EXPLODED_LAYERS = [
  {
    id: 0,
    code: 'LAYER 01 · OPTICAL ENCAPSULATION',
    title: 'Dow SILASTIC™ ET-7021 Co-Extruded Jacket',
    desc: 'Platinum-cured optical silicone formulation with dust-free matte surface treatment. Resists UV yellowing, salt mist corrosion, chlorine, and extreme temperatures (-25°C to +60°C).',
    highlightKey: 'material',
  },
  {
    id: 1,
    code: 'LAYER 02 · LIGHT ENGINE & FPC',
    title: '1-Bin High-CRI LED Array on 2oz/3oz Rolled Copper FPC',
    desc: 'High-density SMD / Flip-Chip COB package sorted to 1 Bin (SDCM ≤ 3, Ra ≥ 90/98) with onboard constant-current regulation for uniform end-to-end luminance.',
    highlightKey: 'led',
  },
  {
    id: 2,
    code: 'LAYER 03 · INGRESS SEALING & CABLE ENTRY',
    title: 'IP67 / IP68 Injection-Molded & Solder-Free End Caps',
    desc: 'Available with Front (Direct), Side (Left/Right), and Bottom hidden cable entry options to eliminate dark gaps at continuous architectural joints.',
    highlightKey: 'entry',
  },
  {
    id: 3,
    code: 'LAYER 04 · ARCHITECTURAL MOUNTING HARDWARE',
    title: 'Anodized 6063 Aluminium Profile & Serrated Bendable Track',
    desc: 'Supplied with 1m/2m rigid aluminium channels, 20mm mounting clips, or flexible stainless-steel serrated tracks for curved facade installations.',
    highlightKey: 'mounting',
  },
];

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const { setKelvin, color } = useGlow();
  const { addItem } = useInquiry();

  const product = useMemo(
    () => products.find((p) => p.id === id) || products[0],
    [products, id]
  );

  const [activeTab, setActiveTab] = useState<'hero' | 'section' | 'specsheet' | 'curve'>('hero');
  const [selectedCct, setSelectedCct] = useState<string>(product?.cctOptions[0] || '3000K');
  const [selectedWatt, setSelectedWatt] = useState<string>(
    product?.wattOptions[0] ? `${product.wattOptions[0]}W/m` : '10W/m'
  );
  const [selectedEntry, setSelectedEntry] = useState<'Front' | 'Side' | 'Bottom' | 'Standard'>('Front');
  const [lengthM, setLengthM] = useState<number>(50);
  const [qty, setQty] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<number>(0);

  if (!product) return null;

  const relatedModels = products
    .filter((p) => p.familySlug === product.familySlug && p.id !== product.id)
    .slice(0, 4);

  const handleCctSelect = (cct: string) => {
    setSelectedCct(cct);
    const numMatch = cct.match(/(\d{4})/);
    if (numMatch) {
      setKelvin(Number(numMatch[1]));
    }
  };

  return (
    <div className="min-h-screen py-10 bg-[var(--bg-primary)]">
      <SEOHead
        title={`${product.model} (${product.itemNo}) — ${product.series}`}
        description={product.pitch}
        canonicalPath={`/product/${product.id}`}
        product={product}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between font-mono text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Link to="/products" className="hover:text-[var(--text-primary)] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Products
            </Link>
            <span>/</span>
            <Link to={`/products/${product.familySlug}`} className="hover:text-[var(--text-primary)]">
              {product.family}
            </Link>
            <span>/</span>
            <Link
              to={`/products/${product.familySlug}/${product.seriesSlug}`}
              className="hover:text-[var(--text-primary)]"
            >
              {product.series}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{product.model}</span>
          </div>
          <span>PART NO: {product.itemNo}</span>
        </div>

        {/* 1. Top Hero Gallery & Specification Configurator (12 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visual Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            {/* Gallery Tabs */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('hero')}
                className={`px-3.5 py-2 border transition-colors ${
                  activeTab === 'hero'
                    ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                Studio Product View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('section')}
                className={`px-3.5 py-2 border transition-colors ${
                  activeTab === 'section'
                    ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                1:1 Interactive Cross-Section
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specsheet')}
                className={`px-3.5 py-2 border transition-colors ${
                  activeTab === 'specsheet'
                    ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                Dimension & Spec Sheet
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('curve')}
                className={`px-3.5 py-2 border transition-colors ${
                  activeTab === 'curve'
                    ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white font-semibold'
                    : 'border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
                }`}
              >
                Photometric Distribution
              </button>
            </div>

            {/* Viewport */}
            <div className="relative min-h-[460px] bg-[#07080B] border border-[var(--border-hairline)] flex items-center justify-center p-6 overflow-hidden">
              {activeTab === 'hero' && (
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img
                    src={product.images.hero}
                    alt={product.model}
                    width={700}
                    height={700}
                    className="max-h-[400px] w-auto object-contain"
                  />
                  {/* Corner 1:1 Cross-Section Mini Badge */}
                  <div className="absolute right-4 bottom-4 p-3 bg-[#0D0F14]/90 border border-white/15">
                    <ProfileCrossSectionSVG
                      w={product.size.w}
                      h={product.size.h}
                      view={product.view}
                      scale={3.6}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'section' && (
                <div className="text-center space-y-6 py-8">
                  <ProfileCrossSectionSVG
                    w={product.size.w}
                    h={product.size.h}
                    view={product.view}
                    scale={7.5}
                  />
                  <div className="font-mono text-xs text-[#949BA8]">
                    TRUE SCALE GEOMETRY: {product.size.w}mm (W) × {product.size.h}mm (H) · EMITTING: {product.view} · MIN. BEND Ø{product.minBendDiameter}mm
                  </div>
                </div>
              )}

              {activeTab === 'specsheet' && (
                <img
                  src={product.images.section}
                  alt={`${product.model} specification drawing`}
                  className="max-h-[520px] w-auto object-contain"
                />
              )}

              {activeTab === 'curve' && (
                <img
                  src={product.images.curve}
                  alt={`${product.model} light distribution curve`}
                  className="max-h-[520px] w-auto object-contain"
                />
              )}
            </div>
          </div>

          {/* Right Product Configurator & RFQ Actions (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-6">
            <div className="border-b border-[var(--border-hairline)] pb-4 space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs text-[#1E6FD9]">
                <span>{product.family.toUpperCase()} · {product.series.toUpperCase()}</span>
                <span>{product.ip}</span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
                {product.model}
              </h1>
              <div className="font-mono text-xs text-[var(--text-muted)]">
                PART NO: <span className="text-[var(--text-primary)]">{product.itemNo}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {product.pitch}
            </p>

            {/* Interactive CCT Swatches (Updates Global Glow) */}
            <div>
              <div className="flex items-center justify-between font-mono text-xs mb-2">
                <span className="text-[var(--text-muted)]">SELECT COLOR / CCT (LIVE GLOW)</span>
                <span style={{ color: color.hex }}>{selectedCct}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.cctOptions.map((cct) => {
                  const active = selectedCct === cct;
                  return (
                    <button
                      key={cct}
                      type="button"
                      onClick={() => handleCctSelect(cct)}
                      className={`px-3 py-1.5 font-mono text-xs border transition-all ${
                        active
                          ? 'border-[var(--glow)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-semibold glow-box'
                          : 'border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-white/30'
                      }`}
                    >
                      {cct}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wattage & Cable Entry Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  RATED POWER (W/M)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {product.wattOptions.map((w) => {
                    const label = `${w}W/m`;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWatt(label)}
                        className={`px-2.5 py-1.5 font-mono text-xs border ${
                          selectedWatt === label
                            ? 'border-[#1E6FD9] bg-[#1E6FD9]/15 text-[var(--text-primary)] font-semibold'
                            : 'border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  CABLE ENTRY DIRECTION
                </label>
                <select
                  value={selectedEntry}
                  onChange={(e) =>
                    setSelectedEntry(
                      e.target.value as 'Front' | 'Side' | 'Bottom' | 'Standard'
                    )
                  }
                  className="w-full px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
                >
                  <option value="Front">Front Cable Entry (Direct)</option>
                  <option value="Side">Side Cable Entry (Left/Right)</option>
                  <option value="Bottom">Bottom Hidden Entry</option>
                  <option value="Standard">Solder-Free End Cap</option>
                </select>
              </div>
            </div>

            {/* Project Length & Batch Quantity */}
            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                  ESTIMATED PROJECT METERS
                </label>
                <input
                  type="number"
                  min={1}
                  value={lengthM}
                  onChange={(e) => setLengthM(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[var(--text-muted)] mb-1">
                  REELS / BATCH UNITS
                </label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                />
              </div>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  addItem(product, {
                    cct: selectedCct,
                    wattage: selectedWatt,
                    cableEntry: selectedEntry,
                    lengthM,
                    qty,
                  })
                }
                className="flex-1 py-3.5 px-5 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Inquiry Basket</span>
              </button>

              <a
                href={product.downloads.datasheet}
                target="_blank"
                rel="noreferrer"
                className="py-3.5 px-5 bg-[var(--bg-primary)] hover:border-[var(--glow)] border border-[var(--border-hairline)] text-[var(--text-primary)] font-mono text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#1E6FD9]" />
                <span>Datasheet PDF</span>
              </a>
            </div>

            {/* Key Engineering Features List */}
            <ul className="space-y-2 pt-3 border-t border-[var(--border-hairline)] text-xs text-[var(--text-secondary)]">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Interactive Exploded Structural View & Synchronized Spec Table */}
        <section className="pt-8 border-t border-[var(--border-hairline)] space-y-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              Exploded Structural Architecture & Telemetry
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Click each structural layer on the left to inspect its material composition and highlight the corresponding engineering parameters on the right.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Interactive 4-Layer Stack (6 cols) */}
            <div className="lg:col-span-6 space-y-3">
              {EXPLODED_LAYERS.map((layer) => {
                const isSelected = activeLayer === layer.id;
                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full text-left p-5 border transition-all duration-300 ${
                      isSelected
                        ? 'bg-[var(--bg-elevated)] border-[var(--glow)] glow-box translate-x-1.5'
                        : 'bg-[var(--bg-primary)] border-[var(--border-hairline)] hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#1E6FD9]">
                      <span>{layer.code}</span>
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="font-display font-bold text-base text-[var(--text-primary)] mt-1">
                      {layer.title}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                      {layer.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Synchronized Monospace Parameter Table (6 cols) */}
            <div className="lg:col-span-6 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[var(--border-hairline)] flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  ENGINEERING SPECIFICATION TABLE
                </span>
                <span className="text-[#1E6FD9]">{product.itemNo}</span>
              </div>

              <dl className="divide-y divide-[var(--border-hairline)] font-mono text-xs">
                {[
                  {
                    label: 'Cross-Section Geometry',
                    value: `${product.size.w} × ${product.size.h} mm (${product.view} Emission)`,
                    layer: 0,
                  },
                  {
                    label: 'Encapsulation Material',
                    value: 'Dow SILASTIC™ ET-7021 Optical Silicone Co-Extrusion',
                    layer: 0,
                  },
                  {
                    label: 'Operating / Storage Temp',
                    value: '-25°C ~ +60°C (Max LED Pin 65°C)',
                    layer: 0,
                  },
                  {
                    label: 'Light Source & Binning',
                    value: `${product.ledType} · ${product.ledsPerM} LEDs/m · ${product.sdcm}`,
                    layer: 1,
                  },
                  {
                    label: 'Rated Power & Voltage',
                    value: `${product.wattOptions.join('W / ')}W/m · ${product.voltage}`,
                    layer: 1,
                  },
                  {
                    label: 'Luminous Flux & Efficacy',
                    value: `Up to ${product.maxLumen} lm/m (${product.efficacy} lm/W) · ${product.cri}`,
                    layer: 1,
                  },
                  {
                    label: 'Control Protocols',
                    value: product.controls.join(' · '),
                    layer: 1,
                  },
                  {
                    label: 'Ingress Protection & End Caps',
                    value: `${product.ip} · Front / Side / Bottom / Solder-Free Entry`,
                    layer: 2,
                  },
                  {
                    label: 'Cutting Increment & Max Run',
                    value: `Cut Unit: ${product.cutUnit} · Max Single-Feed: ${product.maxRun}`,
                    layer: 2,
                  },
                  {
                    label: 'Min. Bending Diameter',
                    value: `≥ ${product.minBendDiameter} mm (Min. Radius ${product.minBendRadius} mm)`,
                    layer: 3,
                  },
                  {
                    label: 'Mounting Profiles & Warranty',
                    value: `6063 Aluminium Profile / Clips · ${product.warranty} Warranty`,
                    layer: 3,
                  },
                ].map((row) => {
                  const highlighted = row.layer === activeLayer;
                  return (
                    <div
                      key={row.label}
                      className={`px-5 py-3 grid grid-cols-1 sm:grid-cols-12 gap-2 transition-colors ${
                        highlighted
                          ? 'bg-[#1E6FD9]/15 text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      <dt className="sm:col-span-5 text-[var(--text-muted)]">{row.label}</dt>
                      <dd className="sm:col-span-7 font-medium text-[var(--text-primary)]">
                        {row.value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>

        {/* 3. Accessories, Wiring & Installation Precautions Visuals */}
        {product.images.detail && product.images.detail.length > 0 && (
          <section className="pt-8 border-t border-[var(--border-hairline)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                  End Caps, Mounting Profiles & Installation Precautions
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                  Extracted directly from the official TYRIA engineering specification manual for {product.model}.
                </p>
              </div>
              <span className="font-mono text-xs text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Follow two-person installation guidelines for runs &gt; 5m
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {product.images.detail.map((imgUrl, idx) => (
                <div
                  key={imgUrl}
                  className="bg-[#07080B] border border-[var(--border-hairline)] p-3 space-y-2"
                >
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">
                    ENGINEERING SHEET 0{idx + 1} · {idx === 0 ? 'END CAPS & CABLE ENTRY' : idx === 1 ? 'ALUMINIUM PROFILE & CLIPS' : 'INSTALLATION DO & DON\'T'}
                  </div>
                  <img
                    src={imgUrl}
                    alt={`${product.model} engineering diagram ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-72 object-contain bg-[#0D0F14]"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Downloads Block: Datasheet PDF, IES, LDT & Test Reports */}
        <section
          id="downloads"
          className="pt-8 border-t border-[var(--border-hairline)] space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">
                Photometric IES / LDT & Specification Downloads
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Download the complete PDF datasheet, DIALux/Relux <span className="font-mono">.IES</span> & <span className="font-mono">.LDT</span> files, and integrating sphere reports.
              </p>
            </div>
            <Link
              to="/designer-hub"
              className="font-mono text-xs text-[#1E6FD9] hover:underline"
            >
              Browse All 259 IES Files in Designer Hub →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Official Datasheet Card */}
            <a
              href={product.downloads.datasheet}
              target="_blank"
              rel="noreferrer"
              className="p-5 bg-[var(--bg-elevated)] border border-[#1E6FD9]/50 hover:border-[#1E6FD9] flex flex-col justify-between gap-4"
            >
              <div>
                <span className="font-mono text-[10px] text-[#1E6FD9] block">
                  OFFICIAL DATASHEET (PDF)
                </span>
                <div className="font-display font-bold text-base text-[var(--text-primary)] mt-1">
                  {product.model} Specification
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Full electrical tables, cross-section drawings, end caps, wiring, and installation instructions.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#1E6FD9] font-semibold">
                <FileText className="w-4 h-4" />
                <span>Download PDF Datasheet →</span>
              </div>
            </a>

            {/* IES & LDT Photometric Sets */}
            {product.downloads.ies.length > 0 ? (
              product.downloads.ies.slice(0, 6).map((ies, idx) => {
                const matchingLdt = product.downloads.ldt[idx];
                const matchingRep = product.downloads.report[idx];
                return (
                  <div
                    key={ies.filename + idx}
                    className="p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono text-[10px] text-[var(--glow)] block">
                        PHOTOMETRIC PACKAGE · {ies.cct} · {ies.watt}
                      </span>
                      <div className="font-mono font-semibold text-xs text-[var(--text-primary)] mt-1 break-all">
                        {ies.label}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border-hairline)] font-mono text-[11px]">
                      <a
                        href={ies.url}
                        download
                        className="px-2.5 py-1 bg-[#1E6FD9] text-white flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> .IES
                      </a>
                      {matchingLdt && (
                        <a
                          href={matchingLdt.url}
                          download
                          className="px-2.5 py-1 border border-[var(--border-hairline)] hover:border-white/30 text-[var(--text-primary)] flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> .LDT
                        </a>
                      )}
                      {matchingRep && (
                        <a
                          href={matchingRep.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 border border-[var(--border-hairline)] hover:border-white/30 text-[var(--text-secondary)] flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Test Report
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-3 p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-display font-semibold text-sm text-[var(--text-primary)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#1E6FD9]" />
                    <span>Custom CCT & Wattage IES Photometric Files Available</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Access our central 259-file IES/LDT library in the Designer Hub or request a custom integrating sphere test for your exact project wattage.
                  </p>
                </div>
                <Link
                  to="/designer-hub"
                  className="px-4 py-2 bg-[#1E6FD9] text-white font-mono text-xs shrink-0"
                >
                  Open Designer Hub →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 5. Related Models */}
        {relatedModels.length > 0 && (
          <section className="pt-8 border-t border-[var(--border-hairline)] space-y-5">
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
              Related Architectural Profiles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedModels.map((rm) => (
                <Link
                  key={rm.id}
                  to={`/product/${rm.id}`}
                  className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--glow)] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-display font-bold text-sm text-[var(--text-primary)]">
                      {rm.model}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)]">
                      {rm.size.w}×{rm.size.h}mm · {rm.ip}
                    </div>
                  </div>
                  <ProfileCrossSectionSVG
                    w={rm.size.w}
                    h={rm.size.h}
                    view={rm.view}
                    scale={2.4}
                    showDimensions={false}
                  />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
