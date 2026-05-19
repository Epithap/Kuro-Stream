import westmangaScraper from '../server/scrapers/westmanga.js';

async function runTest() {
  console.log('--- TESTING WESTMANGA SCRAPER MODULE ---');
  try {
    console.log('Testing getLatest...');
    const latest = await westmangaScraper.getLatest(1);
    console.log(`Latest count: ${latest.data.length}`);
    console.log('Sample item:', latest.data[0]);

    console.log('\nTesting search for "Peak"...');
    const searchRes = await westmangaScraper.search('Peak', 1);
    console.log(`Search results count: ${searchRes.data.length}`);
    console.log('Sample item:', searchRes.data[0]);

    const slug = searchRes.data[0]?.id || 'martial-peak';
    console.log(`\nTesting getDetail for "${slug}"...`);
    const detail = await westmangaScraper.getDetail(slug);
    console.log('Detail Title:', detail.title);
    console.log('Detail Synopsis:', detail.synopsis?.substring(0, 100) + '...');

    console.log(`\nTesting getMangaChapters for "${slug}"...`);
    const chapters = await westmangaScraper.getMangaChapters(slug, 'desc', 5, 0);
    console.log(`Chapters count: ${chapters.total}`);
    console.log('Sample chapters:', chapters.data);

    const chapterSlug = chapters.data[0]?.id;
    if (chapterSlug) {
      console.log(`\nTesting getChapterPages for "${chapterSlug}"...`);
      const pages = await westmangaScraper.getChapterPages(chapterSlug);
      console.log(`Pages count: ${pages.length}`);
      console.log('First 2 pages:', pages.slice(0, 2));
    }
    
    console.log('\n--- ALL SCRAPER TESTS PASSED! ---');
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

runTest();
