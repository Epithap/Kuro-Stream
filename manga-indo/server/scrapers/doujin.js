import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-core';

const getBestImageFromSrcset = (srcset) => {
  if (!srcset || typeof srcset !== 'string') return null;
  const candidates = srcset.split(',').map(item => item.trim()).filter(Boolean);
  if (candidates.length === 0) return null;

  let best = null;
  candidates.forEach(item => {
    const [url, descriptor] = item.split(/\s+/);
    const value = descriptor ? parseInt(descriptor.replace(/[^0-9]/g, ''), 10) : 0;
    if (!best || value > best.value) {
      best = { url, value };
    }
  });

  return best?.url || null;
};

// Memory cache for resolved IPs
let tvIpCache = '104.26.8.62';
let netIpCache = '64.31.3.234';
let cacheTime = 0;

// Resolve DNS over HTTPS (DoH) to bypass transparent ISP DNS proxying
async function getIps() {
  const now = Date.now();
  if (now - cacheTime < 3600000) {
    return { tvIp: tvIpCache, netIp: netIpCache };
  }
  
  try {
    const resolveDoh = async (domain) => {
      const response = await axios.get(`https://cloudflare-dns.com/dns-query?name=${domain}&type=A`, {
        headers: { 'Accept': 'application/dns-json' },
        timeout: 5000
      });
      const answers = response.data.Answer;
      if (answers && answers.length > 0) {
        const aRecord = answers.find(ans => ans.type === 1);
        if (aRecord) return aRecord.data;
      }
      return null;
    };

    const tvIp = await resolveDoh('doujindesu.tv') || '104.26.8.62';
    const netIp = await resolveDoh('doujindesu.net') || '64.31.3.234';
    
    tvIpCache = tvIp;
    netIpCache = netIp;
    cacheTime = now;
    
    return { tvIp, netIp };
  } catch (err) {
    console.error('DoH resolution error, using fallbacks:', err.message);
    return { tvIp: tvIpCache, netIp: netIpCache };
  }
}

// Fetch Page HTML using Puppeteer headless with host-rules IP mapping and stealth settings
async function getPageHtml(url) {
  const { tvIp, netIp } = await getIps();
  console.log(`[Doujin Scraper] Fetching URL: ${url} (TV IP: ${tvIp}, NET IP: ${netIp})`);
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      `--host-rules=MAP doujindesu.tv ${tvIp}, MAP www.doujindesu.tv ${tvIp}, MAP doujindesu.net ${netIp}, MAP www.doujindesu.net ${netIp}, MAP ww1.doujindesu.net ${netIp}, MAP ww2.doujindesu.net ${netIp}`
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    });

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Let Joken challenge execute and set cookies/redirects
    await new Promise(r => setTimeout(r, 6000));
    
    const html = await page.content();
    return html;
  } finally {
    await browser.close();
  }
}

const BASE = 'https://doujindesu.tv';

const doujinScraper = {

  getLatest: async (page = 1) => {
    const url = page === 1 ? `${BASE}/manga/` : `${BASE}/manga/page/${page}/`;
    try {
      const html = await getPageHtml(url);
      const $ = cheerio.load(html);
      const items = [];
      const seen = new Set();

      $('.entries article, .listupd .bs, .bsx').each((_, el) => {
        const title = $(el).find('.tt, h2, h3').text().trim() || $(el).find('a').attr('title') || '';
        const href = $(el).find('a').first().attr('href') || '';
        const slug = href.replace('https://doujindesu.tv/manga/', '')
                         .replace('https://doujindesu.net/manga/', '')
                         .replace('/manga/', '')
                         .replace(/\/$/, '') || href.split('/').filter(Boolean).pop();
        const cover = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
        const rating = $(el).find('.numscore, .rating').text().trim();
        const status = $(el).find('.status').text().trim() || 'Unknown';

        if (slug && title && !seen.has(slug)) {
          seen.add(slug);
          items.push({
            id: slug,
            title,
            coverUrl: cover,
            highResCoverUrl: cover,
            status,
            synopsis: rating ? `Rating: ${rating}` : '',
            tags: ['Doujin']
          });
        }
      });
      return { data: items, total: 1000, offset: (page - 1) * 20 };
    } catch (error) {
      throw new Error(`Doujin scraper: ${error.message}`);
    }
  },

  search: async (query, page = 1) => {
    const url = page === 1 
      ? `${BASE}/?s=${encodeURIComponent(query)}`
      : `${BASE}/page/${page}/?s=${encodeURIComponent(query)}`;
    try {
      const html = await getPageHtml(url);
      const $ = cheerio.load(html);
      const items = [];
      const seen = new Set();

      $('.entries article, .listupd .bs, .bsx').each((_, el) => {
        const title = $(el).find('.tt, h2, h3').text().trim() || $(el).find('a').attr('title') || '';
        const href = $(el).find('a').first().attr('href') || '';
        const slug = href.replace('https://doujindesu.tv/manga/', '')
                         .replace('https://doujindesu.net/manga/', '')
                         .replace('/manga/', '')
                         .replace(/\/$/, '') || href.split('/').filter(Boolean).pop();
        const cover = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';

        if (slug && title && !seen.has(slug)) {
          seen.add(slug);
          items.push({ id: slug, title, coverUrl: cover, highResCoverUrl: cover, status: 'Unknown', tags: ['Doujin'] });
        }
      });
      return { data: items, total: 100, offset: (page - 1) * 20 };
    } catch (error) {
      throw new Error(`Doujin search: ${error.message}`);
    }
  },

  getDetail: async (slug) => {
    const url = `${BASE}/manga/${slug}/`;
    try {
      const html = await getPageHtml(url);
      const $ = cheerio.load(html);

      const title = $('.thumbnail-info .title, h1.title, h1.entry-title, h1.name, .infox h1').first().text().trim();
      const cover = $('.thumb img, .infox img, .thumbnail img').first().attr('src') || '';
      const synopsis = $('.summary__content p, .entry-content .pob p, .sinopsis p, .desc p').first().text().trim() || 'Tidak ada sinopsis.';
      const status = $('.status').first().text().replace('Status:', '').trim() || 'Unknown';
      const tags = [];
      $('.genre-info a, .mgen a, .tags a').each((_, el) => tags.push($(el).text().trim()));

      return { id: slug, title, coverUrl: cover, highResCoverUrl: cover, synopsis, status, tags };
    } catch (error) {
      throw new Error(`Doujin detail: ${error.message}`);
    }
  },

  getMangaChapters: async (slug, order = 'desc', limit = 100, offset = 0) => {
    const url = `${BASE}/manga/${slug}/`;
    try {
      const html = await getPageHtml(url);
      const $ = cheerio.load(html);
      let chapters = [];

      $('.chapter-list li, #chapterlist li, .cl li, .eps_lst li').each((_, el) => {
        const chTitle = $(el).find('a').text().trim();
        const chHref = $(el).find('a').attr('href') || '';
        const chSlug = chHref.split('/').filter(Boolean).pop();
        const chNum = chTitle.match(/([\d.]+)/)?.[1] || '?';
        const date = $(el).find('.chapterdate, .dt span').text().trim();

        if (chSlug) {
          chapters.push({ id: chSlug, chapter: chNum, title: chTitle, date, pages: 1, externalUrl: null });
        }
      });

      // Fallback for one-shot doujins that don't have separate chapter lists
      if (chapters.length === 0) {
        chapters.push({
          id: slug,
          chapter: '1',
          title: 'Chapter 1',
          date: 'Latest',
          pages: 1,
          externalUrl: null
        });
      }

      if (order === 'asc') chapters = chapters.reverse();
      return { data: chapters.slice(offset, offset + limit), total: chapters.length, offset };
    } catch (error) {
      throw new Error(`Doujin chapters: ${error.message}`);
    }
  },

  getChapterPages: async (chapterSlug) => {
    const url = `${BASE}/${chapterSlug}/`;
    try {
      const html = await getPageHtml(url);
      const $ = cheerio.load(html);
      const pages = [];

      $('img').each((_, el) => {
        const srcset = $(el).attr('data-srcset') || $(el).attr('srcset');
        const candidate = getBestImageFromSrcset(srcset);
        const src = candidate || $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
        if (src && (src.includes('desu.photos') || src.includes('/storage/uploads/'))) {
          pages.push(src);
        }
      });

      return pages;
    } catch (error) {
      throw new Error(`Doujin pages: ${error.message}`);
    }
  }
};

export default doujinScraper;

