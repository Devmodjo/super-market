import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export default function SupplyExcellence() {
  const points = [
    "Approvisionnement direct auprès de producteurs et centrales certifiées",
    "Garantie de fraîcheur et contrôle systématique des dates de péremption",
    "Tarification compétitive adaptée aux achats en gros et au détail",
    "Disponibilité permanente sur 270+ références de produits de première nécessité"
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Block */}
          <motion.div 
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Qualité & Traçabilité</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              L'excellence de l'approvisionnement agro-alimentaire au cœur du Cameroun.
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Depuis plus de 12 ans, SUPERMARKET s'impose comme la référence en distribution de produits de grande consommation à Yaoundé. Nous sélectionnons rigoureusement des marques reconnues pour assurer à chaque famille et commerce une alimentation saine, fraîche et abordable.
            </p>

            <div className="space-y-3 pt-2">
              {points.map((point, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-800 text-sm font-semibold">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Service Client Dédié</h4>
                  <p className="text-xs text-slate-500">Accompagnement 7j/7</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Livraison Yaoundé</h4>
                  <p className="text-xs text-slate-500">Directement chez vous</p>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Visual Image Block */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
              <img
                src="/assets/supply.jpg"
                alt="Produits frais et épicerie de qualité chez SUPERMARKET Yaoundé"
                className="w-full h-[450px] object-cover object-center hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Produits Agro-Alimentaires Certifiés</h4>
                    <p className="text-xs text-slate-600">Riz, Huiles, Conserves, Produits Laitiers, Épices</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
                    100% Frais
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
