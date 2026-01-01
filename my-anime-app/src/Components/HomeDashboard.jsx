import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DiscoveryFeed from './DiscoveryFeed';

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
    <div className="flex flex-col w-full bg-black pb-20 px-4 md:px-10 gap-12 md:gap-[80px]">
      
      {/* SECTION 1: TOP WELCOME BANNER */}
      <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-emerald-900/30 shadow-[0_0_50px_rgba(16,185,129,0.1)] mt-4 md:mt-8">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] scale-110"
          style={{ 
            backgroundImage: "url('https://preview.redd.it/new-one-piece-ed-is-a-21-9-goldmine-3440x1440-v0-sg73cctzzyzb1.png?width=3435&format=png&auto=webp&s=6f3f0569c52c323e80b5e6f89eff07430d15978b')",
            backgroundPosition: 'center 30%' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-xl md:text-5xl font-black text-white/90 mb-2 tracking-tighter uppercase italic">
            {isLoggedIn ? `WELCOME BACK, ${username || 'MEMBER'}` : "WELCOME TO"}
          </h1>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter uppercase italic leading-none drop-shadow-2xl">
            <span className="text-white">ANIME</span>
            <span className="text-emerald-500">VAULT</span>
          </h1>
          <div className="mt-4 md:mt-8 h-1 w-20 md:w-32 bg-emerald-600 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
        </div>
      </div>

      {/* SECTION 2: FEATURE SLIDER CARD */}
      <div className="w-full flex flex-col gap-8 md:gap-12">
        <div className="text-center">
            <h3 className="text-emerald-500 font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-xs md:text-sm mb-2">Platform Features</h3>
            <div className="h-1 w-16 md:w-24 bg-emerald-600 mx-auto rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
        </div>

         <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-900/20 bg-gray-950/40 shadow-2xl">
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
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>
          ))}

          {/* Content Wrapper: Adjusted padding and text alignment for mobile */}
          <div className="relative z-20 w-full px-6 md:px-32 text-center md:text-left">
            <div className="max-w-5xl">
              <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-white mb-4 md:mb-8 leading-none tracking-tighter uppercase italic drop-shadow-2xl">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-300 text-base md:text-4xl font-semibold mb-8 md:mb-16 leading-relaxed max-w-3xl drop-shadow-lg mx-auto md:mx-0">
                {slides[currentSlide].desc}
              </p>

              {/* Responsive Buttons: Stack on mobile, row on desktop */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('/catalog')}
                  className="px-8 md:px-16 py-4 md:py-6 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl md:rounded-2xl font-black text-lg md:text-2xl uppercase tracking-widest transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                >
                  Explore Catalog
                </button>

                {isLoggedIn ? (
                  <button 
                    onClick={() => navigate('/watchlist')}
                    className="px-8 md:px-16 py-4 md:py-6 bg-transparent hover:bg-emerald-900/10 text-emerald-400 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl uppercase tracking-widest border-2 border-emerald-600 transition-all transform hover:scale-105"
                  >
                    My Watchlist
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/register')}
                    className="px-8 md:px-16 py-4 md:py-6 bg-transparent hover:bg-emerald-900/10 text-emerald-400 rounded-xl md:rounded-2xl font-black text-lg md:text-2xl uppercase tracking-widest border-2 border-emerald-600 transition-all transform hover:scale-105"
                  >
                    Join Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pagination Indicators: Responsive widths */}
          <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-4 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 md:h-3 transition-all duration-500 rounded-full ${
                  index === currentSlide ? 'w-16 md:w-32 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'w-3 md:w-4 bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: PERSONALIZED DISCOVERY SECTION */}
      {isLoggedIn && (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <DiscoveryFeed />
        </div>
      )}
      
    </div>
  );
};

export default HomeDashboard;