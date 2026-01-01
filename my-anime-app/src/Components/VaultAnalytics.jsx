import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement 
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const VaultAnalytics = ({ watchlist, activeView }) => {
  
  // 1. DATA PROCESSING: Genre Distribution
  const genreCounts = {};
  watchlist.forEach(anime => {
    const genres = anime.genres ? anime.genres.split(', ') : ['Uncategorized'];
    genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(genreCounts),
    datasets: [{
      data: Object.values(genreCounts),
      backgroundColor: ['#10b981', '#059669', '#047857', '#064e3b', '#065f46', '#34d399'],
      borderColor: '#000',
      borderWidth: 2,
    }]
  };

  // 2. DATA PROCESSING: Era Analysis (Decades)
  const eraCounts = {};
  watchlist.forEach(anime => {
    const dateStr = anime["Aired From"] || "";
    const yearMatch = dateStr.match(/\d{4}/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);
      const decade = Math.floor(year / 10) * 10 + "s";
      eraCounts[decade] = (eraCounts[decade] || 0) + 1;
    }
  });

  const eraData = {
    labels: Object.keys(eraCounts).sort(),
    datasets: [{
      label: 'Titles Secured',
      data: Object.values(eraCounts),
      backgroundColor: '#10b981',
      borderColor: '#34d399',
      borderWidth: 1,
      borderRadius: 8,
    }]
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          color: '#94a3b8', 
          font: { size: 14, weight: 'bold', family: 'Inter' } 
        }
      },
      tooltip: {
        bodyFont: { size: 14 },
        titleFont: { size: 14 }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { color: '#475569', font: { size: 14 } }, 
        grid: { color: '#0f172a' } 
      },
      x: { 
        ticks: { color: '#475569', font: { size: 14 } }, 
        grid: { display: false } 
      }
    }
  };

  return (
    <div className="w-full h-full">
      {/* 🚀 CONDITIONAL RENDERING BASED ON ACTIVEVIEW */}
      {activeView === 'genre' ? (
        <div className="bg-gray-950/50 p-10 rounded-[3rem] border-2 border-emerald-500/10 shadow-2xl h-[450px]">
          <h3 className="text-xl font-black italic uppercase text-emerald-500 mb-8 tracking-tighter text-center">
            Genre Distribution
          </h3>
          <div className="h-[300px]">
            <Pie data={pieData} options={{ ...commonOptions }} />
          </div>
        </div>
      ) : (
        <div className="bg-gray-950/50 p-10 rounded-[3rem] border-2 border-emerald-500/10 shadow-2xl h-[450px]">
          <h3 className="text-xl font-black italic uppercase text-white mb-8 tracking-tighter text-center">
            Era Breakdown
          </h3>
          <div className="h-[300px]">
            <Bar data={eraData} options={commonOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultAnalytics;