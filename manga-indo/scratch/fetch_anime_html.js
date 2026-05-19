import axios from 'axios';
import dns from 'dns';
import https from 'https';
import fs from 'fs';

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

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
};

async function run() {
  try {
    const url = 'https://otakudesu.blog/anime/borot-sub-indo/';
    console.log('Fetching', url);
    const response = await api.get(url, { headers: HEADERS });
    fs.writeFileSync('scratch/anime_detail.html', response.data);
    console.log('Saved raw HTML to scratch/anime_detail.html');
  } catch (err) {
    console.error('Error fetching:', err.message);
  }
}

run();
