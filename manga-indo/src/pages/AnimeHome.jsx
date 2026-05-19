import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { Play, Tv, Info } from 'lucide-react';
import './AnimeHome.css';
import TrendingCarousel from '../components/TrendingCarousel';

const ANIME_BILLBOARD_SLIDES = [
  {
    id: 'solo-leveling',
    title: 'SOLO LEVELING',
    badge: '🔥 #1 POPULER SEASONS',
    rating: '★ 8.7',
    info: '12 Episode • Action, Fantasy • A-1 Pictures',
    synopsis: 'Di dunia di mana pemburu harus bertarung dengan monster mematikan untuk melindungi umat manusia, Sung Jin-woo, pemburu terlemah yang berjuang untuk bertahan hidup, menemukan program misterius yang memungkinkannya naik level tanpa batas.',
    image: 'https://images.alphacoders.com/134/1344445.png',
    link: '/anime/52299'
  },
  {
    id: 'one-piece',
    title: 'ONE PIECE',
    badge: '⚡ TERPOPULER HARI INI',
    rating: '★ 8.9',
    info: '1100+ Episode • Action, Adventure, Fantasy • Toei Animation',
    synopsis: 'Luffy, seorang anak laki-laki yang bermimpi menjadi Raja Bajak Laut, berlayar melintasi samudera luas mengumpulkan kru legendarisnya, mencari One Piece, harta karun misterius yang ditinggalkan oleh mantan Raja Bajak Laut Gol D. Roger!',
    image: 'https://images.alphacoders.com/132/1329241.png',
    link: '/anime/37403'
  },
  {
    id: 'demon-slayer',
    title: 'DEMON SLAYER',
    badge: '👑 REKOMENDASI UTAMA',
    rating: '★ 8.8',
    info: '26+ Episode • Action, Fantasy, Historical • Ufotable',
    synopsis: 'Tanjirou Kamado memulai perjalanannya sebagai Pembasmi Iblis demi menyembuhkan adik perempuannya, Nezuko, yang telah berubah menjadi iblis, serta membalaskan dendam keluarganya yang dibantai oleh raja iblis Muzan Kibutsuji!',
    image: 'https://images3.alphacoders.com/131/1314643.jpeg',
    link: '/anime/38000'
  }
];

const AnimeHome = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [animes, setAnimes] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  // Rotating slide interval every 5 seconds
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ANIME_BILLBOARD_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const slide = ANIME_BILLBOARD_SLIDES[currentSlide];

  return (
    <div className="anime-home animate-fade-in">
      {/* Dynamic Widescreen Billboard */}
      {!searchQuery && (
        <div className="anime-billboard">
          <div 
            className="anime-billboard-bg" 
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          <div className="billboard-overlay-gradient" />
          <div className="billboard-content">
            <span className="billboard-badge">{slide.badge}</span>
            <h1 className="billboard-title">{slide.title}</h1>
            <div className="billboard-meta">
              <span className="billboard-rating">{slide.rating}</span>
              <span className="billboard-divider">•</span>
              <span>{slide.info}</span>
            </div>
            <p className="billboard-synopsis">{slide.synopsis}</p>
            <div className="billboard-controls">
              <Link to={slide.link} className="billboard-btn btn-play">
                <Play fill="currentColor" size={18} />
                <span>Tonton Sekarang</span>
              </Link>
              <Link to={slide.link} className="billboard-btn btn-info">
                <Info size={18} />
                <span>Info Detail</span>
              </Link>
            </div>
          </div>

          {/* Slide dots indicators */}
          <div className="anime-billboard-dots">
            {ANIME_BILLBOARD_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`billboard-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

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
