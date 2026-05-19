import komikcastScraper from './komikcast.js';

const westmangaScraper = {
  getLatest: async (page = 1) => {
    try {
      return await komikcastScraper.getLatest(page);
    } catch (error) {
      throw new Error(`WestManga getLatest Proxy Error: ${error.message}`);
    }
  },

  search: async (query, page = 1) => {
    try {
      return await komikcastScraper.search(query, page);
    } catch (error) {
      throw new Error(`WestManga search Proxy Error: ${error.message}`);
    }
  },

  getDetail: async (slug) => {
    try {
      return await komikcastScraper.getDetail(slug);
    } catch (error) {
      throw new Error(`WestManga getDetail Proxy Error: ${error.message}`);
    }
  },

  getChapterPages: async (chapterSlug) => {
    try {
      return await komikcastScraper.getChapterPages(chapterSlug);
    } catch (error) {
      throw new Error(`WestManga getChapterPages Proxy Error: ${error.message}`);
    }
  }
};

westmangaScraper.getMangaChapters = async (slug, order = 'desc', limit = 100, offset = 0) => {
  try {
    return await komikcastScraper.getMangaChapters(slug, order, limit, offset);
  } catch (error) {
    throw new Error(`WestManga getMangaChapters Proxy Error: ${error.message}`);
  }
};

export default westmangaScraper;
