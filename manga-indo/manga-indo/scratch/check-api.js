import axios from 'axios';
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
    .catch(err => {
      dns.lookup(hostname, opt, cb);
    });
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent });

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

async function check(url) {
  try {
    console.log(`Checking ${url}...`);
    const res = await api.get(url, { headers, timeout: 5000 });
    console.log(`Success! Status: ${res.status}, Length: ${res.data.length || (typeof res.data === 'object' ? JSON.stringify(res.data).length : 0)}`);
    console.log(typeof res.data === 'object' ? JSON.stringify(res.data).slice(0, 500) : res.data.slice(0, 500));
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
}

async function run() {
  await check('https://westmanga.fun/wp-json/wp/v2/posts');
  await check('https://westmanga.fun/feed/');
}

run();
