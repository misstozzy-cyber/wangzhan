import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Globe, Wrench } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-14 bg-[var(--bg-primary)]">
      <SEOHead
        title="About TYRIA LIGHTING — Specialized Linear Lighting Manufacturer Since 2012"
        description="Founded in 2012 in Shenzhen, TYRIA Lighting Technology Co., Ltd. is an ISO-certified manufacturer of silicone LED neon flex, high-efficacy LED strips, COB strips, and flexible wall grazers."
        canonicalPath="/about"
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-[var(--border-hairline)]">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="font-display font-medium text-3xl sm:text-5xl tracking-tight text-[var(--text-primary)]">
              Engineering Linear Light for Architectural Permanence
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[65ch]">
              Founded in 2012 in Shenzhen, <strong className="text-[var(--text-primary)]">TYRIA LIGHTING TECHNOLOGY CO., LIMITED</strong> has spent over a decade focused on a single discipline: precision flexible linear lighting for architectural facades, hospitality interiors, commercial workspaces, and submerged environments.
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-[65ch]">
              Rather than competing on commodity consumer tape lights, we built our reputation with lighting designers and engineering contractors by pairing <strong className="text-[var(--text-primary)]">Dow SILASTIC™ ET-7021 optical silicone co-extrusion</strong> and <strong className="text-[var(--text-primary)]">in-house 1-Bin SMD packaging</strong> with full goniophotometer <span className="font-mono text-[var(--text-primary)]">.IES / .LDT</span> documentation for every series.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-4 font-mono">
            {[
              { metric: '2012', label: 'Year Founded in Shenzhen' },
              { metric: '11,000 m²', label: 'Two Manufacturing Bases (F1 & F2)' },
              { metric: '260', label: 'Skilled Production & QC Staff' },
              { metric: '15', label: 'Senior R&D Optical Engineers' },
              { metric: '259+', label: 'Verified IES / LDT Photometric Sets' },
              { metric: '50+', label: 'Export Countries Across EU, NA, ME, APAC' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 bg-[var(--bg-elevated)] border border-[var(--border-hairline)]"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {stat.metric}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1 font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-3">
            <Wrench className="w-6 h-6 text-[var(--text-primary)]" />
            <h2 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Custom Tooling & Co-Extrusion R&D
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Our 15-member R&D team designs custom silicone extrusion dies, anti-glare louvers, and custom FPC layouts within 7–14 days, supporting bespoke architectural profiles and private-label OEM/ODM partners.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-3">
            <ShieldCheck className="w-6 h-6 text-[#111111]" />
            <h2 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Batch-to-Batch 1-Bin Consistency
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Because we encapsulate our own SMD LEDs in Factory 2, we strictly lock finished-product color temperature tolerances within 3-step MacAdam ellipses (SDCM ≤ 3) across multi-year project phases.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] space-y-3">
            <Globe className="w-6 h-6 text-emerald-700" />
            <h2 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Project Cut-to-Length Pre-Assembly
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              We deliver factory-sealed custom segment lengths (from 0.2m to 30m) with injection-molded IP67/IP68 front, side, or bottom cable entries labeled by architectural zone for plug-and-play site installation.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-display font-medium text-xl text-[var(--text-primary)]">
              Ready to Audit Our Factory or Request Samples?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Explore our laboratory facilities or contact our Shenzhen engineering desk directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/factory"
              className="px-5 py-2.5 border border-[var(--border-hairline)] hover:border-white/30 font-mono text-xs"
            >
              Inspect Factory & Lab →
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-[#111111] hover:bg-[#185EC0] text-white font-mono text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Contact Engineering Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
