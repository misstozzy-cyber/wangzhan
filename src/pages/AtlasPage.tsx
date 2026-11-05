import React from 'react';
import { Product } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { ProfileAtlas } from '../components/products/ProfileAtlas';
import { BendLab } from '../components/home/BendLab';

interface AtlasPageProps {
  products: Product[];
}

export const AtlasPage: React.FC<AtlasPageProps> = ({ products }) => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEOHead
        title="1:1 Profile Atlas — 50+ Silicone LED Neon Flex Cross-Sections"
        description="Interactive 1:1 true-scale cross-section wall of all TYRIA Silicone LED Neon Flex and Flexible Wall Grazer profiles with draggable millimeter caliper ruler and coordinate scatter view."
        canonicalPath="/products/neon-flex/atlas"
      />
      <ProfileAtlas products={products} isPreview={false} />
      <BendLab products={products} />
    </div>
  );
};
