// src/Components/AnimeDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AnimeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/animes/${id}`);
        const data = await response.json();
        setAnime(data);
      } catch (err) {
        console.error("Error loading record:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-black">ACCESSING VAULT...</div>;
  if (!anime) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">RECORD NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-32">
      <button onClick={() => navigate(-1)} className="text-emerald-500 font-bold mb-10 hover:underline uppercase text-xs tracking-widest">← Back to Catalogue</button>
      
      <div className="max-w-5xl mx-auto bg-gray-950 p-12 rounded-[3rem] border border-emerald-900/20 shadow-2xl">
        <h1 className="text-6xl font-black italic text-white mb-8 uppercase drop-shadow-lg">{anime.Title}</h1>
        
        <div className="flex gap-4 mb-10">
          <span className="px-6 py-2 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-black uppercase">Rating: {anime.Score || "N/A"}</span>
          <span className="px-6 py-2 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-black uppercase">Type: {anime.Type}</span>
        </div>

        <div className="h-1 w-20 bg-emerald-600 rounded-full mb-10" />

        {/* FIXED: Changed anime.Description to anime.synopsis */}
        <p className="text-gray-400 text-xl leading-relaxed font-medium">
          {anime.synopsis || "No detailed dossier available for this title."}
        </p>
      </div>
    </div>
  );
};

export default AnimeDetails;