import axios from 'axios';
import fs from 'fs';

async function testKomikcastList() {
  const url = 'https://v2.komikcast.fit/komik/?status=&type=&order=update';
  try {
    console.log('Fetching Komikcast list page...');
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    console.log('Status:', response.status);
    fs.writeFileSync('scratch/komikcast_list.html', response.data);
    console.log('Saved to scratch/komikcast_list.html');
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

testKomikcastList();
