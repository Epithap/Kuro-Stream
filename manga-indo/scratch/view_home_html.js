import axios from 'axios';
import * as cheerio from 'cheerio';

async function run() {
  try {
    const res = await axios.get('https://otakudesu.blog/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    console.log("=== VENUTAMA CHILDS ===");
    $('.venutama').children().each((i, el) => {
      console.log(`Child ${i+1}: tag: ${el.tagName}, class: ${$(el).attr('class') || ''}, id: ${$(el).attr('id') || ''}`);
      const title = $(el).find('h2').first().text().trim() || $(el).find('h3').first().text().trim();
      console.log(`  Title: ${title}`);
    });
    
    console.log("\n=== SIDEBAR SECTION CHILDS ===");
    $('.sidebar .section').children().each((i, el) => {
      console.log(`Child ${i+1}: tag: ${el.tagName}, class: ${$(el).attr('class') || ''}, id: ${$(el).attr('id') || ''}`);
      const title = $(el).find('h2').first().text().trim() || $(el).find('h3').first().text().trim() || $(el).find('.wtitle').text().trim();
      console.log(`  Title: ${title}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}
run();
