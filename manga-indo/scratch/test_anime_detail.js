import axios from 'axios';

async function testDetail() {
  try {
    console.log('Querying Anime detail for "1piece-sub-indo"...');
    const res = await axios.get('http://localhost:3001/api/anime/1piece-sub-indo');
    console.log('API Status:', res.status);
    console.log('Response Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('API Error:', err.message, err.response ? err.response.data : '');
  }
}

testDetail();
