import React, { useState, useEffect } from 'react';
import WelcomePage from './Components/WelcomePage';
import AnimeList from './Components/AnimeList';
import AnimeDetails from './Components/AnimeDetails';
import WatchlistPage from './Components/WatchlistPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [selectedAnime, setSelectedAnime] = useState(null);
  
  // 1. Load watchlist from LocalStorage on mount
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('animeWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // 2. Persist watchlist to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('animeWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // 3. FIXED: logic to handle both MongoDB _id and local JSON id
  const addToWatchlist = (animeToAdd) => {
    const idToMatch = animeToAdd._id || animeToAdd.id;
    
    setWatchlist((prev) => {
      // Check if this anime (by database _id) is already in the list
      const isAlreadyInList = prev.some(anime => (anime._id || anime.id) === idToMatch);
      
      if (!isAlreadyInList) {
        return [...prev, animeToAdd];
      }
      return prev;
    });
  };

  // 4. FIXED: logic to remove correctly using MongoDB _id
  const removeFromWatchlist = (animeToRemove) => {
    // We take the whole object or just the ID for flexibility
    const idToRemove = animeToRemove._id || animeToRemove.id || animeToRemove;
    
    setWatchlist((prev) => 
      prev.filter(anime => (anime._id || anime.id) !== idToRemove)
    );
  };

  const handleAnimeSelect = (anime) => {
    setSelectedAnime(anime);
    setCurrentPage('anime-details');
  };

  const handleBack = () => {
    if (currentPage === 'anime-details') {
      setCurrentPage('anime-list');
    } else {
      setCurrentPage('welcome');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'anime-list':
        return (
          <AnimeList 
            onAnimeSelect={handleAnimeSelect} 
            watchlist={watchlist} 
            addToWatchlist={addToWatchlist} 
            removeFromWatchlist={removeFromWatchlist} 
          />
        );
      case 'anime-details':
        return <AnimeDetails anime={selectedAnime} />;
      case 'watchlist':
        return (
          <WatchlistPage 
            watchlist={watchlist} 
            onAnimeSelect={handleAnimeSelect} 
            addToWatchlist={addToWatchlist} 
            removeFromWatchlist={removeFromWatchlist} 
          />
        );
      case 'welcome':
      default:
        return <WelcomePage onStart={() => setCurrentPage('anime-list')} />;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/40 text-white font-sans flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
      
      {currentPage !== 'welcome' && (
        <header className="absolute top-5 left-5 right-5 z-10 flex justify-between items-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700/60 hover:bg-gray-700 text-white rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
          >
            &larr; Back
          </button>

          <button
            onClick={() => setCurrentPage('watchlist')}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-full transition-all duration-300 backdrop-blur-sm transform hover:scale-105"
          >
            My Watchlist ({watchlist.length})
          </button>
        </header>
      )}

      <div key={currentPage} className="w-full flex justify-center animate-fade-in">
        {renderPage()}
      </div>
    </main>
  );
};

export default App;