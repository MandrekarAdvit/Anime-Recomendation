import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ watchlistCount, isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const getLinkStyle = (path) => 
    `transition-all duration-300 font-black uppercase tracking-[0.2em] py-4 border-b border-emerald-900/10 w-full flex justify-between items-center ${
      location.pathname === path ? 'text-emerald-500' : 'text-white/70'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-black border-b border-emerald-900/20 px-6 py-4 md:px-12 flex justify-between items-center">
      
      {/* 💎 LOGO: Animated Abbreviation */}
      <Link to="/" className="flex items-center gap-2 group relative z-[110]">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)]">
          <div className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500 font-black text-black text-[10px] md:text-sm">AV</div>
        </div>
        <span className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white">
          Anime<span className="text-emerald-500">Vault</span>
        </span>
      </Link>

      {/* 🖥️ DESKTOP LINKS */}
      <div className="hidden md:flex items-center gap-12">
        <Link to="/" className="text-sm font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">Dashboard</Link>
        <Link to="/catalog" className="text-sm font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">Catalogue</Link>
        {isLoggedIn && (
          <Link to="/watchlist" className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-emerald-500 transition-colors">
            Watchlist
            <span className="bg-emerald-600 text-black px-2 py-0.5 rounded-full text-[10px]">{watchlistCount}</span>
          </Link>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-sm font-black uppercase tracking-widest text-red-500">Logout</button>
        ) : (
          <Link to="/login" className="text-sm font-black uppercase tracking-widest text-emerald-500">Login</Link>
        )}
      </div>

      {/* 📱 MOBILE TOGGLE */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden relative z-[110] p-2 text-emerald-500"
      >
        <div className="space-y-1.5">
          <span className={`block w-6 h-0.5 bg-emerald-500 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-emerald-500 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-emerald-500 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* 📱 MOBILE NAVIGATION DRAWER */}
      <div className={`fixed inset-0 bg-gray-950 transition-transform duration-500 md:hidden z-[100] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full pt-24 px-8">
          
          <p className="text-emerald-900 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Main Menu</p>
          
          <Link to="/" className={getLinkStyle('/')}>
            Dashboard <span className="text-[10px] opacity-30">01</span>
          </Link>
          
          <Link to="/catalog" className={getLinkStyle('/catalog')}>
            Catalogue <span className="text-[10px] opacity-30">02</span>
          </Link>

          {isLoggedIn && (
            <Link to="/watchlist" className={getLinkStyle('/watchlist')}>
              Watchlist 
              <span className="bg-emerald-600 text-black px-2 py-0.5 rounded-full text-[10px]">{watchlistCount}</span>
            </Link>
          )}

          <div className="mt-auto pb-12">
            <p className="text-emerald-900 font-black text-[10px] uppercase tracking-[0.5em] mb-4">Terminal</p>
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="w-full bg-red-950/20 border border-red-500/50 text-red-500 py-4 rounded-xl font-black uppercase tracking-widest"
              >
                Disconnect Session (Logout)
              </button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link 
                  to="/login" 
                  className="w-full bg-emerald-600 text-black py-4 rounded-xl font-black uppercase tracking-widest text-center"
                >
                  Access Vault (Login)
                </Link>
                <Link 
                  to="/register" 
                  className="w-full border border-emerald-500/50 text-emerald-500 py-4 rounded-xl font-black uppercase tracking-widest text-center"
                >
                  Establish Identity (Sign Up)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;