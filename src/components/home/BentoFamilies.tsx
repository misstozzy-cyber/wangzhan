import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Shield,
  Sparkles,
  Droplets,
  EyeOff,
  Zap,
  Ruler,
  Cpu,
} from 'lucide-react';
import { Product } from '../../types/product';

interface BentoFamiliesProps {
  products: Product[];
}

const WHY_TYRIA_ITEMS = [
  {
    icon: Shield,
    title: 'Dow SILASTIC™ ET-7021 Silicone',
    desc: 'Optical-grade platinum-cured silicone resists UV yellowing, salt spray, acids, and outdoor thermal shock (-25°C to +60°C).',
  },
  {
    icon: Sparkles,
    title: 'One-Piece Co-Extrusion',
    desc: 'Integrated extrusion molding produces a uniform, dot-free luminous surface with zero shadow seams or end-cap light leaks.',
  },
  {
    icon: Cpu,
    title: 'SDCM ≤ 3 · Single-Bin LEDs',
    desc: 'Finished-product MacAdam ellipse controlled within 3 steps (1 Bin) with Ra ≥ 90 / Ra ≥ 98 full-spectrum fidelity.',
  },
  {
    icon: Droplets,
    title: 'True IP67 & IP68 Submersible',
    desc: 'Injection-molded and solder-free IP67/IP68 end caps engineered for swimming pools, fountains, marine decks, and walk-over paving.',
  },
  {
    icon: EyeOff,
    title: 'UGR < 19 Anti-Glare Optics',
    desc: 'Deep-channel and honeycomb-louvered silicone neon profiles eliminate direct glare in executive offices and hospitality coves.',
  },
  {
    icon: Zap,
    title: '160–180 lm/W High Efficacy',
    desc: 'ErP-compliant high-efficiency SMD2835 and flip-chip COB strips maximize lumen output per watt on 2oz/3oz rolled copper FPC.',
  },
  {
    icon: Ruler,
    title: '30m Neon & 60m 48V Runs',
    desc: 'Custom neon reel lengths up to 30m and 48V constant-current strips running up to 60m from a single power feed.',
  },
];

export const BentoFamilies: React.FC<BentoFamiliesProps> = ({ products }) => {
  const countBySlug = (slug: string) =>
    products.filter((p) => p.familySlug === slug || p.seriesSlug === slug).length;

  const neonCount = products.filter((p) => p.familySlug === 'neon-flex').length;
  const stripCount = products.filter((p) => p.familySlug === 'led-strip').length;
  const cobCount = products.filter((p) => p.seriesSlug === 'cob-strip').length;
  const grazerCount = products.filter((p) => p.familySlug === 'wall-grazer').length;
  const sheetCount = products.filter((p) => p.familySlug === 'led-sheet').length;
  const pixelCount = products.filter(
    (p) => p.seriesSlug === 'pixel-neon' || p.seriesSlug === 'addressable-pixel' || p.controls.some((c) => c.includes('DMX') || c.includes('SPI'))
  ).length;

  const findHeroImage = (predicate: (p: Product) => boolean, fallback: string) => {
    const match = products.find((p) => predicate(p) && p.images?.hero);
    return match ? match.images.hero : fallback;
  };

  const tiles = [
    {
      title: 'Silicone LED Neon Flex',
      code: 'TV · SV · 360° · 3D · DOME · EMBEDDED · UGR<19 · IP68',
      desc: '50+ true-scale cross-sections from 3×6mm micro-contours to Ø40mm 360° tubes (1600K–12000K) and AC230V driverless runs.',
      count: `${neonCount} Models`,
      link: '/products/neon-flex',
      span: 'lg:col-span-7 lg:row-span-2 min-h-[420px]',
      img: findHeroImage((p) => p.model.includes('1617 TV'), '/assets/products/neon-flex-1617-tv-ty-nt1617v24px/hero.webp'),
    },
    {
      title: 'Architectural LED Strips',
      code: '160–180LM/W · SMD2835 · SMD2010 · 48V 60M · SAUNA 100°C',
      desc: 'High-efficacy Ra90/Ra98 linear tapes on 2oz/3oz rolled copper PCB with constant-current 60m single-feed options.',
      count: `${stripCount} Models`,
      link: '/products/led-strip',
      span: 'lg:col-span-5 min-h-[240px]',
      img: findHeroImage((p) => p.familySlug === 'led-strip', ''),
    },
    {
      title: 'COB & COB PLUS Dot-Free',
      code: '4MM TO 14MM · 320–896 LEDS/M · INTEGRATED EXTRUSION',
      desc: '180° uniform phosphor line of light with zero spotting even in shallow 6mm aluminium channels.',
      count: `${cobCount} Models`,
      link: '/products/led-strip/cob-strip',
      span: 'lg:col-span-5 min-h-[240px]',
      img: findHeroImage((p) => p.seriesSlug === 'cob-strip', ''),
    },
    {
      title: 'Flexible Wall Grazer',
      code: '1615 · 2621 PRO · PU DMX512 · 15°/30°/50°/20×55°',
      desc: 'Bends along curved facades and arches to deliver deep architectural grazing without rigid fixture brackets.',
      count: `${grazerCount} Models`,
      link: '/products/wall-grazer',
      span: 'lg:col-span-4 min-h-[250px]',
      img: findHeroImage((p) => p.familySlug === 'wall-grazer', ''),
    },
    {
      title: 'Flex LED Backlit Sheet',
      code: '490×245MM · ARBITRARY CUT · SINGLE / TUNABLE / RGBW / PIXEL',
      desc: 'Ultra-thin cuttable matrix with plug-and-play connectors for translucent stone, onyx, and retail lightboxes.',
      count: `${sheetCount} Models`,
      link: '/products/led-sheet',
      span: 'lg:col-span-4 min-h-[250px]',
      img: findHeroImage((p) => p.familySlug === 'led-sheet', ''),
    },
    {
      title: 'Pixel DMX512 & SPI Systems',
      code: 'UCS512 · WS2818 · UCS2904 · BREAKPOINT TRANSMISSION',
      desc: 'Addressable digital neon and strips with redundant signal lines for dynamic media facades and kinetic ceilings.',
      count: `${pixelCount} Models`,
      link: '/products/neon-flex/pixel-neon',
      span: 'lg:col-span-4 min-h-[250px]',
      img: findHeroImage((p) => p.controls.some((c) => c.includes('DMX') || c.includes('SPI')), ''),
    },
  ];

  return (
    <section className="py-20 border-b border-[var(--border-hairline)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
        {/* Heading Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Engineered Linear Product Families
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[64ch]">
              Every product family is manufactured in-house from SMD encapsulation to silicone co-extrusion, backed by full integrating sphere and goniophotometer verification.
            </p>
          </div>
          <Link
            to="/products"
            className="font-mono text-xs text-[#1E6FD9] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>VIEW COMPLETE CATALOGUE ({products.length} MODELS)</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric 12-Col Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              to={tile.link}
              className={`${tile.span} group relative bg-[#07080B] border border-[var(--border-hairline)] glow-border-hover overflow-hidden flex flex-col justify-between p-6 sm:p-8 transition-all duration-300`}
            >
              {/* Background Black-Studio Product Photo */}
              {tile.img && (
                <img
                  src={tile.img}
                  alt={tile.title}
                  loading="lazy"
                  width={600}
                  height={600}
                  className="absolute right-0 bottom-0 w-3/4 sm:w-2/3 h-full object-contain object-right-bottom opacity-65 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none"
                />
              )}

              {/* Subtle Gradient Scrim for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#07080B] via-[#07080B]/80 to-transparent pointer-events-none" />

              {/* Top Bar */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="font-mono text-[11px] text-[#949BA8] tracking-wider">
                  {tile.code}
                </span>
                <span
                  className="px-2.5 py-1 font-mono text-xs bg-[#0D0F14] border border-white/10 text-[#F3F5F8] shrink-0"
                  style={{ borderColor: 'rgba(var(--glow-rgb), 0.35)' }}
                >
                  {tile.count}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 max-w-md space-y-2 pt-16">
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[#F3F5F8] group-hover:text-[var(--glow)] transition-colors flex items-center gap-2">
                  <span>{tile.title}</span>
                  <ArrowUpRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>
                <p className="text-xs sm:text-sm text-[#949BA8] leading-relaxed">
                  {tile.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Why Tyria Horizontal Architectural Strip */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">
              Why Lighting Designers Specify TYRIA
            </h3>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              OPTICAL GRADE · ZERO DOTS · 1-BIN CONSISTENCY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {WHY_TYRIA_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between gap-3"
                >
                  <div className="w-8 h-8 rounded-sm bg-[var(--bg-surface)] flex items-center justify-center border border-[var(--border-hairline)]">
                    <Icon className="w-4 h-4 text-[var(--glow)]" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-xs text-[var(--text-primary)] mb-1">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
