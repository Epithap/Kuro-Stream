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
    .catch(() => dns.lookup(hostname, opt, cb));
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

async function run() {
  try {
    const res = await api.get('https://data.mantweh.online/api/framework/config', {
      headers: {
        'Origin': 'https://westmanga.co',
        'Referer': 'https://westmanga.co/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.data, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

run();
