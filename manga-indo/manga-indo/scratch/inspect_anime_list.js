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
    
    // Check main container
    console.log("=== MAIN CONTAINERS ===");
    $('#venz, .venz, #daftarkartun, .daftarkartun, #abdaft, .abdaft, #a-z, .a-z, .bariskartun').each((i, el) => {
      console.log(`Container ${i+1}: class: ${$(el).attr('class')}, id: ${$(el).attr('id')}`);
    });
    
    // Find all links inside the main area
    console.log("\n=== CHECKING SPECIFIC SELECTORS ===");
    const selectors = [
      '.daftarkartun a',
      '.bariskartun a',
      '.abdaft a',
      '#daftarkartun a',
      '#abdaft a',
      '.venser a',
      '.venz a'
    ];
    for (const sel of selectors) {
      console.log(`Selector "${sel}" count:`, $(sel).length);
      if ($(sel).length > 0) {
        console.log("  Sample:", $(sel).first().text().trim(), "->", $(sel).first().attr('href'));
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}
run();
