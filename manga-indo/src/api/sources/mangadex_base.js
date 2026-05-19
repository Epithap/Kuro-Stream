import axios from 'axios';

const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

export const createMangaDexSource = (langCode) => {
  return {
    getTrendingManga: async (limit = 20, offset = 0) => {
      const response = await axios.get(`${BASE_URL}/manga`, {
        params: {
          limit,
          offset,
          includes: ['cover_art', 'author'],
          order: { followedCount: 'desc' },
          contentRating: ['safe', 'suggestive'],
          availableTranslatedLanguage: [langCode],
          hasAvailableChapters: true
        }
      });
      return formatMangaResponse(response.data.data);
    },

    searchManga: async (title, limit = 20, offset = 0) => {
      const response = await axios.get(`${BASE_URL}/manga`, {
        params: {
          title,
          limit,
          offset,
          includes: ['cover_art', 'author'],
          contentRating: ['safe', 'suggestive'],
          availableTranslatedLanguage: [langCode],
        }
      });
      return formatMangaResponse(response.data.data);
    },

    getMangaDetail: async (mangaId) => {
      const response = await axios.get(`${BASE_URL}/manga/${mangaId}`, {
        params: {
          includes: ['cover_art', 'author', 'artist']
        }
      });
      return formatSingleManga(response.data.data);
    },

    getMangaChapters: async (mangaId, order = 'desc', limit = 100, offset = 0) => {
      const response = await axios.get(`${BASE_URL}/manga/${mangaId}/feed`, {
        params: {
          limit,
          offset,
          translatedLanguage: [langCode],
          order: { chapter: order }, // asc or desc
          includes: ['scanlation_group']
        }
      });
      
      return {
        data: response.data.data.map(ch => ({
          id: ch.id,
          chapter: ch.attributes.chapter,
          title: ch.attributes.title,
          pages: ch.attributes.pages,
          externalUrl: ch.attributes.externalUrl,
        })),
        total: response.data.total,
        offset: response.data.offset
      };
    },

    getChapterPages: async (chapterId) => {
      try {
        const response = await axios.get(`${BASE_URL}/at-home/server/${chapterId}`);
        const { baseUrl, chapter } = response.data;
        
        if (!chapter.data || chapter.data.length === 0) {
          throw new Error('Chapter eksternal atau kosong.');
        }

        return chapter.data.map(
          (filename) => `${baseUrl}/data/${chapter.hash}/${filename}`
        );
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error('Halaman tidak ditemukan. Mungkin telah dihapus oleh uploader.');
        }
        throw error;
      }
    }
  };
};

const formatMangaResponse = (mangaArray) => {
  return {
    data: mangaArray.map(formatSingleManga)
  };
};

const formatSingleManga = (manga) => {
  const title = manga.attributes.title.en || manga.attributes.title['ja-ro'] || Object.values(manga.attributes.title)[0] || 'Unknown';
  const synopsis = manga.attributes.description.en || manga.attributes.description.id || 'Tidak ada sinopsis.';
  const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverFileName = coverRel ? coverRel.attributes?.fileName : null;
  const tags = manga.attributes.tags.map(t => t.attributes.name.en).filter(Boolean);

  let coverUrl = 'https://via.placeholder.com/256x364?text=No+Cover';
  if (coverFileName) {
    coverUrl = `${UPLOADS_URL}/covers/${manga.id}/${coverFileName}.256.jpg`;
  }
  let highResCoverUrl = coverFileName ? `${UPLOADS_URL}/covers/${manga.id}/${coverFileName}` : coverUrl;

  return {
    id: manga.id,
    title,
    synopsis,
    coverUrl,
    highResCoverUrl,
    status: manga.attributes.status,
    tags
  };
};
