import axios from 'axios';
import { BaseSource } from '../sourceManager';

const API_BASE = import.meta.env.PROD ? '/api/anime' : 'http://localhost:3001/api/anime';

class OtakudesuSource extends BaseSource {
  constructor() {
    super('otakudesu', 'Otakudesu', 'id');
  }

  async getTrendingManga(limit = 24, offset = 0) {
    try {
      const res = await axios.get(`${API_BASE}/latest`, { params: { limit, offset } });
      return res.data;
    } catch (e) {
      console.error('Otakudesu getLatest error:', e);
      return { data: [] };
    }
  }

  async getPopularManga(limit = 24, offset = 0) {
    try {
      const res = await axios.get(`${API_BASE}/popular`, { params: { limit, offset } });
      return res.data;
    } catch (e) {
      console.error('Otakudesu getPopular error:', e);
      return { data: [] };
    }
  }
  
  async getWeeklyAnime(limit = 24, offset = 0) {
    try {
      const res = await axios.get(`${API_BASE}/weekly`, { params: { limit, offset } });
      return res.data;
    } catch (e) {
      console.error('Otakudesu getWeekly error:', e);
      return { data: [] };
    }
  }

  async getMovies(limit = 24, offset = 0) {
    try {
      const res = await axios.get(`${API_BASE}/movies`, { params: { limit, offset } });
      return res.data;
    } catch (e) {
      console.error('Otakudesu getMovies error:', e);
      return { data: [] };
    }
  }

  async searchManga(query, limit = 24, offset = 0) {
    try {
      const res = await axios.get(`${API_BASE}/search`, { params: { q: query, limit, offset } });
      return res.data;
    } catch (e) {
      console.error('Otakudesu search error:', e);
      return { data: [] };
    }
  }

  async getMangaDetail(id) {
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      return res.data;
    } catch (e) {
      console.error('Otakudesu getDetail error:', e);
      return null;
    }
  }

  async getMangaChapters(id) {
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      return res.data.episodes || [];
    } catch (e) {
      console.error('Otakudesu getChapters error:', e);
      return [];
    }
  }

  // Anime specific stream fetching
  async getEpisodeStreams(id) {
    try {
      const res = await axios.get(`${API_BASE}/episode/${id}`);
      return res.data;
    } catch (e) {
      console.error('Otakudesu getStreams error:', e);
      return null;
    }
  }
}

export const otakudesuSource = new OtakudesuSource();
