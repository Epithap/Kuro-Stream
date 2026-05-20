import axios from 'axios';
import * as cheerio from 'cheerio';

async function testChapters() {
  const url = 'https://komikcast.life/manga/my-avatar-is-becoming-the-final-boss-remake/';
  try {
    console.log('Fetching details page...');
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    console.log('--- Printing parsed chapter items ---');
    $('.komik_info-chapters-item').each((i, el) => {
      const title = $(el).find('.chapter-link-item').text().trim() || $(el).find('a').text().trim();
      const href = $(el).find('.chapter-link-item').attr('href') || $(el).find('a').attr('href');
      console.log(`Chapter #${i}: Title: "${title}" | Href: "${href}"`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testChapters();
