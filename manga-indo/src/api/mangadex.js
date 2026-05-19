import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

// Helper for finding cover filename
const getCoverFileName = (relationships) => {
  const coverRel = relationships.find(rel => rel.type === 'cover_art');
  return coverRel ? coverRel.attributes?.fileName : null;
};

export const mangadex = {
  // Get trending/latest manga (with cover art)
  getTrendingManga: async (limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BASE_URL}/manga`, {
        params: {
          limit,
          offset,
          includes: ['cover_art', 'author'],
          order: { followedCount: 'desc' },
          contentRating: ['safe', 'suggestive'],
          availableTranslatedLanguage: ['id'], // Only manga with ID translation
          hasAvailableChapters: true
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending manga:', error);
      throw error;
    }
  },

  // Search manga by title
  searchManga: async (title, limit = 20, offset = 0) => {
    try {
      const response = await axios.get(`${BASE_URL}/manga`, {
        params: {
          title,
          limit,
          offset,
          includes: ['cover_art', 'author'],
          contentRating: ['safe', 'suggestive'],
          availableTranslatedLanguage: ['id'],
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching manga:', error);
      throw error;
    }
  },

  // Get manga details
  getMangaDetail: async (mangaId) => {
    try {
      const response = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
        params: {
          includes: ['cover_art', 'author', 'artist']
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching manga detail:', error);
      throw error;
    }
  },

  // Get chapters (filtered by Indonesian)
  getMangaChapters: async (mangaId, limit = 100, offset = 0) => {
    try {
      const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
        params: {
          limit,
          offset,
          translatedLanguage: ['id'], // Filter Indonesian Subtitle
          order: { chapter: 'desc' },
          includes: ['scanlation_group']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching manga chapters:', error);
      throw error;
    }
  },

  // Get chapter pages (images)
  getChapterPages: async (chapterId) => {
    try {
      const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
      const { baseUrl, chapter } = response.data;
      
      // Construct image URLs
      const pages = chapter.data.map(
        (filename) => `${baseUrl}/data/${chapter.hash}/${filename}`
      );
      
      return pages;
    } catch (error) {
      console.error('Error fetching chapter pages:', error);
      throw error;
    }
  },

  // Helper to get image URL for a cover
  getCoverUrl: (mangaId, fileName) => {
    if (!fileName) return 'https://via.placeholder.com/256x364?text=No+Cover';
    return `${UPLOADS_URL}/covers/${mangaId}/${fileName}.256.jpg`;
  },
  
  // Helper to get high-res image URL for cover
  getHighResCoverUrl: (mangaId, fileName) => {
    if (!fileName) return 'https://via.placeholder.com/512x728?text=No+Cover';
    return `${UPLOADS_URL}/covers/${mangaId}/${fileName}`;
  }
};
