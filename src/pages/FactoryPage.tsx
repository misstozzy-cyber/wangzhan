import React, { useState } from 'react';
import {
  ShieldCheck,
  MapPin,
  ZoomIn,
  X,
  CheckCircle2,
  Cpu,
  Layers,
  Activity,
  Award,
} from 'lucide-react';
import { FactoryAsset } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';

interface FactoryPageProps {
  factoryAssets: FactoryAsset[];
  certificateAssets: FactoryAsset[];
}

const TIMELINE_STAGES = [
  {
    code: 'STEP 01',
    title: 'In-House SMD LED Packaging',
    subtitle: '1-Bin MacAdam (SDCM ≤ 3) & Ra ≥ 90/98 Control',
    desc: 'Unlike assembly-only workshops, TYRIA operates its own automated SMD encapsulation lines. Every batch is die-bonded, phosphor-dispensed, and sorted to a single chromaticity bin before entering SMT.',
  },
  {
    code: 'STEP 02',
    title: 'Automated High-Speed SMT Workshop',
    subtitle: '2oz / 3oz Rolled Copper FPC Assembly',
    desc: 'High-precision pick-and-place lines mount LEDs, constant-current ICs, and DMX512/SPI transceivers onto double-sided rolled copper PCBs with automated optical inspection (AOI).',
  },
  {
    code: 'STEP 03',
    title: '6 Silicone Co-Extrusion Lines',
    subtitle: 'Dow SILASTIC™ ET-7021 Optical Silicone',
    desc: 'Six dedicated horizontal and vertical vulcanization co-extrusion lines mold optical-grade Dow silicone around the light engine in a single pass — achieving shadow-free diffusion up to 30 meters per reel.',
  },
  {
    code: 'STEP 04',
    title: '100% Burn-In & Environmental Stress',
    subtitle: 'IPX8 Pressurized Tank · Salt Spray · UV Weathering',
    desc: 'Every production batch undergoes 8–24 hours of full-load thermal burn-in alongside destructive sampling in our IPX8 pressurized immersion tank, salt-mist chamber, and UV aging box.',
  },
  {
    code: 'STEP 05',
    title: 'IES Darkroom & Integrating Sphere Lab',
    subtitle: 'Goniophotometer .IES / .LDT & Spectral Verification',
    desc: 'Our in-house photometric darkroom measures full 3D luminous intensity distributions (.IES & .LDT), CRI/TM-30 fidelity, and lumen maintenance prior to anti-static vacuum packaging.',
  },
];

export const FactoryPage: React.FC<FactoryPageProps> = ({
  factoryAssets,
  certificateAssets,
}) => {
  const [lightboxAsset, setLightboxAsset] = useState<FactoryAsset | null>(null);

  const overviewPages = factoryAssets.slice(0, 4);
  const facilityPhotos = factoryAssets.slice(4);

  return (
    <div className="min-h-screen py-12 bg-[var(--bg-primary)]">
      <SEOHead
        title="Factory, CNAS-Grade Photometric Lab & Certifications"
        description="Explore TYRIA Lighting's 11,000 m² dual Shenzhen manufacturing bases, 6 Dow silicone co-extrusion lines, in-house SMD packaging, IES goniophotometer lab, and ISO/ETL/TUV/CE certifications."
        canonicalPath="/factory"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-20">
        {/* Top Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-8 border-b border-[var(--border-hairline)]">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight text-[var(--text-primary)]">
              From LED Chip to Co-Extruded Reel
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-[68ch] leading-relaxed">
              Founded in 2012, TYRIA LIGHTING operates <span className="font-mono text-[var(--text-primary)]">11,000 m²</span> across two specialized Shenzhen factories with <span className="font-mono text-[var(--text-primary)]">260 employees</span> and <span className="font-mono text-[var(--text-primary)]">15 R&D engineers</span> (10+ years experience in optical structure, material science, and DMX/SPI control).
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
              <span className="text-[10px] text-[var(--text-muted)] block">WORKSHOP AREA</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">11,000 m²</span>
              <span className="text-[10px] text-[#111111] block mt-0.5">2 Shenzhen Bases</span>
            </div>
            <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]">
              <span className="text-[10px] text-[var(--text-muted)] block">NEON EXTRUSION</span>
              <span className="text-xl font-bold text-[var(--text-primary)]">6 Lines</span>
              <span className="text-[10px] text-[var(--text-primary)] block mt-0.5">Dow SILASTIC™</span>
            </div>
          </div>
        </div>

        {/* 1. Horizontal Scroll-Snapping Timeline: From Chip to Reel */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-[var(--text-primary)]">
              5-Stage Vertically Integrated Production
            </h2>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              ISO 9001 · ISO 14001 · ISO 45001 CERTIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {TIMELINE_STAGES.map((stage, idx) => {
              const stagePhotoOffsets = [5, 18, 15, 8, 12];
              const photo =
                facilityPhotos[stagePhotoOffsets[idx]] ||
                facilityPhotos[idx + 5] ||
                overviewPages[idx % overviewPages.length];
              return (
                <div
                  key={stage.code}
                  className="bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col justify-between overflow-hidden"
                >
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setLightboxAsset(photo)}
                      className="relative h-44 bg-[#07080B] overflow-hidden border-b border-[var(--border-hairline)] group text-left"
                    >
                      <img
                        src={photo.image}
                        alt={stage.title}
                        loading="lazy"
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                      <span className="absolute bottom-2 right-2 p-1.5 bg-black/70 text-white">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-mono text-xs font-bold text-[#111111]">
                        {stage.code}
                      </div>
                      <h3 className="font-display font-medium text-base text-[var(--text-primary)] mt-1">
                        {stage.title}
                      </h3>
                      <div className="font-mono text-[11px] text-[var(--text-primary)] mt-0.5">
                        {stage.subtitle}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. In-House Laboratory & Workshop Gallery (Extracted from Official Catalogue) */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-hairline)]">
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-[var(--text-primary)]">
              In-House Reliability & Photometric Testing Laboratory
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-[66ch]">
              Click any facility photograph below to inspect our testing chambers, goniophotometer darkroom, and automated workshops.
            </p>
          </div>

          {/* 4 Full-Page Catalogue Sheets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewPages.map((sheet) => (
              <button
                key={sheet.id}
                type="button"
                onClick={() => setLightboxAsset(sheet)}
                className="group bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-3 text-left space-y-2 hover:border-[var(--text-primary)] transition-all"
              >
                <div className="h-56 bg-[#07080B] overflow-hidden relative">
                  <img
                    src={sheet.image}
                    alt={sheet.title}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 font-mono text-[10px] text-white flex items-center gap-1">
                    <ZoomIn className="w-3 h-3" /> Zoom Sheet
                  </span>
                </div>
                <div className="font-mono text-xs font-medium text-[var(--text-primary)]">
                  {sheet.title}
                </div>
              </button>
            ))}
          </div>

          {/* Individual Facility & Lab Equipment Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {facilityPhotos.slice(0, 18).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxAsset(item)}
                className="group bg-[var(--bg-elevated)] border border-[var(--border-hairline)] overflow-hidden text-left hover:border-[#111111] transition-all"
              >
                <div className="h-32 bg-[#07080B] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all"
                  />
                </div>
                <div className="p-2.5 font-mono text-[10px] text-[var(--text-primary)] truncate">
                  {item.title}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. International Certifications Wall */}
        <section className="space-y-6 pt-8 border-t border-[var(--border-hairline)]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-medium text-2xl sm:text-3xl text-[var(--text-primary)] flex items-center gap-2">
                <Award className="w-6 h-6 text-[#111111]" />
                <span>International Compliance & Quality Certifications</span>
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Qualified to ISO 9001:2015, ISO 14001, ISO 45001:2018, ETL, TUV-CE, UKCA, RCM, RoHS 2.0, LM-80, and ErP standards. Click any certificate to zoom.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {certificateAssets.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => setLightboxAsset(cert)}
                className="group p-3 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] hover:border-[var(--text-primary)] text-left flex flex-col justify-between gap-2 transition-all"
              >
                <div className="h-52 bg-[#07080B] flex items-center justify-center overflow-hidden relative p-2">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 p-1.5 bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[var(--text-primary)] font-medium truncate">
                  {cert.title}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Two Shenzhen Manufacturing Bases */}
        <section className="pt-8 border-t border-[var(--border-hairline)] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#111111]">
              <span className="flex items-center gap-1.5 font-semibold">
                <MapPin className="w-4 h-4" />
                FACTORY 1 (SHAJING HQ & SILICONE CO-EXTRUSION)
              </span>
              <span>BAO&apos;AN, SHENZHEN</span>
            </div>
            <h3 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Antonio Technology Park Base (F1)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              2F, D Building, Antonio Technology Park, Ma&apos;anshan Community, Shajing Street, Bao&apos;an District, Shenzhen, Guangdong, China
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-[var(--text-primary)] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>6 Silicone Neon Flex Co-Extrusion Production Lines</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>CNAS-Standard Photometric Darkroom & Integrating Sphere Lab</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Global Engineering Showroom & Sample Dispatch Center</span>
              </li>
            </ul>
          </div>

          <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-[#111111]">
              <span className="flex items-center gap-1.5 font-semibold">
                <MapPin className="w-4 h-4" />
                FACTORY 2 (SHIYAN SMD PACKAGING & SMT BASE)
              </span>
              <span>BAO&apos;AN, SHENZHEN</span>
            </div>
            <h3 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Shancheng Industrial Zone Base (F2)
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Shancheng Industrial Zone, Shiyan Town, Bao&apos;an District, Shenzhen, Guangdong, China
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-[var(--text-primary)] pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>In-House SMD LED Packaging & 1-Bin Sorting Workshop</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>High-Speed Automated SMT & COB Flip-Chip Encapsulation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>High-Volume LED Strip & Backlit LED Sheet Production</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {lightboxAsset && (
        <div
          onClick={() => setLightboxAsset(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[var(--bg-elevated)] border border-[var(--border-hairline)] p-4 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-2">
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                {lightboxAsset.title}
              </span>
              <button
                type="button"
                onClick={() => setLightboxAsset(null)}
                className="p-1 text-[var(--text-secondary)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-[#07080B] flex items-center justify-center max-h-[80vh] overflow-auto p-2">
              <img
                src={lightboxAsset.image}
                alt={lightboxAsset.title}
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
