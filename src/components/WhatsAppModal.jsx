import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Plus, Minus, MapPin, Building2, Phone, AlertCircle, CheckCircle2, ShoppingBag, UserCheck, LogIn, Smartphone, Copy, Check, ShieldCheck, Sparkles, CreditCard, Upload, Camera, Trash2, Image as ImageIcon } from 'lucide-react';
import apiClient, { getPaymentNumbers } from '../utils/api';
import { formatPrice } from '../utils/productData';
import { validateCameroonPhone, buildWhatsAppUrl } from '../utils/whatsapp';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export default function WhatsAppModal({ isOpen, onClose, selectedProduct, onOpenAuthModal }) {
  const { currentUser, customerProfile, isAuthenticated, saveProfile } = useCustomerAuth();
  
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState('Livraison sur site');
  const [address, setAddress] = useState('');
  const [agencyChoice, setAgencyChoice] = useState('Agence Essos');
  
  // Payment Mode: 'livraison' vs 'avance' (Payer)
  const [paymentType, setPaymentType] = useState('livraison');
  const [selectedOperator, setSelectedOperator] = useState('orange_money');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [paymentNumbers, setPaymentNumbers] = useState({
    orange_money: {
      numero: '+237 690 00 00 00',
      nom: 'Supermarket SARL',
      code_marchand: '345892',
      instructions: 'Composez le #150*47*345892*Montant# ou effectuez un paiement marchand via Orange Money.'
    }
  });
  const [copiedKey, setCopiedKey] = useState(null);

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load latest payment numbers from backend
  useEffect(() => {
    if (isOpen) {
      getPaymentNumbers()
        .then((data) => {
          if (data) setPaymentNumbers(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Pre-fill profile and reset form when modal opens or selectedProduct changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setErrors({});
      setIsSubmitting(false);
      setPaymentType('livraison');
      setTransactionRef('');
      setScreenshotFile(null);
      setScreenshotPreview(null);

      if (isAuthenticated && customerProfile) {
        const fullName = `${customerProfile.prenom || ''} ${customerProfile.nom || ''}`.trim() || currentUser?.displayName || '';
        if (fullName) setCustomerName(fullName);
        if (customerProfile.telephone) setPhone(customerProfile.telephone);
        if (customerProfile.adresse) setAddress(customerProfile.adresse);
      }

      // Auto focus on name input
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, selectedProduct, isAuthenticated, customerProfile, currentUser]);

  // Handle Escape Key to exit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const previewUrl = URL.createObjectURL(file);
      setScreenshotPreview(previewUrl);
      if (errors.screenshot) {
        setErrors((prev) => ({ ...prev, screenshot: null }));
      }
    }
  };

  const handleRemoveScreenshot = () => {
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotFile(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!customerName.trim()) {
      newErrors.customerName = "Veuillez saisir votre nom ou le nom de votre entreprise.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire.";
    } else if (!validateCameroonPhone(phone)) {
      newErrors.phone = "Veuillez entrer un numéro valide (ex: 690000000 ou +237 690 00 00 00).";
    }

    if (deliveryMode === 'Livraison sur site' && !address.trim()) {
      newErrors.address = "Veuillez préciser le quartier ou repère de livraison à Yaoundé.";
    }

    // Exigence stricte : la capture d'écran du SMS de paiement est obligatoire en cas de paiement
    if (paymentType === 'avance' && !screenshotFile) {
      newErrors.screenshot = "Veuillez joindre la capture d'écran du message SMS reçu d'Orange Money confirmant votre paiement.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const targetDelivery = deliveryMode === 'Retrait en agence' 
      ? `Retrait en agence (${agencyChoice})` 
      : 'Livraison sur site';

    const isAvance = paymentType === 'avance';
    const omData = paymentNumbers?.orange_money || {};
    const merchantCode = omData.code_marchand || '345892';

    const paymentInfo = isAvance 
      ? `Payé via Orange Money (Code Marchand: ${merchantCode} / ${omData.numero || '+237 690 00 00 00'})${transactionRef.trim() ? ` — Réf: ${transactionRef.trim()}` : ''} [Capture d'écran du SMS jointe]`
      : `Paiement à la livraison (Espèces ou Orange Money au livreur)`;

    const url = buildWhatsAppUrl({
      product: selectedProduct || { nom: 'Commande Groupée / Informations', prix: 0, reference: 'CAT' },
      quantity,
      customerName,
      phone,
      deliveryMode: targetDelivery,
      address,
      paymentInfo
    });

    // Liaison automatique avec l'ERP Supermarket (envoi multipart avec la capture d'écran)
    try {
      const formData = new FormData();
      formData.append('nom_client', customerName);
      formData.append('telephone', phone);
      formData.append('adresse', address);
      formData.append('ville', customerProfile?.ville || 'Yaoundé');
      formData.append('email', currentUser?.email || '');
      formData.append('mode_livraison', targetDelivery);
      formData.append('source', 'vitrine');
      formData.append('mode_reglement', isAvance ? selectedOperator : 'especes_livraison');
      formData.append('est_payee_avance', isAvance ? 'true' : 'false');
      formData.append('reference_paiement', transactionRef.trim());
      formData.append('article_id', selectedProduct?.id || '');
      formData.append('reference', selectedProduct?.reference || '');
      formData.append('quantite', quantity);

      const articlesList = [
        {
          article_id: selectedProduct?.id || null,
          reference: selectedProduct?.reference || '',
          designation: selectedProduct?.nom || selectedProduct?.designation || 'Commande Vitrine',
          quantite: quantity,
          prix_unitaire: unitPrice
        }
      ];
      formData.append('articles', JSON.stringify(articlesList));

      if (isAvance && screenshotFile) {
        formData.append('preuve_paiement', screenshotFile);
      }

      apiClient.post('/api/public/orders/', formData).then(() => {
        console.log('✅ Commande synchronisée dans l\'ERP Supermarket');
      }).catch(err => {
        console.warn('Bridge ERP:', err?.response?.data || err?.message);
      });
    } catch (e) {
      console.warn('Erreur envoi ERP:', e);
    }

    // Sauvegarde automatique du profil si connecté
    if (isAuthenticated) {
      saveProfile({
        ...customerProfile,
        nom: customerName,
        telephone: phone,
        adresse: address,
      });
    }

    // Micro interaction delay before opening tab
    setTimeout(() => {
      window.open(url, '_blank');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const unitPrice = selectedProduct?.prix || 0;
  const totalPrice = unitPrice * quantity;
  const totalAmount = totalPrice;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-green-600 px-6 py-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <MessageSquare className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-extrabold tracking-tight">
                  Commande Express WhatsApp
                </h3>
                <p className="text-xs text-emerald-100">
                  Confirmation et envoi direct à l'agence SUPERMARKET
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all transform hover:rotate-90"
              aria-label="Fermer la modale"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Scroll Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
            
            {/* Selected Product Readonly Highlight Banner */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  {selectedProduct ? `Réf: ${selectedProduct.reference}` : 'Demande Générale'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {selectedProduct ? selectedProduct.nom : 'Sélectionnez un produit ou faites une demande'}
                </h4>
                {selectedProduct && (
                  <div className="mt-1 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Prix unitaire: <strong>{formatPrice(unitPrice)}</strong></span>
                    <span className="text-emerald-700 font-extrabold text-sm">Total: {formatPrice(totalPrice)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Account Auto-Fill Banner */}
            {isAuthenticated ? (
              <div className="bg-emerald-50 border border-emerald-200/90 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vos coordonnées sont pré-remplies depuis votre compte client.</span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Déjà client ? <b>Connectez-vous</b> pour pré-remplir automatiquement.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal?.();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connexion</span>
                </button>
              </div>
            )}

            {/* Field 1: Customer Name */}
            <div>
              <label htmlFor="customerName" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Nom complet ou Entreprise <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="customerName"
                  ref={nameInputRef}
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (errors.customerName) setErrors({ ...errors, customerName: null });
                  }}
                  placeholder="Ex: Jean Dupont / Restaurant Le Bastos"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.customerName 
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                      : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>
              {errors.customerName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* Field 2: Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Numéro WhatsApp (Cameroun) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  placeholder="+237 690 00 00 00 ou 690000000"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.phone 
                      ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                      : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* Field 3: Quantity Counter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Quantité souhaitée <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold"
                  aria-label="Diminuer la quantité"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-extrabold text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold"
                  aria-label="Augmenter la quantité"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Field 4: Delivery Mode */}
            <div>
              <label htmlFor="deliveryMode" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Mode de réception <span className="text-red-500">*</span>
              </label>
              <select
                id="deliveryMode"
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="Livraison sur site">Livraison sur site (Domicile / Entreprise à Yaoundé)</option>
                <option value="Retrait en agence">Retrait en agence (Gratuit)</option>
              </select>
            </div>

            {/* Conditional Delivery Address or Agency Choice */}
            {deliveryMode === 'Livraison sur site' ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label htmlFor="address" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Adresse de livraison / Repère <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <textarea
                    id="address"
                    rows="2"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: null });
                    }}
                    placeholder="Quartier, rue, repère connu (Ex: Bastos, en face de l'école...)"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
                      errors.address 
                        ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                        : 'border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.address}</span>
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label htmlFor="agencyChoice" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Agence de retrait souhaitée
                </label>
                <select
                  id="agencyChoice"
                  value={agencyChoice}
                  onChange={(e) => setAgencyChoice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="Agence Essos">Agence Essos (Rue des Écoles)</option>
                  <option value="Agence Mvog-Mbi">Agence Mvog-Mbi (Marché Mvog-Mbi)</option>
                  <option value="Agence Siège Tsinga">Agence Siège Tsinga (Avenue Tsinga)</option>
                </select>
              </motion.div>
            )}

            {/* Field 5: Modalité de règlement (Livraison vs Payer Orange Money) */}
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Modalité de règlement <span className="text-red-500">*</span>
              </label>

              {/* Mode Toggle Pills */}
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setPaymentType('livraison')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    paymentType === 'livraison'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>À la livraison</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType('avance')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
                    paymentType === 'avance'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Payer</span>
                </button>
              </div>

              {/* Payment Details: Orange Money uniquement avec Code Marchand */}
              {paymentType === 'avance' ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-3.5 bg-gradient-to-br from-amber-50/70 to-orange-50/70 border border-amber-200/90 rounded-2xl"
                >
                  <div className="flex items-center justify-between text-xs text-amber-900 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Paiement Orange Money SUPERMARKET :
                    </span>
                    <span className="text-[10px] text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-full font-bold">
                      Validation rapide
                    </span>
                  </div>

                  {/* Orange Money Card with Merchant Code Highlight */}
                  <div className="p-3.5 rounded-xl border border-orange-400 bg-white ring-2 ring-orange-500/20 shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm" />
                        <span className="text-xs font-extrabold text-orange-950 uppercase tracking-wide">Orange Money Cameroun</span>
                      </div>
                      <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded-md">
                        Paiement Marchand #150#
                      </span>
                    </div>

                    {/* Code Marchand Prominent Display */}
                    <div className="bg-orange-50/80 p-2.5 rounded-lg border border-orange-200 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] font-extrabold uppercase text-orange-800 tracking-wider">
                          Code Marchand
                        </span>
                        <span className="font-mono text-base font-black text-orange-600 tracking-wider">
                          {paymentNumbers?.orange_money?.code_marchand || '345892'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentNumbers?.orange_money?.code_marchand || '345892', 'cm')}
                        className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-white px-2.5 py-1.5 rounded-md border border-orange-200 shadow-xs hover:bg-orange-50 transition-colors"
                        title="Copier le code marchand"
                      >
                        {copiedKey === 'cm' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'cm' ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>

                    {/* Instructions USSD */}
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <div className="flex items-center justify-between font-mono bg-slate-50 p-2 rounded border border-slate-200">
                        <span className="text-slate-800 font-bold truncate">
                          #150*47*{paymentNumbers?.orange_money?.code_marchand || '345892'}*{totalAmount}#
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(`#150*47*${paymentNumbers?.orange_money?.code_marchand || '345892'}*${totalAmount}#`, 'ussd')}
                          className="text-slate-500 hover:text-orange-600 pl-2"
                          title="Copier le code USSD"
                        >
                          {copiedKey === 'ussd' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">
                        {paymentNumbers?.orange_money?.instructions || 'Composez la syntaxe ci-dessus sur votre téléphone Orange Money.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                      <span>Titulaire : <strong className="text-slate-800">{paymentNumbers?.orange_money?.nom || 'Supermarket SARL'}</strong></span>
                      <span className="font-mono text-slate-500 text-[10px]">{paymentNumbers?.orange_money?.numero || '+237 690 00 00 00'}</span>
                    </div>
                  </div>

                  {/* Optional Reference Input */}
                  <div className="pt-1">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      ID de Transaction / Référence Orange Money (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="Ex: MP260925.1430.A12345"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-amber-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Renseignez l'identifiant indiqué dans le SMS reçu d'Orange Money.
                    </span>
                  </div>

                  {/* Mandatory SMS Screenshot Upload Zone */}
                  <div className="pt-2 border-t border-amber-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-extrabold text-amber-950 uppercase tracking-wider">
                        Capture d'écran du SMS Orange Money <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[10px] text-orange-700 font-semibold bg-orange-100 px-2 py-0.5 rounded-full">
                        Obligatoire
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-600 mb-2">
                      Prenez une capture d'écran du message SMS reçu d'Orange Money confirmant votre paiement et joignez-la ci-dessous pour validation par le service télévente.
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleScreenshotChange}
                      accept="image/*"
                      className="hidden"
                      id="smsScreenshotInput"
                    />

                    {!screenshotPreview ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          errors.screenshot
                            ? 'border-red-400 bg-red-50/50 hover:bg-red-50'
                            : 'border-amber-300 bg-amber-50/40 hover:bg-amber-100/50 hover:border-amber-400'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Upload className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Cliquez pour joindre la capture d'écran du SMS
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Photo ou capture d'écran : PNG, JPG, JPEG
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border border-emerald-300 bg-emerald-50/60 rounded-2xl p-3 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-200 bg-white shrink-0">
                          <img
                            src={screenshotPreview}
                            alt="Aperçu capture SMS"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 truncate">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{screenshotFile?.name || 'capture_sms.jpg'}</span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            Capture chargée avec succès ({((screenshotFile?.size || 0) / 1024).toFixed(1)} Ko)
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-[10px] font-bold text-amber-800 hover:text-amber-900 underline"
                            >
                              Changer la photo
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              type="button"
                              onClick={handleRemoveScreenshot}
                              className="text-[10px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Retirer</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {errors.screenshot && (
                      <p className="text-xs text-red-600 font-semibold flex items-center gap-1 mt-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.screenshot}</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Vous réglerez en espèces ou par Mobile Money lors de la réception de vos articles.</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all transform active:scale-95 disabled:opacity-50"
              >
                <MessageSquare className="w-5 h-5 fill-white" />
                <span>{isSubmitting ? 'Préparation...' : 'Confirmer et envoyer sur WhatsApp'}</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Un message pré-rempli sera ouvert dans WhatsApp. Aucun paiement requis sur le site.
              </p>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
