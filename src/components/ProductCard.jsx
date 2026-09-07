import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Package, Tag } from 'lucide-react';
import { formatPrice } from '../utils/productData';
import { getCategoryStyle } from '../utils/categoryIcons';

export default function ProductCard({ product, onOrder }) {
  if (!product) return null;

  const categoryStyle = getCategoryStyle(product.categorie);
  const IconComponent = categoryStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      <div>
        {/* Card Header Visual Placeholder */}
        <div className={`w-full h-36 rounded-xl bg-gradient-to-br ${categoryStyle.gradient} p-4 flex flex-col justify-between relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-inner`}>
          
          {/* Subtle Decorative Circle Overlay */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-sm pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            {/* Reference Badge */}
            <span className="px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-md text-white font-mono text-[10px] font-bold tracking-wider uppercase">
              {product.reference || 'ART'}
            </span>

            {/* Category Icon */}
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <IconComponent className="w-4 h-4" />
            </div>
          </div>

          {/* Product Category Label */}
          <div className="relative z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 text-slate-900 font-bold text-[10px] uppercase tracking-wider">
              {categoryStyle.badge}
            </span>
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

          {/* Conditionnement Badge */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium pt-0.5">
            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Cond. : <strong className="text-slate-700 font-semibold">{product.conditionnement || 'Unité'}</strong></span>
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

        <button
          onClick={() => onOrder?.(product)}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all transform active:scale-95 shrink-0"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-white" />
          <span>Commander</span>
        </button>
      </div>
    </motion.div>
  );
}
