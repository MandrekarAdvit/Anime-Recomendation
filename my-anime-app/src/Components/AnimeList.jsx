import React, { useState, useEffect, useMemo } from 'react';
import AnimeCard from './AnimeCard';
import useDebounce from '../hooks/useDebounce';

const AnimeList = ({ onAnimeSelect, watchlist = [], addToWatchlist, removeFromWatchlist }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchAnimes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/animes');
        if (!response.ok) throw new Error('Backend failed');
        const data = await response.json();
        // Ensure data is an array and filter out any null/undefined entries immediately
        setAnimeData(Array.isArray(data) ? data.filter(item => item !== null) : []);
      } catch (error) {
        console.error("Fetch error:", error);
        setAnimeData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimes();
  }, []);

  const filteredAnime = useMemo(() => {
    if (!Array.isArray(animeData)) return [];
    if (!debouncedSearchTerm) return animeData;
    
    return animeData.filter(anime => {
      // Use optional chaining (?.) and fallbacks to prevent crashes
      const title = anime?.Name || anime?.title || "";
      return title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    });
  }, [animeData, debouncedSearchTerm]);
  
  const watchlistedIds = new Set(watchlist.map(a => a._id || a.id));

  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:py-16 min-h-screen">
      <div className="flex flex-col items-center gap-6 mb-12">
        <h2 className="text-4xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Anime Catalog
        </h2>
        <input
          type="text"
          placeholder="Search for anime..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-4 bg-gray-800/50 text-white rounded-full border-2 border-transparent focus:border-blue-500 outline-none"
        />
      </div>
      
      {loading ? (
        <div className="text-center text-blue-400 text-xl animate-pulse">Connecting to Database...</div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {filteredAnime.length > 0 ? (
            filteredAnime.map(anime => (
              // The key check ensures we don't render items with missing IDs
              anime?._id || anime?.id ? (
                <AnimeCard 
                  key={anime._id || anime.id} 
                  anime={anime} 
                  onSelect={onAnimeSelect}
                  addToWatchlist={addToWatchlist}
                  removeFromWatchlist={removeFromWatchlist}
                  isWatchlisted={watchlistedIds.has(anime._id || anime.id)}
                />
              ) : null
            ))
          ) : (
            <p className="text-gray-500">No animes found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimeList;