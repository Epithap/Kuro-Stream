import axios from 'axios';
import fs from 'fs';

async function testKomikcastTop() {
  const url = 'https://komikcast.top';
  try {
    console.log('Fetching Komikcast homepage from komikcast.top...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    console.log('Status:', response.status);
    fs.writeFileSync('scratch/komikcast_top.html', response.data);
    console.log('Saved to scratch/komikcast_top.html');
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

testKomikcastTop();
