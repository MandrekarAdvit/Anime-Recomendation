import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", formData.email);
    // Placeholder for AuthContext login logic
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gray-950 p-12 rounded-[3rem] border border-emerald-900/30 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden">
        
        {/* Subtle Green Glow */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/10 blur-[100px] rounded-full" />

        <div className="relative z-10">
          <header className="text-center mb-10">
            {/* Brand Identity: Updated colors to Emerald Green */}
            <h2 className="text-2xl font-black text-white italic tracking-tighter inline-block">Anime</h2>
            <h2 className="text-2xl font-black text-emerald-500 italic tracking-tighter inline-block mr-3">Vault</h2>
            
            <h1 className="text-4xl font-black text-white mt-4 uppercase italic">Welcome Back</h1>
            <p className="text-emerald-500/60 font-bold text-xs tracking-[0.3em] uppercase mt-2">Enter your credentials</p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-700 font-semibold"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-700 font-semibold"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest text-lg transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] mt-4"
            >
              Enter Vault
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-semibold">
            New to the Vault? 
            {/* FIXED: Path updated from /signup to /register */}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 ml-2 transition-colors underline decoration-emerald-900/50">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;