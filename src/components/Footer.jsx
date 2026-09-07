import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Phone, MapPin, Clock, ArrowUp, MessageSquare } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                SUPER<span className="text-emerald-500">MARKET</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Votre partenaire privilégié pour l'approvisionnement en produits agro-alimentaires et d'épicerie à Yaoundé. Vente en gros et au détail.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/Super-Market-Sarl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Facebook Page Super-Market Sarl"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Contact WhatsApp SUPERMARKET"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Agences Yaoundé */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Nos Agences Yaoundé</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-semibold">Agence Essos:</strong> Rue des Écoles, Bastos/Essos
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-semibold">Agence Mvog-Mbi:</strong> Marché Mvog-Mbi
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 font-semibold">Agence Tsinga (Siège):</strong> Avenue Tsinga
                </div>
              </li>
            </ul>
          </div>

          {/* Service Client & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Service Client & WhatsApp</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standard : +237 690 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Horaires : 7j/7 — 07h30 à 20h30</span>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-500 shrink-0" />
                <a 
                  href="https://www.facebook.com/Super-Market-Sarl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline text-slate-300"
                >
                  Facebook: Super-Market Sarl
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Navigation Rapide</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Accueil</Link></li>
              <li><Link to="/catalogue" className="hover:text-emerald-400 transition-colors">Catalogue Produits (270)</Link></li>
              <li><a href="/#agences" className="hover:text-emerald-400 transition-colors">Nos Agences</a></li>
              <li><a href="/#pourquoi-nous" className="hover:text-emerald-400 transition-colors">Pourquoi Nous</a></li>
              <li><a href="/#faq" className="hover:text-emerald-400 transition-colors">F.A.Q</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SUPERMARKET Sarl — Distributeur Agro-Alimentaire. Tous droits réservés.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border border-slate-800"
          >
            <span>Haut de page</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
