import React, { useEffect, useState } from 'react';
import { getModelPerformance } from '../services/analyticsService';

const models = [
  { name: 'Logistic Regression', accuracy: '84.6%', f1: '0.82', selected: false },
  { name: 'Decision Tree', accuracy: '79.1%', f1: '0.75', selected: false },
  { name: 'Random Forest', accuracy: '90.8%', f1: '0.89', selected: true }
];

export default function ModelPerformancePage() {
  const [modelsState, setModelsState] = useState(models);

  useEffect(() => {
    let active = true;

    async function loadModels() {
      try {
        const response = await getModelPerformance();
        const fetchedModels = response.data?.models || [];

        if (active && fetchedModels.length) {
          setModelsState(
            fetchedModels.map((model) => ({
              name: model.modelName,
              accuracy: `${(Number(model.accuracy) * 100).toFixed(1)}%`,
              f1: Number(model.f1Score).toFixed(2),
              selected: Boolean(model.selectedAsBest)
            }))
          );
        }
      } catch (error) {
        if (active) {
          setModelsState(models);
        }
      }
    }

    loadModels();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Model Performance</p>
      <h1 className="mt-2 text-3xl font-semibold">Classical model comparison</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
        Compare accuracy, F1 score, and selection status across Logistic Regression, Decision Tree, and Random Forest.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {modelsState.map((model) => (
          <article
            key={model.name}
            className={`rounded-3xl border p-5 shadow-lg ${
              model.selected ? 'border-cyan-400/30 bg-cyan-400/10' : 'border-white/10 bg-slate-950/70'
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-medium">{model.name}</h2>
              {model.selected ? (
                <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">Best Model</span>
              ) : null}
            </div>
            <dl className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <dt>Accuracy</dt>
                <dd className="font-medium text-slate-100">{model.accuracy}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>F1 Score</dt>
                <dd className="font-medium text-slate-100">{model.f1}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
