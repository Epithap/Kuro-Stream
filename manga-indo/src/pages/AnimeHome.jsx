import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { Play, Tv } from 'lucide-react';
import './AnimeHome.css';
import TrendingCarousel from '../components/TrendingCarousel';

const AnimeHome = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [animes, setAnimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');

  useEffect(() => {
    const fetchAnime = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let result;
        if (searchQuery) {
          result = await animeSourceManager.searchAnime(searchQuery);
        } else {
          result = await animeSourceManager.getLatestAnime();
        }
        setAnimes(result.data);
        setSource(result.source);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnime();
  }, [searchQuery]);

  return (
    <div className="anime-home">
      {/* Top Trending Carousel */}
      <TrendingCarousel />
      {/* Main Content */}
      <section className="anime-section">
        <div className="section-header">
          <div className="section-title-group">
            <Tv size={24} className="section-icon" />
            <h2 className="section-title">
              {searchQuery ? `Hasil: "${searchQuery}"` : 'Anime Sedang Tayang'}
            </h2>
          </div>
          {source && (
            <span className={`source-badge ${source === 'otakudesu' ? 'badge-indo' : 'badge-global'}`}>
              {source === 'otakudesu' ? '🇮🇩 Otakudesu' : '🌏 MyAnimeList'}
            </span>
          )}
        </div>
        {error && (
          <div className="error-message glass-panel">
            <p>❌ {error}</p>
          </div>
        )}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner" />
            <p>Memuat data anime...</p>
          </div>
        ) : (
          <div className="anime-grid">
            {animes.length > 0 ? (
              animes.map((anime) => (
                <Link to={`/anime/${anime.id}`} key={anime.id} className="anime-card">
                  <div className="anime-cover-wrapper">
                    <img src={anime.coverUrl} alt={anime.title} className="anime-cover" loading="lazy" />
                    <div className="anime-overlay">
                      <div className="play-icon-wrapper">
                        <Play fill="white" size={24} />
                      </div>
                    </div>
                    {anime.score && <div className="anime-score">★ {anime.score}</div>}
                    {anime.episodes && (
                      <div className="anime-episodes">
                        {typeof anime.episodes === 'number' ? `${anime.episodes} Ep` : anime.episodes}
                      </div>
                    )}
                  </div>
                  <div className="anime-info">
                    <h3 className="anime-title">{anime.title}</h3>
                    <div className="anime-tags">
                      {anime.tags && anime.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="anime-tag">{tag}</span>
                      ))}
                      {anime.status && <span className="anime-tag anime-status">{anime.status}</span>}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="empty-state glass-panel">
                <p>Tidak ada anime yang ditemukan.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AnimeHome;
