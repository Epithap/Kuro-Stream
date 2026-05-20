import axios from 'axios';

// Base URL for Jikan v4 (no API key required)
const JIKAN_BASE = 'https://api.jikan.moe/v4';

// Simple rate‑limiting: ensure at least 1 s between calls
let lastCall = 0;
const delay = async () => {
  const now = Date.now();
  const diff = now - lastCall;
  if (diff < 1100) await new Promise(r => setTimeout(r, 1100 - diff));
  lastCall = Date.now();
};

/**
 * Helper to map Jikan anime objects to the fields used in the UI.
 */
const mapAnime = a => ({
  id: String(a.mal_id),
  title: a.title || a.title_english || a.title_japanese,
  coverUrl: a.images?.jpg?.large_image_url || a.images?.webp?.large_image_url || '',
  rating: a.score ?? null,
  info: `${a.year || ''} • ${a.type || ''}`,
  trailerUrl: a.trailer?.embed_url || null,
  source: 'jikan'
});

/**
 * Helper to map Jikan manga objects.
 */
const mapManga = m => ({
  id: String(m.mal_id),
  title: m.title || m.title_english || m.title_japanese,
  coverUrl: m.images?.jpg?.large_image_url || m.images?.webp?.large_image_url || '',
  rating: m.score ?? null,
  info: `${m.volumes || '?'} vol • ${m.chapters || '?'} ch`,
  source: 'jikan'
});

export const myAnimeList = {
  /** Get trending anime (top airing) */
  getTrendingAnime: async (limit = 10) => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/seasons/now`, { params: { limit } });
    return res.data.data.map(mapAnime);
  },

  /** Get trending manga (top manga) */
  getTrendingManga: async (limit = 10) => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/top/manga`, { params: { limit } });
    return res.data.data.map(mapManga);
  },

  /** Search anime */
  searchAnime: async (query, limit = 10) => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/anime`, { params: { q: query, limit } });
    return res.data.data.map(mapAnime);
  },

  /** Search manga */
  searchManga: async (query, limit = 10) => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/manga`, { params: { q: query, limit } });
    return res.data.data.map(mapManga);
  },

  /** Get full anime detail */
  getAnimeDetail: async id => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/anime/${id}`);
    return mapAnime(res.data);
  },

  /** Get full manga detail */
  getMangaDetail: async id => {
    await delay();
    const res = await axios.get(`${JIKAN_BASE}/manga/${id}`);
    return mapManga(res.data);
  }
};
