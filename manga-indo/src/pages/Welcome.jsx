import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
          <div className="action-buttons">
            <button className="primary-button auth-btn" onClick={() => navigate('/login?mode=login')}>
              <span>Masuk ke Akun</span>
              <ChevronRight size={18} />
            </button>
            <button className="secondary-button auth-btn" onClick={() => navigate('/login?mode=register')}>
              <span>Buat Akun Baru</span>
              <ChevronRight size={18} />
            </button>
          </div>
        ) : null}

        <p className="welcome-note">
          Masuk atau daftar sekarang untuk menggunakan semua fitur KuroStream. Halaman utama ini hanya menampilkan panel login untuk pengalaman yang lebih bersih.
        </p>

        <p className="welcome-footer">
          🚀 Ditenagai oleh scraper lokal — bebas dari blokir ISP
        </p>
      </div>
    </div>
  );
};

export default Welcome;
