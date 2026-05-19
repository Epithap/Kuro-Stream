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
    .catch(err => {
      dns.lookup(hostname, opt, cb);
    });
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 6000 });

const domains = [
  'anoboy.show',
  'anoboy.ink',
  'anoboy.guru',
  'anoboy.ninja',
  'anoboy.cx',
  'anoboy.one'
];

async function check(domain) {
  const url = `https://${domain}/`;
  try {
    const res = await api.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    const title = $('title').text().trim();
    const isAnoboy = title.toLowerCase().includes('anoboy');
    const hasItems = $('.home_index a').length > 0;
    console.log(`[${domain}] -> status: ${res.status}, title: "${title}", isAnoboy: ${isAnoboy}, hasItems: ${hasItems}`);
  } catch (e) {
    console.log(`[${domain}] -> failed: ${e.message}`);
  }
}

async function run() {
  console.log('Probing possible Anoboy domains...');
  for (const d of domains) {
    await check(d);
  }
}

run();
