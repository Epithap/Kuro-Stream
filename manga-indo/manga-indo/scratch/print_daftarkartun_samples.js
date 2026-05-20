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
    const items = [];
    $('.daftarkartun a').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      items.push({ text, href });
    });
    
    console.log("Total items:", items.length);
    console.log("First 10 items:", items.slice(0, 10));
    console.log("Random 10 items in middle:", items.slice(Math.floor(items.length/2), Math.floor(items.length/2) + 10));
    console.log("Last 10 items:", items.slice(-10));
  } catch (e) {
    console.error(e.message);
  }
}
run();
