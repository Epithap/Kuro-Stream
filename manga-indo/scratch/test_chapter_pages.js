import axios from 'axios';
import * as cheerio from 'cheerio';

async function testChapterPages() {
  const url = 'https://komikcast.life/my-avatar-is-becoming-the-final-boss-remake-chapter-8-bahasa-indonesia/';
  try {
    console.log('Fetching chapter page...');
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    
    console.log('--- Checking readerarea and chapter_imgs ---');
    console.log('Total images inside #readerarea:', $('#readerarea img').length);
    console.log('Total images inside #chapter_imgs:', $('#chapter_imgs img').length);
    console.log('Total images inside .main-reading-area:', $('.main-reading-area img').length);
    
    console.log('\n--- Printing first 5 images inside #readerarea ---');
    $('#readerarea img').slice(0, 5).each((i, el) => {
      console.log(`Image #${i}: src="${$(el).attr('src')}" data-src="${$(el).attr('data-src')}"`);
    });

    console.log('\n--- Printing first 5 images inside other matched elements ---');
    $('#chapter_imgs img, .main-reading-area img').slice(0, 5).each((i, el) => {
      console.log(`Image #${i}: src="${$(el).attr('src')}" data-src="${$(el).attr('data-src')}"`);
    });
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testChapterPages();
