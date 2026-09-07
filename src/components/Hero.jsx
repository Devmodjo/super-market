import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, ShieldCheck, Truck, Store, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/productData';

export default function Hero({ onOpenWhatsAppModal }) {
  const sampleProducts = [
    {
      nom: "Riz Ngonda 25% 50KG",
      prix: 19700,
      categorie: "Riz & Céréales",
      conditionnement: "Sac 50kg",
      id: "art014-riz-ngonda-25-50kg"
    },
    {
      nom: "Beurre Jadida 450G",
      prix: 1317,
      categorie: "Produits Laitiers",
      conditionnement: "Carton",
      id: "art1010-beurre-jadida-450g"
    },
    {
      nom: "Huile Végétale Raffinée 5L",
      prix: 9500,
      categorie: "Huiles & Matières Grasses",
      conditionnement: "Bidon 5L",
      id: "sample-huile-5l"
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950/5 via-slate-50 to-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-accent-400/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              <span>Distribution Alimentaire & Épicerie de Gros</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Votre partenaire de confiance pour vos{' '}
              <span className="gradient-text">produits alimentaires</span> du quotidien.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              SUPERMARKET approvisionne les ménages, commerces et établissements de Yaoundé en produits agro-alimentaires d'excellence (riz, huiles, boissons, produits laitiers, conserves). Commandez en quelques secondes via WhatsApp !
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/catalogue"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all transform hover:-translate-y-0.5"
              >
                <span>Voir le catalogue (270+ produits)</span>
                <ArrowRight className="w-5 h-5 text-emerald-400" />
              </Link>

              <button
                onClick={() => onOpenWhatsAppModal?.(null)}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>Commander sur WhatsApp</span>
              </button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Qualité Certifiée</p>
                  <p className="text-[11px] text-slate-500">Produits 100% frais</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">3 Agences</p>
                  <p className="text-[11px] text-slate-500">Essos, Mvog-Mbi, Tsinga</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Livraison Rapide</p>
                  <p className="text-[11px] text-slate-500">À Yaoundé 7j/7</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual & Floating Product Cards */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Main Showcase Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Background Backdrop Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group">
                <img
                  src="/assets/hero.jpg"
                  alt="Rayons épicerie et produits alimentaires SUPERMARKET Yaoundé"
                  className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-[11px] font-bold uppercase tracking-wider">
                    Grossiste & Détaillant Alimentaire
                  </span>
                  <h3 className="text-xl font-bold mt-2">Approvisionnement Garanti à Yaoundé</h3>
                  <p className="text-xs text-slate-200 mt-1">Disponibilité permanente et prix compétitifs direct agences.</p>
                </div>
              </div>

              {/* Floating Product Card #1 (Top Right) */}
              <motion.div 
                className="absolute -top-6 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-slow z-20 max-w-[240px]"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-extrabold text-xs">
                  🌾 RIZ
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-600 block uppercase">N°1 des ventes</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sampleProducts[0].nom}</h4>
                  <p className="text-xs font-extrabold text-brand-600">{formatPrice(sampleProducts[0].prix)}</p>
                </div>
              </motion.div>

              {/* Floating Product Card #2 (Bottom Left) */}
              <motion.div 
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-20 max-w-[240px]"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-extrabold text-xs">
                  🧈 LAIT
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 block uppercase">Qualité Supérieure</span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sampleProducts[1].nom}</h4>
                  <p className="text-xs font-extrabold text-brand-600">{formatPrice(sampleProducts[1].prix)}</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
