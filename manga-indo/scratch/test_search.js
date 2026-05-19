import axios from 'axios';
import fs from 'fs';

async function testSearch() {
  const url = 'https://otakudesu.blog/?s=one+piece&post_type=anime';
  try {
    console.log('Searching on otakudesu.blog...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      },
      timeout: 10000
    });
    console.log('Status:', response.status);
    fs.writeFileSync('scratch/search.html', response.data);
    console.log('Saved to scratch/search.html');
  } catch (err) {
    console.error('Search failed:', err.message);
  }
}

testSearch();
