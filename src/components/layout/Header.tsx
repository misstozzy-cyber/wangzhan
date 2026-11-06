import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useInquiry } from '../../context/InquiryContext';

const PRODUCT_MENU = [
  {
    family: 'LED Neon Flex',
    slug: 'neon-flex',
    series: [
      { name: 'Top View', slug: 'top-view', note: '0606–5025' },
      { name: 'Side View', slug: 'side-view', note: '0306–3032' },
      { name: '360° Round', slug: '360-round', note: 'R13 · R25 · R40' },
      { name: '3D Dual-Bend', slug: '3d-bend', note: '0808–1617' },
      { name: 'Anti-Glare', slug: 'anti-glare', note: 'UGR<19' },
      { name: 'Embedded & Recessed', slug: 'embedded-recessed', note: 'Flush fit' },
      { name: 'Dome & Dual-Side', slug: 'dome', note: '0817–D16' },
      { name: 'IP68 PU & Silicone', slug: 'ip68-silicone', note: 'Pool · marine' },
      { name: 'Black & AC230V', slug: 'black-neon', note: 'Matte black' },
      { name: 'Pixel Neon', slug: 'pixel-neon', note: 'DMX512 · SPI' },
    ],
  },
  {
    family: 'LED Strip',
    slug: 'led-strip',
    series: [
      { name: 'High Efficiency', slug: 'high-efficiency', note: '160–180 lm/W' },
      { name: 'COB & COB Plus', slug: 'cob-strip', note: '4–14 mm' },
      { name: 'SMD2835', slug: 'smd2835', note: '60–240 LEDs/m' },
      { name: 'SMD2010 Narrow', slug: 'smd2010', note: '3–5 mm' },
      { name: '48V Super Long', slug: '48v-super-long', note: '60 m run' },
      { name: 'Constant Current', slug: 'constant-current', note: '20–30 m' },
      { name: 'Tunable & RGBW', slug: 'cct-tunable', note: 'CCT · RGB+CCT' },
      { name: 'Full Spectrum & Sauna', slug: 'full-spectrum', note: 'Ra98 · 100°C' },
      { name: 'Addressable Pixel', slug: 'addressable-pixel', note: 'DMX512 · SPI' },
    ],
  },
  {
    family: 'Wall Grazer & Sheet',
    slug: 'wall-grazer',
    series: [
      { name: 'Wall Grazer 2621 Pro', slug: 'grazer-2621-pro', note: '18–24 W' },
      { name: 'Wall Grazer 1615', slug: 'grazer-1615', note: '15 W/m' },
      { name: 'PU DMX512 Grazer', slug: 'grazer-pu', note: 'RGB · RGBW' },
      { name: 'Backlit LED Sheet', slug: 'backlit-sheet', note: '490×245 mm', family: 'led-sheet' },
    ],
  },
];

const NAV = [
  { label: 'Profiles', to: '/products/neon-flex/atlas' },
  { label: 'Applications', to: '/applications' },
  { label: 'Resources', to: '/designer-hub' },
  { label: 'Company', to: '/about' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 transition-colors duration-300 ${
    isActive ? 'text-[#111111]' : 'text-[#55534E] hover:text-[#111111]'
  }`;

export const Header: React.FC = () => {
  const { items, setIsDrawerOpen } = useInquiry();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-[background-color,border-color] duration-500 ${
        scrolled || megaOpen
          ? 'bg-[#F5F4F0]/80 backdrop-blur-xl border-b border-[rgba(17,17,17,0.08)]'
          : 'bg-transparent border-b border-transparent'
      }`}
      onMouseLeave={() => setMegaOpen(false)}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2 shrink-0" aria-label="Tyria Lighting home">
          <span className="font-display text-[19px] font-semibold tracking-[-0.04em] text-[#111111]">TYRIA</span>
          <span className="spec-label !text-[10px]">Lighting</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-[14px]">
          <button
            type="button"
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((v) => !v)}
            className={`py-1 transition-colors duration-300 ${
              megaOpen || pathname.startsWith('/product') && !pathname.includes('atlas')
                ? 'text-[#111111]'
                : 'text-[#55534E] hover:text-[#111111]'
            }`}
            aria-expanded={megaOpen}
          >
            Products
          </button>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass} onMouseEnter={() => setMegaOpen(false)}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {totalItems > 0 && (
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 h-9 px-3 text-[13px] text-[#55534E] hover:text-[#111111] transition-colors"
              aria-label={`Open sample request (${totalItems} items)`}
            >
              Samples
              <span className="font-mono text-[11px] w-5 h-5 rounded-full bg-[#111111] text-[#F5F4F0] inline-flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          )}
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center h-9 px-5 rounded-full bg-[#111111] text-[#F5F4F0] text-[13px] font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-10 h-10 -mr-2 flex flex-col items-center justify-center gap-[5px]"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className={`block h-px w-5 bg-[#111111] transition-transform duration-300 ${mobileOpen ? 'translate-y-[3px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-[#111111] transition-transform duration-300 ${mobileOpen ? '-translate-y-[3px] -rotate-45' : ''}`} />
          </button>
        </div>
      </div>

      {/* Products mega menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[#F5F4F0]/95 backdrop-blur-xl border-b border-[rgba(17,17,17,0.08)]"
          >
            <div className="max-w-[1440px] mx-auto px-12 pt-10 pb-12 grid grid-cols-12 gap-10">
              <div className="col-span-3">
                <div className="spec-label mb-4">Catalogue</div>
                <Link to="/products" className="font-display text-[28px] leading-[1.05] tracking-[-0.035em] text-[#111111] hover:opacity-60 transition-opacity">
                  All products
                </Link>
                <p className="mt-3 text-[13px] leading-relaxed text-[#55534E] max-w-[28ch]">
                  115 architectural profiles, each with datasheet and photometric files.
                </p>
              </div>
              {PRODUCT_MENU.map((col) => (
                <div key={col.slug} className="col-span-3">
                  <Link
                    to={`/products/${col.slug}`}
                    className="spec-label block mb-4 hover:!text-[#111111] transition-colors"
                  >
                    {col.family}
                  </Link>
                  <ul className="space-y-[7px]">
                    {col.series.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/products/${s.family || col.slug}/${s.slug}`}
                          className="group flex items-baseline justify-between gap-4 text-[14px] text-[#111111]"
                        >
                          <span className="group-hover:opacity-60 transition-opacity">{s.name}</span>
                          <span className="font-mono text-[10px] text-[#8C8A84] tracking-wide">{s.note}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-[#F5F4F0] px-5 pt-8 overflow-y-auto"
            data-lenis-prevent
          >
            <nav className="flex flex-col">
              {[{ label: 'Products', to: '/products' }, ...NAV, { label: 'Contact', to: '/contact' }].map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={n.to}
                    className="block py-3 font-display text-[34px] leading-none tracking-[-0.04em] text-[#111111] border-b border-[rgba(17,17,17,0.08)]"
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            {totalItems > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="mt-8 h-11 px-6 rounded-full bg-[#111111] text-[#F5F4F0] text-[14px]"
              >
                Sample request · {totalItems}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
