import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ watchlistCount, isLoggedIn, handleLogout }) => {
  const location = useLocation();

  const getLinkStyle = (path) => 
    `transition-all duration-300 font-black uppercase text-[16px] tracking-[0.2em] ${
      location.pathname === path 
        ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
        : 'text-white/50 hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-emerald-900/20 px-6 py-5 md:px-12 flex justify-between items-center">
      
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <div className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500 font-black text-black text-sm">AV</div>
        </div>
        <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
          Anime<span className="text-emerald-500">Vault</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-12">
        <Link to="/" className={getLinkStyle('/')}>Dashboard</Link>
        <Link to="/catalog" className={getLinkStyle('/catalog')}>Catalogue</Link>
        
        {isLoggedIn && (
          <Link to="/watchlist" className="relative group flex items-center gap-3">
            <span className={getLinkStyle('/watchlist')}>Watchlist</span>
            {watchlistCount > 0 && (
              <span className="bg-emerald-600 text-black text-[12px] font-black px-2.5 py-0.5 rounded-full animate-pulse">
                {watchlistCount}
              </span>
            )}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-10">
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="text-white/50 hover:text-red-500 font-black uppercase text-[16px] tracking-widest transition-colors"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="text-white/50 hover:text-white font-black uppercase text-[16px] tracking-widest transition-colors">
              Login
            </Link>
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-black px-10 py-4 rounded-full font-black uppercase text-[16px] tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;