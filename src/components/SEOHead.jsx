import React, { useEffect } from 'react';

/**
 * Dynamic SEO Meta Tags Manager
 */
export default function SEOHead({ 
  title = "SUPERMARKET - Distributeur Agro-alimentaire & Épicerie à Yaoundé", 
  description = "SUPERMARKET est votre grossiste et détaillant de confiance pour vos produits alimentaires à Yaoundé (Essos, Mvog-Mbi, Tsinga). Riz, huiles, boissons, conserves. Commande rapide via WhatsApp !",
  canonical = "https://super-market.pro/"
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OG title & description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

  }, [title, description, canonical]);

  return null;
}
