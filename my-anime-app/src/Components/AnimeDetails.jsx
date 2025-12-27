import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const AnimeDetails = ({ watchlist, addToWatchlist, isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 🚀 Derive status from global state prop
  const isInVault = watchlist?.some(item => String(item._id) === String(id));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/animes/${id}`);
        const data = await res.json();
        setAnime(data);

        const simRes = await fetch(`http://localhost:5000/api/animes/${id}/similar`);
        const simData = await simRes.json();
        setSimilar(simData);
      } catch (err) {
        console.error("Vault access denied:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  /**
   * 🚀 REFINED HANDLER
   * We no longer do a local 'fetch' here. 
   * We call the parent's centralized 'addToWatchlist' which handles the DB sync.
   */
  const handleVaultSync = async () => {
    try {
      setIsSaving(true);
      // Calls the logic in App.js which handles:
      // 1. Database POST
      // 2. Error handling (Already secured check)
      // 3. Global state update
      await addToWatchlist(anime); 
    } catch (err) {
      console.error("Sync delegation failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500 font-black tracking-[0.4em] animate-pulse italic">DECRYPTING...</div>;
  if (!anime) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">RECORD NOT FOUND</div>;

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 pt-44 pb-20 selection:bg-emerald-500 selection:text-black">
      
      {/* 🔙 NAVIGATION & ACTION BAR */}
      <div className="max-w-7xl mx-auto mb-16 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="group text-emerald-500 font-black flex items-center gap-3 uppercase text-[14px] tracking-[0.3em] hover:text-white transition-all"
        >
          <span className="group-hover:-translate-x-2 transition-transform duration-300">←</span> 
          Back to Catalogue
        </button>

        {/* 🚀 ACTION UI */}
        {isLoggedIn ? (
          isInVault ? (
            <div className="px-8 py-3 bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 font-black uppercase text-[12px] tracking-[0.2em] rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <span className="text-lg">✓</span> Secured in Vault
            </div>
          ) : (
            <button 
              onClick={handleVaultSync}
              disabled={isSaving}
              className={`px-8 py-3 bg-emerald-500 text-black font-black uppercase text-[12px] tracking-[0.2em] rounded-full hover:bg-white hover:-translate-y-1 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Syncing...' : '+ Add to Vault'}
            </button>
          )
        ) : (
          <Link 
            to="/login"
            className="px-8 py-3 border border-emerald-500/30 text-emerald-500 font-black uppercase text-[12px] tracking-[0.2em] rounded-full hover:bg-emerald-500 hover:text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            Login to Secure Record
          </Link>
        )}
      </div>
      
      {/* Rest of the UI (Header, Synopsis, Tech Grid, Similar) remains identical */}
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="flex flex-wrap gap-3 mb-8">
            {anime.genres?.split(',').map(genre => (
              <span key={genre} className="px-4 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[14px] font-black uppercase tracking-widest rounded-md">
                {genre.trim()}
              </span>
            ))}
          </div>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter mb-12">
            {anime.Title}
          </h1>
          
          <div className="flex gap-16 border-y border-emerald-900/20 py-10">
            <div>
              <p className="text-[13px] font-black text-emerald-900 uppercase tracking-[0.2em] mb-2">Vault Score</p>
              <p className="text-6xl font-black text-emerald-400 italic leading-none">{anime.Score || "N/A"}</p>
            </div>
            <div className="w-px bg-emerald-900/20" />
            <div>
              <p className="text-[13px] font-black text-emerald-900 uppercase tracking-[0.2em] mb-2">Media Format</p>
              <p className="text-6xl font-black text-white italic leading-none uppercase">{anime.Type || "TV"}</p>
            </div>
          </div>
        </header>

        <section className="mb-24">
          <h3 className="text-[14px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-8 italic">Synopsis</h3>
          <p className="text-gray-300 text-2xl md:text-3xl leading-snug font-medium max-w-6xl italic border-l-4 border-emerald-500/30 pl-10">
            {anime.synopsis || "No detailed dossier available for this title."}
          </p>
        </section>

        <section className="mb-40">
          <h3 className="text-[14px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-8 italic">Additional information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-emerald-900/20 rounded-[2.5rem] overflow-hidden border border-emerald-900/20">
            {[
              { label: "Studio", value: anime.Studios || "Unknown" },
              { label: "Runtime", value: `${anime.Episodes || "?"} Eps` },
              { label: "Status", value: anime.Status || "Finished" },
              { label: "Origin", value: anime.Source || "Original" },
            ].map((item, index) => (
              <div key={index} className="bg-gray-950/80 p-10 flex flex-col justify-center text-center group hover:bg-emerald-900/10 transition-colors">
                <h5 className="text-[13px] font-black text-emerald-700 uppercase mb-3 tracking-widest italic group-hover:text-emerald-500 transition-colors">{item.label}</h5>
                <p className="text-xl font-bold uppercase text-white tracking-tighter">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-24 border-t border-emerald-900/20">
          <div className="flex items-center gap-8 mb-16">
            <h2 className="text-4xl font-black italic uppercase text-white">You may also be interested in</h2>
            <div className="h-px flex-grow bg-emerald-900/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {similar.map((item) => (
              <div 
                key={item._id} 
                onClick={() => { navigate(`/animes/${item._id}`); window.scrollTo(0,0); }}
                className="group cursor-pointer p-8 bg-gray-950/50 rounded-3xl border border-emerald-900/20 hover:border-emerald-500/50 hover:bg-emerald-900/5 transition-all duration-300 flex flex-col h-full"
              >
                <h4 className="text-xl font-black uppercase text-gray-300 group-hover:text-emerald-400 leading-none tracking-tight mb-6 transition-colors">
                  {item.Title}
                </h4>
                <div className="mt-auto flex flex-wrap gap-2">
                  {item.genres?.split(',').slice(0, 3).map((genre, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 text-[13px] font-bold uppercase tracking-widest text-emerald-500/70 bg-emerald-900/10 rounded-lg whitespace-nowrap border border-emerald-900/10"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimeDetails;