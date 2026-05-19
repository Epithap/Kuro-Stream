import fs from 'fs';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dns from 'dns';
import https from 'https';
import qs from 'qs';

const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const customLookup = async (hostname, options, callback) => {
  try {
    const addresses = await resolver.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      if (options && options.all) {
        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    } else {
      dns.lookup(hostname, options, callback);
    }
  } catch (err) {
    dns.lookup(hostname, options, callback);
  }
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Origin': 'https://otakudesu.blog',
  'Referer': 'https://otakudesu.blog/episode/btr-ng-episode-293-sub-indo/',
  'X-Requested-With': 'XMLHttpRequest'
};

const html = fs.readFileSync('scratch/episode.html', 'utf-8');
const $ = cheerio.load(html);

let scriptText = '';
$('script').each((_, el) => {
  const content = $(el).html();
  if (content.includes('mirrorstream a')) {
    scriptText = content;
  }
});

if (!scriptText) {
  console.error('Could not find mirrorstream script!');
  process.exit(1);
}

// Extract MD5 hashes (32 hex characters)
const hashes = scriptText.match(/[a-f0-9]{32}/g);
console.log('Found hashes in script:', hashes);

if (!hashes || hashes.length < 2) {
  console.error('Could not find enough action hashes!');
  process.exit(1);
}

// Action 1 (nonce): the one inside {action: "..."}
// Action 2 (embed): the one in {...e, action: "..."}
const action2 = hashes[0];
const action1 = hashes[1];

console.log('Action 1 (Nonce):', action1);
console.log('Action 2 (Embed):', action2);

async function resolveMirror() {
  try {
    // 1. Get the nonce
    console.log('\n--- 1. Getting Nonce ---');
    const nonceRes = await api.post(
      'https://otakudesu.blog/wp-admin/admin-ajax.php',
      qs.stringify({ action: action1 }),
      { headers: HEADERS }
    );
    const nonce = nonceRes.data.data;
    console.log('Received Nonce:', nonce);

    // 2. Decode one mirror (say, 480p updesu)
    const contentEncoded = 'eyJpZCI6MTM4MzY2LCJpIjowLCJxIjoiNDgwcCJ9'; // {"id":138366,"i":0,"q":"480p"}
    const payload = JSON.parse(Buffer.from(contentEncoded, 'base64').toString('utf-8'));
    console.log('\n--- 2. Resolving Payload ---', payload);

    const embedRes = await api.post(
      'https://otakudesu.blog/wp-admin/admin-ajax.php',
      qs.stringify({
        ...payload,
        nonce: nonce,
        action: action2
      }),
      { headers: HEADERS }
    );

    console.log('Resolution status:', embedRes.status);
    console.log('Resolution response keys:', Object.keys(embedRes.data));
    if (embedRes.data.data) {
      const decodedHtml = Buffer.from(embedRes.data.data, 'base64').toString('utf-8');
      console.log('Decoded HTML iframe:', decodedHtml);
    } else {
      console.log('Response data:', embedRes.data);
    }
  } catch (e) {
    console.error('Error resolving:', e.response?.data || e.message);
  }
}

resolveMirror();
