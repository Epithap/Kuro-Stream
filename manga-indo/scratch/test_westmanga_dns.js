import axios from 'axios';
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
      callback(new Error(`No address found for ${hostname}`));
    }
  } catch (err) {
    dns.lookup(hostname, options, callback);
  }
};

const httpsAgent = new https.Agent({ lookup: customLookup });
const api = axios.create({ httpsAgent });

async function test() {
  const domains = [
    'https://westmanga.info',
    'https://westmanga.org',
    'https://westmanga.tv',
    'https://westmanga.site',
    'https://westmanga.me',
    'https://westmanga.fun'
  ];

  for (const domain of domains) {
    try {
      console.log(`Testing ${domain} with custom DNS...`);
      const res = await api.get(domain, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        },
        timeout: 10000
      });
      console.log(`✅ ${domain} -> Status: ${res.status}, Length: ${res.data.length}`);
      const titleMatch = res.data.match(/<title>([^<]+)<\/title>/i);
      console.log(`   Title: ${titleMatch ? titleMatch[1] : 'No Title'}`);
    } catch (e) {
      console.log(`❌ ${domain} -> Error: ${e.message}`);
    }
  }
}

test();
