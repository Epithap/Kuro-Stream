import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const res = await axios.get('https://otakudesu.blog/anime-list/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    console.log("Title of page:", $('title').text());
    
    // Find all links containing movie or movies
    console.log("\n=== LINKS CONTAINING MOVIE ===");
    $('a').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      if (text.toLowerCase().includes('movie') || href.toLowerCase().includes('movie')) {
        console.log(`${text} -> ${href}`);
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
