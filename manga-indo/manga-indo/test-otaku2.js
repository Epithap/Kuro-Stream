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

const httpsAgent = new https.Agent({ lookup: customLookup, rejectUnauthorized: false });
const api = axios.create({ httpsAgent, timeout: 20000 });

async function checkDomain(domain) {
    try {
        const res = await api.get(`https://${domain}/`);
        const $ = cheerio.load(res.data);
        console.log(`=== ${domain} ===`);
        console.log("Title:", $('title').text());
        
        let onGoingCount = 0;
        $('.venz ul li').each((i, el) => {
            if($(el).find('.epz').length) onGoingCount++;
        });
        console.log("Ongoing count:", onGoingCount);
    } catch(e) {
        console.log(`Failed ${domain}: ${e.message}`);
    }
}

async function run() {
    await checkDomain('otakudesu.cloud');
    await checkDomain('otakudesu.cam');
    await checkDomain('otakudesu.tv');
    await checkDomain('otakudesu.ink');
}
run();
