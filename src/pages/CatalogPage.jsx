import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowUpDown, 
  ChevronLeft, 
  Package, 
  Info, 
  X,
  SlidersHorizontal
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import JSONLD from '../components/JSONLD';
import ProductCard from '../components/ProductCard';
import { searchProducts, getCategoriesWithCount } from '../utils/productData';

const ITEMS_PER_PAGE = 24;

export default function CatalogPage({ onOpenWhatsAppModal }) {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categorie') || 'Toutes');
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Categories list
  const categories = useMemo(() => {
    const list = getCategoriesWithCount();
    const totalCount = list.reduce((sum, cat) => sum + cat.count, 0);
    return [{ name: 'Toutes', count: totalCount }, ...list];
  }, []);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return searchProducts({
      query: searchQuery,
      category: selectedCategory,
      sortBy: sortBy
    });
  }, [searchQuery, selectedCategory, sortBy]);

  // Reset to page 1 when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, startIndex]);

  const handleCategorySelect = (catName) => {
    setSelectedCategory(catName);
    setIsMobileFilterOpen(false);
    // Update URL param
    if (catName === 'Toutes') {
      searchParams.delete('categorie');
    } else {
      searchParams.set('categorie', catName);
    }
    setSearchParams(searchParams);
  };

  return (
    <>
      <SEOHead 
        title={`Catalogue Produits (${filteredProducts.length}) - SUPERMARKET Yaoundé`}
        description="Consultez notre catalogue complet de 270+ produits agro-alimentaires à Yaoundé : riz, huiles, boissons, produits laitiers, épices. Commandez directement sur WhatsApp !"
        canonical="https://super-market.pro/catalogue"
      />
      <JSONLD products={paginatedProducts} />

      <div className="bg-slate-50 min-h-screen pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link to="/" className="hover:text-emerald-700 transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Catalogue Produits</span>
            {selectedCategory !== 'Toutes' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-emerald-700 font-bold">{selectedCategory}</span>
              </>
            )}
          </nav>

          {/* Page Headline Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 mb-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Épicerie & Agro-Alimentaire
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Catalogue Produits SUPERMARKET
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Produits agro-alimentaires uniquement (riz, huiles, conserves, boissons, hygiène) — Choisissez vos articles et validez votre commande express via WhatsApp.
              </p>
            </div>

            {/* Business Positioning Notice Box */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Information Métier :</strong> Nous sommes un distributeur exclusif de <strong>produits agro-alimentaires et d'épicerie</strong>. Nous ne commercialisons aucun équipement commercial.
              </span>
            </div>
          </div>

          {/* Main Controls Layout: Search + Mobile Filter Button + Sort */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, marque, référence (ex: Riz Ngonda, ART014, Huile)..."
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>Filtres ({selectedCategory === 'Toutes' ? 'Tous' : '1'})</span>
              </button>

              {/* Sort Select Dropdown */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-3 rounded-2xl shadow-sm">
                <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="name-asc">Nom (A → Z)</option>
                  <option value="name-desc">Nom (Z → A)</option>
                  <option value="price-asc">Prix (Croissant)</option>
                  <option value="price-desc">Prix (Décroissant)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Main Grid Section with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Desktop Categories Sidebar (3 Cols) */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-24">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>Catégories ({categories.length - 1})</span>
                </h3>

                <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => handleCategorySelect(cat.name)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white font-bold shadow-md'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          isSelected ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Products Grid Column (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Active Filter Chips Bar & Results count */}
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 text-xs">
                <span className="text-slate-600 font-medium">
                  Affichage de <strong className="text-slate-900">{filteredProducts.length > 0 ? startIndex + 1 : 0}</strong> à <strong className="text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</strong> sur <strong className="text-slate-900">{filteredProducts.length}</strong> produits
                </span>

                {selectedCategory !== 'Toutes' && (
                  <button
                    onClick={() => handleCategorySelect('Toutes')}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                  >
                    <span>Effacer le filtre</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Product Cards Grid */}
              {paginatedProducts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.04
                      }
                    }
                  }}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOrder={(p) => onOpenWhatsAppModal?.(p)}
                    />
                  ))}
                </motion.div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900">Aucun produit ne correspond</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Aucun article ne correspond à votre recherche "{searchQuery}". Vérifiez l'orthographe ou changez de catégorie.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Toutes');
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm pt-4">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>

                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isCurrent = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl font-bold text-xs transition-colors ${
                            isCurrent 
                              ? 'bg-slate-900 text-white shadow-md' 
                              : 'bg-slate-50 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors"
                  >
                    <span>Suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <h3 className="font-extrabold text-base text-slate-900">Catégories Produit</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 flex-1">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => handleCategorySelect(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-2">{cat.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
