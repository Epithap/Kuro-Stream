import westmangaScraper from './server/scrapers/westmanga.js';
(async () => {
  try {
    const result = await westmangaScraper.getLatest(1);
    console.log('latest:', JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('Error:', e);
  }
})();
