import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns';
import https from 'https';

// Custom DNS resolver pakai Google/Cloudflare buat bypass Internet Positif
const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const customLookup = async (hostname, options, callback) => {
  try {
    const addresses = await resolver.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      if (options && options.all) {
        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    } else {
      dns.lookup(hostname, options, callback);
    }
  } catch (err) {
    dns.lookup(hostname, options, callback);
  }
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
};

// Domain yang sering berganti, list prioritas
const OTAKUDESU_DOMAIN = 'otakudesu.blog';
const SAMEHADAKU_DOMAIN = 'samehadaku.mom';

const animeScraper = {
  
  // Otakudesu: Ambil latest/ongoing anime
  getLatestAnime: async (page = 1) => {
    const url = `https://${OTAKUDESU_DOMAIN}/ongoing-anime/page/${page}`;
    try {
      const response = await api.get(url, { headers: HEADERS });
      const $ = cheerio.load(response.data);
      const animes = [];

      $('.venz ul li').each((i, el) => {
        const title = $(el).find('.jdlflm').text().trim() || $(el).find('.ani-titr').text().trim();
        const href = $(el).find('a').attr('href') || '';
        const slug = href.replace(/https?:\/\/[^\/]+\/anime\//, '').replace(/\/$/, '') || href.split('/').filter(Boolean).pop();
        const cover = $(el).find('img').attr('src') || $(el).find('img').attr('data-src') || '';
        const ep = $(el).find('.epz').text().trim() || '';
        const status = $(el).find('.epz2').text().trim() || 'Ongoing';

        if (slug && title) {
          animes.push({ id: slug, title, coverUrl: cover, status, latestEp: ep });
        }
      });

      return { data: animes };
    } catch (error) {
      throw new Error(`Anime scraper error: ${error.message}`);
    }
  },

  // Otakudesu: Search anime  
  searchAnime: async (query, page = 1) => {
    const url = `https://${OTAKUDESU_DOMAIN}/?s=${encodeURIComponent(query)}&post_type=anime`;
    try {
      const response = await api.get(url, { headers: HEADERS });
      const $ = cheerio.load(response.data);
      const animes = [];

      $('.venz ul li, .chivsrc li').each((i, el) => {
        const title = $(el).find('.jdlflm, h2').text().trim();
        const href = $(el).find('a').attr('href') || '';
        const slug = href.replace(/https?:\/\/[^\/]+\/anime\//, '').replace(/\/$/, '') || href.split('/').filter(Boolean).pop();
        const cover = $(el).find('img').attr('src') || '';
        const genres = [];
        $(el).find('.genre a').each((_, g) => genres.push($(g).text().trim()));
        
        if (slug && title) {
          animes.push({ id: slug, title, coverUrl: cover, status: 'Unknown', tags: genres });
        }
      });
      return { data: animes };
    } catch (error) {
      throw new Error(`Anime search error: ${error.message}`);
    }
  },

  // Otakudesu: Detail anime + daftar episode
  getAnimeDetail: async (slug) => {
    const url = `https://${OTAKUDESU_DOMAIN}/anime/${slug}/`;
    try {
      const response = await api.get(url, { headers: HEADERS });
      const $ = cheerio.load(response.data);

      const title = $('.jdlrx h1').first().text().replace(/\s*Subtitle\s+Indonesia.*/i, '').trim() || 
                    $('.entry-title, h1.entry-title').first().text().trim();
      const cover = $('.fotoanime img').first().attr('src') || 
                    $('.thumb img').attr('src') || 
                    $('.entry-thumb img').attr('src') || '';
      const synopsis = $('.sinopc').text().trim() || $('.entry-content p').first().text().trim();
      
      let status = 'Unknown';
      let score = '';
      let year = '';
      let studios = [];
      const tags = [];
      
      $('.infozin p').each((_, el) => {
        const text = $(el).text();
        if (text.includes('Status')) {
          status = text.replace('Status', '').replace(':', '').trim();
        } else if (text.includes('Skor')) {
          score = text.replace('Skor', '').replace(':', '').trim();
        } else if (text.includes('Tanggal Rilis')) {
          year = text.replace('Tanggal Rilis', '').replace(':', '').trim().split(',').pop().trim();
        } else if (text.includes('Studio')) {
          studios = text.replace('Studio', '').replace(':', '').trim().split(',').map(s => s.trim());
        } else if (text.includes('Genre')) {
          $(el).find('a').each((_, a) => tags.push($(a).text().trim()));
        }
      });

      const episodes = [];
      $('.episodelist li, #episodelist li').each((i, el) => {
        const epUrl = $(el).find('a').attr('href') || '';
        if (!epUrl.includes('/episode/')) return;

        const epTitle = $(el).find('a').text().trim();
        const epSlug = epUrl.split('/').filter(Boolean).pop();
        const date = $(el).find('.zeebr').text().trim();
        
        if (epSlug) {
          const match = epTitle.match(/Episode\s+(\d+)/i);
          const epNum = match ? parseInt(match[1], 10) : null;
          episodes.unshift({ id: epSlug, title: epTitle, date, episode: epNum });
        }
      });

      return { 
        id: slug, 
        title, 
        coverUrl: cover, 
        synopsis, 
        status, 
        tags, 
        score, 
        year, 
        studios, 
        episodes 
      };
    } catch (error) {
      throw new Error(`Anime detail error: ${error.message}`);
    }
  },

  // Otakudesu: Ambil link streaming episode beserta pilihan kualitas & mirror
  getEpisodeStreams: async (episodeSlug) => {
    const url = `https://${OTAKUDESU_DOMAIN}/episode/${episodeSlug}/`;
    try {
      const response = await api.get(url, { headers: HEADERS });
      const $ = cheerio.load(response.data);

      // Ambil kualitas dan mirror
      const qualities = {};
      $('.mirrorstream ul').each((_, ul) => {
        const qClass = $(ul).attr('class') || '';
        const qName = qClass.replace('m', ''); // e.g. "360p", "480p", "720p"
        if (!qName) return;

        qualities[qName] = [];
        $(ul).find('li a').each((_, a) => {
          const name = $(a).text().trim();
          const payload = $(a).attr('data-content') || '';
          const isDefault = $(a).attr('data-default') === 'true';
          if (name && payload) {
            qualities[qName].push({ name, payload, isDefault });
          }
        });
      });

      // Cari iframe embed langsung (default)
      const iframeUrl = $('iframe').first().attr('src') || '';
      
      return { 
        embedUrl: iframeUrl, 
        episodeSlug,
        qualities
      };
    } catch (error) {
      throw new Error(`Stream error: ${error.message}`);
    }
  },

  // Otakudesu: Resolve mirror payload menjadi URL embed asli
  resolveMirrorStream: async (episodeSlug, payload) => {
    const url = `https://${OTAKUDESU_DOMAIN}/episode/${episodeSlug}/`;
    try {
      const response = await api.get(url, { headers: HEADERS });
      const $ = cheerio.load(response.data);
      
      // Parse action hashes
      let scriptText = '';
      $('script').each((_, el) => {
        const content = $(el).html();
        if (content.includes('mirrorstream a')) scriptText = content;
      });
      
      const hashes = scriptText.match(/[a-f0-9]{32}/g);
      if (!hashes || hashes.length < 2) {
        throw new Error('Failed to parse mirror stream action hashes');
      }
      const action2 = hashes[0];
      const action1 = hashes[1];
      
      // Get nonce via AJAX Action 1
      const nonceRes = await api.post(
        `https://${OTAKUDESU_DOMAIN}/wp-admin/admin-ajax.php`,
        new URLSearchParams({ action: action1 }).toString(),
        {
          headers: {
            ...HEADERS,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      const nonce = nonceRes.data.data;
      
      // Resolve embed via AJAX Action 2
      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
      const embedRes = await api.post(
        `https://${OTAKUDESU_DOMAIN}/wp-admin/admin-ajax.php`,
        new URLSearchParams({
          ...decodedPayload,
          nonce: nonce,
          action: action2
        }).toString(),
        {
          headers: {
            ...HEADERS,
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );
      
      if (embedRes.data && embedRes.data.data) {
        const htmlDecoded = Buffer.from(embedRes.data.data, 'base64').toString('utf-8');
        const $$ = cheerio.load(htmlDecoded);
        const iframeUrl = $$('iframe').attr('src') || '';
        return iframeUrl;
      }
      throw new Error('Failed to resolve mirror stream iframe');
    } catch (error) {
      throw new Error(`Resolve mirror error: ${error.message}`);
    }
  }
};

export default animeScraper;
