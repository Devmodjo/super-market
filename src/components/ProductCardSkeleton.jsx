import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col justify-between animate-pulse">
      <div>
        {/* Card Header visual skeleton with shimmer */}
        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-slate-100 via-slate-200/70 to-slate-100 flex flex-col justify-between p-3 relative overflow-hidden">
          {/* Top badges */}
          <div className="flex items-center justify-between">
            <div className="w-14 h-4 rounded-md bg-slate-300/80" />
            <div className="w-16 h-4 rounded-full bg-slate-300/80" />
          </div>
          {/* Bottom badges */}
          <div className="flex items-center justify-between">
            <div className="w-20 h-4 rounded-full bg-slate-300/80" />
            <div className="w-7 h-7 rounded-lg bg-slate-300/80" />
          </div>
        </div>

        {/* Text lines skeleton */}
        <div className="mt-3.5 space-y-2">
          {/* Category */}
          <div className="w-1/3 h-3 rounded bg-slate-200" />
          {/* Title 2 lines */}
          <div className="w-full h-4 rounded bg-slate-200" />
          <div className="w-2/3 h-4 rounded bg-slate-200" />

          {/* Conditionnement & stock */}
          <div className="flex items-center justify-between pt-2">
            <div className="w-24 h-3 rounded bg-slate-200" />
            <div className="w-16 h-3 rounded bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Footer skeleton (price + action button) */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div className="w-10 h-3 rounded bg-slate-200" />
          <div className="w-24 h-5 rounded-lg bg-emerald-100/80" />
        </div>
        <div className="w-full h-10 rounded-xl bg-slate-200/90" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" }) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
