import axios from 'axios';
import fs from 'fs';

async function fetchDetailHTML() {
  const url = 'https://komikcast.life/manga/my-avatar-is-becoming-the-final-boss-remake/';
  try {
    console.log('Fetching details page...');
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    fs.writeFileSync('scratch/komikcast_detail.html', res.data);
    console.log('Saved to scratch/komikcast_detail.html');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fetchDetailHTML();
