import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import { getDashboardMetrics } from '../services/analyticsService';

const summaryCards = [
  { label: 'Total Candidates', value: '1,248', delta: '+12.4%' },
  { label: 'Shortlisted', value: '382', delta: '+8.1%' },
  { label: 'Predictions Today', value: '94', delta: '+16.7%' },
  { label: 'Best Model', value: 'Random Forest', delta: 'Selected' }
];

const recentItems = [
  { name: 'Ananya Sharma', score: '93%', status: 'Shortlisted' },
  { name: 'Rahul Verma', score: '67%', status: 'Not Shortlisted' },
  { name: 'Meera Iyer', score: '89%', status: 'Shortlisted' }
];

export default function DashboardPage() {
  const [summaryCardsState, setSummaryCardsState] = useState(summaryCards);
  const [recentItemsState] = useState(recentItems);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await getDashboardMetrics();
        const summary = response.data?.summary;

        if (active && summary) {
          setSummaryCardsState([
            { label: 'Total Candidates', value: summary.totalCandidates, delta: 'Live' },
            { label: 'Shortlisted', value: summary.shortlistedCandidates, delta: 'Live' },
            { label: 'Predictions Today', value: summary.totalPredictions, delta: 'Live' },
            { label: 'Best Model', value: response.data?.models?.find((model) => model.selectedAsBest)?.modelName || 'Random Forest', delta: 'Selected' }
          ]);
        }
      } catch (error) {
        if (active) {
          setSummaryCardsState(summaryCards);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCardsState.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} delta={card.delta} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Analytics</p>
              <h3 className="mt-2 text-2xl font-semibold">Model and shortlist trends</h3>
            </div>
            <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10" type="button">
              Download CSV
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {['Accuracy', 'Precision', 'Recall'].map((metric) => (
              <div key={metric} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-400">{metric}</p>
                <div className="mt-4 h-40 rounded-2xl border border-dashed border-cyan-400/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(14,165,233,0.02))]" />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Recent Predictions</p>
          <div className="mt-4 space-y-4">
            {recentItemsState.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-slate-400">Probability {item.score}</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
