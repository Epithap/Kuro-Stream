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

  const response = await axios({
    method,
    url,
    headers,
    params
  });
  return response.data;
}

async function testParams() {
  const paramsList = [
    { page: 1, per_page: 5, sort: 'popular' },
    { page: 1, per_page: 5, sort_by: 'views' },
    { page: 1, per_page: 5, order: 'popular' },
    { page: 1, per_page: 5, type: 'popular' },
    { page: 1, per_page: 5, orderby: 'views' },
    { page: 1, per_page: 5, filter: 'popular' }
  ];

  const latest = await request('GET', '/api/contents', { page: 1, per_page: 1 });
  console.log('Latest:', latest.data[0].title);

  for (const params of paramsList) {
    try {
      const res = await request('GET', '/api/contents', params);
      const title = res.data[0]?.title;
      if (title && title !== latest.data[0].title) {
        console.log('Success with params:', params, 'Title:', title);
      } else {
        console.log('Same as latest for params:', params);
      }
    } catch (e) {
      console.log('Error with params:', params);
    }
  }
}

testParams().catch(console.error);
