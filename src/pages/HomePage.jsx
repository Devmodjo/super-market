import React from 'react';
import SEOHead from '../components/SEOHead';
import JSONLD from '../components/JSONLD';
import Hero from '../components/Hero';
import TrustStats from '../components/TrustStats';
import SupplyExcellence from '../components/SupplyExcellence';
import AgenciesSection from '../components/AgenciesSection';
import WhyUs from '../components/WhyUs';
import CatalogPreview from '../components/CatalogPreview';
import WhatsAppCommunityBanner from '../components/WhatsAppCommunityBanner';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import { getFeaturedProducts } from '../utils/productData';

export default function HomePage({ onOpenWhatsAppModal }) {
  const featuredProducts = getFeaturedProducts(12);

  return (
    <>
      <SEOHead 
        title="SUPERMARKET - Distributeur Agro-alimentaire & Épicerie à Yaoundé (Cameroun)"
        description="SUPERMARKET est votre grossiste et détaillant de produits agro-alimentaires à Yaoundé (Essos, Mvog-Mbi, Tsinga). Riz, huiles, boissons, conserves. Commandez facilement sur WhatsApp !"
        canonical="https://super-market.pro/"
      />
      <JSONLD products={featuredProducts} />

      <main className="overflow-hidden">
        <Hero onOpenWhatsAppModal={onOpenWhatsAppModal} />
        <TrustStats />
        <SupplyExcellence />
        <AgenciesSection />
        <WhyUs />
        <CatalogPreview onOpenWhatsAppModal={onOpenWhatsAppModal} />
        <WhatsAppCommunityBanner />
        <Testimonials />
        <FAQ />
      </main>
    </>
  );
}
