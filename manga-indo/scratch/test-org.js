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

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function test() {
  try {
    const url = 'https://westmanga.org/manga/?status=&type=&order=update';
    console.log('Fetching', url);
    const res = await api.get(url, { headers });
    const $ = cheerio.load(res.data);
    const title = $('title').text().trim();
    console.log('Title:', title);
    const bodyClass = $('body').attr('class') || '';
    console.log('Body Class:', bodyClass);
    const hasListupd = $('.listupd').length > 0;
    const cardsCount = $('.listupd .bs, .listupd .bsx, .list-update_item').length;
    console.log(`hasListupd: ${hasListupd}, cardsCount: ${cardsCount}`);
    
    // Print the first card's details if any
    if (cardsCount > 0) {
      const el = $('.listupd .bs, .listupd .bsx, .list-update_item').first();
      console.log('First card details:');
      console.log('Title text:', el.find('.tt, .title, h3').text().trim() || el.find('a').attr('title'));
      console.log('Href:', el.find('a').attr('href'));
      console.log('Img:', el.find('img').attr('data-src') || el.find('img').attr('src'));
    }
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

test();
