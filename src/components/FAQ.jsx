import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Comment passer une commande sur WhatsApp ?",
      a: "Parcourez notre catalogue, cliquez sur le bouton 'Commander' présent sur la fiche de l'article souhaité. Notre configurateur pré-remplit automatiquement les références, la quantité, vos coordonnées et votre adresse. Il vous suffit ensuite de valider pour envoyer le message direct sur WhatsApp à notre service client."
    },
    {
      q: "Livrez-vous dans toute la ville de Yaoundé ?",
      a: "Oui ! Nous assurons la livraison à domicile et sur site dans tous les quartiers de Yaoundé (Bastos, Essos, Tsinga, Mvog-Mbi, Omnisports, Odza, Mendong, Nsam, etc.). Vous pouvez également choisir le retrait gratuit dans l'une de nos 3 agences."
    },
    {
      q: "Les produits sont-ils garantis frais et bien conservés ?",
      a: "Absolument. Tous nos produits agro-alimentaires (riz, huiles, boissons, produits laitiers, conserves) proviennent directement des filières officielles. Nous appliquons un contrôle strict des dates de durabilité minimale et des conditions d'entreposage."
    },
    {
      q: "Quels sont vos modes de règlement acceptés ?",
      a: "Vous pouvez régler au moment de la livraison ou du retrait en agence : en espèces (FCFA) ou par transfert Mobile Money (Orange Money, MTN Mobile Money)."
    },
    {
      q: "Proposez-vous des tarifs préférentiels pour les achats en gros ?",
      a: "Oui, nous accompagnons les détaillants, épiceries de quartier, restaurants, cantines et ménages réalisant des achats groupés. Contactez directement notre équipe commerciale via WhatsApp pour obtenir un devis personnalisé."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 relative border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Assistance Client</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Questions Fréquentes
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Tout ce que vous devez savoir pour passer vos commandes en toute sérénité chez SUPERMARKET.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-base font-bold text-slate-900 pr-4">
                    {faq.q}
                  </span>
                  <div className={`p-2 rounded-full bg-slate-100 text-slate-600 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700' : ''
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
