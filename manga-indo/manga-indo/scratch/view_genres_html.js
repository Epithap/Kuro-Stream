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
    console.log("=== genre-list classes ===");
    // Print all lists inside the content area
    $('ul').each((i, el) => {
      const parentClass = $(el).parent().attr('class') || '';
      console.log(`ul ${i+1}: parent class: ${parentClass}, items count: ${$(el).find('li').length}`);
      if ($(el).find('li').length > 10) {
        // Print first 5 items
        $(el).find('li a').slice(0, 5).each((_, a) => {
          console.log(`  ${$(a).text().trim()} -> ${$(a).attr('href')}`);
        });
      }
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
