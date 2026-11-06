import React from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  FileText,
  ArrowUpRight,
  MessageCircle,
  Send,
  Cpu,
  Layers,
  ShieldCheck,
  Activity,
  PackageCheck,
} from 'lucide-react';
import { Product, CatalogItem, FactoryAsset } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { LightOnHero } from '../components/home/LightOnHero';
import { BentoFamilies } from '../components/home/BentoFamilies';
import { ProfileAtlas } from '../components/products/ProfileAtlas';
import { BendLab } from '../components/home/BendLab';
import { LightTheBuilding } from '../components/home/LightTheBuilding';
import { GlareCompare } from '../components/home/GlareCompare';

interface HomePageProps {
  products: Product[];
  catalogs: CatalogItem[];
  factoryAssets: FactoryAsset[];
}

const CHIP_TO_REEL_STEPS = [
  {
    step: 'STAGE 01',
    title: 'In-House SMD Encapsulation',
    desc: 'Automated die-bonding and phosphor dispensing guarantee 1-Bin MacAdam (SDCM ≤ 3) and Ra ≥ 90/98 spectral fidelity from the LED chip up.',
    icon: Cpu,
  },
  {
    step: 'STAGE 02',
    title: 'High-Speed Automated SMT',
    desc: 'Precision placement onto double-layer 2oz/3oz rolled copper FPC boards in our Shiyan (F2) SMT base.',
    icon: Layers,
  },
  {
    step: 'STAGE 03',
    title: 'Dow SILASTIC™ Co-Extrusion (6 Lines)',
    desc: 'Integrated dual-color optical silicone extrusion forms a seamless, dot-free IP67/IP68 luminaire body up to 30m per reel.',
    icon: ShieldCheck,
  },
  {
    step: 'STAGE 04',
    title: '100% Burn-In & IPX8 Pressure Testing',
    desc: 'Every production reel undergoes high-low voltage cycling, thermal shock, and pressurized water immersion verification.',
    icon: Activity,
  },
  {
    step: 'STAGE 05',
    title: 'Integrating Sphere & IES Darkroom',
    desc: 'Full goniophotometer (.IES / .LDT) and spectroradiometer reports generated for every architectural series before vacuum packing.',
    icon: PackageCheck,
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  catalogs,
  factoryAssets,
}) => {
  return (
    <div>
      <SEOHead
        title="Specialized LED Strip & Silicone Neon Flex Manufacturer"
        description="TYRIA LIGHTING (Shenzhen, Since 2012) — 50+ silicone LED neon flex profiles, 160–180 lm/W LED strips, dot-free COB, and flexible wall grazers with 259 IES/LDT photometric files."
        canonicalPath="/"
      />

      {/* 1. Light-On Hero + Count-Up Bar */}
      <LightOnHero />

      {/* 2. Product Families Bento Grid + Why Tyria Strip */}
      <BentoFamilies products={products} />

      {/* 3. 1:1 Profile Atlas Interactive Preview */}
      <ProfileAtlas products={products} isPreview={true} />

      {/* 4. Interactive Bend Radius Laboratory */}
      <BendLab products={products} />

      {/* 5. Light the Building Architectural Application Simulator */}
      <LightTheBuilding products={products} />

      {/* 6. Anti-Glare UGR < 19 Optical Comparison Slider */}
      <GlareCompare />

      {/* 7. Factory Workflow: From Chip to Reel */}
      <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-primary)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
                From LED Chip to Co-Extruded Reel
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[64ch]">
                Operating 11,000 m² across two Shenzhen factories (Shajing F1 & Shiyan F2) with 260 staff and 15 senior optical/structural engineers.
              </p>
            </div>
            <Link
              to="/factory"
              className="font-mono text-xs text-[#111111] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>INSPECT LAB & 19 CERTIFICATIONS</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {CHIP_TO_REEL_STEPS.map((s, idx) => {
              const Icon = s.icon;
              const imgAsset = factoryAssets[idx + 4] || factoryAssets[idx];
              return (
                <div
                  key={s.step}
                  className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between overflow-hidden group"
                >
                  {imgAsset && (
                    <div className="h-36 bg-[#07080B] overflow-hidden border-b border-[var(--border-hairline)]">
                      <img
                        src={imgAsset.image}
                        alt={s.title}
                        loading="lazy"
                        width={400}
                        height={240}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex items-center justify-between font-mono text-[11px] text-[#111111]">
                      <span>{s.step}</span>
                      <Icon className="w-4 h-4 text-[var(--text-primary)]" />
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-sm text-[var(--text-primary)] mb-1.5">
                        {s.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Designer Hub Entry: 259 IES/LDT & 6 Master Catalogues */}
      <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
                Lighting Designer Resource Hub
              </h2>
              <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[66ch]">
                Direct access to 259 goniophotometer <span className="font-mono text-[var(--text-primary)]">.IES</span> and <span className="font-mono text-[var(--text-primary)]">.LDT</span> files, integrating sphere reports, and our 6 master 2026 engineering catalogues.
              </p>
            </div>
            <Link
              to="/designer-hub"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Open Full Designer Hub (380+ Files) →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogs.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] flex flex-col justify-between gap-4 glow-border-hover"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#111111]">
                    <span>{cat.category.toUpperCase()}</span>
                    <span>{cat.pages} PAGES · PDF</span>
                  </div>
                  <h3 className="font-display font-medium text-base text-[var(--text-primary)]">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">{cat.highlight}</p>
                </div>

                <div className="pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--text-muted)] truncate max-w-[200px]">
                    {cat.filename}
                  </span>
                  <a
                    href={cat.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[#111111] hover:text-white border border-[var(--border-hairline)] font-mono text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Bottom Engineering Sample & Quote CTA */}
      <section className="py-20 bg-[#07080B] text-[#F3F5F8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 border border-white/15 bg-[#0D0F14] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="font-display font-medium text-3xl sm:text-4xl tracking-tight">
                Request a Free Architectural Sample Kit
              </h2>
              <p className="text-sm sm:text-base text-[#949BA8] max-w-[62ch]">
                Evaluate Dow SILASTIC™ silicone clarity, 1-Bin color consistency, anti-glare louvers, and aluminium mounting channels in your studio. Dispatched within 48 hours from Shenzhen.
              </p>
              <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs text-[#949BA8]">
                <span>✓ 0.5m Functional Cut Samples</span>
                <span>✓ Molded & Solder-Free End Caps</span>
                <span>✓ Complete IES & LM-80 Documentation</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                to="/contact"
                className="w-full py-3.5 px-6 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Request Sample Kit & Quote</span>
              </Link>
              <a
                href="https://wa.me/8618938693458?text=Hello%20TYRIA%20Lighting%2C%20I%20would%20like%20to%20request%20an%20architectural%20sample%20kit."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-mono text-xs font-semibold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +86 189 3869 3458</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
