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
  'westmanga.tv',
  'westmanga.me',
  'westmanga.site',
  'westmanga.org',
  'westmanga.info',
  'westmanga.com',
  'westmanga.fun',
  'westmanga.xyz',
  'westmanga.cc'
];

async function check(domain) {
  const url = `https://${domain}/manga/?status=&type=&order=update`;
  try {
    const res = await api.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    const bodyClass = $('body').attr('class') || '';
    const hasListupd = $('.listupd').length > 0;
    const cardsCount = $('.listupd .bs, .listupd .bsx, .list-update_item').length;
    console.log(`[${domain}] -> status: ${res.status}, bodyClass: "${bodyClass}", hasListupd: ${hasListupd}, cardsCount: ${cardsCount}`);
  } catch (e) {
    console.log(`[${domain}] -> failed: ${e.message}`);
  }
}

async function run() {
  console.log('Probing possible domains...');
  for (const d of domains) {
    await check(d);
  }
}

run();
