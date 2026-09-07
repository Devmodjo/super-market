import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Store, Users, PackageCheck } from 'lucide-react';

function Counter({ target, suffix = '+' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000; // 2s duration
    const steps = 50;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function TrustStats() {
  const stats = [
    {
      icon: Award,
      value: 12,
      suffix: "+",
      label: "Années d'expérience",
      subtext: "Acteur majeur agro-alimentaire à Yaoundé"
    },
    {
      icon: Store,
      value: 3,
      suffix: "",
      label: "Agences à Yaoundé",
      subtext: "Essos, Mvog-Mbi et Siège Tsinga"
    },
    {
      icon: Users,
      value: 15,
      suffix: "k+",
      label: "Clients approvisionnés",
      subtext: "Ménages, détaillants et professionnels"
    },
    {
      icon: PackageCheck,
      value: 270,
      suffix: "+",
      label: "Produits en stock",
      subtext: "Riz, huiles, conserves, boissons..."
    }
  ];

  return (
    <section className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/60 hover:border-emerald-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-1 leading-snug">
                  {stat.subtext}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
