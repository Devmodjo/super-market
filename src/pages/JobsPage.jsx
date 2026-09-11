import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Briefcase, MapPin, Building2, Sparkles, User, UserCheck, ChevronRight, X, Calendar, DollarSign, Award, CheckCircle2 } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import JobCard from '../components/JobCard';
import JobApplyModal from '../components/JobApplyModal';
import CandidateAuthModal from '../components/CandidateAuthModal';
import CandidateDashboardModal from '../components/CandidateDashboardModal';
import { getJobs } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function JobsPage() {
  const { candidate, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedContract, setSelectedContract] = useState('');

  // Modals state
  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Fetch jobs on mount
  useEffect(() => {
    async function loadJobs() {
      setLoading(true);
      try {
        const data = await getJobs();
        setJobs(data || []);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  // Unique departments list for filter dropdown
  const departments = useMemo(() => {
    const set = new Set();
    jobs.forEach(j => { if (j.departement) set.add(j.departement); });
    return Array.from(set);
  }, [jobs]);

  // Unique contract types
  const contractTypes = useMemo(() => {
    const set = new Set();
    jobs.forEach(j => { if (j.type_contrat) set.add(j.type_contrat); });
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchQuery = !searchQuery.trim() || 
        job.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.competences && job.competences.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = !selectedDept || job.departement === selectedDept;
      const matchContract = !selectedContract || job.type_contrat === selectedContract;

      return matchQuery && matchDept && matchContract;
    });
  }, [jobs, searchQuery, selectedDept, selectedContract]);

  // Generate Google Jobs Schema.org JSON-LD for structured search indexing
  const googleJobsSchema = useMemo(() => {
    if (jobs.length === 0) return null;
    return {
      "@context": "https://schema.org/",
      "@graph": jobs.map(job => ({
        "@type": "JobPosting",
        "title": job.titre,
        "description": job.description,
        "identifier": {
          "@type": "PropertyValue",
          "name": "Super-Market Sarl",
          "value": `JOB-${job.id}`
        },
        "datePosted": job.date_debut || "2026-09-01",
        "validThrough": job.date_fin || "2026-12-31",
        "employmentType": job.type_contrat === "CDI" ? "FULL_TIME" : "CONTRACTOR",
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Super-Market Sarl",
          "sameAs": "https://super-market.pro",
          "logo": "https://super-market.pro/public/logo.png"
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.lieu || "Douala",
            "addressCountry": "CM"
          }
        },
        "baseSalary": job.salaire_de_base ? {
          "@type": "MonetaryAmount",
          "currency": "XAF",
          "value": {
            "@type": "QuantitativeValue",
            "value": parseFloat(job.salaire_de_base) || 250000,
            "unitText": "MONTH"
          }
        } : undefined
      }))
    };
  }, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* SEO Head & Schema.org JSON-LD for Google Jobs */}
      <SEOHead
        title="Offres d'Emploi & Recrutement — Super-Market Sarl"
        description="Rejoignez Super-Market Sarl, leader de la distribution agro-alimentaire au Cameroun. Découvrez nos postes ouverts et postulez en ligne (Douala, Yaoundé)."
        canonical="https://super-market.pro/carrieres"
        schemaJson={googleJobsSchema}
      />

      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 sm:py-24">
        
        {/* Background Decorative Gradients */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Espace Recrutement & Carrières</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Bâtissez votre avenir chez <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-emerald-400">Super-Market Sarl</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Rejoignez une équipe passionnée au cœur de la première chaîne de distribution agro-alimentaire au Cameroun. Découvrez nos opportunités et évoluez avec nous.
            </p>

            {/* Candidate Login CTA Banner */}
            <div className="pt-4 flex justify-center">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsDashboardOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Mon Espace Candidat ({candidate?.prenom})</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md transition-all"
                >
                  <User className="w-4 h-4 text-brand-400" />
                  <span>Déjà candidat ? Connectez-vous pour suivre vos candidatures</span>
                </button>
              )}
            </div>

          </div>

          {/* Search & Filter Bar Container */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200/80 text-slate-900">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Keyword Search */}
              <div className="md:col-span-6 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un poste, mot-clé, compétence..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
                />
              </div>

              {/* Department Dropdown Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700"
                >
                  <option value="">Tous les départements</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Contract Type Dropdown Filter */}
              <div className="md:col-span-3">
                <select
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-700"
                >
                  <option value="">Tous les contrats</option>
                  {contractTypes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Active filters pill list */}
            {(searchQuery || selectedDept || selectedContract) && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Filtres actifs : {filteredJobs.length} offre(s) correspondante(s)</span>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedDept(''); setSelectedContract(''); }}
                  className="text-brand-600 hover:text-brand-800 font-semibold underline"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}

          </div>

        </div>

      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Offres d'Emploi Actuelles
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Consultez les opportunités ouvertes et postulez en quelques clics
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-200/80 text-slate-700 self-start sm:self-auto">
            {filteredJobs.length} Poste(s) Disponible(s)
          </span>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-16 bg-slate-100 rounded" />
                <div className="h-8 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-xl mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Aucune offre ne correspond à votre recherche</h3>
            <p className="text-sm text-slate-500">
              Essayez de modifier vos critères de recherche ou réinitialisez les filtres pour découvrir toutes nos offres.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedDept(''); setSelectedContract(''); }}
              className="px-5 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-xs shadow"
            >
              Voir toutes les offres disponibles
            </button>
          </div>
        ) : (
          /* Job Offer Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSelectJob={(j) => setSelectedJobForDetail(j)}
                onApply={(j) => setSelectedJobForApply(j)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Detailed Job View Modal */}
      {selectedJobForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-slate-100 my-8">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-white flex items-start justify-between">
              <div className="space-y-2 max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  {selectedJobForDetail.departement || "Recrutement"}
                </span>
                <h2 className="text-2xl font-bold">{selectedJobForDetail.titre}</h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  {selectedJobForDetail.type_contrat && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-brand-400" />
                      {selectedJobForDetail.type_contrat}
                    </span>
                  )}
                  {selectedJobForDetail.lieu && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {selectedJobForDetail.lieu}
                    </span>
                  )}
                  {selectedJobForDetail.salaire_de_base && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-300">
                      <DollarSign className="w-3.5 h-3.5" />
                      {selectedJobForDetail.salaire_de_base}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedJobForDetail(null)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                  Description du Poste
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                  {selectedJobForDetail.description}
                </p>
              </div>

              {/* Required Profile */}
              {selectedJobForDetail.profil_recherche && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                    Profil Recherché
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
                    {selectedJobForDetail.profil_recherche}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedJobForDetail.competences && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-500">
                    Compétences Clés & Prérequis
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForDetail.competences.split(',').map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedJobForDetail(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium text-sm transition-colors"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  const targetJob = selectedJobForDetail;
                  setSelectedJobForDetail(null);
                  setSelectedJobForApply(targetJob);
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm shadow-md shadow-brand-700/20"
              >
                Postuler à cette offre
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Application Form Modal */}
      <JobApplyModal
        isOpen={!!selectedJobForApply}
        onClose={() => setSelectedJobForApply(null)}
        job={selectedJobForApply}
      />

      {/* Candidate Auth Login/Register Modal */}
      <CandidateAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Candidate Applications History Dashboard Modal */}
      <CandidateDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
      />

    </div>
  );
}
