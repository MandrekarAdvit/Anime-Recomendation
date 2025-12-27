import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Ensure these props are being passed from App.js where your auth state lives
const HomeDashboard = ({ isLoggedIn, username }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "MASSIVE DATABASE",
      desc: "Instant access to 10,000+ anime records.",
      img: "https://otakukart.com/wp-content/uploads/2025/03/The-Big-Three-Anime-2.webp",
    },
    {
      title: "CUSTOM WATCHLISTS",
      desc: "Sign in to sync your favorite titles across all your devices securely.",
      img: "https://images.hdqwalls.com/wallpapers/attack-on-titan-5k-ms.jpg", 
      position: "center 20%" 
    },
    {
      title: "SMART DISCOVERY",
      desc: "Advanced search filtering and recommendation engines based on your viewing patterns.",
      img: "https://images.wallpapersden.com/image/download/roronoa-zoro-hd-one-piece-art_bWhua2eUmZqaraWkpJRnaGhprWZnZWo.jpg",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="flex flex-col w-full bg-black pb-20 px-4 md:px-10 gap-[80px]">
      
      {/* SECTION 1: TOP WELCOME BANNER */}
      <div className="relative w-full h-[50vh] overflow-hidden rounded-[3rem] border border-emerald-900/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] mt-8">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110"
          style={{ 
            backgroundImage: "url('https://preview.redd.it/new-one-piece-ed-is-a-21-9-goldmine-3440x1440-v0-sg73cctzzyzb1.png?width=3435&format=png&auto=webp&s=6f3f0569c52c323e80b5e6f89eff07430d15978b')",
            backgroundPosition: 'center 30%' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white/90 mb-2 tracking-tighter uppercase italic">
            {/* Conditional Heading: Greets user if logged in */}
            {isLoggedIn ? `WELCOME BACK, ${username || 'MEMBER'}` : "WELCOME TO"}
          </h1>
          <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl">
            <span className="text-white">ANIME</span>
            <span className="text-emerald-500">VAULT</span>
          </h1>
          <div className="mt-8 h-1 w-32 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        </div>
      </div>

      {/* SECTION 2: FEATURE SLIDER CARD */}
      <div className="w-full flex flex-col gap-12">
        <div className="text-center">
            <h3 className="text-emerald-500 font-black tracking-[0.5em] uppercase text-sm mb-2">Platform Features</h3>
            <div className="h-1 w-24 bg-emerald-600 mx-auto rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>

         <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center overflow-hidden rounded-[3.5rem] border border-emerald-900/20 bg-gray-950/40 shadow-2xl">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className="absolute inset-0 bg-cover transition-transform duration-[10s] scale-110"
                style={{ 
                  backgroundImage: `url(${slide.img})`,
                  backgroundPosition: slide.position || 'center' 
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
          ))}

          {/* Slide Text Content */}
          <div className="relative z-20 w-full px-10 md:px-32">
            <div className="max-w-5xl">
              <h2 className="text-6xl md:text-9xl font-black text-white mb-8 leading-none tracking-tighter uppercase italic drop-shadow-2xl">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-200 text-xl md:text-4xl font-semibold mb-16 leading-relaxed max-w-3xl drop-shadow-lg">
                {slides[currentSlide].desc}
              </p>

              {/* ACTION BUTTONS: CONDITIONAL RENDERING HERE */}
              <div className="flex flex-col sm:flex-row gap-8">
                <button 
                  onClick={() => navigate('/catalog')}
                  className="px-16 py-6 bg-emerald-600 hover:bg-emerald-500 text-black rounded-2xl font-black text-2xl uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  Explore Catalog
                </button>

                {isLoggedIn ? (
                  /* Shows when user is logged in */
                  <button 
                    onClick={() => navigate('/watchlist')}
                    className="px-16 py-6 bg-transparent hover:bg-emerald-900/10 text-emerald-400 rounded-2xl font-black text-2xl uppercase tracking-widest border-2 border-emerald-600 transition-all transform hover:scale-105"
                  >
                    My Watchlist
                  </button>
                ) : (
                  /* Shows when user is logged out */
                  <button 
                    onClick={() => navigate('/register')}
                    className="px-16 py-6 bg-transparent hover:bg-emerald-900/10 text-emerald-400 rounded-2xl font-black text-2xl uppercase tracking-widest border-2 border-emerald-600 transition-all transform hover:scale-105"
                  >
                    Join Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-4 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 transition-all duration-500 rounded-full ${
                  index === currentSlide ? 'w-32 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'w-4 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;