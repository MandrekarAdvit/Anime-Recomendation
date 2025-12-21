import React from 'react';

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-semibold text-gray-400">{label}</p>
    <p className="text-lg text-white">{value || 'N/A'}</p>
  </div>
);

const AnimeDetails = ({ anime }) => {
  if (!anime) {
    return <p>Loading anime details...</p>;
  }

  return (
    <div className="w-full max-w-5xl p-6 sm:p-8 bg-gray-800/50 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm text-white">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Column: Image */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={anime.photo}
            alt={`Poster of ${anime.title}`}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
            onError={(e) => e.target.src = "https://placehold.co/400x550/0F172A/FFFFFF?text=No+Image"}
          />
        </div>

        {/* Right Column: Details */}
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            {anime.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500">
                <span className="font-bold text-lg">★</span>
                <span className="font-bold text-lg">{anime.score}</span>
             </div>
          </div>
          
          <h2 className="text-xl font-bold text-blue-300 mb-2">Synopsis</h2>
          <p className="text-gray-300 mb-6 text-base leading-relaxed">
            {anime.synopsis}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 mb-6 p-4 bg-gray-900/40 rounded-lg">
            <DetailItem label="Type" value={anime.type} />
            <DetailItem label="Episodes" value={anime.episodes} />
            <DetailItem label="Status" value={anime.status} />
            <DetailItem label="Aired" value={anime.aired} />
            <DetailItem label="Premiered" value={anime.premiered} />
            <DetailItem label="Source" value={anime.source} />
          </div>

          <div className="flex flex-wrap gap-2">
            {anime.genres && anime.genres.split(',').map((genre, index) => (
              <span key={index} className="bg-gray-700/80 text-gray-200 text-xs px-3 py-1 rounded-full font-medium border border-gray-600">
                {genre.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetails;