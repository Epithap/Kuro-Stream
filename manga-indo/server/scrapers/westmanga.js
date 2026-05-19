import axios from 'axios';
import CryptoJS from 'crypto-js';
import dns from 'dns';
import https from 'https';

// Custom DNS resolver to bypass ISP blocks
const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const customLookup = (hostname, options, callback) => {
  const cb = typeof options === 'function' ? options : callback;
  const opt = typeof options === 'object' ? options : {};
  resolver.resolve4(hostname)
    .then(addresses => {
      if (addresses && addresses.length > 0) {
        if (opt.all) {
          cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
        } else {
          cb(null, addresses[0], 4);
        }
      } else {
        dns.lookup(hostname, opt, cb);
      }
    })
    .catch(() => dns.lookup(hostname, opt, cb));
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

const API_BASE = 'https://data.mantweh.online';
const ACCESS_KEY = 'WM_WEB_FRONT_END';
const SALT = 'xxxoidj';
const HMAC_KEY = 'wm-api-request';

// Generate HMAC signature required by the API
function generateSignature(method, pathname, timestamp) {
  // Formula: timestamp + method + pathname + accessKey + salt
  const sigMessage = timestamp + method.toUpperCase() + pathname + ACCESS_KEY + SALT;
  return CryptoJS.HmacSHA256(HMAC_KEY, sigMessage).toString(CryptoJS.enc.Hex);
}

// REST request wrapper
async function request(method, pathname, params = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(method, pathname, timestamp);
  
  const url = `${API_BASE}${pathname}`;
  const headers = {
    'x-wm-accses-key': ACCESS_KEY,
    'x-wm-request-time': timestamp,
    'x-wm-request-signature': signature,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://westmanga.co',
    'Referer': 'https://westmanga.co/'
  };

  const response = await api({
    method,
    url,
    headers,
    params
  });
  return response.data;
}

const westmangaScraper = {
  // Daftar manga terbaru (update terbaru).
  getTrendingManga: async (page = 1) => {
    return await westmangaScraper.getLatest(page);
  },

  // Mengambil update terbaru
  getLatest: async (page = 1) => {
    try {
      const response = await request('GET', '/api/contents', { page, per_page: 20 });
      const items = response.data || [];
      const mangas = items.map(item => ({
        id: item.slug,
        title: item.title,
        synopsis: `Tipe: ${item.country_id || 'Manga'} - Chapter ${item.lastChapters?.[0]?.number || ''}`,
        coverUrl: item.cover,
        highResCoverUrl: item.cover,
        status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
        tags: [item.country_id].filter(Boolean)
      }));
      return { data: mangas, total: mangas.length, offset: (page - 1) * 20 };
    } catch (e) {
      throw new Error(`WestManga getLatest Error: ${e.message}`);
    }
  },

  // Pencarian manga
  search: async (query, page = 1) => {
    try {
      const response = await request('GET', '/api/contents', { q: query, page, per_page: 20 });
      const items = response.data || [];
      const mangas = items.map(item => ({
        id: item.slug,
        title: item.title,
        synopsis: `Tipe: ${item.country_id || 'Manga'} - Chapter ${item.lastChapters?.[0]?.number || ''}`,
        coverUrl: item.cover,
        highResCoverUrl: item.cover,
        status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
        tags: [item.country_id].filter(Boolean)
      }));
      return { data: mangas, total: mangas.length, offset: (page - 1) * 20 };
    } catch (e) {
      throw new Error(`WestManga search Error: ${e.message}`);
    }
  },

  // Mendapatkan detail manga
  getDetail: async slug => {
    try {
      const response = await request('GET', `/api/comic/${slug}`);
      const item = response.data;
      if (!item) throw new Error('Manga data not found in response');
      
      const genres = item.genres?.map(g => g.name) || [];
      return {
        id: item.slug,
        title: item.title,
        coverUrl: item.cover,
        highResCoverUrl: item.cover,
        synopsis: item.sinopsis || '',
        status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
        tags: genres
      };
    } catch (e) {
      throw new Error(`WestManga detail Error: ${e.message}`);
    }
  },

  // Mendapatkan daftar chapter untuk sebuah manga
  getMangaChapters: async (slug, order = 'desc', limit = 100, offset = 0) => {
    try {
      const response = await request('GET', `/api/comic/${slug}`);
      const item = response.data;
      if (!item || !item.chapters) {
        return { data: [], total: 0, offset };
      }
      
      const chapters = item.chapters.map(ch => ({
        id: ch.slug,
        chapter: ch.number,
        title: `Chapter ${ch.number}`,
        pages: 1,
        externalUrl: null
      }));

      if (order === 'asc') chapters.reverse();
      const paginated = chapters.slice(offset, offset + limit);
      return { data: paginated, total: chapters.length, offset };
    } catch (e) {
      throw new Error(`WestManga chapters Error: ${e.message}`);
    }
  },

  // Mendapatkan semua URL halaman gambar untuk sebuah chapter
  getChapterPages: async chapterSlug => {
    try {
      const response = await request('GET', `/api/v/${chapterSlug}`);
      const images = response.data?.images || [];
      return images;
    } catch (e) {
      throw new Error(`WestManga chapter pages Error: ${e.message}`);
    }
  },

  // Manga populer
  getPopular: async (page = 1) => {
    try {
      const response = await request('GET', '/api/contents', { page, per_page: 20, orderBy: 'total_views' });
      const items = response.data || [];
      const mangas = items.map(item => ({
        id: item.slug,
        title: item.title,
        synopsis: `Tipe: ${item.country_id || 'Manga'} - Chapter ${item.lastChapters?.[0]?.number || ''}`,
        coverUrl: item.cover,
        highResCoverUrl: item.cover,
        status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
        tags: [item.country_id].filter(Boolean)
      }));
      return { data: mangas, total: mangas.length, offset: (page - 1) * 20 };
    } catch (e) {
      throw new Error(`WestManga getPopular Error: ${e.message}`);
    }
  },

  // Mengambil semua manga
  getAllMangas: async (page = 1, accumulator = []) => {
    try {
      const response = await request('GET', '/api/contents', { page, per_page: 50 });
      const items = response.data || [];
      if (items.length === 0) {
        return { data: accumulator, total: accumulator.length, offset: 0 };
      }
      const mangas = items.map(item => ({
        id: item.slug,
        title: item.title,
        synopsis: `Tipe: ${item.country_id || 'Manga'} - Chapter ${item.lastChapters?.[0]?.number || ''}`,
        coverUrl: item.cover,
        highResCoverUrl: item.cover,
        status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
        tags: [item.country_id].filter(Boolean)
      }));
      
      // Stop recursion if accumulator becomes unreasonably large or we hit end
      if (accumulator.length > 500) {
        return { data: accumulator.concat(mangas), total: accumulator.length + mangas.length, offset: 0 };
      }
      
      return westmangaScraper.getAllMangas(page + 1, accumulator.concat(mangas));
    } catch (e) {
      throw new Error(`WestManga getAllMangas Error: ${e.message}`);
    }
  }
};

export default westmangaScraper;
