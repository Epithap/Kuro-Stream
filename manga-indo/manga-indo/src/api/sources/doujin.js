import axios from 'axios';

const BACKEND_URL = import.meta.env.PROD ? '/api/doujin' : 'http://localhost:3001/api/doujin';

export const doujinSource = {
  getTrendingManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/latest`, { params: { limit, offset } });
      return response.data;
    } catch (error) {
      throw new Error('Gagal memuat Doujindesu. Pastikan Backend Server berjalan (`npm run server`).');
    }
  },

  searchManga: async (title, limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/search`, { params: { q: title, limit, offset } });
      return response.data;
    } catch (error) {
      throw new Error('Gagal mencari di Doujindesu.');
    }
  },

  getMangaDetail: async (mangaId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      throw new Error('Gagal memuat detail Doujindesu.');
    }
  },

  getMangaChapters: async (mangaId, order = 'desc', limit = 100, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/manga/${mangaId}/chapters`, {
        params: { order, limit, offset }
      });
      return response.data;
    } catch (error) {
      throw new Error('Gagal memuat chapter Doujindesu.');
    }
  },

  getChapterPages: async (chapterId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      throw new Error('Gagal memuat gambar chapter Doujindesu.');
    }
  }
};
