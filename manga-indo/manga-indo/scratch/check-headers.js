import axios from 'axios';
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

const url = 'https://westmanga.fun/manga/?status=&type=&order=update';

async function testHeaders(userAgent) {
  try {
    const res = await api.get(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://westmanga.fun/',
      },
      timeout: 5000
    });
    console.log(`User-Agent: ${userAgent.slice(0, 30)}...`);
    console.log(`Status: ${res.status}, Length: ${res.data.length}`);
    if (res.data.includes('Redirecting...')) {
      console.log('Got redirect screen.');
    } else {
      console.log('SUCCESS! Real HTML loaded!');
    }
  } catch (e) {
    console.log(`Failed: ${e.message}`);
  }
}

async function run() {
  await testHeaders('Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1');
  await testHeaders('Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
  await testHeaders('Googlebot/2.1 (+http://www.google.com/bot.html)');
}

run();
