import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import MangaCard from '../components/MangaCard';
import { TrendingUp, Search as SearchIcon, BookOpen, Info } from 'lucide-react';
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
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Rotating slide interval every 5 seconds
  useEffect(() => {
    if (searchQuery) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BILLBOARD_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [searchQuery]);

  const slide = BILLBOARD_SLIDES[currentSlide];

  return (
    <div className="home-container animate-fade-in">
      {/* Dynamic Manga Billboard */}
      {!searchQuery && (
        <section className="manga-billboard">
          <div 
            className="manga-billboard-bg" 
            style={{ backgroundImage: `url('${slide.image}')` }}
          />
          <div className="manga-billboard-overlay" />
          <div className="manga-billboard-content">
            <span className="manga-billboard-badge">{slide.badge}</span>
            <h1 className="manga-billboard-title">{slide.title}</h1>
            <div className="manga-billboard-meta">
              <span className="manga-billboard-status">{slide.status}</span>
              <span className="manga-billboard-divider">•</span>
              <span>{slide.info}</span>
            </div>
            <p className="manga-billboard-synopsis">{slide.synopsis}</p>
            <div className="manga-billboard-controls">
              <Link to={slide.link} className="manga-billboard-btn btn-read">
                <BookOpen size={18} fill="currentColor" />
                <span>Baca Sekarang</span>
              </Link>
              <Link to={slide.link} className="manga-billboard-btn btn-details">
                <Info size={18} />
                <span>Detail Manga</span>
              </Link>
            </div>
          </div>

          {/* Slide dots indicators */}
          <div className="manga-billboard-dots">
            {BILLBOARD_SLIDES.map((_, index) => (
              <button
                key={index}
                className={`billboard-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
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
