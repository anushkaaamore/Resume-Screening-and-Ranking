import React from 'react';

export default function SettingsPage() {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Settings</p>
      <h1 className="mt-2 text-3xl font-semibold">Workspace preferences</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        Manage recruiter profile details, theme preferences, and notification behavior.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="text-lg font-medium">Profile</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Recruiter Name</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Recruiter Email</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Organization Role</div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="text-lg font-medium">Preferences</h2>
          <div className="mt-4 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Dark mode enabled</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">Email alerts disabled</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">CSV export enabled</div>
          </div>
        </div>
      </div>
    </section>
  );
}
