import React from 'react';
import { Link } from 'react-router-dom';
import { sourceManager } from '../api/sourceManager';
import { Star } from 'lucide-react';
import './MangaCard.css';

const MangaCard = ({ manga }) => {
  const activeSource = sourceManager.getActiveSourceId();
  const badgeText = activeSource === 'mangadex_en' ? 'EN' : 'Sub Indo';

  return (
    <Link to={`/manga/${manga.id}`} className="manga-card">
      <div className="manga-cover-wrapper">
        <img src={manga.coverUrl} alt={manga.title} className="manga-cover" loading="lazy" />
        <div className="manga-overlay">
          <div className="manga-badge">{badgeText}</div>
        </div>
      </div>
      <div className="manga-info">
        <h3 className="manga-title">{manga.title}</h3>
        <div className="manga-meta">
          <span className="manga-status">{manga.status}</span>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
