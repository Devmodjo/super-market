import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Briefcase, Clock, FileText, CheckCircle, XCircle, AlertCircle, LogOut, RefreshCw } from 'lucide-react';
import { getCandidateApplications } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function CandidateDashboardModal({ isOpen, onClose }) {
  const { candidate, logout } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getCandidateApplications();
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && candidate) {
      fetchApplications();
    }
  }, [isOpen, candidate]);

  if (!isOpen || !candidate) return null;

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'accepté':
      case 'retenue':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Candidature Retenue
          </span>
        );
      case 'entretien':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Convoqué en Entretien
          </span>
        );
      case 'échec':
      case 'refusee':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Non Retenue
          </span>
        );
      case 'en_attente':
      case 'nouvelle':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            En cours d'étude
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Espace Candidat</h2>
              <p className="text-xs text-slate-400">Suivi personnel de vos candidatures</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => logout()}
              title="Déconnexion"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Candidate Profile Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {candidate.prenom} {candidate.nom}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.email}
                </span>
                {candidate.telephone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.telephone}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={fetchApplications}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>
          </div>

          {/* Applications List Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <span>Mes Candidatures Soumises ({applications.length})</span>
            </h4>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                Chargement de votre historique de candidatures...
              </div>
            ) : applications.length === 0 ? (
              <div className="py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h5 className="text-sm font-bold text-slate-700">Aucune candidature enregistrée</h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Vous n'avez pas encore postulé à une offre d'emploi. Parcourez la liste des postes ouverts et tentez votre chance !
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-brand-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h5 className="font-bold text-slate-900 text-base">
                        {app.offre_titre || `Offre #${app.offre}`}
                      </h5>
                      
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Postulé le : {new Date(app.date_candidature).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Documents badges */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {app.cv && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            <FileText className="w-3 h-3 text-slate-500" />
                            CV joint
                          </span>
                        )}
                        {app.lettre_motivation && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            <FileText className="w-3 h-3 text-slate-500" />
                            Lettre de motivation
                          </span>
                        )}
                        {app.diplome && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            <FileText className="w-3 h-3 text-slate-500" />
                            Diplôme
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {getStatusBadge(app.statut)}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
