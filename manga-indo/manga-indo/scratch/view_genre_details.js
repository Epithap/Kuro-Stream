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
    console.log("Title of page:", $('title').text());
    console.log("venser text:", $('.venser').text().replace(/\s+/g, ' ').substring(0, 1000));
    
    // Find all links inside .venser
    console.log("\n=== ALL LINKS INSIDE .venser ===");
    $('.venser a').each((i, el) => {
      console.log(`${$(el).text().trim()} -> ${$(el).attr('href')}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
