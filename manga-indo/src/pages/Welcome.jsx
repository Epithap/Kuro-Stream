import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Tv, Sparkles, ChevronRight, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Welcome.css';

const MANGA_TITLES = ['Solo Leveling', 'Jujutsu Kaisen', 'One Piece', 'Berserk', 'Vinland Saga', 'Chainsaw Man'];
const ANIME_TITLES = ['Demon Slayer', 'Attack on Titan', 'Naruto', 'Bleach', 'One Punch Man', 'Re:Zero'];

const Welcome = () => {
  const navigate = useNavigate();
  const { user, userProfile, login, register, authError, loading } = useAuth();
  const [mangaIdx, setMangaIdx] = useState(0);
  const [animeIdx, setAnimeIdx] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [particles, setParticles] = useState([]);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const mangaTimer = setInterval(() => setMangaIdx((i) => (i + 1) % MANGA_TITLES.length), 2000);
    const animeTimer = setInterval(() => setAnimeIdx((i) => (i + 1) % ANIME_TITLES.length), 2300);
    return () => {
      clearInterval(mangaTimer);
      clearInterval(animeTimer);
    };
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      setEmail('');
      setPassword('');
      setDisplayName('');
    } catch (error) {
      console.error(error);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        {particles.map((p) => (
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
        <div className="welcome-header">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Platform Hiburan #1 Indonesia</span>
          </div>
          <h1 className="welcome-title">
            Kuro<span className="text-gradient">Stream</span>
          </h1>
          <p className="welcome-subtitle">
            Satu tempat untuk semua hiburan anime &amp; manga favoritmu
          </p>
        </div>

        {!user ? (
          <div className="auth-panel glass-panel">
            <div className="auth-header">
              <h2>{authMode === 'login' ? 'Masuk ke Akunmu' : 'Daftar Akun Baru'}</h2>
              <p>{authMode === 'login' ? 'Gunakan email dan password untuk mulai.' : 'Buat akun dan dapatkan kode unik pengguna.'}</p>
            </div>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              <label>
                Email
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </label>
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </label>
              {authMode === 'register' && (
                <label>
                  Nama Tampilan
                  <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                </label>
              )}
              {authError && <p className="auth-error">{authError}</p>}
              <button type="submit" className="primary-button" disabled={authLoading}>
                {authMode === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            </form>
            <button className="secondary-button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
              {authMode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </button>
          </div>
        ) : (
          <div className="profile-summary glass-panel">
            <div className="profile-intro">
              <div className="profile-avatar">
                <User size={40} />
              </div>
              <div>
                <h2>Selamat datang, {userProfile?.displayName || 'Pengguna'}</h2>
                <p>Kode akun: <strong>{userProfile?.userCode || '00000'}</strong></p>
                <p>Tier: {userProfile?.tier || 'karbit'} | Level: {userProfile?.level || 1}</p>
              </div>
            </div>
            <div className="profile-actions">
              <button className="primary-button" onClick={() => navigate('/profile')}>
                Buka Profil
              </button>
              {userProfile?.role === 'admin' && (
                <button className="secondary-button" onClick={() => navigate('/admin')}>
                  Panel Admin
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mode-cards">
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

          <div className="mode-divider">
            <span>ATAU</span>
          </div>

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
