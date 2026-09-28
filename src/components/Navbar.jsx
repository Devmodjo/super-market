import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Menu, X, Facebook, PhoneCall, ChevronRight, Briefcase, User } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function Navbar({ onOpenWhatsAppModal, onOpenAuthModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, customerProfile, isAuthenticated } = useCustomerAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    { name: 'Offres d\'Emploi', path: '/carrieres' },
    { name: 'Nos Agences', path: '/#agences' },
    { name: 'Pourquoi Nous', path: '/#pourquoi-nous' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'glass-header shadow-xs py-1.5' : 'bg-white/95 backdrop-blur-md py-2 border-b border-slate-100/90'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                SUPER<span className="text-brand-600">MARKET</span>
              </span>
              <span className="hidden sm:block text-[9px] font-semibold tracking-wider text-slate-400 uppercase leading-none">
                Distribution Agro-Alimentaire
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive 
                      ? 'text-brand-700 bg-brand-50 font-semibold' 
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Socials & WhatsApp Action CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/Super-Market-Sarl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Suivez Super-Market Sarl sur Facebook"
              aria-label="Facebook Page Super-Market Sarl"
            >
              <Facebook className="w-4 h-4" />
            </a>

            {/* Direct Phone Call */}
            <a
              href="tel:+237694470159"
              title="Appeler : +237 694 47 01 59"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-brand-600" />
              <span>+237 694 47 01 59</span>
            </a>

            {/* Customer Account Buttons */}
            {isAuthenticated ? (
              <button
                onClick={() => onOpenAuthModal?.('profile')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-all shadow-xs"
                title="Mon Espace Client"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span className="max-w-[120px] truncate">
                  {customerProfile.prenom || currentUser?.displayName || currentUser?.username || 'Mon Profil'}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuthModal?.('login')}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 transition-all"
                  title="Se connecter"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => onOpenAuthModal?.('register')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
                  title="Créer un compte client"
                >
                  <span>S'inscrire</span>
                </button>
              </div>
            )}

            {/* WhatsApp CTA Button */}
            <button
              onClick={() => onOpenWhatsAppModal?.(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wide shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>Commander sur WhatsApp</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-1.5 md:hidden">
            {!isAuthenticated ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onOpenAuthModal?.('login')}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Connexion
                </button>
                <button
                  onClick={() => onOpenAuthModal?.('register')}
                  className="px-2 py-1 rounded-md text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal?.('profile')}
                className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700"
                aria-label="Mon Profil Client"
              >
                <User className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onOpenWhatsAppModal?.(null)}
              className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs"
              aria-label="Commander via WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2.5 shadow-xl">
          <div className="flex flex-col space-y-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal?.('login');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAuthModal?.('register');
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                >
                  <span>S'inscrire</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal?.('profile');
                }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-emerald-600 text-emerald-700 font-semibold text-xs hover:bg-emerald-50"
              >
                <User className="w-4 h-4" />
                <span>
                  Mon Compte ({customerProfile.prenom || currentUser?.displayName || 'Client'})
                </span>
              </button>
            )}

            <a
              href="https://www.facebook.com/Super-Market-Sarl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 font-medium hover:text-blue-600"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Super-Market Sarl (Facebook)</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenWhatsAppModal?.(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Commander sur WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
