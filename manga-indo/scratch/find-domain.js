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

const domains = [
  'https://westmanga.info',
  'https://westmanga.cc',
  'https://westmanga.co',
  'https://westmanga.net',
  'https://westmanga.vip',
  'https://westmanga.org',
  'https://westmanga.com',
  'https://westmanga.asia',
  'https://westmanga.online',
];

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function test() {
  for (const domain of domains) {
    try {
      console.log(`Testing ${domain}...`);
      const res = await api.get(`${domain}/manga/?status=&type=&order=update`, { headers, timeout: 3000 });
      console.log(`Success! Status: ${res.status}, Length: ${res.data.length}`);
      if (res.data.includes('Redirecting...')) {
        console.log('Redirect screen found.');
      } else {
        console.log(`BINGO! ${domain} works perfectly!`);
        return;
      }
    } catch (e) {
      console.log(`Failed ${domain}: ${e.message}`);
    }
  }
}

test();
