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
  const [watchlist, setWatchlist] = useState([]); 

  // --- 2. SESSION INITIALIZATION ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUser || "Member");
    }
  }, []);

  // --- 3. BACKEND VAULT SYNCHRONIZATION ---
  useEffect(() => {
    const syncVaultWithDB = async () => {
      const token = localStorage.getItem('token');
      if (isLoggedIn && token) {
        try {
          const res = await fetch('http://localhost:5000/api/watchlist', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const dbWatchlist = await res.json();
            setWatchlist(dbWatchlist); 
          }
        } catch (err) {
          console.error("Vault synchronization failed:", err);
        }
      }
    };
    syncVaultWithDB();
  }, [isLoggedIn]);

  // --- 4. PERSISTENCE SYNC (Local Fallback) ---
  useEffect(() => {
    localStorage.setItem('animeVault', JSON.stringify(watchlist));
  }, [watchlist]);

  // --- 5. 🚀 CENTRALIZED DATA HANDLERS ---
  
  const addToWatchlist = async (anime) => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login to secure records.");
    if (watchlist.some(a => String(a._id) === String(anime._id))) return;

    try {
      const res = await fetch('http://localhost:5000/api/watchlist/add', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ animeId: anime._id, token })
      });

      const data = await res.json();

      if (res.ok) {
        setWatchlist((prev) => [...prev, anime]);
        console.log(`✅ VAULT SYNC: ${anime.Title} secured.`);
      } 
      else if (res.status === 400 && data.message.includes("already secured")) {
        setWatchlist((prev) => [...prev, anime]);
      } 
      else {
        alert(data.message || "Failed to sync with Vault.");
      }
    } catch (err) {
      console.error("Critical Vault Sync Error:", err);
    }
  };

  const removeFromWatchlist = async (anime) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/watchlist/remove', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ animeId: anime._id })
      });

      if (res.ok) {
        setWatchlist((prev) => prev.filter((item) => String(item._id) !== String(anime._id)));
        console.log(`🗑️ VAULT UPDATE: Expunged ${anime.Title} records.`);
      }
    } catch (err) {
      console.error("Critical Removal Sync Error:", err);
    }
  };

  // --- 6. LOGIC: FULL SESSION TERMINATION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('animeVault'); 
    setIsLoggedIn(false);
    setUsername("");
    setWatchlist([]); 
    console.log("Vault Session Terminated.");
  };

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <main className="min-h-screen bg-black text-white">
        <Navbar watchlistCount={watchlist.length} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
       
        <Routes>
          <Route path="/" element={<HomeDashboard isLoggedIn={isLoggedIn} username={username} />} />
          
          <Route path="/catalog" element={
            <AnimeList
              watchlist={watchlist}
              addToWatchlist={addToWatchlist}
              removeFromWatchlist={removeFromWatchlist}
              isLoggedIn={isLoggedIn} 
            />
          } />
          
          {/* ✅ CLEANED: Passing only required props to WatchlistPage */}
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <WatchlistPage 
                watchlist={watchlist} 
                removeFromWatchlist={removeFromWatchlist} 
              />
            </ProtectedRoute>
          } />
          
          <Route path="/login" element={
            !isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} /> : <Navigate to="/" />
          } />
          
          <Route path="/register" element={
            !isLoggedIn ? <Signup /> : <Navigate to="/" />
          } />

          <Route path="/animes/:id" element={
            <AnimeDetails 
              watchlist={watchlist} 
              addToWatchlist={addToWatchlist} 
              isLoggedIn={isLoggedIn}
            />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;