import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Menu, X, Facebook, PhoneCall, ChevronRight } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function Navbar({ onOpenWhatsAppModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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
    { name: 'Catalogue Produits', path: '/catalogue' },
    { name: 'Nos Agences', path: '/#agences' },
    { name: 'Pourquoi Nous', path: '/#pourquoi-nous' },
    { name: 'Témoignages', path: '/#temoignages' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled ? 'glass-header shadow-md py-3' : 'bg-white/90 backdrop-blur-md py-4 border-b border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-brand-700 transition-colors">
                SUPER<span className="text-brand-600">MARKET</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                Distribution Agro-Alimentaire
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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
          <div className="hidden lg:flex items-center gap-3">
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/Super-Market-Sarl"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title="Suivez Super-Market Sarl sur Facebook"
              aria-label="Facebook Page Super-Market Sarl"
            >
              <Facebook className="w-5 h-5" />
            </a>

            {/* Direct Phone Call */}
            <a
              href="tel:+237690000000"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-600" />
              <span>Yaoundé</span>
            </a>

            {/* WhatsApp CTA Button */}
            <button
              onClick={() => onOpenWhatsAppModal?.(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Commander sur WhatsApp</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => onOpenWhatsAppModal?.(null)}
              className="p-2 rounded-lg bg-emerald-600 text-white shadow-sm"
              aria-label="Commander via WhatsApp"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-brand-50 hover:text-brand-700"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <a
              href="https://www.facebook.com/Super-Market-Sarl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 font-medium hover:text-blue-600"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span>Super-Market Sarl (Facebook)</span>
            </a>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenWhatsAppModal?.(null);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Commander sur WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
