import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ScreeningBarChart({ shortlisted = 382, review = 514, rejected = 352 }) {
  const data = {
    labels: ['Shortlisted', 'Review', 'Rejected'],
    datasets: [
      {
        label: 'Candidates',
        data: [shortlisted, review, rejected],
        backgroundColor: ['#22d3ee', '#38bdf8', '#0f766e'],
        borderRadius: 12,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#cbd5e1'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.14)'
        },
        ticks: {
          color: '#cbd5e1'
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}
