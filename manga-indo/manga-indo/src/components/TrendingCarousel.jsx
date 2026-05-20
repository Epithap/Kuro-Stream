import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { Play } from 'lucide-react';
import './TrendingCarousel.css';

const TrendingCarousel = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const res = await animeSourceManager.getLatestAnime();
        setTrending(res.data);
      } catch (e) {
        console.error('Failed to fetch trending anime', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="carousel-loading">
        <div className="skeleton-carousel" />
      </div>
    );
  }

  if (!trending.length) {
    return null;
  }

  return (
    <section className="trending-carousel">
      <h2 className="carousel-title">Top Trending Anime</h2>
      <div className="carousel-track">
        {trending.map(anime => (
          <Link
            to={`/anime/${anime.id}`}
            key={anime.id}
            className="carousel-card"
          >
            <div className="card-bg" style={{ backgroundImage: `url(${anime.coverUrl})` }} />
            <div className="card-overlay" />
            <div className="card-content">
              <h3 className="card-title">{anime.title}</h3>
              {anime.score && (
                <div className="card-score">★ {anime.score}</div>
              )}
              <Play size={20} className="play-icon" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TrendingCarousel;
