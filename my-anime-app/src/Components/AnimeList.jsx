import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AnimeList = ({ watchlist, addToWatchlist, removeFromWatchlist }) => {
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Track if database has more records

  // 1. Initial Fetch / Search Fetch
  useEffect(() => {
    const fetchInitialAnimes = async () => {
      try {
        setLoading(true);
        // Reset to first 20 items whenever search changes
        const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=0`;
        const response = await fetch(url);
        const data = await response.json();
        
        setAnimeData(data);
        setHasMore(data.length === 20); // If we got 20, there might be more
      } catch (err) {
        console.error("Initial fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchInitialAnimes(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // Only re-run when searching

  // 2. Load More Function (Appends Data)
  const loadMoreRecords = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      // Skip the number of items we already have
      const skip = animeData.length;
      const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=${skip}`;
      
      const response = await fetch(url);
      const newData = await response.json();

      if (newData.length > 0) {
        // APPEND new data to existing state
        setAnimeData(prev => [...prev, ...newData]);
        setHasMore(newData.length === 20);
      } else {
        setHasMore(false); // No more records found
      }
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10 pt-32">
      <header className="mb-20 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.3)] mb-8">
          The Catalogue
        </h1>
        
        <div className="relative group">
          <input 
            type="text"
            placeholder="Search the Vault Database..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border-2 border-emerald-900/30 text-white px-8 py-6 rounded-2xl focus:outline-none focus:border-emerald-500 transition-all font-bold uppercase tracking-widest text-sm placeholder:text-gray-700 shadow-2xl"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {animeData.map((anime) => {
          const isInVault = watchlist.some(item => item._id === anime._id);

          return (
            <div key={anime._id} className="bg-gray-950 rounded-[2.5rem] border-2 border-emerald-900/10 p-10 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-500 group relative shadow-2xl">
              
              <div className="mb-6 flex justify-between items-start">
                <div className="h-1 w-10 bg-emerald-600 rounded-full group-hover:w-16 transition-all duration-500" />
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-900 uppercase tracking-tighter mb-1">Vault Score</p>
                  <span className="text-4xl font-black text-emerald-400 italic leading-none drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                    {anime.Score || "N/A"}
                  </span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-black text-white uppercase italic leading-tight drop-shadow-md group-hover:text-emerald-500 transition-colors">
                  {anime.Title} 
                </h3>
              </div>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => isInVault ? removeFromWatchlist(anime) : addToWatchlist(anime)}
                  className={`w-full py-4 font-black uppercase text-xs rounded-xl transition-all active:scale-95 shadow-lg ${
                    isInVault 
                      ? 'bg-red-950/20 text-red-500 border border-red-500/40 hover:bg-red-600 hover:text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-black'
                  }`}
                >
                  {isInVault ? 'Remove from Vault' : 'Add to Vault'}
                </button>

                <button 
                  onClick={() => navigate(`/animes/${anime._id}`)}
                  className="w-full py-3 bg-transparent text-emerald-500 font-bold uppercase text-[10px] rounded-xl border-2 border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DYNAMIC LOAD MORE BUTTON */}
      {hasMore && (
        <div className="mt-20 text-center">
          <button 
            onClick={loadMoreRecords}
            disabled={loading}
            className="px-12 py-5 bg-transparent border-2 border-emerald-500 text-emerald-500 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.1)]"
          >
            {loading ? "Accessing Records..." : "Load More from Vault"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeList;