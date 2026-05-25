import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, BookOpen, ChevronDown, LayoutGrid, X, UserCircle, ShieldCheck, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { sourceManager, getAvailableSources, unlockDoujin, lockDoujin, refreshSources } from '../api/sourceManager';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState('manga');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setIsMobileMenuOpen(false);
    navigate(newMode === 'anime' ? '/anime' : '/manga');
  };

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/dashboard') return null;

  const isAnimeMode = location.pathname.startsWith('/anime') || location.pathname.startsWith('/watch');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const path = isAnimeMode ? '/anime' : '/manga';
      navigate(`${path}?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileSearchOpen(false);
    }
  };

  const handleSourceChange = (sourceId) => {
    sourceManager.setActiveSource(sourceId);
    setIsDropdownOpen(false);
    window.location.reload();
  };

  const currentSources = getAvailableSources();
  const activeSource = currentSources.find((s) => s.id === sourceManager.getActiveSourceId()) || currentSources[0];

  return (
    <>
      <header className="navbar-container glass-panel">
        <div className="container navbar-content">
          {/* Brand & Mobile Menu Toggle */}
          <div className="navbar-brand-section">
            <Link to={isAnimeMode ? '/anime' : '/manga'} className="brand">
              <div className="brand-icon">
                <BookOpen size={24} />
              </div>
              <h1 className="brand-text">
                Kuro<span className="text-gradient">Stream</span>
              </h1>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Search & Actions */}
          <div className="navbar-desktop-actions">
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

            {/* Mobile Search Button */}
            <button
              className="navbar-mobile-search-btn"
              onClick={() => setIsMobileSearchOpen(true)}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Mode Switch (Desktop) */}
            <button
              className="navbar-mode-btn"
              onClick={() => navigate('/')}
              title="Ganti Mode"
            >
              <LayoutGrid size={16} />
              <span className="navbar-mode-text">Mode</span>
            </button>

            {/* User/Login */}
            {user ? (
              <div className="navbar-user-section">
                <Link to="/dashboard" className="navbar-user-link">
                  <UserCircle size={18} />
                  <span className="navbar-user-name">{userProfile?.displayName || 'Profil'}</span>
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link to="/admin" className="navbar-admin-badge">
                    <ShieldCheck size={16} />
                  </Link>
                )}
              </div>
            ) : (
              <Link to="/" className="navbar-user-link">
                <UserCircle size={18} />
                <span className="navbar-user-name">Masuk</span>
              </Link>
            )}
          </div>
        </div>

        {/* Source Selector (Desktop - Below Brand) */}
        {!isAnimeMode && (
          <div className="navbar-source-row">
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
                  {currentSources.map((source) => (
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

            {/* Mode Switch on Source Row */}
            <div className="source-mode-switch">
              <button
                className={`source-mode-btn ${mode === 'manga' ? 'active' : ''}`}
                onClick={() => handleModeChange('manga')}
              >
                Manga
              </button>
              <button
                className={`source-mode-btn ${mode === 'anime' ? 'active' : ''}`}
                onClick={() => handleModeChange('anime')}
              >
                Anime
              </button>
            </div>

            {/* Secret Code Input */}
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
                padding: '0',
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
        )}
      </header>

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="navbar-mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="navbar-mobile-menu" onClick={(e) => e.stopPropagation()}>
            {/* Mobile Navigation Items */}
            <div className="navbar-mobile-items">
              <button
                className={`navbar-mobile-item ${mode === 'manga' ? 'active' : ''}`}
                onClick={() => handleModeChange('manga')}
              >
                <BookOpen size={18} />
                <span>Manga</span>
              </button>
              <button
                className={`navbar-mobile-item ${mode === 'anime' ? 'active' : ''}`}
                onClick={() => handleModeChange('anime')}
              >
                <span>📺</span>
                <span>Anime</span>
              </button>
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="navbar-mobile-item"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle size={18} />
                    <span>Dashboard</span>
                  </Link>
                  {userProfile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="navbar-mobile-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShieldCheck size={18} />
                      <span>Admin</span>
                    </Link>
                  )}
                  <button
                    className="navbar-mobile-item navbar-mobile-logout"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="navbar-mobile-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserCircle size={18} />
                  <span>Masuk</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
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
