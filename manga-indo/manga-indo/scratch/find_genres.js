import * as cheerio from 'cheerio';
import fs from 'fs';

function findGenresHTML() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);
  
  console.log('--- Printing items with rel=\"tag\" ---');
  $('a[rel="tag"]').each((i, el) => {
    console.log(`Tag #${i}: Text: "${$(el).text().trim()}" | Href: "${$(el).attr('href')}"`);
  });
  
  console.log('\n--- Printing items inside .genres or .seriestext ---');
  $('.genres, .seriestext, .genre-info, .komik_info-content-genre').each((i, el) => {
    console.log($(el).html());
  });
}

findGenresHTML();
