import * as cheerio from 'cheerio';
import fs from 'fs';

function inspectDetail() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing main content tags / classes ---');
  $('*').each((i, el) => {
    const className = $(el).attr('class');
    const idName = $(el).attr('id');
    if (className && (className.includes('komik_info') || className.includes('detail') || className.includes('chapter') || className.includes('sinopsis') || className.includes('thumb') || className.includes('epxs'))) {
      console.log(`Tag: ${el.tagName}, Class: ${className}, ID: ${idName}`);
    }
  });

  console.log('\n--- Printing all headings ---');
  $('h1, h2, h3, h4').each((i, el) => {
    console.log(`Heading ${el.tagName}: "${$(el).text().trim()}"`);
  });

  console.log('\n--- Printing first 20 list items ---');
  $('ul li, div.cl, ul.cl').slice(0, 30).each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ').substring(0, 100);
    const link = $(el).find('a').attr('href') || '';
    console.log(`Item #${i}: Tag: ${el.tagName}, Class: "${$(el).attr('class')}", Text: "${text}" | Link: "${link}"`);
  });
}

inspectDetail();
