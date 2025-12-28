import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscoveryFeed = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('For You');
  const navigate = useNavigate();

  const discoveryPills = ['For You', 'Action', 'Suspense', 'Sci-Fi', 'Fantasy', 'Sports', 'Slice of Life', 'Romance'];

  const fetchRecommendations = async (genre = 'For You') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const url = genre === 'For You' 
        ? 'http://localhost:5000/api/recommendations' 
        : `http://localhost:5000/api/animes?genre=${genre}&limit=10&sort=Score`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRecommendations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Discovery Sync Error:", err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(activeGenre);
  }, [activeGenre]);

  return (
    <section className="w-full py-20 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-none mb-4 text-white tracking-tighter">
            Discover
          </h2>
          <p className="text-emerald-500 font-bold uppercase tracking-[0.4em] text-[15px] italic">
            Recommendations for you
          </p>
        </div>

        {/* GENRE PILLS */}
        <div className="flex flex-wrap gap-3">
          {discoveryPills.map(pill => (
            <button
              key={pill}
              onClick={() => setActiveGenre(pill)}
              // 🚀 UPDATED: Text size set to 15px per request
              className={`px-8 py-2.5 rounded-full text-[15px] font-black uppercase tracking-widest transition-all border-2 ${
                activeGenre === pill 
                ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : 'bg-transparent border-emerald-900/30 text-emerald-500/60 hover:border-emerald-500 hover:text-emerald-500'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* RECOMMENDATION GRID */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
           <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
           <p className="text-emerald-500 animate-pulse italic font-black tracking-[0.3em] text-sm">CALCULATING INTEREST VECTOR...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {recommendations.length > 0 ? (
            recommendations.map((anime) => (
              <div 
                key={anime._id}
                onClick={() => { navigate(`/animes/${anime._id}`); window.scrollTo(0,0); }}
                className="group relative cursor-pointer p-8 bg-[#020617]/50 rounded-[2rem] border-2 border-emerald-900/20 hover:border-emerald-500 transition-all duration-500 flex flex-col h-[320px] justify-between overflow-hidden shadow-2xl"
              >
                {/* MATCH SCORE / STATUS TAG */}
                <div className="flex justify-between items-start">
                  <div className="h-1.5 w-12 bg-emerald-500 rounded-full" />
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] font-black text-emerald-500/50 uppercase tracking-tighter mb-1">Compatibility</span>
                    {/* 🚀 FIXED: Replaced ??% with a stylized '---' or 'NEW' tag if score is missing */}
                    <span className="text-2xl font-black italic text-emerald-500 leading-none">
                      {anime.matchScore ? `${anime.matchScore}%` : <span className="text-sm tracking-widest opacity-40">— —</span>}
                    </span>
                  </div>
                </div>
                
                {/* TITLE CONTENT */}
                <div>
                  <h4 className="text-xl font-black uppercase text-white leading-tight mb-2 line-clamp-2 transition-colors group-hover:text-emerald-400">
                    {anime.Title}
                  </h4>
                  <div className="h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-500 rounded-full" />
                </div>

                {/* FOOTER INFO */}
                <div className="flex justify-between items-center pt-6 border-t border-emerald-900/20">
                    <button className="text-[14px] font-black text-emerald-400 uppercase tracking-widest hover:text-white transition-colors">
                        View Details
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-emerald-900/20 rounded-[3rem]">
              <p className="text-gray-600 italic font-bold text-xl uppercase tracking-widest">No Matches Detected</p>
              <p className="text-emerald-500/40 text-[10px] uppercase font-black tracking-[0.5em] mt-4">Expand your vault to calibrate the intelligence engine.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default DiscoveryFeed;