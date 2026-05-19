import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { animeSourceManager } from '../api/animeManager';
import { ArrowLeft, ChevronLeft, ChevronRight, Play, Wifi, ExternalLink, RefreshCw } from 'lucide-react';
import './WatchAnime.css';

const FALLBACK_SITES = (title, ep) => [
  { name: 'Samehadaku', url: `https://samehadaku.email/?s=${encodeURIComponent(title)}` },
  { name: 'Anoboy',     url: `https://anoboy.app/?s=${encodeURIComponent(title)}` },
  { name: 'Wibuku',     url: `https://wibuku.app/?s=${encodeURIComponent(title)}` },
  { name: 'Otakudesu',  url: `https://otakudesu.blog/?s=${encodeURIComponent(title)}` },
  { name: 'Gogoanime',  url: `https://gogoanime3.co/videos/embed/${(title||'').toLowerCase().replace(/[^a-z0-9]+/g,'-')}-episode-${ep}` },
];

const WatchAnime = () => {
  const { episodeId } = useParams();
  const [searchParams] = useSearchParams();
  const animeId    = searchParams.get('anime');
  const epNum      = parseInt(searchParams.get('ep') || '1');
  const animeTitle = searchParams.get('title') || '';
  const navigate   = useNavigate();

  const [embedUrl,       setEmbedUrl]       = useState('');
  const [qualities,      setQualities]      = useState({});
  const [selectedQ,      setSelectedQ]      = useState('480p');
  const [activeMirror,   setActiveMirror]   = useState('');
  const [isLoading,      setIsLoading]      = useState(true);
  const [isResolving,    setIsResolving]    = useState(false);
  const [allEpisodes,    setAllEpisodes]    = useState([]);
  const [showSidebar,    setShowSidebar]    = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setEmbedUrl('');
      setQualities({});
      try {
        const data = await animeSourceManager.getEpisodeStream(episodeId);
        if (data.embedUrl) setEmbedUrl(data.embedUrl);
        if (data.qualities && Object.keys(data.qualities).length) {
          setQualities(data.qualities);
          const keys = Object.keys(data.qualities);
          const defQ = keys.includes('480p') ? '480p' : keys[0];
          setSelectedQ(defQ);
          const mirrors = data.qualities[defQ] || [];
          const def = mirrors.find(m => m.isDefault) || mirrors[0];
          if (def) setActiveMirror(def.name);
        }
        if (animeId) {
          const eps = await animeSourceManager.getAnimeEpisodes(animeId);
          setAllEpisodes(eps);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [episodeId, animeId]);

  const handleMirror = async (quality, mirror) => {
    setSelectedQ(quality);
    setActiveMirror(mirror.name);
    setIsResolving(true);
    try {
      const res = await animeSourceManager.resolveEpisodeStream(episodeId, mirror.payload);
      if (res?.embedUrl) setEmbedUrl(res.embedUrl);
    } catch (e) { console.error(e); }
    finally { setIsResolving(false); }
  };

  const curIdx  = allEpisodes.findIndex(ep => String(ep.id) === String(episodeId));
  const prevEp  = curIdx > 0 ? allEpisodes[curIdx - 1] : null;
  const nextEp  = curIdx < allEpisodes.length - 1 ? allEpisodes[curIdx + 1] : null;
  const hasQ    = Object.keys(qualities).length > 0;

  return (
    <div className="wa-page">

      {/* Top bar */}
      <div className="wa-topbar">
        <button className="wa-back" onClick={() => navigate(animeId ? `/anime/${animeId}` : '/anime')}>
          <ArrowLeft size={18} />
        </button>
        <div className="wa-topbar-info">
          {animeTitle && <span className="wa-anime-name">{animeTitle}</span>}
          <span className="wa-ep-pill">Episode {epNum}</span>
        </div>
        <button
          className={`wa-sidebar-toggle ${showSidebar ? 'active' : ''}`}
          onClick={() => setShowSidebar(v => !v)}
          title="Daftar Episode"
        >
          ☰
        </button>
      </div>

      {/* Main layout */}
      <div className={`wa-layout ${showSidebar && allEpisodes.length ? 'with-sidebar' : ''}`}>

        {/* Player column */}
        <div className="wa-player-col">

          {/* Video player */}
          <div className="wa-player-box">
            {(isLoading || isResolving) ? (
              <div className="wa-player-state">
                <div className="wa-spinner" />
                <p>{isResolving
                  ? `Menghubungkan ${activeMirror} (${selectedQ})…`
                  : 'Memuat video…'}
                </p>
              </div>
            ) : embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                className="wa-iframe"
                allowFullScreen
                allow="autoplay; fullscreen; encrypted-media"
                scrolling="no"
                title={`${animeTitle} Ep ${epNum}`}
              />
            ) : (
              <div className="wa-player-state">
                <div className="wa-no-stream-icon">📡</div>
                <p>Stream tidak tersedia</p>
                <span className="wa-hint">Gunakan link cadangan di bawah</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="wa-nav-row">
            {prevEp ? (
              <Link
                className="wa-nav-btn"
                to={`/watch/${prevEp.id}?anime=${animeId}&ep=${prevEp.episode || curIdx}&title=${encodeURIComponent(animeTitle)}`}
              >
                <ChevronLeft size={18} />
                <span>Ep {prevEp.episode || curIdx}</span>
              </Link>
            ) : <div />}

            <span className="wa-nav-current">Episode {epNum}</span>

            {nextEp ? (
              <Link
                className="wa-nav-btn wa-nav-next"
                to={`/watch/${nextEp.id}?anime=${animeId}&ep=${nextEp.episode || curIdx + 2}&title=${encodeURIComponent(animeTitle)}`}
              >
                <span>Ep {nextEp.episode || curIdx + 2}</span>
                <ChevronRight size={18} />
              </Link>
            ) : <div />}
          </div>

          {/* Quality + Mirror selector */}
          {hasQ && (
            <div className="wa-servers-panel">
              <div className="wa-panel-title">
                <Wifi size={15} />
                <span>Server & Kualitas</span>
              </div>
              <div className="wa-quality-row">
                {Object.keys(qualities).map(q => (
                  <button
                    key={q}
                    className={`wa-q-pill ${selectedQ === q ? 'active' : ''}`}
                    onClick={() => {
                      const mirrors = qualities[q] || [];
                      if (mirrors.length) handleMirror(q, mirrors[0]);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="wa-mirror-row">
                {(qualities[selectedQ] || []).map((m, i) => (
                  <button
                    key={i}
                    className={`wa-mirror-btn ${activeMirror === m.name ? 'active' : ''}`}
                    onClick={() => handleMirror(selectedQ, m)}
                  >
                    {m.isDefault && <span className="wa-dot" />}
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fallback links */}
          <div className="wa-fallback-panel">
            <div className="wa-panel-title">
              <ExternalLink size={15} />
              <span>Link Cadangan</span>
            </div>
            <div className="wa-fallback-links">
              {FALLBACK_SITES(animeTitle, epNum).map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="wa-fallback-btn">
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Episode sidebar */}
        {showSidebar && allEpisodes.length > 0 && (
          <aside className="wa-sidebar">
            <div className="wa-sidebar-head">
              <Play size={14} />
              <span>Episode ({allEpisodes.length})</span>
            </div>
            <div className="wa-ep-list">
              {[...allEpisodes].reverse().map((ep, idx) => {
                const num = ep.episode || (allEpisodes.length - idx);
                const isActive = String(ep.id) === String(episodeId);
                return (
                  <Link
                    key={ep.id || idx}
                    to={`/watch/${ep.id}?anime=${animeId}&ep=${num}&title=${encodeURIComponent(animeTitle)}`}
                    className={`wa-ep-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="wa-ep-num">{num}</span>
                    <span className="wa-ep-label">Episode {num}</span>
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default WatchAnime;
