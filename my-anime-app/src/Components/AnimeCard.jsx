import React from 'react';

const AnimeCard = ({ anime, onSelect, addToWatchlist, removeFromWatchlist, isWatchlisted }) => {
  // Safety check to prevent "ReferenceError" or white screen if data is missing
  if (!anime) return null;

  // Mapping variables to your specific Atlas anime fields
  const title = anime?.Title || "Untitled"; 
  const score = anime?.Score || "N/A";
  const type = anime?.Type || "Unknown";
  const episodes = anime?.Episodes ? `${anime.Episodes} Eps` : "Ongoing";
  const description = anime?.synopsis || "No description available.";

  return (
    <div 
      className="group relative w-72 h-[400px] bg-gray-900/90 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all shadow-xl backdrop-blur-md flex flex-col cursor-pointer"
      onClick={() => onSelect(anime)}
    >
      {/* Header Section: Metadata Badges */}
      <div className="flex justify-between items-start mb-4">
        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-600/30">
          {type} • {episodes}
        </span>
        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-md text-xs font-bold border border-yellow-500/30">
          ⭐ {score}
        </span>
      </div>

      {/* Body Section: Title & Content */}
      <div className="flex-grow overflow-hidden">
        <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight mb-3" title={title}>
          {title}
        </h3>
        
        {/* Decorative Animated Line */}
        <div className="w-10 h-1 bg-blue-600 rounded-full mb-4 group-hover:w-full transition-all duration-500"></div>
        
        <p className="text-gray-400 text-sm line-clamp-5 leading-relaxed italic">
          "{description}"
        </p>
      </div>

      {/* Footer Section: Interactive Button */}
      <div className="mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents the card's onClick (onSelect) from firing
            isWatchlisted ? removeFromWatchlist(anime) : addToWatchlist(anime);
          }}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-lg ${
            isWatchlisted 
              ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/20'
          }`}
        >
          {isWatchlisted ? 'Remove from List' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  );
};

export default AnimeCard;