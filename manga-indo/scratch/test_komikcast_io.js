import axios from 'axios';
import fs from 'fs';

async function testKomikcastIO() {
  const url = 'https://komikcast.io/komik/?status=&type=&order=update';
  try {
    console.log('Fetching Komikcast list page from komikcast.io...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    console.log('Status:', response.status);
    fs.writeFileSync('scratch/komikcast_io.html', response.data);
    console.log('Saved to scratch/komikcast_io.html');
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

testKomikcastIO();
