import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { LightTheBuilding } from '../components/home/LightTheBuilding';

interface ApplicationsPageProps {
  products: Product[];
}

const APPLICATION_SECTORS = [
  {
    id: 'facade',
    title: 'Architectural Facade & Curved Exteriors',
    env: 'IP67 / IP68 · UV & Salt Mist Resistant · -25°C to +60°C',
    desc: 'Highlight textured stone, curved curtain walls, and bridge arches without rigid linear brackets. Dow SILASTIC™ ET-7021 silicone co-extrusion prevents outdoor yellowing for over 50,000 hours.',
    recommended: [
      { label: '2621 Pro Silicone Wall Grazer (15°/30°/20×55°)', link: '/products/wall-grazer/grazer-2621-pro' },
      { label: '1617 TV & 1220 SV Architectural Neon', link: '/products/neon-flex/top-view' },
      { label: 'AC230V 50m Driverless Facade Neon', link: '/products/neon-flex/ac230v-neon' },
    ],
  },
  {
    id: 'hospitality',
    title: 'Luxury Hospitality, Hotels & Atriums',
    env: 'SDCM ≤ 3 (1 Bin) · 1800K–4000K · Dot-Free Diffusion',
    desc: 'Warm candlelit coves (1800K–2700K), seamless marble backlighting, and suspended 360° atrium light sculptures with ultra-smooth 0.1% PWM/DALI dimming.',
    recommended: [
      { label: '360° R25 & R40 Full-CCT (1600K–12000K)', link: '/products/neon-flex/360-round' },
      { label: 'COB PLUS Integrated Dot-Free Strips', link: '/products/led-strip/cob-strip' },
      { label: '490×245mm Cuttable Backlit LED Sheet', link: '/products/led-sheet' },
    ],
  },
  {
    id: 'office',
    title: 'Executive Offices & Low-Glare Workspaces',
    env: 'UGR < 19 Verified · Ra ≥ 90 · EN 12464-1 Compliant',
    desc: 'Eliminate direct eye glare and screen reflections in modern open-plan offices using recessed honeycomb and deep-baffle silicone neon profiles.',
    recommended: [
      { label: 'Anti-Glare UGR<19 1617 Honeycomb & 2222 TV', link: '/products/neon-flex/anti-glare' },
      { label: '160–180 lm/W High-Efficiency Ra90 Strips', link: '/products/led-strip/high-efficiency' },
      { label: 'Embedded Winged Recessed Neon (T1212 / T1615)', link: '/products/neon-flex/embedded-recessed' },
    ],
  },
  {
    id: 'retail',
    title: 'High-End Retail, Galleries & Millwork',
    env: 'Full Spectrum Ra ≥ 98 · 3mm–5mm Micro Widths',
    desc: 'True-to-life color rendering for luxury fashion, jewelry counters, and museum artifacts with ultra-narrow 3mm/4mm strips and flush-recessed cabinet neon.',
    recommended: [
      { label: 'Full Spectrum Ra98 Museum LED Strip', link: '/products/led-strip/full-spectrum' },
      { label: 'SMD2010 3mm/4mm Ultra-Narrow Strip', link: '/products/led-strip/smd2010' },
      { label: '0606 TV & S0612 Embedded Cabinetry Neon', link: '/products/neon-flex/embedded-recessed' },
    ],
  },
  {
    id: 'signage',
    title: 'Dynamic Media Signage & Kinetic Installations',
    env: 'DMX512 (UCS512) · Breakpoint SPI (WS2818 / UCS2904)',
    desc: 'Tight minimum bending radii down to R15mm (0306 SV / 0408 SV) for intricate brand lettering, paired with addressable RGBW pixel tubes for synchronized media walls.',
    recommended: [
      { label: '0306 SV & 0612 SV Micro Side-Bend Neon', link: '/products/neon-flex/side-view' },
      { label: 'DMX512 & SPI Addressable Pixel Neon', link: '/products/neon-flex/pixel-neon' },
      { label: '1615 Matte Black Stealth Neon (Invisible Off-State)', link: '/products/neon-flex/black-neon' },
    ],
  },
  {
    id: 'landscape',
    title: 'Landscape, Swimming Pools & Walk-Over Paving',
    env: 'IP68 Pressurized Submersible · IK08 Impact · Chlorine Resistant',
    desc: 'Engineered with polyurethane-silicone composite (IP68 PU) and heavy-wall silicone for underwater pool perimeters, fountains, yacht decks, and drive-over plaza joints.',
    recommended: [
      { label: 'In-Ground S1617 IP68 Walk-Over Neon', link: '/products/neon-flex/ip68-silicone' },
      { label: 'IP68 PU Chlorine & Marine Neon Series', link: '/products/neon-flex/ip68-pu' },
      { label: '48V 60m Super-Long Landscape Path Strip', link: '/products/led-strip/48v-super-long' },
    ],
  },
  {
    id: 'sauna',
    title: 'Sauna, Spa & High-Temperature Environments',
    env: 'Up to 100°C Ambient Rating · IP67/IP68 Steam Sealed',
    desc: 'High-temperature thermal management and heat-stabilized silicone extrusion designed specifically for Finnish dry saunas, steam rooms, and wellness resorts.',
    recommended: [
      { label: 'Sauna High-Temp Single Color & RGBW Strip', link: '/products/led-strip/sauna-strip' },
      { label: 'IP68 Silicone Sealed Linear Neon', link: '/products/neon-flex/ip68-silicone' },
    ],
  },
];

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({ products }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEOHead
        title="Architectural Lighting Applications — Facade, Hospitality, Office & Pool IP68"
        description="Explore interactive architectural lighting scenarios and specification guides for facades, luxury hotels, UGR<19 offices, retail millwork, IP68 swimming pools, and 100°C saunas."
        canonicalPath="/applications"
      />

      {/* Interactive Light the Building Simulator */}
      <LightTheBuilding products={products} />

      {/* 7 Detailed Sector Engineering Guides */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--text-primary)]">
              Application Engineering Guides by Sector
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[66ch]">
              Each sector demands specific ingress protection, thermal tolerance, and optical shielding. Select any recommended series below to inspect datasheets and IES files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APPLICATION_SECTORS.map((sec) => (
              <div
                key={sec.id}
                className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between gap-6 glow-border-hover"
              >
                <div className="space-y-3">
                  <div className="font-mono text-xs text-[#1E6FD9]">{sec.env}</div>
                  <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                    {sec.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {sec.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border-hairline)] space-y-2">
                  <div className="font-mono text-[10px] text-[var(--text-muted)]">
                    SPECIFIED TYRIA SERIES
                  </div>
                  <ul className="space-y-1.5">
                    {sec.recommended.map((rec) => (
                      <li key={rec.label}>
                        <Link
                          to={rec.link}
                          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-primary)] hover:text-[var(--glow)] transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6FD9]" />
                          <span>{rec.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-70" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
