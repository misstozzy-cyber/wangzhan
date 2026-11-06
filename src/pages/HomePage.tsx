import React from 'react';
import { Product, FactoryAsset } from '../types/product';
import { SEOHead } from '../components/common/SEOHead';
import { Hero } from '../components/home/Hero';
import { Material } from '../components/home/Material';
import { Profiles } from '../components/home/Profiles';
import { Pixel } from '../components/home/Pixel';
import { Families } from '../components/home/Families';
import { Factory } from '../components/home/Factory';
import { Certified } from '../components/home/Certified';
import { Closing } from '../components/home/Closing';

interface HomePageProps {
  products: Product[];
  factoryAssets: FactoryAsset[];
}

export const HomePage: React.FC<HomePageProps> = ({ products }) => {
  return (
    <>
      <SEOHead
        title="Silicone LED Neon & Linear Light, Shenzhen"
        description="Tyria Lighting designs and manufactures silicone LED neon flex, LED strip, wall grazers and backlit LED sheets in Shenzhen since 2012."
      />
      <Hero />
      <Material />
      <Profiles products={products} />
      <Pixel />
      <Families products={products} />
      <Factory />
      <Certified />
      <Closing />
    </>
  );
};
