import axios from 'axios';

const BACKEND_URL = 'http://localhost:3001/api/komikcast';

export const komikcastSource = {
  getTrendingManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/latest`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Komikcast Error:', error);
      throw new Error('Gagal memuat dari Komikcast (Server Lokal mungkin mati).');
    }
  },

  searchManga: async (title, limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/search`, {
        params: { q: title, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Komikcast Error:', error);
      throw new Error('Gagal mencari di Komikcast.');
    }
  },

  getMangaDetail: async (mangaId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error('Komikcast Error:', error);
      throw new Error('Gagal memuat detail dari Komikcast.');
    }
  },

  getMangaChapters: async (mangaId, order = 'desc', limit = 100, offset = 0) => {
    // Actually our backend scraper doesn't have a specific chapters endpoint yet, 
    // it gets chapters from getMangaDetail HTML. Wait, we didn't add the route for chapters list.
    // Let's modify the backend or just use the same detail route?
    // Wait, let's just make the backend do it all.
    // Actually I should create `/api/komikcast/chapters/:slug` in backend.
    
    // Using a fake route for now, I need to update backend index.js
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}/chapters`, {
        params: { order, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Komikcast Error:', error);
      throw new Error('Gagal memuat chapter dari Komikcast.');
    }
  },

  getChapterPages: async (chapterId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      console.error('Komikcast Error:', error);
      throw new Error('Gagal memuat gambar chapter dari Komikcast.');
    }
  }
};
