import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_BASE = 'https://data.mantweh.online';
const ACCESS_KEY = 'WM_WEB_FRONT_END';
const SALT = 'xxxoidj';
const HMAC_KEY = 'wm-api-request';

function generateSignature(method, pathname, timestamp) {
  const sigMessage = timestamp + method.toUpperCase() + pathname + ACCESS_KEY + SALT;
  return CryptoJS.HmacSHA256(HMAC_KEY, sigMessage).toString(CryptoJS.enc.Hex);
}

async function request(method, pathname, params = {}) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = generateSignature(method, pathname, timestamp);
  const response = await axios({
    method,
    url: `${API_BASE}${pathname}`,
    headers: {
      'x-wm-accses-key': ACCESS_KEY,
      'x-wm-request-time': timestamp,
      'x-wm-request-signature': signature,
      'Origin': 'https://westmanga.co',
      'Referer': 'https://westmanga.co/'
    },
    params
  });
  return response.data;
}

async function test() {
  try {
    // Test default contents call
    const res1 = await request('GET', '/api/contents', { page: 1, per_page: 5 });
    console.log('Default /api/contents item 0 title:', res1.data?.[0]?.title, 'updated_at:', res1.data?.[0]?.updated_at);
    
    // Test orderBy: 'updated_at'
    const res2 = await request('GET', '/api/contents', { page: 1, per_page: 5, orderBy: 'updated_at' });
    console.log('orderBy: updated_at item 0 title:', res2.data?.[0]?.title);
    
    // Test orderBy: 'total_views' (or popular)
    const res3 = await request('GET', '/api/contents', { page: 1, per_page: 5, orderBy: 'total_views' });
    console.log('orderBy: total_views item 0 title:', res3.data?.[0]?.title);

    // Test orderBy: 'rating'
    const res4 = await request('GET', '/api/contents', { page: 1, per_page: 5, orderBy: 'rating' });
    console.log('orderBy: rating item 0 title:', res4.data?.[0]?.title);
    
    // Test status: 'ongoing'
    const res5 = await request('GET', '/api/contents', { page: 1, per_page: 5, status: 'ongoing' });
    console.log('status: ongoing item 0 title:', res5.data?.[0]?.title);
  } catch (err) {
    console.error(err.message);
  }
}

test();
