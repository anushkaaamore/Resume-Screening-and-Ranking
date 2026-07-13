import React, { useEffect, useMemo, useState } from 'react';
import { getCandidates } from '../services/candidateService';
import useDebounce from '../hooks/useDebounce';

const candidates = [
  { name: 'Ananya Sharma', degree: 'B.Tech', branch: 'CSE', cgpa: '8.9', status: 'Shortlisted' },
  { name: 'Rahul Verma', degree: 'B.E.', branch: 'IT', cgpa: '7.4', status: 'Review' },
  { name: 'Meera Iyer', degree: 'MCA', branch: 'Computer Applications', cgpa: '8.6', status: 'Shortlisted' }
];

export default function CandidateListPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState(candidates);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    let active = true;

    async function loadCandidates() {
      try {
        const response = await getCandidates({ limit: 20 });
        const fetched = response.data?.items || [];
        if (active && fetched.length) {
          setItems(fetched.map((candidate) => ({
            name: candidate.candidateName,
            degree: candidate.degree,
            branch: candidate.branch,
            cgpa: candidate.cgpa,
            status: candidate.shortlistedLabel ? 'Shortlisted' : 'Review'
          })));
        }
      } catch (error) {
        if (active) {
          setItems(candidates);
        }
      }
    }

    loadCandidates();

    return () => {
      active = false;
    };
  }, []);

  const filteredCandidates = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((candidate) => {
      return [candidate.name, candidate.degree, candidate.branch]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [debouncedSearch, items]);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-cyan-950/10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Candidate Records</p>
          <h1 className="mt-2 text-3xl font-semibold">Candidate List</h1>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="min-w-64 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm outline-none placeholder:text-slate-500"
            placeholder="Search candidates"
          />
          <button type="button" className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
            Add Candidate
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-slate-950/70 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Degree</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">CGPA</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 bg-white/5">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.name} className="hover:bg-white/5">
                <td className="px-4 py-4 font-medium">{candidate.name}</td>
                <td className="px-4 py-4 text-slate-300">{candidate.degree}</td>
                <td className="px-4 py-4 text-slate-300">{candidate.branch}</td>
                <td className="px-4 py-4 text-slate-300">{candidate.cgpa}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{candidate.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
