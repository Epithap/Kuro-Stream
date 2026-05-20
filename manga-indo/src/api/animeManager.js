import axios from 'axios';
import { anilistSource } from '../api/sources/anilist';

import BACKEND_URL from '../../config/apiConfig';
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
        const res = await axios.get(`${BACKEND_URL}/anime/latest`, { params: { offset }, timeout: 5000 });
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
        const res = await axios.get(`${BACKEND_URL}/anime/popular`, { params: { offset }, timeout: 5000 });
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
        const res = await axios.get(`${BACKEND_URL}/anime/weekly`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend unavailable, falling back');
      }
      return animeSourceManager.getLatestAnime(offset);
    } catch (e) {
      return { data: [], source: 'fallback' };
    }
  },

  getAllAnime: async (offset = 0) => {
    try {
      // Try backend all endpoint first
      try {
        const res = await axios.get(`${BACKEND_URL}/anime/all`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend all endpoint unavailable, falling back');
      }
      // Fallback to Jikan – fetch full list via pagination (24 per page)
      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/top/anime`, { params: { limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      return { data: jikanData, source: 'jikan' };
    } catch (e) {
      console.error('getAllAnime error:', e);
      return { data: [], source: 'fallback' };
    }
  },
  getMovieAnime: async (offset = 0) => {
    try {
      try {
        const res = await axios.get(`${BACKEND_URL}/anime/movies`, { params: { offset }, timeout: 5000 });
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
        const res = await axios.get(`${BACKEND_URL}/anime/search`, { params: { q: query }, timeout: 5000 });
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
      const res = await axios.get(`${BACKEND_URL}/anime/${id}`, { timeout: 5000 });
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
      const res = await axios.get(`${BACKEND_URL}/anime/${id}`, { timeout: 5000 });
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
      const res = await axios.get(`${BACKEND_URL}/anime/episode/${episodeSlug}`, { timeout: 5000 });
      return res.data;
    } catch (e) {
      return { servers: [], embedUrl: '', episodeSlug };
    }
  },

  getSmartEpisodeStream: async (episodeId, animeId, epNum) => {
    // If it's already an Otakudesu slug (not purely numeric), fetch directly
    if (!/^\d+$/.test(episodeId) && isNaN(Number(episodeId))) {
      return await animeSourceManager.getEpisodeStream(episodeId);
    }

    // It's a Jikan (MAL) numeric ID, so Otakudesu won't understand it. We must find the Otakudesu slug!
    try {
      const detail = await animeSourceManager.getAnimeDetail(animeId);
      let otakuAnime = null;
      
      // 1. Try search with Japanese Title
      if (detail.titleJP) {
        try {
          const s1 = await axios.get(`${BACKEND_URL}/anime/search`, { params: { q: detail.titleJP } });
          if (s1.data?.data?.length > 0) otakuAnime = s1.data.data[0];
        } catch (e) {}
      }
      
      // 2. Try search with English/Main Title if not found
      if (!otakuAnime && detail.title) {
        try {
          const s2 = await axios.get(`${BACKEND_URL}/anime/search`, { params: { q: detail.title } });
          if (s2.data?.data?.length > 0) otakuAnime = s2.data.data[0];
        } catch (e) {}
      }

      // If we found it on Otakudesu, fetch its episodes and match the episode number
      if (otakuAnime && otakuAnime.id) {
        const epsRes = await axios.get(`${BACKEND_URL}/anime/${otakuAnime.id}`);
        const eps = epsRes.data?.episodes || [];
        
        // Match episode number exactly or by checking if title includes "Episode {num}"
        const matchedEp = eps.find(e => 
          e.episode == epNum || 
          (e.title && e.title.toLowerCase().includes(`episode ${epNum}`)) ||
          (e.title && e.title.toLowerCase().includes(`ep ${epNum}`))
        );
        
        // Special case: If it's a movie (epNum 1 and only 1 episode), use the first one
        const finalEp = matchedEp || (eps.length === 1 && epNum == 1 ? eps[0] : null);
        
        if (finalEp && finalEp.id) {
          return await animeSourceManager.getEpisodeStream(finalEp.id);
        }
      }
    } catch (e) {
      console.error("Smart lookup failed:", e.message);
    }
    
    // Fallback if not found on Otakudesu
    return { servers: [], embedUrl: '', episodeSlug: episodeId };
  },

  resolveEpisodeStream: async (episodeSlug, payload) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/anime/resolve-stream`, { episodeSlug, payload }, { timeout: 10000 });
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
