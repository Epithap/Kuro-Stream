import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  await page.setRequestInterception(true);
  
  const jsFiles = [];
  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.js')) {
      try {
        const text = await res.text();
        if (text.includes('x-wm-request-signature') || text.includes('request-time')) {
          console.log(`FOUND IN: ${url}`);
          const match = text.match(/.{0,100}x-wm-request-signature.{0,200}/gi);
          if (match) {
            console.log('Snippet:', match[0]);
          }
          
          // Let's also look for SHA256 or crypto imports in the same file
          const matchCrypto = text.match(/.{0,50}crypto.{0,50}|.{0,50}sha256.{0,50}/gi);
          if (matchCrypto) {
            console.log('Crypto Snippet:', matchCrypto[0]);
          }
          
          fs.writeFileSync('scratch/westmanga-cracked.js', text);
          console.log('Saved to scratch/westmanga-cracked.js');
        }
      } catch (e) {}
    }
  });
  
  page.on('request', req => req.continue());
  
  await page.goto('https://westmanga.co/', { waitUntil: 'networkidle0' });
  await browser.close();
}

run();
