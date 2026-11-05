import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers, Sliders } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 bg-[var(--bg-primary)]">
      <SEOHead
        title="404 — Specification Route Not Found"
        description="The requested page could not be found. Explore TYRIA Lighting's 1:1 Profile Atlas or Spec Finder."
      />
      <div className="max-w-lg w-full p-8 bg-[var(--bg-elevated)] border border-[var(--border-hairline)] text-center space-y-5">
        <div className="font-mono text-xs text-[#1E6FD9]">ERROR 404 · CIRCUIT OPEN</div>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">
          Specification Route Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          The URL you requested may have moved from our legacy site. Use the links below to jump directly to our 1:1 Profile Atlas or Parametric Spec Finder.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
          <Link
            to="/"
            className="px-4 py-2.5 bg-[#1E6FD9] text-white font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <Link
            to="/products/neon-flex/atlas"
            className="px-4 py-2.5 border border-[var(--border-hairline)] hover:border-[var(--glow)] flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-[var(--glow)]" /> 1:1 Profile Atlas
          </Link>
          <Link
            to="/spec-finder"
            className="px-4 py-2.5 border border-[var(--border-hairline)] hover:border-white/30 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" /> Spec Finder
          </Link>
        </div>
      </div>
    </div>
  );
};
