import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Package, Tag, DollarSign, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Upload, Trash2, Link } from 'lucide-react';
import { addCatalogProduct } from '../utils/api';

export default function AddCatalogProductModal({ isOpen, onClose, onProductAdded, existingCategories = [] }) {
  const [formData, setFormData] = useState({
    nom: '',
    reference: '',
    prix: '',
    prix_achat: '',
    categorie_nom: existingCategories.find(c => c.name !== 'Toutes')?.name || 'Épicerie',
    description: '',
    image_url: '',
    suivi_stock: false,
    stock_initial: '',
  });

  const [imageSource, setImageSource] = useState('local'); // 'local' ou 'url'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, etc.).');
        return;
      }
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom.trim()) {
      setErrorMsg('Veuillez renseigner le nom ou la désignation du produit.');
      return;
    }
    if (!formData.prix || isNaN(formData.prix) || Number(formData.prix) <= 0) {
      setErrorMsg('Veuillez renseigner un prix de vente valide.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const payload = new FormData();
      payload.append('designation', formData.nom.trim());
      payload.append('nom', formData.nom.trim());
      payload.append('reference', formData.reference.trim());
      payload.append('prix_vente', Number(formData.prix));
      payload.append('prix', Number(formData.prix));
      payload.append('prix_achat', formData.prix_achat ? Number(formData.prix_achat) : 0);
      payload.append('categorie_nom', formData.categorie_nom.trim());
      payload.append('description_catalogue', formData.description.trim());
      payload.append('suivi_stock', formData.suivi_stock ? '1' : '0');
      payload.append('stock_initial', formData.suivi_stock && formData.stock_initial ? Number(formData.stock_initial) : 0);

      if (imageSource === 'local' && selectedFile) {
        payload.append('image', selectedFile);
        payload.append('photo', selectedFile);
      } else if (formData.image_url.trim()) {
        payload.append('image_url', formData.image_url.trim());
      }

      const res = await addCatalogProduct(payload);

      if (res && res.success) {
        setSuccessMsg(res.message || 'Produit ajouté avec succès au catalogue !');
        setTimeout(() => {
          setSuccessMsg('');
          handleRemoveFile();
          if (onProductAdded) onProductAdded();
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res?.error || "Erreur lors de l'enregistrement du produit.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || "Erreur de connexion avec l'ERP.");
    } finally {
      setIsLoading(false);
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-emerald-700 to-teal-800 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Ajouter au Catalogue</h3>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                    Gestionnaire
                  </span>
                </div>
                <p className="text-xs text-emerald-100">
                  Ajout d'un article visible sur le site vitrine (même hors stock)
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
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Désignation / Nom de l'article <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Package className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    placeholder="Ex: Pâte à tartiner ChocoPlus 400g"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prix de vente (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      step="any"
                      value={formData.prix}
                      onChange={(e) => handleChange('prix', e.target.value)}
                      placeholder="2500"
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Référence (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.reference}
                    onChange={(e) => handleChange('reference', e.target.value)}
                    placeholder="Ex: CAT-0045"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catégorie
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={formData.categorie_nom}
                    onChange={(e) => handleChange('categorie_nom', e.target.value)}
                    placeholder="Ex: Épicerie, Boissons, Hygiène..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description vitrine (Optionnel)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Présentation du produit pour les clients de la vitrine..."
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                  />
                </div>
              </div>

              {/* Option Suivi Stock Physique ERP */}
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.suivi_stock}
                    onChange={(e) => handleChange('suivi_stock', e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Gérer et comptabiliser en stock physique dans l'ERP
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed mt-0.5">
                      Laissez décoché pour les fruits, légumes frais, piment ou produits sans gestion de stock physique. Le produit apparaîtra dans le catalogue vitrine sans mention de stock.
                    </span>
                  </div>
                </label>

                {formData.suivi_stock && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center gap-3">
                    <label className="text-xs font-semibold text-slate-700 shrink-0">
                      Quantité initiale en stock :
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={formData.stock_initial}
                      onChange={(e) => handleChange('stock_initial', e.target.value)}
                      placeholder="Ex: 50"
                      className="w-28 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-500 font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Section Image du produit */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Photo du produit (Optionnel)
                  </label>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageSource('local')}
                      className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                        imageSource === 'local'
                          ? 'bg-white text-emerald-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      Appareil
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSource('url')}
                      className={`px-2 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                        imageSource === 'url'
                          ? 'bg-white text-emerald-700 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      <Link className="w-3 h-3" />
                      Lien URL
                    </button>
                  </div>
                </div>

                {imageSource === 'local' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {previewUrl ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                        <img
                          src={previewUrl}
                          alt="Aperçu"
                          className="w-14 h-14 object-cover rounded-xl border border-emerald-300 shadow-sm shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {selectedFile?.name || 'Image sélectionnée'}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            {selectedFile?.size ? (selectedFile.size / 1024).toFixed(1) + ' Ko' : 'Prête à publier'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          title="Supprimer la photo"
                          className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-2xl p-4 text-center cursor-pointer transition-all group"
                      >
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center text-slate-500 group-hover:text-emerald-700 transition-colors">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-700 group-hover:text-emerald-800">
                          Sélectionner une photo sur votre appareil
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Depuis votre téléphone ou ordinateur (JPG, PNG, WebP)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <ImageIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => handleChange('image_url', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publier sur le catalogue'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
