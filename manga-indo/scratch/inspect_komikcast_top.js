import * as cheerio from 'cheerio';
import fs from 'fs';

function inspectKomikcastTop() {
  const html = fs.readFileSync('scratch/komikcast_top.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing first 40 links on komikcast.top ---');
  $('a').each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const href = $(el).attr('href') || '';
    if (href.length > 1) {
      console.log(`Link #${i}: Text: "${text}" | Href: "${href}"`);
    }
  });
}

inspectKomikcastTop();
