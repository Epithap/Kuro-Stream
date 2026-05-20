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
  
  const jsDir = 'scratch/js_files';
  if (!fs.existsSync(jsDir)) {
    fs.mkdirSync(jsDir, { recursive: true });
  }

  page.on('request', req => req.continue());
  
  page.on('response', async res => {
    const url = res.url();
    if (url.includes('.js')) {
      try {
        const text = await res.text();
        const filename = path.basename(url).split('?')[0];
        fs.writeFileSync(path.join(jsDir, filename), text);
        console.log(`Saved: ${filename} (${text.length} chars)`);
      } catch (e) {
        // Ignored
      }
    }
  });

  console.log('Navigating to westmanga.co...');
  await page.goto('https://westmanga.co/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Scanning saved JS files...');
  const files = fs.readdirSync(jsDir);
  for (const f of files) {
    const filePath = path.join(jsDir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('x-wm-request-signature') || content.includes('Signature') || content.includes('x-wm-accses-key')) {
      console.log(`\n*** TARGET FOUND IN FILE: ${f} ***`);
      
      // Let's search for how x-wm-request-signature is set
      const regexSig = /x-wm-request-signature["']?\s*:\s*([a-zA-Z0-9_\(\)\{\}\[\]\+\-\*\/\s\.,&=|<>!~%:\?^]+)/g;
      let match;
      while ((match = regexSig.exec(content)) !== null) {
        console.log('Found Signature Generation Code:', match[0]);
      }
      
      // Look for the headers configuration block
      const idx = content.indexOf('x-wm-request-signature');
      if (idx !== -1) {
        console.log('Context:', content.substring(Math.max(0, idx - 400), Math.min(content.length, idx + 400)));
      }
    }
  }

  await browser.close();
}

run();
