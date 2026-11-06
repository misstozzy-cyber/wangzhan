import React, { useEffect, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { InquiryProvider } from './context/InquiryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { InquiryDrawer } from './components/common/InquiryDrawer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

import productsData from './data/products.json';
import catalogsData from './data/catalogs.json';
import factoryCertsData from './data/factory_certs.json';
import { Product, CatalogItem, FactoryAsset } from './types/product';

const products = productsData as Product[];
const catalogs = catalogsData as CatalogItem[];
const factoryAssets = (factoryCertsData.factory || []) as FactoryAsset[];

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
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    // Lenis may still be gliding towards the previous page's target, so stop it before resetting.
    const top = () => {
      lenis?.stop();
      window.scrollTo(0, 0);
      lenis?.resize();
      lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
    };
    top();
    const id = requestAnimationFrame(() => requestAnimationFrame(top));
    const t = window.setTimeout(top, 120);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
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
                      factoryAssets={factoryAssets}
                    />
                  }
                />
                <Route path="/products/neon-flex/atlas" element={<Navigate to="/products/neon-flex" replace />} />
                <Route path="/spec-finder" element={<Navigate to="/products" replace />} />
                <Route path="/applications" element={<Navigate to="/products" replace />} />
                <Route path="/designer-hub" element={<Navigate to="/downloads" replace />} />
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
                <Route path="/downloads" element={<DownloadsPage products={products} catalogs={catalogs} />} />
                <Route path="/factory" element={<Navigate to="/about" replace />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
            <InquiryDrawer />
          </div>
        </BrowserRouter>
      </InquiryProvider>
  );
};

export default App;
