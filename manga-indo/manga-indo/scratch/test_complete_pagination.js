import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const url = 'https://otakudesu.blog/complete-anime/page/2/';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    console.log("=== COMPLETE ANIME PAGE 2 ===");
    console.log("Found .venz ul li:", $('.venz ul li').length);
    $('.venz ul li').slice(0, 3).each((i, el) => {
      console.log(`Item ${i+1}:`, $(el).find('.jdlflm, .ani-titr').text().trim());
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
