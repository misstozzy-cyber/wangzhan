import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeftRight, Plus, Download } from 'lucide-react';
import { useInquiry } from '../../context/InquiryContext';
import { Product } from '../../types/product';
import { ProfileCrossSectionSVG } from '../products/ProfileCrossSectionSVG';

interface CompareDrawerProps {
  products: Product[];
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({ products }) => {
  const { compareIds, toggleCompare, clearCompare, addItem } = useInquiry();
  const [expanded, setExpanded] = useState(false);

  const selected = products.filter((p) => compareIds.includes(p.id));
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-elevated)] border-t border-[#111111]/50 shadow-2xl">
      {/* Compact Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#111111]">
            <ArrowLeftRight className="w-4 h-4" />
            <span>COMPARE ({selected.length}/4)</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {selected.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-2.5 py-1 bg-[var(--bg-primary)] border border-[var(--border-hairline)] text-xs font-mono"
              >
                <span className="text-[var(--text-primary)]">{p.model}</span>
                <button
                  type="button"
                  onClick={() => toggleCompare(p.id)}
                  className="text-[var(--text-muted)] hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clearCompare}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="px-4 py-1.5 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold"
          >
            {expanded ? 'Hide Comparison Table' : 'Compare Side-by-Side ↑'}
          </button>
        </div>
      </div>

      {/* Expanded Side-by-Side Matrix */}
      {expanded && (
        <div className="border-t border-[var(--border-hairline)] bg-[var(--bg-primary)] max-h-[70vh] overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[var(--border-hairline)]">
                  <th className="py-3 pr-4 text-[var(--text-muted)] w-44">PARAMETER</th>
                  {selected.map((p) => (
                    <th key={p.id} className="py-3 px-4 min-w-[210px]">
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/product/${p.id}`}
                          className="font-display font-medium text-sm text-[var(--text-primary)] hover:text-[var(--text-primary)]"
                        >
                          {p.model}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleCompare(p.id)}
                          className="text-[var(--text-muted)] hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-[11px] text-[#111111] mt-0.5">{p.itemNo}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-hairline)]">
                <tr>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">1:1 Cross-Section</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-3 px-4">
                      <ProfileCrossSectionSVG
                        w={p.size.w}
                        h={p.size.h}
                        view={p.view}
                        scale={3.2}
                      />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Family / Series</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.family} · {p.series}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Dimensions (W×H)</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.size.w} × {p.size.h} mm ({p.view})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Power Options</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.wattOptions.map((w) => `${w}W`).join(' / ')} /m
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Voltage</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.voltage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Min. Bend Diameter</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      ≥ {p.minBendDiameter} mm (R {p.minBendRadius} mm)
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">CRI & Consistency</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.cri} · {p.sdcm}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">IP Protection</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      {p.ip}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-[var(--text-muted)]">Cut Increment & Max Run</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-2.5 px-4 text-[var(--text-primary)]">
                      Cut: {p.cutUnit} · Max Run: {p.maxRun}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-[var(--text-muted)]">Actions</td>
                  {selected.map((p) => (
                    <td key={p.id} className="py-3 px-4 space-x-2">
                      <button
                        type="button"
                        onClick={() => addItem(p)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#111111] text-white text-[11px]"
                      >
                        <Plus className="w-3 h-3" /> Inquiry
                      </button>
                      <a
                        href={p.downloads.datasheet}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 border border-[var(--border-hairline)] text-[11px]"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
