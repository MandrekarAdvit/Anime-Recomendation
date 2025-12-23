import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUsername }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Catch the message passed from Signup.jsx
  const signupSuccessMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);

        // TRIGGER REACTIVE STATE CHANGE
        setIsLoggedIn(true);
        setUsername(data.username);

        navigate('/'); 
      } else {
        setError(data.message || "Invalid Authorization Codes");
      }
    } catch (err) {
      setError("Vault Server Connection Lost");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-black px-4 pt-20">
      <div className="w-full max-w-md bg-gray-950 p-12 rounded-[3rem] border border-emerald-900/30 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden">
        <div className="relative z-10">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mt-4 uppercase italic">Welcome Back</h1>
            <p className="text-emerald-500/60 font-bold text-xs tracking-[0.3em] uppercase mt-2">Verify Identity</p>
          </header>

          {/* Success message from Signup */}
          {signupSuccessMessage && !error && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/40 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl text-center animate-pulse">
              {signupSuccessMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Enter Vault
            </button>
          </form>
          <p className="text-center mt-8 text-gray-500 font-semibold uppercase tracking-widest text-xs">
            New to the Vault? <Link to="/register" className="text-emerald-400 ml-2 underline">Register Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;