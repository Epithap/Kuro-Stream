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

async function inspectAnoboy() {
  try {
    const url = 'https://anoboy.ink/';
    const res = await api.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const $ = cheerio.load(res.data);
    
    // Find all potential anime cards
    const cardSelectors = ['.home_index a', '.amv', '.column-content a', '.anime-post', 'article', '.post-item', '.item'];
    for (const sel of cardSelectors) {
      console.log(`Selector "${sel}" count: ${$(sel).length}`);
    }
    
    // Let's print the first 5 links that have an image inside
    console.log('Links with images:');
    let count = 0;
    $('a').each((i, el) => {
      if (count >= 5) return;
      const img = $(el).find('amp-img, img');
      if (img.length > 0) {
        console.log('---');
        console.log('Href:', $(el).attr('href'));
        console.log('Title:', $(el).attr('title') || $(el).text().trim().substring(0, 50));
        console.log('Image:', img.attr('src'));
        console.log('Class:', $(el).attr('class'));
        count++;
      }
    });
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

inspectAnoboy();
