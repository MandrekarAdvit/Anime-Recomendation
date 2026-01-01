import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AnimeList = ({ watchlist, addToWatchlist, removeFromWatchlist, isLoggedIn }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Derived states from URL
  const searchTerm = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "Score";
  const yearFilter = searchParams.get("year") || "";
  const genreFilter = searchParams.get("genre") || "";
  const typeFilter = searchParams.get("type") || "";
  const statusFilter = searchParams.get("status") || "";
  const selectedStudios = searchParams.get("studio")?.split('|').filter(s => s) || [];

  const [animeData, setAnimeData] = useState([]);
  const [studioInput, setStudioInput] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value.length > 0) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleAddStudio = (e) => {
    if (e.key === 'Enter' && studioInput.trim() !== "") {
      e.preventDefault();
      if (!selectedStudios.includes(studioInput.trim())) {
        const newStudios = [...selectedStudios, studioInput.trim()];
        updateParams("studio", newStudios.join('|'));
      }
      setStudioInput(""); 
    }
  };

  const removeStudio = (studioToRemove) => {
    const newStudios = selectedStudios.filter(s => s !== studioToRemove);
    updateParams("studio", newStudios.join('|'));
  };

  const resetFilters = () => setSearchParams({});

  const handleVaultAction = (anime, isInVault) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    isInVault ? removeFromWatchlist(anime) : addToWatchlist(anime);
  };

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const studioQuery = selectedStudios.join('|');
        const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=0&sort=${sortBy}&year=${yearFilter}&genre=${genreFilter}&type=${typeFilter}&status=${statusFilter}&studio=${studioQuery}`;
        const response = await fetch(url);
        const data = await response.json();
        const unique = Array.from(new Map(data.map(item => [item._id, item])).values());
        setAnimeData(unique);
        setHasMore(data.length === 20);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchAnimes, 300);
    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  const loadMoreRecords = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const skip = animeData.length;
      const studioQuery = selectedStudios.join('|');
      const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=${skip}&sort=${sortBy}&year=${yearFilter}&genre=${genreFilter}&type=${typeFilter}&status=${statusFilter}&studio=${studioQuery}`;
      const response = await fetch(url);
      const newData = await response.json();
      if (newData.length > 0) {
        setAnimeData(prev => {
          const mergedMap = new Map();
          [...prev, ...newData].forEach(anime => mergedMap.set(anime._id, anime));
          return Array.from(mergedMap.values());
        });
        setHasMore(newData.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isFiltered = searchParams.toString().length > 0;

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10 pt-24 md:pt-32 relative">
      
      {/* AUTH MODAL - Responsive Padding */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-950 border-2 border-emerald-500/30 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <header className="mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Vault <span className="text-emerald-500">Locked</span></h2>
            </header>
            <div className="flex flex-col gap-4">
              <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm transition-all">Enter the Vault</button>
              <button onClick={() => setShowAuthModal(false)} className="mt-2 text-xs font-black uppercase tracking-widest text-gray-600">× Close</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION - Responsive Text Sizes */}
      <header className="mb-12 text-center max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase text-emerald-500 mb-8 md:mb-12 leading-tight">The Catalogue</h1>
        
        <div className="flex flex-col gap-4 mb-6">
          <input 
            type="text"
            placeholder="Search Vault (English or Japanese name)..."
            value={searchTerm}
            onChange={(e) => updateParams("search", e.target.value)}
            className="w-full bg-gray-950 border-2 border-emerald-900/30 text-white px-6 md:px-8 py-4 md:py-6 rounded-2xl focus:border-emerald-500 font-bold uppercase text-xs md:text-sm"
          />

          {/* STUDIO CHIP CONTAINER - Wrapping optimized */}
          <div className="w-full bg-gray-950 border-2 border-emerald-900/30 p-3 md:p-4 rounded-2xl flex flex-wrap items-center gap-2 md:gap-3">
            {selectedStudios.map(studio => (
              <span key={studio} className="bg-emerald-600 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-black uppercase text-[9px] md:text-[10px] flex items-center gap-2">
                {studio}
                <button onClick={() => removeStudio(studio)} className="font-bold text-xs md:text-sm">×</button>
              </span>
            ))}
            <input 
              type="text"
              placeholder={selectedStudios.length > 0 ? "Add..." : "Filter Studios (Press Enter)..."}
              value={studioInput}
              onChange={(e) => setStudioInput(e.target.value)}
              onKeyDown={handleAddStudio}
              className="bg-transparent border-none outline-none text-emerald-400 font-bold uppercase text-[10px] md:text-[12px] flex-grow min-w-[150px]"
            />
          </div>
        </div>

        {/* DROPDOWN FILTERS - 2 columns on mobile */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 mb-8">
          {[
            { key: "year", val: yearFilter, label: "Eras", opts: ["2020s", "2010s", "2000s", "1990s", "Earlier"] },
            { key: "genre", val: genreFilter, label: "Genres", opts: ["Action", "Comedy", "Drama", "Fantasy", "Sci-Fi", "Romance"] },
            { key: "type", val: typeFilter, label: "Types", opts: ["TV", "Movie", "OVA", "Special"] },
            { key: "status", val: statusFilter, label: "Status", opts: ["Finished Airing", "Currently Airing"] }
          ].map((filter) => (
            <select 
              key={filter.key} 
              value={filter.val} 
              onChange={(e) => updateParams(filter.key, e.target.value)} 
              className="bg-gray-950 border-2 border-emerald-900/30 text-emerald-500 px-3 py-3 md:px-6 md:py-4 rounded-xl font-bold uppercase text-[10px] md:text-[12px] cursor-pointer"
            >
              <option value="">All {filter.label}</option>
              {filter.opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ))}
        </div>

        {/* SORTING BUTTONS - Centered wrapping */}
        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
          {['Score', 'Popularity', 'RecentlyAdded'].map((val) => (
            <button 
              key={val} 
              onClick={() => updateParams("sort", val)} 
              className={`px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[12px] font-black uppercase border transition-all ${sortBy === val ? 'bg-emerald-600 text-black border-emerald-600' : 'border-emerald-900/30 text-emerald-500/50'}`}
            >
              {val === 'RecentlyAdded' ? 'Latest' : val}
            </button>
          ))}
          {isFiltered && (
            <button onClick={resetFilters} className="w-full md:w-auto mt-4 md:mt-0 md:ml-4 text-[10px] font-bold text-red-500 uppercase tracking-widest underline underline-offset-4">
              × Clear All
            </button>
          )}
        </div>
      </header>

      {/* GRID SECTION - Adaptive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {animeData.length > 0 ? (
          animeData.map((anime) => {
            const isInVault = watchlist.some(item => item._id === anime._id);
            return (
              <div key={anime._id} className="bg-gray-950 rounded-[2rem] md:rounded-[2.5rem] border-2 border-emerald-900/10 p-6 md:p-10 flex flex-col justify-between hover:border-emerald-500 transition-all group shadow-2xl">
                <div>
                  <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="h-1 w-10 bg-emerald-600 rounded-full" />
                    <div className="text-right">
                      <p className="text-[8px] md:text-[10px] font-black text-emerald-900 uppercase">Vault Score</p>
                      <span className="text-3xl md:text-4xl font-black text-emerald-400 italic leading-none">{anime.Score || "N/A"}</span>
                    </div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase italic leading-tight mb-2 group-hover:text-emerald-500 line-clamp-2">{anime.Title}</h3>
                  <p className="text-[10px] md:text-[12px] font-bold text-gray-600 uppercase mb-4">Rank: #{anime.Popularity || '???'}</p>
                  <p className="text-[11px] md:text-[13px] font-bold text-emerald-500/60 uppercase tracking-tighter line-clamp-1">{anime.genres || "Uncategorized"}</p>
                </div>
                <div className="flex flex-col gap-3 mt-6 md:mt-8">
                  <button 
                    onClick={() => handleVaultAction(anime, isInVault)} 
                    className={`w-full py-3 md:py-4 font-black uppercase text-[10px] md:text-[12px] rounded-xl transition-all ${isInVault ? 'bg-red-950/20 text-red-500 border border-red-500/40' : 'bg-emerald-600 text-black'}`}
                  >
                    {isInVault ? 'Remove from vault' : 'Add to vault'}
                  </button>
                  <button onClick={() => navigate(`/animes/${anime._id}`)} className="w-full py-2 md:py-3 text-emerald-500 font-bold uppercase text-[10px] md:text-[12px] rounded-xl border-2 border-emerald-500/30">Details</button>
                </div>
              </div>
            );
          })
        ) : !loading && (
          <div className="col-span-full py-20 md:py-32 text-center">
              <p className="text-gray-500 uppercase font-black tracking-widest text-lg md:text-2xl mb-6">Zero records found.</p>
              <button onClick={resetFilters} className="px-8 md:px-10 py-3 md:py-4 bg-emerald-600 text-black font-black uppercase rounded-xl transition-transform">Reset Filters</button>
          </div>
        )}
      </div>

      {/* LOAD MORE - Responsive sizing */}
      {hasMore && (
        <div className="mt-12 md:mt-20 text-center px-4">
          <button 
            onClick={loadMoreRecords} 
            disabled={loading} 
            className="w-full md:w-auto md:px-12 py-4 md:py-5 border-2 border-emerald-500 text-emerald-500 font-black uppercase text-sm md:text-lg rounded-2xl hover:bg-emerald-500 hover:text-black transition-all"
          >
            {loading ? "Accessing..." : "Load More Records"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeList;