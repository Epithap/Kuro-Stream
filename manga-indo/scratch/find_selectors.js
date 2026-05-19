import * as cheerio from 'cheerio';
import fs from 'fs';

function findSelectors() {
  const html = fs.readFileSync('scratch/komikcast_detail.html', 'utf-8');
  const $ = cheerio.load(html);

  console.log('Title:', $('h1').first().text().trim());
  console.log('Cover:', $('.thumb img').attr('src') || $('.thumbook img').attr('src'));
  
  console.log('\n--- Synopsis candidates ---');
  console.log('1. entry-content:', $('.entry-content').text().trim().substring(0, 100));
  console.log('2. sinopsis:', $('.sinopsis').text().trim().substring(0, 100));
  console.log('3. description:', $('.description').text().trim().substring(0, 100));
  console.log('4. paragraph under Sinopsis h3:', $('h3:contains("Sinopsis")').next('div, p').text().trim().substring(0, 100));
  
  console.log('\n--- Info candidates (Status, Author, Type) ---');
  $('.info-post, .infotable, .spe, .komik_info-content-info').find('span, td, tr').slice(0, 20).each((i, el) => {
    console.log(`Info #${i}:`, $(el).text().trim().replace(/\s+/g, ' '));
  });

  console.log('\n--- Genre candidates ---');
  $('.genres, .genre-info, .komik_info-content-genre, .seriestext').find('a').each((i, el) => {
    console.log(`Genre #${i}:`, $(el).text().trim());
  });

  console.log('\n--- Chapter candidates ---');
  console.log('Total list items inside #chapterlist:', $('#chapterlist ul li').length);
  $('#chapterlist ul li').slice(0, 5).each((i, el) => {
    const link = $(el).find('a');
    console.log(`Chapter #${i} (under #chapterlist): Text: "${link.text().trim()}" | Href: "${link.attr('href')}"`);
  });

  console.log('Total list items inside .cl:', $('.cl li').length);
  $('.cl li').slice(0, 5).each((i, el) => {
    const link = $(el).find('a');
    console.log(`Chapter #${i} (under .cl): Text: "${link.text().trim()}" | Href: "${link.attr('href')}"`);
  });
}

findSelectors();
