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
const api = axios.create({ httpsAgent });

const BASE_URL = 'https://westmanga.site';

const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
});

const runDetailTest = async () => {
  const slug = 'solo-leveling';
  const url = `${BASE_URL}/manga/${slug}/`;
  console.log(`Fetching detail from URL: ${url}`);
  try {
    const response = await api.get(url, { headers: getHeaders() });
    console.log(`Status: ${response.status}`);
    const $ = cheerio.load(response.data);
    
    const title = $('h1').first().text().trim();
    console.log(`Title found: "${title}"`);
    
    const coverUrl = $('.thumb img, .thumbook img, .post-thumbnail img').first().attr('data-src') || $('.thumb img, .thumbook img, .post-thumbnail img').first().attr('src') || '';
    console.log(`Cover URL found: "${coverUrl}"`);
    
    const synopsis = $('.entry-content, .sinopsis, .description').text().trim();
    console.log(`Synopsis length: ${synopsis.length}`);
    console.log(`Synopsis preview: "${synopsis.substring(0, 100)}"`);
    
    const status = $('.imptdt:contains("Status") i').text().trim() || 'Unknown';
    console.log(`Status found: "${status}"`);
    
    const tags = [];
    $('.mgen a, .genres-content a').each((i, el) => {
      tags.push($(el).text().trim());
    });
    console.log(`Tags found:`, tags);
  } catch (err) {
    console.error(`ERROR FETCHING DETAIL:`, err.stack);
  }
};

runDetailTest();
