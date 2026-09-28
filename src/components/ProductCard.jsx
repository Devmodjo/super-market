import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Package, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { formatPrice } from '../utils/productData';
import { getCategoryStyle } from '../utils/categoryIcons';

export default function ProductCard({ product, onOrder }) {
  if (!product) return null;

  const categoryStyle = getCategoryStyle(product.categorie);
  const IconComponent = categoryStyle.icon;

  const imageUrl = product.image_url || product.image;
  const isStockTracked = product.suivi_stock !== false;
  const isOutOfStock = isStockTracked && (product.en_stock === false || (typeof product.quantite_en_stock === 'number' && product.quantite_en_stock <= 0));
  const stockQuantity = isStockTracked && typeof product.quantite_en_stock === 'number' ? product.quantite_en_stock : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl p-4 shadow-sm border transition-all duration-300 flex flex-col justify-between group relative overflow-hidden ${
        isOutOfStock 
          ? 'border-slate-200/60 opacity-90' 
          : 'border-slate-200/80 hover:shadow-xl hover:border-emerald-400'
      }`}
    >
      <div>
        {/* Card Header Visual (Image or Gradient placeholder) */}
        <div className={`w-full h-36 rounded-xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-300 shadow-inner flex flex-col justify-between p-3 ${
          imageUrl ? 'bg-slate-100' : `bg-gradient-to-br ${categoryStyle.gradient}`
        }`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.nom}
              className="absolute inset-0 w-full h-full object-cover z-0"
              loading="lazy"
            />
          ) : (
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none" />
          )}

          {/* Top badges bar */}
          <div className="flex items-center justify-between relative z-10">
            {/* Reference Badge */}
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white font-mono text-[10px] font-bold tracking-wider uppercase">
              {product.reference || 'ART'}
            </span>

            {/* Stock Badge: Displayed ONLY if stock is physically tracked in ERP */}
            {isStockTracked ? (
              isOutOfStock ? (
                <span className="px-2 py-0.5 rounded-full bg-red-600/90 backdrop-blur-md text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                  <XCircle className="w-3 h-3" />
                  <span>Rupture</span>
                </span>
              ) : stockQuantity !== null && stockQuantity <= 5 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Reste {stockQuantity}</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>En stock</span>
                </span>
              )
            ) : null}
          </div>

          {/* Bottom badge: Category */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 font-bold text-[10px] uppercase tracking-wider shadow-sm">
              {categoryStyle.badge || product.categorie || 'Article'}
            </span>

            <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
              <IconComponent className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-3.5 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block line-clamp-1">
            {product.categorie}
          </span>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors leading-snug">
            {product.nom}
          </h3>

          {/* Conditionnement + Stock Details */}
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium pt-0.5">
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Cond. : <strong className="text-slate-700 font-semibold">{product.conditionnement || 'Unité'}</strong></span>
            </div>
            {isStockTracked && stockQuantity !== null && (
              <span className={`text-[11px] font-semibold ${isOutOfStock ? 'text-red-500' : 'text-emerald-600'}`}>
                {stockQuantity} dispo{stockQuantity > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Price + Order CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Prix Unitaire</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-700">
            {formatPrice(product.prix)}
          </span>
        </div>

        {isOutOfStock ? (
          <button
            disabled
            className="px-3.5 py-2 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs flex items-center gap-1.5 cursor-not-allowed shrink-0"
          >
            <span>Épuisé</span>
          </button>
        ) : (
          <button
            onClick={() => onOrder?.(product)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all transform active:scale-95 shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>Commander</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
