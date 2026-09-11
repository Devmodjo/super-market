import React, { useEffect } from 'react';

/**
 * Enhanced Dynamic SEO Meta Tags & Schema.org Manager for Jobs & Pages
 */
export default function SEOHead({ 
  title = "SUPERMARKET — Offres d'Emploi & Recrutement Agro-Alimentaire", 
  description = "Découvrez nos opportunités de carrière et rejoignez les équipes de Super-Market Sarl. Postulez en ligne aux offres d'emploi disponibles à Douala et Yaoundé.",
  canonical = "https://super-market.pro/carrieres",
  schemaJson = null
}) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Open Graph tags for social sharing
    const updateOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:url', canonical);
    updateOgTag('og:type', 'website');
    updateOgTag('og:site_name', 'Super-Market Sarl');

    // Handle Schema.org JSON-LD (Google Jobs / JobPosting)
    let scriptTag = document.getElementById('seo-schema-script');
    if (schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'seo-schema-script';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      const existingScript = document.getElementById('seo-schema-script');
      if (existingScript) existingScript.remove();
    };
  }, [title, description, canonical, schemaJson]);

  return null;
}
