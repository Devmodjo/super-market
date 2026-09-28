import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
