import komikcastScraper from '../server/scrapers/komikcast.js';

async function run() {
  try {
    console.log('Testing komikcastScraper.getLatest()...');
    const result = await komikcastScraper.getLatest(1);
    console.log('Success! Items found:', result.data.length);
    console.log(result.data.slice(0, 2));
  } catch (e) {
    console.error('Scraper failed:', e.message);
    if (e.stack) console.error(e.stack);
  }
}

run();
