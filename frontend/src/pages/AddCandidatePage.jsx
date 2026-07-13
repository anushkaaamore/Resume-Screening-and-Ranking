import React, { useState } from 'react';
import { createCandidate } from '../services/candidateService';

const initialFormState = {
  candidateName: '',
  age: '',
  gender: '',
  degree: '',
  branch: '',
  collegeTier: '',
  cgpa: '',
  programmingLanguages: '',
  skillsCount: '',
  projectsCount: '',
  internshipCount: '',
  certificationCount: '',
  hackathonCount: '',
  codingScore: '',
  communicationScore: '',
  leadershipScore: '',
  experienceYears: ''
};

export default function AddCandidatePage() {
  const [form, setForm] = useState(initialFormState);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await createCandidate(form);
      setMessage('Candidate saved successfully');
      setForm(initialFormState);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Candidate Intake</p>
        <h1 className="mt-2 text-3xl font-semibold">Add Candidate</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Capture structured candidate data for scoring, storage, and shortlist prediction.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block">
            <span className="mb-2 block text-sm text-slate-300">{key}</span>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
              placeholder={key}
            />
          </label>
        ))}
        <div className="md:col-span-2 xl:col-span-3">
          <button type="submit" disabled={loading} className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-70">
            {loading ? 'Saving...' : 'Save Candidate'}
          </button>
        </div>
      </form>

      {message ? <p className="mt-6 text-sm text-slate-300">{message}</p> : null}
    </section>
  );
}
