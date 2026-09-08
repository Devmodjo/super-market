import React from 'react';

export default function JSONLD({ products = [] }) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    "name": "SUPERMARKET Sarl",
    "image": "https://super-market.pro/assets/logo.png",
    "@id": "https://super-market.pro/#organization",
    "url": "https://super-market.pro/",
    "telephone": "+237694470159",
    "priceRange": "FCFA",
    "sameAs": [
      "https://www.facebook.com/Super-Market-Sarl"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenue Tsinga / Rue des Ecoles Essos / Marché Mvog-Mbi",
      "addressLocality": "Yaoundé",
      "addressCountry": "CM"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "3.8480",
      "longitude": "11.5021"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "07:30",
        "closes": "20:30"
      }
    ],
    "department": [
      {
        "@type": "GroceryStore",
        "name": "SUPERMARKET Agence Essos",
        "telephone": "+237690000001",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rue des Ecoles, Bastos/Essos",
          "addressLocality": "Yaoundé",
          "addressCountry": "CM"
        }
      },
      {
        "@type": "GroceryStore",
        "name": "SUPERMARKET Agence Mvog-Mbi",
        "telephone": "+237690000002",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Marché Mvog-Mbi",
          "addressLocality": "Yaoundé",
          "addressCountry": "CM"
        }
      },
      {
        "@type": "GroceryStore",
        "name": "SUPERMARKET Agence Siège Tsinga",
        "telephone": "+237690000003",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Avenue Tsinga",
          "addressLocality": "Yaoundé",
          "addressCountry": "CM"
        }
      }
    ]
  };

  const productListSchema = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 20).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.nom,
        "sku": product.reference,
        "category": product.categorie,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "XAF",
          "price": product.prix,
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "SUPERMARKET Sarl"
          }
        }
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {productListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
        />
      )}
    </>
  );
}
