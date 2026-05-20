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
        if (opt.all) cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
        else cb(null, addresses[0], 4);
      } else {
        dns.lookup(hostname, opt, cb);
      }
    })
    .catch(() => dns.lookup(hostname, opt, cb));
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent });

async function run() {
  try {
    const res = await api.get('https://komikcast.life/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);
    
    // find element containing "Populer"
    const pop = [];
    $('.serieslist ul li').each((i, el) => {
      const title = $(el).find('.leftseries h2 a').text().trim();
      if(title) pop.push(title);
    });
    
    // or .bixbox .pd-btext
    $('.pd-btext h3').each((i, el) => { pop.push($(el).text().trim()) });
    
    // komikcast sometimes uses .tt for titles
    $('.bixbox.series .tt').each((i, el) => { pop.push($(el).text().trim()) });
    
    console.log(pop);
  } catch(e) {
    console.log(e.message);
  }
}
run();
