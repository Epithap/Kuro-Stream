import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE = 'https://data.mantweh.online';
const ACCESS_KEY = 'WM_WEB_FRONT_END';
const SALT = 'xxxoidj';
const HMAC_KEY = 'wm-api-request';

function generateSignature(method, pathname, timestamp) {
  // Signature key/message formula: timestamp + method + pathname + accessKey + salt
  const sigMessage = timestamp + method.toUpperCase() + pathname + ACCESS_KEY + SALT;
  const signature = CryptoJS.HmacSHA256(HMAC_KEY, sigMessage).toString(CryptoJS.enc.Hex);
  return signature;
}

async function request(method, pathname, params = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(method, pathname, timestamp);
  
  const url = `${API_BASE}${pathname}`;
  const headers = {
    'x-wm-accses-key': ACCESS_KEY,
    'x-wm-request-time': timestamp,
    'x-wm-request-signature': signature,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Origin': 'https://westmanga.co',
    'Referer': 'https://westmanga.co/'
  };

  console.log(`\n--- Requesting ${method} ${pathname} ---`);
  console.log('Headers:', {
    'x-wm-accses-key': headers['x-wm-accses-key'],
    'x-wm-request-time': headers['x-wm-request-time'],
    'x-wm-request-signature': headers['x-wm-request-signature']
  });

  try {
    const response = await axios({
      method,
      url,
      headers,
      params
    });
    console.log('Status:', response.status);
    return response.data;
  } catch (err) {
    console.error('Request Error:', err.response ? {
      status: err.response.status,
      data: err.response.data
    } : err.message);
    throw err;
  }
}

async function runTests() {
  try {
    // Test 1: Home Data
    const homeData = await request('GET', '/api/contents/home-data');
    console.log('Home Data Keys:', Object.keys(homeData));
    if (homeData.data) {
      console.log('Latest Updates sample:', homeData.data.latest?.slice(0, 2).map(m => ({
        title: m.title,
        slug: m.slug,
        last_chapter: m.last_chapter?.chapter_number
      })));
    }
    
    // Pick a slug to test details
    const sampleManga = homeData.data?.latest?.[0] || { slug: 'martial-peak' };
    const mangaSlug = sampleManga.slug;
    
    // Test 2: Manga Detail
    const detailData = await request('GET', `/api/comic/${mangaSlug}`);
    console.log('Detail Keys:', Object.keys(detailData));
    console.log('Title:', detailData.data?.title);
    console.log('Chapters count:', detailData.data?.chapters?.length);
    
    const sampleChapter = detailData.data?.chapters?.[0] || { slug: 'martial-peak-chapter-3690' };
    const chapterSlug = sampleChapter.slug;
    
    // Test 3: Chapter Reading Page
    const pageData = await request('GET', `/api/v/${chapterSlug}`);
    console.log('Page Data Keys:', Object.keys(pageData));
    console.log('Pages count:', pageData.data?.images?.length);
    console.log('First page sample:', pageData.data?.images?.[0]);
  } catch (e) {
    console.error('Test Flow Failed:', e.message);
  }
}

runTests();
