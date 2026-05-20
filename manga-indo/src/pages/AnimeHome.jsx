import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { Play, Tv, Info } from 'lucide-react';
import './AnimeHome.css';
import TrendingCarousel from '../components/TrendingCarousel';
import PopularBanner from '../components/PopularBanner';

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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [filterMode, setFilterMode] = useState('latest'); // 'latest', 'popular', 'weekly', 'movie'

  // Reset list and pagination when search query or filter changes
  useEffect(() => {
    setAnimes([]);
    setOffset(0);
    setHasMore(true);
  }, [searchQuery, filterMode]);

  useEffect(() => {
    const fetchAnime = async () => {
      if (offset === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      try {
        let result;
        if (searchQuery) {
          result = await animeSourceManager.searchAnime(searchQuery, offset);
        } else {
          if (filterMode === 'popular') {
            result = await animeSourceManager.getPopularAnime(offset);
          } else if (filterMode === 'weekly') {
            result = await animeSourceManager.getWeeklyAnime(offset);
          } else if (filterMode === 'movie') {
            result = await animeSourceManager.getMovieAnime(offset);
          } else {
            result = await animeSourceManager.getLatestAnime(offset);
          }
        }
        
        const newAnimes = result.data || [];
        if (newAnimes.length < 24) {
          setHasMore(false);
        }

        if (offset === 0) {
          setAnimes(newAnimes);
        } else {
          setAnimes(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const filtered = newAnimes.filter(a => !existingIds.has(a.id));
            return [...prev, ...filtered];
          });
        }
        setSource(result.source);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };
    fetchAnime();
  }, [searchQuery, offset]);

  // Rotating slide interval every 5 seconds
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ANIME_BILLBOARD_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchQuery, filterMode]);

  const slide = ANIME_BILLBOARD_SLIDES[currentSlide];

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setOffset(prev => prev + 24);
    }
  };

  return (
    <div className="anime-home animate-fade-in">
      {/* Dynamic Widescreen Billboard */}
      {!searchQuery && (
        <PopularBanner type="anime" bannerCategory={filterMode} />
      )}

      {/* Top Trending Carousel */}
      <TrendingCarousel />

      {/* Main Content */}
      <section className="anime-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div className="section-title-group">
            <Tv size={24} className="section-icon text-gradient" />
            <h2 className="section-title">
              {searchQuery ? `Hasil: "${searchQuery}"` : 
               filterMode === 'popular' ? 'Anime Populer' : 
               filterMode === 'weekly' ? 'Jadwal Mingguan' : 
               filterMode === 'movie' ? 'Daftar Movie' : 'Update Terbaru'}
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            {!searchQuery && (
              <div className="filter-tabs" style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', overflowX: 'auto' }}>
                {[
                  { id: 'latest', label: 'Update Terbaru' },
                  { id: 'popular', label: 'Populer' },
                  { id: 'weekly', label: 'Mingguan' },
                  { id: 'movie', label: 'Movie' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setFilterMode(tab.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: filterMode === tab.id ? 'var(--accent-primary, #6366f1)' : 'transparent',
                      color: filterMode === tab.id ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: filterMode === tab.id ? '600' : '400',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            
            {source && (
              <span className={`source-badge ${source === 'otakudesu' ? 'badge-indo' : 'badge-global'}`}>
                {source === 'otakudesu' ? '🇮🇩 Otakudesu' : source === 'anilist' ? '🌏 AniList' : '🌏 MyAnimeList'}
              </span>
            )}
          </div>
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
          <>
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

            {/* Premium Load More Controls */}
            {hasMore && animes.length > 0 && (
              <div className="load-more-container" style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 20px' }}>
                <button 
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '12px 35px',
                    borderRadius: '50px',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                >
                  {isLoadingMore ? 'Memuat...' : 'Muat Lebih Banyak Anime'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default AnimeHome;
