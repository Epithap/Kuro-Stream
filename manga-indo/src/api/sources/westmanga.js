import axios from 'axios';

const BACKEND_URL = 'http://localhost:3001/api/westmanga';

export const westmangaSource = {
  getTrendingManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/latest`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat dari WestManga (Server Lokal mungkin mati).');
    }
  },

  searchManga: async (title, limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/search`, {
        params: { q: title, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal mencari di WestManga.');
    }
  },

  getMangaDetail: async (mangaId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat detail dari WestManga.');
    }
  },

  getMangaChapters: async (mangaId, order = 'desc', limit = 100, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}/chapters`, {
        params: { order, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat chapter dari WestManga.');
    }
  },

  getChapterPages: async (chapterId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat gambar chapter dari WestManga.');
    }
  }
};
