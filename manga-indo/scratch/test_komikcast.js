import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

async function run() {
  try {
    const url = 'https://komikcast.life/';
    const res = await axios.get(url, {
      httpsAgent: agent,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    const $ = cheerio.load(res.data);
    console.log("=== KOMIKCAST.LIFE ===");
    console.log("Status:", res.status);
    console.log("Title:", $('title').text().trim());
    console.log("Manga list count:", $('.listupd .bs, .listupd .bsx, .list-update_item').length);
  } catch (e) {
    console.error("Komikcast.life error:", e.message);
  }
}
run();
