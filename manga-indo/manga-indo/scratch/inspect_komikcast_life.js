import * as cheerio from 'cheerio';
import fs from 'fs';
import axios from 'axios';

async function inspectKomikcastLife() {
  try {
    const res = await axios.get('https://komikcast.life');
    const $ = cheerio.load(res.data);
    console.log('--- Printing first 50 links of komikcast.life ---');
    $('a').each((i, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (href.includes('komik') || href.includes('list') || href.includes('daftar') || href.includes('update')) {
        console.log(`Link #${i}: Text: "${text}" | Href: "${href}"`);
      }
    });
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

inspectKomikcastLife();
