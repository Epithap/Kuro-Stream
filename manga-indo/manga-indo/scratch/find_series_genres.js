import * as cheerio from 'cheerio';
import fs from 'fs';

function findSeriesGenres() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing divs containing tags ---');
  $('div, span, p').each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    const className = $(el).attr('class') || '';
    if (className.includes('genre') || className.includes('tag')) {
      console.log(`Tag: ${el.tagName}, Class: "${className}", Text length: ${text.length}`);
      if (text.length < 300) console.log('  Text:', text);
    }
  });
}

findSeriesGenres();
