import React, { useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CandidateListPage from './pages/CandidateListPage';
import AddCandidatePage from './pages/AddCandidatePage';
import PredictionPage from './pages/PredictionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

function Shell({ children }) {
  const [darkMode, setDarkMode] = useState(true);

  const themeClassName = useMemo(
    () => (darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'),
    [darkMode]
  );

  return (
    <div className={`min-h-screen ${themeClassName}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/5 p-6 lg:block">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Resume Screening</p>
            <h1 className="mt-3 text-2xl font-semibold">Candidate Ranking System</h1>
          </div>

          <nav className="space-y-2 text-sm">
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/dashboard">
              Dashboard
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/candidates">
              Candidate List
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/predict">
              Prediction
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/analytics">
              Analytics
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/model-performance">
              Model Performance
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/settings">
              Settings
            </Link>
            <Link className="block rounded-xl px-4 py-3 hover:bg-white/10" to="/about">
              About
            </Link>
          </nav>

          <button
            type="button"
            className="mt-10 rounded-xl border border-cyan-400/30 px-4 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/10"
            onClick={() => setDarkMode((current) => !current)}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </aside>

        <main className="flex-1 p-6 lg:p-10">
          <header className="mb-8 flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Production ML Workflow</p>
              <h2 className="mt-1 text-xl font-semibold">Recruiter Dashboard</h2>
            </div>
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">
              JWT Auth Enabled
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Shell>
                  <DashboardPage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <ProtectedRoute>
                <Shell>
                  <CandidateListPage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidates/new"
            element={
              <ProtectedRoute>
                <Shell>
                  <AddCandidatePage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <Shell>
                  <PredictionPage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Shell>
                  <AnalyticsPage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/model-performance"
            element={
              <ProtectedRoute>
                <Shell>
                  <ModelPerformancePage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Shell>
                  <SettingsPage />
                </Shell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Shell>
                  <AboutPage />
                </Shell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
