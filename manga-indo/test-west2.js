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
    'User-Agent': 'Mozilla/5.0',
    'Accept': 'application/json'
  };

  try {
    const response = await axios({ method, url, headers, params });
    return response.data;
  } catch(e) {
    return { error: e.message };
  }
}

async function run() {
  const queries = [
    { hot: true },
    { hot: 1 },
    { filter: 'hot' },
    { filter: 'popular' },
    { is_project: true }
  ];
  
  for (const q of queries) {
    console.log('Testing /api/contents', q);
    const res = await request('GET', '/api/contents', q);
    console.log(res.data?.map(x=>x.title).slice(0, 3));
  }
}
run();
