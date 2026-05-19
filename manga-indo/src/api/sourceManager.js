import { mangadexIdSource } from './sources/mangadex_id';
import { mangadexEnSource } from './sources/mangadex_en';
import { doujinSource } from './sources/doujin';
import { komikcastSource } from './sources/komikcast';
import { westmangaSource } from './sources/westmanga';

// Secret code to unlock Doujindesu: "openH"
const DOUJIN_SECRET = 'openH';
const DOUJIN_STORAGE_KEY = 'doujin_unlocked';

export const isDoujinUnlocked = () => {
  return localStorage.getItem(DOUJIN_STORAGE_KEY) === 'true';
};

export const unlockDoujin = (code) => {
  const clean = code.trim();
  if (clean === DOUJIN_SECRET) {
    localStorage.setItem(DOUJIN_STORAGE_KEY, 'true');
    return true;
  } else if (clean === 'lockH') {
    localStorage.removeItem(DOUJIN_STORAGE_KEY);
    return false;
  }
  return false;
};

export const lockDoujin = () => {
  localStorage.removeItem(DOUJIN_STORAGE_KEY);
};

export const getAvailableSources = () => {
  const sources = [
    {
      id: 'westmanga',
      name: 'WestManga.co (Sub Indo)',
      icon: '🔥',
      description: 'Manga & Manhwa terlengkap dari WestManga.co',
      source: westmangaSource
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
    const savedSource = localStorage.getItem('active_source');
    const sources = getAvailableSources();
    this.activeSourceId = savedSource && sources.find(s => s.id === savedSource)
      ? savedSource
      : 'westmanga';
  }

  getActiveSourceId() {
    return this.activeSourceId;
  }

  getActiveSource() {
    const sources = getAvailableSources();
    const sourceObj = sources.find(s => s.id === this.activeSourceId);
    if (!sourceObj) {
      this.activeSourceId = 'westmanga';
      localStorage.setItem('active_source', 'westmanga');
      return westmangaSource;
    }
    return sourceObj.source;
  }

  setActiveSource(sourceId) {
    const sources = getAvailableSources();
    if (sources.find(s => s.id === sourceId)) {
      this.activeSourceId = sourceId;
      localStorage.setItem('active_source', sourceId);
      window.location.reload();
    }
  }

  getTrendingManga(limit, offset) {
    return this.getActiveSource().getTrendingManga(limit, offset);
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
