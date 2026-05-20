import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const query = 'Movie';
    const url = `https://otakudesu.blog/?s=${encodeURIComponent(query)}&post_type=anime`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    console.log("=== SEARCH RESULT FOR MOVIE ===");
    console.log("HTML length:", res.data.length);
    console.log("Found .chivsrc li:", $('.chivsrc li').length);
    
    $('.chivsrc li').slice(0, 5).each((i, el) => {
      console.log(`Item ${i+1}:`, $(el).find('h2').text().trim());
      console.log(`  Link:`, $(el).find('a').attr('href'));
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
