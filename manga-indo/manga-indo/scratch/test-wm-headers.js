import puppeteer from 'puppeteer-core';
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
const api = axios.create({ httpsAgent, timeout: 20000 });

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  // Set viewport to desktop
  await page.setViewport({ width: 1280, height: 800 });
  
  // Log page console messages
  page.on('console', msg => {
    console.log(`PAGE LOG [${msg.type()}]:`, msg.text());
  });
  
  await page.setRequestInterception(true);
  
  page.on('request', async req => {
    const url = req.url();
    const resourceType = req.resourceType();
    
    if (url.includes('mantweh.online')) {
      console.log(`[REQ INTERCEPTED] ${url}`);
      console.log('Original Headers:', JSON.stringify(req.headers(), null, 2));
      try {
        const headers = { ...req.headers() };
        // Delete host header
        delete headers['host'];
        
        const res = await api({
          method: req.method(),
          url: url,
          headers: headers,
          data: req.postData()
        });
        
        console.log(`[SUCCESS FULFILLED] ${url} -> status ${res.status}`);
        
        // Clean headers to make sure they are objects with string values
        const resHeaders = {};
        for (const [k, v] of Object.entries(res.headers)) {
          if (v !== undefined && v !== null) {
            resHeaders[k] = String(v);
          }
        }

        await req.respond({
          status: res.status,
          headers: resHeaders,
          body: typeof res.data === 'object' ? JSON.stringify(res.data) : res.data
        });
      } catch (err) {
        console.error(`[FAILED TO FULFILL] ${url}:`, err.message);
        if (err.response) {
          console.error(`Status: ${err.response.status}, Data:`, err.response.data);
        }
        await req.abort();
      }
    } else {
      if (resourceType === 'document' || resourceType === 'script' || resourceType === 'xhr' || resourceType === 'fetch') {
        console.log(`[REQ] ${resourceType.toUpperCase()}: ${url}`);
      }
      req.continue();
    }
  });
  
  console.log('Navigating to https://westmanga.co/...');
  try {
    await page.goto('https://westmanga.co/', { waitUntil: 'load', timeout: 30000 });
    console.log('Page loaded. Waiting 15s for dynamic requests...');
    await new Promise(resolve => setTimeout(resolve, 15000));
  } catch (err) {
    console.error('Navigation error:', err.message);
  }
  await browser.close();
}

run();
