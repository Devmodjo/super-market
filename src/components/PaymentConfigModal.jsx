import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Check, Copy, Save, AlertCircle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { getPaymentNumbers, updatePaymentNumbers } from '../utils/api';

export default function PaymentConfigModal({ isOpen, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    orange_money: {
      numero: '+237 690 00 00 00',
      nom: 'Supermarket SARL',
      code_marchand: '345892',
      instructions: 'Composez le #150*47*345892*Montant# ou effectuez un paiement marchand via Orange Money.'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setIsLoading(true);
      getPaymentNumbers()
        .then((data) => {
          if (data) {
            setFormData({
              orange_money: {
                numero: data.orange_money?.numero || '+237 690 00 00 00',
                nom: data.orange_money?.nom || 'Supermarket SARL',
                code_marchand: data.orange_money?.code_marchand || '345892',
                instructions: data.orange_money?.instructions || 'Composez le #150*47*345892*Montant#'
              }
            });
          }
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFieldChange = (operator, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [operator]: {
        ...prev[operator],
        [field]: value
      }
    }));
    setErrorMsg('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.orange_money.numero.trim()) {
      setErrorMsg('Veuillez renseigner un numéro de téléphone pour Orange Money.');
      return;
    }
    if (!formData.orange_money.code_marchand?.trim()) {
      setErrorMsg('Veuillez renseigner un Code Marchand Orange Money.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');
    try {
      const res = await updatePaymentNumbers(formData);
      if (res && res.success) {
        setSuccessMsg(res.message || 'Paramètres Orange Money enregistrés avec succès !');
        if (onUpdated) onUpdated(res.payment_numbers || formData);
        setTimeout(() => {
          setSuccessMsg('');
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res?.error || "Erreur lors de l'enregistrement des paramètres.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || "Erreur de connexion avec l'ERP.");
    } finally {
      setIsSaving(false);
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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 z-10 my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  Paramètres Paiement Orange Money
                </h3>
                <p className="text-xs text-orange-100">
                  Code Marchand et numéro présentés aux clients sur la vitrine
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

          <div className="p-6">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <span className="text-sm font-medium">Chargement des paramètres...</span>
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-sm text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Ce Code Marchand et ces coordonnées Orange Money s'affichent automatiquement aux clients lorsqu'ils choisissent de <strong>Payer</strong> sur le catalogue vitrine.
                  </span>
                </div>

                {/* Section Orange Money & Code Marchand */}
                <div className="border border-orange-200 bg-orange-50/30 rounded-2xl p-4.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500 ring-4 ring-orange-100" />
                      <h4 className="text-sm font-extrabold text-orange-900 tracking-tight">
                        Orange Money Cameroun (Marchand)
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                      #150#
                    </span>
                  </div>

                  {/* Code Marchand Field */}
                  <div className="bg-white p-3 rounded-xl border border-orange-200">
                    <label className="block text-[11px] font-extrabold text-orange-950 uppercase mb-1">
                      Code Marchand Orange Money <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.orange_money.code_marchand || ''}
                        onChange={(e) => handleFieldChange('orange_money', 'code_marchand', e.target.value)}
                        placeholder="Ex: 345892"
                        className="w-full px-3 py-2 text-base font-black font-mono tracking-wider rounded-xl border border-orange-300 bg-orange-50/30 text-orange-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(formData.orange_money.code_marchand || '', 'om_cm')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-orange-600"
                        title="Copier le code marchand"
                      >
                        {copiedKey === 'om_cm' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Code à présenter aux clients lors des commandes sur le site et à la livraison.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Numéro de téléphone OM <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.orange_money.numero}
                          onChange={(e) => handleFieldChange('orange_money', 'numero', e.target.value)}
                          placeholder="+237 690 00 00 00"
                          className="w-full px-3 py-2 text-sm rounded-xl border border-orange-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono font-semibold"
                        />
                        <button
                          type="button"
                          onClick={() => handleCopy(formData.orange_money.numero, 'om_num')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-orange-600"
                          title="Copier le numéro"
                        >
                          {copiedKey === 'om_num' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Nom du Titulaire / Compte
                      </label>
                      <input
                        type="text"
                        value={formData.orange_money.nom}
                        onChange={(e) => handleFieldChange('orange_money', 'nom', e.target.value)}
                        placeholder="Ex: Supermarket SARL"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-orange-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Instructions & Syntaxe USSD pour le client
                    </label>
                    <textarea
                      rows="2"
                      value={formData.orange_money.instructions}
                      onChange={(e) => handleFieldChange('orange_money', 'instructions', e.target.value)}
                      placeholder="Ex: Composez le #150*47*345892*Montant# ou effectuez un paiement marchand..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-orange-200 bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les numéros</span>
                      </>
                    )}
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
