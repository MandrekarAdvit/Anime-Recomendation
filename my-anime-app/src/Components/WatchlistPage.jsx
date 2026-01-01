import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VaultAnalytics from './VaultAnalytics';

const WatchlistPage = ({ watchlist, removeFromWatchlist }) => {
  const navigate = useNavigate();
  
  // 🚀 Local state to toggle between analytics modes
  const [activeView, setActiveView] = useState('genre'); 

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10 pt-32">
      {/* Header Section */}
      <header className="mb-12 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)] mb-4">
          The Vault
        </h1>
        <p className="text-white/40 text-[14px] font-black uppercase tracking-[0.5em]">
          {watchlist.length} Secured Records
        </p>
      </header>

      {watchlist.length > 0 ? (
        <>
          {/* 📊 ANALYTICS TOGGLE CONTROLS */}
          <div className="flex justify-center gap-4 mb-10">
            <button 
              onClick={() => setActiveView('genre')}
              className={`px-8 py-3 rounded-full font-black uppercase text-[11px] tracking-widest transition-all border-2 
                ${activeView === 'genre' 
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
            >
              Genre Distribution
            </button>
            <button 
              onClick={() => setActiveView('era')}
              className={`px-8 py-3 rounded-full font-black uppercase text-[11px] tracking-widest transition-all border-2 
                ${activeView === 'era' 
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
            >
              Era Breakdown
            </button>
          </div>

          {/* 📈 DYNAMIC ANALYTICS VIEWPORT */}
          <div className="max-w-4xl mx-auto mb-20 animate-in fade-in zoom-in duration-700">
            <VaultAnalytics watchlist={watchlist} activeView={activeView} />
          </div>

          {/* Records Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {watchlist.map((anime) => (
              <div 
                key={anime._id} 
                className="bg-gray-950 rounded-[2.5rem] border-2 border-emerald-900/10 p-10 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-500 group relative shadow-2xl"
              >
                <div className="mb-6 flex justify-between items-start">
                  <div className="h-1 w-10 bg-emerald-600 rounded-full group-hover:w-16 transition-all duration-500" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-emerald-900 uppercase tracking-tighter mb-1">Score</p>
                    <span className="text-4xl font-black text-emerald-400 italic leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                      {anime.Score || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-2xl font-black text-white uppercase italic leading-tight drop-shadow-md group-hover:text-emerald-500 transition-colors">
                    {anime.Title} 
                  </h3>
                  <p className="text-[11px] font-bold text-emerald-500/40 uppercase mt-2 tracking-widest line-clamp-1">
                    {anime.genres || "Uncategorized"}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => removeFromWatchlist(anime)}
                    className="w-full py-4 font-black uppercase text-xs rounded-xl transition-all active:scale-95 bg-red-900/20 text-red-500 border border-red-500/40 hover:bg-red-600 hover:text-white shadow-lg"
                  >
                    Expunge Record
                  </button>

                  <button 
                    onClick={() => navigate(`/animes/${anime._id}`)}
                    className="w-full py-3 bg-transparent text-emerald-500 font-bold uppercase text-[10px] rounded-xl border-2 border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-32 bg-gray-950/50 rounded-[3rem] border-2 border-dashed border-emerald-900/20 max-w-2xl mx-auto">
          <p className="text-2xl font-black text-emerald-900 uppercase italic tracking-widest mb-6">
            Vault is Empty
          </p>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-emerald-500 font-black uppercase text-xs tracking-widest border-b-2 border-emerald-500/50 hover:border-emerald-500 transition-all pb-1"
          >
            Access Catalogue to Secure Records
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;