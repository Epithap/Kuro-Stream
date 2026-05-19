import westmangaScraper from '../server/scrapers/westmanga.js';

async function run() {
  try {
    console.log('Testing westmangaScraper.getLatest()...');
    const result = await westmangaScraper.getLatest(1);
    console.log('Success! Items found:', result.data.length);
    console.log(result.data.slice(0, 2));
  } catch (e) {
    console.error('Scraper failed:', e.message);
    if (e.stack) console.error(e.stack);
  }
}

run();
