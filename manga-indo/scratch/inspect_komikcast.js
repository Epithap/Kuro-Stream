import * as cheerio from 'cheerio';
import fs from 'fs';

function inspectKomikcast() {
  const html = fs.readFileSync('scratch/komikcast_list.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing classes of elements ---');
  $('*').each((i, el) => {
    const className = $(el).attr('class');
    if (className && (className.includes('listupd') || className.includes('komik') || className.includes('update') || className.includes('bsx') || className.includes('bs'))) {
      console.log(`Tag: ${el.tagName}, Class: ${className}`);
    }
  });

  console.log('\n--- Printing all anchors inside lists ---');
  $('a').slice(0, 40).each((i, el) => {
    const title = $(el).attr('title') || '';
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim().replace(/\s+/g, ' ');
    if (href.includes('/komik/') || title || text.includes('Chapter')) {
      console.log(`Anchor: Text: "${text}" | Title: "${title}" | Href: "${href}"`);
    }
  });
}

inspectKomikcast();
