import axios from 'axios';

import BACKEND_URL from '../../config/apiConfig';

export const westmangaSource = {
  getTrendingManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/westmanga/latest`, {
        params: { offset, limit }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat dari WestManga (Server Lokal mungkin mati).');
    }
  },

  // Popular manga (based on popular endpoint)
  getPopularManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/westmanga/popular`, {
        params: { offset, limit }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Popular Error:', error);
      throw new Error('Gagal memuat popular manga dari WestManga.');
    }
  },

  searchManga: async (title, limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/westmanga/search`, {
        params: { q: title, offset, limit }
      });
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal mencari di WestManga.');
    }
  },

  getMangaDetail: async (mangaId) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/westmanga/manga/${mangaId}`);
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat detail dari WestManga.');
    }
  },

  getMangaChapters: async (mangaId, order = 'desc', limit = 100, offset = 0) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/westmanga/manga/${mangaId}/chapters`, {
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
      const response = await axios.get(`${BACKEND_URL}/westmanga/chapter/${chapterId}`);
      return response.data;
    } catch (error) {
      console.error('WestManga Error:', error);
      throw new Error('Gagal memuat gambar chapter dari WestManga.');
    }
  }
};
