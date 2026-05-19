import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import MangaCard from '../components/MangaCard';
import { TrendingUp, Search as SearchIcon, BookOpen, Info } from 'lucide-react';
import PopularBanner from '../components/PopularBanner';
import './Home.css';

const BILLBOARD_SLIDES = [
  {
    id: 'solo-leveling',
    title: 'SOLO LEVELING',
    badge: '👑 MANGA TERPOPULER',
    status: 'TAMAT',
    info: '200+ Chapter • Action, Fantasy, System • Chugong',
    synopsis: 'Di dunia di mana monster keluar dari \'Gate\' untuk menyerang manusia, Sung Jin-Woo adalah Hunter terlemah di dunia. Namun, setelah bertahan hidup di Double Dungeon yang mematikan, dia mendapatkan kekuatan misterius: sistem leveling yang memungkinkannya tumbuh tanpa batas!',
    image: 'https://images.alphacoders.com/134/1344445.png',
    link: '/manga/solo-leveling'
  },
  {
    id: 'one-piece-komik',
    title: 'ONE PIECE',
    badge: '🔥 TERPOPULER MINGGU INI',
    status: 'ONGOING',
    info: '1100+ Chapter • Action, Adventure, Fantasy • Eiichiro Oda',
    synopsis: 'Gol D. Roger dikenal sebagai "Raja Bajak Laut," pria terkuat yang berlayar di Grand Line. Penangkapan dan eksekusi Roger oleh Pemerintah Dunia membawa perubahan di dunia. Sebelum kematiannya, kata-kata terakhir Roger mengungkap keberadaan One Piece, harta karun terbesar di dunia!',
    image: 'https://images.alphacoders.com/132/1329241.png',
    link: '/manga/one-piece-komik'
  },
  {
    id: 'jujutsu-kaisen',
    title: 'JUJUTSU KAISEN',
    badge: '⚡ REKOMENDASI HARI INI',
    status: 'TAMAT',
    info: '270+ Chapter • Action, Supernatural, School • Gege Akutami',
    synopsis: 'Yuji Itadori adalah siswa SMA biasa dengan kekuatan fisik luar biasa. Demi menyelamatkan teman-temannya dari serangan kutukan, Yuji memakan jari milik Ryomen Sukuna, kutukan legendaris terkuat, dan menjadi wadah bagi kutukan jahat tersebut!',
    image: 'https://images2.alphacoders.com/132/1328905.jpeg',
    link: '/manga/jujutsu-kaisen'
  }
];

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset list and pagination when search query changes
  useEffect(() => {
    setMangas([]);
    setOffset(0);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMangas = async () => {
      if (offset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        let data;
        if (searchQuery) {
          data = await sourceManager.searchManga(searchQuery, 20, offset);
        } else {
          data = await sourceManager.getTrendingManga(20, offset);
        }
        
        const newMangas = data.data || [];
        if (newMangas.length < 20) {
          setHasMore(false);
        }
        
        if (offset === 0) {
          setMangas(newMangas);
        } else {
          setMangas(prev => {
            // Filter out duplicates just in case
            const existingIds = new Set(prev.map(m => m.id));
            const filtered = newMangas.filter(m => !existingIds.has(m.id));
            return [...prev, ...filtered];
          });
        }
      } catch (err) {
        setError('Gagal memuat data manga. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMangas();
  }, [searchQuery, offset]);

  // Rotating slide interval every 5 seconds
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BILLBOARD_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const slide = BILLBOARD_SLIDES[currentSlide];

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setOffset(prev => prev + 20);
    }
  };

  return (
    <div className="home-container animate-fade-in">
      {/* Dynamic Manga Billboard */}
      {!searchQuery && (
        <PopularBanner type="manga" />
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
          <>
            <div className="manga-grid">
              {mangas.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>

            {/* Premium Load More Controls */}
            {hasMore && (
              <div className="load-more-container" style={{ display: 'flex', justifyContent: 'center', margin: '40px 0 20px' }}>
                <button 
                  className="load-more-btn"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
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
                  {loadingMore ? 'Memuat...' : 'Muat Lebih Banyak Manga'}
                </button>
              </div>
            )}
          </>
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
