import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, Loader2, User, Mail, Phone, Briefcase, Paperclip } from 'lucide-react';
import { applyToJob } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function JobApplyModal({ isOpen, onClose, job }) {
  const { candidate } = useAuth();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  const [files, setFiles] = useState({
    cv: null,
    lettre_motivation: null,
    diplome: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Prefill candidate data if logged in
  useEffect(() => {
    if (candidate) {
      setFormData({
        nom: candidate.nom || '',
        prenom: candidate.prenom || '',
        email: candidate.email || '',
        telephone: candidate.telephone || '',
      });
    }
  }, [candidate, isOpen]);

  if (!isOpen || !job) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];

      // Validate max file size (5 MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`Le fichier "${file.name}" dépasse la taille maximale autorisée de 5 Mo.`);
        return;
      }

      setErrorMessage('');
      setFiles((prev) => ({ ...prev, [name]: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim()) {
      setErrorMessage("Veuillez renseigner votre nom, prénom et e-mail.");
      return;
    }

    if (!files.cv) {
      setErrorMessage("Le dépôt de votre CV est obligatoire (max 5 Mo, format PDF ou Word).");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('nom', formData.nom.trim());
      data.append('prenom', formData.prenom.trim());
      data.append('email', formData.email.trim());
      if (formData.telephone.trim()) {
        data.append('telephone', formData.telephone.trim());
      }
      data.append('cv', files.cv);

      if (files.lettre_motivation) {
        data.append('lettre_motivation', files.lettre_motivation);
      }
      if (files.diplome) {
        data.append('diplome', files.diplome);
      }

      await applyToJob(job.id, data);

      setSuccessMessage("Votre candidature a été transmise avec succès aux services Ressources Humaines de Super-Market Sarl.");
      
      // Reset form after short delay
      setTimeout(() => {
        setFiles({ cv: null, lettre_motivation: null, diplome: null });
      }, 2000);
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMessage(typeof err === 'string' ? err : (err.message || "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Postuler à l'offre</h2>
              <p className="text-xs text-slate-300 font-medium truncate max-w-md">{job.titre}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Success Banner */}
          {successMessage ? (
            <div className="py-8 px-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Candidature Envoyée !</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md"
                >
                  Fermer la fenêtre
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Personal Info Grid */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-600" />
                  <span>Vos Informations Personnelles</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      required
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder="Ex: Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      name="prenom"
                      required
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder="Ex: John"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse E-mail *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ex: candidat@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      placeholder="Ex: +237 600 00 00 00"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Documents Upload Section */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Paperclip className="w-4 h-4 text-brand-600" />
                  <span>Documents & Pièces Jointes (Max 5 Mo chacun)</span>
                </h3>

                {/* CV Input (Required) */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-600" />
                        <span className="text-sm font-bold text-slate-800">Curriculum Vitae (CV) *</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Formats acceptés: PDF, DOC, DOCX</p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-brand-500 text-slate-700 font-semibold text-xs shadow-sm transition-all">
                      <Upload className="w-4 h-4 text-brand-600" />
                      <span>{files.cv ? files.cv.name : "Sélectionner un fichier"}</span>
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Letter Input (Optional) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Lettre de Motivation</span>
                      <p className="text-xs text-slate-500">Optionnel (PDF ou Word)</p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{files.lettre_motivation ? files.lettre_motivation.name : "Ajouter la lettre"}</span>
                      <input
                        type="file"
                        name="lettre_motivation"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Diploma Input (Optional) */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Diplôme(s) ou Attestations</span>
                      <p className="text-xs text-slate-500">Optionnel (PDF ou Image)</p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs transition-all">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{files.diplome ? files.diplome.name : "Ajouter diplôme"}</span>
                      <input
                        type="file"
                        name="diplome"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-700/20 disabled:opacity-60 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <span>Soumettre ma candidature</span>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
