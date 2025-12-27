import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Component Imports
import Navbar from './Components/Navbar';
import HomeDashboard from './Components/HomeDashboard';
import AnimeDetails from './Components/AnimeDetails';
import WatchlistPage from './Components/WatchlistPage';
import AnimeList from './Components/AnimeList';
import Login from './pages/Login';
import Signup from './pages/Signup';

const App = () => {
  // --- 1. CORE STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [watchlist, setWatchlist] = useState(() => {
    // Initialize state from storage to maintain vault across refreshes
    const saved = localStorage.getItem('animeVault');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 2. SESSION INITIALIZATION ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUser || "Member");
    }
  }, []);

  // --- 3. PERSISTENCE SYNC ---
  // Automatically saves the watchlist to storage whenever it changes
  useEffect(() => {
    localStorage.setItem('animeVault', JSON.stringify(watchlist));
  }, [watchlist]);

  // --- 4. DATA HANDLERS ---
  const addToWatchlist = (anime) => {
    if (!watchlist.some(a => a._id === anime._id)) {
      setWatchlist([...watchlist, anime]);
    }
  };

  const removeFromWatchlist = (anime) => {
    setWatchlist((prev) => prev.filter((item) => item._id !== anime._id));
  };

  /**
   * --- 5. LOGIC: FULL SESSION TERMINATION (DEEP CLEAN) ---
   * This is the "Source of Truth" for the entire app. 
   * When this runs, it clears everything needed for a fresh guest state.
   */
  const handleLogout = () => {
    // A. Clear Authentication from Browser
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // B. Clear Saved Vault Data from Browser Storage
    // This prevents old data from "leaking" back into a new session
    localStorage.removeItem('animeVault'); 
    
    // C. Reset React States (Triggers immediate Navbar & Route re-render)
    setIsLoggedIn(false);
    setUsername("");

    // D. CRITICAL: Reset Watchlist memory
    // Because AnimeList receives this 'watchlist' as a prop, 
    // setting this to [] forces all red buttons to turn green instantly.
    setWatchlist([]); 

    console.log("Vault Session Terminated: Auth and Watchlist data cleared.");
  };

  // --- 6. ROUTE PROTECTION ---
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <main className="min-h-screen bg-black text-white">
        <Navbar
          watchlistCount={watchlist.length}
          isLoggedIn={isLoggedIn}
          handleLogout={handleLogout}
        />
       
        <Routes>
          {/* Dashboard Route */}
          <Route path="/" element={<HomeDashboard isLoggedIn={isLoggedIn} username={username} />} />
         
          {/* Catalogue Route - Receives watchlist prop to toggle buttons */}
          <Route path="/catalog" element={
            <AnimeList
              watchlist={watchlist}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
              isLoggedIn={isLoggedIn} 
            />
          } />
         
          {/* Protected Watchlist Route */}
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <WatchlistPage watchlist={watchlist} removeFromWatchlist={removeFromWatchlist} />
            </ProtectedRoute>
          } />
         
          {/* Auth Routes: Blocked if already logged in */}
          <Route path="/login" element={
            !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} /> : <Navigate to="/" />
          } />
         
          <Route path="/register" element={
            !isLoggedIn ? <Signup /> : <Navigate to="/" />
          } />

          {/* Details & Fallback */}
          <Route path="/animes/:id" element={<AnimeDetails />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;