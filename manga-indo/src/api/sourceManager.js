import { mangadexIdSource } from './sources/mangadex_id';
import { mangadexEnSource } from './sources/mangadex_en';
import { doujinSource } from './sources/doujin';
import { komikcastSource } from './sources/komikcast';
import { westmangaSource } from './sources/westmanga';

// Secret code to unlock Doujindesu: "openH"
const DOUJIN_SECRET = 'openH';
const DOUJIN_STORAGE_KEY = 'doujin_unlocked';

export const isDoujinUnlocked = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(DOUJIN_STORAGE_KEY) === 'true';
  }
  return false;
};

export const unlockDoujin = (code) => {
  const clean = code.trim();
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    if (clean === DOUJIN_SECRET) {
      localStorage.setItem(DOUJIN_STORAGE_KEY, 'true');
      return true;
    } else if (clean === 'lockH') {
      localStorage.removeItem(DOUJIN_STORAGE_KEY);
      return true;
    }
  }
  return false;
};

// Explicit lock function used by UI controls
export const lockDoujin = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(DOUJIN_STORAGE_KEY);
    return true;
  }
  return false;
};

export const getAvailableSources = () => {
  const sources = [
    {
      id: 'westmanga',
      name: 'WestManga.co (Sub Indo)',
      icon: '🔥',
      description: 'Manga & Manhwa terlengkap dari WestManga.co',
      source: westmangaSource
    },
    {
      id: 'komikcast',
      name: 'Komikcast (Sub Indo)',
      icon: '📚',
      description: 'Manga dari Komikcast',
      source: komikcastSource
    }
  ];

  // Only show Doujin source if unlocked
  if (isDoujinUnlocked()) {
    sources.push({
      id: 'doujin',
      name: 'Doujindesu 🔞',
      icon: '🔞',
      description: 'Konten dewasa dari Doujindesu (18+)',
      source: doujinSource,
      isSecret: true
    });
  }

  return sources;
};

export let availableSources = getAvailableSources();

// Call this after unlocking to refresh the sources list
export const refreshSources = () => {
  availableSources = getAvailableSources();
};

class SourceManager {
  constructor() {
    // Initialize active source, preferring persisted value if available
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('active_source');
      this.activeSourceId = stored || 'westmanga';
    } else {
      this.activeSourceId = 'westmanga';
    }
    // Simple listener registry for source changes
    this._listeners = [];
  }

  getActiveSourceId() {
    return this.activeSourceId;
  }

  getActiveSource() {
    const sources = getAvailableSources();
    const sourceObj = sources.find(s => s.id === this.activeSourceId);
    if (!sourceObj) {
      this.activeSourceId = 'westmanga';
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('active_source', 'westmanga');
      }
      return westmangaSource;
    }
    return sourceObj.source;
  }

  setActiveSource(sourceId) {
    const sources = getAvailableSources();
    if (sources.find(s => s.id === sourceId)) {
      this.activeSourceId = sourceId;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('active_source', sourceId);
      }
      // Notify listeners instead of full page reload
      this._listeners.forEach(cb => cb(sourceId));
    }
  }

  // Allow components to subscribe to source changes
  onSourceChange(callback) {
    if (typeof callback === 'function') {
      this._listeners.push(callback);
      // Return unsubscribe function
      const unsubscribe = () => {
        const idx = this._listeners.indexOf(callback);
        if (idx > -1) this._listeners.splice(idx, 1);
      };
      return unsubscribe;
    }
    return () => {};
  }

  getTrendingManga(limit, offset) {
    return this.getActiveSource().getTrendingManga(limit, offset);
  }

  getPopularManga(limit, offset) {
    // Only westmanga supports getPopularManga right now, but let's assume it exists or fallback
    const source = this.getActiveSource();
    if (source.getPopularManga) {
      return source.getPopularManga(limit, offset);
    }
    // Fallback if not supported by other sources
    return source.getTrendingManga(limit, offset);
  }

  searchManga(title, limit, offset) {
    return this.getActiveSource().searchManga(title, limit, offset);
  }

  getMangaDetail(mangaId) {
    return this.getActiveSource().getMangaDetail(mangaId);
  }

  getMangaChapters(mangaId, order = 'desc', limit = 100, offset = 0) {
    return this.getActiveSource().getMangaChapters(mangaId, order, limit, offset);
  }

  getChapterPages(chapterId) {
    return this.getActiveSource().getChapterPages(chapterId);
  }
}

export const sourceManager = new SourceManager();
