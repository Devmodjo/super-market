import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppModal from './components/WhatsAppModal';
import CustomerAuthModal from './components/CustomerAuthModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import JobsPage from './pages/JobsPage';
import { AuthProvider } from './context/AuthContext';
import { CustomerAuthProvider } from './context/CustomerAuthContext';

function ScrollToHashElement() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);

  return null;
}

function MobileHandler({ isModalOpen, closeModal, isAuthModalOpen, closeAuthModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Configuration barre de statut et écran de chargement natifs
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#059669' }).catch(() => {});
    SplashScreen.hide().catch(() => {});

    // Gestion de la touche retour physique Android
    const backListener = CapApp.addListener('backButton', () => {
      if (isModalOpen) {
        closeModal();
      } else if (isAuthModalOpen) {
        closeAuthModal();
      } else if (location.pathname !== '/') {
        navigate(-1);
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      backListener.then(handle => handle.remove()).catch(() => {});
    };
  }, [isModalOpen, isAuthModalOpen, location.pathname, navigate, closeModal, closeAuthModal]);

  return null;
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <BrowserRouter>
          <ScrollToHashElement />
          <MobileHandler
            isModalOpen={isModalOpen}
            closeModal={handleCloseModal}
            isAuthModalOpen={isAuthModalOpen}
            closeAuthModal={() => setIsAuthModalOpen(false)}
          />
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
            
            <Navbar 
              onOpenWhatsAppModal={handleOpenModal} 
              onOpenAuthModal={handleOpenAuthModal} 
            />

            <div className="flex-1">
              <Routes>
                <Route 
                  path="/" 
                  element={<HomePage onOpenWhatsAppModal={handleOpenModal} />} 
                />
                <Route 
                  path="/catalogue" 
                  element={<CatalogPage onOpenWhatsAppModal={handleOpenModal} />} 
                />
                <Route 
                  path="/carrieres" 
                  element={<JobsPage />} 
                />
                <Route 
                  path="/jobs" 
                  element={<JobsPage />} 
                />
                <Route 
                  path="/offres" 
                  element={<JobsPage />} 
                />
              </Routes>
            </div>

            <Footer />

            <WhatsAppModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              selectedProduct={selectedProduct}
              onOpenAuthModal={() => handleOpenAuthModal('login')}
            />

            <CustomerAuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              initialTab={authModalTab}
            />

          </div>
        </BrowserRouter>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}
