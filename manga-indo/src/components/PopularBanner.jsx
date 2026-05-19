// src/components/PopularBanner.jsx
import React, { useState, useEffect } from 'react';
import { myAnimeList } from '../api/myAnimeList';
import RatingStars from './RatingStars';
import './PopularBanner.css';
import { Play, Info, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AUTO_ROTATE_INTERVAL = 8000; // 8 seconds

const PopularBanner = ({ type }) => {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);
  const [trailerActive, setTrailerActive] = useState(false);

  // Fetch popular list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data =
          type === 'anime'
            ? await myAnimeList.getTrendingAnime(6)
            : await myAnimeList.getTrendingManga(6);
        setItems(data);
      } catch (e) {
        console.error('Failed to fetch popular', e);
      }
    };
    fetchData();
  }, [type]);

  // Handle slide transitions and auto trailer play
  useEffect(() => {
    if (type === 'anime' && items.length > 0) {
      const item = items[current];
      setTrailerActive(!!(item && item.trailerUrl));
    } else {
      setTrailerActive(false);
    }
  }, [type, items, current]);

  // Autoplay carousel — pause while trailer is playing
  useEffect(() => {
    if (items.length <= 1) return undefined;
    if (type === 'anime' && trailerActive) return undefined;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [items, type, trailerActive]);

  if (!items.length) return null;

  const item = items[current];
  const hasTrailer = !!(item && item.trailerUrl);
  const detailLink = type === 'anime' ? `/anime/${item.id}` : `/manga/${item.id}`;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  // Convert standard YouTube embed to premium silent background player
  const getAutoplayUrl = (url) => {
    if (!url) return null;
    try {
      const u = new URL(url);
      u.searchParams.set('autoplay', '1');
      u.searchParams.set('mute', '1');
      u.searchParams.set('controls', '0');
      u.searchParams.set('loop', '1');
      u.searchParams.set('playlist', u.searchParams.get('v') || u.pathname.split('/').pop());
      u.searchParams.set('showinfo', '0');
      u.searchParams.set('modestbranding', '1');
      u.searchParams.set('rel', '0');
      return u.toString();
    } catch {
      return url;
    }
  };

  return (
    <section className={`popular-banner ${type === 'anime' ? 'anime-popular-banner' : 'manga-popular-banner'}`}>
      {/* Background backdrop - ONLY on desktop (hidden on mobile) */}
      <div
        className="banner-backdrop"
        style={{ backgroundImage: `url(${item.coverUrl})` }}
      />
      <div className="banner-overlay" />

      {/* Media Display Card (Poster/Video) - Desktop background video / Mobile top card */}
      <div className={`banner-media-card ${trailerActive ? 'video-active' : ''}`}>
        {type === 'anime' && hasTrailer && trailerActive ? (
          <div className="banner-video-bg">
            <iframe
              src={getAutoplayUrl(item.trailerUrl)}
              title="Anime Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div
            className="banner-mobile-cover"
            style={{ backgroundImage: `url(${item.coverUrl})` }}
          />
        )}
        
        {/* Navigation Arrow Buttons inside media area for easy access */}
        <button className="banner-arrow arrow-left" onClick={handlePrev} aria-label="Previous Slide">
          <ChevronLeft size={22} />
        </button>
        <button className="banner-arrow arrow-right" onClick={handleNext} aria-label="Next Slide">
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Details and Actions Area */}
      <div className="banner-body">
        <div className="banner-content">
          <span className="banner-badge">
            {type === 'anime' ? '🔥 POPULER ANIME' : '📚 POPULER MANGA'}
          </span>
          <h1 className="banner-title">{item.title}</h1>
          <div className="banner-meta">
            <RatingStars rating={item.rating} />
            <span className="banner-info">{item.info}</span>
          </div>
          <div className="banner-controls">
            <Link to={detailLink} className="banner-btn btn-play">
              <Play size={18} fill="currentColor" className="icon" />
              <span>Lihat Detail</span>
            </Link>
            {type === 'anime' && hasTrailer && (
              <button
                className="banner-btn btn-trailer"
                onClick={() => setTrailerActive((v) => !v)}
              >
                {trailerActive ? (
                  <>
                    <X size={18} className="icon" />
                    <span>Tutup Trailer</span>
                  </>
                ) : (
                  <>
                    <Info size={18} className="icon" />
                    <span>Tonton Trailer</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right side floating portrait poster - ONLY on Desktop */}
        {(!trailerActive || !hasTrailer) && (
          <div className="banner-poster-wrapper">
            <img src={item.coverUrl} alt={item.title} className="banner-poster" />
          </div>
        )}
      </div>

      {/* Bottom slide indicators */}
      <div className="banner-dots">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default PopularBanner;
