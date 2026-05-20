import * as cheerio from 'cheerio';
import fs from 'fs';

function checkCoverAttrs() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);
  
  const img = $('.thumb img, .thumbook img').first();
  console.log('--- Printing all attributes of detail cover image ---');
  const attrs = img.attr();
  if (attrs) {
    Object.keys(attrs).forEach(k => {
      console.log(`${k}: "${attrs[k]}"`);
    });
  }
}

checkCoverAttrs();
