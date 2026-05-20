import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns';
import https from 'https';

const dnsCache = {};

async function resolveDoh(hostname) {
  if (dnsCache[hostname]) return dnsCache[hostname];
  try {
    const response = await axios.get(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
      headers: { 'Accept': 'application/dns-json' },
      timeout: 5000
    });
    const answers = response.data?.Answer;
    if (answers && answers.length > 0) {
      const aRecords = answers.filter(ans => ans.type === 1).map(ans => ans.data);
      if (aRecords.length > 0) {
        dnsCache[hostname] = aRecords;
        return aRecords;
      }
    }
  } catch (err) {
    console.error(`[DNS DoH] Resolution failed for ${hostname}:`, err.message);
  }
  return null;
}

const customLookup = async (hostname, options, callback) => {
  const cb = typeof options === 'function' ? options : callback;
  const opt = typeof options === 'object' ? options : {};

  if (hostname === 'cloudflare-dns.com' || hostname === 'dns.google') {
    return dns.lookup(hostname, opt, cb);
  }

  try {
    const addresses = await resolveDoh(hostname);
    if (addresses && addresses.length > 0) {
      if (opt.all) {
        cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        cb(null, addresses[0], 4);
      }
    } else {
      dns.lookup(hostname, opt, cb);
    }
  } catch (err) {
    dns.lookup(hostname, opt, cb);
  }
};

const httpsAgent = process.env.VERCEL ? undefined : new https.Agent({ lookup: customLookup, rejectUnauthorized: false });

// Create an axios instance with the custom agent
const api = axios.create({ httpsAgent, timeout: 20000 });

// URL sering berubah, update jika perlu
const BASE_URL = 'https://komikcast.life';

const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
});

// Helper untuk mengekstrak slug dari URL Komikcast
const extractSlug = (url) => {
  if (!url) return '';
  const parts = url.split('/').filter(p => p.length > 0);
  return parts[parts.length - 1];
};

const komikcastScraper = {
  getLatest: async (page = 1) => {
    try {
      const url = page === 1 ? `${BASE_URL}/manga/?status=&type=&order=update` : `${BASE_URL}/manga/page/${page}/?status=&type=&order=update`;
      const response = await api.get(url, { headers: getHeaders() });
      const $ = cheerio.load(response.data);
      
      const mangas = [];
      const seen = new Set();
      $('.listupd .bs, .listupd .bsx, .list-update_item').each((i, el) => {
        const title = $(el).find('.tt, .title, h3').text().trim() || $(el).find('a').attr('title');
        const urlPath = $(el).find('a').attr('href');
        const slug = extractSlug(urlPath);
        const coverUrl = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
        const type = $(el).find('.type').text().trim();
        const chapter = $(el).find('.epxs, .chapter').text().trim();
        
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          mangas.push({
            id: slug,
            title,
            synopsis: `Tipe: ${type} - ${chapter}`,
            coverUrl,
            highResCoverUrl: coverUrl,
            status: 'Ongoing',
            tags: [type].filter(Boolean)
          });
        }
      });
      
      return { data: mangas, total: 1000, offset: (page - 1) * 20 }; // Fake total
    } catch (error) {
      throw new Error(`Scraper Error: ${error.message}`);
    }
  },

  search: async (query, page = 1) => {
    try {
      const url = page === 1 ? `${BASE_URL}/?s=${encodeURIComponent(query)}` : `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;
      const response = await api.get(url, { headers: getHeaders() });
      const $ = cheerio.load(response.data);
      
      const mangas = [];
      const seen = new Set();
      $('.listupd .bs, .listupd .bsx, .list-update_item').each((i, el) => {
        const title = $(el).find('.tt, .title, h3').text().trim() || $(el).find('a').attr('title');
        const urlPath = $(el).find('a').attr('href');
        const slug = extractSlug(urlPath);
        const coverUrl = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';
        const type = $(el).find('.type').text().trim();
        const chapter = $(el).find('.epxs, .chapter').text().trim();
        
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          mangas.push({
            id: slug,
            title,
            synopsis: `Tipe: ${type} - ${chapter}`,
            coverUrl,
            highResCoverUrl: coverUrl,
            status: 'Unknown',
            tags: [type].filter(Boolean)
          });
        }
      });
      
      return { data: mangas, total: 100, offset: (page - 1) * 20 };
    } catch (error) {
      throw new Error(`Scraper Error: ${error.message}`);
    }
  },

  getDetail: async (slug) => {
    try {
      const url = `${BASE_URL}/manga/${slug}/`;
      const response = await api.get(url, { headers: getHeaders() });
      const $ = cheerio.load(response.data);
      
      const title = $('h1').first().text().trim();
      const coverUrl = $('.thumb img, .thumbook img').attr('data-src') || $('.thumb img, .thumbook img').attr('src') || '';
      const synopsis = $('.entry-content').text().trim();
      const status = $('.imptdt:contains("Status") i').text().trim() || 'Unknown';
      
      const tags = [];
      $('.mgen a').each((i, el) => {
        tags.push($(el).text().trim());
      });

      return {
        id: slug,
        title,
        synopsis,
        coverUrl,
        highResCoverUrl: coverUrl,
        status,
        tags
      };
    } catch (error) {
      throw new Error(`Scraper Error: ${error.message}`);
    }
  },

  getChapterPages: async (chapterSlug) => {
    try {
      const url = `${BASE_URL}/${chapterSlug}/`;
      const response = await api.get(url, { headers: getHeaders() });
      const $ = cheerio.load(response.data);
      
      const pages = [];
      const seenUrls = new Set();
      $('#readerarea img, #chapter_imgs img, .main-reading-area img').each((i, el) => {
        let src = $(el).attr('data-src') || $(el).attr('src') || '';
        src = src.trim();
        if (src && !src.startsWith('data:image') && !seenUrls.has(src)) {
          seenUrls.add(src);
          pages.push(src);
        }
      });
      
      return pages;
    } catch (error) {
      throw new Error(`Scraper Error: ${error.message}`);
    }
  }
};

// Also add a chapter fetching method that is separated or part of detail
komikcastScraper.getMangaChapters = async (slug, order = 'desc', limit = 100, offset = 0) => {
  try {
    const url = `${BASE_URL}/manga/${slug}/`;
    const response = await api.get(url, { headers: getHeaders() });
    const $ = cheerio.load(response.data);
    
    let chapters = [];
    $('#chapterlist ul li, .komik_info-chapters-item').each((i, el) => {
      const chTitle = $(el).find('a').first().text().trim();
      const chUrl = $(el).find('a').first().attr('href');
      const chSlug = extractSlug(chUrl);
      
      // Parse chapter number
      const chNumMatch = chTitle.match(/Chapter\s*([\d\.]+)/i);
      const chNum = chNumMatch ? chNumMatch[1] : '?';
      
      if (chSlug) {
        chapters.push({
          id: chSlug, // for komikcast, id is the chapter slug
          chapter: chNum,
          title: chTitle,
          pages: 1, // dummy value to indicate it's not external
          externalUrl: null
        });
      }
    });

    if (order === 'asc') {
      chapters = chapters.reverse();
    }
    
    // Manual pagination since we get all chapters from the HTML at once
    const paginated = chapters.slice(offset, offset + limit);

    return {
      data: paginated,
      total: chapters.length,
      offset
    };
  } catch (error) {
    throw new Error(`Scraper Error: ${error.message}`);
  }
};

export default komikcastScraper;
