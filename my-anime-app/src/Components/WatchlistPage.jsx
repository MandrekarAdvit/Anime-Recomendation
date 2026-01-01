import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VaultAnalytics from './VaultAnalytics';

const WatchlistPage = ({ watchlist, removeFromWatchlist }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('genre'); 

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10 pt-24 md:pt-32">
      {/* Header Section: Adjusted font sizes for mobile */}
      <header className="mb-8 md:mb-12 text-center max-w-4xl mx-auto px-2">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)] mb-4 leading-tight">
          The Vault
        </h1>
        <p className="text-white/40 text-[10px] md:text-[14px] font-black uppercase tracking-[0.2em] md:tracking-[0.5em]">
          {watchlist.length} Secured Records
        </p>
      </header>

      {watchlist.length > 0 ? (
        <>
          {/* 📊 ANALYTICS TOGGLE: Stacked on mobile, row on PC */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 md:gap-4 mb-8 md:mb-10 px-4">
            <button 
              onClick={() => setActiveView('genre')}
              className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-full font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-all border-2 
                ${activeView === 'genre' 
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
            >
              Genre Distribution
            </button>
            <button 
              onClick={() => setActiveView('era')}
              className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-full font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-all border-2 
                ${activeView === 'era' 
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-transparent text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10'}`}
            >
              Era Breakdown
            </button>
          </div>

          {/* 📈 ANALYTICS VIEWPORT: Responsive width */}
          <div className="w-full max-w-4xl mx-auto mb-12 md:mb-20 animate-in fade-in zoom-in duration-700 px-2">
            <VaultAnalytics watchlist={watchlist} activeView={activeView} />
          </div>

          {/* Records Grid: 1 col on mobile, 2 on tablet, 4 on PC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 px-2 md:px-0">
            {watchlist.map((anime) => (
              <div 
                key={anime._id} 
                className="bg-gray-950 rounded-[2rem] md:rounded-[2.5rem] border-2 border-emerald-900/10 p-6 md:p-10 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-500 group relative shadow-2xl"
              >
                <div className="mb-4 md:mb-6 flex justify-between items-start">
                  <div className="h-1 w-10 bg-emerald-600 rounded-full group-hover:w-16 transition-all duration-500" />
                  <div className="text-right">
                    <p className="text-[9px] font-black text-emerald-900 uppercase tracking-tighter">Score</p>
                    <span className="text-3xl md:text-4xl font-black text-emerald-400 italic leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                      {anime.Score || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mb-6 md:mb-10">
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase italic leading-tight group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {anime.Title} 
                  </h3>
                  <p className="text-[10px] md:text-[11px] font-bold text-emerald-500/40 uppercase mt-2 tracking-widest line-clamp-1">
                    {anime.genres || "Uncategorized"}
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 md:gap-4">
                  <button 
                    onClick={() => {
                      if(window.confirm(`Remove ${anime.Title} from the Vault?`)) removeFromWatchlist(anime);
                    }}
                    className="w-full py-3 md:py-4 font-black uppercase text-[14px] md:text-xs rounded-xl transition-all active:scale-95 bg-red-900/20 text-red-500 border border-red-500/40 hover:bg-red-600 hover:text-white shadow-lg"
                  >
                     Remove from vault
                  </button>

                  <button 
                    onClick={() => navigate(`/animes/${anime._id}`)}
                    className="w-full py-2 md:py-3 bg-transparent text-emerald-500 font-bold uppercase text-[14px] md:text-[14px] rounded-xl border-2 border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Empty State: Responsive Padding */
        <div className="text-center py-20 md:py-32 bg-gray-950/50 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-emerald-900/20 max-w-2xl mx-auto px-4">
          <p className="text-xl md:text-2xl font-black text-emerald-900 uppercase italic tracking-widest mb-6">
            Vault is Empty
          </p>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-emerald-500 font-black uppercase text-[10px] md:text-xs tracking-widest border-b-2 border-emerald-500/50 hover:border-emerald-500 transition-all pb-1"
          >
            Access Catalogue
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;