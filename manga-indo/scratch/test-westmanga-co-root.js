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

async function test() {
  try {
    const url = 'https://westmanga.co/manga/';
    console.log('Fetching', url);
    const res = await api.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(res.data);
    const title = $('title').text().trim();
    console.log('Title:', title);
    
    // Log typical manga elements on the home page
    const elements = $('.bs, .bsx, .list-update_item, article, .item, .post-item');
    console.log(`Cards found: ${elements.length}`);
    if (elements.length > 0) {
      console.log('Sample URL:', elements.first().find('a').attr('href'));
      console.log('Sample Title:', elements.first().find('h3, .tt, .title, a').text().trim());
    }
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

test();
