import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { ArrowLeft, Play, Star, ChevronDown } from 'lucide-react';
import './AnimeDetail.css';

const AnimeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllEp, setShowAllEp] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);
      setTrailerUrl('');
      try {
        const detailData = await animeSourceManager.getAnimeDetail(id);
        setAnime(detailData);
        
        // Fetch trailer URL
        if (detailData.trailerUrl) {
          // Convert YouTube standard URL to embed URL if needed
          let embed = detailData.trailerUrl;
          if (embed.includes('youtube.com/watch?v=')) {
            const vId = embed.split('v=')[1]?.split('&')[0];
            embed = `https://www.youtube.com/embed/${vId}`;
          }
          setTrailerUrl(embed);
        } else {
          // Fallback YT Search
          const searchRes = await animeSourceManager.searchYoutubeVideo(`${detailData.title} Official Anime Trailer`);
          if (searchRes?.embedUrl) {
            setTrailerUrl(searchRes.embedUrl);
          }
        }

        if (Array.isArray(detailData.episodes)) {
          setEpisodes(detailData.episodes);
        } else {
          const epsData = await animeSourceManager.getAnimeEpisodes(id);
          setEpisodes(epsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="ad-loading">
        <div className="ad-skeleton-hero">
          <div className="skeleton ad-sk-poster" />
          <div className="ad-sk-info">
            <div className="skeleton ad-sk-title" />
            <div className="skeleton ad-sk-meta" />
            <div className="skeleton ad-sk-synopsis" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="ad-error">
        <div className="ad-error-icon">⚠️</div>
        <h2>Anime tidak ditemukan</h2>
        <p>{error || 'Coba cari judul lain'}</p>
        <button onClick={() => navigate('/anime')} className="ad-back-cta">
          ← Kembali ke Anime
        </button>
      </div>
    );
  }

  const sortedEpisodes = [...episodes].reverse();
  const displayedEpisodes = showAllEp ? sortedEpisodes : sortedEpisodes.slice(0, 24);
  const latestEp = sortedEpisodes[0];
  const firstEp = episodes[0];

  const statusColor = {
    'Currently Airing': '#10b981',
    'Ongoing': '#10b981',
    'Finished Airing': '#6366f1',
    'Completed': '#6366f1',
    'Not yet aired': '#f59e0b',
  }[anime.status] || '#6366f1';

  return (
    <div className="ad-page">

      {/* Hero Banner */}
      <div className="ad-hero">
        {anime.coverUrl && (
          <div className="ad-hero-bg">
            <img src={anime.coverUrl} alt="" />
            <div className="ad-hero-overlay" />
          </div>
        )}

        <div className="ad-hero-content">
          <button onClick={() => navigate(-1)} className="ad-back-btn">
            <ArrowLeft size={18} />
            Kembali
          </button>

          <div className="ad-hero-main">
            <div className="ad-poster-wrap">
              <img src={anime.coverUrl} alt={anime.title} className="ad-poster" />
              {episodes.length > 0 && (
                <Link
                  to={`/watch/${latestEp?.id}?anime=${id}&ep=${latestEp?.episode || episodes.length}&title=${encodeURIComponent(anime.title || '')}`}
                  className="ad-poster-play"
                >
                  <Play size={28} fill="white" />
                </Link>
              )}
            </div>

            <div className="ad-hero-info">
              {anime.titleJP && anime.titleJP !== anime.title && (
                <p className="ad-title-jp">{anime.titleJP}</p>
              )}
              <h1 className="ad-title">{anime.title}</h1>

              <div className="ad-badges">
                <span className="ad-status" style={{ '--sc': statusColor }}>
                  {anime.status || 'Unknown'}
                </span>
                {anime.score && (
                  <span className="ad-score">
                    <Star size={13} fill="#fbbf24" color="#fbbf24" />
                    {anime.score}
                  </span>
                )}
                {anime.year && <span className="ad-badge">{anime.year}</span>}
                {episodes.length > 0 && (
                  <span className="ad-badge">{episodes.length} Ep</span>
                )}
              </div>

              {anime.tags?.length > 0 && (
                <div className="ad-genres">
                  {anime.tags.slice(0, 6).map((tag, i) => (
                    <span key={i} className="ad-genre">{tag}</span>
                  ))}
                </div>
              )}

              {anime.synopsis && (
                <div className="ad-synopsis">
                  <p className={synopsisExpanded ? 'expanded' : ''}>
                    {anime.synopsis}
                  </p>
                  {anime.synopsis.length > 200 && (
                    <button
                      className="ad-synopsis-toggle"
                      onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                    >
                      {synopsisExpanded ? 'Lebih sedikit ↑' : 'Selengkapnya ↓'}
                    </button>
                  )}
                </div>
              )}

              <div className="ad-cta-row">
                {firstEp && (
                  <Link
                    to={`/watch/${firstEp.id}?anime=${id}&ep=${firstEp.episode || 1}&title=${encodeURIComponent(anime.title || '')}`}
                    className="ad-watch-btn"
                  >
                    <Play size={18} fill="white" />
                    Tonton Ep 1
                  </Link>
                )}
                {latestEp && episodes.length > 1 && (
                  <Link
                    to={`/watch/${latestEp.id}?anime=${id}&ep=${latestEp.episode || episodes.length}&title=${encodeURIComponent(anime.title || '')}`}
                    className="ad-watch-btn ad-watch-btn-ghost"
                  >
                    <Play size={16} />
                    Ep Terbaru ({latestEp.episode || episodes.length})
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Trailer Section */}
      {trailerUrl && (
        <div className="ad-trailer-section">
          <div className="ad-section-header">
            <h2>Official Trailer</h2>
            <span className="ad-trailer-badge">🔴 Trailer</span>
          </div>
          <div className="ad-trailer-player-wrapper">
            <iframe
              src={trailerUrl}
              title={`${anime.title} Official Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="ad-trailer-iframe"
            />
          </div>
        </div>
      )}

      {/* Episode List */}
      {episodes.length > 0 && (
        <div className="ad-episodes">
          <div className="ad-ep-header">
            <h2>Daftar Episode</h2>
            <span className="ad-ep-badge">{episodes.length} Episode</span>
          </div>

          <div className="ad-ep-grid">
            {displayedEpisodes.map((ep, index) => {
              const epNum = ep.episode || (sortedEpisodes.length - index);
              return (
                <Link
                  key={ep.id || index}
                  to={`/watch/${ep.id}?anime=${id}&ep=${epNum}&title=${encodeURIComponent(anime.title || '')}`}
                  className="ad-ep-card"
                >
                  <div className="ad-ep-num">{epNum}</div>
                  <div className="ad-ep-info">
                    <span className="ad-ep-name">Episode {epNum}</span>
                    {ep.date && <span className="ad-ep-date">{ep.date}</span>}
                  </div>
                  <Play size={14} className="ad-ep-play" />
                </Link>
              );
            })}
          </div>

          {episodes.length > 24 && (
            <button className="ad-show-more" onClick={() => setShowAllEp(!showAllEp)}>
              <ChevronDown
                size={18}
                style={{ transform: showAllEp ? 'rotate(180deg)' : 'none', transition: '0.3s' }}
              />
              {showAllEp ? 'Tampilkan Lebih Sedikit' : `Tampilkan Semua ${episodes.length} Episode`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
