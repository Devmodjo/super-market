import React from 'react';
import { Briefcase, MapPin, Calendar, Clock, DollarSign, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

export default function JobCard({ job, onSelectJob, onApply }) {
  const {
    id,
    titre,
    description,
    departement,
    type_contrat,
    lieu,
    salaire_de_base,
    competences,
    date_fin,
  } = job;

  // Format skills list from comma-separated string
  const skillsList = competences 
    ? competences.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Gradient accent bar on hover */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200/60">
            <Building2 className="w-3.5 h-3.5" />
            {departement || "Recrutement"}
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <Briefcase className="w-3.5 h-3.5" />
            {type_contrat || "CDI"}
          </span>

          {lieu && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {lieu}
            </span>
          )}
        </div>

        {/* Job Title */}
        <h3 
          onClick={() => onSelectJob(job)}
          className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors cursor-pointer mb-3 leading-snug line-clamp-2"
        >
          {titre}
        </h3>

        {/* Short Description */}
        <p className="text-slate-600 text-sm line-clamp-3 mb-5 leading-relaxed">
          {description}
        </p>

        {/* Salary & Deadline Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-5 pt-3 border-t border-slate-100">
          {salaire_de_base && (
            <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50/70 px-2.5 py-1 rounded-md">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{salaire_de_base}</span>
            </div>
          )}

          {date_fin && (
            <div className="flex items-center gap-1 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Clôture : {new Date(date_fin).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>

        {/* Skills Pills */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {skillsList.slice(0, 4).map((skill, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400">
                +{skillsList.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => onSelectJob(job)}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:border-brand-500 text-slate-700 hover:text-brand-700 font-semibold text-xs transition-all duration-200 text-center"
        >
          Voir le détail
        </button>

        <button
          onClick={() => onApply(job)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-700 to-brand-600 hover:from-brand-800 hover:to-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-700/20 hover:shadow-lg transition-all duration-200"
        >
          <span>Postuler</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
