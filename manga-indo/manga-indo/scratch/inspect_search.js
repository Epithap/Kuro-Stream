import * as cheerio from 'cheerio';
import fs from 'fs';

function inspectSearch() {
  const html = fs.readFileSync('scratch/search.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing main content tags / classes ---');
  $('ul, div').each((i, el) => {
    const className = $(el).attr('class');
    const idName = $(el).attr('id');
    if (className || idName) {
      // Just print if it looks like search results
      if (className && (className.includes('search') || className.includes('chiv') || className.includes('venz') || className.includes('page'))) {
        console.log(`Tag: ${el.tagName}, Class: ${className}, ID: ${idName}`);
      }
    }
  });

  console.log('\n--- Printing all list items (li) inside ul ---');
  $('ul li').slice(0, 15).each((i, el) => {
    const text = $(el).text().trim().replace(/\s+/g, ' ').substring(0, 120);
    const link = $(el).find('a').attr('href') || '';
    const img = $(el).find('img').attr('src') || '';
    console.log(`LI #${i}: Text: "${text}" | Link: "${link}" | Img: "${img}"`);
  });
}

inspectSearch();
