import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Navigation, CheckCircle } from 'lucide-react';

export default function AgenciesSection() {
  const [activeAgency, setActiveAgency] = useState(0);

  const agencies = [
    {
      id: "essos",
      name: "Agence Essos",
      district: "Essos - Bastos",
      address: "Marché essos, hotel madison, Yaoundé",
      hours: "Lun - Dim : 07h30 - 20h30",
      phone: "+237 690 00 00 01 / +237 670 00 00 01",
      mapUrl: "https://maps.google.com/?q=hotel madison+Essos+Yaounde",
      tag: "Point de vente Express"
    },
    {
      id: "mvog-mbi",
      name: "Agence Mvog-Mbi",
      district: "Mvog-Mbi",
      address: "Carrefour Mvog-mbi Marché Mvog-Mbi, Yaoundé",
      hours: "Lun - Dim : 07h30 - 20h30",
      phone: "+237 690 00 00 02 / +237 670 00 00 02",
      mapUrl: "https://maps.google.com/?q=Mvog+Mbi+Yaounde",
      tag: "Dépôt de Gros & Détail"
    },
    {
      id: "tsinga",
      name: "Agence Siège (Tsinga)",
      district: "Tsinga",
      address: "en face sis athatri finance, Nkomkana, Marché 8em Yaoundé",
      hours: "Lun - Dim : 07h30 - 20h30",
      phone: "+237 690 00 00 03 / +237 670 00 00 03",
      mapUrl: "https://maps.google.com/?q=Nkomkana+marché+huitieme+Tsinga+Yaounde",
      tag: "Siège Administratif & Gros"
    }
  ];

  return (
    <section id="agences" className="py-20 bg-slate-50 relative border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Réseau Multi-Agences à Yaoundé</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Nos Agences à votre service
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Retrouvez nos points de vente bien situés à Yaoundé pour vos retraits de commande express ou vos achats directs en rayon.
          </p>
        </div>

        {/* Agency Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agencies.map((agency, idx) => (
            <motion.div
              key={agency.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                    {agency.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-700 font-bold text-xs">
                    0{idx + 1}
                  </div>
                </div>

                {/* Agency Name */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {agency.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium mb-6">Secteur : {agency.district}</p>

                {/* Agency Details */}
                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{agency.address}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{agency.hours}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900">{agency.phone}</span>
                  </div>
                </div>

                {/* Simulated Mini Map Preview */}
                <div className="mt-6 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative h-32 flex items-center justify-center group-hover:border-emerald-300 transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
                  <div className="relative z-10 text-center p-3">
                    <MapPin className="w-7 h-7 text-emerald-600 mx-auto animate-bounce" />
                    <span className="text-xs font-bold text-slate-800 block mt-1">{agency.name}</span>
                    <span className="text-[10px] text-slate-500 block">Yaoundé, Cameroun</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <a
                  href={agency.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Voir l'itinéraire GPS</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
