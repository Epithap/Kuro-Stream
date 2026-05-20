import axios from 'axios';
import * as cheerio from 'cheerio';

async function check(domain) {
  try {
    const url = `https://${domain}/`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    console.log(`\n=== ${domain} ===`);
    console.log("HTML length:", res.data.length);
    
    // Check for ongoing list classes
    const ongoing = $('.venz ul li').length;
    console.log("Number of '.venz ul li' elements (ongoing anime list):", ongoing);
    
    // Print first few list items
    $('.venz ul li').slice(0, 3).each((i, el) => {
      console.log(`Item ${i+1}:`, $(el).find('.jdlflm, .ani-titr').text().trim(), 'Link:', $(el).find('a').attr('href'));
    });
    
    // Let's also check for complete anime or recent updates
    console.log("Has '.venz':", $('.venz').length > 0);
  } catch (err) {
    console.log(`[FAILED] ${domain} - Error: ${err.message}`);
  }
}

async function run() {
  await check('otakudesu.io');
  await check('otakudesu.blog');
}
run();
