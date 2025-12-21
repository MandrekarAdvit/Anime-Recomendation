import React from 'react';
import AnimeCard from './AnimeCard';

const WatchlistPage = ({ watchlist, onAnimeSelect, addToWatchlist, removeFromWatchlist }) => {
  return (
    <div className="w-full max-w-7xl px-4 py-8 sm:py-16">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
        My Anime List
      </h2>
      
      {watchlist.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-8">
          {watchlist.map((anime) => (
            <AnimeCard
              // FIX: Use MongoDB _id for the key
              key={anime._id || anime.id}
              anime={anime}
              onSelect={onAnimeSelect}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
              isWatchlisted={true} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
          <p className="text-xl font-semibold text-gray-400">Your Watchlist is Empty</p>
          <p className="text-gray-500 mt-2">Add some anime from the catalog to get started!</p>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;