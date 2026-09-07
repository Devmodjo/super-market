import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Sparkles, ExternalLink } from 'lucide-react';
import { OFFICIAL_COMMUNITY_LINK } from '../utils/whatsapp';

export default function WhatsAppCommunityBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white relative overflow-hidden shadow-2xl">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-accent-400/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-white/20">
          
          {/* Left Text Info */}
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Communauté VIP SUPERMARKET</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Rejoignez notre communauté WhatsApp Officielle !
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Soyez informé en avant-première des arrivages de riz, d'huiles et de conserves, des promotions hebdomadaires et des offres de gros réservées aux membres.
            </p>
          </div>

          {/* Right Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <motion.a
              href={OFFICIAL_COMMUNITY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base flex items-center gap-3 shadow-xl shadow-black/20 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-950 text-emerald-400 flex items-center justify-center animate-pulse-subtle">
                <MessageSquare className="w-5 h-5 fill-emerald-400" />
              </div>
              <span>Rejoindre la communauté</span>
              <ExternalLink className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>

        </div>
      </div>
    </section>
  );
}
