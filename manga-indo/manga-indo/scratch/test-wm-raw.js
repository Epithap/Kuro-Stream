import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns';
import https from 'https';

const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const customLookup = (hostname, options, callback) => {
  const cb = typeof options === 'function' ? options : callback;
  const opt = typeof options === 'object' ? options : {};
  resolver.resolve4(hostname)
    .then(addresses => {
      if (addresses && addresses.length > 0) {
        if (opt.all) {
          cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
        } else {
          cb(null, addresses[0], 4);
        }
      } else {
        dns.lookup(hostname, opt, cb);
      }
    })
    .catch(() => dns.lookup(hostname, opt, cb));
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

async function test() {
  const url = 'https://data.mantweh.online/api/contents/home-data';
  try {
    const res = await api.get(url, {
      headers: {
        'Origin': 'https://westmanga.co',
        'Referer': 'https://westmanga.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    console.log('API call succeeded!');
    console.log('Keys in data:', Object.keys(res.data.data));
    console.log('Sample mirror_update:', res.data.data.mirror_update[0]);
  } catch (e) {
    console.error('Fetch Error:', e.message);
    if (e.response) {
      console.log('Response Status:', e.response.status);
      console.log('Response Data:', e.response.data);
    }
  }
}
test();
