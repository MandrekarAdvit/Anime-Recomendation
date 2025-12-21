import React from 'react';

const WelcomePage = ({ onStart }) => (
  <div className="w-full max-w-4xl p-6 sm:p-10 bg-gray-800/50 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm">
    <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
      Anime Recommendation System
    </h1>
    <p className="text-gray-300 text-center text-base sm:text-lg mb-8">
      Discover and explore your next favorite anime from our curated catalog.
    </p>
    <div className="flex justify-center">
      <button
        onClick={onStart}
        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
      >
        Get Started
      </button>
    </div>
  </div>
);

export default WelcomePage;