import axios from 'axios';

async function testSearch() {
  try {
    console.log('Querying Anime search for "naruto"...');
    const res = await axios.get('http://localhost:3001/api/anime/search?q=naruto');
    console.log('API Status:', res.status);
    console.log('Results count:', res.data?.data?.length || 0);
    if (res.data?.data?.length > 0) {
      console.log('First result ID:', res.data.data[0].id);
      console.log('First result Title:', res.data.data[0].title);
      console.log('First result Cover:', res.data.data[0].coverUrl);
    }
  } catch (err) {
    console.error('API Error:', err.message, err.response ? err.response.data : '');
  }
}

testSearch();
