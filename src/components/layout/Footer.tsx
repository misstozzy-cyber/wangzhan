import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';

const CERTIFICATIONS = [
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
  'ETL Listed',
  'TUV-CE',
  'UKCA',
  'RCM',
  'RoHS 2.0',
  'LM-80',
  'ErP Compliant',
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--bg-elevated)] border-t border-[var(--border-hairline)] text-[var(--text-secondary)]">
      {/* Certifications Strip */}
      <div className="border-b border-[var(--border-hairline)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]">
            <ShieldCheck className="w-4 h-4 text-[#1E6FD9]" />
            <span>CERTIFIED ARCHITECTURAL MANUFACTURING</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CERTIFICATIONS.map((cert) => (
              <span
                key={cert}
                className="px-2.5 py-1 text-[11px] font-mono border border-[var(--border-hairline)] bg-[var(--bg-primary)] text-[var(--text-secondary)]"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Col 1: Brand & Two Factory Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="font-display font-bold text-xl text-[var(--text-primary)] tracking-tight">
              TYRIA LIGHTING TECHNOLOGY CO., LTD.
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-[54ch]">
              Specialized LED Strip & Silicone Neon Flex manufacturer since 2012 — engineered for lighting designers, facade consultants, and architectural contractors worldwide.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] space-y-1">
              <div className="font-mono text-[11px] text-[#1E6FD9] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                FACTORY 1 (HQ, R&D & SILICONE CO-EXTRUSION)
              </div>
              <p className="text-[var(--text-primary)]">
                2F, D Building, Antonio Technology Park, Ma&apos;anshan Community, Shajing Street, Bao&apos;an District, Shenzhen, Guangdong, China
              </p>
            </div>

            <div className="p-3.5 border border-[var(--border-hairline)] bg-[var(--bg-primary)] space-y-1">
              <div className="font-mono text-[11px] text-[#1E6FD9] font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                FACTORY 2 (SMD PACKAGING & AUTOMATED SMT BASE)
              </div>
              <p className="text-[var(--text-primary)]">
                Shancheng Industrial Zone, Shiyan Town, Bao&apos;an District, Shenzhen, Guangdong, China
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-[var(--text-primary)]">
            <a
              href="mailto:info@tyrialight.com"
              className="flex items-center gap-1.5 hover:text-[var(--glow)] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#1E6FD9]" />
              info@tyrialight.com
            </a>
            <a
              href="tel:+8675536931652"
              className="flex items-center gap-1.5 hover:text-[var(--glow)] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#1E6FD9]" />
              +86 755 3693 1652
            </a>
            <a
              href="https://wa.me/8618938693458"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--glow)] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#1E6FD9]" />
              WhatsApp: +86 189 3869 3458
            </a>
          </div>
        </div>

        {/* Col 2: Silicone Neon Flex (3 cols) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
            LED Neon Flex Series
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products/neon-flex/atlas" className="hover:text-[var(--glow)] transition-colors font-mono text-[var(--text-primary)]">
                → 1:1 Profile Atlas (50+ Sizes)
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/top-view" className="hover:text-[var(--text-primary)] transition-colors">
                Top View (TV) · 0606 to 5025
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/side-view" className="hover:text-[var(--text-primary)] transition-colors">
                Side View (SV) · 0306 to 3032
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/360-round" className="hover:text-[var(--text-primary)] transition-colors">
                360° Round · R13 / R25 / R40 Full-CCT
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/3d-bend" className="hover:text-[var(--text-primary)] transition-colors">
                3D Dual-Bend · 0808 / 1010 / 1615 / 1617
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/anti-glare" className="hover:text-[var(--text-primary)] transition-colors">
                Anti-Glare UGR&lt;19 Louvered Neon
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/embedded-recessed" className="hover:text-[var(--text-primary)] transition-colors">
                Embedded & Winged Recessed Neon
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/ip68-silicone" className="hover:text-[var(--text-primary)] transition-colors">
                IP68 Pool, Marine & In-Ground Neon
              </Link>
            </li>
            <li>
              <Link to="/products/neon-flex/pixel-neon" className="hover:text-[var(--text-primary)] transition-colors">
                DMX512 & SPI Addressable Pixel Neon
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: LED Strips & Grazers (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
            Linear Strips & Grazers
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/products/led-strip/high-efficiency" className="hover:text-[var(--text-primary)] transition-colors">
                160–180 lm/W High Efficiency
              </Link>
            </li>
            <li>
              <Link to="/products/led-strip/cob-strip" className="hover:text-[var(--text-primary)] transition-colors">
                COB & COB PLUS (4–14mm)
              </Link>
            </li>
            <li>
              <Link to="/products/led-strip/48v-super-long" className="hover:text-[var(--text-primary)] transition-colors">
                48V Super Long (60m Single-Feed)
              </Link>
            </li>
            <li>
              <Link to="/products/led-strip/smd2835" className="hover:text-[var(--text-primary)] transition-colors">
                SMD2835 & SMD2010 Narrow
              </Link>
            </li>
            <li>
              <Link to="/products/led-strip/sauna-strip" className="hover:text-[var(--text-primary)] transition-colors">
                Sauna High-Temp & Full Spectrum
              </Link>
            </li>
            <li>
              <Link to="/products/wall-grazer" className="hover:text-[var(--text-primary)] transition-colors">
                Flexible Wall Grazer 1615 & 2621 Pro
              </Link>
            </li>
            <li>
              <Link to="/products/led-sheet" className="hover:text-[var(--text-primary)] transition-colors">
                Cuttable Backlit Flex LED Sheet
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Engineering Tools & Hub (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
            Engineering & Support
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/spec-finder" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                Spec Finder Database <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link to="/designer-hub" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
                Designer Hub (259 IES/LDT) <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link to="/applications" className="hover:text-[var(--text-primary)] transition-colors">
                Light the Building Scenarios
              </Link>
            </li>
            <li>
              <Link to="/factory" className="hover:text-[var(--text-primary)] transition-colors">
                From Chip to Reel Factory Tour
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[var(--text-primary)] transition-colors">
                About Tyria Lighting
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[var(--text-primary)] transition-colors text-[#1E6FD9] font-medium">
                Request Free Engineering Samples
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-[var(--border-hairline)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)] font-mono">
          <div>
            © {new Date().getFullYear()} SHENZHEN TYRIA LIGHTING TECHNOLOGY CO., LIMITED. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>DOW SILASTIC™ OPTICAL SILICONE PARTNER</span>
            <span>5-YEAR ARCHITECTURAL WARRANTY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
