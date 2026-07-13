import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginRecruiter } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginRecruiter(form);
      const { recruiter, token } = response.data;
      setSession(recruiter, token);
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-cyan-950/30 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(15,23,42,0.8),_rgba(2,6,23,0.95))] p-8 lg:p-12">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Resume Screening Platform</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight lg:text-5xl">
              Predict shortlist quality using only classical machine learning.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              Compare Logistic Regression, Decision Tree, and Random Forest on structured candidate data and deploy the best model for recruiter workflows.
            </p>
          </div>

          <div className="grid gap-4 pt-12 sm:grid-cols-3">
            {[
              ['03', 'Model types'],
              ['100%', 'Audit friendly'],
              ['JWT', 'Protected access']
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="text-2xl font-semibold text-cyan-300">{value}</div>
                <div className="mt-2 text-sm text-slate-300">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-8 shadow-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Recruiter Login</p>
              <h2 className="mt-3 text-3xl font-semibold">Welcome back</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Sign in to access candidate screening, predictions, and model analytics.</p>
            </div>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                  placeholder="recruiter@company.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60"
                  placeholder="••••••••"
                />
              </label>
            </div>

            {error ? <p className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
