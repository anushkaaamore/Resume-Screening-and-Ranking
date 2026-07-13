import React from 'react';

export default function StatCard({ label, value, delta }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-cyan-950/10">
      <p className="text-sm text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-3xl font-semibold">{value}</h3>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">{delta}</span>
      </div>
    </article>
  );
}
