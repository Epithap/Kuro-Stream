import axios from 'axios';

async function testApi() {
  try {
    const res = await axios.get('https://data.mantweh.online/api/contents/home-data', {
      headers: {
        'Origin': 'https://westmanga.co',
        'Referer': 'https://westmanga.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    const data = res.data.data;
    console.log('Keys in data:', Object.keys(data));
    console.log('Sample mirror_update:', data.mirror_update[0].title);
    console.log('Sample mirror_update slug:', data.mirror_update[0].slug);
    console.log('Sample mirror_update cover:', data.mirror_update[0].cover);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApi();
