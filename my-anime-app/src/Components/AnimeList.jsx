import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Ensure isLoggedIn is extracted from props
const AnimeList = ({ watchlist, addToWatchlist, removeFromWatchlist, isLoggedIn }) => {
  const navigate = useNavigate();
  const [animeData, setAnimeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState('Score');
  const [yearFilter, setYearFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // --- NEW: Modal State for Auth Denial ---
  const [showAuthModal, setShowAuthModal] = useState(false);

  const resetFilters = () => {
    setSearchTerm("");
    setYearFilter("");
    setGenreFilter("");
    setSortBy("Score");
  };

  // --- NEW: Protected Action Handler ---
  // This ensures only logged-in agents can modify the vault
  const handleVaultAction = (anime, isInVault) => {
    if (!isLoggedIn) {
      setShowAuthModal(true); // Trigger popup if guest
      return;
    }

    // Proceed with adding/removing if logged in
    if (isInVault) {
      removeFromWatchlist(anime);
    } else {
      addToWatchlist(anime);
    }
  };

  // 2. Initial Fetch Logic (Preserved with 300ms Debounce)
  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=0&sort=${sortBy}&year=${yearFilter}&genre=${genreFilter}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Keeps the unique mapping logic preserved
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
  }, [searchTerm, sortBy, yearFilter, genreFilter]);

  // 3. Load More Function (Preserved)
  const loadMoreRecords = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const skip = animeData.length;
      const url = `http://localhost:5000/api/animes?search=${searchTerm}&limit=20&skip=${skip}&sort=${sortBy}&year=${yearFilter}&genre=${genreFilter}`;
      
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

  const isFiltered = searchTerm !== "" || yearFilter !== "" || genreFilter !== "" || sortBy !== 'Score';

  return (
    <div className="min-h-screen bg-black text-white pb-20 px-4 md:px-10 pt-32 relative">
      
      {/* --- ACCESS DENIED POPUP (MODAL) --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-gray-950 border-2 border-emerald-500/30 p-12 rounded-[3rem] max-w-md w-full text-center shadow-[0_0_100px_rgba(16,185,129,0.15)] relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/10 blur-[100px] rounded-full" />
            
            <header className="mb-8">
                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                  Vault <span className="text-emerald-500">Locked</span>
                </h2>
                <p className="text-emerald-500/60 font-bold text-[10px] tracking-[0.3em] uppercase mt-2">Authentication Required</p>
            </header>

            <p className="text-gray-400 font-semibold text-14px mb-10 leading-relaxed">
              You must be a registered user to access your personal vault. Please Login or Sign Up to continue.
            </p>

            <div className="flex flex-col gap-4 relative z-10">
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-5 rounded-2xl font-black uppercase text-[14px] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                Enter the Vault (Login)
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="w-full border-2 border-emerald-500/30 text-emerald-500 py-4 rounded-2xl font-black uppercase text-[14px] hover:border-emerald-500 transition-all hover:bg-emerald-500/5"
              >
                Create Account (Sign Up)
              </button>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="mt-4 text-[14px] font-black uppercase tracking-widest text-gray-600 hover:text-white transition-colors"
              >
                × Close 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="mb-12 text-center max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black italic uppercase text-emerald-500 mb-12">
          The Catalogue
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input 
            type="text"
            placeholder="Search Vault (English/Japanese)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-950 border-2 border-emerald-900/30 text-white px-8 py-6 rounded-2xl focus:outline-none focus:border-emerald-500 font-bold uppercase text-sm"
          />

          <select 
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-gray-950 border-2 border-emerald-900/30 text-emerald-500 px-6 py-4 rounded-2xl font-bold uppercase text-[14px] cursor-pointer"
          >
            <option value="">All Eras</option>
            <option value="2020s">2020s</option>
            <option value="2010s">2010s</option>
            <option value="2000s">2000s</option>
            <option value="1990s">90s</option>
            <option value="Earlier">Retro</option>
          </select>

          <select 
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="bg-gray-950 border-2 border-emerald-900/30 text-emerald-500 px-6 py-4 rounded-2xl font-bold uppercase text-[14px] cursor-pointer"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4">
          {['Score', 'Popularity', 'RecentlyAdded'].map((val) => (
            <button 
              key={val} 
              onClick={() => setSortBy(val)} 
              className={`px-6 py-2 rounded-full text-[14px] font-black uppercase border transition-all ${
                sortBy === val ? 'bg-emerald-600 text-black border-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-emerald-900/30 text-emerald-500/50 hover:text-emerald-400'
              }`}
            >
              {val === 'RecentlyAdded' ? 'Latest Releases' : `Sort by ${val}`}
            </button>
          ))}

          {isFiltered && (
            <button 
              onClick={resetFilters}
              className="ml-4 text-[14px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 underline underline-offset-4"
            >
              × Clear All Filters
            </button>
          )}
        </div>
      </header>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {animeData.length > 0 ? (
          animeData.map((anime) => {
            const isInVault = watchlist.some(item => item._id === anime._id);
            return (
              <div key={anime._id} className="bg-gray-950 rounded-[2.5rem] border-2 border-emerald-900/10 p-10 flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-2xl">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-1 w-10 bg-emerald-600 rounded-full" />
                    <div className="text-right">
                      <p className="text-[12px] font-black text-emerald-900 uppercase">Vault Score</p>
                      <span className="text-4xl font-black text-emerald-400 italic leading-none">{anime.Score || "N/A"}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic leading-tight mb-2 group-hover:text-emerald-500 transition-colors">
                    {anime.Title}
                  </h3>
                  <p className="text-[14px] font-bold text-gray-600 uppercase mb-4">Pop. Rank: #{anime.Popularity || '???'}</p>
                  <p className="text-[14px] font-bold text-emerald-500/60 uppercase tracking-tighter">{anime.genres || "Uncategorized"}</p>
                </div>
                
                <div className="flex flex-col gap-4 mt-8">
                  <button 
                    onClick={() => handleVaultAction(anime, isInVault)} 
                    className={`w-full py-4 font-black uppercase text-[14px] rounded-xl transition-all ${
                      isInVault ? 'bg-red-950/20 text-red-500 border border-red-500/40' : 'bg-emerald-600 text-black'
                    }`}
                  >
                    {isInVault ? 'Remove from Vault' : 'Add to Vault'}
                  </button>
                  <button onClick={() => navigate(`/animes/${anime._id}`)} className="w-full py-3 text-emerald-500 font-bold uppercase text-[14px] rounded-xl border-2 border-emerald-500/30">
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : !loading && (
          <div className="col-span-full py-32 text-center">
             <p className="text-gray-500 uppercase font-black tracking-widest text-2xl mb-6">Zero records found in this sector.</p>
             <button onClick={resetFilters} className="px-10 py-4 bg-emerald-600 text-black font-black uppercase rounded-xl hover:scale-105 transition-transform">Reset All Access Filters</button>
          </div>
        )}
      </div>

      {/* LOAD MORE */}
      {hasMore && (
        <div className="mt-20 text-center">
          <button 
            onClick={loadMoreRecords} 
            disabled={loading} 
            className="px-12 py-5 border-2 border-emerald-500 text-emerald-500 font-black uppercase text-[16px] rounded-2xl hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? "Accessing Records..." : "Load More from Vault"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeList;