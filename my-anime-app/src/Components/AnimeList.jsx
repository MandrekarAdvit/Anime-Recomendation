import React, { useState, useEffect } from 'react';
import AnimeCard from './AnimeCard';
import useDebounce from '../hooks/useDebounce';

const AnimeList = ({ onAnimeSelect, watchlist = [], addToWatchlist, removeFromWatchlist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Tracks current page for pagination
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // 1. Unified Fetch Function
  const fetchAnimes = async (pageNum, searchStr, isNewSearch = false) => {
    try {
      setLoading(true);
      // Query parameters match your updated server.js logic
      const response = await fetch(
        `http://localhost:5000/api/animes?page=${pageNum}&search=${searchStr}`
      );
      if (!response.ok) throw new Error('Backend failed');
      const data = await response.json();
      
      // If searching something new, replace the list. If "Load More", append it.
      setAnimeData(prev => isNewSearch ? data : [...prev, ...data]);
    } catch (error) {
      console.error("Fetch error:", error);
      if (isNewSearch) setAnimeData([]);
    } finally {
      setLoading(false);
    }
  };

  // 2. Trigger search whenever the user stops typing
  useEffect(() => {
    setPage(1); // Reset to page 1 for new searches
    fetchAnimes(1, debouncedSearchTerm, true);
  }, [debouncedSearchTerm]);

  // 3. Pagination Handler
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnimes(nextPage, searchTerm, false);
  };

  // Optimized watchlist lookup using _id from MongoDB
  const watchlistedIds = new Set(watchlist.map(a => a._id));

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:py-16 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-12">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Movie & Anime Catalog
        </h2>
        <input
          type="text"
          placeholder="Search for english or japanese titles"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-4 bg-gray-800/50 text-white rounded-full border-2 border-transparent focus:border-blue-500 outline-none shadow-lg transition-all"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-8">
        {animeData.length > 0 ? (
          animeData.map(anime => (
            <AnimeCard 
              key={anime._id} // MongoDB unique identifier
              anime={anime} 
              onSelect={onAnimeSelect}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
              isWatchlisted={watchlistedIds.has(anime._id)}
            />
          ))
        ) : (
          !loading && <p className="text-gray-500 text-xl">No results found.</p>
        )}
      </div>

      {/* 4. "Load More" Button Section */}
      {animeData.length >= 20 && (
        <div className="flex justify-center mt-12 pb-10">
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className={`px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all transform active:scale-95 shadow-lg shadow-blue-900/40 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Searching Database...' : 'Load More Results'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeList;