import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Download,
  ArrowUpDown,
  FileText,
  Plus,
  ArrowLeftRight,
  RotateCcw,
} from 'lucide-react';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileCrossSectionSVG } from '../components/products/ProfileCrossSectionSVG';
import { useInquiry } from '../context/InquiryContext';

interface SpecFinderPageProps {
  products: Product[];
}

type SortKey = 'model' | 'width' | 'height' | 'watt' | 'efficacy' | 'bend';

export const SpecFinderPage: React.FC<SpecFinderPageProps> = ({ products }) => {
  const { addItem, compareIds, toggleCompare } = useInquiry();

  const [query, setQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState('ALL');
  const [viewFilter, setViewFilter] = useState('ALL');
  const [voltageFilter, setVoltageFilter] = useState('ALL');
  const [ipFilter, setIpFilter] = useState('ALL');
  const [controlFilter, setControlFilter] = useState('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('width');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredAndSorted = useMemo(() => {
    const list = products.filter((p) => {
      if (familyFilter !== 'ALL' && p.familySlug !== familyFilter) return false;
      if (viewFilter !== 'ALL' && p.view !== viewFilter) return false;
      if (voltageFilter !== 'ALL' && !p.voltage.includes(voltageFilter)) return false;
      if (ipFilter !== 'ALL' && !p.ip.includes(ipFilter)) return false;
      if (
        controlFilter !== 'ALL' &&
        !p.controls.some((c) => c.toLowerCase().includes(controlFilter.toLowerCase()))
      ) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.model} ${p.itemNo} ${p.series} ${p.family} ${p.ledType} ${p.cctOptions.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'model') cmp = a.model.localeCompare(b.model);
      else if (sortKey === 'width') cmp = a.size.w - b.size.w;
      else if (sortKey === 'height') cmp = a.size.h - b.size.h;
      else if (sortKey === 'watt') cmp = Math.max(...a.wattOptions) - Math.max(...b.wattOptions);
      else if (sortKey === 'efficacy') cmp = a.efficacy - b.efficacy;
      else if (sortKey === 'bend') cmp = a.minBendRadius - b.minBendRadius;
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [
    products,
    query,
    familyFilter,
    viewFilter,
    voltageFilter,
    ipFilter,
    controlFilter,
    sortKey,
    sortAsc,
  ]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Model',
      'Part Number',
      'Family',
      'Series',
      'View',
      'Width (mm)',
      'Height (mm)',
      'Voltage',
      'Wattage Options (W/m)',
      'Max Lumen (lm/m)',
      'Efficacy (lm/W)',
      'CRI',
      'IP Rating',
      'Min Bend Radius (mm)',
      'Min Bend Diameter (mm)',
      'Cut Unit',
      'Max Run',
      'Controls',
      'Warranty',
    ];
    const rows = filteredAndSorted.map((p) => [
      `"${p.model}"`,
      `"${p.itemNo}"`,
      `"${p.family}"`,
      `"${p.series}"`,
      `"${p.view}"`,
      p.size.w,
      p.size.h,
      `"${p.voltage}"`,
      `"${p.wattOptions.join('/')}"`,
      p.maxLumen,
      p.efficacy,
      `"${p.cri}"`,
      `"${p.ip}"`,
      p.minBendRadius,
      p.minBendDiameter,
      `"${p.cutUnit}"`,
      `"${p.maxRun}"`,
      `"${p.controls.join('; ')}"`,
      `"${p.warranty}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TYRIA_Lighting_Specifications_${filteredAndSorted.length}_Models.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setQuery('');
    setFamilyFilter('ALL');
    setViewFilter('ALL');
    setVoltageFilter('ALL');
    setIpFilter('ALL');
    setControlFilter('ALL');
  };

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <SEOHead
        title="Spec Finder — Parametric LED Neon Flex & Strip Database"
        description="Filter, sort, compare, and export CSV specifications across all 115+ TYRIA Lighting silicone LED neon flex, COB strip, high-efficiency strip, and wall grazer models."
        canonicalPath="/spec-finder"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[var(--border-hairline)]">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Spec Finder — Engineering Parameter Database
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-[68ch]">
              High-density parametric matrix of all {products.length} TYRIA models. Select up to 4 models to compare side-by-side in the bottom drawer or export your filtered schedule directly to CSV for lighting schedules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetAll}
              className="px-3.5 py-2.5 border border-[var(--border-hairline)] bg-[var(--bg-elevated)] font-mono text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV ({filteredAndSorted.length} Models)</span>
            </button>
          </div>
        </div>

        {/* Multi-Filter Control Bar */}
        <div className="p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Part No, dimension, IC (e.g. TY-NT1617, UCS512, 48V)..."
              className="w-full pl-9 pr-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
            />
          </div>

          <select
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            <option value="ALL">Family: All ({products.length})</option>
            <option value="neon-flex">LED Neon Flex</option>
            <option value="led-strip">LED Strip</option>
            <option value="wall-grazer">Flexible Wall Grazer</option>
            <option value="led-sheet">Flex LED Sheet</option>
          </select>

          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            <option value="ALL">View: All Geometries</option>
            <option value="TV">Top View (TV)</option>
            <option value="SV">Side View (SV)</option>
            <option value="360">360° Round</option>
            <option value="3D">3D Dual-Bend</option>
            <option value="Dome">Dome</option>
            <option value="Dual">Dual-Side</option>
            <option value="Embedded">Embedded</option>
            <option value="Anti-Glare">Anti-Glare UGR&lt;19</option>
            <option value="COB">COB Dot-Free</option>
          </select>

          <select
            value={voltageFilter}
            onChange={(e) => setVoltageFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            <option value="ALL">Voltage: All</option>
            <option value="24V">DC24V</option>
            <option value="12V">DC12V</option>
            <option value="48V">DC48V (60m Run)</option>
            <option value="AC230V">AC230V Driverless</option>
          </select>

          <select
            value={ipFilter}
            onChange={(e) => setIpFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-[var(--text-primary)]"
          >
            <option value="ALL">IP Rating: All</option>
            <option value="IP68">IP68 Submersible</option>
            <option value="IP67">IP67 Outdoor</option>
            <option value="IP65">IP65 Damp</option>
            <option value="IP20">IP20 Indoor</option>
          </select>
        </div>

        {/* High-Density Engineering Table */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)] text-[var(--text-muted)] text-[11px]">
                <th className="py-3.5 px-3 w-10 text-center">CMP</th>
                <th className="py-3.5 px-3">SECTION</th>
                <th className="py-3.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('model')}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)]"
                  >
                    <span>MODEL / PART NO.</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">SERIES / VIEW</th>
                <th className="py-3.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('width')}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)]"
                  >
                    <span>W × H (MM)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('watt')}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)]"
                  >
                    <span>POWER (W/M)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">VOLTAGE</th>
                <th className="py-3.5 px-3">
                  <button
                    type="button"
                    onClick={() => handleSort('bend')}
                    className="flex items-center gap-1 hover:text-[var(--text-primary)]"
                  >
                    <span>MIN. BEND</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-3">CRI / IP</th>
                <th className="py-3.5 px-3 text-right">FILES & RFQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-hairline)]">
              {filteredAndSorted.map((p) => {
                const isSelected = compareIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors hover:bg-[var(--bg-primary)] ${
                      isSelected ? 'bg-[#1E6FD9]/10' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleCompare(p.id)}
                        className={`p-1.5 border ${
                          isSelected
                            ? 'border-[#1E6FD9] bg-[#1E6FD9] text-white'
                            : 'border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-white'
                        }`}
                        title="Toggle side-by-side comparison"
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                      </button>
                    </td>
                    <td className="py-2 px-3">
                      <ProfileCrossSectionSVG
                        w={p.size.w}
                        h={p.size.h}
                        view={p.view}
                        scale={2.0}
                        showDimensions={false}
                      />
                    </td>
                    <td className="py-2.5 px-3">
                      <Link
                        to={`/product/${p.id}`}
                        className="font-display font-bold text-sm text-[var(--text-primary)] hover:text-[var(--glow)] block"
                      >
                        {p.model}
                      </Link>
                      <span className="text-[11px] text-[#1E6FD9]">{p.itemNo}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-[var(--text-primary)]">{p.series}</div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {p.view} · {p.controls.slice(0, 2).join('/')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[var(--text-primary)] tabular-nums">
                      {p.size.w} × {p.size.h} mm
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-primary)] tabular-nums">
                      {p.wattOptions.join(' / ')} W
                    </td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)]">{p.voltage}</td>
                    <td className="py-2.5 px-3 text-[var(--text-secondary)] tabular-nums">
                      R{p.minBendRadius}mm (Ø{p.minBendDiameter})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[var(--text-primary)]">{p.ip}</span>
                      <span className="block text-[10px] text-[var(--text-muted)]">{p.cri}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1.5">
                      <a
                        href={p.downloads.datasheet}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[var(--bg-primary)] border border-[var(--border-hairline)] hover:border-white/30 text-[11px]"
                        title="Open Specification PDF"
                      >
                        <FileText className="w-3 h-3 text-[#1E6FD9]" /> PDF
                      </a>
                      <button
                        type="button"
                        onClick={() => addItem(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1E6FD9] hover:bg-[#185EC0] text-white text-[11px] font-semibold"
                      >
                        <Plus className="w-3 h-3" /> RFQ
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
