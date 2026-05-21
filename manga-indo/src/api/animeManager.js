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

const normalizeText = (text) => {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[\s\-_:;,'"()\[\]{}\/]+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const scoreTitleMatch = (query, title) => {
  const normalizedQuery = normalizeText(query);
  const normalizedTitle = normalizeText(title);
  if (!normalizedQuery || !normalizedTitle) return 0;
  if (normalizedTitle === normalizedQuery) return 100;
  if (normalizedTitle.includes(normalizedQuery) || normalizedQuery.includes(normalizedTitle)) return 80;

  const queryWords = new Set(normalizedQuery.split(' '));
  const titleWords = new Set(normalizedTitle.split(' '));
  const commonCount = [...queryWords].filter(word => titleWords.has(word)).length;
  let score = commonCount * 10;
  if (normalizedTitle.startsWith(normalizedQuery) || normalizedTitle.endsWith(normalizedQuery)) score += 10;
  if (normalizedTitle.includes('sub indo') && !normalizedQuery.includes('sub indo')) score += 5;
  return score;
};

const chooseBestOtakudesuMatch = (query, results) => {
  if (!Array.isArray(results) || results.length === 0) return null;
  let best = results[0];
  let bestScore = scoreTitleMatch(query, best.title || '');

  for (const result of results.slice(1)) {
    const score = scoreTitleMatch(query, result.title || '');
    if (score > bestScore) {
      bestScore = score;
      best = result;
    }
  }
  return best;
};

const mergeAnimeResults = (...lists) => {
  const seenIds = new Set();
  const seenTitles = new Set();
  const merged = [];

  const add = (anime) => {
    const idKey = anime.id ? String(anime.id) : null;
    const titleKey = normalizeText(anime.title);

    if (idKey && seenIds.has(idKey)) return;
    if (titleKey && seenTitles.has(titleKey)) return;

    if (idKey) seenIds.add(idKey);
    if (titleKey) seenTitles.add(titleKey);

    merged.push(anime);
  };

  for (const list of lists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      add(item);
    }
  }
  return merged;
};

const searchOtakudesuSlug = async (title, titleJP) => {
  const candidateStrings = [];
  if (title) {
    candidateStrings.push(title);
    candidateStrings.push(`${title} sub indo`);
    candidateStrings.push(`${title} subtitle indonesia`);
    const plainTitle = title.split(':')[0].trim();
    if (plainTitle && plainTitle !== title) candidateStrings.push(plainTitle);
  }
  if (titleJP) {
    candidateStrings.push(titleJP);
    candidateStrings.push(`${titleJP} sub indo`);
    candidateStrings.push(`${titleJP} subtitle indonesia`);
  }

  const seen = new Set();
  const queries = [];
  for (const q of candidateStrings) {
    const normalized = normalizeText(q);
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      queries.push(q);
    }
  }

  for (const query of queries) {
    try {
      const res = await axios.get(`${BACKEND_URL}/anime/search`, { params: { q: query }, timeout: 5000 });
      const data = res.data?.data || [];
      if (data.length > 0) {
        return chooseBestOtakudesuMatch(query, data);
      }
    } catch (e) {
      // ignore and try next candidate
    }
  }
  return null;
};

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

      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/anime`, { params: { order_by: 'title', sort: 'asc', limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      if (jikanData.length) return { data: jikanData, source: 'jikan' };

      const anilistData = await anilistSource.getTrendingAnime(24, page);
      return { data: anilistData, source: 'anilist' };
    } catch (e) {
      console.error('getAllAnime error:', e);
      return { data: [], source: 'fallback' };
    }
  },
  getMovieAnime: async (offset = 0) => {
    try {
      // Prefer backend movies endpoint
      try {
        const res = await axios.get(`${BACKEND_URL}/anime/movies`, { params: { offset }, timeout: 5000 });
        if (res.data?.data?.length > 0) return { data: res.data.data, source: 'otakudesu' };
      } catch (e) {
        console.warn('Backend movies endpoint unavailable, falling back to AniList/Jikan');
      }

      // Try AniList movies first (more complete metadata)
      try {
        const page = Math.floor(offset / 24) + 1;
        const anilistMovies = await anilistSource.getMovies(24, page);
        if (anilistMovies && anilistMovies.length > 0) return { data: anilistMovies, source: 'anilist' };
      } catch (e) {
        console.warn('AniList movies fetch failed:', e.message);
      }

      // Jikan fallback for movies
      await jikanDelay();
      const page = Math.floor(offset / 24) + 1;
      const res = await axios.get(`${JIKAN_URL}/anime`, { params: { type: 'movie', order_by: 'popularity', sort: 'asc', limit: 24, page } });
      const jikanData = res.data.data.map(mapJikanAnime);
      return { data: jikanData, source: 'jikan' };
    } catch (e) {
      console.error('getMovieAnime error:', e);
      return { data: [], source: 'fallback' };
    }
  },

  searchAnime: async (query, offset = 0) => {
    const page = Math.floor(offset / 24) + 1;
    let backendData = null;

    try {
      try {
        const res = await axios.get(`${BACKEND_URL}/anime/search`, { params: { q: query }, timeout: 5000 });
        if (res.data?.data?.length > 0) {
          return { data: res.data.data, source: 'otakudesu' };
        }
      } catch (e) {
        console.warn('Backend search unavailable, falling back');
      }

      await jikanDelay();
      const [jikanRes, anilistData] = await Promise.all([
        axios.get(`${JIKAN_URL}/anime`, {
          params: { q: query, limit: 24, order_by: 'popularity', sort: 'asc', page }
        }).catch(() => null),
        anilistSource.searchAnime(query, 24, page).catch(() => [])
      ]);

      const jikanData = jikanRes?.data?.data?.map(mapJikanAnime) || [];
      const mergedData = mergeAnimeResults(jikanData, anilistData);
      if (mergedData.length) {
        return { data: mergedData, source: 'multi' };
      }

      return { data: [], source: 'fallback' };
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
      console.warn('Backend anime detail not available, using external fallback');
    }

    if (/^\d+$/.test(id)) {
      // Prefer AniList metadata for numeric IDs when backend isn't available
      try {
        const aniDetail = await anilistSource.getAnimeDetail(id);
        if (aniDetail) {
          return { ...aniDetail, source: 'anilist' };
        }
      } catch (e) {
        console.warn('AniList detail lookup failed:', e.message);
      }

      // Jikan fallback (numeric MAL ID)
      try {
        await jikanDelay();
        const res = await axios.get(`${JIKAN_URL}/anime/${id}`);
        const anime = mapJikanAnime(res.data.data);
        anime.source = 'jikan';
        return anime;
      } catch (e) {
        console.warn('Jikan detail lookup failed:', e.message);
      }
    }

    throw new Error('Anime tidak ditemukan.');
  },

  getAnimeEpisodes: async (id) => {
    // Try backend first
    try {
      const res = await axios.get(`${BACKEND_URL}/anime/${id}`, { timeout: 5000 });
      if (res.data?.episodes?.length > 0) return res.data.episodes;
    } catch (e) {
      console.warn('Backend episode list unavailable for', id);
    }

    if (/^\d+$/.test(id)) {
      try {
        await jikanDelay();
        const res = await axios.get(`${JIKAN_URL}/anime/${id}/episodes`);
        if (res.data?.data?.length > 0) {
          return res.data.data.map(ep => ({
            id: String(ep.mal_id),
            title: ep.title || `Episode ${ep.mal_id}`,
            episode: ep.mal_id,
            aired: ep.aired
          }));
        }
      } catch (e) {
        console.warn('Jikan episodes lookup failed:', e.message);
      }

      // If the numeric ID is not a MAL id, try resolve via AniList title and Otakudesu search
      try {
        const detail = await animeSourceManager.getAnimeDetail(id);
        const otakuAnime = await searchOtakudesuSlug(detail.title, detail.titleJP);
        if (otakuAnime?.id) {
          const epsRes = await axios.get(`${BACKEND_URL}/anime/${otakuAnime.id}`);
          if (epsRes.data?.episodes?.length > 0) return epsRes.data.episodes;
        }
      } catch (e) {
        console.warn('Fallback Otakudesu episode lookup failed:', e.message);
      }
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

    // It's likely a Jikan (MAL) numeric ID or numeric episode identifier.
    try {
      const detail = await animeSourceManager.getAnimeDetail(animeId);
      const otakuAnime = await searchOtakudesuSlug(detail.title, detail.titleJP);

      if (otakuAnime && otakuAnime.id) {
        const epsRes = await axios.get(`${BACKEND_URL}/anime/${otakuAnime.id}`);
        const eps = epsRes.data?.episodes || [];

        const matchedEp = eps.find(e =>
          e.episode == epNum ||
          (e.title && e.title.toLowerCase().includes(`episode ${epNum}`)) ||
          (e.title && e.title.toLowerCase().includes(`ep ${epNum}`))
        );

        const finalEp = matchedEp || (eps.length === 1 && epNum === 1 ? eps[0] : null);
        if (finalEp && finalEp.id) {
          return await animeSourceManager.getEpisodeStream(finalEp.id);
        }
      }
    } catch (e) {
      console.error('Smart lookup failed:', e.message);
    }

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
