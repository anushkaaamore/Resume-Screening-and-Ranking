import React from 'react';

export default function AboutPage() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">About</p>
      <h1 className="mt-2 text-3xl font-semibold">Machine Learning Based Resume Screening</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
        This platform uses structured candidate features, classical machine learning models, and a full stack architecture to support recruiter decision-making without relying on generative AI or unstructured resume parsing.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="text-lg font-medium">Technology constraints</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Only Logistic Regression, Decision Tree, and Random Forest are used for training and deployment.
          </p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="text-lg font-medium">Architecture</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            React communicates with Express, which orchestrates authentication, CRUD operations, prediction calls, and analytics data backed by MySQL and a Python ML service.
          </p>
        </article>
      </div>
    </section>
  );
}
