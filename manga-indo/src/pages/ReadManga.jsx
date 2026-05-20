import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import { historyManager } from '../utils/historyManager';
import { ChevronLeft, RefreshCw, Settings, Info } from 'lucide-react';
import './ReadManga.css';

const ReadManga = () => {
  const { id } = useParams(); // id is chapterId
  const navigate = useNavigate();
  const location = useLocation();
  const { mangaId, mangaTitle, chapters, chapterNum } = location.state || {};
  
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [failedImages, setFailedImages] = useState(new Set());
  
  // Mihon-like features
  const [showMenu, setShowMenu] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextChapter, setNextChapter] = useState(null);
  const observerRef = useRef(null);

  // Hide menu after 2 seconds initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMenu(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    // Determine next chapter if we have chapters data
    if (chapters && chapters.length > 0) {
      // Sort chapters ascending by chapter number just to be safe
      const sortedChapters = [...chapters].sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter));
      const currentIndex = sortedChapters.findIndex(ch => ch.id === id);
      if (currentIndex !== -1 && currentIndex < sortedChapters.length - 1) {
        setNextChapter(sortedChapters[currentIndex + 1]);
      } else {
        setNextChapter(null);
      }
    }
  }, [id, chapters]);

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      setError(null);
      setPages([]);
      setCurrentPage(1);
      window.scrollTo(0, 0); // Scroll to top on new chapter
      try {
        const pageUrls = await sourceManager.getChapterPages(id);
        setPages(pageUrls);
      } catch (err) {
        setError(err.message || 'Gagal memuat halaman manga.');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [id]);

  // Setup IntersectionObserver to track current page
  useEffect(() => {
    if (loading || pages.length === 0) return;

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Trigger when 50% of the image is visible
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const pageIndex = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(pageIndex)) {
            setCurrentPage(pageIndex + 1);
            
            // Save reading history
            if (mangaId) {
              historyManager.saveHistory(mangaId, {
                chapterId: id,
                chapterNum: chapterNum || '?',
                page: pageIndex + 1,
                totalPages: pages.length
              });
            }
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    const elements = document.querySelectorAll('.manga-page-img');
    elements.forEach(el => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pages, loading, id, mangaId, chapterNum]);

  const handleImageError = (index) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  const handleRetryImage = (index) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    const url = new URL(pages[index]);
    url.searchParams.set('retry', Date.now());
    
    setPages(prev => {
      const newPages = [...prev];
      newPages[index] = url.toString();
      return newPages;
    });
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  const goToNextChapter = () => {
    if (nextChapter) {
      navigate(`/chapter/${nextChapter.id}`, {
        state: { mangaId, mangaTitle, chapters, chapterNum: nextChapter.chapter },
        replace: true // Use replace so back button goes to Manga Detail
      });
    }
  };

  return (
    <div className="reader-container">
      {/* Top Toolbar (Sticky, Toggleable) */}
      <div className={`reader-toolbar glass-panel ${showMenu ? 'visible' : 'hidden'}`}>
        <button onClick={() => navigate(-1)} className="btn-icon">
          <ChevronLeft size={24} />
        </button>
        <div className="reader-info">
          <div className="reader-title">{mangaTitle || 'Mode Membaca'}</div>
          <div className="reader-subtitle">Chapter {chapterNum || '?'}</div>
        </div>
        <button className="btn-icon">
          <Settings size={20} />
        </button>
      </div>

      {loading && (
        <div className="reader-loading">
          <div className="skeleton" style={{ width: '100%', height: '80vh', borderRadius: '8px' }}></div>
        </div>
      )}

      {error && (
        <div className="error-container glass-panel">
          <h3>Oops!</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ marginTop: '16px' }}>
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      )}

      {!loading && !error && pages.length > 0 && (
        <div className="manga-pages" onClick={toggleMenu}>
          {pages.map((url, index) => (
            <div key={index} className="page-wrapper">
              {failedImages.has(index) ? (
                <div className="image-error-fallback">
                  <p>Gagal memuat gambar {index + 1}</p>
                  <button onClick={(e) => { e.stopPropagation(); handleRetryImage(index); }} className="btn-retry">
                    <RefreshCw size={16} /> Muat Ulang
                  </button>
                </div>
              ) : (
                <img 
                  src={url} 
                  alt={`Page ${index + 1}`} 
                  className="manga-page manga-page-img"
                  data-index={index}
                  loading="lazy"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}
          
          {/* End of chapter indicator / Next Chapter trigger */}
          <div className="end-of-chapter">
            <div className="eoc-content">
              <h3>Selesai Membaca Chapter {chapterNum || '?'}</h3>
              {nextChapter ? (
                <button 
                  onClick={(e) => { e.stopPropagation(); goToNextChapter(); }} 
                  className="btn-next-chapter"
                >
                  Lanjut ke Chapter {nextChapter.chapter || '?'}
                </button>
              ) : (
                <p className="no-more">Tidak ada chapter selanjutnya.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Info Bar (Toggleable) */}
      {!loading && !error && pages.length > 0 && (
        <div className={`reader-bottom-bar glass-panel ${showMenu ? 'visible' : 'hidden'}`}>
          <div className="page-indicator">
            {currentPage} / {pages.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadManga;
