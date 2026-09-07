import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, PackageCheck, Store, Truck, Headset, Sparkles } from 'lucide-react';

export default function WhyUs() {
  const benefits = [
    {
      icon: ShieldCheck,
      color: "bg-emerald-100 text-emerald-700",
      title: "Produits de qualité certifiée",
      description: "Toutes nos références alimentaires sont rigoureusement sélectionnées auprès des producteurs officiels pour une fraîcheur garantie."
    },
    {
      icon: PackageCheck,
      color: "bg-amber-100 text-amber-700",
      title: "Disponibilité permanente en stock",
      description: "Plus de 270 références en stock constant pour assurer l'approvisionnement sans rupture de votre foyer ou commerce."
    },
    {
      icon: Store,
      color: "bg-blue-100 text-blue-700",
      title: "Réseau multi-agences de proximité",
      description: "Trois agences stratégiquement implantées à Yaoundé (Essos, Mvog-Mbi, Tsinga) pour être toujours au plus près de vous."
    },
    {
      icon: Truck,
      color: "bg-purple-100 text-purple-700",
      title: "Livraison rapide sur site",
      description: "Service de livraison réactif à domicile ou sur le lieu de votre entreprise partout dans la ville de Yaoundé."
    },
    {
      icon: Headset,
      color: "bg-pink-100 text-pink-700",
      title: "Service client & écoute 7/7",
      description: "Une équipe réactive disponible 7 jours sur 7 par téléphone et WhatsApp pour répondre à toutes vos questions."
    },
    {
      icon: Sparkles,
      color: "bg-orange-100 text-orange-700",
      title: "Accompagnement personnalisé",
      description: "Des tarifs préférentiels et des conseils adaptés pour les achats groupés, détaillants et professionnels de la restauration."
    }
  ];

  return (
    <section id="pourquoi-nous" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Nos Engagements
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Pourquoi choisir <span className="gradient-text">SUPERMARKET</span> ?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Une vision moderne de la distribution agro-alimentaire, alliant qualité, réactivité et proximité.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
