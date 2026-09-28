import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Sparkles, Filter } from 'lucide-react';
import ProductCard from './ProductCard';
import { searchProducts, getCategoriesWithCount } from '../utils/productData';
import { getLiveProducts } from '../utils/api';

export default function CatalogPreview({ onOpenWhatsAppModal }) {
  const [productsList, setProductsList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadLive() {
      const live = await getLiveProducts();
      if (isMounted && live && Array.isArray(live) && live.length > 0) {
        setProductsList(live);
      }
    }
    loadLive();
    return () => { isMounted = false; };
  }, []);

  const categories = useMemo(() => {
    const list = getCategoriesWithCount(productsList);
    return [{ name: 'Toutes', count: productsList.length }, ...list];
  }, [productsList]);

  const displayedProducts = useMemo(() => {
    const results = searchProducts({
      query: searchQuery,
      category: selectedCategory,
      sortBy: 'name-asc',
      productsList: productsList
    });
    return results.slice(0, 8); // Show top 8 items on preview
  }, [searchQuery, selectedCategory, productsList]);

  return (
    <section className="py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aperçu de notre catalogue</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Nos Produits Agro-Alimentaires
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Épicerie de gros et détail — Choisissez un produit et commandez directement sur WhatsApp.
            </p>
          </div>

          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all shrink-0 self-start md:self-auto"
          >
            <span>Voir l'intégralité du catalogue ({productsList.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search Bar + Filters */}
        <div className="space-y-4 mb-8">
          {/* Search Input */}
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit (riz, huile, lait, épices...)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
            />
          </div>

          {/* Category Chips horizontal scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
            {categories.slice(0, 10).map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={(p) => onOpenWhatsAppModal?.(p)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 my-8">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-slate-800">Aucun produit ne correspond à votre recherche</h4>
            <p className="text-sm text-slate-500 mt-1">Essayez un autre mot clé ou réinitialisez les filtres.</p>
            <button
              onClick={() => {
                setSelectedCategory('Toutes');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-xl transition-all hover:scale-105"
          >
            <span>Explorer tout le catalogue ({productsList.length} articles)</span>
            <ArrowRight className="w-5 h-5 text-emerald-400" />
          </Link>
        </div>

      </div>
    </section>
  );
}
