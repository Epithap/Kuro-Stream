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

const httpsAgent = process.env.VERCEL ? undefined : new https.Agent({ lookup: customLookup });
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

  // Cache for popular manga to avoid slow multiple search requests
  _popularCache: {
    data: null,
    lastFetch: 0
  },

  // Manga populer
  getPopular: async (page = 1) => {
    // Westmanga's API doesn't have a working popular endpoint (returns latest).
    // So we fetch popular titles from Komikcast and map them to Westmanga!
    
    // Check cache (valid for 1 hour)
    if (page === 1 && westmangaScraper._popularCache.data && (Date.now() - westmangaScraper._popularCache.lastFetch < 3600000)) {
      return { data: westmangaScraper._popularCache.data, total: westmangaScraper._popularCache.data.length, offset: 0 };
    }

    try {
      // 1. Scrape popular titles from Komikcast (which has a reliable popular week widget)
      const komikcastRes = await axios.get('https://komikcast.life/', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        },
        timeout: 10000
      });
      
      const popularTitles = [];
      const html = komikcastRes.data;
      // Extract titles using regex to avoid heavy cheerio parsing if possible, or just simple match
      // Komikcast popular weekly usually is in .serieslist ul li .leftseries h2 a
      const regex = /<div class="leftseries">[\s\S]*?<h2[^>]*><a[^>]*>(.*?)<\/a><\/h2>/gi;
      let match;
      while ((match = regex.exec(html)) !== null && popularTitles.length < 10) {
        const title = match[1].trim();
        if (title && !popularTitles.includes(title)) {
          popularTitles.push(title);
        }
      }
      
      // Fallback if regex fails
      if (popularTitles.length === 0) {
        popularTitles.push('One Piece', 'Jujutsu Kaisen', 'Solo Leveling', 'Black Clover', 'Magic Emperor', 'Mercenary Enrollment', 'Eleceed');
      }

      // 2. Search Westmanga for these titles
      const results = [];
      for (const title of popularTitles.slice(0, 10)) {
        try {
          const searchRes = await request('GET', '/api/contents', { q: title, page: 1, per_page: 5 });
          const items = searchRes.data || [];
          if (items.length > 0) {
            // Find best match or just take first
            const item = items[0];
            // Only add if not already in list
            if (!results.find(r => r.id === item.slug)) {
              results.push({
                id: item.slug,
                title: item.title,
                synopsis: `Tipe: ${item.country_id || 'Manga'} - Chapter ${item.lastChapters?.[0]?.number || ''}`,
                coverUrl: item.cover,
                highResCoverUrl: item.cover,
                status: item.status === 'ongoing' ? 'Ongoing' : 'Completed',
                tags: [item.country_id].filter(Boolean)
              });
            }
          }
        } catch (e) {
          // Skip on error
        }
      }

      // 3. Cache and return
      if (results.length > 0) {
        westmangaScraper._popularCache = {
          data: results,
          lastFetch: Date.now()
        };
        return { data: results, total: results.length, offset: 0 };
      }
      
      // Fallback to latest if everything failed
      return await westmangaScraper.getLatest(page);
    } catch (e) {
      console.error(`WestManga getPopular Error: ${e.message}`);
      // Fallback to latest
      return await westmangaScraper.getLatest(page);
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
