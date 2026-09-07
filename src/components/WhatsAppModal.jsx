import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Plus, Minus, MapPin, Building2, Phone, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../utils/productData';
import { validateCameroonPhone, buildWhatsAppUrl } from '../utils/whatsapp';

export default function WhatsAppModal({ isOpen, onClose, selectedProduct }) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState('Livraison sur site');
  const [address, setAddress] = useState('');
  const [agencyChoice, setAgencyChoice] = useState('Agence Essos');
  
  // Validation errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameInputRef = useRef(null);

  // Reset form when modal opens or selectedProduct changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setErrors({});
      setIsSubmitting(false);
      // Auto focus on name input
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, selectedProduct]);

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

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
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

    const url = buildWhatsAppUrl({
      product: selectedProduct || { nom: 'Commande Groupée / Informations', prix: 0, reference: 'CAT' },
      quantity,
      customerName,
      phone,
      deliveryMode: targetDelivery,
      address
    });

    // Micro interaction delay before opening tab
    setTimeout(() => {
      window.open(url, '_blank');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const unitPrice = selectedProduct?.prix || 0;
  const totalPrice = unitPrice * quantity;

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
