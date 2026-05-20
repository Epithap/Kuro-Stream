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
const api = axios.create({ httpsAgent, timeout: 10000 });

const fullHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
};

async function test() {
  try {
    const url = 'https://westmanga.org/manga/?status=&type=&order=update';
    console.log('Fetching', url, 'with full browser headers...');
    const res = await api.get(url, { headers: fullHeaders });
    const $ = cheerio.load(res.data);
    const title = $('title').text().trim();
    console.log('Title:', title);
    const bodyClass = $('body').attr('class') || '';
    console.log('Body Class:', bodyClass);
    const hasListupd = $('.listupd').length > 0;
    const cardsCount = $('.listupd .bs, .listupd .bsx, .list-update_item').length;
    console.log(`Success! hasListupd: ${hasListupd}, cardsCount: ${cardsCount}`);
  } catch (e) {
    console.error('Failed:', e.message);
    if (e.response) {
      console.log('Status code:', e.response.status);
    }
  }
}

test();
