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

async function dump() {
  try {
    const url = 'https://komikcast.life/manga/komik-chichioya-kounin-hasegawasan-chi-no-oyako-kankei/';
    const response = await api.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(response.data);
    
    console.log('Title:', $('h1').first().text().trim());
    const chapters = [];
    $('#chapterlist ul li, .komik_info-chapters-item').each((i, el) => {
      chapters.push($(el).text().replace(/\s+/g, ' ').substring(0, 50));
    });
    console.log(`Found ${chapters.length} chapters.`);
    console.log('Sample chapters:', chapters.slice(0, 3));
    
    // Check if the selector is different
    const otherSelectors = ['.cl, .eplister li', '#chapter-list li', '.lchx a'];
    for (const sel of otherSelectors) {
      console.log(`Selector "${sel}" count: ${$(sel).length}`);
    }
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

dump();
