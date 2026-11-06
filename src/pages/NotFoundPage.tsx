import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEOHead } from '../components/common/SEOHead';

export const NotFoundPage: React.FC = () => (
  <div className="flex min-h-[80vh] flex-col items-center justify-center px-5 pt-24 text-center">
    <SEOHead title="Page not found" description="This page has moved. Browse Tyria Lighting products and downloads." />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="font-display text-[clamp(120px,24vw,360px)] font-light leading-none tracking-[-0.07em] text-ink"
    >
      404
    </motion.div>
    <div className="mt-2 h-[3px] w-40 rounded-full bg-glow shadow-[0_0_12px_#FFC97A,0_0_32px_#FFC97A]" />
    <p className="mt-8 max-w-[36ch] text-[16px] text-graphite">This page has moved or never existed.</p>
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      <Link to="/" className="pill-ink h-12 px-7">Home</Link>
      <Link to="/products" className="pill-soft h-12 px-6">Products</Link>
    </div>
  </div>
);
