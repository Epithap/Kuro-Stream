import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import MangaCard from '../components/MangaCard';
import { TrendingUp, Search as SearchIcon } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMangas = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (searchQuery) {
          data = await sourceManager.searchManga(searchQuery);
        } else {
          data = await sourceManager.getTrendingManga();
        }
        setMangas(data.data);
      } catch (err) {
        setError('Gagal memuat data manga. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
  }, [searchQuery]);

  return (
    <div className="home-container animate-fade-in">
      {/* Hero Banner */}
      {!searchQuery && (
        <section className="hero-banner">
          <div className="hero-content">
            <h1 className="hero-title">
              Baca Manga <span className="text-gradient">Terpopuler</span> dengan Subtitle Indonesia
            </h1>
            <p className="hero-subtitle">
              Koleksi ribuan manga dari berbagai genre, diperbarui setiap hari.
            </p>
          </div>
          <div className="hero-bg-glow"></div>
        </section>
      )}

      {/* Main Content */}
      <section className="manga-section">
        <div className="section-header">
          {searchQuery ? (
            <h2 className="section-title">
              <SearchIcon className="text-gradient" />
              Hasil pencarian untuk "{searchQuery}"
            </h2>
          ) : (
            <h2 className="section-title">
              <TrendingUp className="text-gradient" />
              Manga Trending (Sub Indo)
            </h2>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="manga-grid">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton" style={{ aspectRatio: '2/3', borderRadius: '8px' }}></div>
            ))}
          </div>
        ) : mangas.length > 0 ? (
          <div className="manga-grid">
            {mangas.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Tidak ada manga ditemukan.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
