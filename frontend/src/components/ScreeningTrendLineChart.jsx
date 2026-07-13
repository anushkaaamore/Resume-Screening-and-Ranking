import React from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, Tooltip);

export default function ScreeningTrendLineChart() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Predictions',
        data: [14, 20, 18, 26, 30, 28, 34],
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34, 211, 238, 0.18)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#38bdf8'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#cbd5e1'
        }
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
        ticks: {
          color: '#cbd5e1'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.14)'
        }
      }
    }
  };

  return <Line data={data} options={options} />;
}
