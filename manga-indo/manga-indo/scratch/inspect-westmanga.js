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

const url = 'https://westmanga.net/manga/?status=&type=&order=update';
const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function test() {
  try {
    const res = await api.get(url, { headers });
    const $ = cheerio.load(res.data);
    console.log('HTML Loaded. Scanning elements...');
    
    // Print body class to see WordPress theme
    console.log('Body Class:', $('body').attr('class'));
    
    // Find all post/card element classes
    const divs = new Set();
    $('div').each((i, el) => {
      const cls = $(el).attr('class');
      if (cls) {
        cls.split(/\s+/).forEach(c => divs.add(c));
      }
    });
    console.log('Unique Div classes found:', Array.from(divs).slice(0, 50));
    
    // Let's print some HTML snippets of matching elements
    console.log('--- Printing first .listupd html ---');
    console.log($('.listupd').html()?.slice(0, 1000) || 'No .listupd element found!');
    
    console.log('--- Scanning a elements inside wrapper ---');
    $('a').slice(0, 30).each((i, el) => {
      console.log(`Link: href="${$(el).attr('href')}" title="${$(el).attr('title') || $(el).text().trim()}"`);
    });
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

test();
