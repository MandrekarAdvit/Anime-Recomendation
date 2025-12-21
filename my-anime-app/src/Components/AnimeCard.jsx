import React from 'react';

const AnimeCard = ({ anime, onSelect, addToWatchlist, removeFromWatchlist, isWatchlisted }) => {
  // 1. Safety Guard
  if (!anime) return null;

  // 2. Data Mapping (MongoDB keys prioritized)
  const title = anime?.Name || anime?.title || "Untitled";
  const image = anime?.Image_URL || anime?.image_url || anime?.photo;
  const score = anime?.Score || "N/A";
  const synopsis = anime?.Synopsis || "No description available.";
  
  // Handle genres if available in your DB
  const genres = anime?.Genres 
    ? (typeof anime.Genres === 'string' ? anime.Genres.split(',') : anime.Genres) 
    : [];

  return (
    <div className="group relative w-72 bg-gray-900/80 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all shadow-xl backdrop-blur-md">
      {/* Image / Details Trigger */}
      <div 
        className="relative h-96 overflow-hidden cursor-pointer" 
        onClick={() => onSelect(anime)}
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
        />
        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold">
          ⭐ {score}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{title}</h3>
        
        {/* Genre Tags (Optional) */}
        <div className="flex flex-wrap gap-1 mb-3">
          {genres.slice(0, 2).map((g, i) => (
            <span key={i} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
              {g.trim()}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-xs line-clamp-2 mb-4">{synopsis}</p>
        
        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents clicking the card background
            isWatchlisted ? removeFromWatchlist(anime) : addToWatchlist(anime);
          }}
          className={`w-full py-2.5 rounded-xl font-bold transition-all transform active:scale-95 ${
            isWatchlisted 
              ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
          }`}
        >
          {isWatchlisted ? 'Remove' : 'Add to List'}
        </button>
      </div>
    </div>
  );
};

export default AnimeCard;