// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Navbar from './Components/Navbar';
import HomeDashboard from './Components/HomeDashboard';
import AnimeList from './Components/AnimeList';
import AnimeDetails from './Components/AnimeDetails';
import WatchlistPage from './Components/WatchlistPage';

// ACTUAL PAGE IMPORTS (Replacing Placeholders)
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('animeVault');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('animeVault', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (anime) => {
    if (!watchlist.some(a => a._id === anime._id)) setWatchlist([...watchlist, anime]);
  };

  const removeFromWatchlist = (anime) => {
    setWatchlist((prev) => prev.filter((item) => item._id !== anime._id));
  };

  return (
    <Router>
      <main className="min-h-screen bg-black text-white">
        <Navbar watchlistCount={watchlist.length} />
        
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          
          <Route path="/catalog" element={
            <AnimeList 
              watchlist={watchlist} 
              addToWatchlist={addToWatchlist} 
              removeFromWatchlist={removeFromWatchlist} 
            />
          } />
          
          <Route path="/watchlist" element={
            <WatchlistPage watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />
          } />
          
          {/* UPDATED AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* Details Route */}
          <Route path="/animes/:id" element={<AnimeDetails />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;