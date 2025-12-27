import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login and pass a success message
        navigate('/login', { 
          state: { message: "Vault Account Created! Please log in to enter." } 
        });
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Vault server connection lost");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-black px-4 pt-20">
      <div className="w-full max-w-md bg-gray-950 p-12 rounded-[3rem] border border-emerald-900/30 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden">
        <div className="relative z-10">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mt-4 uppercase italic">Join the Vault</h1>
            <p className="text-emerald-500/60 font-bold text-xs tracking-[0.3em] uppercase mt-2">Create your Account</p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/50 text-red-500 text-[10px] font-black uppercase rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <input 
              type="text" 
              placeholder="Username"
              className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input 
              type="password" 
              placeholder="Secure Password"
              className="w-full bg-black border border-emerald-900/40 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-black py-5 rounded-2xl uppercase tracking-widest text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Create Account
            </button>
          </form>
          <p className="text-center mt-8 text-gray-500 font-semibold text-xs uppercase tracking-widest">
            Already an user? <Link to="/login" className="text-emerald-400 ml-2 underline">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;