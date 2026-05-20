import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

async function check(domain) {
  try {
    const url = `https://${domain}/`;
    const res = await axios.get(url, {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    console.log(`[SUCCESS] ${domain} - Title: ${$('title').text().trim()}`);
    // Check if there is actual content or if it's a redirect / blocked landing page
    if (res.data.includes('Internet Positif') || res.data.includes('indihome') || res.data.includes('trustpositif')) {
      console.log(`[BLOCKED] ${domain} is redirected to ISP Block Page`);
    }
  } catch (err) {
    console.log(`[FAILED] ${domain} - Error: ${err.message}`);
  }
}

async function run() {
  const domains = [
    'otakudesu.cloud',
    'otakudesu.cam',
    'otakudesu.tv',
    'otakudesu.ink',
    'otakudesu.io',
    'otakudesu.blog',
    'otakudesu.fit',
    'otakudesu.lol',
    'otakudesu.video',
    'otakudesu.moe'
  ];
  for (const d of domains) {
    await check(d);
  }
}
run();
