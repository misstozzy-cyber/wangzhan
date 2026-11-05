import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ChevronDown,
  Sliders,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Moon,
  Download,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useGlow } from '../../context/GlowContext';
import { useInquiry } from '../../context/InquiryContext';
import { KELVIN_PRESETS } from '../../utils/kelvinToRGB';

const PRODUCT_MEGA_MENU = [
  {
    family: 'LED Neon Flex',
    slug: 'neon-flex',
    desc: 'Dow SILASTIC™ co-extruded silicone neon with 259 IES files',
    series: [
      { name: 'Top View (TV)', slug: 'top-view', note: '0606 to 5025 · Corner 2210' },
      { name: 'Side View (SV)', slug: 'side-view', note: '0306 to 3032 horizontal bend' },
      { name: '360° Round', slug: '360-round', note: 'R13 / R25 / R40 (1600K–12000K)' },
      { name: '3D Dual-Bend', slug: '3d-bend', note: '0808 / 1010 / 1615 / 1617' },
      { name: 'Anti-Glare UGR<19', slug: 'anti-glare', note: '1010 / 1617 / 2222 louver' },
      { name: 'Embedded & Recessed', slug: 'embedded-recessed', note: 'T0606 to S1220 flush fit' },
      { name: 'Dome & Dual-Side', slug: 'dome', note: '0817 / 1023 / 1225 / D16 / Dual' },
      { name: 'IP68 PU & Silicone', slug: 'ip68-silicone', note: 'Pool, marine & in-ground S1617' },
      { name: 'Black & AC230V Neon', slug: 'black-neon', note: '1615 Matte Black · 50m AC230V' },
      { name: 'Pixel Neon (DMX512/SPI)', slug: 'pixel-neon', note: 'UCS512 / WS2818 addressable' },
    ],
  },
  {
    family: 'LED Strip Lights',
    slug: 'led-strip',
    desc: '2oz/3oz rolled copper FPC strips, Ra≥90/98, 1-Bin SDCM≤3',
    series: [
      { name: 'High Efficiency 160–180lm/W', slug: 'high-efficiency', note: 'ErP A/B class Ra90' },
      { name: 'COB & COB PLUS', slug: 'cob-strip', note: '4mm–14mm dot-free flip-chip' },
      { name: 'SMD2835 Architectural', slug: 'smd2835', note: '60 to 240 LEDs/m workhorse' },
      { name: 'SMD2010 Ultra-Narrow', slug: 'smd2010', note: '3mm / 4mm / 5mm micro coves' },
      { name: '48V Super Long (60m)', slug: '48v-super-long', note: 'Single-end feed up to 60m' },
      { name: 'Constant Current', slug: 'constant-current', note: '20m–30m zero voltage drop' },
      { name: 'CCT Tunable / RGBW / RGB+CCT', slug: 'cct-tunable', note: 'Dual-white & 4/5-in-1' },
      { name: 'Full Spectrum & Sauna 100°C', slug: 'full-spectrum', note: 'Ra98 museum & IP68 sauna' },
      { name: 'Addressable Pixel Strip', slug: 'addressable-pixel', note: 'DMX512 & breakpoint SPI' },
    ],
  },
  {
    family: 'Wall Grazer & Sheet',
    slug: 'wall-grazer',
    desc: 'Curved facade wall washing & cuttable backlit stone sheets',
    series: [
      { name: 'Silicone Wall Grazer 2621 Pro', slug: 'grazer-2621-pro', note: '18W/24W · 15°/30°/50°/20×55°' },
      { name: 'Silicone Wall Grazer 1615', slug: 'grazer-1615', note: 'Compact 15W/m facade grazer' },
      { name: 'PU DMX512 Wall Grazer', slug: 'grazer-pu', note: 'Tilt & 3535 RGB/RGBW DMX512' },
      { name: 'Flexible Backlit LED Sheet', slug: 'backlit-sheet', note: '490×245mm cuttable matrix', familyOverride: 'led-sheet' },
    ],
  },
];

export const Header: React.FC = () => {
  const { kelvin, setKelvin, color, theme, toggleTheme } = useGlow();
  const { items, setIsDrawerOpen } = useInquiry();
  const [megaOpen, setMegaOpen] = useState(false);
  const [kelvinPopoverOpen, setKelvinPopoverOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-primary)]/85 border-b border-[var(--border-hairline)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] relative overflow-hidden transition-all duration-300"
            style={{
              boxShadow: `0 0 14px -2px rgba(${color.rgbString}, 0.45)`,
              borderColor: `rgba(${color.rgbString}, 0.55)`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6H20M12 6V19"
                stroke="var(--glow)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="19" r="2" fill="var(--glow)" />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-tight leading-none flex items-center gap-1.5">
              <span>TYRIA</span>
              <span className="font-normal text-xs text-[#1E6FD9] font-mono tracking-widest">
                LIGHTING
              </span>
            </div>
            <div className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider mt-0.5">
              SHENZHEN · SINCE 2012
            </div>
          </div>
        </Link>

        {/* Primary Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          <div
            className="relative py-6"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              to="/products"
              className="flex items-center gap-1 text-[var(--text-primary)] hover:text-[var(--glow)] transition-colors"
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </Link>

            {megaOpen && (
              <div className="absolute left-0 top-full w-[880px] bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 shadow-2xl grid grid-cols-3 gap-6 z-50">
                {PRODUCT_MEGA_MENU.map((col) => (
                  <div key={col.slug} className="space-y-3">
                    <Link
                      to={`/products/${col.slug}`}
                      onClick={() => setMegaOpen(false)}
                      className="block pb-2 border-b border-[var(--border-hairline)] group"
                    >
                      <div className="font-display font-semibold text-base text-[var(--text-primary)] group-hover:text-[#1E6FD9] transition-colors">
                        {col.family}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {col.desc}
                      </div>
                    </Link>
                    <ul className="space-y-1.5">
                      {col.series.map((s) => {
                        const targetFamily = (s as { familyOverride?: string }).familyOverride || col.slug;
                        return (
                          <li key={s.slug}>
                            <Link
                              to={`/products/${targetFamily}/${s.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="flex items-baseline justify-between py-1 px-2 -mx-2 rounded hover:bg-[var(--bg-surface)] transition-colors group"
                            >
                              <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--glow)]">
                                {s.name}
                              </span>
                              <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                {s.note}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
                <div className="col-span-3 pt-3 border-t border-[var(--border-hairline)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <Link
                      to="/products/neon-flex/atlas"
                      onClick={() => setMegaOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[#1E6FD9] hover:underline font-mono"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Open 1:1 Profile Atlas (50+ Cross-Sections) →
                    </Link>
                    <Link
                      to="/spec-finder"
                      onClick={() => setMegaOpen(false)}
                      className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Launch Spec Finder Database →
                    </Link>
                  </div>
                  <Link
                    to="/designer-hub"
                    onClick={() => setMegaOpen(false)}
                    className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono"
                  >
                    <Download className="w-3.5 h-3.5" />
                    259 IES / LDT Photometric Files
                  </Link>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/products/neon-flex/atlas"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Profile Atlas
          </NavLink>
          <NavLink
            to="/spec-finder"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Spec Finder
          </NavLink>
          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Applications
          </NavLink>
          <NavLink
            to="/designer-hub"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Designer Hub
          </NavLink>
          <NavLink
            to="/factory"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Factory & Lab
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors ${
                isActive ? 'text-[var(--glow)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right Controls: Global Kelvin Slider + Physical Light-Switch Toggle + Inquiry Basket */}
        <div className="flex items-center gap-3">
          {/* Global Kelvin Slider Pill */}
          <div className="relative">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
              <button
                type="button"
                onClick={() => setKelvinPopoverOpen((o) => !o)}
                className="flex items-center gap-1.5 text-left"
                title="Adjust global color temperature (1600K - 12000K)"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors duration-200"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: `0 0 8px ${color.hex}`,
                  }}
                />
                <span className="font-mono text-xs font-medium tabular-nums">
                  {kelvin}K
                </span>
              </button>
              <input
                type="range"
                min={1600}
                max={12000}
                step={100}
                value={kelvin}
                onChange={(e) => setKelvin(Number(e.target.value))}
                aria-label="Global Kelvin Color Temperature"
                className="w-20 sm:w-28 h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  background:
                    'linear-gradient(90deg, #FF7800 0%, #FFB46B 18%, #FFD9A0 30%, #FFF4E8 48%, #E3EEFF 72%, #9EC2FF 100%)',
                }}
              />
              <button
                type="button"
                onClick={() => setKelvinPopoverOpen((o) => !o)}
                className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hidden sm:inline"
              >
                CCT
              </button>
            </div>

            {kelvinPopoverOpen && (
              <div className="absolute right-0 mt-2 w-72 p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] shadow-2xl z-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-[var(--text-secondary)]">
                    LIVE PHOTOMETRIC CCT
                  </span>
                  <span className="font-mono text-xs font-semibold" style={{ color: color.hex }}>
                    {kelvin}K · {color.label}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mb-3">
                  Simulates TYRIA’s full spectrum range (including R40 1600K–12000K series) across all cross-sections and scenes.
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {KELVIN_PRESETS.map((preset) => {
                    const active = Math.abs(kelvin - preset.kelvin) < 150;
                    return (
                      <button
                        key={preset.kelvin}
                        type="button"
                        onClick={() => {
                          setKelvin(preset.kelvin);
                          setKelvinPopoverOpen(false);
                        }}
                        className={`px-2 py-1.5 text-left border font-mono text-[11px] transition-all ${
                          active
                            ? 'border-[#1E6FD9] bg-[#1E6FD9]/15 text-[var(--text-primary)]'
                            : 'border-[var(--border-hairline)] hover:border-white/25 text-[var(--text-secondary)]'
                        }`}
                      >
                        <div className="font-semibold">{preset.short}</div>
                        <div className="text-[9px] opacity-75">{preset.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Physical Rocker Switch Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Wall Switch: ${theme === 'dark' ? 'Darkroom Mode' : 'Daylight Studio Mode'}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-white/25 transition-all font-mono text-xs"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--glow)]" />
                <span className="hidden md:inline text-[11px]">DARK</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#1E6FD9]" />
                <span className="hidden md:inline text-[11px]">LIGHT</span>
              </>
            )}
          </button>

          {/* Inquiry Basket Trigger */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-mono text-xs font-medium transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inquiry</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-black/25 text-[11px] tabular-nums">
              {totalItems}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="xl:hidden p-2 rounded-sm border border-[var(--border-hairline)] text-[var(--text-primary)]"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[var(--bg-elevated)] border-b border-[var(--border-hairline)] px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 font-medium text-sm">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              All Products
            </Link>
            <Link to="/products/neon-flex/atlas" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--glow)]" /> Profile Atlas
            </Link>
            <Link to="/spec-finder" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              Spec Finder
            </Link>
            <Link to="/applications" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              Applications
            </Link>
            <Link to="/designer-hub" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              Designer Hub (IES)
            </Link>
            <Link to="/factory" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              Factory & Lab
            </Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              About Tyria
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[var(--glow)]">
              Contact / Samples
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
