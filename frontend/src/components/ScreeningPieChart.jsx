import React from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ScreeningPieChart({ shortlisted = 382, review = 514, rejected = 352 }) {
  const data = {
    labels: ['Shortlisted', 'Review', 'Rejected'],
    datasets: [
      {
        data: [shortlisted, review, rejected],
        backgroundColor: ['#22d3ee', '#38bdf8', '#0f766e'],
        borderColor: '#020617',
        borderWidth: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1'
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
}
