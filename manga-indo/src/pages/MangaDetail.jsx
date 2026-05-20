import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import { BookOpen, List, Globe2, ArrowUpDown, ExternalLink, ChevronDown, PlayCircle } from 'lucide-react';
import { myAnimeList } from '../api/myAnimeList';
import RatingStars from '../components/RatingStars';
import { historyManager } from '../utils/historyManager';
import './MangaDetail.css';

const MangaDetail = () => {
  const { id } = useParams();
  const [manga, setManga] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [totalChapters, setTotalChapters] = useState(0);
  const [offset, setOffset] = useState(0);
  const LIMIT = 100;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (terbaru) atau 'asc' (lama)
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [readingHistory, setReadingHistory] = useState(null);

  useEffect(() => {
    // Check reading history
    const history = historyManager.getMangaHistory(id);
    if (history) {
      setReadingHistory(history);
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const mangaData = await sourceManager.getMangaDetail(id);
        const chapterData = await sourceManager.getMangaChapters(id, sortOrder, LIMIT, 0);
        
        // Fetch MyAnimeList rating dynamically
        try {
          const malResults = await myAnimeList.searchManga(mangaData.title);
          if (malResults && malResults.length > 0) {
            mangaData.rating = malResults[0].rating;
          }
        } catch (e) {
          console.warn('Failed to fetch MyAnimeList rating for manga', e);
        }

        setManga(mangaData);
        setChapters(chapterData.data);
        setTotalChapters(chapterData.total);
        setOffset(0);
      } catch (err) {
        setError('Gagal memuat detail manga.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSortChange = async () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setLoadingChapters(true);
    setOffset(0); // Reset offset on sort
    try {
      const chapterData = await sourceManager.getMangaChapters(id, newOrder, LIMIT, 0);
      setChapters(chapterData.data);
      setTotalChapters(chapterData.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingChapters(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    const newOffset = offset + LIMIT;
    setLoadingMore(true);
    try {
      const chapterData = await sourceManager.getMangaChapters(id, sortOrder, LIMIT, newOffset);
      setChapters(prev => [...prev, ...chapterData.data]);
      setOffset(newOffset);
    } catch (err) {
      console.error('Gagal meload chapter tambahan', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-container animate-fade-in">
        <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
      </div>
    );
  }

  if (error || !manga) {
    return <div className="error-message">{error || 'Manga tidak ditemukan.'}</div>;
  }

  const activeSourceId = sourceManager.getActiveSourceId();
  const langLabel = activeSourceId === 'mangadex_en' ? 'EN' : 'Sub Indo';

  return (
    <div className="detail-container animate-fade-in">
      <div className="detail-header glass-panel">
        <div className="detail-cover-wrapper">
          <img src={manga.highResCoverUrl} alt={manga.title} className="detail-cover" />
        </div>
        <div className="detail-info">
          <h1 className="detail-title">{manga.title}</h1>
          <div className="detail-meta">
            <span className="status-badge">{manga.status}</span>
            <span className="language-badge"><Globe2 size={14} /> {langLabel}</span>
            {manga.rating && (
              <span className="rating-badge">
                <RatingStars rating={Number(manga.rating)} />
              </span>
            )}
          </div>
          
          <div className="detail-tags">
            {manga.tags.slice(0, 5).map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          <div className="detail-synopsis">
            <h3>Sinopsis</h3>
            <p>{manga.synopsis}</p>
          </div>
          
          {readingHistory && (
            <div className="continue-reading" style={{ marginTop: '20px' }}>
              <Link 
                to={`/chapter/${readingHistory.chapterId}`} 
                state={{ mangaId: id, mangaTitle: manga.title, chapters }}
                className="btn-primary" 
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}
              >
                <PlayCircle size={20} />
                Lanjutkan Membaca (Ch. {readingHistory.chapterNum})
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="chapters-section">
        <div className="section-header-flex">
          <h2 className="section-title">
            <List className="text-gradient" />
            Daftar Chapter <span className="chapter-count">({totalChapters})</span>
          </h2>
          <button className="btn-sort" onClick={handleSortChange} disabled={loadingChapters}>
            <ArrowUpDown size={16} />
            Urutkan: {sortOrder === 'desc' ? 'Terbaru (Atas)' : 'Terlama (Atas)'}
          </button>
        </div>
        
        {loadingChapters ? (
          <div className="chapters-list simple-list">
             <div className="skeleton" style={{ height: '40px', borderRadius: '8px' }}></div>
             <div className="skeleton" style={{ height: '40px', borderRadius: '8px' }}></div>
          </div>
        ) : chapters.length > 0 ? (
          <>
            <div className="chapters-list simple-list">
              {chapters.map((chapter) => {
                const isExternal = chapter.pages === 0 && chapter.externalUrl;
                const chapterText = `Chapter ${chapter.chapter || '?'}`;
                const titleText = chapter.title ? ` - ${chapter.title}` : '';
                
                if (isExternal) {
                  return (
                    <a key={chapter.id} href={chapter.externalUrl} target="_blank" rel="noopener noreferrer" className="chapter-item simple-item">
                      <div className="chapter-info-simple">
                        <span className="ch-num">{chapterText}</span>
                        <span className="ch-title">{titleText}</span>
                      </div>
                      <ExternalLink size={16} className="text-muted" />
                    </a>
                  );
                }

                return (
                  <Link 
                    key={chapter.id} 
                    to={`/chapter/${chapter.id}`} 
                    state={{ mangaId: id, mangaTitle: manga.title, chapters, chapterNum: chapter.chapter }}
                    className={`chapter-item simple-item ${readingHistory?.chapterId === chapter.id ? 'active-history' : ''}`}
                    style={readingHistory?.chapterId === chapter.id ? { borderLeft: '4px solid var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)' } : {}}
                  >
                    <div className="chapter-info-simple">
                      <span className="ch-num">{chapterText}</span>
                      <span className="ch-title">{titleText}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {chapters.length < totalChapters && (
              <div className="load-more-container">
                <button 
                  className="btn-load-more" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Memuat...' : (
                    <>
                      <ChevronDown size={18} /> Muat Lebih Banyak ({chapters.length} / {totalChapters})
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            Belum ada chapter untuk manga ini di sumber terpilih.
          </div>
        )}
      </div>
    </div>
  );
};

export default MangaDetail;
