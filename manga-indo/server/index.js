import express from 'express';
import cors from 'cors';
import axios from 'axios';
import komikcastScraper from './scrapers/komikcast.js';
import westmangaScraper from './scrapers/westmanga.js';
import doujinScraper from './scrapers/doujin.js';
import animeScraper from './scrapers/anime.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── MANGA: KOMIKCAST ────────────────────────────────────────────────
app.get('/api/komikcast/latest', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await komikcastScraper.getLatest(page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/komikcast/search', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await komikcastScraper.search(req.query.q || '', page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/komikcast/manga/:slug', async (req, res) => {
  try { res.json(await komikcastScraper.getDetail(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/komikcast/manga/:slug/chapters', async (req, res) => {
  try {
    const { order = 'desc', limit = 100, offset = 0 } = req.query;
    res.json(await komikcastScraper.getMangaChapters(req.params.slug, order, parseInt(limit), parseInt(offset)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/komikcast/chapter/:slug', async (req, res) => {
  try { res.json(await komikcastScraper.getChapterPages(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── MANGA: WESTMANGA ────────────────────────────────────────────────
app.get('/api/westmanga/latest', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await westmangaScraper.getLatest(page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/westmanga/search', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await westmangaScraper.search(req.query.q || '', page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/westmanga/manga/:slug', async (req, res) => {
  try { res.json(await westmangaScraper.getDetail(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/westmanga/manga/:slug/chapters', async (req, res) => {
  try {
    const { order = 'desc', limit = 100, offset = 0 } = req.query;
    res.json(await westmangaScraper.getMangaChapters(req.params.slug, order, parseInt(limit), parseInt(offset)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/westmanga/chapter/:slug', async (req, res) => {
  try { res.json(await westmangaScraper.getChapterPages(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── MANGA: DOUJINDESU (SECRET SOURCE) ──────────────────────────────
app.get('/api/doujin/latest', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await doujinScraper.getLatest(page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/doujin/search', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 20) + 1;
    res.json(await doujinScraper.search(req.query.q || '', page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/doujin/manga/:slug', async (req, res) => {
  try { res.json(await doujinScraper.getDetail(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/doujin/manga/:slug/chapters', async (req, res) => {
  try {
    const { order = 'desc', limit = 100, offset = 0 } = req.query;
    res.json(await doujinScraper.getMangaChapters(req.params.slug, order, parseInt(limit), parseInt(offset)));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/doujin/chapter/:slug', async (req, res) => {
  try {
    const pages = await doujinScraper.getChapterPages(req.params.slug);
    const proxied = pages.map(p => `http://localhost:3001/api/image-proxy?url=${encodeURIComponent(p)}`);
    res.json(proxied);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/image-proxy', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('Missing url parameter');
  
  try {
    const response = await axios.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://doujindesu.tv/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      responseType: 'stream',
      timeout: 20000
    });
    
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    response.data.pipe(res);
  } catch (err) {
    console.error('Image proxy error:', err.message);
    res.status(500).send('Failed to fetch image: ' + err.message);
  }
});

// ─── ANIME: OTAKUDESU SCRAPER ────────────────────────────────────────
app.get('/api/anime/latest', async (req, res) => {
  try {
    const page = Math.floor((parseInt(req.query.offset) || 0) / 24) + 1;
    res.json(await animeScraper.getLatestAnime(page));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/anime/search', async (req, res) => {
  try {
    res.json(await animeScraper.searchAnime(req.query.q || ''));
  } catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/anime/:slug', async (req, res) => {
  try { res.json(await animeScraper.getAnimeDetail(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.get('/api/anime/episode/:slug', async (req, res) => {
  try { res.json(await animeScraper.getEpisodeStreams(req.params.slug)); }
  catch (e) { res.status(500).json({ error: e.message }); }
});
app.post('/api/anime/resolve-stream', async (req, res) => {
  try {
    const { episodeSlug, payload } = req.body;
    if (!episodeSlug || !payload) {
      return res.status(400).json({ error: 'Missing episodeSlug or payload' });
    }
    const resolvedUrl = await animeScraper.resolveMirrorStream(episodeSlug, payload);
    res.json({ embedUrl: resolvedUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── YOUTUBE DYNAMIC SEARCH FALLBACK SCRAPER ──────────────────────────
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter q' });
    }
    
    console.log(`[YouTube Scraper] Searching: "${query}"`);
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 10000
    });

    const html = response.data;
    // Extract video ID using regex that matches the standard YouTube video watch links
    const matches = html.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/g);
    
    if (matches && matches.length > 0) {
      // Get the first unique match to avoid double selections
      const uniqueIds = [...new Set(matches.map(m => m.split('v=')[1]))];
      // Filter out standard non-video IDs if any (length should be exactly 11)
      const validId = uniqueIds.find(id => id && id.length === 11);
      
      if (validId) {
        console.log(`[YouTube Scraper] Resolved top result: ${validId}`);
        return res.json({
          videoId: validId,
          embedUrl: `https://www.youtube.com/embed/${validId}?autoplay=1&rel=0`
        });
      }
    }
    
    throw new Error('No YouTube videos resolved for this query');
  } catch (error) {
    console.error('YouTube Search Scraper failed:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Export app for Vercel Serverless
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 KuroStream Backend running on http://localhost:${PORT}`);
  });
}
