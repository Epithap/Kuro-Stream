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

async function inspect() {
  const homeData = await request('GET', '/api/contents/home-data');
  console.log('\n=== Home Data Structure ===');
  console.log('Keys of homeData.data:', Object.keys(homeData.data || {}));
  
  if (homeData.data?.slider) {
    console.log('\nSlider sample:', homeData.data.slider.slice(0, 1));
  }
  if (homeData.data?.latest) {
    console.log('\nLatest sample:', homeData.data.latest.slice(0, 1));
  } else {
    // If it's not latest, let's find the updates or latest updates list field
    for (const key of Object.keys(homeData.data || {})) {
      if (Array.isArray(homeData.data[key])) {
        console.log(`\nArray field "${key}" sample:`, homeData.data[key].slice(0, 1));
      }
    }
  }

  // Inspect detail data
  const detailData = await request('GET', '/api/comic/martial-peak');
  console.log('\n=== Detail Data Structure ===');
  console.log('Detail keys:', Object.keys(detailData.data || {}));
  console.log('Detail data (excluding chapters):', {
    ...detailData.data,
    chapters: undefined
  });
  console.log('Chapters sample (first 2):', detailData.data?.chapters?.slice(0, 2));

  // Inspect filter/search data
  const searchData = await request('GET', '/api/contents', { q: 'Martial' });
  console.log('\n=== Search Data Structure ===');
  console.log('Search keys:', Object.keys(searchData.data || {}));
  if (searchData.data?.data) {
    console.log('Search data.data sample (first item):', searchData.data.data.slice(0, 1));
  } else {
    console.log('Search data sample:', searchData.data?.slice?.(0, 1));
  }
}

inspect();
