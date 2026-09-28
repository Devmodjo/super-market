/**
 * Supermarket products utility module
 * Real products are loaded live from the ERP API (/api/public/products/)
 * No hardcoded or dummy products.
 */
export const products = [];

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
 * @param {Array} sourceProducts
 * @returns {Array<{name: string, count: number}>}
 */
export function getCategoriesWithCount(sourceProducts = []) {
  const categoryMap = new Map();
  const list = Array.isArray(sourceProducts) ? sourceProducts : [];
  
  list.forEach(product => {
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
 * @param {Array} sourceProducts
 * @returns {Array}
 */
export function getProductsByCategory(category, sourceProducts = []) {
  const list = Array.isArray(sourceProducts) ? sourceProducts : [];
  if (!category || category === 'Toutes') return list;
  return list.filter(p => p.categorie === category);
}

/**
 * Search, filter and sort products
 * @param {Object} options
 * @param {string} options.query - Search query string
 * @param {string} options.category - Category filter
 * @param {string} options.sortBy - Sort mode ('name-asc', 'name-desc', 'price-asc', 'price-desc')
 * @param {boolean} options.inStockOnly - Filter only available products
 * @param {Array} options.productsList - Custom source products array
 * @returns {Array} filtered and sorted products
 */
export function searchProducts({ 
  query = '', 
  category = 'Toutes', 
  sortBy = 'name-asc', 
  inStockOnly = false,
  productsList = [] 
} = {}) {
  const source = Array.isArray(productsList) ? productsList : [];
  let filtered = [...source];

  // 1. Stock Filter (applicable only if stock is tracked)
  if (inStockOnly) {
    filtered = filtered.filter(p => p.suivi_stock === false || (p.en_stock !== false && (p.quantite_en_stock === undefined || p.quantite_en_stock > 0)));
  }

  // 2. Category Filter
  if (category && category !== 'Toutes') {
    filtered = filtered.filter(p => p.categorie === category);
  }

  // 3. Query Filter (Name or Reference)
  if (query && query.trim() !== '') {
    const cleanQuery = query.trim().toLowerCase();
    filtered = filtered.filter(p => 
      (p.nom && p.nom.toLowerCase().includes(cleanQuery)) || 
      (p.reference && p.reference.toLowerCase().includes(cleanQuery)) ||
      (p.categorie && p.categorie.toLowerCase().includes(cleanQuery))
    );
  }

  // 4. Sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.prix || 0) - (b.prix || 0);
      case 'price-desc':
        return (b.prix || 0) - (a.prix || 0);
      case 'name-desc':
        return (b.nom || '').localeCompare(a.nom || '', 'fr');
      case 'name-asc':
      default:
        return (a.nom || '').localeCompare(b.nom || '', 'fr');
    }
  });

  return filtered;
}

/**
 * Get featured products for homepage hero & showcase
 * @param {number} limit 
 * @param {Array} sourceProducts
 * @returns {Array}
 */
export function getFeaturedProducts(limit = 8, sourceProducts = []) {
  const list = Array.isArray(sourceProducts) ? sourceProducts : [];
  return list.slice(0, limit);
}
