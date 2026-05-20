import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const res = await axios.get('https://otakudesu.blog/genre-list/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    console.log("=== GENRES ===");
    $('.genres li a').each((i, el) => {
      const name = $(el).text().trim();
      const href = $(el).attr('href');
      if (name.toLowerCase().includes('movie') || href.toLowerCase().includes('movie')) {
        console.log(`Match: ${name} -> ${href}`);
      }
    });
    
    // Also let's try calling search with 'movie'
    const res2 = await axios.get('https://otakudesu.blog/?s=movie&post_type=anime', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $2 = cheerio.load(res2.data);
    console.log("\n=== SEARCH 'movie' ===");
    console.log("Results count:", $2('.venz ul li').length);
    $2('.venz ul li').slice(0, 5).each((i, el) => {
      console.log($(el).find('.jdlflm, h2').text().trim(), '->', $(el).find('a').attr('href'));
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
