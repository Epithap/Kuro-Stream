import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Tv, Sparkles, ChevronRight } from 'lucide-react';
import './Welcome.css';

const MANGA_TITLES = ['Solo Leveling', 'Jujutsu Kaisen', 'One Piece', 'Berserk', 'Vinland Saga', 'Chainsaw Man'];
const ANIME_TITLES = ['Demon Slayer', 'Attack on Titan', 'Naruto', 'Bleach', 'One Punch Man', 'Re:Zero'];

const Welcome = () => {
  const navigate = useNavigate();
  const [mangaIdx, setMangaIdx] = useState(0);
  const [animeIdx, setAnimeIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const mangaTimer = setInterval(() => setMangaIdx(i => (i + 1) % MANGA_TITLES.length), 2000);
    const animeTimer = setInterval(() => setAnimeIdx(i => (i + 1) % ANIME_TITLES.length), 2300);
    return () => { clearInterval(mangaTimer); clearInterval(animeTimer); };
  }, []);

  useEffect(() => {
    const pts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 5,
    }));
    setParticles(pts);
  }, []);

  const handleSelectMode = (mode) => {
    localStorage.setItem('nusamanga_mode', mode);
    navigate(mode === 'manga' ? '/manga' : '/anime');
  };

  return (
    <div className="welcome-container">
      {/* Animated background */}
      <div className="welcome-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="welcome-content">
        {/* Header */}
        <div className="welcome-header">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Platform Hiburan #1 Indonesia</span>
          </div>
          <h1 className="welcome-title">
            Nusa<span className="text-gradient">Media</span>
          </h1>
          <p className="welcome-subtitle">
            Satu tempat untuk semua hiburan anime &amp; manga favoritmu
          </p>
        </div>

        {/* Mode Cards */}
        <div className="mode-cards">
          {/* Manga Card */}
          <div
            className={`mode-card manga-card-welcome ${hoveredCard === 'manga' ? 'hovered' : ''}`}
            onClick={() => handleSelectMode('manga')}
            onMouseEnter={() => setHoveredCard('manga')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-glow manga-glow" />
            <div className="card-inner">
              <div className="mode-icon-ring manga-ring">
                <BookOpen size={40} />
              </div>
              <div className="card-text">
                <h2>Manga Mode</h2>
                <p>Baca ribuan manga Sub Indo</p>
                <div className="ticker-wrapper">
                  <span className="ticker-label">Trending: </span>
                  <span className="ticker-value">{MANGA_TITLES[mangaIdx]}</span>
                </div>
              </div>
              <div className="card-features">
                <span className="feature-chip">📚 Sub Indo</span>
                <span className="feature-chip">⚡ Tanpa Blokir</span>
              </div>
              <button className="mode-btn manga-btn">
                <span>Mulai Membaca</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mode-divider">
            <span>ATAU</span>
          </div>

          {/* Anime Card */}
          <div
            className={`mode-card anime-card-welcome ${hoveredCard === 'anime' ? 'hovered' : ''}`}
            onClick={() => handleSelectMode('anime')}
            onMouseEnter={() => setHoveredCard('anime')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="card-glow anime-glow" />
            <div className="card-inner">
              <div className="mode-icon-ring anime-ring">
                <Tv size={40} />
              </div>
              <div className="card-text">
                <h2>Anime Mode</h2>
                <p>Tonton streaming anime favorit</p>
                <div className="ticker-wrapper">
                  <span className="ticker-label">Populer: </span>
                  <span className="ticker-value">{ANIME_TITLES[animeIdx]}</span>
                </div>
              </div>
              <div className="card-features">
                <span className="feature-chip">🎌 Sub Indo</span>
                <span className="feature-chip">📺 HD Stream</span>
                <span className="feature-chip">🔄 Update Harian</span>
              </div>
              <button className="mode-btn anime-btn">
                <span>Mulai Menonton</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <p className="welcome-footer">
          🚀 Ditenagai oleh scraper lokal — bebas dari blokir ISP
        </p>
      </div>
    </div>
  );
};

export default Welcome;
