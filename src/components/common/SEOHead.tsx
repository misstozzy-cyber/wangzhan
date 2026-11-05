import React, { useEffect } from 'react';
import { Product } from '../../types/product';

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  product?: Product;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalPath = '/',
  product,
}) => {
  useEffect(() => {
    const fullTitle = `${title} | TYRIA LIGHTING`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', product ? 'product' : 'website', true);
    setMeta('og:url', `https://www.tyrialight.com${canonicalPath}`, true);
  }, [title, description, canonicalPath, product]);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Shenzhen Tyria Lighting Technology Co., Ltd.',
    alternateName: 'TYRIA LIGHTING',
    foundingDate: '2012',
    url: 'https://www.tyrialight.com',
    email: 'info@tyrialight.com',
    telephone: '+86-755-36931652',
    numberOfEmployees: '260',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: "2F, D Building, Antonio Technology Park, Ma'anshan Community, Shajing Street, Baoan District",
        addressLocality: 'Shenzhen',
        addressRegion: 'Guangdong',
        addressCountry: 'CN',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Shancheng Industrial Zone, Shiyan Town, Baoan District',
        addressLocality: 'Shenzhen',
        addressRegion: 'Guangdong',
        addressCountry: 'CN',
      },
    ],
  };

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: `TYRIA ${product.model} (${product.itemNo})`,
        sku: product.itemNo,
        mpn: product.itemNo,
        category: `${product.family} - ${product.series}`,
        description: product.pitch,
        brand: {
          '@type': 'Brand',
          name: 'TYRIA LIGHTING',
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Cross-Section Size', value: `${product.size.w}x${product.size.h} mm` },
          { '@type': 'PropertyValue', name: 'Voltage', value: product.voltage },
          { '@type': 'PropertyValue', name: 'IP Rating', value: product.ip },
          { '@type': 'PropertyValue', name: 'Min Bending Diameter', value: `${product.minBendDiameter} mm` },
          { '@type': 'PropertyValue', name: 'CRI', value: product.cri },
        ],
      }
    : null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(productSchema ? [orgSchema, productSchema] : orgSchema),
      }}
    />
  );
};
