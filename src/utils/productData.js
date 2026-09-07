import rawProducts from '../../produits_supermarket.json';

/**
 * All supermarket products loaded from JSON
 */
export const products = rawProducts;

/**
 * Format price in FCFA with thousands separator
 * @param {number} amount 
 * @returns {string} e.g. "19 700 FCFA"
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number') return '0 FCFA';
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

/**
 * Get list of all unique categories with product count
 * @returns {Array<{name: string, count: number}>}
 */
export function getCategoriesWithCount() {
  const categoryMap = new Map();
  
  rawProducts.forEach(product => {
    const cat = product.categorie || 'Épicerie Générale';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count
  }));

  // Sort categories alphabetically
  return categories.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}

/**
 * Get products by category name
 * @param {string} category 
 * @returns {Array}
 */
export function getProductsByCategory(category) {
  if (!category || category === 'Toutes') return rawProducts;
  return rawProducts.filter(p => p.categorie === category);
}

/**
 * Search, filter and sort products
 * @param {Object} options
 * @param {string} options.query - Search query string
 * @param {string} options.category - Category filter
 * @param {string} options.sortBy - Sort mode ('name-asc', 'name-desc', 'price-asc', 'price-desc')
 * @returns {Array} filtered and sorted products
 */
export function searchProducts({ query = '', category = 'Toutes', sortBy = 'name-asc' } = {}) {
  let filtered = [...rawProducts];

  // 1. Category Filter
  if (category && category !== 'Toutes') {
    filtered = filtered.filter(p => p.categorie === category);
  }

  // 2. Query Filter (Name or Reference)
  if (query && query.trim() !== '') {
    const cleanQuery = query.trim().toLowerCase();
    filtered = filtered.filter(p => 
      p.nom.toLowerCase().includes(cleanQuery) || 
      (p.reference && p.reference.toLowerCase().includes(cleanQuery)) ||
      (p.categorie && p.categorie.toLowerCase().includes(cleanQuery))
    );
  }

  // 3. Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.prix - b.prix;
      case 'price-desc':
        return b.prix - a.prix;
      case 'name-desc':
        return b.nom.localeCompare(a.nom, 'fr');
      case 'name-asc':
      default:
        return a.nom.localeCompare(a.nom, 'fr');
    }
  });

  return filtered;
}

/**
 * Get featured products for homepage hero & showcase
 * @param {number} limit 
 * @returns {Array}
 */
export function getFeaturedProducts(limit = 8) {
  // Select popular representative items from key food categories
  const featuredIds = [
    'art014-riz-ngonda-25-50kg',
    'art1010-beurre-jadida-450g',
    'art929-arrachides-5l',
    'art925-anice-vert-70g',
    'art287-beurre-vale-d-or-500g-12-detail'
  ];

  const found = rawProducts.filter(p => featuredIds.includes(p.id));
  if (found.length >= limit) return found.slice(0, limit);

  // Top up with distinct categories
  const categorySeen = new Set(found.map(p => p.categorie));
  for (const p of rawProducts) {
    if (!categorySeen.has(p.categorie)) {
      found.push(p);
      categorySeen.add(p.categorie);
    }
    if (found.length >= limit) break;
  }

  return found.slice(0, limit);
}
