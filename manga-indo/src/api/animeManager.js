import axios from 'axios';
import { anilistSource } from '../api/sources/anilist';

const BACKEND_URL = import.meta.env.PROD ? '/api/anime' : 'http://localhost:3001/api/anime';
// Fallback: Jikan API (MyAnimeList, tidak terblokir)
const JIKAN_URL = 'https://api.jikan.moe/v4';

let lastJikanCall = 0;
const jikanDelay = async () => {
  const now = Date.now();
  const diff = now - lastJikanCall;
  if (diff < 1100) await new Promise(r => setTimeout(r, 1100 - diff));
  lastJikanCall = Date.now();
};

const mapJikanAnime = (anime) => ({
  id: String(anime.mal_id),
  title: anime.title_english || anime.title,
  titleJP: anime.title,
  coverUrl: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url || '',
  status: anime.status || 'Unknown',
  episodes: anime.episodes || '?',
  score: anime.score,
  synopsis: anime.synopsis || '',
  tags: (anime.genres || []).map(g => g.name),
  year: anime.year,
  studios: (anime.studios || []).map(s => s.name),
  trailerUrl: anime.trailer?.embed_url || anime.trailer?.url || null,
  source: 'jikan'
});

export const animeSourceManager = {

  getLatestAnime: async (offset = 0) => {
    // Try local backend first (Otakudesu)
    try {
      // Try backend (Otakudesu) first
      try {
        const res = await axios.get(`${BACKEND_URL}/latest`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend unavailable, falling back');
      }
      // Jikan fallback (MyAnimeList)
      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/seasons/now`, { params: { limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      if (jikanData.length) return { data: jikanData, source: 'jikan' };
      // As last resort, use AniList
      const anilistData = await anilistSource.getTrendingAnime(24, page);
      return { data: anilistData, source: 'anilist' };
    } catch (e) {
      console.error('getLatestAnime error:', e);
      return { data: [], source: 'fallback' };
    }
  },

  getPopularAnime: async (offset = 0) => {
    try {
      try {
        const res = await axios.get(`${BACKEND_URL}/popular`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend unavailable, falling back');
      }
      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/top/anime`, { params: { limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      return { data: jikanData, source: 'jikan' };
    } catch (e) {
      return { data: [], source: 'fallback' };
    }
  },

  getWeeklyAnime: async (offset = 0) => {
    try {
      try {
        const res = await axios.get(`${BACKEND_URL}/weekly`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend unavailable, falling back');
      }
      return animeSourceManager.getLatestAnime(offset);
    } catch (e) {
      return { data: [], source: 'fallback' };
    }
  },

  getMovieAnime: async (offset = 0) => {
    try {
      try {
        const res = await axios.get(`${BACKEND_URL}/movies`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend unavailable, falling back');
      }
      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/anime`, { params: { type: 'movie', order_by: 'popularity', sort: 'asc', limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      return { data: jikanData, source: 'jikan' };
    } catch (e) {
      return { data: [], source: 'fallback' };
    }
  },

  searchAnime: async (query, offset = 0) => {
    try {
      // Try backend search first
      try {
        const res = await axios.get(`${BACKEND_URL}/search`, { params: { q: query }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend search unavailable, falling back');
      }
      // Jikan search fallback
      await jikanDelay();
      const res = await axios.get(`${JIKAN_URL}/anime`, {
        params: { q: query, limit: 24, order_by: 'popularity', sort: 'asc' }
      });
      const jikanData = res.data.data.map(mapJikanAnime);
      if (jikanData.length) return { data: jikanData, source: 'jikan' };
      // AniList search fallback
      const anilistData = await anilistSource.searchAnime(query, 24);
      return { data: anilistData, source: 'anilist' };
    } catch (e) {
      console.error('searchAnime error:', e);
      return { data: [], source: 'fallback' };
    }
  },

  getAnimeDetail: async (id) => {
    // Coba backend (slug-based)
    try {
      const res = await axios.get(`${BACKEND_URL}/${id}`, { timeout: 5000 });
      if (res.data?.title) return { ...res.data, source: 'otakudesu' };
    } catch (e) {
      console.warn('Backend anime detail not available, using Jikan fallback');
    }

    // Jikan fallback (numeric MAL ID)
    if (/^\d+$/.test(id)) {
      await jikanDelay();
      const res = await axios.get(`${JIKAN_URL}/anime/${id}`);
      const anime = mapJikanAnime(res.data.data);
      anime.source = 'jikan';
      return anime;
    }
    throw new Error('Anime tidak ditemukan.');
  },

  getAnimeEpisodes: async (id) => {
    // Try backend first
    try {
      const res = await axios.get(`${BACKEND_URL}/${id}`, { timeout: 5000 });
      if (res.data?.episodes?.length > 0) return res.data.episodes;
    } catch (e) {}

    // Jikan: ambil episode dari MAL (hanya metadata, bukan stream)
    if (/^\d+$/.test(id)) {
      await jikanDelay();
      try {
        const res = await axios.get(`${JIKAN_URL}/anime/${id}/episodes`);
        return res.data.data.map(ep => ({
          id: String(ep.mal_id),
          title: ep.title || `Episode ${ep.mal_id}`,
          episode: ep.mal_id,
          aired: ep.aired
        }));
      } catch (e) { return []; }
    }
    return [];
  },

  getEpisodeStream: async (episodeSlug) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/episode/${episodeSlug}`, { timeout: 5000 });
      return res.data;
    } catch (e) {
      return { servers: [], embedUrl: '', episodeSlug };
    }
  },

  resolveEpisodeStream: async (episodeSlug, payload) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/resolve-stream`, { episodeSlug, payload }, { timeout: 10000 });
      return res.data; // returns { embedUrl }
    } catch (e) {
      console.error('Failed to resolve episode stream:', e.message);
      return null;
    }
  },

  searchYoutubeVideo: async (query) => {
    try {
      const youtubeUrl = import.meta.env.PROD ? '/api/youtube/search' : 'http://localhost:3001/api/youtube/search';
      const res = await axios.get(youtubeUrl, { params: { q: query }, timeout: 10000 });
      return res.data; // returns { videoId, embedUrl }
    } catch (e) {
      console.error('Failed to search youtube fallback video:', e.message);
      return null;
    }
  }
};
