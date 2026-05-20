import axios from 'axios';
import dns from 'dns';
import https from 'https';

const dnsCache = {};

async function resolveDoh(hostname) {
  if (dnsCache[hostname]) return dnsCache[hostname];
  try {
    // Use raw axios without custom agent to avoid recursion
    const response = await axios.get(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
      headers: { 'Accept': 'application/dns-json' },
      timeout: 5000
    });
    const answers = response.data?.Answer;
    if (answers && answers.length > 0) {
      const aRecords = answers.filter(ans => ans.type === 1).map(ans => ans.data);
      if (aRecords.length > 0) {
        dnsCache[hostname] = aRecords;
        return aRecords;
      }
    }
  } catch (err) {
    console.error(`DoH resolution failed for ${hostname}:`, err.message);
  }
  return null;
}

const customLookup = async (hostname, options, callback) => {
  const cb = typeof options === 'function' ? options : callback;
  const opt = typeof options === 'object' ? options : {};

  if (hostname === 'cloudflare-dns.com' || hostname === 'dns.google') {
    return dns.lookup(hostname, opt, cb);
  }

  try {
    const addresses = await resolveDoh(hostname);
    if (addresses && addresses.length > 0) {
      if (opt.all) {
        cb(null, addresses.map(addr => ({ address: addr, family: 4 })));
      } else {
        cb(null, addresses[0], 4);
      }
    } else {
      dns.lookup(hostname, opt, cb);
    }
  } catch (err) {
    dns.lookup(hostname, opt, cb);
  }
};

const httpsAgent = new https.Agent({ lookup: customLookup, rejectUnauthorized: false });
const api = axios.create({ httpsAgent, timeout: 10000 });

async function run() {
  try {
    console.log("Testing DoH customLookup for otakudesu.blog...");
    const res = await api.get('https://otakudesu.blog/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log("Success! Status:", res.status);
    console.log("HTML length:", res.data.length);
  } catch (e) {
    console.error("Test failed:", e.message);
  }
}
run();
