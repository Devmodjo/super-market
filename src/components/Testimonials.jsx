import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Jean-Paul Mbida",
      role: "Gérant de restaurant - Bastos",
      content: "SUPERMARKET est notre fournisseur officiel pour le riz, l'huile et les condiments. Les sacs de riz Ngonda et les cartons d'huile sont toujours impeccables et livrés en temps record.",
      rating: 5,
      avatar: "JP"
    },
    {
      id: 2,
      name: "Marie-Louise Ngo",
      role: "Mère de famille - Essos",
      content: "J'effectue mes achats du mois via leur service WhatsApp. En 2 minutes ma commande est prête et je retire à l'agence d'Essos sans faire la queue. Un gain de temps précieux !",
      rating: 5,
      avatar: "ML"
    },
    {
      id: 3,
      name: "Alain Fotso",
      role: "Propriétaire d'épicerie - Mvog-Mbi",
      content: "En tant que détaillant, trouver un grossiste réactif avec des prix stables sur les produits de première nécessité à Yaoundé était difficile. SUPERMARKET a répondu à tous nos besoins.",
      rating: 5,
      avatar: "AF"
    },
    {
      id: 4,
      name: "Solange Ekotto",
      role: "Chef de ménage - Tsinga",
      content: "Qualité constante sur les produits laitiers, conserves et jus. Le personnel en agence à Tsinga est courtois et très professionnel.",
      rating: 5,
      avatar: "SE"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, reviews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section id="temoignages" className="py-20 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Avis & Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Ils nous font confiance
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Commerçants, gérants de restauration et ménages à Yaoundé témoignent de notre engagement.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xl relative overflow-hidden">
            
            <Quote className="w-16 h-16 text-emerald-200/60 absolute -top-2 -left-2 pointer-events-none" />

            <motion.div
              key={reviews[currentIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 space-y-6 text-center sm:text-left"
            >
              {/* Star Ratings */}
              <div className="flex items-center justify-center sm:justify-start gap-1">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-lg text-slate-800 italic leading-relaxed">
                "{reviews[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-4 border-t border-slate-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                  {reviews[currentIndex].avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{reviews[currentIndex].name}</h4>
                  <p className="text-xs text-slate-500">{reviews[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Aller au témoignage ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm"
                aria-label="Témoignage précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors shadow-sm"
                aria-label="Témoignage suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
