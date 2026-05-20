import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, ChevronDown, LayoutGrid, X } from 'lucide-react';
import { sourceManager, getAvailableSources, isDoujinUnlocked, unlockDoujin, lockDoujin, refreshSources } from '../api/sourceManager';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mode, setMode] = useState('manga');
  const navigate = useNavigate();
  const location = useLocation();

  // Handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Update route based on mode
    navigate(newMode === 'anime' ? '/anime' : '/manga');
  };

  if (location.pathname === '/') return null;

  const isAnimeMode = location.pathname.startsWith('/anime') || location.pathname.startsWith('/watch');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const path = isAnimeMode ? '/anime' : '/manga';
      navigate(`${path}?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false); // Close overlay after search
    }
  };

  const handleSourceChange = (sourceId) => {
    sourceManager.setActiveSource(sourceId);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const currentSources = getAvailableSources();
  const activeSource = currentSources.find(s => s.id === sourceManager.getActiveSourceId()) || currentSources[0];

  return (
    <>
      <header className="navbar-container glass-panel">
        <div className="container navbar-content">
          {/* Main Top Row */}
          <div className="navbar-main-row">
            <Link to={isAnimeMode ? '/anime' : '/manga'} className="brand">
              <div className="brand-icon">
                <BookOpen size={24} />
              </div>
              <h1 className="brand-text">
                Kuro<span className="text-gradient">Stream</span>
              </h1>
            </Link>

            <div className="navbar-actions-group">
              {/* Desktop Search */}
              <form className="search-form" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder={isAnimeMode ? 'Cari anime...' : 'Cari manga...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
              </form>

              {/* Mobile Search Toggle Button */}
              <button 
                className="mobile-search-toggle-btn" 
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Open search"
              >
                <Search size={20} />
              </button>

              {/* Ganti Mode Button */}
              <button
                className="source-btn mode-switch-btn"
                onClick={() => navigate('/')}
                title="Ganti Mode"
              >
                <LayoutGrid size={16} />
                <span>Mode</span>
              </button>

              {/* Discreet expanding secret key input */}
              <input
                type="text"
                placeholder=""
                style={{
                  width: '12px',
                  height: '32px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'transparent',
                  caretColor: 'transparent',
                  fontSize: '11px',
                  textAlign: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  padding: '0'
                }}
                onFocus={(e) => {
                  e.target.style.width = '70px';
                  e.target.style.background = 'var(--bg-tertiary)';
                  e.target.style.border = '1px solid var(--glass-border)';
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.caretColor = 'var(--text-primary)';
                  e.target.placeholder = 'Kode...';
                  e.target.style.padding = '0 8px';
                }}
                onBlur={(e) => {
                  e.target.style.width = '12px';
                  e.target.style.background = 'transparent';
                  e.target.style.border = 'none';
                  e.target.style.color = 'transparent';
                  e.target.style.caretColor = 'transparent';
                  e.target.placeholder = '';
                  e.target.style.padding = '0';
                  e.target.value = '';
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'openH') {
                    unlockDoujin('openH');
                    refreshSources();
                    window.location.reload();
                  } else if (val === 'lockH') {
                    lockDoujin();
                    refreshSources();
                    window.location.reload();
                  }
                }}
              />
            </div>
          </div>

          {/* Sub Navigation Category / Source Selection Row */}
          <div className="navbar-sub-row">
            {/* Mode Switch (Manga / Anime) */}
            <div className="mode-switch">
              <button
                className={`mode-btn ${mode === 'manga' ? 'active' : ''}`}
                onClick={() => handleModeChange('manga')}
              >
                Manga
              </button>
              <button
                className={`mode-btn ${mode === 'anime' ? 'active' : ''}`}
                onClick={() => handleModeChange('anime')}
              >
                Anime
              </button>
            </div>

            {/* Source Dropdown Selector */}
            {!isAnimeMode && (
              <div className="source-selector">
                <button
                  className="source-btn"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="source-icon">{activeSource?.icon || '📚'}</span>
                  <span className="source-name">{activeSource?.name || 'Source'}</span>
                  <ChevronDown size={14} />
                </button>

                {isDropdownOpen && (
                  <div className="source-dropdown">
                    {currentSources.map(source => (
                      <button
                        key={source.id}
                        className={`source-option ${source.id === activeSource?.id ? 'active' : ''} ${source.isSecret ? 'source-secret' : ''}`}
                        onClick={() => handleSourceChange(source.id)}
                      >
                        <span className="source-icon">{source.icon || '📚'}</span>
                        <span className="source-name">{source.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Premium Full-screen Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay animate-fade-in">
          <div className="mobile-search-content">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <Search className="mobile-search-icon-inside" size={20} />
              <input
                type="text"
                placeholder={isAnimeMode ? 'Cari anime...' : 'Cari manga...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
                autoFocus
              />
              <button 
                type="button" 
                className="mobile-search-close-btn" 
                onClick={() => setIsMobileSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
