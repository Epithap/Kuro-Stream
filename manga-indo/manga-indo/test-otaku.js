import axios from 'axios';
import * as cheerio from 'cheerio';
import dns from 'dns';
import https from 'https';

const { Resolver } = dns.promises;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']);

const customLookup = async (hostname, options, callback) => {
  try {
    const addresses = await resolver.resolve4(hostname);
    if (addresses && addresses.length > 0) {
      if (options && options.all) {
        callback(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        callback(null, addresses[0], 4);
      }
    } else {
      dns.lookup(hostname, options, callback);
    }
  } catch (err) {
    dns.lookup(hostname, options, callback);
  }
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent, timeout: 20000 });

async function run() {
  try {
    const res = await api.get('https://otakudesu.blog/');
    const $ = cheerio.load(res.data);
    
    // Check sidebar / popular widgets
    console.log("=== WIDGETS ===");
    $('.widget-title, .venser h2').each((i, el) => {
      console.log("Widget:", $(el).text().trim());
    });
    
    // Check movie page URL
    const res2 = await api.get('https://otakudesu.blog/anime-list/');
    const $2 = cheerio.load(res2.data);
    console.log("\n=== Anime List Page ===");
    console.log("Found links:", $2('a:contains("Movie")').length);
    
    // Let's try searching for a movie
    const res3 = await api.get('https://otakudesu.blog/?s=movie&post_type=anime');
    const $3 = cheerio.load(res3.data);
    console.log("\n=== Movie Search ===");
    $3('.venz ul li').slice(0, 3).each((i, el) => {
      console.log($3(el).find('h2').text().trim());
    });
    
  } catch(e) {
    console.log(e.message);
  }
}
run();
