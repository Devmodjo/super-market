import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function CustomerAuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const { 
    currentUser, 
    customerProfile, 
    isAuthenticated,
    isCatalogueManager,
    isErpUser,
    loginWithEmail, 
    registerWithEmail, 
    loginWithGoogle, 
    logout, 
    saveProfile 
  } = useCustomerAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 'login'); // 'login' | 'register' | 'profile'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register / Profile form state
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    ville: 'Yaoundé',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync profile when opened or user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setActiveTab('profile');
      setFormData({
        nom: customerProfile.nom || '',
        prenom: customerProfile.prenom || '',
        telephone: customerProfile.telephone || '',
        adresse: customerProfile.adresse || '',
        ville: customerProfile.ville || 'Yaoundé',
        email: currentUser?.email || '',
        password: '',
        confirmPassword: '',
      });
    } else {
      setActiveTab(initialTab || 'login');
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isAuthenticated, customerProfile, currentUser, isOpen, initialTab]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginWithEmail(loginEmail, loginPassword);
      setSuccessMsg('Connexion réussie !');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Email ou mot de passe incorrect.');
      } else {
        setErrorMsg(err.message || 'Erreur lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.telephone.trim()) {
      setErrorMsg('Veuillez renseigner votre numéro de téléphone.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await registerWithEmail(formData.email, formData.password, {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        ville: formData.ville,
      });
      setSuccessMsg('Compte client créé avec succès ! Vos infos seront pré-remplies.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Cette adresse email est déjà associée à un compte.');
      } else {
        setErrorMsg(err.message || 'Erreur lors de la création de compte.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Connecté avec Google avec succès !');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Erreur de connexion Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfile({
      nom: formData.nom,
      prenom: formData.prenom,
      telephone: formData.telephone,
      adresse: formData.adresse,
      ville: formData.ville,
    });
    setSuccessMsg('Profil mis à jour ! Vos prochaines commandes utiliseront ces données.');
    setTimeout(() => {
      setSuccessMsg('');
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {isAuthenticated ? (isCatalogueManager ? 'Gestionnaire Catalogue' : 'Espace Client') : 'Connexion & Commande Facile'}
                  {isCatalogueManager && (
                    <span className="text-[10px] uppercase tracking-wider bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                      Catalogue ERP
                    </span>
                  )}
                </h3>
                <p className="text-xs text-emerald-100">
                  {isAuthenticated 
                    ? `Connecté : ${currentUser?.displayName || currentUser?.email || currentUser?.username}`
                    : 'Enregistrez vos coordonnées pour commander en 1 clic'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs (if not authenticated) */}
          {!isAuthenticated && (
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
                  activeTab === 'login'
                    ? 'border-emerald-600 text-emerald-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Se connecter
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
                className={`flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2 ${
                  activeTab === 'register'
                    ? 'border-emerald-600 text-emerald-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Créer un compte
              </button>
            </div>
          )}

          <div className="p-6">
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB: LOGIN */}
            {!isAuthenticated && activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email ou Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Email ou identifiant (ex: gestionnaire_catalogue)"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Se connecter'}
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="border-t border-slate-200 w-full" />
                  <span className="bg-white px-3 text-xs text-slate-400 uppercase font-medium">Ou</span>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-sm text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continuer avec Google
                </button>
              </form>
            )}

            {/* TAB: REGISTER */}
            {!isAuthenticated && activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      required
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Ex: Mbarga"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      placeholder="Ex: Jean"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="690 00 00 00"
                        className="w-full pl-8 pr-2 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Yaoundé"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse / Quartier de livraison</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      placeholder="Ex: Essos, Montée chapelle"
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="jean.mbarga@gmail.com"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmer</label>
                    <input
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Créer mon compte client'}
                </button>
              </form>
            )}

            {/* TAB: PROFILE (WHEN LOGGED IN) */}
            {isAuthenticated && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs text-emerald-800">
                    Ces informations seront <b>automatiquement insérées</b> à chacune de vos commandes sur WhatsApp et dans le système de livraison.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => handleInputChange('nom', e.target.value)}
                      placeholder="Nom de famille"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => handleInputChange('prenom', e.target.value)}
                      placeholder="Prénom"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone de livraison</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.telephone}
                        onChange={(e) => handleInputChange('telephone', e.target.value)}
                        placeholder="690 00 00 00"
                        className="w-full pl-8 pr-2 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Ville</label>
                    <input
                      type="text"
                      value={formData.ville}
                      onChange={(e) => handleInputChange('ville', e.target.value)}
                      placeholder="Yaoundé"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse / Repère habituel</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      placeholder="Ex: Essos, Face Pharmacie du Soleil"
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    Enregistrer mes informations
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-sm transition-all flex items-center gap-1.5"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
