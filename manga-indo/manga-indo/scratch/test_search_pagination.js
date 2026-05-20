import axios from 'axios';
import * as cheerio from 'cheerio';

async function testQuery(query) {
  try {
    const url1 = `https://otakudesu.blog/?s=${encodeURIComponent(query)}&post_type=anime`;
    const res1 = await axios.get(url1, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $1 = cheerio.load(res1.data);
    console.log(`=== Page 1 for "${query}" ===`);
    console.log("Count:", $1('.chivsrc li').length);
    
    // Try URL format 1: /page/2/?s=...
    const url2_a = `https://otakudesu.blog/page/2/?s=${encodeURIComponent(query)}&post_type=anime`;
    const res2_a = await axios.get(url2_a, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }).catch(() => null);
    const $2_a = res2_a ? cheerio.load(res2_a.data) : null;
    console.log(`=== Page 2 (Format /page/2/...) ===`);
    console.log("Count:", $2_a ? $2_a('.chivsrc li').length : "FAILED HTTP REQUEST");

    // Try URL format 2: ?s=...&paged=2
    const url2_b = `https://otakudesu.blog/?s=${encodeURIComponent(query)}&post_type=anime&paged=2`;
    const res2_b = await axios.get(url2_b, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }).catch(() => null);
    const $2_b = res2_b ? cheerio.load(res2_b.data) : null;
    console.log(`=== Page 2 (Format &paged=2) ===`);
    console.log("Count:", $2_b ? $2_b('.chivsrc li').length : "FAILED HTTP REQUEST");
  } catch (e) {
    console.error(e.message);
  }
}
testQuery('sub');
