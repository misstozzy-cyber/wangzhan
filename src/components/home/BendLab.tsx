import React, { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, RotateCcw, Move, ArrowUpRight } from 'lucide-react';
import { Product } from '../../types/product';
import { useGlow } from '../../context/GlowContext';

interface BendLabProps {
  products: Product[];
}

interface Point {
  x: number;
  y: number;
}

const DEFAULT_POINTS: Record<'TV' | 'SV' | '3D', [Point, Point, Point, Point]> = {
  TV: [
    { x: 70, y: 210 },
    { x: 210, y: 65 },
    { x: 390, y: 275 },
    { x: 550, y: 140 },
  ],
  SV: [
    { x: 70, y: 175 },
    { x: 220, y: 40 },
    { x: 400, y: 310 },
    { x: 550, y: 175 },
  ],
  '3D': [
    { x: 75, y: 245 },
    { x: 195, y: 55 },
    { x: 415, y: 75 },
    { x: 545, y: 255 },
  ],
};

/**
 * Evaluates minimum radius of curvature along a cubic Bézier curve P0..P3
 * using R(t) = ((x'^2 + y'^2)^(3/2)) / |x'y'' - y'x''|
 * Scale factor: 1 SVG unit = 0.65 mm
 */
function computeMinCurvatureRadiusMm(pts: [Point, Point, Point, Point]): {
  minRadiusMm: number;
  tightestPoint: Point;
} {
  const [p0, p1, p2, p3] = pts;
  const MM_PER_PX = 0.65;
  let minR = 9999;
  let bestPt: Point = { x: (p0.x + p3.x) / 2, y: (p0.y + p3.y) / 2 };

  for (let i = 1; i < 60; i++) {
    const t = i / 60;
    const mt = 1 - t;

    // Position B(t)
    const bx =
      mt * mt * mt * p0.x +
      3 * mt * mt * t * p1.x +
      3 * mt * t * t * p2.x +
      t * t * t * p3.x;
    const by =
      mt * mt * mt * p0.y +
      3 * mt * mt * t * p1.y +
      3 * mt * t * t * p2.y +
      t * t * t * p3.y;

    // First derivative B'(t)
    const dx =
      3 * mt * mt * (p1.x - p0.x) +
      6 * mt * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x);
    const dy =
      3 * mt * mt * (p1.y - p0.y) +
      6 * mt * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y);

    // Second derivative B''(t)
    const ddx = 6 * mt * (p2.x - 2 * p1.x + p0.x) + 6 * t * (p3.x - 2 * p2.x + p1.x);
    const ddy = 6 * mt * (p2.y - 2 * p1.y + p0.y) + 6 * t * (p3.y - 2 * p2.y + p1.y);

    const num = Math.pow(dx * dx + dy * dy, 1.5);
    const den = Math.abs(dx * ddy - dy * ddx);
    if (den > 1e-4) {
      const rPx = num / den;
      const rMm = rPx * MM_PER_PX;
      if (rMm < minR) {
        minR = rMm;
        bestPt = { x: bx, y: by };
      }
    }
  }

  return {
    minRadiusMm: Math.max(12, Math.round(minR)),
    tightestPoint: bestPt,
  };
}

export const BendLab: React.FC<BendLabProps> = ({ products }) => {
  const { color } = useGlow();
  const svgRef = useRef<SVGSVGElement>(null);

  const neonModels = useMemo(() => {
    return products.filter((p) => p.familySlug === 'neon-flex').slice(0, 30);
  }, [products]);

  const [bendMode, setBendMode] = useState<'TV' | 'SV' | '3D'>('TV');
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    const tv1617 = neonModels.find((m) => m.model.includes('1617 TV'));
    return tv1617 ? tv1617.id : neonModels[0]?.id || '';
  });

  const [points, setPoints] = useState<[Point, Point, Point, Point]>(DEFAULT_POINTS.TV);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const selectedModel =
    neonModels.find((m) => m.id === selectedModelId) ||
    neonModels[0] || {
      id: 'neon-1617',
      model: '1617 TV',
      itemNo: 'TY-NT1617V24Px-Cx',
      view: 'TV',
      size: { w: 16, h: 17 },
      minBendRadius: 100,
      minBendDiameter: 200,
    };

  const { minRadiusMm, tightestPoint } = useMemo(
    () => computeMinCurvatureRadiusMm(points),
    [points]
  );

  const isOverbent = minRadiusMm < selectedModel.minBendRadius;

  const handleModeSwitch = (mode: 'TV' | 'SV' | '3D') => {
    setBendMode(mode);
    setPoints(DEFAULT_POINTS[mode]);
    // Auto-pick a matching model for this view mode
    const candidate = neonModels.find((m) => m.view === mode);
    if (candidate) setSelectedModelId(candidate.id);
  };

  const updatePointFromEvent = (clientX: number, clientY: number, idx: number) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(590, ((clientX - rect.left) / rect.width) * 620));
    const y = Math.max(30, Math.min(310, ((clientY - rect.top) / rect.height) * 340));
    setPoints((prev) => {
      const next = [...prev] as [Point, Point, Point, Point];
      next[idx] = { x, y };
      return next;
    });
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIdx === null) return;
    updatePointFromEvent(e.clientX, e.clientY, draggingIdx);
  };

  const pathData = `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x} ${points[3].y}`;

  return (
    <section className="py-20 border-b border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        {/* Top Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
              Interactive Bend Radius Laboratory
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 max-w-[66ch]">
              Choosing between Top View (TV), Side View (SV), and 3D Dual-Bend is the #1 engineering question on architectural facades. Drag the control nodes below to test real curvature limits against internal PCB stress thresholds.
            </p>
          </div>

          {/* Bend Axis Tabs */}
          <div className="inline-flex border border-[var(--border-hairline)] bg-[var(--bg-primary)] p-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => handleModeSwitch('TV')}
              className={`px-3.5 py-2 transition-colors ${
                bendMode === 'TV'
                  ? 'bg-[#1E6FD9] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Top View (Vertical Bend)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('SV')}
              className={`px-3.5 py-2 transition-colors ${
                bendMode === 'SV'
                  ? 'bg-[#1E6FD9] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Side View (Horizontal Bend)
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('3D')}
              className={`px-3.5 py-2 transition-colors ${
                bendMode === '3D'
                  ? 'bg-[#1E6FD9] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              3D (Omnidirectional)
            </button>
          </div>
        </div>

        {/* Main 12-Col Lab Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Interactive Bézier Canvas (8 cols) */}
          <div className="lg:col-span-8 bg-[#07080B] border border-[var(--border-hairline)] p-5 sm:p-6 flex flex-col justify-between relative">
            {/* Top Canvas Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2">
                {isOverbent ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/15 border border-red-500/50 text-red-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    TOO TIGHT — MIN. RADIUS {selectedModel.minBendRadius}mm (Ø{selectedModel.minBendDiameter}mm) FOR {selectedModel.model}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    SAFE BENDING GEOMETRY · CURRENT MIN. R = {minRadiusMm}mm ≥ {selectedModel.minBendRadius}mm
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setPoints(DEFAULT_POINTS[bendMode])}
                className="inline-flex items-center gap-1 text-[#949BA8] hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Curve</span>
              </button>
            </div>

            {/* Interactive SVG Canvas */}
            <svg
              ref={svgRef}
              viewBox="0 0 620 340"
              onPointerMove={handlePointerMove}
              onPointerUp={() => setDraggingIdx(null)}
              onPointerLeave={() => setDraggingIdx(null)}
              className="w-full h-auto my-2 touch-none select-none cursor-crosshair"
            >
              {/* Technical Millimeter Grid */}
              <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`v-${i}`} x1={i * 55} y1={0} x2={i * 55} y2={340} />
                ))}
                {Array.from({ length: 7 }).map((_, i) => (
                  <line key={`h-${i}`} x1={0} y1={i * 55} x2={620} y2={i * 55} />
                ))}
              </g>

              {/* Bézier Control Handle Lines */}
              <line
                x1={points[0].x}
                y1={points[0].y}
                x2={points[1].x}
                y2={points[1].y}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 4"
              />
              <line
                x1={points[3].x}
                y1={points[3].y}
                x2={points[2].x}
                y2={points[2].y}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 4"
              />

              {/* Silicone Housing Outer Tube */}
              <path
                d={pathData}
                fill="none"
                stroke={isOverbent ? '#451A1A' : '#1E2430'}
                strokeWidth="18"
                strokeLinecap="round"
              />

              {/* Glowing Emitting Neon Surface */}
              <path
                d={pathData}
                fill="none"
                stroke={isOverbent ? '#EF4444' : 'var(--glow)'}
                strokeWidth={bendMode === 'SV' ? '7' : '11'}
                strokeLinecap="round"
                style={{
                  filter: isOverbent
                    ? 'drop-shadow(0 0 10px rgba(239,68,68,0.85))'
                    : `drop-shadow(0 0 8px var(--glow)) drop-shadow(0 0 20px rgba(${color.rgbString}, 0.65))`,
                }}
              />

              {/* Minimum Radius Caliper Circle at Tightest Vertex */}
              <g>
                <circle
                  cx={tightestPoint.x}
                  cy={tightestPoint.y}
                  r={Math.min(95, Math.max(16, minRadiusMm / 2.2))}
                  fill="none"
                  stroke={isOverbent ? '#EF4444' : '#1E6FD9'}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={tightestPoint.x}
                  y={tightestPoint.y - 10}
                  textAnchor="middle"
                  className="font-mono text-[11px] font-bold"
                  fill={isOverbent ? '#F87171' : '#93C5FD'}
                >
                  R = {minRadiusMm}mm
                </text>
              </g>

              {/* Draggable Control Nodes */}
              {points.map((pt, idx) => (
                <g
                  key={idx}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    setDraggingIdx(idx);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={13}
                    fill="#0D0F14"
                    stroke={draggingIdx === idx ? 'var(--glow)' : '#1E6FD9'}
                    strokeWidth={2}
                  />
                  <text
                    x={pt.x}
                    y={pt.y + 3.5}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-white pointer-events-none"
                  >
                    P{idx + 1}
                  </text>
                </g>
              ))}
            </svg>

            {/* Bottom Instruction Bar */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#949BA8]">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#1E6FD9]" />
                DRAG CONTROL NODES P1–P4 TO SIMULATE ON-SITE CURVATURE
              </span>
              <span>
                BEND PLANE:{' '}
                {bendMode === 'TV'
                  ? 'PERPENDICULAR TO LUMINOUS SURFACE'
                  : bendMode === 'SV'
                  ? 'PARALLEL TO LUMINOUS SURFACE'
                  : 'DUAL-AXIS X + Y ORGANIC CURVE'}
              </span>
            </div>
          </div>

          {/* Right Engineering Specification & Selection Guide (4 cols) */}
          <div className="lg:col-span-4 p-6 bg-[var(--bg-primary)] border border-[var(--border-hairline)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-[var(--text-muted)] mb-1.5">
                  SELECT TYRIA NEON MODEL TO TEST
                </label>
                <select
                  value={selectedModel.id}
                  onChange={(e) => setSelectedModelId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] font-mono text-xs text-[var(--text-primary)]"
                >
                  {neonModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.model} ({m.size.w}×{m.size.h}mm · Min R={m.minBendRadius}mm / Ø{m.minBendDiameter}mm)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">CURRENT CURVE R</span>
                  <span
                    className={`text-base font-bold ${
                      isOverbent ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    {minRadiusMm} mm
                  </span>
                </div>
                <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
                  <span className="text-[10px] text-[var(--text-muted)] block">RATED MIN. RADIUS</span>
                  <span className="text-base font-bold text-[var(--text-primary)]">
                    {selectedModel.minBendRadius} mm (Ø{selectedModel.minBendDiameter})
                  </span>
                </div>
              </div>

              {/* Engineering Guide Box */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-hairline)] text-xs">
                <div className="font-display font-semibold text-sm text-[var(--text-primary)]">
                  How to Choose the Right Bending Orientation
                </div>
                <div className="space-y-2 text-[var(--text-secondary)]">
                  <p>
                    <strong className="text-[var(--text-primary)] font-mono">1. Top View (TV):</strong>{' '}
                    Bends up and down (like a bridge arch or undulating ceiling wave). Never twist laterally.
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)] font-mono">2. Side View (SV):</strong>{' '}
                    Bends left and right on a flat plane — ideal for architectural letters, circular coves, and curved wall contours.
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)] font-mono">3. 3D Dual-Bend:</strong>{' '}
                    Specially engineered internal FPC folds simultaneously across both X and Y axes for spiral columns and freeform sculptures.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to={`/product/${selectedModel.id}`}
              className="w-full py-3 px-4 bg-[#1E6FD9] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect {selectedModel.model} Datasheet & IES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
