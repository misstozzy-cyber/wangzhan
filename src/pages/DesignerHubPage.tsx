import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Download,
  FileText,
  Lock,
  Unlock,
  Search,
  FolderTree,
  CheckCircle2,
} from 'lucide-react';
import { Product, CatalogItem, PhotometricEntry } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { useInquiry } from '../context/InquiryContext';

interface DesignerHubPageProps {
  products: Product[];
  catalogs: CatalogItem[];
  iesLibrary: PhotometricEntry[];
}

export const DesignerHubPage: React.FC<DesignerHubPageProps> = ({
  products,
  catalogs,
  iesLibrary,
}) => {
  const { leadProfile, saveLeadProfile } = useInquiry();

  const [searchQuery, setSearchQuery] = useState('');
  const [cctFilter, setCctFilter] = useState('ALL');
  const [wattFilter, setWattFilter] = useState('ALL');
  const [seriesFilter, setSeriesFilter] = useState('ALL');

  const [gateModalOpen, setGateModalOpen] = useState(false);
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: '',
    company: '',
    email: '',
  });

  const seriesOptions = useMemo(() => {
    const set = new Set<string>();
    iesLibrary.forEach((item) => {
      if (item.series) set.add(item.series);
    });
    return Array.from(set);
  }, [iesLibrary]);

  const filteredIes = useMemo(() => {
    return iesLibrary.filter((item) => {
      if (seriesFilter !== 'ALL' && item.series !== seriesFilter) return false;
      if (cctFilter !== 'ALL' && !item.cct.includes(cctFilter)) return false;
      if (wattFilter !== 'ALL' && !item.watt.includes(wattFilter)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${item.model} ${item.itemNo} ${item.label} ${item.cct} ${item.watt}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [iesLibrary, seriesFilter, cctFilter, wattFilter, searchQuery]);

  const handleGatedDownload = (url: string) => {
    if (leadProfile) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setPendingDownloadUrl(url);
    setGateModalOpen(true);
  };

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveLeadProfile(leadForm);
    setGateModalOpen(false);
    if (pendingDownloadUrl) {
      window.open(pendingDownloadUrl, '_blank', 'noopener,noreferrer');
      setPendingDownloadUrl(null);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <SEOHead
        title="Designer Hub — 259 IES / LDT Photometric Files & 2026 Catalogues"
        description="Download goniophotometer .IES and .LDT files, integrating sphere test reports, and official 2026 PDF specification manuals for TYRIA Silicone LED Neon Flex and LED Strips."
        canonicalPath="/designer-hub"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-14">
        {/* Top Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hairline)]">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Lighting Designer Photometric & Specification Hub
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[68ch]">
              Engineered for DIALux evo, Relux, and AGI32 lighting calculations. Access {iesLibrary.length} verified <span className="font-mono text-[var(--text-primary)]">.IES / .LDT</span> photometric packages, integrating sphere spectral reports, and all {products.length} datasheet PDFs.
            </p>
          </div>

          {/* Unlock Status Badge */}
          <div className="p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex items-center gap-3 font-mono text-xs shrink-0">
            {leadProfile ? (
              <>
                <Unlock className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-emerald-400 font-semibold">PHOTOMETRIC VAULT UNLOCKED</div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Registered to {leadProfile.name} ({leadProfile.company})
                  </div>
                </div>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[var(--glow)]" />
                <div>
                  <div className="text-[var(--text-primary)] font-semibold">
                    DATASHEETS: OPEN · IES/REPORTS: 1-CLICK UNLOCK
                  </div>
                  <button
                    type="button"
                    onClick={() => setGateModalOpen(true)}
                    className="text-[11px] text-[#1E6FD9] hover:underline"
                  >
                    Unlock All 380+ IES & Lab Reports Now →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 1: 6 Master 2026 Engineering Catalogues */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)]">
              2026 Master Product Catalogues (Direct PDF Download)
            </h2>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              NO REGISTRATION REQUIRED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogs.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between gap-4 glow-border-hover"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#1E6FD9]">
                    <span>{cat.category.toUpperCase()}</span>
                    <span>{cat.pages} PAGES</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">{cat.highlight}</p>
                </div>

                <a
                  href={cat.url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-4 bg-[var(--bg-primary)] hover:bg-[#1E6FD9] hover:text-white border border-[var(--border-hairline)] font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open / Download Master PDF</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Searchable Photometric IES / LDT & Test Report Vault */}
        <section className="space-y-6 pt-6 border-t border-[var(--border-hairline)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[var(--text-primary)] flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#1E6FD9]" />
                <span>Photometric IES / LDT & Integrating Sphere Vault ({filteredIes.length} Sets)</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                Filter photometric distribution files by Series, Correlated Color Temperature (CCT), and Wattage per meter.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model (e.g. 1617, 1220, R25, 3000K)..."
                className="w-full pl-9 pr-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
              />
            </div>

            <select
              value={seriesFilter}
              onChange={(e) => setSeriesFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            >
              <option value="ALL">All Neon & Linear Series</option>
              {seriesOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={cctFilter}
              onChange={(e) => setCctFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            >
              <option value="ALL">All Color Temperatures (CCT)</option>
              <option value="2700">2700K Warm White</option>
              <option value="3000">3000K Soft White</option>
              <option value="3500">3500K Neutral Warm</option>
              <option value="4000">4000K Natural White</option>
              <option value="5000">5000K Daylight</option>
              <option value="6500">6500K Cool Daylight</option>
              <option value="RGB">RGB / RGBW</option>
            </select>

            <select
              value={wattFilter}
              onChange={(e) => setWattFilter(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            >
              <option value="ALL">All Wattages (W/m)</option>
              <option value="5W">5W/m</option>
              <option value="10W">10W/m</option>
              <option value="12W">12W/m</option>
              <option value="15W">15W/m</option>
              <option value="18W">18W/m</option>
            </select>
          </div>

          {/* IES Table */}
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-x-auto max-h-[640px]">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="sticky top-0 bg-[var(--bg-surface)] border-b border-[var(--border-hairline)] text-[11px] text-[var(--text-muted)]">
                <tr>
                  <th className="py-3 px-4">MODEL / SERIES</th>
                  <th className="py-3 px-4">PHOTOMETRIC TEST ID</th>
                  <th className="py-3 px-4">CCT</th>
                  <th className="py-3 px-4">POWER</th>
                  <th className="py-3 px-4 text-right">DOWNLOAD ASSETS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                {filteredIes.map((entry, idx) => {
                  const ldtUrl = entry.url.replace(/_IESNA2002\.IES$/i, '.ldt').replace(/\.ies$/i, '.ldt');
                  const repUrl = entry.url.replace(/_IESNA2002\.IES$/i, '-EN.pdf').replace(/\.ies$/i, '-EN.pdf');
                  return (
                    <tr key={`${entry.filename}-${idx}`} className="hover:bg-[var(--bg-primary)]">
                      <td className="py-2.5 px-4">
                        <Link
                          to={`/product/${entry.productId}`}
                          className="font-display font-bold text-xs text-[var(--text-primary)] hover:text-[var(--glow)] block"
                        >
                          {entry.model}
                        </Link>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {entry.series} · {entry.itemNo}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[var(--text-primary)]">
                        {entry.label}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--glow)]">
                          {entry.cct}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[var(--text-secondary)]">
                        {entry.watt}
                      </td>
                      <td className="py-2.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleGatedDownload(entry.url)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1E6FD9] hover:bg-[#185EC0] text-white text-[11px]"
                        >
                          <Download className="w-3 h-3" /> .IES
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGatedDownload(ldtUrl)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[var(--border-hairline)] hover:border-white/30 text-[11px]"
                        >
                          <Download className="w-3 h-3" /> .LDT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGatedDownload(repUrl)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 border border-[var(--border-hairline)] hover:border-white/30 text-[var(--text-secondary)] text-[11px]"
                        >
                          <FileText className="w-3 h-3" /> Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Light Gate Modal (One-Time Studio Registration stored in localStorage) */}
      {gateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <div className="font-mono text-xs text-[#1E6FD9] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>ONE-TIME DESIGNER UNLOCK</span>
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)]">
                Unlock All 380+ IES, LDT & Lab Reports
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Enter your studio credentials once to unlock instant, unlimited downloads across all TYRIA photometric files and integrating sphere reports.
              </p>
            </div>

            <form onSubmit={handleGateSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                  YOUR NAME *
                </label>
                <input
                  required
                  type="text"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                  LIGHTING DESIGN STUDIO / COMPANY *
                </label>
                <input
                  required
                  type="text"
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  placeholder="e.g. Studio Lux Architecture"
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-1">
                  WORK EMAIL *
                </label>
                <input
                  required
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="elena@studiolux.com"
                  className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setGateModalOpen(false)}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-semibold"
                >
                  Unlock & Download Now →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
