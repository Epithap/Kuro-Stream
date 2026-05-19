import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import './ReadManga.css';

const ReadManga = () => {
  const { id } = useParams(); // id is chapterId
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track failed images to allow retrying
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      setError(null);
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
    // Force reload image by changing src slightly
    const url = new URL(pages[index]);
    url.searchParams.set('retry', Date.now());
    
    setPages(prev => {
      const newPages = [...prev];
      newPages[index] = url.toString();
      return newPages;
    });
  };

  return (
    <div className="reader-container">
      <div className="reader-toolbar glass-panel">
        <button onClick={() => navigate(-1)} className="btn-icon">
          <ChevronLeft size={24} />
        </button>
        <div className="reader-info">
          <span>Mode Membaca</span>
        </div>
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
        <div className="manga-pages">
          {pages.map((url, index) => (
            <div key={index} className="page-wrapper">
              {failedImages.has(index) ? (
                <div className="image-error-fallback">
                  <p>Gagal memuat gambar {index + 1}</p>
                  <button onClick={() => handleRetryImage(index)} className="btn-retry">
                    <RefreshCw size={16} /> Muat Ulang
                  </button>
                </div>
              ) : (
                <img 
                  src={url} 
                  alt={`Page ${index + 1}`} 
                  className="manga-page"
                  loading="lazy"
                  onError={() => handleImageError(index)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadManga;
