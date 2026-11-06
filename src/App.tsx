import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GlowProvider } from './context/GlowContext';
import { InquiryProvider } from './context/InquiryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { InquiryDrawer } from './components/common/InquiryDrawer';
import { CompareDrawer } from './components/common/CompareDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AtlasPage } from './pages/AtlasPage';
import { SpecFinderPage } from './pages/SpecFinderPage';
import { DesignerHubPage } from './pages/DesignerHubPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { FactoryPage } from './pages/FactoryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import productsData from './data/products.json';
import catalogsData from './data/catalogs.json';
import iesLibraryData from './data/ies_library.json';
import factoryCertsData from './data/factory_certs.json';
import { Product, CatalogItem, PhotometricEntry, FactoryAsset } from './types/product';

const products = productsData as Product[];
const catalogs = catalogsData as CatalogItem[];
const iesLibrary = iesLibraryData as PhotometricEntry[];
const factoryAssets = (factoryCertsData.factory || []) as FactoryAsset[];
const certificateAssets = (factoryCertsData.certificates || []) as FactoryAsset[];

let lenis: Lenis | null = null;

const SmoothScroll: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
  return null;
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <GlowProvider>
      <InquiryProvider>
        <BrowserRouter>
          <SmoothScroll />
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      products={products}
                      catalogs={catalogs}
                      factoryAssets={factoryAssets}
                    />
                  }
                />
                <Route
                  path="/products/neon-flex/atlas"
                  element={<AtlasPage products={products} />}
                />
                <Route
                  path="/products"
                  element={<ProductsPage products={products} />}
                />
                <Route
                  path="/products/:family"
                  element={<ProductsPage products={products} />}
                />
                <Route
                  path="/products/:family/:series"
                  element={<ProductsPage products={products} />}
                />
                <Route
                  path="/product/:id"
                  element={<ProductDetailPage products={products} />}
                />
                <Route
                  path="/spec-finder"
                  element={<SpecFinderPage products={products} />}
                />
                <Route
                  path="/designer-hub"
                  element={
                    <DesignerHubPage
                      products={products}
                      catalogs={catalogs}
                      iesLibrary={iesLibrary}
                    />
                  }
                />
                <Route
                  path="/applications"
                  element={<ApplicationsPage products={products} />}
                />
                <Route
                  path="/factory"
                  element={
                    <FactoryPage
                      factoryAssets={factoryAssets}
                      certificateAssets={certificateAssets}
                    />
                  }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <CompareDrawer products={products} />
            <InquiryDrawer />
          </div>
        </BrowserRouter>
      </InquiryProvider>
    </GlowProvider>
  );
};

export default App;
